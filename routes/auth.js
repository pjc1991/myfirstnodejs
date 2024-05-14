const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth');
const { 
    emailValidation, 
    passwordValidation, 
    passwordMatchValidation,
    emailExistsValidation
} = require('../validator/auth');

router.get('/login', authController.getLogin);
router.post('/login',
    emailValidation(),
    passwordValidation(),
    authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup',

    emailValidation(),
    emailExistsValidation(User),
    passwordValidation(),
    passwordMatchValidation(),

    authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/reset/:token', authController.postNewPassword);

router.get('/email-verification', authController.getEmailVerification);
router.get('/email-verification/:token', authController.getEmailVerificationToken);

router.get('/email-verification-resend', authController.getEmailVerificationResend);
router.post('/email-verification-resend', authController.postEmailVerificationResend);

module.exports = router;