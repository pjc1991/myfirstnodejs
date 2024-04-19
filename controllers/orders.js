const Order = require('../models/order');
const Cart = require('../models/cart');

exports.getOrders = (req, res, next) => {
    Order.fetchAll((orders) => {
        res.render('order', {
            orders: orders,
            pageTitle: 'Orders',
            path: '/order',
        });
    });
}

exports.postOrder = (req, res, next) => {
    Cart.fetchAll((cart) => {
        const orderItems = cart.map(item => {
            return {
                product: item.product,
                quantity: item.quantity
            }
        });
        const order = new Order({
            orderItems: orderItems,
            user: req.user
        });
        order.save();
    })
    Cart.deleteAll(req.user, () => {
        return res.redirect('/order');
    });
    res.redirect('/order');
}
