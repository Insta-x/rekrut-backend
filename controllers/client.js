const User = require('../models/user');
const Job = require('../models/job');
const Client = require('../models/client');
const ExpressError = require('../utils/ExpressError');

function updateStatusArray(jobId, clientPull, clientPush, workerPull, workerPush) {
    clientPull.pull(jobId)
    clientPush.push(jobId)
    workerPull.pull(jobId)
    workerPush.push(jobId)
}

module.exports.hire = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const userWorker = await User.findById(req.body.worker).populate('worker')      // get worker id by JSON
    const jobId = req.body.job       // get job id by JSON
    const job = Job.findById(jobId)
    updateStatusArray(
        jobId,
        userClient.client.hiring,
        userClient.client.waiting,
        userWorker.worker.applying,
        userWorker.worker.accepted
    )
    job.status = 'WAITING'
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully hiring worker')
}

module.exports.reviewGood = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const userWorker = await User.findById(req.body.worker).populate('worker')      // get worker id by JSON
    const jobId = req.body.job       // get job id by JSON
    updateStatusArray(
        jobId,
        userClient.client.reviewing,
        userClient.client.done,
        userWorker.worker.ongoing,
        userWorker.worker.finished
    )
    job.status = 'DONE'
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully accepting work')
}

module.exports.reviewBad = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const userWorker = await User.findById(req.body.worker).populate('worker')      // get worker id by JSON
    const jobId = req.body.job       // get job id by JSON
    updateStatusArray(
        jobId,
        userClient.client.reviewing,
        userClient.client.ongoing,
        userWorker.worker.ongoing,
        userWorker.worker.ongoing
    )
    job.status = 'ONGOING'
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully rejecting work')
}