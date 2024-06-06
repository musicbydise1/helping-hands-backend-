'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Room, { foreignKey: 'roomId' });
    }
  }
  Message.init({
    content: DataTypes.TEXT,
    senderId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
    saved: DataTypes.BOOLEAN,
    distributed: DataTypes.BOOLEAN,
    seen: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    failure: DataTypes.BOOLEAN,
    disableActions: DataTypes.BOOLEAN,
    disableReactions: DataTypes.BOOLEAN,
    files: DataTypes.JSONB,
    reactions: DataTypes.JSONB,
    replyMessage: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    timestamps: true,
  });
  return Message;
};
