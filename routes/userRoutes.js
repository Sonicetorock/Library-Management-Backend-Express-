const express = require('express');
const  authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const router = express.Router();

/*
    @desc updates user details
    @route PUT /api/v1/users/update
    @access Private - hence authMiddleware
    @takes new creds
    @returns updated user details
 */
router.put('/update', authMiddleware, async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (password) user.password = password; // Pre-save hook will hash this

    await user.save();
    res.status(200).json({ message: 'User updated successfully', "updated user" : user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
    @desc deletes user
    @route DELETE /api/v1/users/delete
    @access Private - hence authMiddleware
    @takes nothing 
    @returns success message notifying user deletion
 */
router.delete('/delete', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // get total count of users before and after deletion
    const totalUsersBefore = await User.countDocuments();
    console.log(`Total users before deletion: ${totalUsersBefore}`);

    // remove user
    await User.deleteOne({ _id: req.user.id });

    const totalUsersAfter = await User.countDocuments();
    console.log(`Total users after deletion: ${totalUsersAfter}`);
    //should clear the user stored in req.user
    req.user = null;
    res.status(200).json({ 
      message: 'User deleted successfully', 
      totalUsersBefore, 
      totalUsersAfter 
    });
  } catch (error) {
    console.error('Error during user deletion:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
    @desc gets user profile
    @route GET /api/v1/users/profile
    @access Private - hence authMiddleware
    @takes nothing
    @returns user details
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // console.log(req.user);
    // req.user = null;
    // console.log(req.user)
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
    @desc logs out user
    @route POST /api/v1/users/logout
    @access Private - hence authMiddleware
    @takes nothing
    @returns success message
*/
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // clear the user stored in req.user
    req.user = null;
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});