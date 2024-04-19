const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('product', {
        pageTitle: 'Add Product',
        path: '/admin/product',
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description
    });
    product.save();
    res.redirect('/admin/product');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        })
    });
};