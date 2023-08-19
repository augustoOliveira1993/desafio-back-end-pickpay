'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Transations extends Model {
        static associate(models) {
            Transations.belongsTo(models.Users, {
                foreignKey: 'sender_user_id',
                as: 'sender'
            });
            Transations.belongsTo(models.Users, {
                foreignKey: 'receiver_user_id',
                as: 'receiver'
            });
        }
    }

    Transations.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PENDENTE', 'APROVADA', 'CANCELADA', 'REEMBOLSADA'),
            defaultValue: 'PENDENTE',
            allowNull: false,
        },
        sender_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        receiver_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
    }, {
        sequelize,
        modelName: 'Transations',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return Transations;
};
