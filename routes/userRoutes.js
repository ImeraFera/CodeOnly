const express = require('express');
const router = express.Router();

// * temp datas
const progLangs = require('../temp/progLangs');
const codes = require('../temp/codes');

// * Controllers
const userController = require('../controllers/user');



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

router.post("/register", async (req, res) => {

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordRepeat: req.body.passwordRepeat
    }

    if (newUser.name.length >= 3 && newUser.password.length >= 8 && newUser.passwordRepeat == newUser.password
        && newUser.email
    ) {
        console.log("Kayıt Başarılı");
        res.render('user/home', { newUser });
    } else {
        console.log('hata');
        console.log(newUser)
    }

})


router.get("/categories", userController.categoryList)

router.get("/my-cart", (req, res) => {
    res.render('user/my_cart');
})

router.get("/", (req, res) => {
    res.render('user/home');
})



module.exports = router;