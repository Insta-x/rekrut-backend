const User = require('../models/user');
const Job = require('../models/job');
const Client = require('../models/client');
const ExpressError = require('../utils/ExpressError');

module.exports.apply = async (req, res, next) => {
    const userWorker = await User.findById(req.user._id).populate('worker')
    const jobId = req.body.job       // get job id by JSON
    const job = Job.findById(jobId)
    if(job.applicants.includes(req.user._id))
        return next(new ExpressError('Already registrants', 403))
    job.applicants.push(req.user._id)
    await job.save()
    res.status(200).json('Successfully applying to a job')
}

module.exports.acceptJob = async (req, res, next) => {
    const userWorker = await User.findById(req.user._id).populate('worker')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('author')
    const userClient = job.author
    userWorker.worker.accepted.pull(jobId)
    userWorker.worker.ongoing.push(jobId)
    userClient.client.waiting.pull(jobId)
    userClient.client.ongoing.push(jobId)
    job.status = 'ONGOING'
    job.chosen = req.user._id
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully accepting job')
}

module.exports.declineJob = async (req, res, next) => {
    const userWorker = await User.findById(req.user._id).populate('worker')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('author')
    const userClient = job.author
    userWorker.worker.accepted.pull(jobId)
    userClient.client.waiting.pull(jobId)
    userClient.client.hiring.push(jobId)
    job.status = 'HIRING'
    job.registrants.pull(req.user._id)
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully declining job')
}