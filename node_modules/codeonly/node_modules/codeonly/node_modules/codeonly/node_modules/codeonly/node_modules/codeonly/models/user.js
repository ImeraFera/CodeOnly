const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    password: { type: String, required: true },
    company: String,
    bio: String,
    email: { type: String, required: true, unique: true },
    img: String,
    score: Number,
    placed: String,
    socialLinks: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialLink' },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    isBanned: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;