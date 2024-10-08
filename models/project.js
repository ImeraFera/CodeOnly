const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({

    title: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    desc: String,
    keywords: [],
    releaseDate: String,
    content: String,
    likes: Number,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    whoLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    score: Number,
    isActive: Boolean,

})

module.exports = mongoose.model('Project', projectSchema);