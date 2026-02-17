const Camera = require("../models/Camera");

exports.getMyCameras = async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;
    const cams = await Camera.find({ owner: ownerId });
    res.json(cams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addCamera = async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;
    const { name, model, location } = req.body;
    if (!name || !location) return res.status(400).json({ message: "Name and location are required" });
    const cam = await Camera.create({ owner: ownerId, name, model, location, status: "active" });
    res.status(201).json(cam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


