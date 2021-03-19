const express = require('express');
const router = express.Router();
const {requireSignin} = require('../controllers/auth');
const {createProduct, getProductBySlug, getProductById, deleteProductById, getProducts} = require('../controllers/product');
const {adminMiddleware} = require('../middleware/index');

router.get('/product/getProducts', requireSignin, adminMiddleware, getProducts);
router.post('/product/create',requireSignin, createProduct);
router.get('/products/:slug', getProductBySlug);
router.get('/product/:productId', getProductById);
router.delete('/product/deleteProductById',requireSignin,adminMiddleware,deleteProductById);


module.exports = router;