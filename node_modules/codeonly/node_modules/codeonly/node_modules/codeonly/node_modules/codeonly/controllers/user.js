const User = require('../models/user');
const Category = require('../models/category');
const Project = require('../models/project');
const Comment = require('../models/comment');
const Filter = require('bad-words');
const filter = new Filter();
const Joi = require('joi');
const showdown = require('showdown');

var sendCommentPoint = 5;
var likeCommentPoint = 7;
var likeProjectPoint = 10;

exports.postFollow = async (req, res) => {
    const userId = req.params.user_id;
    const currentUser = res.locals.user || null;

    if (!currentUser) {
        req.flash("error", "You must login.")
        return res.redirect('/login');
    }

    if (currentUser.following.includes(userId)) {
        req.flash("error", "You are already following this user")
        return res.redirect('/profile/' + userId)
    }

    try {

        await User.updateOne(
            {
                _id: currentUser._id,
            },
            {
                $addToSet: {
                    following: userId,
                }
            }
        )

        req.flash("success", "You are following!")
        return res.redirect('/profile/' + userId)
    } catch (error) {
        console.log(error)
    }
}

exports.getProfile = async (req, res) => {

    const userId = req.params.user_id;
    const currentUser = res.locals.user || null;

    if (!currentUser && !userId) {
        req.flash("error", "We can not find you want to go.")
        return res.redirect('/');
    }

    const converter = new showdown.Converter();

    try {
        const user = await User.findOne({
            _id: userId,
        })
        const projects = await Project.find({
            author: user._id

        })

        user.bio = converter.makeHtml(user.bio);

        const data = {
            user,
            projects,
            currentUser,
        }

        return res.render('user/profile', data);
    } catch (error) {
        console.log(error)
    }


}

exports.getLikeProject = async (req, res) => {
    res.redirect('/code-details' + req.params.project_id)
}

exports.postLikeProject = async (req, res) => {

    const projectId = req.params.project_id;
    const whoLike = res.locals.user._id;

    try {
        const project = await Project.findOne({
            _id: projectId,
        })

        if (project.whoLikes.includes(whoLike)) {
            req.flash("error", "You already liked this project")
            return res.redirect('/code-details/' + projectId);
        }

        await Project.findOneAndUpdate({
            _id: projectId,
            $push: { whoLikes: whoLike }
        })

        const user = await User.findOneAndUpdate({
            _id: whoLike,
            $inc: { score: likeProjectPoint },
        }

        );

        req.flash("success", "You have liked the project. Earnd " + likeProjectPoint + " points!")
        return res.redirect('/code-details/' + req.params.project_id);

    } catch (error) {
        console.log(error)
        req.flash("error", error);
        return res.redirect('/code-details/' + req.params.project_id);
    }

}

exports.getComment = async (req, res) => {
    res.redirect('/code-details' + req.params.project_id)
}

exports.postComment = async (req, res) => {

    const projectId = req.params.project_id;
    const whoSend = res.locals.user._id;
    const content = req.body.content;

    if (filter.isProfane(content)) {
        console.log('The Bad Words was cleaned');
    }


    const schema = Joi.object({
        project: Joi.string().required().messages({
            'string.base': 'The project ID should be a string.',
            'any.required': 'The project ID is required.'
        }),

        content: Joi.string().min(1).max(500).required().messages({
            'string.base': 'Content should be a string.',
            'string.min': 'Content should be at least {#limit} characters long.',
            'string.max': 'Content should be at most {#limit} characters long.',
            'any.required': 'Content is required.',
            'string.empty': 'Content must not be empty.'
        })

    });

    const sentComment = {
        whoSend: whoSend,
        project: projectId,
        content: content,
        date: new Date().toLocaleDateString('en-CA')
    };

    const { error } = schema.validate({
        project: sentComment.project,
        content: sentComment.content
    });

    if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/code-details/' + projectId)
    }

    try {
        const comment = await Comment.create(sentComment);

        const project = await Project.findOneAndUpdate(
            { _id: projectId },
            {
                $push: { comments: comment._id }
            },
            { new: true }
        );

        const user = await User.findOneAndUpdate(
            { _id: whoSend },
            {
                $inc: { score: sendCommentPoint }
            },
            { new: true }
        );

        req.flash('success', 'Comment Successfully Submitted. You earned ' + sendCommentPoint + " Points!");
        return res.redirect('/code-details/' + projectId);

    } catch (error) {
        console.error("Error submitting comment:", error);

        req.flash('error', 'Failed to submit comment');
        return res.redirect('/code-details/' + projectId);
    }
}

