// server.js
const express = require('express');
// const MongoClient    = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const data = require('./app/data');


const port = 8000;

let driver = {
    "activeLegID": "FG",
    "legProgress": "33"
};



app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app, data);
app.listen(port, () => {
    console.log('We are live on ' + port);
});