const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
        mode : 'add',
        pageTitle: 'Add Product',
        path: '/admin/product/add-product',
    });
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.user);
    req.user
        .createProduct({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description
        })
        .then(result => {
            console.log(result);
            console.log('Created Product');
            res.redirect('/admin/product/' + result.id);
        })
        .catch(err => {
            console.log(err);
        });

};

exports.postDeleteProduct = (req, res, next) => {
    req.user.getProducts({ where: { id: req.body.productId } })
    .then(products => {
        const product = products[0];
        return product.destroy();
    })
    .then(result => {
        res.redirect('/admin/product');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
    Product.findByPk(req.params.productId)
        .then(product => {
            res.render('admin/edit-product', {
                product: product,
                mode : 'edit',
                pageTitle: 'Edit Product',
                path: '/admin/product/edit-product',
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    Product.findByPk(req.params.productId)
        .then(product => {
            product.title = req.body.title;
            product.price = req.body.price;
            product.imageUrl = req.body.imageUrl;
            product.description = req.body.description;
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/product/' + req.params.productId);
        })
        .catch(err => {
            console.log(err);
        });
};