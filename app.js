let express = require('express');
let session = require('express-session');
let cookie = require('cookie');
let productRoute = require('./routes/productRoute');
let app = express();

app.use('/',productRoute)

app.listen(process.env.PORT || 3000 , ()=>{
    console.log("Server Started Successfully At Port Number : " + 3000);
});