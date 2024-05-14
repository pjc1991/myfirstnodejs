const {check, body} = require('express-validator');

exports.emailValidation = () => check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email');

exports.passwordValidation = () => body('password')
    .isStrongPassword()
    .trim()
    .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character');

exports.passwordMatchValidation = () => body('password2')
    .trim()
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    });

exports.emailExistsValidation = (User) => exports.emailValidation()
    .custom((email, {req}) => {
        return User.findOne({email: email})
            .then(user => {
                if (user) {
                    throw new Error('The email exists already.');
                }
                return true;
            })
    }).withMessage('The email exists already.');