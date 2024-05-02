const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/product', adminController.getProducts);

router.get('/product/add-product', adminController.getAddProduct);

router.post('/product/add-product', adminController.postAddProduct);

router.post('/product/delete-product', adminController.postDeleteProduct);

router.get('/product/:productId', adminController.getEditProduct);

router.post('/product/:productId', adminController.postEditProduct);

module.exports = router;