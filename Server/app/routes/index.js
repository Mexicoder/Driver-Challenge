// routes/index.js
const noteRoutes = require('./note_routes');
const testRoutes = require('./test_routes');
const routes = require('./routes');
module.exports = function(app, db) {
  noteRoutes(app, db);
  testRoutes(app, db);
  routes(app, db);
  // Other route groups could go here, in the future
};