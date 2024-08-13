const express = require('express');
const router = express.Router();


// * Controllers
const { getFollowing, getProfileSettings, getToDo, getNewProject, getProjectList, postNewProject, getHome, postDeleteProject, getEditProject, postEditProject } = require('../controllers/admin');

// * Middlewares
const { isAuth } = require('../middlewares/auth');


router.post('/delete-project/:project_id', isAuth, postDeleteProject)

router.get('/edit-project/:project_id', isAuth, getEditProject)

router.post('/edit-project/:project_id', isAuth, postEditProject)

router.get("/following", isAuth, getFollowing);

router.get("/to-do", isAuth, getToDo)

router.get("/profile-settings", isAuth, getProfileSettings)

router.get("/new-project", isAuth, getNewProject)

router.get("/project-list", isAuth, getProjectList)

router.post("/new-project", isAuth, postNewProject)

router.get("/", isAuth, getHome)


module.exports = router;