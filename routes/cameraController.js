// backend/controllers/cameraController.js
const Camera = require("../models/Camera");

// Add new camera
exports.addCamera = async (req, res) => {
  try {
    const { name, location, streamUrl } = req.body;
    const newCamera = new Camera({ name, location, streamUrl });
    await newCamera.save();
    res.status(201).json({ message: "Camera added successfully", camera: newCamera });
  } catch (err) {
    res.status(500).json({ message: "Error adding camera", error: err.message });
  }
};

// Get all cameras
exports.getAllCameras = async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cameras", error: err.message });
  }
};

// Get camera by ID
exports.getCameraById = async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id);
    if (!camera) return res.status(404).json({ message: "Camera not found" });
    res.json(camera);
  } catch (err) {
    res.status(500).json({ message: "Error fetching camera", error: err.message });
  }
};

// Delete camera
exports.deleteCamera = async (req, res) => {
  try {
    const deleted = await Camera.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Camera not found" });
    res.json({ message: "Camera deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting camera", error: err.message });
  }
};
