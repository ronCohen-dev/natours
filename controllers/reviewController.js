const catchAsyncErrors = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
const Review = require('./../models/reviewModel');

// getting all reviews
exports.gettingAllreviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

//adding one review
exports.creatingOneReview = catchAsyncErrors(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
