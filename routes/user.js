const express = require('express');
const users = require('../controllers/users');
const router = express.Router();


router.post('/login', users.login);     // logs user in

router.post('/register', users.register);       // registers user

router.route('/:id')
    .get((req, res) => {  // TODO get a profile detail with id from database
        res.send('test')
    })
    .put((req, res) => {  // TODO update a profile detail with id from database
        res.send('test')
    })
    .delete((req, res) => { // TODO delete a profile with id from database
        res.send('test')
    })

module.exports = router;
