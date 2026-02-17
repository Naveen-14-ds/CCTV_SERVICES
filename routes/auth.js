const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

// expose '/register' to match frontend calls to /api/auth/register
router.post("/register", signup);
router.post("/login", login);

module.exports = router;
