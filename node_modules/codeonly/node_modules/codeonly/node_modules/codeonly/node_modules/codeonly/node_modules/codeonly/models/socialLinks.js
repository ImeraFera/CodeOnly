const mongoose = require('mongoose');

const socialLinkSchema = mongoose.Schema({
    name: String,
    url: String,
});


module.exports = mongoose.model('SocialLink', socialLinkSchema);
