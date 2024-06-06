const { ROLES } = require("../_constants/Roles");

const checkRole = async (req, res, next) => {
  req.idField = null;
  if (req.user.role.name === ROLES.vol) req.idField = "volId";
  else if (req.user.role.name === ROLES.org) req.idField = "orgId";
  if (!req.idField) {
    return res.status(300).send({ message: "Role field is wrong" });
  } else next();
};
const isOrganization = async (req, res, next) => {
  if (req.user.role.name === ROLES.org) next();
  else res.status(403).send({ message: "Access denied!" });
};
const isVolunteer = async (req, res, next) => {
  console.log(req.user);
  if (req.user.role.name === ROLES.vol) next();
  else res.status(403).send({ message: "Access denied!" });
};
module.exports = { checkRole, isOrganization, isVolunteer };
