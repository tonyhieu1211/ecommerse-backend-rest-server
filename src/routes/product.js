const express = require('express');
const router = express.Router();
const {requireSignin} = require('../controllers/auth');
const {createProduct, getProductBySlug, getProductById, deleteProductById, getProducts} = require('../controllers/product');
const {adminMiddleware} = require('../middleware/index');
const multer = require('multer');
const path = require('path');
const shortid = require('shortid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname);
    }
})

const upload = multer({ storage });
router.get('/product/getProducts', requireSignin, adminMiddleware, getProducts);
router.post('/product/create',requireSignin, adminMiddleware,upload.array('productPic'), createProduct);
router.get('/products/:slug', getProductBySlug);
router.get('/product/:productId', getProductById);

router.delete('/product/deleteProductById',requireSignin,adminMiddleware,deleteProductById);


module.exports = router;