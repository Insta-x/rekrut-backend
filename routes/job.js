const express = require('express')
const ExpressError = require('../utils/ExpressError');
const Job = require('../models/job')
const router = express.Router()

router.get('/', async (req, res, next) => {  // TODO get jobs
    try {
        const jobs = await Job.find()
        res.status(200).send(jobs)
    } catch (e) {
        console.log(e)
        return next(new ExpressError(e, 400));
    }
})

router.post('/', async (req, res, next) => {  // TODO create a new job
    let job = new Job({ ...req.body })
    try {
        job = await job.save();
        res.status(200).send(job);
    } catch (e) {
        return next(new ExpressError(e, 400));
    }
})

router
    .route('/:id')
    .get(async (req, res, next) => {  // TODO get a job detail with id from database
        try {
            const job = await Job.findById(req.params.id)
            res.status(200).send(job)
        } catch (e) {
            return next(new ExpressError(e, 400));
        }
    })
    .delete(async (req, res, next) => { // TODO delete a job with id from database
        try {
            await Job.findByIdAndDelete(req.params.id)
            res.status(200).json({
                "message" : "Successful"
            })
        } catch (e) {
            console.log(e)
            return next(new ExpressError(e, 400));
        }
    })

module.exports = router