const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    title: String,
})

module.exports = mongoose.model('Role', roleSchema);