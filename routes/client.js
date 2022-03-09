const express = require('express');
const client = require('../controllers/client');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isUser, isClient } = require('../middleware');

const router = express.Router();

router.post('/hire', isLoggedIn, isClient, catchAsync(client.hire))

router.post('/reviewgood', isLoggedIn, isClient, catchAsync(client.reviewGood))

router.post('/reviewbad', isLoggedIn, isClient, catchAsync(client.reviewBad))

module.exports = router