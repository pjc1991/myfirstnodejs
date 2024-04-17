const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'product.html'));
});

router.post('/product', (req, res, next) => {
    products.push({
            title : req.body.title
        })
    res.redirect('/admin/product');
});


exports.routes = router
exports.products = products