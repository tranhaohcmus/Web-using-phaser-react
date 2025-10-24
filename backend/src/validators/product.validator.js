const { body, param } = require("express-validator");

const createProductValidator = [
  body("category_id")
    .isInt({ min: 1 })
    .withMessage("Valid category ID is required"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 500 })
    .withMessage("Name too long"),
  body("description").optional().trim(),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("compare_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Compare price must be a positive number"),
  body("stock_quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be non-negative"),
  body("sku")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("SKU too long"),
];

const updateProductValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid product ID is required"),
  body("category_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid category ID is required"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Name too long"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("compare_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Compare price must be a positive number"),
  body("stock_quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be non-negative"),
  body("status")
    .optional()
    .isIn(["active", "inactive", "out_of_stock"])
    .withMessage("Invalid status"),
];

const updateStockValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid product ID is required"),
  body("action")
    .isIn(["set", "increase", "decrease"])
    .withMessage("Action must be set, increase, or decrease"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be non-negative"),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  updateStockValidator,
};
