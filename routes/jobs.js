// server/routes/jobs.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.get("/", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

router.post("/", async (req, res) => {
  const job = new Job(req.body);
  await job.save();
  res.status(201).json(job);
});

router.delete("/:id", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;



