const {User} = require('../models');

class UserController {
    constructor() {
        this.model = User;
    }

    async create(req, res) {
      return res.status(200).json({ message: `Router Create: ${req.body}` });
    }

    async index(req, res) {
        return res.status(200).json({ message: 'Router index' });
    }

    async show(req, res) {
        const { id } = req.params;
        return res.status(200).json({ message: `Router show: ${id}` });
    }

    async update(req, res) {
        const { id } = req.params;
        const userData = req.body;
        return res.status(200).json({ message: `Router update: params: ${req.params} - body: ${req.body}` });
    }

    async destroy(req, res) {
        const { id } = req.params;
        return res.status(200).json({ message: `Router destroy: ${id}` });
    }
}

module.exports = new UserController();
