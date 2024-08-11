const express = require('express');
const router = express.Router();

// * Middlewares
const { message } = require('../middlewares/messages');



// * Controllers
const { getProject, getCodeList, getCategories, getHome, getMyProfile, postComment, postLikeProject, postLikeComment, get404 } = require('../controllers/user');
const { getRegister, postRegister, postLogin, getLogin, getLogout } = require('../controllers/auth');
const { isAuth } = require('../middlewares/auth');
const { blockedPage } = require('../middlewares/blockedPage');


// * Project Page
router.get("/code-details/:project_id", message, getProject);

// * Project Like Subpage
router.post("/postLikeComment/:comment_id/:project_id", isAuth, postLikeComment)
router.get("/postLikeComment/:comment_id/:project_id", isAuth, (req, res, next) => {
    return res.redirect('/code-details/' + req.params.project_id);
});
router.post("/postLikeProject/:project_id", isAuth, postLikeProject)
router.get("/postLikeProject/:project_id", isAuth, (req, res, next) => {
    return res.redirect('/code-details/' + req.params.project_id);
});
router.post("/postComment/:project_id", isAuth, postComment)
router.get("/postComment/:project_id", isAuth, (req, res, next) => {
    return res.redirect('/code-details/' + req.params.project_id);
});




// * Code-List Page
router.get("/code-list/:category_name", getCodeList);

// * Profile Page
router.get("/my-profile", getMyProfile)

// * Login Page
router.get("/login", message, getLogin)
router.post("/login", postLogin)

// * Logout Page
router.get("/logout", getLogout)

// * Register Page
router.get("/register", message, getRegister)
router.post("/register", postRegister)

// * Categories Page
router.get("/categories", getCategories)

// * Home Page
router.get("/", getHome)

// * 404 Page
router.get("/404", get404)



module.exports = router;