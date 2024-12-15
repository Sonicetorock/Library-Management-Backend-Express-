// routes/authRoutes.js
const express = require('express');
const User = require('../models/userModel');
const { generateToken, verifyToken } = require('../utils/jwtUtils');

const router = express.Router();

/*
    @route POST /api/auth/signup
    @desc Register user with proper validation and generate token
    @access Public
    @params name, email, password, role
    @return token
*/
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // chk if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // if user does not exist, create a new user
    const user = new User({ name, email, password, role });
    await user.save();

    // as signing up means user is logged in, generate token
    const token = generateToken({ id: user._id, role: user.role, email: user.email });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
    @route POST /api/auth/login
    @desc Login user with proper validation and generate token
    @access Public
    @params email, password
    @return token
*/
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  //chk if user is already logged in( token already exists)

  const token = req.headers.authorization?.split(" ")[1]; 
  if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        return res
          .status(200)
          .json({ message: "User already logged in", token });
      }
    }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // check if password is valid and correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // if password is matched, generate token
    const token = generateToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
  

module.exports = router;
