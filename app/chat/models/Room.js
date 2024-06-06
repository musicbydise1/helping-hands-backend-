'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.Message, { foreignKey: 'roomId' });
      Room.belongsToMany(models.Volunteer, {
        through: 'UserRooms',
        foreignKey: 'roomId',
        otherKey: 'userId',
      });
      Room.belongsToMany(models.Organization, {
        through: 'UserRooms',
        foreignKey: 'roomId',
        otherKey: 'userId',
      });
    }
  }
  Room.init({
    roomName: DataTypes.STRING,
    avatar: DataTypes.STRING,
    unreadCount: DataTypes.INTEGER,
    index: DataTypes.INTEGER,
    lastMessage: DataTypes.JSONB,
    users: DataTypes.JSONB,
    typingUsers: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'Rooms',
    timestamps: true,
  });
  return Room;
};
