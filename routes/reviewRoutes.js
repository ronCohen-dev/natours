const express = require('express');
const router = express.Router();
const reviewController = require('./../controllers/reviewController');

router
  .route('/')
  .get(reviewController.gettingAllreviews)
  .post(reviewController.creatingOneReview);

module.exports = router;
