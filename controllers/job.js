const User = require('../models/user');
const Job = require('../models/job');
const Client = require('../models/client');
const ExpressError = require('../utils/ExpressError');

module.exports.getAll = async (req, res, next) => {
    const jobs = await Job.find().populate('author')
    res.status(200).json(jobs)
}

module.exports.createJob = async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('client');
    const job = new Job({ ...req.body });
    job.author = req.user._id;
    user.client.hiring.push(job);
    await job.save();
    await user.client.save();
    res.status(200).json(job);
}

module.exports.showJob = async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findById(id).populate('author').populate('registrants');
    res.status(200).json(job);
}

module.exports.deleteJob = async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (job.status !== 'HIRING')
        return next(new ExpressError("Tidak dapat menghapus pekerjaan", 403))
    const user = await User.findById(job.author);
    await Client.findByIdAndUpdate(user.client,  { $pull: { hiring: id } });
    await job.deleteOne();
    res.status(200).json('Successfully deleted job')
}
