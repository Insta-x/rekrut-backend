const express = require('express');
const client = require('../controllers/client');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isClient, isJobExists, isJobAuthor } = require('../middleware');

const router = express.Router();

router.get('/dashboard', isLoggedIn, isClient, catchAsync(client.dashboard))

router.post('/offer', isLoggedIn, isClient, isJobExists, isJobAuthor, catchAsync(client.offerJob))

router.post('/hire', isLoggedIn, isClient, isJobExists, isJobAuthor, catchAsync(client.hire))

router.post('/review-good', isLoggedIn, isClient, isJobExists, isJobAuthor, catchAsync(client.reviewGood))

router.post('/review-bad', isLoggedIn, isClient, isJobExists, isJobAuthor, catchAsync(client.reviewBad))

module.exports = router