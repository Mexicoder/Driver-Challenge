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

        console.log(req.body);
        if (req.body && req.body.activeLegID && req.body.legProgress) {
            db.driver = req.body;
            console.log('PUT driver');
            res.send({msg:'success'});
        } else {
            console.log('PUT driver incorrectData');
            res.status(500);
        }
    });

};