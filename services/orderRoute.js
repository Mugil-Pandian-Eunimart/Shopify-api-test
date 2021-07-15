const axios = require('axios');

class Order {

    constructor(appUrl) {
        this.appUrl = 'https://0794979b92c9.ngrok.io';
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

    fetchOrders = async (shop,accessToken) => await axios(this.buildOrderDataRequestUrl(shop), {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': accessToken
        }
    });

    createOrder = async (shop,data,accessToken) => await axios(this.buildCreateOrderRequestUrl(shop), {
        method: 'POST',
        headers: {
            'X-Shopify-Access-Token': accessToken
        },
        data
    });

    updateOrder = async (shop,data,id,accessToken) => await axios(this.buildUpdateOrderRequestUrl(shop,id), {
        method: 'PUT',
        headers: {
            'X-Shopify-Access-Token': accessToken
        },
        data
    });

    deleteOrder = async (shop,id,accessToken) => await axios(this.buildDeleteOrderRequestUrl(shop,id), {
        method: 'DELETE',
        headers: {
            'X-Shopify-Access-Token': accessToken
        }
    });
}

module.exports = new Order();