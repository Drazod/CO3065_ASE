const User = require('../models/user')
const jwt = require('jsonwebtoken');

exports.signUpUser = async (req, res) => {
  const { name, username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }

  try {
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const newUser = new User({
      name: name || username,
      username,
      password,
      role,
    });

    await newUser.save();
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    if (error.name == 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error during sign up.' });
  }
}

exports.signInUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
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

    res.status(200).json({
      message: 'Sign in successful',
      token: token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during sign in.' });
  }
}

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