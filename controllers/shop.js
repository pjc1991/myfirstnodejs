const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productId)
        .then(product => {
            res.render('product-detail', {
                product: product, pageTitle: product.title, path: '/product/:productId',
            });
        })
        .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

