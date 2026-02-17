const User = require("../models/User");
const Camera = require("../models/Camera");

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.listAllCameras = async (req, res) => {
  try {
    const cams = await Camera.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.json(cams);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    await Camera.deleteMany({ owner: id });
    res.json({ message: "User and cameras deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};