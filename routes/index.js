var express = require('express');
var router = express.Router();

const metext = `API is up and running.`;

router.get('/', function(req, res) {
    const data = { message: metext };

    res.json(data);
});

module.exports = router;
