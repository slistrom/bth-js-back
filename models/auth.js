const db = require("../db/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const auth = {
    login: function (res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        db.get("SELECT * FROM users WHERE email = ?",
            email,
            (err, rows) => {
                if (rows === undefined) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "User not found",
                            detail: "User with provided email not found."
                        }
                    });
                }
                const user = rows;

                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/login",
                                title: "bcrypt error",
                                detail: "bcrypt error"
                            }
                        });
                    }

                    if (result) {
                        let payload = { email: user.email };
                        let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                        return res.json({
                            data: {
                                type: "success",
                                message: "User logged in",
                                user: payload,
                                token: jwtToken
                            }
                        });
                    }

                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "Wrong password",
                            detail: "Password is incorrect."
                        }
                    });
                });
            });
    },

    register: function (res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }
        db.get("SELECT * FROM users WHERE email = ?",
            email,
            (err, rows) => {
                if (rows === undefined) {
                    db.run("INSERT INTO depot (email, value) VALUES (?, ?)",
                        email,
                        0, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    db.run("INSERT INTO inventory (email, prodname, amount) VALUES (?, ?, ?)",
                        email,
                        "amethyst",
                        0, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    db.run("INSERT INTO inventory (email, prodname, amount) VALUES (?, ?, ?)",
                        email,
                        "rosequartz",
                        0, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    db.run("INSERT INTO inventory (email, prodname, amount) VALUES (?, ?, ?)",
                        email,
                        "selenite",
                        0, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    bcrypt.hash(password, 10, function(err, hash) {
                        db.run("INSERT INTO users (email, password) VALUES (?, ?)",
                            email,
                            hash, (err) => {
                                if (err) {
                                    // console.log(err);
                                }
                                return res.status(201).json({
                                    data: {
                                        message: "User successfully registered."
                                    }
                                });
                            });
                    });
                } else {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/register",
                            title: "User already exist",
                            detail: "User with provided email already exist."
                        }
                    });
                }
            });
    },

    checkToken: function (req, res, next) {
        const token = req.headers['x-access-token'];

        // jwt.verify(token, jwtSecret, function(err, decoded) {
        jwt.verify(token, jwtSecret, function(err) {
            if (err) {
                return res.status(401).json({
                    data: {
                        message: "No valid token."
                    }
                });
            }
            // Valid token send on the request
            next();
        });
    }
};

module.exports = auth;
