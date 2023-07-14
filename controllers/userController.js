const User = require('./../models/userModel');
const catchAsyncErrors = require('./../utils/catchAsync');

exports.gettingAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(500).json({
    status: 'seccess',
    resultes: users.length,
    data: {
      users,
    },
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
