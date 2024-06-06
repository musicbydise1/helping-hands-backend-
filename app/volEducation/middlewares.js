const { ROLES } = require("../_constants/Roles");

const checkRole = async (req, res, next) => {
  req.Model = null;
  if (req.body.role === ROLES.vol || req.user.role.name === ROLES.vol) req.Model = Volunteer;
  else if (req.body.role === ROLES.org || req.user.role.name === ROLES.org) req.Model = Organization;
  if (!req.Model) {
    return res.status(300).send({ message: "Role field is wrong" });
  } else next();
};

module.exports = { checkRole };
