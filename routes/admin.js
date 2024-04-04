const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'product.html'));
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/admin/product');
});


module.exports = router;