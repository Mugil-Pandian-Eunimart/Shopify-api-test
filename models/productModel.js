const mongoose = require('mongoose');

var productModel = mongoose.Schema({
    product:{type:JSON,require:true}
})

var productModel = mongoose.model('productModel',productModel,'Products');

module.exports = productModel;