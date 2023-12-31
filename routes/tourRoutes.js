const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.gettingAllTours);

router.route('/tour-stats').get(tourController.getToursStatus);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protectResorce, tourController.gettingAllTours)
  .post(tourController.creatingOneTour);
router
  .route('/:id')
  .patch(tourController.updateOneTour)
  .get(tourController.getOneTour)
  .delete(
    authController.protectResorce,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteOneTour,
  );

module.exports = router;
