const e = require('express');
const Cart = require('../models/cart');

function runUpdate(condition, updateData){
    return new Promise((resolve, reject) => {
        Cart.findOneAndUpdate(condition, updateData, {upsert:true})
        .then(result => resolve())
        .catch(err => reject(err));
    })
}

exports.addToCart = (req, res) => {

    // res.json({ message: 'cart' }); 
    Cart.findOne({ user: req.user._id })
    .exec((err, cart) => {
        if(err) return res.status(400).json({ err });
        if(cart){
            let promiseArray = [];

            req.body.cartItems.forEach(cartItem => {
                const addedProduct = cartItem.product;
                const itemInCart = cart.cartItems.find(item => item.product == addedProduct);
                let condition, update; 
                if (itemInCart) {
                    // console.log('already have this item in the cart');
                    // console.log(req.body.cartItems.quantity);
                    condition = { "user": req.user._id, "cartItems.product": addedProduct }
                    //why ...itemInCart don't work if replace req.body.cartItems
                    update = {
                        "$set": {
                            "cartItems.$": cartItem
                        }
                    }
                } else {
                    condition = { "user": req.user._id };
                    update = {
                        "$push": {
                            "cartItems": cartItem
                        }
                    }
                }
                promiseArray.push(runUpdate(condition, update));
            })

            Promise.all(promiseArray)
            .then(response => res.status(201).json({ response }))
            .catch(err => res.status(400).json({ err }));
           
        } else {
            console.log(req.user);
            const newCart = new Cart({
                user: req.user._id,
                cartItems: req.body.cartItems
            });
            newCart.save((err, savedCard) => {
                if(err) return res.status(400).json({ err });
                if(savedCard) return res.status(201).json({ savedCard });
            })
        }
    });
}

exports.getCartItems = (req, res) => {
    Cart.findOne({ user: req.user._id })
    .populate('cartItems.product','_id name price productPics')
    .exec((err, cart) => {
        if(err) return res.status(400).json({ err });
        if(cart){
            let myCartItems = {}
            cart.cartItems.forEach(item => {
                myCartItems[item.product._id.toString()] = {
                    _id: item.product._id.toString(),
                    name: item.product.name,
                    price: item.product.price,
                    productPics: item.product.productPics,
                    quantity: item.quantity
                }
            })
            res.status(200).json({ cartItems: myCartItems })
        }
    })
}

exports.removeCartItem = (req, res) => {
    const {productId} = req.body.payload;
    if(productId){
        Cart.updateOne({
            user: req.user._id
        },
        {
            $pull:{
                cartItems:{
                    product:productId
                }
            }
        }).exec((error, result) => {
            if(error) return res.status(400).json({error});
            if(result) return res.status(202).json({result});
        })
    }
}