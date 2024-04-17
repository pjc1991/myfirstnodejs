const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render('product', {
        pageTitle: 'Add Product',
        path: '/admin/product',
    });
};

exports.postAddProduct = (req, res, next) => {
    products.push({
            title : req.body.title,
            imageUrl : req.body.imageUrl,
            price : req.body.price,
            description : req.body.description
        })
    res.redirect('/admin/product');
};

exports.getProducts = (req, res, next) => {
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
    })
};