'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Notifications', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            uuid: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            type: {
                type: Sequelize.STRING
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            message: {
                type: Sequelize.TEXT, // Mensagem da notificação
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER, // Chave estrangeira para o usuário ou lojista que receberá a notificação
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            status: {
                type: Sequelize.ENUM('SENT', 'FAILED'), // Status do envio da notificação
                allowNull: false,
                defaultValue: 'SENT',
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Notifications');
    }
};
