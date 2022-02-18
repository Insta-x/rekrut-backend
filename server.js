const express = require('express')
const mongoose = require('mongoose')
const jobRouter = require('./routes/job')
const userRouter = require('./routes/user')
const app = express()


app.use('/job', jobRouter)
app.use('/user', userRouter)

// temporary location
app.post('/apply', (req, res) => {  // TODO worker apply for a job
    res.send('apply')
})

// temporary location
app.post('/hire', (req, res) => {  // TODO client hire an applicant of a job
    res.send('hire')
})

app.listen(3000)