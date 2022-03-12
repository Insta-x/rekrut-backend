const express = require('express');
const review = require('../controllers/review');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isUser } = require('../middleware');

const router = express.Router();

router.post('/:id', isLoggedIn, isUser, catchAsync(review.createReview));

module.exports = router;
