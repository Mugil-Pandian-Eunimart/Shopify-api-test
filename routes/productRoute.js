const dotenv = require('dotenv').config();
const Product = require('../services/productRoute');
const express = require('express');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
var router = express.Router();
const app = express();
router.use(express.json());

const shopifyApiPublicKey = process.env.SHOPIFY_API_PUBLIC_KEY;
const shopifyApiSecretKey = process.env.SHOPIFY_API_SECRET_KEY;
const scopes = "read_products, write_products,read_product_listings,read_customers, write_customers,read_orders, write_orders";
const appUrl = 'http://0794979b92c9.ngrok.io';

router.route('/shopify').get( async (req, res) => {
    const shop = req.query.shop;
    if (!shop) { return res.status(400).send({"Error":"Enter shop name as a query param"})}
    const state = nonce();
    const installShopUrl = Product.buildInstallUrl(shop, state, Product.buildRedirectUri())
    res.cookie('state', state)
    res.redirect(installShopUrl);
});

router.route('/shopify/callback').get( async (req, res) => {
    const { shop, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
    if (state !== stateCookie) { return res.status(403).send('Cannot be verified')}
    const { hmac, ...params } = req.query
    const queryParams = querystring.stringify(params)
    const hash = Product.generateEncryptedHash(queryParams)
    if (hash !== hmac) { return res.status(400).send('HMAC validation failed')}
    try {
        const data = {
            client_id: shopifyApiPublicKey,
            client_secret: shopifyApiSecretKey,
            code
        };
        const tokenResponse = await Product.fetchAccessToken(shop, data)
        const { access_token } = tokenResponse.data
        process.env.SHOPIFY_ACCESS_TOKEN = access_token
        res.status(200).send({"data":"Access token created "})
    } catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
});

router.route('/shop').get( async (req,res) => {
    try{
        const shop = req.query.shop;
        const shopData = await Product.fetchShopData(shop, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Fetched Shop Information")
        res.send(shopData.data)
    }
    catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
})

router.route('/products').get( async (req,res) => {
    try{
        const shop = req.query.shop;
        const productData = await Product.fetchProducts(shop, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Fetched all Products")
        res.send(productData.data)
    }
    catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
})
.post(async (req,res) => {
    try {
        const shop = req.query.shop;
        console.log(req.body)
        const data = req.body;
        const addProductData = await Product.addProduct(shop,data, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Added Product")
        res.status(200).send({"data":"Product added Successfully"})
    } catch (err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
})
.put(async (req,res) => {
    try{
        const shop = req.query.shop;
        const productId = req.query.id;
        const data = req.body;
        const updateProductData = await Product.updateProduct(shop, productId,data, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Updated Product for id : "+productId)
        res.status(200).send({"data":"Product updated Successfully"})
    } catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
})
.delete(async (req,res) => {
    try{
        const shop = req.query.shop;
        const productId = req.query.id;
        const deleteProductData = await Product.deleteProduct(shop, productId, process.env.SHOPIFY_ACCESS_TOKEN)
        console.log("Deleted Product for id : "+productId)
        res.status(200).send({"data":"Product deleted Successfully"})
    }catch(err) {
        console.log(err)
        res.status(500).send("Error: "+err)
    }
})

module.exports = router;