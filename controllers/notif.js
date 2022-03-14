const Notif = require('../models/notif');
const User = require('../models/user');

module.exports.deleteNotif = async (req, res, next) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { notif: id } });
    await Notif.findByIdAndDelete(id);
    res.status(200).json('Succesfully deleted notification');
}

module.exports.readNotif = async (req, res, next) => {
    const { id } = req.params;
    await Notif.findByIdAndUpdate(id, {read: true});
    res.status(200).json('Notification successfully read');
}

module.exports.readAllNotif = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    for (let notif of user.notif){
        await Notif.findByIdAndUpdate(notif, {read: true});
    }
    res.status(200).json('All Notification read');
}
