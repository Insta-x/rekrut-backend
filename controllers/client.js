const User = require('../models/user');
const Job = require('../models/job');
const { pushNotif } = require('../utils/pushNotif');
const ExpressError = require('../utils/ExpressError');

module.exports.hire = async (req, res, next) => {
    const userWorker = await User.findById(req.body.worker).populate('worker')      // get worker id by JSON
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId)
    if(job.status != 'HIRING')
        return next(new ExpressError('Not hiring', 403))
    if(!job.registrants.includes(req.body.worker))
        return next(new ExpressError('Not a registrants', 403))
    userWorker.worker.applying.pull(jobId)
    userWorker.worker.accepted.push(jobId)
    job.status = 'WAITING'
    job.chosen = req.body.worker
    await pushNotif(
        `Hore! Anda dipilih sebagai ${job.category} di ${job.title}. Segera lakukan konfirmasi!`,
        `/job/${jobId}`,
        'chosen',
        `${req.body.worker}`
    )
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully hiring worker')
}

module.exports.reviewGood = async (req, res, next) => {
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('chosen')
    if(job.status != 'REVIEWING')
        return next(new ExpressError('Not reviewing', 403))
    const userWorker = await job.chosen.populate('worker')
    userWorker.worker.ongoing.pull(jobId)
    userWorker.worker.finished.push(jobId)
    job.status = 'DONE'
    await pushNotif(
        `Kerja sama anda dengan ${userWorker.name} sebagai ${job.category} telah selesai. Berikan review anda!`,
        `/job/${jobId}`,
        'done all',
        `${job.author}`
    )
    await pushNotif(
        `Kerja anda di ${job.name} sebagai ${job.category} telah selesai. Berikan review anda!`,
        `/job/${jobId}`,
        'done all',
        `${req.body.worker}`
    )
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully accepting work')
}

module.exports.reviewBad = async (req, res, next) => {
    const jobId = req.body.job       // get job id by JSON
    const job = await Job.findById(jobId).populate('chosen')
    if(job.status != 'REVIEWING')
        return next(new ExpressError('Not reviewing', 403))
    const userWorker = await job.chosen.populate('worker')
    job.status = 'ONGOING'
    await pushNotif(
        `Hasil anda di ${job.name} sebagai ${job.category} masih belum selesai. Harap diperiksa lagi!`,
        `/job/${jobId}`,
        'rejected',
        `${req.body.worker}`
    )
    await userWorker.worker.save()
    await job.save()
    res.status(200).json('Successfully rejecting work')
}