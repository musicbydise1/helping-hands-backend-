"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("rootpassword", 10);

    return queryInterface.bulkInsert(
      "Moderators",
      [
        {
          name: "Root Moderator",
          email: "root@moderator.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Moderators", { email: "root@moderator.com" }, {});
  },
};
