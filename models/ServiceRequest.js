const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cameraId: { type: mongoose.Schema.Types.ObjectId, ref: 'Camera', required: true },
  issueDescription: { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  assignedTechnician: { type: String },
  completionDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
