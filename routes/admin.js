const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/product', (req, res, next) => {
    res.render('product', {
        pageTitle: 'Add Product',
    });
});

router.post('/product', (req, res, next) => {
    products.push({
            title : req.body.title,
            imageUrl : req.body.imageUrl,
            price : req.body.price,
            description : req.body.description
        })
    res.redirect('/admin/product');
});


exports.routes = router
exports.products = products