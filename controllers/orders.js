const Order = require('../models/order');
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.getOrders = (req, res, next) => {
    Order
        .find({'user.userId': req.user._id})
        .then(orders => {
            res.render('order', {
                orders: orders,
                pageTitle: 'Orders',
                path: '/order',
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}}
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
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getInvoice = (req, res, next) => {
    Order.findById(req.params.orderId).then(order => {
        if (!order) {
            return next(new Error('No order found.'));
        }

        if (order.user.userId.toString() !== (req.user._id.toString())) {
            return next(new Error('Unauthorized'));
        }

        const invoiceDocument = new PDFDocument();
        const invoiceName = `invoice-${req.params.orderId}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

        invoiceDocument.pipe(res);
        invoiceDocument
            .fontSize(26)
            .text('Invoice', {
                underline: true
            });
        invoiceDocument.text('-----------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.product.price;
            invoiceDocument
                .fontSize(14)
                .text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`);
        });
        invoiceDocument.text('---');
        invoiceDocument.fontSize(20).text(`Total Price: $${totalPrice}`);
        invoiceDocument.end();


    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
