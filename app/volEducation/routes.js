const express = require("express");
const router = express.Router();
// const {  } = require("./controllers");
const { checkRole } = require("./middlewares");
const { uploadVOL } = require("../utils/multer");
const passport = require("passport");

// router.post("/api/auth/signup/org", checkRole, validateSignUp, orgSignUp);
router.delete(
  "/api/auth/delete",
  // passport.authenticate("jwt", { session: false }),
  checkRole
  // deleteAcc
);
module.exports = router;
