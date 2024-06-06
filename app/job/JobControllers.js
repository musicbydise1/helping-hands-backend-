const { Op } = require("sequelize");
const Job = require("./models/Job");
const Applicant = require("./models/Applicant");
const Organization = require("../auth/models/Organization");

const createJob = async (req, res) => {
  try {
    const { name, description, responsibility, prefered, fromDate, toDate } = req.body;
    if (!name || !description || !responsibility || !prefered || !fromDate || !toDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      name,
      description,
      responsibility,
      prefered,
      fromDate,
      toDate,
      orgId: req.user.id,
      status: "posted",
    });

    return res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const newStatus = req.body.status;
    const userId = req.user.id;

    if (!jobId || !newStatus) {
      return res.status(400).json({ message: "Job ID and new status are required" });
    }
    if (newStatus !== "posted" && newStatus !== "archived") {
      return res.status(400).json({ message: "Invalid status. Status must be 'posted' or 'archived'" });
    }
    const job = await Job.findOne({ where: { id: jobId, orgId: userId } });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or you don't have permission to update this job" });
    }
    job.status = newStatus;
    await job.save();

    return res.status(200).json({ message: "Job status updated successfully" });
  } catch (error) {
    console.error("Error updating job status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPostedJobs = async (req, res) => {
  try {
    const { jobName, jobDescription, orgName, about, address, search } = req.query;
    const where = {
      status: "posted",
      [Op.or]: [],
    };

    if (jobName) {
      where[Op.or].push({ name: { [Op.iLike]: `%${search}%` } });
    }
    if (jobDescription) {
      where[Op.or].push({ description: { [Op.iLike]: `%${search}%` } });
    }
    if (orgName) {
      where[Op.or].push({ "$organization.name$": { [Op.iLike]: `%${search}%` } });
    }

    if (about) {
      where[Op.or].push({ "$organization.about$": { [Op.iLike]: `%${search}%` } });
    }

    if (address) {
      where[Op.or].push({ "$organization.address$": { [Op.iLike]: `%${search}%` } });
    }
    if (!where[Op.or].length) {
      delete where[Op.or];
    }
    console.log("🚀 ~ getPostedJobs ~ where:", where);
    const jobs = await Job.findAll({
      where,
      include: [
        {
          model: Applicant,
          where: { volId: req.user.id },
          required: false,
        },
        {
          model: Organization,
          as: "organization",
          attributes: ["name", "imageURL", "about", "address", "orgType"],
        },
      ],
    });
    console.log("jobs", jobs);
    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error getting jobs:", error);
    return res.status(500).json({ message: "Internal server error" + error });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findByPk(jobId, {
      include: [
        {
          model: Organization,
          as: "organization",
          attributes: ["name", "imageURL", "about", "address", "orgType", "email", "phoneNumber"],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error("Error getting job by id:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getMyJobs = async (req, res) => {
  try {
    const userJobs = await Job.findAll({
      where: {
        orgId: req.user.id,
        status: req.query.status || { [Op.ne]: null },
      },
      include: [
        {
          model: Organization,
          as: "organization",
          where: {
            id: req.user.id,
          },
          attributes: ["name", "imageURL", "about", "address", "orgType"],
        },
      ],
    });

    return res.status(200).json(userJobs || []);
  } catch (error) {
    console.error("Error getting user jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const deletedJob = await Job.destroy({ where: { id: jobId, orgId: req.user.id } });

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createJob, getPostedJobs, getJobById, getMyJobs, deleteJob, updateJobStatus };
