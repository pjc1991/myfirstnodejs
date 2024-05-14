const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mailUtil = require('../util/mail');
const {validationResult} = require('express-validator');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        message: req.flash('message'),
        errors: [],
        input: {
            email: "",
            password: ""
        }
    });
}

exports.postLogin = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            message: errors.array()[0].msg,
            errors: errors.array(),
            input: {
                email: req.body.email,
                password: req.body.password
            }
        });
    }

    User.findOne({email: req.body.email})
        .then(user => {
        if (!user) {
            return res.status(422).render('auth/login', {
                pageTitle: 'Login',
                path: '/login',
                message: "Invalid email or password",
                errors: [],
                input: {
                    email: req.body.email,
                    password: req.body.password
                }
            });
        }

        bcrypt
            .compare(req.body.password, user.password)
            .then(doMatch => {
                if (!doMatch) {
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Login',
                        path: '/login',
                        message: "Invalid email or password",
                        errors: [],
                        input: {
                            email: req.body.email,
                            password: req.body.password
                        }
                    });
                }

                req.session.user = user;
                req.session.isLoggedIn = true;
                req.session.save((err) => {
                    if (err) throw new Error(err);
                    res.redirect('/');
                })
            })
    })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        message: req.flash('message'),
        input: {
            email: "",
            password: "",
            password2: ""
        },
        errors: []
    });
}

exports.postSignup = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            message: errors.array()[0].msg,
            input: {
                email: req.body.email,
                password: req.body.password,
                password2: req.body.password2
            },
            errors: errors.array()
        });
    }

    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12),
        cart: {
            items: []
        }
    });

    mailUtil.sendMail({
        to: req.body.email,
        subject: 'Signup successful',
        html: '<h1>You successfully signed up!</h1>'
    });

    return user.save()
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        message: req.flash('message')
    });
}

exports.postReset = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                req.flash('message', 'Email not found');
                return res.redirect('/reset');
            }

            user.createResetToken();
            mailUtil.sendMail({
                to: req.body.email,
                subject: 'Password reset',
                html: `<p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${user.resetToken}">link</a> to set a new password</p>`
            });

            req.flash('message', 'Password reset email sent');
            res.redirect('/reset');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            if (!user) {
                req.flash('message', 'Invalid token');
                return res.redirect('/reset');
            }

            res.render('auth/new-password', {
                pageTitle: 'New Password',
                path: '/new-password',
                message: req.flash('message'),
                userId: user._id.toString(),
                token: token
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const token = req.params.token;
    const password = req.body.password;

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
        .then(user => {
            if (!user) {
                req.flash('message', 'Invalid token');
                return res.redirect('/reset');
            }

            user.changePassword(password);
            req.flash('message', 'Password changed');
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}