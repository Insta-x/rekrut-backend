const express = require('express');
const notif = require('../controllers/notif');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

const router = express.Router();

router.delete('/:id', isLoggedIn, catchAsync(notif.deleteNotif));

router.post('/', isLoggedIn, catchAsync(notif.readAllNotif));

router.post('/:id', isLoggedIn, catchAsync(notif.readNotif));

module.exports = router;
