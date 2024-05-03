const Order = require('../models/order');

exports.getOrders = (req, res, next) => {
    Order
        .find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('order', {
                orders: orders,
                pageTitle: 'Orders',
                path: '/order',
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } }
            });

            const order = new Order({
                user: {
                    userId: req.user
                },
                products: products
            });

            return order.save();
        })
        .then(result => {
            req.user.clearCart();
            res.redirect('/order');
        });
}
