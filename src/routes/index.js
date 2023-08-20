const routes = require('express').Router();
const userRoutes = require('././user.routes');
const transationsRoutes = require('./transations.routes')
const notificationsRoutes = require('./notifications.routes')

routes.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'API rodando!'
    });
});

routes.use('/users', userRoutes);
routes.use('/transaction', transationsRoutes);
routes.use('/notifications', notificationsRoutes);

module.exports = routes
