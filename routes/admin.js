const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Camera = require('../models/Camera');

// GET /api/admin/users - list all users (admin only)
const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== role) return res.status(403).json({ message: 'Admins only' });
  next();
};

router.get('/users', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/cameras - list all cameras with owner populated (admin only)
router.get('/cameras', protect, requireRole('admin'), async (req, res) => {
  try {
    const cams = await Camera.find().populate('owner', 'name email');
    res.json(cams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/user/:id - delete a user and their cameras (admin only)
router.delete('/user/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Camera.deleteMany({ owner: id });
    await user.deleteOne();

    res.json({ message: 'User and cameras deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


