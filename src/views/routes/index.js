const routes = require('express').Router();
const userRoutes = require('././user.routes');

routes.use('/users', userRoutes);

module.exports = routes
