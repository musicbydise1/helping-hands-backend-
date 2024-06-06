const sequelize = require("../../config/db");
const Organization = require("../auth/models/Organization");
const Volunteer = require("../auth/models/Volunteer");
const Applicant = require("./models/Applicant");
const Job = require("./models/Job");
const validStatuses = ["accepted", "rejected", "pending", "achieved", "unachieved"];
const sendEmail = require("../utils/sendMail");

const getApplicantsByJobId = async (req, res) => {
  try {
    //TODO add orgId column to Applicant
    const applicants = await Applicant.findAll({
      where: { jobId: req.params.jobId },
      include: {
        model: Volunteer,
        attributes: ["about", "email", "phoneNumber", "surname", "name", "imageURL", "id"],
      },
      order: [
        sequelize.literal(`CASE 
          WHEN status = 'achieved' THEN 1
          WHEN status = 'unachieved' THEN 2
          WHEN status = 'accepted' THEN 3
          WHEN status = 'pending' THEN 4
          WHEN status = 'rejected' THEN 5
          ELSE 6
        END`),
      ],
    });
    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error getting applicants by job ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyApplies = async (req, res) => {
  try {
    const applies = await Applicant.findAll({
      where: { volId: req.user.id },
      include: {
        model: Job,
        include: {
          model: Organization,
          as: "organization",
          attributes: ["name", "imageURL", "about", "address"],
        },
      },
    });

    res.status(200).send(applies);
  } catch (error) {
    console.error("Error getting my applies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createApplicant = async (req, res) => {
  try {
    if (!req.params.jobId || !(await Job.findByPk(req.params.jobId)))
      return res.status(400).send({ message: "Invalid jobId" });
    const [applicant, created] = await Applicant.findOrCreate({
      where: { jobId: req.params.jobId, volId: req.user.id },
    });
    console.log("created", created);
    res.status(200).json(applicant);
  } catch (error) {
    console.error("Error creating applicant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateApplicantStatus = async (req, res) => {
  try {
    const { jobId, id } = req.params; // Changed from volId to id
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await Job.findByPk(jobId);
    if (job.orgId !== req.user.id) {
      return res.status(400).json({ message: "This job is not yours" });
    }

    const applicant = await Applicant.findOne({
      where: { id, jobId },
      include: [{ model: Volunteer, as: 'Volunteer' }] // Ensure Volunteer is included
    });

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    await applicant.update({ status });

    // Sending email notification to the volunteer
    const emailSubject = "Application Status Updated";
    const emailText = `Dear ${applicant.Volunteer.name},\n\nYour application for the job "${job.name}" has been updated to "${status}".\n\nThank you.`;

    await sendEmail(applicant.Volunteer.email, emailSubject, emailText);

    return res.status(200).json({ message: "Applicant status updated successfully" });
  } catch (error) {
    console.error("Error updating applicant status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await Applicant.findByPk(id);
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });

    await applicant.destroy();
    res.status(200).json({ message: "Applicant deleted successfully" });
  } catch (error) {
    console.error("Error deleting applicant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getApplicantsByJobId, getMyApplies, createApplicant, updateApplicantStatus, deleteApplicant };
