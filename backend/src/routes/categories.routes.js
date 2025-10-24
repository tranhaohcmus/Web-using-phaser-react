const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/categories.controller");

// Public routes
router.get("/", CategoriesController.getCategories);
router.get("/:slug", CategoriesController.getCategoryBySlug);

module.exports = router;
