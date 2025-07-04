const express = require("express");
const multer = require("multer");
const path = require("path");
const Application = require("../models/Application");

const router = express.Router();

// Setup file upload using multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// POST: Create new application
router.post("/", upload.single("cv"), async (req, res) => {
  const { name, email, phone, jobId } = req.body;

  const application = new Application({
    name,
    email,
    phone,
    jobId,
    cv: req.file.filename,
  });

  await application.save();
  res.status(201).json(application);
});

// ✅ GET: Get all applicants for a specific job
router.get("/getApplicants/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    const applicants = await Application.find({ jobId }).select(
      "name email phone cv appliedAt"
    );

    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Error fetching applicants", error });
  }
});

module.exports = router;
