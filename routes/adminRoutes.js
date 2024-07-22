const express = require('express');
const router = express.Router();



router.get("/new-project", (req, res) => {
    res.render('admin/new-project');
})


router.get("/", (req, res) => {
    res.render('admin/admin-home');
})

router.post("/new-project", (req, res) => {
    console.log(req.body);
    res.redirect('/admin-panel');
})





module.exports = router;