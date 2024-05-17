const express = require('express');
const multer = require('multer');
const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const { 
    titleValidation,
    imageURLValidation,
    priceValidation,
    descriptionValidation,
    productExistsValidation,
    imageFileValidation,
} = require('../validator/product');

// multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('uploadfiles', 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
        return cb(null, false);
    }

    cb(null, true);
}

router.use(isAdmin);

router.get('/', adminController.getAdminPage);

router.get('/product', adminController.getProducts);

router.get('/product/add-product', adminController.getAddProduct);

router.post('/product/add-product',
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
    })
        .single('image'),
    titleValidation(),
    imageFileValidation(),
    priceValidation(),
    descriptionValidation(),
    productExistsValidation(),
    adminController.postAddProduct
);

router.delete('/product/:productId', adminController.deleteProduct);

router.get('/product/:productId', adminController.getEditProduct);

router.post('/product/:productId',
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
    })
        .single('image'),
    titleValidation(),
    imageFileValidation(),
    priceValidation(),
    descriptionValidation(),
    productExistsValidation(),
    adminController.postEditProduct);

module.exports = router;