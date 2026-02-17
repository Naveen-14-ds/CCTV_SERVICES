const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const connectDB = require("./config/db");
const ensureAdminUser = require("./config/ensureAdmin");

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
// Serve frontend static files
const frontendDir = path.join(__dirname, "../frontend");
app.use(express.static(frontendDir));

// API routes - keep only essential routes
app.use("/api/auth", require("./routes/auth")); // Add back auth routes
app.use("/api/cameras", require("./routes/cameras"));
app.use("/api/services", require("./routes/services"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/feedback", require("./routes/feedback"));

// Default route to frontend index
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDB();
    await ensureAdminUser(); // Ensure admin user exists
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
