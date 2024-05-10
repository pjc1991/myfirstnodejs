const Product = require('../models/product');
const { validationResult } = require('express-validator');
exports.getProducts = (req, res, next) => {
    Product
        .find({
            userId: req.user._id
        })
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/product',
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        mode: 'add',
        pageTitle: 'Add Product',
        path: '/admin/product/add-product',
        product: {},
        message: '',
        errors : [],
    });
};

exports.postAddProduct = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            mode: 'add',
            pageTitle: 'Add Product',
            path: '/admin/product/add-product',
            product: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
            },
            message: errors.array()[0].msg,
            errors : errors.array(),
        });
    }


    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        image: req.file.path,
        description: req.body.description,
        userId: req.user,
    });

    product
        .save()
        .then(result => {
            console.log('Product created!');
            res.redirect('/admin/product');
        })
        .catch(err => {
            console.log(err);
        });

};

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteOne({
        _id: req.body.productId,
        userId: req.user._id
    })
        .then(result => {
            res.redirect('/admin/product');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    Product.findById(req.params.productId)
        .then(product => {
            res.render('admin/edit-product', {
                product: product,
                mode: 'edit',
                pageTitle: 'Edit Product',
                path: '/admin/product/edit-product',
                message: '',
                errors : [],
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return Product.findById(req.params.productId)
        .then(product => {
            res.status(422).render('admin/edit-product', {
                product: {
                    title: req.body.title,
                    price: req.body.price,
                    description: req.body.description,
                    _id: req.params.productId,
                },
                mode: 'edit',
                pageTitle: 'Edit Product',
                path: '/admin/product/edit-product',
                message: errors.array()[0].msg,
                errors : errors.array(),
            });
        }).catch(err => {
            console.log(err);
        });
    }

    Product
        .findById(req.params.productId)
        .then(product => {

            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }

            product.title = req.body.title;
            product.price = req.body.price;
            product.description = req.body.description;

            if (req.file) {
                product.image = req.file.path;
            }

            return product.save().then(result => {
                console.log('Product updated!');
                res.redirect('/admin/product');
            });
        })
        .catch(err => {
            console.log(err);
        });
};