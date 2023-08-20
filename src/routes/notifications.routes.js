const routes = require('express').Router();

const NotificationsController = require('../controllers/NotificationsController');

routes.get('/', NotificationsController.index);
routes.get('/:id', NotificationsController.show);
routes.post('/', NotificationsController.create);
routes.put('/:id', NotificationsController.update);
routes.delete('/:id', NotificationsController.destroy);

module.exports = routes;
