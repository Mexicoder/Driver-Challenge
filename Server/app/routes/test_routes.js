module.exports = function(app, db) {
    app.post('/test', (req, res) => {
        // You'll create your note here.
        console.log(req.body.num)
        res.send(db.legs)
      });
};