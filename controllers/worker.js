const User = require('../models/user');
const Job = require('../models/job');
const Client = require('../models/client');
const ExpressError = require('../utils/ExpressError');
const { pushNotif } = require('../utils/pushNotif');

module.exports.apply = async (req, res, next) => {
    const userWorker = await User.findById(req.user._id).populate('worker')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId)
    if(job.registrants.includes(req.user._id))
        return next(new ExpressError('Already registrant', 403))
    await pushNotif(
        `Hei! Ada pekerja yang baru saja mendaftar sebagai ${job.category}.`,
        `/job/${jobId}`,
        'important',
        `${job.author}`
    );
    userWorker.worker.applying.push(jobId)
    job.registrants.push(req.user._id)
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully applying to a job')
}

module.exports.acceptJob = async (req, res, next) => {
    const userWorker = await User.findById(req.user._id).populate('worker')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('author')
    const userClient = await job.author.populate('client')
    userWorker.worker.accepted.pull(jobId)
    userWorker.worker.ongoing.push(jobId)
    userClient.client.waiting.pull(jobId)
    userClient.client.ongoing.push(jobId)
    job.status = 'ONGOING'
    for (let regists of job.registrants){
        if (!regists.equals(req.user._id))
            await pushNotif(
                `Anda belum terpilih menjadi ${job.category} di ${job.title}. Jangan patah semangat ya!`,
                `/job/${jobId}`,
                'rejected',
                `${regists}`
            )
    }
    await pushNotif(
        `Hore! Anda berhasil merekrut ${userWorker.name} sebagai ${job.category}.`,
        `/job/${jobId}`,
        'hired',
        `${job.author._id}`
    )
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully accepting job')
}

module.exports.declineJob = async (req, res, next) => {
    const userWorker = await User.findById(req.user._id).populate('worker')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('author')
    const userClient = await job.author.populate('client')
    userWorker.worker.accepted.pull(jobId)
    userClient.client.waiting.pull(jobId)
    userClient.client.hiring.push(jobId)
    job.status = 'HIRING'
    job.chosen = undefined
    job.registrants.pull(req.user._id)
    await pushNotif(
        `Kabar buruk! Anda gagal merekrut ${userWorker.name} sebagai ${job.category}.`,
        `/job/${jobId}`,
        'rejected',
        `${job.author._id}`
    )
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully declining job')
}

module.exports.finishJob = async (req, res, next) => {
    const userWorker = await User.findById(req.user._id).populate('worker')
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('author')
    const userClient = await job.author.populate('client')
    if(job.status != 'ONGOING')
        return next(new ExpressError('Not an ongoing job', 403))
    userClient.client.ongoing.pull(jobId)
    userClient.client.reviewing.push(jobId)
    job.status = 'REVIEWING'
    await pushNotif(
        `Pekerjaan ${userWorker.name} sebagai ${job.category} telah selesai. Silahkan diperiksa kembali.`,
        `/job/${jobId}`,
        'done all',
        `${job.author._id}`
    )
    await userClient.client.save()
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully finishing job')
}