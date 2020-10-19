var express = require('express');
var router = express.Router();
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./db/texts.sqlite');
// const db = require("../db/database.js");
// const bcrypt = require('bcryptjs');

const auth = require("../models/auth.js");


router.get('/', function(req, res, next) {
    const data = {
        data: {
            msg:  "Register a user"
        }
    };

    res.json(data);
});

router.post("/", (req, res) => {
    auth.register(res, req.body);

    // res.status(201).json({
    //     data: {
    //         msg: "Got a POST request"
    //     }
    // });
});

// function register(res, body) {
//     const email = body.email;
//     const password = body.password;
//
//     if (!email || !password) {
//         return res.status(401).json({
//             errors: {
//                 status: 401,
//                 source: "/register",
//                 title: "Email or password missing",
//                 detail: "Email or password missing in request"
//             }
//         });
//     }
//     bcrypt.hash(password, 10, function(err, hash) {
//
//         db.run("INSERT INTO users (email, password) VALUES (?, ?)",
//             email,
//             hash, (err) => {
//                 if (err) {
//                     // console.log(err);
//                 }
//                 return res.status(201).json({
//                     data: {
//                         message: "User successfully registered."
//                     }
//                 });
//             });
//     });
// }

module.exports = router;
