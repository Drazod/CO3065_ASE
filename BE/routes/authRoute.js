const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signin', authController.signInUser);
router.post('/signup', authController.signUpUser);
router.get('/me', authController.verifyToken);

module.exports = router;
