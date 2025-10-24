const { body, param } = require("express-validator");

const addToCartValidator = [
  body("product_id")
    .isInt({ min: 1 })
    .withMessage("Valid product ID is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

const updateCartValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid cart item ID is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

module.exports = {
  addToCartValidator,
  updateCartValidator,
};