exports.getLikeComment = async (req, res) => {
    res.redirect('/code-details' + req.params.project_id)
}

exports.postLikeComment = async (req, res) => {

    const commentId = req.params.comment_id;
    const whoLike = res.locals.user;
    try {

        const comment = await Comment.findOne({
            _id: commentId,
        });

        if (comment.whoLikes.includes(whoLike._id)) {
            req.flash("error", "You already liked this comment.")
            return res.redirect('/code-details/' + comment.project._id);
        }

        await Comment.findOneAndUpdate(
            { _id: commentId },
            {
                $push: { whoLikes: whoLike._id }
            },
            { new: true }
        );

        const user = await User.findOneAndUpdate(
            {
                _id: whoLike._id
            },
            {
                $inc: { score: likeCommentPoint }
            },
            { new: true }
        )



        req.flash("success", "You liked this comment. Earned " + likeCommentPoint + " points!")
        return res.redirect('/code-details/' + comment.project._id);

    } catch (error) {
        console.log(error)
    }

}

exports.getProject = async (req, res) => {

    const projectId = req.params.project_id;

    try {
        const project = await Project.findOne({ _id: projectId })
            .populate({
                path: 'author',
                select: 'name img socialLinks projects'
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'whoSend',
                    select: 'name'
                }
            }).populate({
                path: 'category',
                select: 'name'
            })

        const moreProjects = await Project.find({
            _id: { $ne: projectId },
            isActive: true,
            releaseDate: { $lte: new Date().toISOString().split('T')[0] }
        }).limit(5);


        let user = null;
        if (res.locals.user) {
            user = res.locals.user;
        }

        if (project.author.img == null) {
            project.author.img = 'user_default.png'
        }
        return res.render('user/code-details', { project, user, moreProjects });
    } catch (error) {
        console.log(error)
        // res.redirect('/');

    }

}

exports.getHome = async (req, res) => {

    try {

        const topUsers = await User.find().sort({ score: -1 }).limit(3);

        // console.log(topUsers)

        if (topUsers.length > 3) {
            topUsers[0].placed = 'first';
            topUsers[1].placed = 'second';
            topUsers[2].placed = 'third';
        }


        function shiftRight(arr) {
            if (arr.length > 0) {
                const last = arr.pop();
                arr.unshift(last);
            }
        }

        shiftRight(topUsers);

        const projects = await Project.find().sort({ date: -1 }).limit(4);
        const randomProjects = await Project.aggregate([
            { $sample: { size: 10 } }
        ]);
        return res.render('user/home', { topUsers, projects, randomProjects });

    } catch (error) {
        console.log(error)
    }

}

exports.getCategories = async (req, res) => {

    const categories = await Category.find();
    res.render('user/categories', { categories });

}

exports.getCodeList = async (req, res) => {

    const category = req.params.category_name;
    try {

        const findedCategory = await Category.findOne({
            url: category
        });

        if (!findedCategory) {
            return res.render('errors/404', { message: 'This Category Does Not Exist' });
        }

        if (findedCategory.numberOfProjects == 0) {
            return res.render('errors/404', { message: 'This Category Has No Projects' });
        }

        const projects = await Project.find({
            category: findedCategory._id,
            isActive: true,
            releaseDate: { $lte: new Date().toISOString().split('T')[0] }

        }).populate('category').populate({
            path: 'author',
            select: 'name'
        })


        if (projects.length == 0) {
            res.redirect('/');
            return;
        }

        res.render('user/code-list', { projects });


    } catch (error) {
        console.log(error)
        return;
    }

}

exports.get404 = (req, res) => {
    res.render('errors/404');
}
