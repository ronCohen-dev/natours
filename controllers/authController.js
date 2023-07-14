const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncErrors = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
require('dotenv').config({ path: 'secret.env' });

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'seccess',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('plz provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrecr email or password', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'seccess',
    token,
  });
});

exports.protectResorce = catchAsyncErrors(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError('your not logged in , plz loggin first to get access ', 401),
    );
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(new AppError('this token does not longer exists ', 401));

  if (freshUser.changePasswordAfterCreation(decoded.iat)) {
    return next(
      new AppError(
        'The user recently change the password , plz log in again  ',
        401,
      ),
    );
  }

  req.user = freshUser;
  next();
});
