'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING
      },
      unreadCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lastMessage: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      users: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      typingUsers: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rooms');
  }
};
