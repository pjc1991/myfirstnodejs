// const Order = require('../models/order');

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
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
    req.user.addOrder()
        .then(result => {
            res.redirect('/order');
        });
}
