const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getCart = (req, res, next) => {
    Cart.fetchAll((cart) => {
        res.render('cart', {
            cart: cart,
            pageTitle: 'Cart',
            path: '/cart',
            total : 100
        });
    });
}

exports.postCart = (req, res, next) => {
    Product.fetch(req.body.productId, (product) => {
        const cart = new Cart({
            product: product,
            quantity: req.body.quantity
        });
        cart.save();
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    Cart.deleteAll(req.user, () => {
        res.redirect('/cart');
    });
}
