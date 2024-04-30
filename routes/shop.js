const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const cartController = require('../controllers/cart');
const ordersController = require('../controllers/orders');

router.get('/', productsController.getProducts);
router.get('/product/:productId', productsController.getProduct);
router.get('/cart', cartController.getCart);
router.post('/cart', cartController.postCart);
router.post('/cart-delete', cartController.postCartDeleteProduct);
router.get('/order', ordersController.getOrders);
router.post('/order', ordersController.postOrder);

module.exports = router;