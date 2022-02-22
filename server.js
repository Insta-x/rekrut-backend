const express = require('express')
const mongoose = require('mongoose')
const jobRouter = require('./routes/job')
const userRouter = require('./routes/user')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cors = require('cors');

const User = require('./models/user');

const app = express();

// connect to mongo
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/idt');
    console.log('DATABASE CONNECTED');
}

const sessionConfig = {
    secret: 'changethislater',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.use((err, req, res, next) => {  // Error handling
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).json(err)
})

app.listen(3001, () => {
    console.log("LISTENING ON PORT 3001");
})
