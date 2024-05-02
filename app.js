// REQUIREMENTS
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');


// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.set('views', 'views');

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));




// User middleware to add user to request (for testing purposes only)
app.use((req, res, next) => {
    User
        .findOne()
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});


// ROUTES
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use(errorsController.getNotFound);

// DATABASE CONNECTION
mongoose
    .connect('mongodb://mongo:27017/shop?retryWrites=true')
    .then(result => {

        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'pjc1991',
                    email: 'test@test.com',
                    cart: {
                        items: []
                    }
                });

                user.save();
            }
        })

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });