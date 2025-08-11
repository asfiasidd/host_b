const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Temporary in-memory data storage
let users = [];
let profiles = [];

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Register
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = users.length + 1;

  users.push({ id, email, password: hashedPassword });
  profiles.push({ id, name: "", skills: [], github: "", projects: [] });

  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Get profile
app.get("/api/profile", auth, (req, res) => {
  const profile = profiles.find((p) => p.id === req.user);
  res.json(profile);
});

// Save/Update profile
app.post("/api/profile", auth, (req, res) => {
  const index = profiles.findIndex((p) => p.id === req.user);
  profiles[index] = { id: req.user, ...req.body };
  res.json(profiles[index]);
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
