const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyRole } = require('../controllers/authController');
const User = require('../models/user');

router.post('/signin', authController.signInUser);
router.post('/signup', authController.signUpUser);
router.get('/me', authController.verifyToken);

router.get('/users', verifyRole(['staff']), async (req, res) => {
    const { pending } = req.query;
    try {
      const filter = pending === 'true' ? { approved: false, role: { $in: ['lecturer', 'staff'] } } : {};
      const users = await User.find(filter).select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Server error fetching users.' });
    }
  });
  
  // PUT approve user by ID (staff only)
  router.put('/users/:id/approve', verifyRole(['staff']), async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found.' });
  
      user.approved = true;
      await user.save();
  
      res.json({ message: 'User approved successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error approving user.' });
    }
  });

module.exports = router;
