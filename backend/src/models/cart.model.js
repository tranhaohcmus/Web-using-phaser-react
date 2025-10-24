const { pool } = require("../config/database");

class CartModel {
  // Get user's cart
  static async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT ci.*, p.name, p.slug, p.price, p.stock_quantity, p.status,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [userId]
    );
    return rows;
  }

  // Find cart item
  static async findCartItem(userId, productId) {
    const [rows] = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    return rows[0];
  }

  // Add to cart
  static async add(userId, productId, quantity) {
    const [result] = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, productId, quantity]
    );
    return result.insertId || result.affectedRows;
  }

  // Update cart item quantity
  static async updateQuantity(id, quantity) {
    await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
      quantity,
      id,
    ]);
  }

  // Delete cart item
  static async delete(id) {
    await pool.query("DELETE FROM cart_items WHERE id = ?", [id]);
  }

  // Clear user's cart
  static async clearCart(userId) {
    await pool.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
  }

  // Find cart item by ID and user
  static async findByIdAndUser(id, userId) {
    const [rows] = await pool.query(
      "SELECT * FROM cart_items WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return rows[0];
  }
}

module.exports = CartModel;
