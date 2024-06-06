const bcrypt = require("bcrypt");
const Moderator = require("./models/Moderator");
const Organization = require("../auth/models/Organization");
const Volunteer = require("../auth/models/Volunteer");
const { Op } = require("sequelize");
const sequelize = require("../../config/db");
const sendEmail = require("../utils/sendMail");

const getAllModerators = async (req, res) => {
  try {
    const moderators = await Moderator.findAll();
    return res.status(200).json({ moderators });
  } catch (error) {
    console.error("Error fetching moderators:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createModerator = async (req, res) => {
  if (req.user.id !== 1) {
    return res.status(403).json({ message: "Forbidden: Only the main moderator can create new moderators" });
  }

  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newModerator = await Moderator.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "Moderator created successfully", moderator: newModerator });
  } catch (error) {
    console.error("Error creating moderator:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteModerator = async (req, res) => {
  if (req.user.id !== 1) {
    return res.status(403).json({ message: "Forbidden: Only the main moderator can delete moderators" });
  }

  try {
    const { id } = req.params;
    if (id === 1) {
      return res.status(403).json({ message: "Forbidden: The main moderator can not be deleted" });
    }
    const deleted = await Moderator.destroy({ where: { id } });

    if (deleted) {
      return res.status(200).json({ message: "Moderator deleted successfully" });
    } else {
      return res.status(404).json({ message: "Moderator not found" });
    }
  } catch (error) {
    console.error("Error deleting moderator:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { verifyStatus, verifyMessage } = req.body;

    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    await organization.update({
      verifyStatus,
      verifyMessage: "[moderator:" + req.user.name + "]: " + verifyMessage,
    });

    const emailSubject = "Organization Verification Status Updated";
    const emailText = `Dear ${
      organization.name
    },\n\nYour organization verification status has been updated to "${verifyStatus}".\nMessage: ${
      "[moderator:" + req.user.name + "]: " + verifyMessage
    }\n\nThank you.`;

    await sendEmail(organization.email, emailSubject, emailText);

    return res.status(200).json({ message: "Organization verification status updated", organization });
  } catch (error) {
    console.error("Error verifying organization:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const { verifyStatus, verifyMessage } = req.body;

    const volunteer = await Volunteer.findByPk(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    await volunteer.update({
      verifyStatus,
      verifyMessage: "[moderator:" + req.user.name + "]: " + verifyMessage,
    });

    const emailSubject = "Volunteer Verification Status Updated";
    const emailText = `Dear ${
      volunteer.name
    },\n\nYour volunteer verification status has been updated to "${verifyStatus}".\nMessage: ${
      "[moderator:" + req.user.name + "]: " + verifyMessage
    }\n\nThank you.`;

    await sendEmail(volunteer.email, emailSubject, emailText);

    return res.status(200).json({ message: "Volunteer verification status updated", volunteer });
  } catch (error) {
    console.error("Error verifying volunteer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const { verifyStatus, search } = req.query;

    // Создаем условие для фильтрации по имени и email
    const searchFilter = search
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }],
        }
      : {};

    // Создаем условие для фильтрации по verifyStatus
    const statusFilter = verifyStatus ? { verifyStatus } : {};

    const organizations = await Organization.findAll({
      where: {
        ...searchFilter,
        ...statusFilter,
      },
      order: [
        [
          sequelize.literal(
            "CASE " +
              'WHEN "Organization"."verifyStatus" = \'Pending\' THEN 1 ' +
              'WHEN "Organization"."verifyStatus" = \'Approved\' THEN 2 ' +
              'WHEN "Organization"."verifyStatus" = \'Rejected\' THEN 3 ' +
              'WHEN "Organization"."verifyStatus" = \'Banned\' THEN 4 ' +
              "ELSE 5 END"
          ),
          "ASC",
        ],
        ["name", "ASC"],
      ],
    });

    return res.status(200).json({ organizations });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllVolunteers = async (req, res) => {
  try {
    const { verifyStatus, search } = req.query;

    // Создаем условие для фильтрации по имени и email
    const searchFilter = search
      ? {
          [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }],
        }
      : {};

    // Создаем условие для фильтрации по verifyStatus
    const statusFilter = verifyStatus ? { verifyStatus } : {};

    const volunteers = await Volunteer.findAll({
      where: {
        ...searchFilter,
        ...statusFilter,
      },
      order: [
        [
          sequelize.literal(
            "CASE " +
              'WHEN "Volunteer"."verifyStatus" = \'Pending\' THEN 1 ' +
              'WHEN "Volunteer"."verifyStatus" = \'Approved\' THEN 2 ' +
              'WHEN "Volunteer"."verifyStatus" = \'Rejected\' THEN 3 ' +
              'WHEN "Volunteer"."verifyStatus" = \'Banned\' THEN 4 ' +
              "ELSE 5 END"
          ),
          "ASC",
        ],
        ["name", "ASC"],
      ],
    });

    return res.status(200).json({ volunteers });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    return res.status(200).json({ organization });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getVolunteerById = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findByPk(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    return res.status(200).json({ volunteer });
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllModerators,
  createModerator,
  deleteModerator,
  verifyOrganization,
  verifyVolunteer,
  getAllOrganizations,
  getAllVolunteers,
  getOrganizationById,
  getVolunteerById,
};
