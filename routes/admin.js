const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/product', isAuth, adminController.getProducts);

router.get('/product/add-product', isAuth, adminController.getAddProduct);

router.post('/product/add-product', isAuth, adminController.postAddProduct);

router.post('/product/delete-product', isAuth, adminController.postDeleteProduct);

router.get('/product/:productId', isAuth, adminController.getEditProduct);

router.post('/product/:productId', isAuth, adminController.postEditProduct);

module.exports = router;