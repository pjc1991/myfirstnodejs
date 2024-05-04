const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        message: req.flash('message')
    });
}

exports.postLogin = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            req.flash('message', 'Invalid email or password');
            return res.redirect('/login');
        }

        bcrypt
            .compare(req.body.password, user.password)
            .then(doMatch => {
                if (!doMatch) {
                    req.flash('message', 'Invalid email or password');
                    return res.redirect('/login');
                }

                req.session.user = user;
                req.session.isLoggedIn = true;
                req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                })
            })
            .catch(err => {
                console.log(err);
                res.redirect('/login');
            });
    })
        .catch(err => {
            console.log(err);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        message: req.flash('message')
    });
}

exports.postSignup = (req, res, next) => {

    User.findOne({ email: req.body.email }).then(existsUser => {
        if (existsUser) {
            req.flash('message', 'Email already exists. Please use another email.');
            return res.redirect('/signup');
        }

        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 12),
            cart: {
                items: []
            }
        });

        return user.save()
            .then(result => {
                res.redirect('/login');
            });
    }).catch(err => {
        console.log(err);
    });
}