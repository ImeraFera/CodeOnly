const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    roleType: String,
})

module.exports = mongoose.model('Role', roleSchema);