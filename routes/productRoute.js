const dotenv = require('dotenv').config();
const Product = require('../services/productRoute');
const express = require('express');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
var router = express.Router();

const shopifyApiPublicKey = process.env.SHOPIFY_API_PUBLIC_KEY;
const shopifyApiSecretKey = process.env.SHOPIFY_API_SECRET_KEY;
const scopes = "read_products, write_products,read_product_listings,read_customers, write_customers,read_orders, write_orders";
const appUrl = 'http://0794979b92c9.ngrok.io';

router.route('/shopify').get( async (req, res) => {
    const shop = req.query.shop;
    if (!shop) { return res.status(400).send('no shop')}
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
      // const shopData = await fetchShopData(shop, access_token)
    //   const addProductData = await Product.addProduct(shop, access_token)
      const productData = await Product.fetchProducts(shop, access_token)
      res.send(productData.data)
    } catch(err) {
      console.log(err)
      res.status(500).send('something went wrong')
    }
});

module.exports = router;