const dotenv = require('dotenv').config();
const express = require('express');
var router = express.Router();
const Order = require('../services/orderRoute');

router.use(express.json());

router.route('/orders').get( async (req,res) => {
    try{
        const shop = req.query.shop;
        const orderData = await Order.fetchOrders(shop, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Fetched all Orders")
        res.send(orderData.data)
    } catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
})
.post( async (req,res) => {
    try {
        const shop = req.query.shop;
        const data = req.body;
        const createOrderData = await Order.createOrder(shop, data, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Order Created")
        res.status(200).send({"data":"Order Created Successfully"})
    } catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
})
.put( async (req,res) => {
    try {
        const shop = req.query.shop;
        const id = req.query.id;
        const data = req.body;
        const updateOrderData = await Order.updateOrder(shop, data, id, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Order Updated")
        res.status(200).send({"data":"Order Updated Successfully"})
    } catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
})
.delete( async (req,res) => {
    try {
        const shop = req.query.shop;
        const id = req.query.id;
        const deleteOrderData = await Order.deleteOrder(shop,id,process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Order Deleted")
        res.status(200).send({"data":"Order Deleted Successfully"})
    } catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
});
module.exports = router;