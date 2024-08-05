const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    whoSend: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    whoLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    content: String,
    date: String,
    likes: Number,
    score: Number,
})

module.exports = mongoose.model('Comment', commentSchema);