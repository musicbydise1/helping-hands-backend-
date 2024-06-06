'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRooms', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserRooms');
  }
};
