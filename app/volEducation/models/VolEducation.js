const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");

const VolEducation = sequelize.define("VolEducation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  volId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Volunteers",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  place: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fromDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  toDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pdf: {
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

module.exports = VolEducation;
