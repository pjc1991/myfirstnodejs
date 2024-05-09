// REQUIREMENTS
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const { doubleCsrf } = require('csrf-csrf');
const flash = require('connect-flash');

const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors');

// constants
const MONGO_URI = 'mongodb://mongo:27017/shop?retryWrites=true';

const app = express();

// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.set('views', 'views');

// DATABASE CONNECTION
mongoose
    .connect(MONGO_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'some secret key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })

}));
app.use(cookieParser('cookie-secret-key'));
const { 
    generatedToken,
    doubleCsrfProtection
} = doubleCsrf({
    getSecret: () => 'csrf-secret-key',
    cookieName: 'x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    },
    getTokenFromRequest: req => req.body._csrf
});
app.use(doubleCsrfProtection);
app.use(flash());

app.use((req, res, next) => {
    const csrfToken = req.csrfToken();
    res.locals.csrfToken = csrfToken;
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