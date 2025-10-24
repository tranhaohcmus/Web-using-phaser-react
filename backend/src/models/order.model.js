const { pool } = require("../config/database");

class OrderModel {
  // Generate order number
  static generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `ORD${timestamp}${random}`;
  }

  // Create order
  static async create(orderData) {
    const {
      user_id,
      order_number,
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      notes,
      subtotal,
      shipping_fee,
      total_amount,
      payment_method,
    } = orderData;

    const [result] = await pool.query(
      `INSERT INTO orders 
       (user_id, order_number, customer_name, customer_phone, customer_email, 
        shipping_address, notes, subtotal, shipping_fee, total_amount, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        shipping_address,
        notes,
        subtotal,
        shipping_fee,
        total_amount,
        payment_method,
      ]
    );
    return result.insertId;
  }

  // Create order items
  static async createOrderItems(orderId, items) {
    const values = items.map((item) => [
      orderId,
      item.product_id,
      item.product_name,
      item.product_image,
      item.quantity,
      item.unit_price,
      item.total_price,
    ]);

    await pool.query(
      `INSERT INTO order_items 
       (order_id, product_id, product_name, product_image, quantity, unit_price, total_price) 
       VALUES ?`,
      [values]
    );
  }

  // Find orders by user
  static async findByUserId(userId, filters = {}, page = 1, limit = 20) {
    let query = `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
      FROM orders o
      WHERE o.user_id = ?
    `;
    const params = [userId];

    if (filters.status) {
      query += " AND o.status = ?";
      params.push(filters.status);
    }

    query += " ORDER BY o.created_at DESC";

    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM orders WHERE user_id = ?";
    const countParams = [userId];

    if (filters.status) {
      countQuery += " AND status = ?";
      countParams.push(filters.status);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit),
      },
    };
  }

  // Find order by order number
  static async findByOrderNumber(orderNumber) {
    const [rows] = await pool.query(
      "SELECT * FROM orders WHERE order_number = ?",
      [orderNumber]
    );
    return rows[0];
  }

  // Find order by order number and user
  static async findByOrderNumberAndUser(orderNumber, userId) {
    const [rows] = await pool.query(
      "SELECT * FROM orders WHERE order_number = ? AND user_id = ?",
      [orderNumber, userId]
    );
    return rows[0];
  }

  // Get order items
  static async getOrderItems(orderId) {
    const [rows] = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );
    return rows;
  }

  // Update order status
  static async updateStatus(orderId, newStatus) {
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [
      newStatus,
      orderId,
    ]);
  }

  // Add status history
  static async addStatusHistory(
    orderId,
    oldStatus,
    newStatus,
    notes,
    changedBy
  ) {
    await pool.query(
      `INSERT INTO order_status_history (order_id, old_status, new_status, notes, changed_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, oldStatus, newStatus, notes, changedBy]
    );
  }

  // Get status history
  static async getStatusHistory(orderId) {
    const [rows] = await pool.query(
      `SELECT osh.*, u.full_name as changed_by_name
       FROM order_status_history osh
       LEFT JOIN users u ON osh.changed_by = u.id
       WHERE osh.order_id = ?
       ORDER BY osh.created_at DESC`,
      [orderId]
    );
    return rows;
  }

  // Admin: Find all orders
  static async findAll(filters = {}, page = 1, limit = 20) {
    let query = `
      SELECT o.*, u.email as customer_email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += " AND o.status = ?";
      params.push(filters.status);
    }

    if (filters.search) {
      query +=
        " AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)";
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    if (filters.from_date) {
      query += " AND o.created_at >= ?";
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      query += " AND o.created_at <= ?";
      params.push(filters.to_date);
    }

    query += " ORDER BY o.created_at DESC";

    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    // Count
    let countQuery = "SELECT COUNT(*) as total FROM orders WHERE 1=1";
    const countParams = [];

    if (filters.status) {
      countQuery += " AND status = ?";
      countParams.push(filters.status);
    }

    if (filters.search) {
      countQuery +=
        " AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)";
      countParams.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    const [countResult] = await pool.query(countQuery, countParams);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit),
      },
    };
  }

  // Get order statistics
  static async getStatistics() {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_orders,
        SUM(CASE WHEN status = 'shipping' THEN 1 ELSE 0 END) as shipping_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value
      FROM orders
    `);

    return stats[0];
  }
}

module.exports = OrderModel;
