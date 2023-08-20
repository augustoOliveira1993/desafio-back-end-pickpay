const {Notifications, Users} = require('../models');

class NotificationsRepository {
    constructor() {
        this.model = Notifications;
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
                        as: 'user', // Alias para o relacionamento com o remetente
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
            this.model.findByPk(id, {
                include: [
                    {
                        model: Users, // Substitua 'models' pelo objeto correto de modelos Sequelize que você está usando.
                        as: 'user', // Alias para o relacionamento com o remetente
                    },
                ],
            })
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

}

module.exports = new NotificationsRepository();
