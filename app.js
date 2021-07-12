///////////// Initial Setup /////////////

const dotenv = require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const axios = require('axios');

const shopifyApiPublicKey = process.env.SHOPIFY_API_PUBLIC_KEY;
const shopifyApiSecretKey = process.env.SHOPIFY_API_SECRET_KEY;
const scopes = "read_products, write_products,read_product_listings,read_customers, write_customers,read_orders, write_orders";
const appUrl = 'http://0794979b92c9.ngrok.io';

const app = express();
const PORT = 8080

app.get('/', (req, res) => {
  res.send('Ello Govna')
});

///////////// Helper Functions /////////////

const buildRedirectUri = () => `${appUrl}/shopify/callback`;

const buildInstallUrl = (shop, state, redirectUri) => `https://${shop}/admin/oauth/authorize?client_id=${shopifyApiPublicKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;

const buildAccessTokenRequestUrl = (shop) => `https://${shop}/admin/oauth/access_token`;

const buildShopDataRequestUrl = (shop) => `https://${shop}/admin/shop.json`;

const buildProductDataRequestUrl = (shop) => `https://${shop}/admin/api/2021-07/products.json`;

const generateEncryptedHash = (params) => crypto.createHmac('sha256', shopifyApiSecretKey).update(params).digest('hex');

const fetchAccessToken = async (shop, data) => await axios(buildAccessTokenRequestUrl(shop), {
  method: 'POST',
  data
});

const fetchShopData = async (shop, accessToken) => await axios(buildShopDataRequestUrl(shop), {
  method: 'GET',
  headers: {
    'X-Shopify-Access-Token': accessToken
  }
});

const fetchProducts = async (shop, accessToken) => await axios(buildProductDataRequestUrl(shop), {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json' ,
        'X-Shopify-Access-Token': accessToken
    }
  });

///////////// Route Handlers /////////////

app.get('/shopify', (req, res) => {
  const shop = req.query.shop;

  if (!shop) { return res.status(400).send('no shop')}

  const state = nonce();

  const installShopUrl = buildInstallUrl(shop, state, buildRedirectUri())

  res.cookie('state', state) // should be encrypted in production
  res.redirect(installShopUrl);
});

app.get('/shopify/callback', async (req, res) => {
  const { shop, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) { return res.status(403).send('Cannot be verified')}

  const { hmac, ...params } = req.query
  const queryParams = querystring.stringify(params)
  const hash = generateEncryptedHash(queryParams)

  if (hash !== hmac) { return res.status(400).send('HMAC validation failed')}

  try {
    const data = {
      client_id: shopifyApiPublicKey,
      client_secret: shopifyApiSecretKey,
      code
    };
    const tokenResponse = await fetchAccessToken(shop, data)

    const { access_token } = tokenResponse.data

    // const shopData = await fetchShopData(shop, access_token)
    const productData = await fetchProducts(shop, access_token)
    // const saveData = JSON.parse(shopData.data.shop)
    // console.log(saveData)
    res.send(productData.data)

  } catch(err) {
    console.log(err)
    res.status(500).send('something went wrong')
  }
});

///////////// Start the Server /////////////
app.listen(PORT, () => console.log(`listening on port ${PORT}`));