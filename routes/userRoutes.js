const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/')
  .get(userController.gettingAllUsers)
  .post(userController.creatingOneUser);

router
  .route('/:id')
  .patch(userController.updateOneUser)
  .get(userController.getOneUser)
  .delete(userController.deleteOneUser);

module.exports = router;
