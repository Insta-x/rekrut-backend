const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated())
        next(new ExpressError("You must log in first", 401));
    next();
}

module.exports.isUser = async (req, res, next) => {
    const { id } = req.params;
    if (!req.user._id.equals(id))
        next(new ExpressError('You are not authorized', 401));
    next();
}
