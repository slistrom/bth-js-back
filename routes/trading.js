var express = require('express');
var router = express.Router();

const auth = require("../models/auth.js");
const account = require("../models/account.js");

router.get('/', function(req, res) {
    const data = {
        data: {
            msg:  "See portfolio and start trading."
        }
    };

    res.json(data);
});

router.post("/portfolioget",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => account.portfolioGet(res, req.body));

router.post("/buystock",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => account.buyStock(res, req.body));

router.post("/sellstock",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => account.sellStock(res, req.body));


module.exports = router;
