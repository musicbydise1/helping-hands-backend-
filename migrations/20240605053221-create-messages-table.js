'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rooms',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      senderId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date: {
        type: Sequelize.STRING,
        allowNull: true
      },
      timestamp: {
        type: Sequelize.STRING,
        allowNull: true
      },
      system: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      saved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      distributed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      seen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      failure: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      disableActions: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      disableReactions: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      files: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      reactions: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      replyMessage: {
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
    await queryInterface.dropTable('Messages');
  }
};
