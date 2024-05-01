const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const cartController = require('../controllers/cart');
const ordersController = require('../controllers/orders');

router.get('/', shopController.getProducts);
router.get('/product/:productId', shopController.getProduct);
router.get('/cart', cartController.getCart);
router.post('/cart', cartController.postCart);
router.post('/cart-delete', cartController.postCartDeleteProduct);
router.get('/order', ordersController.getOrders);
router.post('/order', ordersController.postOrder);

module.exports = router;