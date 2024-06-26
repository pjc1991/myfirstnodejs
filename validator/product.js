const { check, body } = require('express-validator');
const Product = require('../models/product');
const Category = require('../models/category');

exports.titleValidation = () =>
    check('title')
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long');


exports.imageFileValidation = () =>
    check('image')
        .custom((value, { req }) => {
            if (!req.file && !req.body.productId) {
                throw new Error('Image is required');
            }
            return true;
        })
        .withMessage('Image must be a file');

exports.priceValidation = () =>
    check('price')
        .isInt()
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

exports.categorySelectionValidation = () =>
    check('categoryId')
    .custom(async (category, { req }) => {
        if (!category) {
            throw new Error('Please select a category.');
        }
        return true;
    }).withMessage('Please select a category.');

exports.categoryExistsValidation = () =>
    check('categoryId')
    .custom(async (categoryId, { req }) => {
        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
            throw new Error('The category does not exist.');
        }
        return true;
    }).withMessage('The category does not exist.');

exports.productValidation = () => {
    return [
        this.titleValidation(),
        this.priceValidation(),
        this.imageFileValidation(),
        this.descriptionValidation(),
        this.productExistsValidation(),
        this.categorySelectionValidation(),
        this.categoryExistsValidation()
    ];
}