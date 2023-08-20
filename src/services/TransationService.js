const TransationRepository = require('../repositories/TransationRepository');
const UserRepository = require('../repositories/UserRepository');
const NotificationsService = require('./NotificationsService');
const {BadRequestError, AppError} = require("../errors/AppError");
const axios = require("axios");
class UserService {
    constructor() {
        this.repository = TransationRepository;
        this.userRepository = UserRepository;
        this.notificationsService = NotificationsService;
    }

    async create(data) {
        let {sender_user_id, receiver_user_id, amount} = data;
        const sender = await this.userRepository.show(sender_user_id);
        const receiver = await this.userRepository.show(receiver_user_id);

        amount = parseInt(amount.replace(/\D/g, ''));
        if (sender_user_id === receiver_user_id) {
            throw new BadRequestError('Não é possível transferir para você mesmo');
        }
        if (sender.is_merchant) {
            throw new BadRequestError('Não é possível transferir de uma conta de lojista');
        }

        if (sender.balance < amount || amount > sender.balance) {
            throw new BadRequestError('Saldo insuficiente');
        }

        if (amount <= 0) {
            throw new BadRequestError('Valor inválido');
        }
        if (!receiver) {
            throw new BadRequestError('Receiver não encontrado');
        }
        if (!sender) {
            throw new BadRequestError('Sender não encontrado');
        }

        const isAutorization =  await axios.get('https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6')
            .then(function (response) {
                return response.data.message === 'Autorizado';

            })
        if (!isAutorization) {
            throw new BadRequestError('Transferência não autorizada pelo serviço externo.');
        }
        const senderBalance = parseInt(sender.balance) - amount;
        const receiverBalance = parseInt(receiver.balance) + amount;

        await this.userRepository.saqueBalance(sender_user_id, parseInt(senderBalance));
        await this.userRepository.depositoBalance(receiver_user_id, parseInt(receiverBalance));

        const statusTrazation = isAutorization ? 'APROVADA' : 'CANCELADA';
        await this.repository.create({
            sender_user_id,
            receiver_user_id,
            amount: amount,
            status: statusTrazation
        });

        if (isAutorization) {
           await this.sendNotification(sender_user_id, {
                title: 'Transação realizada com sucesso',
                body: `Transação de R$${amount} realizada com sucesso`
            })
            await this.sendNotification(receiver_user_id, {
                title: 'Você recebeu uma transação',
                body: `Você recebeu uma transação de R$${amount}`
            })
        }

        return {
            success: true,
            message: 'Transferência realizada com sucesso',
            data: {
                sender: {
                    id: sender.id,
                    full_name: sender.full_name,
                    balance: senderBalance

                },
                receiver: {
                    id: receiver.id,
                    full_name: receiver.full_name,
                    balance: receiverBalance
                },
                amount,
                status: statusTrazation
            }
        }
    }

    async index() {
        return await this.repository.index()
    }

    async show(id) {
        return await this.repository.show(id)
    }

    async update(id, data) {
        await this.repository.update(id, {
            status: data.status
        })
        return {
            success: true,
            message: 'Transferência atualizado com sucesso',
            data: await this.repository.show(id)
        }
    }

    async destroy(id) {
        await this.repository.destroy(id)
        return {
            success: true,
            message: 'Transferência deletado com sucesso'
        }
    }

    async reembolso(id) {
        const transation = await this.repository.show(id);
        if (!transation) {
            throw new AppError('Transação não encontrada', 400);
        }
        if (transation.status === 'REEMBOLSADA') {
            throw new AppError('Transação já foi reembolsada', 400);
        }
        if (transation.status !== 'APROVADA') {
            throw new AppError('Transação não pode ser reembolsada', 400);
        }
        const sender = await this.userRepository.show(transation.sender_user_id);
        const receiver = await this.userRepository.show(transation.receiver_user_id);

        if (receiver.balance < transation.amount || transation.amount > receiver.balance) {
            throw new BadRequestError('Receiver não possui saldo suficiente para reembolso');
        }
        const senderBalance = parseInt(sender.balance) + parseInt(transation.amount);
        const receiverBalance = parseInt(receiver.balance) - parseInt(transation.amount);

        await this.userRepository.saqueBalance(transation.sender_user_id, parseInt(senderBalance));
        await this.userRepository.depositoBalance(transation.receiver_user_id, parseInt(receiverBalance));

        await this.repository.update(id, {status: 'REEMBOLSADA'});

        return {
            success: true,
            message: 'Reembolso realizado com sucesso',
            data: {
                sender: {
                    id: sender.id,
                    full_name: sender.full_name,
                    balance: senderBalance

                },
                receiver: {
                    id: receiver.id,
                    full_name: receiver.full_name,
                    balance: receiverBalance
                },
                amount: transation.amount,
                status: 'REEMBOLSADA'
            }
        }
    }

    async sendNotification(id, dataMessage) {
        await this.notificationsService.sendNotification({
            title: dataMessage.title,
            message: dataMessage.body,
            user_id: id,
            type: 'transfer'
        })
        // await axios.post('https://o4d9z.mocklab.io/notify', {
        //     id_user: id,
        //     ...dataMessage
        // })
    }
}

module.exports = new UserService();
