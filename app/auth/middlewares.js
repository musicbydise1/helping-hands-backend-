const Role = require("./models/Role");
const Volunteer = require("./models/Volunteer");
const Organization = require("./models/Organization");
const { ROLES } = require("../_constants/Roles");
const Moderator = require("../moderator/models/Moderator");

const checkRole = async (req, res, next) => {
  req.Model = null;
  if (req.body.role === ROLES.vol || req.user?.role?.name === ROLES.vol) req.Model = Volunteer;
  else if (req.body.role === ROLES.org || req.user?.role?.name === ROLES.org) req.Model = Organization;
  else if (req.body.role === ROLES.moderator || req.user?.role?.name === ROLES.moderator)
    req.Model = Moderator;
  if (!req.Model) {
    return res.status(300).send({ message: "Role field is wrong" });
  } else next();
};

const isOrganization = async (req, res, next) => {
  const role = await Role.findByPk(req.user.roleId);
  if (role.name === ROLES.org) next();
  else res.status(403).send({ message: "Access denied!" });
};
const isVolunteer = async (req, res, next) => {
  const role = await Role.findByPk(req.user.roleId);
  if (role.name === ROLES.vol) next();
  else res.status(403).send({ message: "Access denied!" });
};

const fields = {
  volunteer: ["email", "surname", "name", "password", "about", "phoneNumber", "birthday"],
  organization: ["email", "orgType", "name", "email", "phoneNumber", "address", "password", "about"],
  //org + file
};

const validateSignUp = async (req, res, next) => {
  try {
    if (!req.body.email) return res.status(300).json({ message: "Email field is required." });

    const object = await req.Model.findOne({ where: { email: req.body.email } });
    if (object) return res.status(300).json({ message: "User with this email is already registered." });
    console.log(req.body);

    const missingFields = [];
    // if (Object.keys(req.files).length == 0) missingFields.push("files");

    for (const field of fields[req.body.role]) {
      if (!req.body[field]) missingFields.push(field);
    }

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return res.status(300).json({ message: `Required fields missing: ${missingFieldsString}` });
    } else next();
  } catch (error) {
    console.error("Error in validateSignUp middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const validateUpdate = async (req, res, next) => {
  try {
    missingFields = [];
    for (const field of fields[req.user.role.name]) {
      if (!req.body[field] && field != "password" && field != "email") missingFields.push(field);
    }

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return res.status(300).json({ message: `Required fields missing: ${missingFieldsString}` });
    } else next();
  } catch (error) {
    console.error("Error in validateUpdate middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { checkRole, isOrganization, isVolunteer, validateSignUp, validateUpdate };
