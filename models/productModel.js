const mongoose = require('mongoose');

var productModel = mongoose.Schema({
    product:{type:JSON,require:true}
})

module.exports = productModel = mongoose.model('Products',productModel);