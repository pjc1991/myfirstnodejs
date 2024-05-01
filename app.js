// REQUIREMENTS
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const mongoConnect = require('./util/database');


// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.set('views', 'views');

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));




// User middleware to add user to request (for testing purposes only)
app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
});


// ROUTES
// app.use('/admin', adminRoutes);
// app.use('/', shopRoutes);
app.use(errorsController.getNotFound);

// DATABASE CONNECTION
mongoConnect((client) => {
    console.log(client);
    app.listen(3000);
});
