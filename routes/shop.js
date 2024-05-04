const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const cartController = require('../controllers/cart');
const ordersController = require('../controllers/orders');
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getProducts);
router.get('/product/:productId', shopController.getProduct);

router.get('/cart', isAuth, cartController.getCart);
router.post('/cart', isAuth, cartController.postCart);
router.post('/cart-delete', isAuth, cartController.postCartDeleteProduct);
router.get('/order', isAuth, ordersController.getOrders);
router.post('/order', isAuth, ordersController.postOrder);


module.exports = router;