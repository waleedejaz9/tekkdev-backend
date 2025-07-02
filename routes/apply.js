// server/routes/apply.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Application = require("../models/Application");

const router = express.Router();

// Setup file upload using multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

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

module.exports = router;



















