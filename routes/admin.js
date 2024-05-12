const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const { 
    titleValidation,
    imageURLValidation,
    priceValidation,
    descriptionValidation,
    productExistsValidation,
    imageFileValidation,
} = require('../validator/product');


router.get('/product', isAuth, adminController.getProducts);

router.get('/product/add-product', isAuth, adminController.getAddProduct);

router.post('/product/add-product',
    isAuth, 
    titleValidation(),
    imageFileValidation(),
    priceValidation(),
    descriptionValidation(),
    productExistsValidation(),
    adminController.postAddProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

router.get('/product/:productId', isAuth, adminController.getEditProduct);

router.post('/product/:productId',
    isAuth, 
    titleValidation(),
    imageFileValidation(),
    priceValidation(),
    descriptionValidation(),
    productExistsValidation(),
    adminController.postEditProduct);

module.exports = router;