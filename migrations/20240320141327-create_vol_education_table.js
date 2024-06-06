"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("VolEducations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      volId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Volunteers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      place: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fromDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      toDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      specialty: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pdf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("VolEducations");
  },
};
