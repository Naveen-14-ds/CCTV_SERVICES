const mongoose = require("mongoose");

const ALLOWED_ROLES = ["owner", "admin", "technician", "user"];

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ALLOWED_ROLES, default: "owner" },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.statics.isValidRole = function(role) {
  return ALLOWED_ROLES.includes(role);
};

module.exports = mongoose.model("User", UserSchema);
