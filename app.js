const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 1339;

require('dotenv').config();

const index = require('./routes/index');
const register = require('./routes/register');
const login = require('./routes/login');
const account = require('./routes/account');

app.use(cors());

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

const server = app.listen(port, () => console.log(`Backend API listening on port ${port}!`));

module.exports = server;
