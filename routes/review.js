const express = require('express');
const review = require('../controllers/review');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isRelated } = require('../middleware');

const router = express.Router();

router.post('/:id', isLoggedIn, isRelated, catchAsync(review.createReview));

module.exports = router;
