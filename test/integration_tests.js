process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
var assert = require("assert");

let token = null;

chai.should();

chai.use(chaiHttp);

describe('Login', () => {
    describe('GET /login', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/login")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('Should get 401 as user and pass is wrong', (done) => {
            let user = {
                email: "test@example.com",
                password: "123test",
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    done();
                });
        });
    });
});

describe('Register and test functionality', () => {
    describe('GET /register', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/register")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('POST /register', () => {
        it('200 HAPPY PATH', (done) => {
            let user = {
                email: "test@example.com",
                password: "123test",
            };

            chai.request(server)
                .post("/register")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");

                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('Should get 200 as user and pass is just created', (done) => {
            let user = {
                email: "test@example.com",
                password: "123test",
            };

            chai.request(server)
                .post("/login")
                .send(user)
                .end((err, res) => {
                    // console.log("token: " + token);
                    // console.log(res);
                    token = res.body.data.token;
                    // console.log("token: " + token);
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });

    describe('POST /account/saldoupdate', () => {
        it('Should get 201 as user has been created', (done) => {
            let user = {
                email: "test@example.com",
                increase: 100
            };

            chai.request(server)
                .post("/account/saldoupdate")
                .set('x-access-token', token)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });

    describe('POST /account', () => {
        it('Should get a reply that saldo is 100', (done) => {
            let user = {
                email: "test@example.com"
            };

            chai.request(server)
                .post("/account")
                .set('x-access-token', token)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    assert.equal(res.body.data.saldo, 100);
                    done();
                });
        });
    });

    describe('POST /trading/buystock', () => {
        it('Should get a reply 201 that purchase of stock was successful', (done) => {
            let user = {
                email: "test@example.com",
                prodname: "amethyst",
                amount: 1,
                price: 10
            };

            chai.request(server)
                .post("/trading/buystock")
                .set('x-access-token', token)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });

    describe('POST /trading/sellstock', () => {
        it('Should get a reply 201 that sale of stock was successful', (done) => {
            let user = {
                email: "test@example.com",
                prodname: "amethyst",
                amount: 1,
                price: 10
            };

            chai.request(server)
                .post("/trading/sellstock")
                .set('x-access-token', token)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
});
