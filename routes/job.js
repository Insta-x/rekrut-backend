const express = require('express');
const jobs = require('../controllers/job');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isClient, isJobOwner } = require('../middleware')

const router = express.Router();

router.get('/', catchAsync(jobs.getAll))

router.post('/', isLoggedIn, isClient, catchAsync(jobs.createJob))

router.route('/:id')
    .get(catchAsync(jobs.showJob))
    .delete(isLoggedIn, isJobOwner, catchAsync(jobs.deleteJob))

module.exports = router
