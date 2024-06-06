const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  responsibility: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  prefered: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("posted", "archived"),
    defaultValue: "posted",
  },
  fromDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  toDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  orgId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Organization",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
});
module.exports = Job;
