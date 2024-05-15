const Product = require('../models/product');
const pageSize = 2;
const pageRange = 2;

exports.getProducts = (req, res, next) => {
    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    const offset = (page - 1) * pageSize;
    let totalPage;
    Product.countDocuments().then(numProducts => {
        totalPage = Math.ceil(numProducts / pageSize);
    }).then(result => {
        return Product.find()
            .skip(offset)
            .limit(pageSize)
    })
        .then(products => {
            res.render('shop', {
                prods: products,
                pageTitle: 'Shop',
                totalPage: totalPage,
                currentPage: page,
                pageStart : Math.max(1, totalPage - pageRange),
                pageEnd : Math.min(totalPage, totalPage + pageRange),
                path: '/',
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.getProductSearch = (req, res, next) => {
    const search = req.query.productName;
    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    const offset = (page - 1) * pageSize;
    let totalPage;
    const searchFilter = { title: { $regex: search, $options: 'i' } };
    Product.countDocuments(searchFilter).then(numProducts => {
        totalPage = Math.ceil(numProducts / pageSize);
    }).then(result => {
        return Product.find(searchFilter)
            .skip(offset)
            .limit(pageSize)
    })
        .then(products => {
            res.render('product', {
                prods: products,
                pageTitle: 'Shop',
                totalPage: totalPage,
                currentPage: page,
                pageStart : Math.max(1, totalPage - pageRange),
                pageEnd : Math.min(totalPage, totalPage + pageRange),
                path: '/',
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });


}

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

