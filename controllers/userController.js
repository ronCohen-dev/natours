const AppError = require('../utils/AppError');
const User = require('./../models/userModel');
const catchAsyncErrors = require('./../utils/catchAsync');

const filterObj = (obj, ...allowFilds) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowFilds.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};

exports.gettingAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'seccess',
    resultes: users.length,
    data: {
      users,
    },
  });
});

exports.deleteMe = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'seccess',
    data: null,
  });
});

exports.updateMe = catchAsyncErrors(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cant update password in this route', 400));
  }
  const filterBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'seccess',
    user: updatedUser,
  });
});

exports.creatingOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This endpoint is not defined yet ! ',
  });
};

exports.updateOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This endpoint is not defined yet ! ',
  });
};

exports.getOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This endpoint is not defined yet ! ',
  });
};

exports.deleteOneUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This endpoint is not defined yet ! ',
  });
};
