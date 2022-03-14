const express = require('express');
const worker = require('../controllers/worker');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isWorker, isJobExists, isJobChosen } = require('../middleware');

const router = express.Router();

router.get('/dashboard', catchAsync(worker.dashboard))

router.post('/apply', isLoggedIn, isWorker, isJobExists, catchAsync(worker.apply))

router.post('/accept', isLoggedIn, isWorker, isJobExists, isJobChosen, catchAsync(worker.acceptJob))

router.post('/decline', isLoggedIn, isWorker, isJobExists, isJobChosen, catchAsync(worker.declineJob))

router.post('/finish', isLoggedIn, isWorker, isJobExists, isJobChosen, catchAsync(worker.finishJob))

module.exports = router