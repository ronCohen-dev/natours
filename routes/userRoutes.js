const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-password',
  authController.protectResorce,
  authController.updatePassword,
);

router.patch(
  '/updateMe',
  authController.protectResorce,
  userController.updateMe,
);

router.delete(
  '/deleteMe',
  authController.protectResorce,
  userController.deleteMe,
);

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
