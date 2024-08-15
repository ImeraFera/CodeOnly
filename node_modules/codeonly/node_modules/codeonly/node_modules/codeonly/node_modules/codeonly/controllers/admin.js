let activePage = {
    name: "",
};

const Category = require('../models/category');
const Comment = require('../models/comment');
const Project = require('../models/project');
const User = require('../models/user');


exports.postDeleteProject = async (req, res) => {

    const projectId = req.params.project_id;

    try {

        const project = await Project.findById(projectId).populate({
            path: 'category',
        });

        await Category.findOneAndUpdate({
            _id: project.category._id,
        }, {
            $inc: { numberOfProjects: -1 },
        })

        await Comment.deleteMany({
            project: project._id,
        })

        await Project.deleteOne({
            _id: projectId,
        })

        return res.redirect('/admin-panel/project-list')

    } catch (error) {
        console.log(error);
    }

}

exports.getFollowing = (req, res) => {
    activePage.name = "following";
    res.render('admin/following', { activePage });
}

exports.getToDo = (req, res) => {
    activePage.name = "to-do";
    res.render('admin/to-do', { activePage });
}

exports.getNewProject = async (req, res) => {

    const categories = await Category.find({}, 'name _id');

    activePage.name = "new-project";
    res.render('admin/new-project', { activePage, categories, });
}

exports.getProjectList = async (req, res) => {


    try {

        const projects = await Project.find({
            author: res.locals.user._id,
        }).populate({
            path: 'category',
        });

        activePage.name = "project-list";
        return res.render('admin/project-list', { activePage, projects });

    } catch (error) {
        console.log(error);
    }

}

exports.getHome = async (req, res) => {
    activePage.name = "home";

    try {

        const user = res.locals.user;

        const userScore = await User.findOne({
            _id: res.locals.user._id,
        }).select('score')


        const bestProject = await Project.aggregate([
            {
                $addFields: {
                    whoLikesCount: { $size: "$whoLikes" }
                }
            },
            {
                $sort: {
                    whoLikesCount: -1
                }
            },
            {
                $limit: 1
            },
            {
                $project: {
                    title: 1,
                    whoLikesCount: 1
                }
            }
        ]);


        const data = {
            bestProject,
            userScore,
            user
        }

        return res.render('admin/admin-home', { activePage, data });

    } catch (error) {

        console.log(error);

    }

}

exports.getProfileSettings = (req, res) => {
    activePage.name = "profile-settings";
    res.render('admin/profile-settings', { activePage });
}

exports.postNewProject = async (req, res) => {


    let { title, keywords, desc, content, date, category } = req.body;

    keywords = keywords.split(',');
    keywords = keywords.map(keyword => keyword.trim());
    // console.log(typeof keywords)
    try {

        const newProject = new Project({
            title,
            keywords,
            desc,
            content,
            releaseDate: date,
            author: res.locals.user._id,
            category,
            isActive: true,
        })
        // console.log(newProject);

        await newProject.save();

        await Category.updateOne({
            _id: category,

        }, {
            $inc: { numberOfProjects: 1 },
        })

        return res.redirect('/admin-panel/project-list')


    } catch (error) {
        console.log(error)
    }




}

exports.getEditProject = async (req, res) => {
    activePage.name = "projectList";

    const projectId = req.params.project_id;
    const userId = res.locals.user._id;
    activePage = "";
    try {

        const project = await Project.findOne({
            author: userId,
            _id: projectId,
        })

        const categories = await Category.find();

        return res.render('admin/edit-project', { project, activePage, categories })

    } catch (error) {
        console.log(error);
    }
}

exports.postEditProject = async (req, res) => {

    const projectId = req.params.project_id;
    let { title, keywords, desc, content, date, category, isActive } = req.body;

    keywords = keywords.split(',');
    keywords = keywords.map(keyword => keyword.trim());

    try {

        const project = await Project.findById(projectId)


        if (project.category !== category) {
            await Category.updateOne({
                _id: project.category,
            }, {
                $inc: { numberOfProjects: -1 },
            })

            await Category.updateOne({
                _id: category,
            }, {
                $inc: { numberOfProjects: +1 },
            })
        }

        await Project.findOneAndUpdate({
            _id: projectId,
        }, {
            title,
            keywords,
            desc,
            content,
            releaseDate: date,
            category: (project.category !== category) ? category : project.category,
            isActive: (isActive) ? true : false,
        })

        req.flash('success', 'Project is updated successfully');
        return res.redirect('/admin-panel/project-list')

    } catch (error) {
        console.log(error)
    }


}

