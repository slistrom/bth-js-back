var express = require('express');
var router = express.Router();
// const sqlite3 = require('sqlite3').verbose();
// const db = require("../db/database.js");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
//
// const jwtSecret = process.env.JWT_SECRET;

const auth = require("../models/auth.js");

router.get('/', function(req, res, next) {
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

// function login(res, body) {
//     const email = body.email;
//     const password = body.password;
//
//     if (!email || !password) {
//         return res.status(401).json({
//             errors: {
//                 status: 401,
//                 source: "/login",
//                 title: "Email or password missing",
//                 detail: "Email or password missing in request"
//             }
//         });
//     }
//
//     db.get("SELECT * FROM users WHERE email = ?",
//         email,
//         (err, rows) => {
//         if (rows === undefined) {
//             return res.status(401).json({
//                 errors: {
//                     status: 401,
//                     source: "/login",
//                     title: "User not found",
//                     detail: "User with provided email not found."
//                 }
//             });
//         }
//         const user = rows;
//
//         bcrypt.compare(password, user.password, (err, result) => {
//             if (err) {
//                 return res.status(500).json({
//                     errors: {
//                         status: 500,
//                         source: "/login",
//                         title: "bcrypt error",
//                         detail: "bcrypt error"
//                     }
//                 });
//             }
//
//             if (result) {
//                 let payload = { email: user.email };
//                 let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
//
//                 return res.json({
//                     data: {
//                         type: "success",
//                         message: "User logged in",
//                         user: payload,
//                         token: jwtToken
//                     }
//                 });
//             }
//
//             return res.status(401).json({
//                 errors: {
//                     status: 401,
//                     source: "/login",
//                     title: "Wrong password",
//                     detail: "Password is incorrect."
//                 }
//             });
//         });
//     });
// }

module.exports = router;
