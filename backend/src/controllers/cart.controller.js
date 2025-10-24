const CartModel = require("../models/cart.model");
const ProductModel = require("../models/product.model");

class CartController {
  // Get cart
  static async getCart(req, res, next) {
    try {
      const cartItems = await CartModel.findByUserId(req.user.id);

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      res.json({
        success: true,
        data: {
          items: cartItems,
          summary: {
            items_count: cartItems.length,
            total_quantity: cartItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            ),
            subtotal,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Add to cart
  static async addToCart(req, res, next) {
    try {
      const { product_id, quantity } = req.body;

      // Check product exists and available
      const product = await ProductModel.findById(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.status !== "active") {
        return res.status(400).json({
          success: false,
          message: "Product is not available",
        });
      }

      if (product.stock_quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }

      // Add to cart
      await CartModel.add(req.user.id, product_id, quantity);

      res.status(201).json({
        success: true,
        message: "Product added to cart",
      });
    } catch (error) {
      next(error);
    }
  }

  // Update cart item
  static async updateCartItem(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      // Check cart item belongs to user
      const cartItem = await CartModel.findByIdAndUser(id, req.user.id);
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      // Check stock
      const product = await ProductModel.findById(cartItem.product_id);
      if (product.stock_quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }

      // Update quantity
      await CartModel.updateQuantity(id, quantity);

      res.json({
        success: true,
        message: "Cart updated",
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove from cart
  static async removeFromCart(req, res, next) {
    try {
      const { id } = req.params;

      // Check cart item belongs to user
      const cartItem = await CartModel.findByIdAndUser(id, req.user.id);
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      await CartModel.delete(id);

      res.json({
        success: true,
        message: "Item removed from cart",
      });
    } catch (error) {
      next(error);
    }
  }

  // Clear cart
  static async clearCart(req, res, next) {
    try {
      await CartModel.clearCart(req.user.id);

      res.json({
        success: true,
        message: "Cart cleared",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
