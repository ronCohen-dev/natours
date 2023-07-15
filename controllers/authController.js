const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncErrors = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
require('dotenv').config({ path: 'secret.env' });
const sendEmail = require('./../utils/email');

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
    user,
  });
});

exports.protectResorce = catchAsyncErrors(async (req, res, next) => {
  console.log(process.env.JWT_SECRET);
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

  if (freshUser.changedPasswordAfter(decoded.iat)) {
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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You dont have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user based on post email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err.message);
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
});

exports.resetPassword = (req, res, next) => {};
