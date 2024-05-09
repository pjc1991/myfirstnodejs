const { check, body } = require('express-validator');
const Product = require('../models/product');

exports.titleValidation = () =>
    check('title')
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long');

exports.imageURLValidation = () =>
    check('imageUrl')
        .isURL()
        .withMessage('Image URL must be a valid URL');

exports.priceValidation = () =>
    check('price')
        .isFloat()
        .withMessage('Price must be a number');

exports.descriptionValidation = () =>
    check('description')
        .trim()
        .isLength({ min: 5, max: 400 })
        .withMessage('Description must be between 5 and 400 characters long');

exports.productExistsValidation = () => 
    check('title')
    .custom(async (title, { req }) => {
        const product = await Product.findOne({ title: title, _id: { $ne: req.body.productId } });
        if (product) {
            throw new Error('The product exists already.');
        }
        return true;
    }).withMessage('The product exists already.');