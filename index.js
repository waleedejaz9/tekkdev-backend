require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/jobPortal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/apply", require("./routes/apply"));
app.use("/api/admin", require("./routes/admin"));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
