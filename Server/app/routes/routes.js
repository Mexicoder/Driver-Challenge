module.exports = function (app, db) {


    // get list of legs
    app.get('/legs', (req, res) => {
        console.log()
        res.send(db.legs)
    });

    // get list of stops
    app.get('/stops', (req, res) => {
        console.log()
        res.send(db.stops)
    });

    // get driver's current location
    app.get('/driver', (req, res) => {
        console.log()
        res.send("get legs")
    });

    // update the driver's current position
    app.put('/driver', (req, res) => {
        console.log()
        res.send("get legs")
    });



};