const express = require('express');
const review = require('../controllers/review');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

const router = express.Router();

router.post('/:id', catchAsync(review.createReview));

module.exports = router;
