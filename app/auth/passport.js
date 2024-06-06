const passport = require("passport");
const passportJWT = require("passport-jwt");
const { ROLES } = require("../_constants/Roles");
const Volunteer = require("./models/Volunteer");
const Organization = require("./models/Organization");
const Moderator = require("../moderator/models/Moderator");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "sssss",
};

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    console.log("jwtPayload", jwtPayload);
    let user;
    if (jwtPayload.role.name === ROLES.vol) {
      user = await Volunteer.findOne({ where: { email: jwtPayload.email } });
    } else if (jwtPayload.role.name === ROLES.org) {
      user = await Organization.findOne({ where: { email: jwtPayload.email } });
    } else if (jwtPayload.role.name === ROLES.moderator) {
      user = await Moderator.findOne({ where: { email: jwtPayload.email } });
    }
    user.role = jwtPayload.role;
    if (user) {
      done(null, user);
    } else done(null, false);
  })
);
module.exports = {
  jwtOptions,
};
