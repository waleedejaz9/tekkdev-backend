const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/jobPortal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected");
  createAdmins();
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Admin list
const adminList = [
  { username: "Info@tekkdev.com", password: "admin123" },
 
];

// Create admins if not already existing
async function createAdmins() {
  for (const adminData of adminList) {
    const existing = await Admin.findOne({ username: adminData.username });

    if (existing) {
      console.log(`⚠️ Admin '${adminData.username}' already exists. Skipping...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = new Admin({
      username: adminData.username,
      password: hashedPassword,
    });

    await admin.save();
    console.log(`✅ Admin '${adminData.username}' created`);
  }

  mongoose.disconnect();
}
