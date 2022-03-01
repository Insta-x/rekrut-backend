const Review = require('../models/review');
const User = require('../models/user');
const Job = require('../models/job');

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const review = new Review({ ...req.body });
    review.author = req.user._id;
    const job = Job.findById(id);
    const fromUser = User.findById(req.user._id);
    const toUser = User.findById(fromUser.worker ? job.author : job.chosen);
    toUser.review.push(review);
    await toUser.save();
    await review.save();
    res.status(200).json('Succesfully created review');
}
