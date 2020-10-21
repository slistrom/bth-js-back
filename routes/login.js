var express = require('express');
var router = express.Router();

const auth = require("../models/auth.js");

router.get('/', function(req, res) {
    const data = {
        data: {
            msg:  "Login a user"
        }
    };

    res.json(data);
});

router.post("/", (req, res) => {
    auth.login(res, req.body);
});

module.exports = router;
