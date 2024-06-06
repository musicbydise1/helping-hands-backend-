const express = require("express");
const router = express.Router();
const {
  createModerator,
  deleteModerator,
  verifyOrganization,
  verifyVolunteer,
  getAllOrganizations,
  getAllVolunteers,
  getOrganizationById,
  getVolunteerById,
  getAllModerators,
} = require("./controllers");
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
const { isModerator } = require("./middlewares");

// Маршруты для модераторов
router.get("/api/moderators", auth, isModerator, getAllModerators);
router.post("/api/moderators", auth, isModerator, createModerator);
router.delete("/api/moderators/:id", auth, isModerator, deleteModerator);

// Маршруты для верификации
router.put("/api/organizations/:id/verify", auth, isModerator, verifyOrganization);
router.put("/api/volunteers/:id/verify", auth, isModerator, verifyVolunteer);

// Маршруты для получения данных
router.get("/api/organizations", auth, isModerator, getAllOrganizations);
router.get("/api/organizations/:id", auth, isModerator, getOrganizationById);
router.get("/api/volunteers", auth, isModerator, getAllVolunteers);
router.get("/api/volunteers/:id", auth, isModerator, getVolunteerById);

module.exports = router;
