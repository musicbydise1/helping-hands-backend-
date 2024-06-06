const express = require("express");
const router = express.Router();
const {
  createJob,
  getPostedJobs,
  deleteJob,
  getJobById,
  getMyJobs,
  updateJobStatus,
} = require("./JobControllers");
const { checkRole, isOrganization, isVolunteer } = require("./middlewares");
const passport = require("passport");
const {
  getMyApplies,
  createApplicant,
  getApplicantsByJobId,
  updateApplicantStatus,
  deleteApplicant
} = require("./ApplicantControllers");
const auth = passport.authenticate("jwt", { session: false });

router.post("/api/job/", auth, isOrganization, createJob);
router.get("/api/job/posted", auth, isVolunteer, getPostedJobs);
router.get("/api/job/my", auth, isOrganization, getMyJobs);
router.get("/api/job/:id", getJobById);
router.put("/api/job/:id", auth, isOrganization, updateJobStatus);
router.delete("/api/job/:id", auth, isOrganization, deleteJob);

router.get("/api/applicant/my", auth, isVolunteer, getMyApplies);
router.post("/api/job/:jobId/applicant/", auth, isVolunteer, createApplicant);
router.get("/api/job/:jobId/applicant", auth, isOrganization, getApplicantsByJobId);
router.put("/api/job/:jobId/applicant/:id", auth, isOrganization, updateApplicantStatus);
router.delete("/api/applicant/:id", auth, isVolunteer, deleteApplicant);

module.exports = router;
