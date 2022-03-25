const User = require('../models/user');
const Job = require('../models/job');
const Client = require('../models/client');
const { pushNotif } = require('../utils/pushNotif');
const ExpressError = require('../utils/ExpressError');

module.exports.dashboard = async (req, res, next) => {
    const workers = await User.find({ client : undefined })
    res.status(200).json(workers)
}

module.exports.offerJob = async (req, res, next) => {
    if (!req.body.worker.match(/^[0-9a-fA-F]{24}$/)) 
        return next(new ExpressError('User not found', 404));
    const userWorker = await User.exists({_id: req.body.worker})     // get worker id by JSON
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId)
    if(job.status != 'HIRING')
        return next(new ExpressError('Not hiring', 403));
    if (userWorker.client)
        return next(new ExpressError('User is a client', 403));
    await pushNotif(
        `Hei! Anda mendapat undangan untuk melamar oleh ${req.user.name} untuk mengerjakan ${job.title}. Silakan melamar!`,
        `/job/${jobId}`,
        'important',
        `${req.body.worker}`
    )
    res.status(200).json('Successfully offered job')
}

module.exports.hire = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const userWorker = await User.findById(req.body.worker).populate('worker')      // get worker id by JSON
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId)
    if(job.status != 'HIRING')
        return next(new ExpressError('Not hiring', 403))
    if(!job.registrants.includes(req.body.worker))
        return next(new ExpressError('Not a registrants', 403))
    userClient.client.hiring.pull(jobId)
    userClient.client.waiting.push(jobId)
    userWorker.worker.applying.pull(jobId)
    userWorker.worker.accepted.push(jobId)
    job.status = 'WAITING'
    job.chosen = req.body.worker
    await userClient.client.save()
    await pushNotif(
        `Hore! Anda dipilih oleh ${req.user.name} untuk mengerjakan ${job.title}. Segera lakukan konfirmasi!`,
        `/job/${jobId}`,
        'chosen',
        `${req.body.worker}`
    )
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully hiring worker')
}

module.exports.reviewGood = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('chosen')
    if(job.status != 'REVIEWING')
        return next(new ExpressError('Not reviewing', 403))
    const userWorker = await job.chosen.populate('worker')
    userClient.client.reviewing.pull(jobId)
    userClient.client.done.push(jobId)
    userWorker.worker.ongoing.pull(jobId)
    userWorker.worker.finished.push(jobId)
    job.status = 'DONE'
    await pushNotif(
        `Kerja sama anda dengan ${userWorker.name} dalam pekerjaan ${job.title} telah selesai. Berikan review mengenai performa kerja ${userWorker.name}!`,
        `/job/${jobId}`,
        'done all',
        `${job.author}`
    )
    await pushNotif(
        `${req.user.name} puas dengan performa anda dalam pekerjaan ${job.title}. Berikan review kepada ${req.user.name}!`,
        `/job/${jobId}`,
        'done all',
        `${job.chosen._id}`
    )
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully accepting work')
}

module.exports.reviewBad = async (req, res, next) => {
    const userClient = await User.findById(req.user._id).populate('client')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('chosen')
    if(job.status != 'REVIEWING')
        return next(new ExpressError('Not reviewing', 403))
    const userWorker = await job.chosen.populate('worker')
    userClient.client.reviewing.pull(jobId)
    userClient.client.ongoing.push(jobId)
    job.status = 'ONGOING'
    await pushNotif(
        `${req.user.name} belum puas dengan performa anda dalam pekerjaan ${job.title}. Silakan lakukan revisi.`,
        `/job/${jobId}`,
        'rejected',
        `${job.chosen._id}`
    )
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully rejecting work')
}