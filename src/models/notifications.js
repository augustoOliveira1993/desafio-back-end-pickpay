'use strict';
const {
    Model
} = require('sequelize');
const {generatorUUID} = require("../utils/helpers");
module.exports = (sequelize, DataTypes) => {
    class Notifications extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Notifications.belongsTo(models.Users, {
                foreignKey: 'user_id',
                as: 'user'
            })

            models.Users.hasMany(Notifications, {
                foreignKey: 'user_id',
                as: 'notifications'
            })
        }
    }

    Notifications.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: generatorUUID()
        },
        type: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT, // Mensagem da notificação
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER, // Chave estrangeira para o usuário ou lojista que receberá a notificação
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('SENT', 'FAILED'), // Status do envio da notificação
            allowNull: false,
            defaultValue: 'SENT',
        },
    }, {
        sequelize,
        modelName: 'Notifications',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return Notifications;
};
