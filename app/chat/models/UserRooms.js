'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

class UserRooms extends Model {}

UserRooms.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'UserRooms',
  tableName: 'UserRooms',
  timestamps: false,
});

module.exports = UserRooms;
