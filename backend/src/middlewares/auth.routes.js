const express =
  require("express");

const router =
  express.Router();

const authController =
  require("./auth.controller");

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} =
  require("./auth.validator");

const validate =
  require("../../middlewares/validate.middleware");

const {
  protect,
} =
  require("../../middlewares/auth.middleware");

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

router.post(
  "/logout",
  protect,
  authController.logout
);

router.get(
  "/me",
  protect,
  authController.getMe
);

router.post(
  "/refresh-token",
  authController.refreshToken
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  authController.resetPassword
);

module.exports = router;