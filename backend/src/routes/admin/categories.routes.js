const express = require("express");
const router = express.Router();
const AdminCategoriesController = require("../../controllers/admin/categories.controller");
const authenticate = require("../../middleware/auth");
const requireAdmin = require("../../middleware/admin");
const { body } = require("express-validator");
const validate = require("../../middleware/validate");

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Validators
const createCategoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("description").optional().trim(),
  body("image_url").optional().trim(),
  body("parent_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid parent category"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be boolean"),
  body("display_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("display_order must be non-negative"),
];

const updateCategoryValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty"),
  body("description").optional().trim(),
  body("image_url").optional().trim(),
  body("parent_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid parent category"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be boolean"),
  body("display_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("display_order must be non-negative"),
];

router.post(
  "/",
  createCategoryValidator,
  validate,
  AdminCategoriesController.createCategory
);
router.put(
  "/:id",
  updateCategoryValidator,
  validate,
  AdminCategoriesController.updateCategory
);
router.delete("/:id", AdminCategoriesController.deleteCategory);

module.exports = router;
