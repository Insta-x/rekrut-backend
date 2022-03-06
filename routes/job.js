const express = require('express')
const jobs = require('../models/job')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isClient } = require('../middleware')

const router = express.Router();

router.get('/', catchAsync(jobs.getAll))

router.post('/', isLoggedIn, isClient, catchAsync(jobs.createJob))

router.route('/:id')
    .get(catchAsync(jobs.showJob))
    .delete(catchAsync(jobs.deleteJob))

module.exports = router

/*
{
    "title": "Soft",
    "detail": "kekw",
    "location": "sumwer",
    "jobType": "full",
    "category": "tech",
    "salary": 1,
    "responsibility": "none",
    "qualification": "nerd",
    "status": "hiring"
}
*/