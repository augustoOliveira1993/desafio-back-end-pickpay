const TransationRepository = require('../repositories/TransationRepository');
const UserRepository = require('../repositories/UserRepository');
const {BadRequestError, AppError} = require("../errors/AppError");
const axios = require("axios");
class UserService {
    constructor() {
        this.repository = TransationRepository;
        this.userRepository = UserRepository;
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
        const senderBalance = parseInt(sender.balance) - amount;
        const receiverBalance = parseInt(receiver.balance) + amount;

        await this.userRepository.update(sender_user_id, {balance: parseInt(senderBalance)});
        await this.userRepository.update(receiver_user_id, {balance: parseInt(receiverBalance)});

       const isAutorization =  await axios.get('https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6')
            .then(function (response) {
                if (response.data.message !== 'Autorizado') {
                    return false
                }
                return true
            })
        const statusTrazation = isAutorization ? 'APROVADA' : 'CANCELADA';
        await this.repository.create({
            sender_user_id,
            receiver_user_id,
            amount: amount,
            status: statusTrazation
        });

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
        await this.repository.update(id, data)
        return {
            success: true,
            message: 'Transferência atualizado com sucesso'
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
        if (transation.status !== 'APROVADA') {
            throw new AppError('Transação não pode ser reembolsada', 400);
        }
        const sender = await this.userRepository.show(transation.sender_user_id);
        const receiver = await this.userRepository.show(transation.receiver_user_id);

        const senderBalance = parseInt(sender.balance) + parseInt(transation.amount);
        const receiverBalance = parseInt(receiver.balance) - parseInt(transation.amount);

        await this.userRepository.update(transation.sender_user_id, {balance: parseInt(senderBalance)});
        await this.userRepository.update(transation.receiver_user_id, {balance: parseInt(receiverBalance)});

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
}

module.exports = new UserService();
