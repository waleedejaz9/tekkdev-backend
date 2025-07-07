const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log("🟡 Received from frontend:");
  console.log("   Username →", username);
  console.log("   Password →", password);
  console.log("🟢 From .env file:");
  console.log("   ADMIN_USERNAME →", process.env.ADMIN_USERNAME);
  console.log("   ADMIN_PASSWORD →", process.env.ADMIN_PASSWORD);

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    console.log("✅ Login success");
    return res.status(200).json({ success: true, message: "Login successful" });
  }

  console.log("❌ Login failed");
  return res.status(401).json({ success: false, message: "Invalid username or password" });
});

module.exports = router;
