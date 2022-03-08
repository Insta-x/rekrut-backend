const express = require('express');
const worker = require('../controllers/worker');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isUser } = require('../middleware');

const router = express.Router();

router.post('/apply', catchAsync(worker.apply))

router.post('/accept', catchAsync(worker.acceptJob))

router.post('/decline', catchAsync(worker.declineJob))

router.post('/finish', catchAsync(worker.finishJob))

module.exports = router