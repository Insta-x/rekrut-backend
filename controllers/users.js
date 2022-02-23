const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');

const changeUsername = err => err.message.replace('username', 'email');

module.exports.register = async (req, res, next) => {
    try {
        const { password } = req.body;
        const user = new User({ ...req.body });
        await User.register(user, password);
        const { hash, salt, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (e) {
        return next(new ExpressError(changeUsername(e), 400));
    }
}

module.exports.login = (req, res, next) => {
    passport.authenticate('local', function(err, user, info){
        if (err) return next(err);
        if (!user) return next(new ExpressError(changeUsername(info), 401));
        req.login(user, err => {
            if (err) return next(err);
            const { hash, salt, ...userData } = user._doc;
            return res.status(200).json(userData);
        })
    })(req, res, next);
}
