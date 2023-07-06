const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

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
