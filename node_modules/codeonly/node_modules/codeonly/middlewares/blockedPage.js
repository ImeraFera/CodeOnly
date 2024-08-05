exports.blockedPage = (req, res, next) => {
    if (req.method === 'GET') {
        return res.redirect('/');
    }
    next();
};