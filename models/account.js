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
    },

    portfolioGet: function (res, body) {
        const email = body.email;

        if (!email) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/account",
                    title: "Email missing",
                    detail: "Email missing in request."
                }
            });
        }

        db.all("SELECT * FROM inventory WHERE email = ?",
            email,
            (err, rows) => {
                if (rows.length === 0) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/account",
                            title: "Inventory empty",
                            detail: "User has no stocks in inventory at the moment."
                        }
                    });
                }
                // console.log(rows);

                return res.json({
                    data: {
                        type: "success",
                        message: "Portfolio retrieved",
                        portfolio: rows
                    }
                });
            });
    },

    buyStock: function (res, body) {
        const email = body.email;
        const prodname = body.prodname;
        const amount = parseFloat(body.amount);
        const price = parseFloat(body.price);

        let saldo;

        if (!email || !prodname || !amount) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/trading",
                    title: "Email, product name or amount missing",
                    detail: "Email, product name or amount missing in request"
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

                saldo = parseFloat(rows.value);
                if (saldo >= (amount*price)) {
                    let newAmount;

                    db.get("SELECT * FROM inventory WHERE email = ? AND prodname = ?",
                        email,
                        prodname,
                        (err, rows) => {
                            newAmount = amount + rows.amount;

                            db.run("UPDATE inventory set amount = ? WHERE email = ? AND prodname = ?",
                                newAmount,
                                email,
                                prodname, (err) => {
                                    if (err) {
                                        // console.log(err);
                                    }
                                    // return res.status(201).json({
                                    //     data: {
                                    //         message: "Inventory successfully updated."
                                    //     }
                                    // });
                                });
                        });

                    let newSaldo = saldo - amount * price;

                    newSaldo = (Math.round(newSaldo * 100) / 100);

                    db.run("UPDATE depot set value = ? WHERE email = ?",
                        newSaldo,
                        email, (err) => {
                            if (err) {
                                // console.log(err);
                            }
                            return res.status(201).json({
                                data: {
                                    message: "Inventory successfully updated."
                                }
                            });
                        });
                } else {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/trading",
                            title: "Insufficient saldo",
                            detail: "Not enough money in saldo to buy stocks."
                        }
                    });
                }
            });
    },

    sellStock: function (res, body) {
        const email = body.email;
        const prodname = body.prodname;
        const amount = parseFloat(body.amount);
        const price = parseFloat(body.price);

        let saldo;
        let oldAmount;

        if (!email || !prodname || !amount) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/trading",
                    title: "Email, product name or amount missing",
                    detail: "Email, product name or amount missing in request"
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
                            source: "/trading",
                            title: "User not found",
                            detail: "User with provided email not found."
                        }
                    });
                }

                saldo = parseFloat(rows.value);

                db.get("SELECT * FROM inventory WHERE email = ? AND prodname = ?",
                    email,
                    prodname,
                    (err, row) => {
                        oldAmount = row.amount;
                        if (oldAmount >= amount) {
                            let newAmount = oldAmount - amount;

                            db.run("UPDATE inventory set amount = ? WHERE email = ? AND prodname = ?",
                                newAmount,
                                email,
                                prodname, (err) => {
                                    if (err) {
                                        // console.log(err);
                                    }
                                    // return res.status(201).json({
                                    //     data: {
                                    //         message: "Inventory successfully updated."
                                    //     }
                                    // });
                                });

                            let newSaldo = saldo + amount * price;

                            newSaldo = (Math.round(newSaldo * 100) / 100);

                            db.run("UPDATE depot set value = ? WHERE email = ?",
                                newSaldo,
                                email, (err) => {
                                    if (err) {
                                        // console.log(err);
                                    }
                                    return res.status(201).json({
                                        data: {
                                            message: "Inventory successfully updated."
                                        }
                                    });
                                });
                        } else {
                            return res.status(401).json({
                                errors: {
                                    status: 401,
                                    source: "/trading",
                                    title: "Insufficient stocks",
                                    detail: "Not enough stocks in portfolio to sell specified amount."
                                }
                            });
                        }
                    });
            });
    }
};

module.exports = account;
