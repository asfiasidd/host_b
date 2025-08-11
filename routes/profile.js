// const express = require('express');
// const User = require('../models/User');
// const auth = require('../middleware/auth');
// const router = express.Router();

// // Get profile
// router.get('/profile', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Save/Update profile
// router.post('/profile', auth, async (req, res) => {
//   try {
//     const { name, skills, github, projects } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user,
//       { name, skills, github, projects },
//       { new: true }
//     ).select('-password');

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
