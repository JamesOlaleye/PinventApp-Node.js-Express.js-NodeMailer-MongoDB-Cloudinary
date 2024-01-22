const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const protect = asyncHandler(async (req, res, next) => {
  try {
    // Check if req from frontend has a cookie/token
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error('Not authorized, please login');
    }
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get User id from token
    const user = await User.findById(verified.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    // if user, save user to request object
    req.user = user;
    next();
  } catch (error) {
    throw new Error('Not authorized, please login');
  }
});

module.exports = protect;
