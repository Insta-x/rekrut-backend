const Review = require('../models/review');
const User = require('../models/user');
const Job = require('../models/job');
const { pushNotif } = require('../utils/pushNotif');

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const review = new Review({ ...req.body, author : req.user._id });
    const job = await Job.findById(id);
    const fromUser = await User.findById(req.user._id);
    const toUser = await User.findById(fromUser.worker ? job.author : job.chosen);
    toUser.review.push(review);
    toUser.sumRating += review.rating
    toUser.rating = sumRating / toUser.review.length
    await pushNotif(
        `Anda memperoleh 1 review baru.`,
        `/review/${jobId}`,     // FIX THIS
        'review',
        `${fromUser.worker ? job.author : job.chosen}`
    )
    await review.save();
    await toUser.save();
    res.status(200).json('Succesfully created review');
}
