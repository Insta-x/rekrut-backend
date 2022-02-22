const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');

module.exports.register = async (req, res, next) => {
    try {
        const { password, email } = req.body;
        const user = new User({ email });
        await User.register(user, password);
        console.log(user);
        res.status(200).json(user);
    } catch (e) {
        return next(e);
    }
}

module.exports.login = (req, res, next) => {
    passport.authenticate('local', function(err, user, info){
        if (err) return next(err);
        if (!user) return next(new ExpressError(info.message, 401));
        req.login(user, err => {
            if (err) return next(err);
            return res.status(200).json(user);
        })
    })(req, res, next);
}