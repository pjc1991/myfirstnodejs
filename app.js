// REQUIREMENTS
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.set('views', 'views');

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));




// User middleware to add user to request (for testing purposes only)
app.use((req, res, next) => {
    User.findById('66335938bb6b9f634a6aa95f')
        .then(user => {
            req.user = new User(user);
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
mongoConnect(() => {
    User.fetchAll()
        .then(users => {
            if (users.length === 0) {
                const user = new User({
                    name: 'pjc1991',
                    email: 'test@test.com',
                });

                user.save()
                    .then(result => {
                        console.log('User created!');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }).catch(err => {
            console.log(err);
        });
    app.listen(3000);
});
