const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.gettingAllTours);

router.route('/tour-stats').get(tourController.getToursStatus);

router
  .route('/')
  .get(tourController.gettingAllTours)
  .post(tourController.creatingOneTour);
router
  .route('/:id')
  .patch(tourController.updateOneTour)
  .get(tourController.getOneTour)
  .delete(tourController.deleteOneTour);

module.exports = router;
