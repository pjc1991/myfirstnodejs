const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const { 
    titleValidation,
    imageURLValidation,
    priceValidation,
    descriptionValidation,
    productExistsValidation,
    imageFileValidation,
} = require('../validator/product');

router.use(isAdmin);

router.get('/', adminController.getAdminPage);

router.get('/product', adminController.getProducts);

router.get('/product/add-product', adminController.getAddProduct);

router.post('/product/add-product',
    titleValidation(),
    imageFileValidation(),
    priceValidation(),
    descriptionValidation(),
    productExistsValidation(),
    adminController.postAddProduct
);

router.delete('/product/:productId', adminController.deleteProduct);

router.get('/product/:productId', adminController.getEditProduct);

router.post('/product/:productId',
    titleValidation(),
    imageFileValidation(),
    priceValidation(),
    descriptionValidation(),
    productExistsValidation(),
    adminController.postEditProduct);

module.exports = router;