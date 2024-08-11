exports.message = (req, res, next) => {
    res.locals.messages = req.flash();
    console.log(res.locals.messages)
    next();
}