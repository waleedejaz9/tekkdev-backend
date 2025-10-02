
const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const router = express.Router();



router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("🔐 Login attempt:", username);
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log("❌ Username not found");
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    console.log("✅ Login success");
    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
