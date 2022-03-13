const passport = require('passport');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const Worker = require('../models/worker');
const Client = require('../models/client');

const changeUsername = err => err.message.replace('username', 'email');

module.exports.register = async (req, res, next) => {
    try {
        const { password } = req.body;
        const user = new User({ ...req.body });
        if (req.body.isWorker && req.body.isWorker === true) {
            const worker = new Worker(req.body);
            await worker.save();
            user.worker = worker;
        }
        else {
            const client = new Client(req.body);
            user.client = client;
            await client.save();
        }
        await User.register(user, password);
        const { hash, salt, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (e) {
        return next(new ExpressError(changeUsername(e), 400));
    }
}

module.exports.login = (req, res, next) => {
    passport.authenticate('local', async function(err, user, info){
        if (err) return next(err);
        if (!user) return next(new ExpressError(changeUsername(info), 401));
        await user.populate('notif')
        req.login(user, err => {
            if (err) return next(err);
            const { hash, salt, ...userData } = user._doc;
            return res.status(200).json(userData);
        })
    })(req, res, next);
}

module.exports.logout = (req, res, next) => {
    req.logout();
    res.status(200).json('Successfully logged out');
}

module.exports.changePassword = async (req, res, next) => {
    const { password } = req.body;
    const user = await User.findById(req.params.id);
    if (user) {
        user.setPassword(password, async () => {
            await user.save();
            res.status(200).json('Password reset successfully');
        })
    }
    else{
        res.status(404).json('User not found');
    }
}

module.exports.showUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('notif');
    if (user.worker) {
        await user.populate({
            path: 'worker',
            populate: [
                {
                    path: 'applying',
                    populate: 'author'
                },
                {
                    path: 'accepted',
                    populate: 'author'
                },
                {
                    path: 'ongoing',
                    populate: 'author'
                },
                {
                    path: 'finished',
                    populate: 'author'
                }
            ]
        });
    }
    else {
        await user.populate({
            path: 'client',
            populate: [
                {
                    path: 'hiring',
                    populate: 'author'
                },
                {
                    path: 'waiting',
                    populate: 'author'
                },
                {
                    path: 'ongoing',
                    populate: 'author'
                },
                {
                    path: 'reviewing',
                    populate: 'author'
                },
                {
                    path: 'done',
                    populate: 'author'
                }
            ]
        })
    }
    res.status(200).json(user);
}

module.exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    if (user.worker) {
        const worker = await Worker.findByIdAndUpdate(user.worker._id, { ...req.body });
        await worker.save();
    }
    else {
        const client = await Client.findByIdAndUpdate(user.client._id, { ...req.body });
        await client.save();
    }
    res.status(200).json(user);
}

module.exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json('User deleted!');
}

