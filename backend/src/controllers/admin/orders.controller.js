const OrderModel = require("../../models/order.model");
const ProductModel = require("../../models/product.model");
const { pool } = require("../../config/database");

class AdminOrdersController {
  // Get all orders
  static async getAllOrders(req, res, next) {
    try {
      const {
        status,
        payment_status,
        search,
        from_date,
        to_date,
        page = 1,
        limit = 20,
      } = req.query;

      const filters = {
        status,
        payment_status,
        search,
        from_date,
        to_date,
      };

      const result = await OrderModel.findAll(
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

      const order = await OrderModel.findByOrderNumber(order_number);
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

  // Update order status
  static async updateOrderStatus(req, res, next) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { order_number } = req.params;
      const { status, notes } = req.body;

      const order = await OrderModel.findByOrderNumber(order_number);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // If cancelling order, restore stock
      if (
        status === "cancelled" &&
        ["pending", "processing"].includes(order.status)
      ) {
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
      }

      // Update order status
      await OrderModel.updateStatus(order.id, status);

      // Add status history
      await OrderModel.addStatusHistory(
        order.id,
        order.status,
        status,
        notes || `Status updated by admin`,
        req.user.id
      );

      // If status is delivered, update payment status to paid
      if (status === "delivered") {
        await connection.query(
          "UPDATE orders SET payment_status = 'paid' WHERE id = ?",
          [order.id]
        );
      }

      await connection.commit();

      const updatedOrder = await OrderModel.findByOrderNumber(order_number);

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
      });
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }

  // Get order statistics
  static async getStatistics(req, res, next) {
    try {
      const stats = await OrderModel.getStatistics();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminOrdersController;
