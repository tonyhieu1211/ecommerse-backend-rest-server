const express = require('express');
const {addToCart, getCartItems, removeCartItem} = require('../controllers/cart');
const { requireSignin, userMiddleware } = require('../middleware');
const router = express.Router();


router.post('/user/cart/addToCart',requireSignin, userMiddleware, addToCart);
router.get('/user/getCartItems',requireSignin, userMiddleware, getCartItems);
router.post('/user/cart/removeItem', requireSignin, userMiddleware, removeCartItem);

module.exports = router;