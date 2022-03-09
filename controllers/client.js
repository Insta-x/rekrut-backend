const User = require('../models/user');
const Job = require('../models/job');
const Client = require('../models/client');
const ExpressError = require('../utils/ExpressError');

module.exports.hire = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const userWorker = await User.findById(req.body.worker).populate('worker')      // get worker id by JSON
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId)
    userClient.client.hiring.pull(jobId)
    userClient.client.waiting.push(jobId)
    userWorker.worker.applying.pull(jobId)
    userWorker.worker.accepted.push(jobId)
    job.status = 'WAITING'
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully hiring worker')
}

module.exports.reviewGood = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('chosen')
    const userWorker = await job.chosen.populate('worker')
    userClient.client.reviewing.pull(jobId)
    userClient.client.done.push(jobId)
    userWorker.worker.ongoing.pull(jobId)
    userWorker.worker.finished.push(jobId)
    job.status = 'DONE'
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully accepting work')
}

module.exports.reviewBad = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('chosen')
    const userWorker = await job.chosen.populate('worker')
    userClient.client.reviewing.pull(jobId)
    userClient.client.ongoing.push(jobId)
    job.status = 'ONGOING'
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully rejecting work')
}