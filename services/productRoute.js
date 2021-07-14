const crypto = require('crypto');
const axios = require('axios');

class Product {

    constructor(scopes,appUrl,shopifyApiPublicKey,shopifyApiSecretKey) {
        this.scopes = "read_products, write_products,read_product_listings,read_customers, write_customers,read_orders, write_orders";
        this.appUrl = 'http://0794979b92c9.ngrok.io';
        this.shopifyApiPublicKey = process.env.SHOPIFY_API_PUBLIC_KEY;
        this.shopifyApiSecretKey = process.env.SHOPIFY_API_SECRET_KEY;
    }

    buildRedirectUri () {
        return `${this.appUrl}/shopify/callback`;
    }
    
    // buildRedirectUri = () => `${this.appUrl}/shopify/callback`;

    buildInstallUrl(shop, state, redirectUri) {
        return `https://${shop}/admin/oauth/authorize?client_id=${this.shopifyApiPublicKey}&scope=${this.scopes}&state=${state}&redirect_uri=${redirectUri}`;
    }

    buildAccessTokenRequestUrl(shop){
        return `https://${shop}/admin/oauth/access_token`;
    }

    buildShopDataRequestUrl(shop){
        return `https://${shop}/admin/shop.json`;
    }

    buildProductDataRequestUrl(shop){
        return `https://${shop}/admin/api/2021-07/products.json`;
    }

    buildProductAddRequestUrl(shop){
        return `https://${shop}/admin/api/2021-07/products.json`
    }
    
    buildProductUpdateRequestUrl(shop,productId){
        return `https://${shop}/admin/api/2021-07/products/${productId}.json`
    }

    generateEncryptedHash(params){
        return crypto.createHmac('sha256', this.shopifyApiSecretKey).update(params).digest('hex');
    }

    fetchAccessToken = async (shop, data) => await axios(this.buildAccessTokenRequestUrl(shop), {
        method: 'POST',
        data
    });

    fetchShopData = async (shop, accessToken) => await axios(this.buildShopDataRequestUrl(shop), {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': accessToken
        }
    });

    fetchProducts = async (shop, accessToken) => await axios(this.buildProductDataRequestUrl(shop), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' ,
            'X-Shopify-Access-Token': accessToken
        }
    });

    addProduct = async (shop,accessToken) => await axios(this.buildProductAddRequestUrl(shop), {
        method: 'POST',
        headers: {
            'X-Shopify-Access-Token': accessToken
        },
        data: {
            "product": {
                "title": "Burton Custom Freestyle 151",
                "body_html": "<strong>Good snowboard!</strong>",
                "vendor": "Burton",
                "product_type": "Snowboard",
                "tags": [
                  "Barnes & Noble",
                  "Big Air",
                  "John's Fav"
                ]
              }
        }
    });

    updateProduct = async (shop, productId, accessToken) => await axios(this.buildProductUpdateRequestUrl(shop,productId), {
        method:'PUT',
        headers: {
            'X-Shopify-Access-Token': accessToken
        },
        data: {
            "product": {
                "id": productId,
                "title": "New product title"
            }
        }
    })
}

module.exports = new Product();