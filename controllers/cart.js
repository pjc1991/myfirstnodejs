const Product = require('../models/product');
const User = require('../models/user');

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            res.render('cart', {
                products: user.cart.items,
                pageTitle: 'Cart',
                path: '/cart',
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getCheckout = (req, res, next) => {
    const paymentId = `payment-${Date.now().toString()}-${req.user._id.toString()}`

    req.user
        .populate('cart.items.productId')
        .then(user => {
            let total = 0;
            user.cart.items.forEach(p => {
                total += p.quantity * p.productId.price;
            });
            console.log(user);
            res.render('checkout', {
                products: user.cart.items,
                pageTitle: 'Checkout',
                path: '/checkout',
                total: total,
                paymentId: paymentId,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}
