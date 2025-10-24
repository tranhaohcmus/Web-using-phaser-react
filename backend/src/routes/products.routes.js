const express = require("express");
const router = express.Router();
const ProductsController = require("../controllers/products.controller");

// Public routes
router.get("/", ProductsController.getProducts);
router.get("/:slug", ProductsController.getProductBySlug);

module.exports = router;
