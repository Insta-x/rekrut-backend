if (process.env.NODE_ENV === 'production')
    require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const jobRouter = require('./routes/job')
const userRouter = require('./routes/user')
const reviewRouter = require('./routes/review')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo');

const User = require('./models/user');
const ExpressError = require('./utils/ExpressError')

const app = express();

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/idt';
const secret = process.env.SECRET || 'thisisasecret';
const PORT = process.env.PORT || 3001;

// connect to mongo
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
    console.log(`Connected to Database ${dbUrl}`);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
})

store.on('error', e => {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(cors({origin:true, credentials: true}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.send('API Successfully Connected')
})

app.get('/session', (req, res) => {
    res.json(req.user);
})

app.use('/job', jobRouter)
app.use('/user', userRouter)
app.use('/review', reviewRouter)

// temporary location
app.post('/apply', (req, res) => {  // TODO worker apply for a job
    res.send('apply')
})

// temporary location
app.post('/hire', (req, res) => {  // TODO client hire an applicant of a job
    res.send('hire')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {  // Error handling
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).json(err)
})

app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
})
