module.exports = function (app, db) {


    // get list of legs
    app.get('/legs', (req, res) => {
        console.log('GET legs');
        res.send(db.legs);
    });

    // get list of stops
    app.get('/stops', (req, res) => {
        console.log('GET stops');
        res.send(db.stops);
    });

    // get driver's current location
    app.get('/driver', (req, res) => {
        console.log('GET driver');
        res.send(db.driver);
    });
    // get driver's current location
    app.put('/test', (req, res) => {
        console.log('test');
        req.send('test');
        res.send(db.driver);
    });

    // update the driver's current position
    app.put('/driver', (req, res) => {
        // req.
        if(req.data.activeLegID && req.data.legProgress){
            db.driver = req.data;
        }
        req
        console.log('PUT driver');
    });

};

// https://expressjs.com/en/guide/routing.html
// var express = require('express')
// var router = express.Router()

// // middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })
// // define the home page route
// router.get('/', function (req, res) {
//   res.send('Birds home page')
// })
// // define the about route
// router.get('/about', function (req, res) {
//   res.send('About birds')
// })

// module.exports = router