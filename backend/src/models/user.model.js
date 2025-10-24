const { pool } = require("../config/database");

class UserModel {
  // Create new user
  static async create(userData) {
    const { email, password_hash, full_name, phone, address, role } = userData;
    const [result] = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, phone, address, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, password_hash, full_name, phone, address, role || "customer"]
    );
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, email, full_name, phone, address, role, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Update user profile
  static async update(id, userData) {
    const { full_name, phone, address } = userData;
    await pool.query(
      `UPDATE users SET full_name = ?, phone = ?, address = ? WHERE id = ?`,
      [full_name, phone, address, id]
    );
  }

  // Change password
  static async updatePassword(id, password_hash) {
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      password_hash,
      id,
    ]);
  }

  // Create password reset token
  static async createPasswordReset(userId, token, expiresAt) {
    const [result] = await pool.query(
      `INSERT INTO password_resets (user_id, token, expires_at) 
       VALUES (?, ?, ?)`,
      [userId, token, expiresAt]
    );
    return result.insertId;
  }

  // Find valid password reset token
  static async findPasswordResetToken(token) {
    const [rows] = await pool.query(
      `SELECT pr.*, u.email, u.id as user_id 
       FROM password_resets pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.token = ? AND pr.used = FALSE AND pr.expires_at > NOW()`,
      [token]
    );
    return rows[0];
  }

  // Mark token as used
  static async markTokenAsUsed(token) {
    await pool.query("UPDATE password_resets SET used = TRUE WHERE token = ?", [
      token,
    ]);
  }
}

module.exports = UserModel;
