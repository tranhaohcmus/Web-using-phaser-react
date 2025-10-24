const { pool } = require("../config/database");

class CategoryModel {
  // Get all active categories
  static async findAll(filters = {}) {
    let query = "SELECT * FROM categories WHERE 1=1";
    const params = [];

    if (filters.is_active !== undefined) {
      query += " AND is_active = ?";
      params.push(filters.is_active);
    }

    if (filters.parent_id !== undefined) {
      if (filters.parent_id === null) {
        query += " AND parent_id IS NULL";
      } else {
        query += " AND parent_id = ?";
        params.push(filters.parent_id);
      }
    }

    query += " ORDER BY display_order ASC, name ASC";

    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Find category by slug
  static async findBySlug(slug) {
    const [rows] = await pool.query("SELECT * FROM categories WHERE slug = ?", [
      slug,
    ]);
    return rows[0];
  }

  // Find category by ID
  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  // Create category
  static async create(categoryData) {
    const {
      name,
      slug,
      description,
      image_url,
      parent_id,
      is_active,
      display_order,
    } = categoryData;
    const [result] = await pool.query(
      `INSERT INTO categories (name, slug, description, image_url, parent_id, is_active, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        description,
        image_url,
        parent_id,
        is_active ?? true,
        display_order ?? 0,
      ]
    );
    return result.insertId;
  }

  // Update category
  static async update(id, categoryData) {
    const {
      name,
      slug,
      description,
      image_url,
      parent_id,
      is_active,
      display_order,
    } = categoryData;
    await pool.query(
      `UPDATE categories 
       SET name = ?, slug = ?, description = ?, image_url = ?, 
           parent_id = ?, is_active = ?, display_order = ?
       WHERE id = ?`,
      [
        name,
        slug,
        description,
        image_url,
        parent_id,
        is_active,
        display_order,
        id,
      ]
    );
  }

  // Delete category
  static async delete(id) {
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
  }

  // Check if slug exists
  static async slugExists(slug, excludeId = null) {
    let query = "SELECT id FROM categories WHERE slug = ?";
    const params = [slug];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    return rows.length > 0;
  }
}

module.exports = CategoryModel;
