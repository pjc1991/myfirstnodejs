const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth');

const emailValidation = () => check('email').isEmail().withMessage('Please enter a valid email');
const passwordValidation = () => body('password').isStrongPassword().withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character');


router.get('/login', authController.getLogin);
router.post('/login',
    emailValidation(),
    passwordValidation(),
    authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup',

    emailValidation()
        .custom((email, { req }) => {
        return User.findOne({ email: email })
                .then(user => {
                    if (user) {
                        return Promise.reject('The email exists already.');
                    }
                    return Promise.resolve();
                }).catch(err => {
                    console.log(err);
                });
        }).withMessage('The email exists already.'),

    passwordValidation(),

    body('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    }),

    authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/reset/:token', authController.postNewPassword);

module.exports = router;