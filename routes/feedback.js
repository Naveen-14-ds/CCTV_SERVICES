const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const ServiceRequest = require('../models/ServiceRequest');

// Add feedback (owner)
router.post('/add', protect, async (req, res) => {
  try {
    const { requestId, rating, comments } = req.body;
    const sr = await ServiceRequest.findById(requestId);
    if (!sr) return res.status(404).json({ msg: 'Service request not found' });
    // ensure the logged-in user is the owner and matches the service request
    if (req.user.role !== 'owner') return res.status(403).json({ msg: 'Owners only' });
    if (sr.ownerId.toString() !== req.user.id) return res.status(403).json({ msg: 'Not your request' });

    const fb = new Feedback({ ownerId: req.user.id, requestId, rating, comments });
    await fb.save();
    res.json(fb);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin: list feedbacks
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const list = await Feedback.find().populate('ownerId requestId');
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
