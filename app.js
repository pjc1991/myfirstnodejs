// REQUIREMENTS
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const {doubleCsrf} = require('csrf-csrf');
const flash = require('connect-flash')
const moment = require('moment');
console.log("NODE_ENV",process.env.NODE_ENV);
const dotenv = require('dotenv').config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV}`)
});

const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors');

// constants
const MONGO_URI = process.env.MONGODB_URI;

const app = express();

// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.set('views', 'views');

// DATABASE CONNECTION
mongoose
    .connect(MONGO_URI)
    .then(result => {
        app.listen(process.env.SERVER_PORT);
    })
    .catch(err => {
        console.log(err);
    });

// MIDDLEWARE
// bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());


// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploadfiles', express.static(path.join(__dirname, 'uploadfiles')));
// session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })

}));
// cookie
app.use(cookieParser(process.env.COOKIE_SECRET));
// csrf
const {
    generatedToken,
    doubleCsrfProtection
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: 'x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    },
    getTokenFromRequest: req => req.body._csrf || req.headers['csrf-token']
});
app.use(doubleCsrfProtection);
// flash
app.use(flash());
// locals
app.use((req, res, next) => {
    const csrfToken = req.csrfToken();
    res.locals.csrfToken = csrfToken;
    res.locals.moment = moment;
    if (!req.session.user) {
        res.locals.isAuthenticated = false;
        return next();
    }

    User
        .findById(req.session.user._id)
        .then(user => {
            req.user = user;
            res.locals.isAuthenticated = req.session.isLoggedIn;
            next();
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
});


// ROUTES
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use('/', authRoutes);
app.use('/500', errorsController.getInternalServerError);
app.use(errorsController.getNotFound);
app.use((error, req, res, next) => {
    console.log(error);
    res.redirect('/500')
});