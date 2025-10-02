const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const Job = require("../models/Job");
const Application = require("../models/Application");

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Server error while fetching jobs" });
  }
});

// Post a new job
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming create job payload:", req.body);
    const { title, description, salary, location, type, createdAt, keyResponsibilities, requirements } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and Description are required" });
    }

    const allowedTypes = ["Full-Time", "Part-Time", "Internship", "Contract"];

    // Build the payload safely; let schema defaults apply when values are missing/invalid
    const jobPayload = {
      title,
      description,
    };
    if (Array.isArray(keyResponsibilities) && keyResponsibilities.length > 0) {
      jobPayload.keyResponsibilities = keyResponsibilities;
    }
    if (Array.isArray(requirements) && requirements.length > 0) {
      jobPayload.requirements = requirements;
    }

    if (typeof salary !== "undefined" && salary !== null && salary !== "") {
      jobPayload.salary = salary;
    }
    if (typeof location !== "undefined" && location !== null && location !== "") {
      jobPayload.location = location;
    }
    if (typeof type !== "undefined" && allowedTypes.includes(type)) {
      jobPayload.type = type;
    }
    // Do not pass createdAt if it's empty/invalid; let default in schema handle it
    if (createdAt) {
      jobPayload.createdAt = createdAt;
    }

    const newJob = new Job(jobPayload);

    await newJob.save();
    return res.status(201).json(newJob);
  } catch (err) {
    console.error("Error creating job:", err && err.stack ? err.stack : err);
    // Always return the actual error message to unblock debugging
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({
      error: err.message || "Server error while creating job",
      stack: err.stack,
    });
  }
});

// ✅ Delete job by ID, its applicants, and their CVs
router.delete("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    // 1. Find applications for this job
    const applications = await Application.find({ jobId });

    // 2. Delete associated CV files
    applications.forEach((app) => {
      if (app.cv) {
        const filePath = path.join(__dirname, "..", "uploads", app.cv);
        fs.unlink(filePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error(`Error deleting file ${filePath}:`, err);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      }
    });

    // 3. Delete applications from DB
    await Application.deleteMany({ jobId });

    // 4. Delete the job itself
    await Job.findByIdAndDelete(jobId);

    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting job and its applications:", err);
    res.status(500).json({ error: "Server error while deleting job and its applicants" });
  }
});

module.exports = router;
