const express= require('express');
const { getAddress, addAddress } = require('../controllers/address');
const { requireSignin, userMiddleware } = require('../middleware');
const router =express.Router();

router.get(`/user/getAddress`, requireSignin, userMiddleware, getAddress);
router.post('/user/address/create', requireSignin, userMiddleware, addAddress);

module.exports = router