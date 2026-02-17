const express = require("express");
const router = express.Router();
const { getMyCameras, addCamera } = require("../controllers/cameraController");
const authMiddleware = require("../middleware/authMiddleware");
const Camera = require("../models/Camera");

// Existing routes
router.get("/me", authMiddleware, getMyCameras);
router.post("/", authMiddleware, addCamera);

// Frontend compatibility routes
router.get("/owner", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;
    const cams = await Camera.find({ owner: ownerId });
    res.json(cams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;
    const { brand, name, model, location } = req.body;
    const displayName = name || brand; // map brand -> name in schema
    if (!displayName || !location) return res.status(400).json({ message: "Name/brand and location are required" });
    const cam = await Camera.create({ owner: ownerId, name: displayName, model, location, status: "active" });
    res.status(201).json(cam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
