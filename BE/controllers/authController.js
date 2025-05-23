const User = require('../models/user')
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { sanitizeInput } = require('../utils/sanitizeUtils');


exports.signUpUser = async (req, res) => {
  let { name, username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }

  try {
    
    username = sanitizeInput(username);
    password = sanitizeInput(password);
    name = name ? sanitizeInput(name) : username;
    role = sanitizeInput(role);

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const allowedRoles = ['student'];
    const isApproved = allowedRoles.includes(role);

    const newUser = new User({
      name: name,
      username,
      password,
      role,
      isApproved,
    });

    await newUser.save();
    const userResponse = newUser.toObject();
    delete userResponse.password;

    const msg = isApproved
      ? 'User created successfully'
      : 'Account submitted for approval by staff.';

    res.status(201).json({ message: msg, user: userResponse });
  } catch (error) {
    if (error.name == 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error during sign up.' });
  }
};

exports.signInUser = async (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    username = sanitizeInput(username);
    password = sanitizeInput(password);

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (['lecturer', 'staff'].includes(user.role) && !user.approved) {
      return res.status(403).json({ message: 'Your account is pending approval by an administrator.' });
    }

    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role,
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server configuration error." });
    }

    const options = {
      expiresIn: '1h'
    };

    const token = jwt.sign(payload, secret, options);

    const userResponse = user.toObject();
    delete userResponse.password;
    logger.info(`User ${user.username} signed in successfully from IP ${req.ip}`);

    res.status(200).json({
      message: 'Sign in successful',
      token: token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during sign in.' });
  }
};


exports.verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not found in Authorization header.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const user = await User.findById(decoded.userId).select('-password').populate('bookings.room', 'name location capacity');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error verifying token.' });
  }
};

exports.verifyRole = (roles) => async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not found in Authorization header.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error verifying role.' });
  }
}