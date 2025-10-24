const express = require("express");
const router = express.Router();
const AdminProductsController = require("../../controllers/admin/products.controller");
const authenticate = require("../../middleware/auth");
const requireAdmin = require("../../middleware/admin");
const upload = require("../../config/multer");
const validate = require("../../middleware/validate");
const {
  createProductValidator,
  updateProductValidator,
  updateStockValidator,
} = require("../../validators/product.validator");

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Product CRUD
router.post(
  "/",
  upload.array("images", 5),
  createProductValidator,
  validate,
  AdminProductsController.createProduct
);

router.put(
  "/:id",
  updateProductValidator,
  validate,
  AdminProductsController.updateProduct
);

router.delete("/:id", AdminProductsController.deleteProduct);

// Image management
router.post(
  "/:id/images",
  upload.array("images", 5),
  AdminProductsController.uploadImages
);

router.delete("/images/:id", AdminProductsController.deleteImage);

// Stock management
router.patch(
  "/:id/stock",
  updateStockValidator,
  validate,
  AdminProductsController.updateStock
);

module.exports = router;
