const express = require('express');
const worker = require('../controllers/worker');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isUser, isWorker } = require('../middleware');

const router = express.Router();

router.post('/apply', isLoggedIn, isWorker, catchAsync(worker.apply))

router.post('/accept', isLoggedIn, isWorker, catchAsync(worker.acceptJob))

router.post('/decline', isLoggedIn, isWorker, catchAsync(worker.declineJob))

router.post('/finish', isLoggedIn, isWorker, catchAsync(worker.finishJob))

module.exports = router