
const Category = require('../models/category');
const Comment = require('../models/comment');
const Project = require('../models/project');
const User = require('../models/user');
const SocialLink = require('../models/socialLinks');
const Role = require('../models/role');

const { removeOldFile } = require('../helpers/removeOldFile');
const { mongoose } = require('mongoose');

exports.logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}

exports.getDeleteFollowing = async (req, res) => {
    const deleteFollowingUserId = req.params.user_id;
    const currentUserId = res.locals.user._id;
    try {
        const response = await User.findOneAndUpdate(
            {
                _id: currentUserId
            },
            {
                $pull: {
                    following: deleteFollowingUserId,
                }
            },
            { new: true }
        )
        console.log(response)
        return res.redirect('/admin-panel/following')
    } catch (error) {
        console.log(error);
    }


}

exports.getFollowing = async (req, res) => {


    try {
        const user = await User
            .findOne({
                _id: res.locals.user._id,
            })
            .populate({
                path: 'role',
                select: 'roleType'
            })
            .populate({
                path: 'following',
                select: 'name email'
            })

        const data = {
            user,
        }

        console.log(data.user.following);

        return res.render('admin/following', { data });
    } catch (error) {
        console.log(error)
    }


}

exports.getComments = async (req, res) => {

    try {
        const user = await User.findOne({
            _id: res.locals.user._id,
        }).populate({
            path: 'role',
            select: 'roleType'
        })

        const projects = await Project.find({
            author: res.locals.user._id,
        }).select('comments');


        const commentIds = projects.flatMap(project => project.comments);

        const comments = await Comment.find({
            _id: { $in: commentIds }
        }).populate({
            path: 'whoSend',
            select: 'name',
        }).populate({
            path: 'project',
            select: 'title'
        }).select(' date content project whoSend')

        console.log(comments)

        const data = {
            user,
            comments,
        }
        return res.render('admin/comments', { data });

    } catch (error) {
        console.log(error);
    }


}

exports.getToDo = async (req, res) => {

    try {
        const user = await User.findOne({
            _id: res.locals.user._id,
        }).populate({
            path: 'role',
            select: 'roleType'
        })
        const data = {
            user,
        }
        return res.render('admin/to-do', { data });
    } catch (error) {

    }


}

exports.getNewProject = async (req, res) => {

    try {
        const categories = await Category.find({}, 'name _id');
        const user = await User.findOne({
            _id: res.locals.user._id,
        }).populate({
            path: 'role',
            select: 'roleType'
        })

        const data = {
            categories,
            user,
        }

        return res.render('admin/new-project', { data });
    } catch (error) {

    }


}

exports.getProjectList = async (req, res) => {
    try {

        const user = await User.findOne({
            _id: res.locals.user._id,
        }).populate({
            path: 'role',
            select: 'roleType'
        })

        const projects = await Project.find({
            author: res.locals.user._id,
        }).populate({
            path: 'category',
        });

        const data = {
            projects,
            user,
        }

        return res.render('admin/project-list', { data });

    } catch (error) {
        console.log(error);
    }

}

exports.getEditProject = async (req, res) => {

    const projectId = req.params.project_id;
    const userId = res.locals.user._id;
    try {
        const user = await User.findOne({
            _id: res.locals.user._id,
        }).populate({
            path: 'role',
            select: 'roleType'
        })

        const project = await Project.findOne({
            author: userId,
            _id: projectId,
        })

        const categories = await Category.find();

        const data = {
            categories,
            project,
            user,
        }

        return res.render('admin/edit-project', { data })

    } catch (error) {
        console.log(error);
    }
}
exports.getHome = async (req, res) => {

    try {
        const user = await User.findOne({
            _id: res.locals.user._id,
        }).populate({
            path: 'role',
            select: 'roleType'
        })


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

        const projects = await Project.find({
            author: res.locals.user._id,
        }).select('comments');

        const commentIds = projects.flatMap(project => project.comments);

        const bestComments = await Comment.find({
            _id: { $in: commentIds }
        })
            .populate({
                path: 'whoSend',
                select: 'name img'
            })
            .limit(10);



        const data = {
            bestProject,
            userScore,
            user,
            bestComments
        }

        return res.render('admin/admin-home', { data });

    } catch (error) {

        console.log(error);

    }

}

exports.getProfileSettings = async (req, res) => {


    try {

        const socialLinks = await SocialLink.findOne({
            user: res.locals.user._id,
        })

        const user = await User.findOne({
            _id: res.locals.user._id,
        }).populate({
            path: 'role',
            select: 'roleType'
        })

        const data = { socialLinks, user }


        return res.render('admin/profile-settings', { data });

    } catch (error) {
        console.log(error);
    }


}

exports.postProfileSettings = async (req, res) => {

    const { name, company, bio, linkedin, website, github, twitter, instagram } = req.body;
    let newImg;

    try {


        if (req.file && req.file.filename) {
            newImg = req.file.filename;
            const oldImg = await User.findOne({
                _id: res.locals.user._id,
            }).select('img');
            removeOldFile(oldImg.img);
        }
        else {
            newImg = res.locals.user.img;
        }

        const user = await User.findOne({
            _id: res.locals.user._id,
        }).populate({
            path: 'socialLinks',
        })

        if ((name !== user.name) || (company !== user.company) || (bio !== user.bio) || (newImg !== user.img)) {
            await User.findByIdAndUpdate(user._id, {
                name,
                company,
                bio,
                img: newImg,
            });
        }

        if ((linkedin !== user.socialLinks.linkedin) ||
            (twitter !== user.socialLinks.twitter) ||
            (instagram !== user.socialLinks.instagram) ||
            (github !== user.socialLinks.github) ||
            (website !== user.socialLinks.website)) {

            await SocialLink.findOneAndUpdate(
                { user: user._id },
                {
                    linkedin,
                    website,
                    github,
                    twitter,
                    instagram,
                }
            );
        }

        return res.redirect('/admin-panel/profile-settings')

    } catch (error) {
        console.log(error);
    }

};

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

