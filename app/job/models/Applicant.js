const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const Volunteer = require("../../auth/models/Volunteer");
const Job = require("./Job");

const Applicant = sequelize.define("Applicant", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("accepted", "rejected", "pending", "achieved", "unachieved"),
    defaultValue: "pending",
  },
  volId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Volunteer,
      key: "id",
    },
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: "id",
    },
  },
});
Applicant.belongsTo(Job, { foreignKey: "jobId" });
Job.hasMany(Applicant, { foreignKey: "jobId" });
Applicant.belongsTo(Volunteer, { foreignKey: "volId" });

Volunteer.belongsToMany(Job, {
  through: "Applicant",
  foreignKey: "volId",
  otherKey: "jobId",
});

Job.belongsToMany(Volunteer, {
  through: "Applicant",
  foreignKey: "jobId",
  otherKey: "volId",
});

module.exports = Applicant;
