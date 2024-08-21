const mongoose = require('mongoose');

const socialLinkSchema = mongoose.Schema({
    linkedin: String,
    instagram: String,
    website: String,
    twitter: String,
    github: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});


module.exports = mongoose.model('SocialLink', socialLinkSchema);
