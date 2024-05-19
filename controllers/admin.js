const {validationResult} = require('express-validator');
const fileUtil = require('../util/file');

const Product = require('../models/product');
const Category = require('../models/category');

const pageSize = 6;
const pageRange = 2;

exports.getAdminPage = (req, res, next) => {
    res.render('admin/home', {
        pageTitle: 'Admin Page',
        path: '/admin',
    });
}

// Product

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalPage;
    Product.countDocuments()
        .then(totalItems => {
            totalPage = Math.ceil(totalItems / pageSize);
            const offset = (page - 1) * pageSize;
            return Product
                .find()
                .skip(offset)
                .limit(pageSize);
        })
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/product',
                currentPage: page,
                pageStart: Math.max(1, page - pageRange),
                pageEnd: Math.min(totalPage, page + pageRange),
                totalPage: totalPage,
            });
        })
        .catch(err => {
            console.log(err);
        });
}


exports.getAddProduct = async (req, res, next) => {
    const categories = await Category.find();
    res.render('admin/edit-product', {
        mode: 'add',
        pageTitle: 'Add Product',
        path: '/admin/product/add-product',
        product: {},
        categories: categories,
        message: '',
        errors: [],
    });
};

exports.postAddProduct = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const categories = await Category.find();

        return res.status(422).render('admin/edit-product', {
            mode: 'add',
            pageTitle: 'Add Product',
            path: '/admin/product/add-product',
            product: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                category: {
                    categoryId: {
                        _id: req.body.categoryId,
                    },
                    categoryName: req.body.categoryName,
                }
            },
            categories: categories,
            message: errors.array()[0].msg,
            errors: errors.array(),
        });
    }

    console.log(req.body);
    Category.findById(req.body.categoryId)
        .then(category => {

            return new Product({
                title: req.body.title,
                price: req.body.price,
                image: req.file.path,
                description: req.body.description,
                userId: req.user,
                category: {
                    categoryId: category._id,
                    categoryName: category.name,
                },
            }).save();
        })
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
                _id: req.params.productId
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


exports.getEditProduct = async (req, res, next) => {
    const categories = await Category.find();
    Product.findById(req.params.productId)
        .then(product => {
            res.render('admin/edit-product', {
                product: product,
                mode: 'edit',
                pageTitle: 'Edit Product',
                path: '/admin/product/edit-product',
                message: '',
                categories: categories,
                errors: [],
            });
        }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postEditProduct = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const categories = await Category.find();
        return Product.findById(req.params.productId)
            .then(product => {
                res.status(422).render('admin/edit-product', {
                    product: {
                        title: req.body.title,
                        price: req.body.price,
                        description: req.body.description,
                        _id: req.params.productId,
                        categoryId: req.body.categoryId,
                        categoryName: req.body.categoryName,
                    },
                    mode: 'edit',
                    pageTitle: 'Edit Product',
                    path: '/admin/product/edit-product',
                    message: errors.array()[0].msg,
                    errors: errors.array(),
                    categories: categories,
                });
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }

    let fetchedCategory;
    Category.findById(req.body.categoryId)
        .then(category => {
            fetchedCategory = category;
            return Product
                .findById(req.params.productId)
                .then(product => {

                    product.title = req.body.title;
                    product.price = req.body.price;
                    product.description = req.body.description;
                    product.category = {
                        categoryId: {
                            _id: fetchedCategory._id,
                        },
                        categoryName: fetchedCategory.name,
                    }

                    if (req.file) {
                        fileUtil.deleteFile(product.image);
                        product.image = req.file.path;
                    }

                    return product.save();
                });
        })
        .then(result => {
            console.log('Product updated!');
            res.redirect('/admin/product');
        })

        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// Category

exports.getCategories = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalPage;
    Category.countDocuments()
        .then(totalItems => {
            totalPage = Math.ceil(totalItems / pageSize);
            const offset = (page - 1) * pageSize;
            return Category
                .find()
                .skip(offset)
                .limit(pageSize);
        })
        .then(categories => {
            res.render('admin/categories', {
                categories: categories,
                pageTitle: 'Admin Categories',
                path: '/admin/category',
                currentPage: page,
                pageStart: Math.max(1, page - pageRange),
                pageEnd: Math.min(totalPage, page + pageRange),
                totalPage: totalPage,
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getAddCategory = (req, res, next) => {
    res.render('admin/edit-category', {
        mode: 'add',
        pageTitle: 'Add Category',
        path: '/admin/category/add-category',
        category: {},
        message: '',
        errors: [],
    });
}

exports.postAddCategory = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-category', {
            mode: 'add',
            pageTitle: 'Add Category',
            path: '/admin/category/add-category',
            category: {
                name: req.body.name,
            },
            message: errors.array()[0].msg,
            errors: errors.array(),
        });
    }

    const category = new Category({
        name: req.body.name,
        userId: req.user,
    });

    category
        .save()
        .then(result => {
            console.log('Category created!');
            res.redirect('/admin/category');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deleteCategory = (req, res, next) => {
    Category.findById(req.params.categoryId)
        .then(category => {
            if (!category) {
                return next(new Error('Category not found.'));
            }
            return Category.deleteOne({
                _id: req.params.categoryId
            });
        })
        .then(result => {
            res.status(200).json({
                message: "Successfully deleted category."
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Deleting category failed.'
            });
        });
}

exports.getEditCategory = (req, res, next) => {
    Category.findById(req.params.categoryId)
        .then(category => {
            res.render('admin/edit-category', {
                category: category,
                mode: 'edit',
                pageTitle: 'Edit Category',
                path: '/admin/category/edit-category',
                message: '',
                errors: [],
            });
        }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postEditCategory = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return Category.findById(req.params.categoryId)
            .then(category => {
                res.status(422).render('admin/edit-category', {
                    category: {
                        name: req.body.name,
                        _id: req.params.categoryId,
                    },
                    mode: 'edit',
                    pageTitle: 'Edit Category',
                    path: '/admin/category/edit-category',
                    message: errors.array()[0].msg,
                    errors: errors.array(),
                });
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }

    Category
        .findById(req.params.categoryId)
        .then(category => {
            category.name = req.body.name;
            return category.save().then(result => {
                console.log('Category updated!');
                res.redirect('/admin/category');
            });
        })
        .then(result => {
            Product.updateMany(
                {'category.categoryId': req.params.categoryId},
                {$set: {'category.categoryName': req.body.name}})
                .then(result => {
                console.log('Category updated in products!');
            });
        }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}