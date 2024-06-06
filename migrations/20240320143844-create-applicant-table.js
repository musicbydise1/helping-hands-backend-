"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Applicants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Jobs",
          key: "id",
        },
      },
      volId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Volunteers",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("accepted", "rejected", "pending", "achieved", "unachieved"),
        defaultValue: "pending",
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
    await queryInterface.dropTable("Applicants");
  },
};
