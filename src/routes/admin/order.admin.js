const express= require('express');
const { updateOrder, getCustomerOrders } = require('../../controllers/admin/order.admin');
const router = express.Router();
const {requireSignin, adminMiddleware} = require('../../middleware')

router.post(`/order/update`,requireSignin, adminMiddleware, updateOrder );
router.get(`/order/getCustomerOrders`, requireSignin, adminMiddleware, getCustomerOrders);

module.exports = router;