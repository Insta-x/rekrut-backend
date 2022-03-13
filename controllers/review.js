const Review = require('../models/review');
const User = require('../models/user');
const Job = require('../models/job');
const { pushNotif } = require('../utils/pushNotif');

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const review = new Review({ ...req.body });
    const job = await Job.findById(id);
    const fromUser = await User.findById(req.user._id);
    const toUser = await User.findById(fromUser.worker ? job.author : job.chosen);
    review.author = req.user._id;
    toUser.review.push(review);
    await pushNotif(
        'Anda memperoleh 1 review baru.',
        `/profile/${toUser._id}`,
        'basic',
        `${toUser._id}`
    )
    await review.save();
    await toUser.save();
    res.status(200).json('Succesfully created review');
}
