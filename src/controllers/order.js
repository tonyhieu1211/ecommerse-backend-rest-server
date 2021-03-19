const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");

exports.addOrder = (req, res) => {
    Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
        if (error) return res.status(400).json({ error })
        if (result) {
            req.body = req.body.payload;
            req.body.user = req.user._id;
            req.body.orderStatus = [
                {
                    type: "ordered",
                    date: new Date(),
                    isCompleted: true
                },
                {
                    type: "packed", 
                    isCompleted: false
                },
                {
                    type: "shipped",
                    isCompleted: false
                },
                {
                    type: "delivered",
                    isCompleted: false
                },
            ]
            const newOrder = new Order(req.body);
            newOrder.save((error, createdOrder) => {
                if (error) return res.status(400).json({ error });
                if (createdOrder) return res.status(201).json({ createdOrder });
            })
        }
    })



}

exports.getOrders = (req, res) => { 
    Order.find({ user: req.user._id })
        .select("_id paymentStatus items")
        .populate("items.productId", "_id name productPics")
        .exec((error, orders) => {
            if (error) return res.status(400).json({ error });
            if (orders) return res.status(200).json({ orders });
        })
}

exports.getOrder = (req, res) => {
    console.log(req.body);
    Order.findOne({_id: req.body.orderId})
    .populate("items.productId","_id name productPics")
    .lean()
    .exec((error, order) => {
        if(error) return res.status(400).json({ error });
        if(order){
            Address.findOne({ user: req.user._id })
            .exec((error, userAddress) => {
                if(error) return res.status(400).json({ error });
                order.address = userAddress.address.find(addr => addr._id.toString() == order.addressId.toString());
                res.status(200).json({order});
            })
        }
    })
}