const Camera = require("../models/Camera");

// @desc    Get all cameras for logged-in user
// @route   GET /api/cameras/me
// @access  Private
exports.getMyCameras = async (req, res) => {
  try {
    const cameras = await Camera.find({ user: req.user.id });
    res.json(cameras);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add new camera
// @route   POST /api/cameras
// @access  Private
exports.addCamera = async (req, res) => {
  const { name, model, location } = req.body;

  if (!name || !model || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCamera = await Camera.create({
      user: req.user.id,
      name,
      model,
      location,
    });

    res.status(201).json(newCamera);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
