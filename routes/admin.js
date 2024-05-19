const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

const isAdmin = require('../middleware/is-admin');

const { 
    titleValidation,
    priceValidation,
    descriptionValidation,
    productExistsValidation,
    imageFileValidation,
    productValidation,
} = require('../validator/product');



router.use(isAdmin);

router.get('/', adminController.getAdminPage);


// Product

router.get('/product', adminController.getProducts);

router.get('/product/add-product', adminController.getAddProduct);

router.post('/product/add-product',
    productValidation(),
    adminController.postAddProduct
);

router.delete('/product/:productId', adminController.deleteProduct);

router.get('/product/:productId', adminController.getEditProduct);

router.post('/product/:productId',
    productValidation(),
    adminController.postEditProduct);

// Category

router.get('/category', adminController.getCategories);

router.get('/category/add-category', adminController.getAddCategory);

router.post('/category/add-category', adminController.postAddCategory);

router.delete('/category/:categoryId', adminController.deleteCategory);

router.get('/category/:categoryId', adminController.getEditCategory);

router.post('/category/:categoryId', adminController.postEditCategory);

module.exports = router;