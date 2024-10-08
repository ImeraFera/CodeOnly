const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: String,
    img: String,
    numberOfProjects: Number,
    url: String,
    id1: String,
    id2: String,
})

module.exports = mongoose.model('Category', categorySchema);