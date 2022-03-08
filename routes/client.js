const express = require('express');
const client = require('../controllers/client');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isUser } = require('../middleware');

const router = express.Router();

router.post('/hire', catchAsync(client.hire))

router.post('/review/good', catchAsync(client.reviewGood))

router.post('/review/bad', catchAsync(client.reviewBad))

module.exports = router