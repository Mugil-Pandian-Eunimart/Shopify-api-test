var express = require("express");
var router = express.Router();
let nonce = require("nonce")();
let querystring = require("querystring");
let request = require("request-promise");
const SHOPIFY_API_KEY = "36ff759e2527ed510050612a3e3e7344"
const SHOPIFY_API_SECRET = "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"
const SCOPE = "write_orders,read_customers"
const HOME_URL = "https://localhost"

router.get("/shopify", (req, res) => {
  let shopName = req.query.shop;
  if (shopName) {
    let homeUrl = HOME_URL;
    let apiKey = SHOPIFY_API_KEY;
    let scope = SCOPE;
    let state = nonce();
    let installUrl =
      "https://" +
      shopName +
      ".myshopify.com/admin/oauth/authorize?client_id=" +
      apiKey +
      "&scope=" +
      scope +
      "&redirect_uri=" +
      homeUrl +
      "/shopify/auth&state=" +
      state +
      "&grant_options[]=per-user";
    //res.cookie('state',state);
    res.redirect(installUrl);
  } else {
    res.status(404).send("Shop Name Required");
  }
});

router.get("/shopify/auth", (req, res) => {
  let { shop, hmac, code, state } = req.query;

  if (shop && hmac && code) {
    console.log("Every Parameters Recieved Successfully");

    const map = Object.assign({}, req.query);
    delete map["hmac"];
    const message = querystring.stringify(map);

    let acccessTokenRequesrUrl =
      "https://" + shop + "/admin/oauth/access_token";
    let accessTokenPayLoad = {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    };

    request
      .post(acccessTokenRequesrUrl, { json: accessTokenPayLoad })
      .then((accessTokenResponse) => {
        let access_token = accessTokenResponse.access_token;
        console.log("Access Token " + access_token);

        //Geeting List of Products in the Store  using Api Call
        let apiRequestUrl =
          "https://" + shop + "/admin/api/2021-07/products.json";
        let apiRequestHeader = {
          "X-Shopify-Access-Token": access_token,
        };

        request
          .get(apiRequestUrl, { headers: apiRequestHeader })
          .then((apiResponse) => {
            console.log("Products Retrieved Successfully");
            res.end(apiResponse);
          })
          .catch((err) => {
            console.log("Some Error Occured During Products Retrieval");
            res.status(404).send("Something Went Wrong" + err);
          });
      });
  } else {
    res.status(404).send("Required Parameters Missing");
  }
});

module.exports = router;
