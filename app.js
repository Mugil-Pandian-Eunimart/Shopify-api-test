const express = require('express');
const ProductRoute = require('./routes/productRoute')
const dotenv = require('dotenv').config();
const app = express();
const PORT = 8080

// app.get('/shopify', (req, res) => {
//   const shop = req.query.shop;

//   if (!shop) { return res.status(400).send('no shop')}

//   const state = nonce();

//   const installShopUrl = Product.buildInstallUrl(shop, state, Product.buildRedirectUri())

//   res.cookie('state', state) // should be encrypted in production
//   res.redirect(installShopUrl);
// });

// app.get('/shopify/callback', async (req, res) => {
//   const { shop, code, state } = req.query;
//   const stateCookie = cookie.parse(req.headers.cookie).state;

//   if (state !== stateCookie) { return res.status(403).send('Cannot be verified')}

//   const { hmac, ...params } = req.query
//   const queryParams = querystring.stringify(params)
//   const hash = Product.generateEncryptedHash(queryParams)

//   if (hash !== hmac) { return res.status(400).send('HMAC validation failed')}

//   try {
//     const data = {
//       client_id: shopifyApiPublicKey,
//       client_secret: shopifyApiSecretKey,
//       code
//     };
//     const tokenResponse = await Product.fetchAccessToken(shop, data)

//     const { access_token } = tokenResponse.data
//     acc=access_token
//     // const shopData = await fetchShopData(shop, access_token)
//     const addProductData = await Product.addProduct(shop, access_token)
//     const productData = await Product.fetchProducts(shop, access_token)
//     // const saveData = JSON.parse(shopData.data.shop)
//     // console.log(saveData)
//     res.send(productData.data)

//   } catch(err) {
//     console.log(err)
//     res.status(500).send('something went wrong')
//   }
// });

app.use('/',ProductRoute)
app.listen(PORT, () => console.log(`listening on port ${PORT}`));