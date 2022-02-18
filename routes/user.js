const express = require('express')
const router = express.Router()


router.get('/login', (req, res) => {  // TODO login a user
    res.send('login')
})

router.post('/register', (req, res) => {  // TODO register a new user
    res.send('register')
})

router
    .route('/:id')
    .get((req, res) => {  // TODO get a profile detail with id from database
        res.send('test')
    })
    .put((req, res) => {  // TODO update a profile detail with id from database
        res.send('test')
    })
    .delete((req, res) => { // TODO delete a profile with id from database
        res.send('test')
    })


module.exports = router