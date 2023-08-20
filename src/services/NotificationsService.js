const NotificationsRepository = require('../repositories/NotificationsRepository');
const {BadRequestError, AppError} = require("../errors/AppError");

class UserService {
    constructor() {
        this.repository = NotificationsRepository;
    }

    async create(data) {
        return {
            success: true,
            message: 'Notificação criado com sucesso',
            data: await this.repository.create(data)
        }
    }

    async index() {
        return await this.repository.index()
    }

    async show(id) {
        return await this.repository.show(id)
    }

    async update(id, data) {
        await this.repository.update(id, data)
        return {
            success: true,
            message: 'Notificação atualizado com sucesso',
            data: await this.repository.show(id)
        }
    }

    async destroy(id) {
        await this.repository.destroy(id)
        return {
            success: true,
            message: 'Notificação deletado com sucesso',
            id,
        }
    }

    async sendNotification(data) {
        const {title, message, user_id, type} = data;
        if (!title || !message || !user_id) {
            throw new BadRequestError('Dados inválidos');
        }
        const notification = await this.repository.create({
            type,
            title,
            message,
            user_id
        })
        return {
            success: true,
            message: 'Notificação enviada com sucesso',
            data: notification
        }
    }
}

module.exports = new UserService();
