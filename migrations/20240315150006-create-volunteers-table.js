'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Volunteers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false
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
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
        allowNull: true,
        defaultValue: 'Pending'
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      birthday: {
        allowNull: false,
        type: Sequelize.DATE
      },
      frontCardView: {
        type: Sequelize.STRING,
        allowNull: true
      },
      backCardView: {
        type: Sequelize.STRING,
        allowNull: true
      },
      selfie: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Volunteers');
  }
};
