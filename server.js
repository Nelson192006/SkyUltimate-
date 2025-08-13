const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = "./db.json";

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      users: [],
      adminToggle: false,
      deletedAdmins: []
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Register endpoint
app.post("/api/users/register", (req, res) => {
  const { username, password, role } = req.body;
  const db = loadDB();

  // First registration → Super Admin
  if (db.users.length === 0) {
    const superAdmin = { username, password, role: "Super Admin" };
    db.users.push(superAdmin);
    saveDB(db);
    return res.json({ success: true, role: "Super Admin" });
  }

  // Check if trying to register Admin without toggle
  if (role === "Admin" && !db.adminToggle) {
    return res.status(403).json({ success: false, message: "Admin registration disabled" });
  }

  // Block deleted Admins from re-registering
  if (role === "Admin" && db.deletedAdmins.includes(username)) {
    return res.status(403).json({ success: false, message: "This admin account has been deleted" });
  }

  db.users.push({ username, password, role });
  saveDB(db);
  res.json({ success: true, role });
});

// Login endpoint
app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body;
  const db = loadDB();

  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  res.json({ success: true, role: user.role, username: user.username });
});

// Toggle Admin registration (Super Admin only)
app.post("/api/admin/toggle", (req, res) => {
  const { toggle, superAdminName } = req.body;
  const db = loadDB();

  const superAdmin = db.users.find(u => u.username === superAdminName && u.role === "Super Admin");
  if (!superAdmin) return res.status(403).json({ success: false, message: "Only Super Admin can toggle" });

  db.adminToggle = toggle;
  saveDB(db);
  res.json({ success: true, adminToggle: toggle });
});

// Delete Admin (Super Admin only)
app.post("/api/admin/delete", (req, res) => {
  const { adminName, superAdminName } = req.body;
  const db = loadDB();

  const superAdmin = db.users.find(u => u.username === superAdminName && u.role === "Super Admin");
  if (!superAdmin) return res.status(403).json({ success: false, message: "Only Super Admin can delete admin" });

  const adminIndex = db.users.findIndex(u => u.username === adminName && u.role === "Admin");
  if (adminIndex === -1) return res.status(404).json({ success: false, message: "Admin not found" });

  db.deletedAdmins.push(adminName);
  db.users.splice(adminIndex, 1);
  saveDB(db);

  res.json({ success: true, message: `${adminName} deleted and blocked from re-registering` });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
