const routes = require('next-routes')();

routes.add('/reservations/:address', '/reservations/show');

module.exports = routes;
