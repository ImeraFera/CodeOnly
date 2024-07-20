const express = require('express');
const router = express.Router();
const progLangs = require('../temp/progLangs');
const codes = require('../temp/codes');



router.get("/code-details/:code_id", (req, res) => {
    const codeDetails = codes.find(code => code.id == req.params.code_id);

    if (codeDetails) {
        res.render('user/code-details', { codeDetails });
    } else {
        res.status(404).send('Code not found');
    }
});



router.get("/code-list/:category_name", (req, res) => {
    const progLang = progLangs.find((progLang) => (progLang.name == req.params.category_name))
    const filteredCodes = codes.filter((code) => code.lang == req.params.category_name)
    res.render('user/code-list', { progLang, filteredCodes });
});


router.get("/login", (req, res) => {
    res.render('user/login');
})


router.get("/logout", (req, res) => {
    res.render('user/login');
})


router.get("/register", (req, res) => {
    res.render('user/register');
})


router.get("/categories", (req, res) => {
    res.render('user/categories');
})

router.get("/my-cart", (req, res) => {
    res.render('user/my_cart');
})

router.get("/", (req, res) => {
    res.render('user/home');
})



module.exports = router;