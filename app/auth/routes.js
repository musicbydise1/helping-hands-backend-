const express = require("express");
const router = express.Router();
const {
  deleteAcc,
  orgSignUp,
  signIn,
  verifyCode,
  verifyRegisterCode,
  volSignUp,
  updateOrg,
  updateVol,
  sendVerificationEmail,
  logout,
  getUserInfo
} = require("./controllers");
const { validateSignUp, checkRole, validateUpdate } = require("./middlewares");
const { uploadORG, uploadVOL } = require("../utils/multer");
const passport = require("passport");
const { ROLES } = require("../_constants/Roles");
const auth = passport.authenticate("jwt", { session: false });

router.post("/api/auth/sendmail", sendVerificationEmail);
router.post(
  "/api/auth/signup/vol",
  // uploadVOL.fields([
  //   { name: "imageURL" },
  //   { name: "frontCardView" },
  //   { name: "backCardView" },
  //   { name: "selfie" },
  // ]),
  checkRole,
  validateSignUp,
  volSignUp
);
router.post(
  "/api/auth/signup/org",
  // uploadORG.fields([{ name: "imageURL" }, { name: "pdf" }]),
  checkRole,
  validateSignUp,
  orgSignUp
);

router.post('/api/auth/logout', logout);
router.get('/api/user/user-info', getUserInfo);
router.put(
  "/api/auth/vol/",
  auth,
  checkRole,
  uploadVOL.fields([
    { name: "imageURL" },
    { name: "frontCardView" },
    { name: "backCardView" },
    { name: "selfie" },
  ]),
  updateVol
);

router.put(
  "/api/auth/org/",
  auth,
  checkRole,
  uploadORG.fields([{ name: "imageURL" }, { name: "pdf" }]),
  updateOrg
);

router.post("/api/auth/signin", checkRole, signIn);
router.post("/api/auth/verifyCode", checkRole, verifyCode);
router.post("/api/auth/verifyRegisterCode", checkRole, verifyRegisterCode);
router.delete("/api/auth/delete", auth, checkRole, deleteAcc);
router.get("/api/auth/vol", auth, checkRole, async (req, res) => {
  try {
    const user = await req.Model.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }
    if (user.verifyStatus !== "Approved") {
      return res.status(200).send({ message: "Verify status is not approved" });
    }
    return res.status(200).send({ ...user.toJSON(), role: { id: 1, name: ROLES.vol } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});
router.get("/api/auth/tochange/vol", auth, checkRole, async (req, res) => {
  try {
    const user = await req.Model.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }
    return res.status(200).send({ ...user.toJSON(), role: { id: 1, name: ROLES.vol } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});
router.get("/api/auth/org", auth, checkRole, async (req, res) => {
  try {
    const user = await req.Model.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }
    if (user.verifyStatus !== "Approved") {
      return res.status(203).send({ message: "Verify status is not approved" });
    }
    return res.status(200).send({ ...user.toJSON(), role: { id: 2, name: ROLES.org } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});
router.get("/api/auth/tochange/org", auth, checkRole, async (req, res) => {
  try {
    const user = await req.Model.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }
    return res.status(200).send({ ...user.toJSON(), role: { id: 2, name: ROLES.org } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});
router.get("/api/auth/moderator", auth, checkRole, async (req, res) => {
  try {
    const user = await req.Model.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }
    return res.status(200).send({ ...user.toJSON(), role: { id: 3, name: ROLES.moderator } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
