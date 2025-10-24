const { body } = require("express-validator");

const registerValidator = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("full_name")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Full name too long"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidator = [
  body("full_name")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Full name too long"),
  body("phone")
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage("Invalid phone number"),
  body("address").optional().trim(),
];

const changePasswordValidator = [
  body("current_password")
    .notEmpty()
    .withMessage("Current password is required"),
  body("new_password")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

const forgotPasswordValidator = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
];

const resetPasswordValidator = [
  body("token").notEmpty().withMessage("Token is required"),
  body("new_password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
