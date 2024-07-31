const express = require('express');
const router = express.Router();
let activePage = {
    name: "",
};

router.get("/following", (req, res) => {
    activePage.name = "following";
    res.render('admin/following', { activePage });
})

router.get("/to-do", (req, res) => {
    activePage.name = "to-do";
    res.render('admin/to-do', { activePage });
})


router.get("/profile-settings", (req, res) => {
    activePage.name = "profile-settings";
    res.render('admin/profile-settings', { activePage });
})

router.get("/new-project", (req, res) => {
    activePage.name = "new-project";
    res.render('admin/new-project', { activePage });
})


router.get("/project-list", (req, res) => {
    activePage.name = "project-list";
    res.render('admin/project-list', { activePage });
})


router.get("/", (req, res) => {
    activePage.name = "home";
    res.render('admin/admin-home', { activePage });
})

router.post("/new-project", (req, res) => {
    console.log(req.body);
    res.redirect('/admin-panel');
})


module.exports = router;