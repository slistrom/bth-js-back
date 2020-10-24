const db = require("../db/database.js");

const account = {
    saldoInc: function (res, body) {
        const email = body.email;
        const increase = body.increase;
        let oldvalue = 0;

        if (!email || !increase) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/account",
                    title: "Email or increase value missing",
                    detail: "Email or increase value missing in request"
                }
            });
        }

        db.get("SELECT * FROM depot WHERE email = ?",
            email,
            (err, rows) => {
                if (rows === undefined) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/account",
                            title: "User not found",
                            detail: "User with provided email not found."
                        }
                    });
                }

                oldvalue = rows.value;
                let newvalue = parseFloat(oldvalue) + parseFloat(increase);

                db.run("UPDATE depot set value = ? WHERE email = ?",
                    newvalue,
                    email, (err) => {
                        if (err) {
                            // console.log(err);
                        }
                        return res.status(201).json({
                            data: {
                                message: "Depot saldo successfully increased."
                            }
                        });
                    });
            });
    },

    saldoGet: function (res, body) {
        const email = body.email;

        if (!email) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/account",
                    title: "Email missing",
                    detail: "Email missing in request"
                }
            });
        }

        db.get("SELECT * FROM depot WHERE email = ?",
            email,
            (err, rows) => {
                if (rows === undefined) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/account",
                            title: "User not found",
                            detail: "User with provided email not found."
                        }
                    });
                }

                // let payload = { saldo: rows.value };

                return res.json({
                    data: {
                        type: "success",
                        message: "Saldo retrieved",
                        saldo: rows.value
                    }
                });
            });
    }
};

module.exports = account;
