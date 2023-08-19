const routes = require('express').Router();

const TransationController = require('../controllers/TransationController');

routes.get('/', TransationController.index);
routes.get('/:id', TransationController.show);
routes.post('/', TransationController.create);
routes.put('/:id', TransationController.update);
routes.delete('/:id', TransationController.destroy);

routes.post('/reembolso/:id', TransationController.reembolso);

module.exports = routes;
