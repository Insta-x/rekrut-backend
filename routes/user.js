const express = require('express');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isUser } = require('../middleware');

const router = express.Router();

router.post('/login', users.login);     // logs user in

router.post('/logout', users.logout);   // logs user out

router.post('/register', users.register);       // registers user

router.route('/:id')
    .get(catchAsync(users.showUser))
    .post(isLoggedIn, isUser, catchAsync(users.changePassword))     // change password
    .put(isLoggedIn, isUser, catchAsync(users.updateUser))
    .delete(isLoggedIn, isUser, catchAsync(users.deleteUser))

module.exports = router;
