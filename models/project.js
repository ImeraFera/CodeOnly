const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({

    title: String,
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    keywords: [],
    releaseDate: String,
    content: String,
    likes: Number,
    whoLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    score: Number,
    isActive: Boolean,

})

module.exports = mongoose.model('Project', projectSchema);