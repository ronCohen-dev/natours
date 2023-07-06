const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.gettingAllTours)
  .post(tourController.checkBody, tourController.creatingOneTour);
router
  .route('/:id')
  .patch(tourController.updateOneTour)
  .get(tourController.getOneTour)
  .delete(tourController.deleteOneTour);

module.exports = router;
