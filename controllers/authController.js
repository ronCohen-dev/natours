const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncErrors = require('./../utils/catchAsync');
require('dotenv').config({ path: 'secret.env' });

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: 'seccess',
    token,
    data: {
      user: newUser,
    },
  });
});
