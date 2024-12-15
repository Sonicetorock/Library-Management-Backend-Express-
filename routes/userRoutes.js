const express = require('express');
const  authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ message: `Welcome, user ${req.user.email}` });
});

module.exports = router;
