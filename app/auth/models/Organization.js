const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const Job = require("../../job/models/Job");

const Organization = sequelize.define("Organization", {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pdf: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orgType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verifyStatus: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected", "Banned"),
    defaultValue: "Pending",
  },
  verifyMessage: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
    allowNull: true,
  },
});

Job.belongsTo(Organization, { foreignKey: "orgId", as: "organization" }); // Каждая работа принадлежит одной организации
Organization.hasMany(Job, { foreignKey: "orgId" }); // Одна организация может иметь много работ

module.exports = Organization;
