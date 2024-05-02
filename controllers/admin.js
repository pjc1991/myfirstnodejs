const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
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
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
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
    Product.findByIdAndDelete(req.body.productId)
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
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    Product
        .findById(req.params.productId)
        .then(product => {
        
            product.title = req.body.title;
            product.price = req.body.price;
            product.imageUrl = req.body.imageUrl;
            product.description = req.body.description;

            return product.save();
        })
        .then(result => {
            console.log('Product updated!');
            res.redirect('/admin/product');
        })
        .catch(err => {
            console.log(err);
        });
};