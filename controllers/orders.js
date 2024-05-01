const Order = require('../models/order');

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
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
    let fetchedProducts;
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            fetchedProducts = products;
            return req.user.createOrder();
        })
        .then(order => {
            return order.addProducts(fetchedProducts.map(product => {
                product.orderItem = { 
                    quantity: product.cartItem.quantity,
                    price: product.price
                };
                return product;
            }));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/order');
        });
}
