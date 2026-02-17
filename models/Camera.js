const mongoose = require("mongoose");

const CameraSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  model: { type: String },
  location: { type: String, required: true },
  status: { type: String, enum: ["active","inactive","needs_service"], default: "active" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Camera", CameraSchema);

