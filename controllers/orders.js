const Order = require('../models/order');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const pageSize = 2;
const pageRange = 2;


exports.getOrders = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalPage;
    Order.countDocuments({'user.userId': req.user._id})
        .then(numOrders => {
            const offset = (page - 1) * pageSize;
            totalPage = Math.ceil(numOrders / pageSize);
            return Order
                .find({
                    'user.userId': req.user._id
                })
                .sort({createdAt: -1})
                .skip(offset)
                .limit(pageSize)
        })
        .then(orders => {
            res.render('order', {
                orders: orders,
                pageTitle: 'Orders',
                path: '/order',
                currentPage: page,
                totalPage: totalPage,
                pageStart: Math.max(1, page - pageRange),
                pageEnd: Math.min(totalPage, page + pageRange)
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
        .then(async user => {

            // get paymentId from json body
            const paymentId = req.body.paymentId;
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}}
            });

            let totalAmount = 0;
            products.forEach(p => {
                totalAmount += p.quantity * p.product.price;
            });

            const paymentResponse = await fetch(
                `https://api.portone.io/payments/${paymentId}`,
                {headers: {Authorization: `PortOne ${process.env.PORTONE_PAYMENT_SECRET}`}},
            );
            if (!paymentResponse.ok) {
                throw new Error(`Payment failed: ${paymentResponse.statusText}`);
            }
            const payment = await paymentResponse.json();

            if (payment.amount.total !== totalAmount) {
                console.log(payment.amount.total, totalAmount);
                throw new Error('Invalid payment amount');
            }

            if (payment.status !== 'PAID') {
                throw new Error('Payment not completed');
            }

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
            res.json({
                success: true,
                message : 'Order placed successfully',
                orderId: result._id,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.json({
                success: false,
                message: error.message
            });
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
        invoiceDocument.moveDown();

        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.product.price;
            invoiceDocument.text().fontSize(14).list([
                `${prod.product.title} - ${prod.quantity} x ${prod.product.price} KRW = ${prod.quantity * prod.product.price} KRW`
            ])
        });
        invoiceDocument.moveDown();
        invoiceDocument.fontSize(20).text(`Total Price: ${totalPrice} KRW`);
        invoiceDocument.end();


    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
