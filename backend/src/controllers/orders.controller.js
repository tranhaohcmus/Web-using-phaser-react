const OrderModel = require("../models/order.model");
const CartModel = require("../models/cart.model");
const ProductModel = require("../models/product.model");
const { pool } = require("../config/database");

class OrdersController {
  // Create order
  static async createOrder(req, res, next) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        customer_name,
        customer_phone,
        customer_email,
        shipping_address,
        notes,
        shipping_fee = 0,
      } = req.body;

      // Get cart items
      const cartItems = await CartModel.findByUserId(req.user.id);
      if (cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      // Validate stock and calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of cartItems) {
        const product = await ProductModel.findById(item.product_id);

        if (!product || product.status !== "active") {
          throw new Error(`Product ${item.name} is not available`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }

        const totalPrice = product.price * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          product_image: item.image,
          quantity: item.quantity,
          unit_price: product.price,
          total_price: totalPrice,
        });
      }

      const totalAmount = subtotal + shipping_fee;

      // Create order
      const orderNumber = OrderModel.generateOrderNumber();
      const orderId = await OrderModel.create({
        user_id: req.user.id,
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_email,
        shipping_address,
        notes,
        subtotal,
        shipping_fee,
        total_amount,
        payment_method: "COD",
      });

      // Create order items
      await OrderModel.createOrderItems(orderId, orderItems);

      // Update product stock and sold count
      for (const item of orderItems) {
        await ProductModel.updateStock(
          item.product_id,
          "decrease",
          item.quantity
        );
        await connection.query(
          "UPDATE products SET sold_count = sold_count + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await CartModel.clearCart(req.user.id);

      // Add initial status history
      await OrderModel.addStatusHistory(
        orderId,
        null,
        "pending",
        "Order created",
        req.user.id
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: {
          order_number: orderNumber,
          total_amount: totalAmount,
        },
      });
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }

  // Get user orders
  static async getOrders(req, res, next) {
    try {
      const { status, page = 1, limit = 20 } = req.query;

      const filters = { status };
      const result = await OrderModel.findByUserId(
        req.user.id,
        filters,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get order details
  static async getOrderDetails(req, res, next) {
    try {
      const { order_number } = req.params;

      const order = await OrderModel.findByOrderNumberAndUser(
        order_number,
        req.user.id
      );
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Get order items
      const items = await OrderModel.getOrderItems(order.id);

      // Get status history
      const statusHistory = await OrderModel.getStatusHistory(order.id);

      res.json({
        success: true,
        data: {
          ...order,
          items,
          status_history: statusHistory,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Cancel order
  static async cancelOrder(req, res, next) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { order_number } = req.params;

      const order = await OrderModel.findByOrderNumberAndUser(
        order_number,
        req.user.id
      );
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Can only cancel pending or processing orders
      if (!["pending", "processing"].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel order in current status",
        });
      }

      // Restore stock
      const items = await OrderModel.getOrderItems(order.id);
      for (const item of items) {
        await ProductModel.updateStock(
          item.product_id,
          "increase",
          item.quantity
        );
        await connection.query(
          "UPDATE products SET sold_count = GREATEST(0, sold_count - ?) WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }

      // Update status
      await OrderModel.updateStatus(order.id, "cancelled");

      // Add status history
      await OrderModel.addStatusHistory(
        order.id,
        order.status,
        "cancelled",
        "Cancelled by customer",
        req.user.id
      );

      await connection.commit();

      res.json({
        success: true,
        message: "Order cancelled successfully",
      });
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }
}

module.exports = OrdersController;
