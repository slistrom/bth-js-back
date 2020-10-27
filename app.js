const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 1339;

require('dotenv').config();

// var http = require('http').Server(app);
// const io = require('socket.io')(http);
const stock = require("./models/stock.js");

const index = require('./routes/index');
const register = require('./routes/register');
const login = require('./routes/login');
const account = require('./routes/account');
const trading = require('./routes/trading');


var amethyst = {
    name: "Amethyst",
    rate: 1.00002,
    variance: 0.3,
    startingPoint: 20,
};

var rosequartz = {
    name: "Rosequartz",
    rate: 1.00001,
    variance: 0.2,
    startingPoint: 20,
};

var selenite = {
    name: "Selenite",
    rate: 1.00003,
    variance: 0.1,
    startingPoint: 20,
};

var crystals = [amethyst, rosequartz, selenite];

app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.origins(['https://trading.listrom.me:443', 'http://localhost:3000']);

// don't show the log when it is test
if (process.env.NODE_ENV !== 'development') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}


// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Imported routes
app.use('/', index);
app.use('/register/', register);
app.use('/login/', login);
app.use('/account/', account);
app.use('/trading/', trading);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
// if(!module.parent){
//     app.listen(process.env.PORT, () =>
//         console.log(`Example app listening on port ${process.env.PORT}!`),
//     );
// }

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

setInterval(function () {
    crystals.map((crystal) => {
        crystal["startingPoint"] = stock.getStockPrice(crystal);
        return crystal;
    });

    // console.log(cakes);

    io.emit("stocks", crystals);
}, 5000);

// const server = app.listen(port, () => console.log(`Backend API listening on port ${port}!`));
server.listen(port, () => console.log(`Backend API listening on port ${port}!`));

module.exports = server;

