const axios = require('axios');

class Order {

    constructor(appUrl) {
        this.appUrl = 'https://cba19034d359.ngrok.io';
    }

    buildOrderDataRequestUrl(shop) {
        return `https://${shop}/admin/api/2021-07/orders.json?status=any`
    }

    buildCreateOrderRequestUrl(shop) {
        return `https://${shop}/admin/api/2021-07/orders.json`
    }

    buildUpdateOrderRequestUrl(shop,id) {
        return `https://${shop}/admin/api/2021-07/orders/${id}.json`
    }

    buildDeleteOrderRequestUrl(shop,id) {
        return `https://${shop}/admin/api/2021-07/orders/${id}.json`
    }

    async fetchOrders (shop,accessToken) {return await axios(this.buildOrderDataRequestUrl(shop), {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': accessToken
        }
    });}

    async createOrder (shop,data,accessToken) {return await axios(this.buildCreateOrderRequestUrl(shop), {
        method: 'POST',
        headers: {
            'X-Shopify-Access-Token': accessToken
        },
        data
    });}

    async updateOrder (shop,data,id,accessToken) {return await axios(this.buildUpdateOrderRequestUrl(shop,id), {
        method: 'PUT',
        headers: {
            'X-Shopify-Access-Token': accessToken
        },
        data
    });}

    async deleteOrder (shop,id,accessToken) {return await axios(this.buildDeleteOrderRequestUrl(shop,id), {
        method: 'DELETE',
        headers: {
            'X-Shopify-Access-Token': accessToken
        }
    });}
}

module.exports = new Order();