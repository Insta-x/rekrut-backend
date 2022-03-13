const Notif = require('../models/notif');
const User = require('../models/user');
const baseUrl = 'https://rekrut-id.herokuapp.com'

module.exports.pushNotif = async (msg, url, category, userId) => {
    url = baseUrl + url;
    const newNotif = new Notif({ msg, url, category });
    const user = await User.findById(userId);
    user.notif.push(newNotif);
    await user.save();
    await newNotif.save();
}
