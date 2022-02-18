const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {  // TODO get jobs
    res.send('test')
})

router.post('/', (req, res) => {  // TODO vreate a new job
    res.send('test')
})

router
    .route('/:id')
    .get((req, res) => {  // TODO get a job detail with id from database
        res.send('test')
    })
    .put((req, res) => {  // TODO update a job detail with id from database
        res.send('test')
    })
    .delete((req, res) => { // TODO delete a job with id from database
        res.send('test')
    })


module.exports = router