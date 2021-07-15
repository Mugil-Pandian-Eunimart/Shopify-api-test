const express = require('express');
const ProductRoute = require('./routes/productRoute')
const OrderRoute = require('./routes/orderRoute')
const dotenv = require('dotenv').config();
const app = express();

const PORT = 8080

// << db setup >>
// const mongoose = require("./utils/database");

app.use('/',ProductRoute)
app.use('/',OrderRoute)
app.listen(PORT, () => console.log(`listening on port ${PORT}`));