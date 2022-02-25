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
    let job = new Job({
        title : req.body.title,
        detail : req.body.detail,
        location : req.body.location,
        jobType : req.body.jobType,
        category : req.body.category,
        salary : req.body.salary,
        responsibility : req.body.responsibility,
        qualification : req.body.qualification,
        author : req.body.author,
    })
    
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
    .put(async (req, res) => {  // TODO update a job detail with id from database
        res.send('job update')
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