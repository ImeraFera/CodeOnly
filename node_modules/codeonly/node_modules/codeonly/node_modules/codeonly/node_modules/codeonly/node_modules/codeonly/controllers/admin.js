let activePage = {
    name: "",
};

exports.getFollowing = (req, res) => {
    activePage.name = "following";
    res.render('admin/following', { activePage });
}

exports.getToDo = (req, res) => {
    activePage.name = "to-do";
    res.render('admin/to-do', { activePage });
}

exports.getNewProject = (req, res) => {
    activePage.name = "new-project";
    res.render('admin/new-project', { activePage });
}

exports.getProjectList = (req, res) => {
    activePage.name = "project-list";
    res.render('admin/project-list', { activePage });
}

exports.getHome = (req, res) => {
    activePage.name = "home";
    res.render('admin/admin-home', { activePage });
}

exports.getProfileSettings = (req, res) => {
    activePage.name = "profile-settings";
    res.render('admin/profile-settings', { activePage });
}

exports.postNewProject = (req, res) => {
    // console.log(req.body);
    res.redirect('/admin-panel');
}