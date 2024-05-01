const CartItem = require('../models/cartItem');
const Product = require('../models/product');
const User = require('../models/user');

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts().then(products => {

                let total = 0;
                products.forEach(p => {
                    total += p.price * p.cartItem.quantity;
                });

                res.render('cart', {
                    products: products,
                    pageTitle: 'Cart',
                    path: '/cart',
                    total: total
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                newQuantity = product.cartItem.quantity + newQuantity;
            }

            return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}
