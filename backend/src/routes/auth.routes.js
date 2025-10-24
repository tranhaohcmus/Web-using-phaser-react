const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth.validator");

// Public routes
router.post("/register", registerValidator, validate, AuthController.register);
router.post("/login", loginValidator, validate, AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  AuthController.resetPassword
);

// Protected routes
router.use(authenticate);
router.post("/logout", AuthController.logout);
router.get("/me", AuthController.getProfile);
router.put("/me", AuthController.updateProfile);
router.post(
  "/change-password",
  changePasswordValidator,
  validate,
  AuthController.changePassword
);

module.exports = router;
