const User = require('../models/user');
const Job = require('../models/job');
const job = require('../models/job');
const ExpressError = require('../utils/ExpressError');

module.exports.getAll = async (req, res, next) => {
    const jobs = await Job.find()
    res.status(200).json(jobs)
}

module.exports.createJob = async (req, res, next) => {
    const job = new Job({ ...req.body });
    job.author = req.user._id;
    await job.save();
    res.status(200).json(job);
}

module.exports.showJob = async (req, res, next) => {
    const job = await Job.findbyId(req.params.id).populate('author');
    if (job.author.equals(req.user._id))
        job.populate('registrants')
    res.status(200).json(job);
}

module.exports.deleteJob = async (req, res, next) => {
    if (job.status !== 'HIRING')
        return next(new ExpressError("Unable to delete job", 403))
    const { id } = req.params.id;
    await Job.findByIdAndDelete(id);
    res.status(200).json('Successfully deleted job')
}
