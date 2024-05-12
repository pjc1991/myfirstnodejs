const Product = require('../models/product');
const {validationResult} = require('express-validator');
const fileUtil = require('../util/file');
const pageSize = 2;
const pageRange = 2;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalPage;
    Product.countDocuments()
        .then(totalItems => {
            totalPage = Math.ceil(totalItems / pageSize);
            const offset = (page - 1) * pageSize;
            return Product
                .find({userId: req.user._id})
                .skip(offset)
                .limit(pageSize);
        })
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/product',
                currentPage : page,
                pageStart : Math.max(1, page - pageRange),
                pageEnd : Math.min(totalPage, page + pageRange),
                totalPage : totalPage,
            });
        })
        .catch(err => {
            console.log(err);
        });
}


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        mode: 'add',
        pageTitle: 'Add Product',
        path: '/admin/product/add-product',
        product: {},
        message: '',
        errors: [],
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
            errors: errors.array(),
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.deleteProduct = (req, res, next) => {
    let filePath;
    Product.findById(req.params.productId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found.'));
            }
            filePath = product.image;
            return Product.deleteOne({
                _id: req.params.productId,
                userId: req.user._id
            });
        })
        .then(result => {
            fileUtil.deleteFile(filePath);
            res.status(200).json({
                message: "Successfully deleted product."
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Deleting product failed.'
            });
        });
}


exports.getEditProduct = (req, res, next) => {
    Product.findById(req.params.productId)
        .then(product => {
            res.render('admin/edit-product', {
                product: product,
                mode: 'edit',
                pageTitle: 'Edit Product',
                path: '/admin/product/edit-product',
                message: '',
                errors: [],
            });
        }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
                    errors: errors.array(),
                });
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
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
                fileUtil.deleteFile(product.image);
                product.image = req.file.path;
            }

            return product.save().then(result => {
                console.log('Product updated!');
                res.redirect('/admin/product');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};