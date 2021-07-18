const dotenv = require('dotenv').config();
const express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const Order = require('../services/orderRoute');

router.use(express.json());

router.route('/orders').get( async (req,res) => {
    try{
        const shop = req.query.shop;
        const orderData = await Order.fetchOrders(shop, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Fetched all Orders")
        MongoClient.connect(process.env.MONGODB_URI,function (err,db){
            if (err) throw err;
            var dbo = db.db("ProductDatabase")
            dbo.collection("Orders").deleteMany({},function(err,res){
                if (err) throw err;
            });
            dbo.collection("Orders").insertOne(
                orderData.data
            ,function(err,res){
                if (err) throw err;
                console.log("Values Inserted");
                db.close();
            })
        })
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