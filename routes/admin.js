const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

const products = [];

router.get('/product', productsController.getAddProduct);

router.post('/product', productsController.postAddProduct);

module.exports = router;