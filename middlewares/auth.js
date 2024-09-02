exports.isAuth = (req, res, next) => {

    if (!req.session.isAuth) {
        return res.redirect('/login?returnUrl=' + req.originalUrl);
    }

    next();
}
