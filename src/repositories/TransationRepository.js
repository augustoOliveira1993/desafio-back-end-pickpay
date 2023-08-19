const {Transations, Users} = require('../models');

class TransationRepository {
    constructor() {
        this.model = Transations;
    }

    async create(data) {
        return new Promise((resolve, reject) => {
            this.model.create(data)
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    async index() {
        return new Promise((resolve, reject) => {
            this.model.findAll({
                include: [
                    {
                        model: Users, // Substitua 'models' pelo objeto correto de modelos Sequelize que você está usando.
                        as: 'sender', // Alias para o relacionamento com o remetente
                    },
                    {
                        model: Users, // Substitua 'models' pelo objeto correto de modelos Sequelize que você está usando.
                        as: 'receiver', // Alias para o relacionamento com o destinatário
                    },
                ],
            })
                .then((users) => {
                    resolve(users);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    async show(id) {
        return new Promise((resolve, reject) => {
            this.model.findByPk(id)
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    async update(id, data) {
        return new Promise((resolve, reject) => {
            this.model.update(data, {
                where: {
                    id
                }
            })
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    async destroy(id) {
        return new Promise((resolve, reject) => {
            this.model.destroy({
                where: {
                    id
                }
            })
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            this.model.findOne({
                where: {
                    email
                }
            })
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    async findByDocument(document) {
        return new Promise((resolve, reject) => {
            this.model.findOne({
                where: {
                    document
                }
            })
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }
}

module.exports = new TransationRepository();
