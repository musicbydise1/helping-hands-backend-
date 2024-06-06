'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pdf: {
        type: Sequelize.STRING,
        allowNull: true
      },
      orgType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      imageURL: {
        type: Sequelize.STRING,
        allowNull: true
      },
      verifyStatus: {
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected', 'Banned'),
        defaultValue: 'Pending'
      },
      verifyMessage: {
        type: Sequelize.STRING,
        defaultValue: 'Pending',
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Organizations');
  }
};
