const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");

const Volunteer = sequelize.define("Volunteer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
    allowNull: true,
    defaultValue: "Pending",
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  frontCardView: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  backCardView: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  selfie: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Volunteer;
