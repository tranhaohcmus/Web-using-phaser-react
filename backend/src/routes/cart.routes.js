const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller");
const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  addToCartValidator,
  updateCartValidator,
} = require("../validators/cart.validator");

// All cart routes require authentication
router.use(authenticate);

router.get("/", CartController.getCart);
router.post("/items", addToCartValidator, validate, CartController.addToCart);
router.put(
  "/items/:id",
  updateCartValidator,
  validate,
  CartController.updateCartItem
);
router.delete("/items/:id", CartController.removeFromCart);
router.delete("/", CartController.clearCart);

module.exports = router;
