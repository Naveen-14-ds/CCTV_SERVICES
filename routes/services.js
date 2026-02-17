const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ServiceRequest = require('../models/ServiceRequest');
const Camera = require('../models/Camera');

const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ msg: 'Forbidden: insufficient role' });
    next();
  };
};

// Create service request (owner)
router.post('/create', protect, requireRole(['owner','user']), async (req, res) => {
  try {
    const { cameraId, issueDescription } = req.body;
    // verify camera belongs to owner
    const camera = await Camera.findById(cameraId);
    if (!camera) return res.status(404).json({ msg: 'Camera not found' });
    const ownerId = (req.user._id || req.user.id).toString();
    if (camera.owner.toString() !== ownerId) return res.status(403).json({ msg: 'Not your camera' });

    const sr = new ServiceRequest({
      ownerId: req.user._id || req.user.id,
      cameraId,
      issueDescription
    });
    await sr.save();

    // Optionally update camera status
    camera.status = 'needs_service';
    await camera.save();

    res.json(sr);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Owner: get own service requests
router.get('/owner', protect, requireRole(['owner','user']), async (req, res) => {
  try {
    const ownerId = req.user._id || req.user.id;
    const list = await ServiceRequest.find({ ownerId }).populate('cameraId');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin: get all service requests
router.get('/all', protect, requireRole('admin'), async (req, res) => {
  try {
    const list = await ServiceRequest.find().populate('cameraId ownerId');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin/technician: update service status & assign technician
router.put('/update/:id', protect, requireRole(['admin','technician']), async (req, res) => {
  try {
    const sr = await ServiceRequest.findById(req.params.id);
    if (!sr) return res.status(404).json({ msg: 'Service request not found' });

    const { status, assignedTechnician, completionDate } = req.body;
    if (status) sr.status = status;
    if (assignedTechnician) sr.assignedTechnician = assignedTechnician;
    if (completionDate) sr.completionDate = completionDate;

    await sr.save();

    // If completed, update camera lastServiceDate and status
    if (status === 'Completed') {
      const camera = await Camera.findById(sr.cameraId);
      if (camera) {
        camera.lastServiceDate = completionDate ? new Date(completionDate) : new Date();
        camera.status = 'Active';
        await camera.save();
      }
    }

    res.json(sr);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;