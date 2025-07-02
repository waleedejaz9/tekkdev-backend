const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
    default: "Full-Time",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", JobSchema);




