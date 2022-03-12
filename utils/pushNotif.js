const Notif = require('../models/notif');
const User = require('../models/user');
const baseUrl = 'http://localhost:3001'

module.exports.pushNotif = async (msg, url, type, userId) => {
    url = baseUrl + url;
    const newNotif = new Notif({ msg, url, type });
    const user = await User.findById(userId);
    user.notif.push(newNotif);
    await user.save();
    await newNotif.save();
}
