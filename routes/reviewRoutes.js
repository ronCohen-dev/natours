const express = require('express');
const router = express.Router();
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

router
  .route('/')
  .get(reviewController.gettingAllreviews)
  .post(
    authController.protectResorce,
    authController.restrictTo('user'),
    reviewController.creatingOneReview,
  );

module.exports = router;
