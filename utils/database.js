const mongoose = require('mongoose');

const dbConnectionUrl = "mongodb+srv://root:root@maincluster.vghnr.mongodb.net/ProductDatabase?retryWrites=true&w=majority";

mongoose.connect(dbConnectionUrl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

module.exports =db;
