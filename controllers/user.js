const User = require('../models/user');
const Category = require('../models/category');



exports.categoryList = async (req, res) => {

    const categories = await Category.find();
    res.render('user/categories', { categories });

}