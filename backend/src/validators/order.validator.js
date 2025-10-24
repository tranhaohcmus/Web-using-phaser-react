const { body, param } = require("express-validator");

const createOrderValidator = [
  body("customer_name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ max: 255 })
    .withMessage("Name too long"),
  body("customer_phone")
    .matches(/^[0-9]{10,11}$/)
    .withMessage("Invalid phone number"),
  body("customer_email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("shipping_address")
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required"),
  body("notes").optional().trim(),
  body("shipping_fee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Shipping fee must be non-negative"),
];

const updateOrderStatusValidator = [
  param("order_number").notEmpty().withMessage("Order number is required"),
  body("status")
    .isIn(["pending", "processing", "shipping", "completed", "cancelled"])
    .withMessage("Invalid order status"),
  body("notes").optional().trim(),
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
};
