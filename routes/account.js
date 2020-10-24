var express = require('express');
var router = express.Router();

const auth = require("../models/auth.js");
const account = require("../models/account.js");

router.get('/', function(req, res) {
    const data = {
        data: {
            msg:  "See and change account details."
        }
    };

    res.json(data);
});

// router.post("/", (req, res) => {
//     account.saldoGet(res, req.body);
// });

router.post("/",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => account.saldoGet(res, req.body));

// router.post("/saldoupdate", (req, res) => {
//     account.saldoInc(res, req.body);
// });

router.post("/saldoupdate",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => account.saldoInc(res, req.body));


module.exports = router;
