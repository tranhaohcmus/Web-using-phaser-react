const { pool } = require("../config/database");

class ProductModel {
  // Get products with filters and pagination
  static async findAll(filters = {}, page = 1, limit = 20) {
    let query = `
      SELECT p.*, c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filters
    if (filters.category_id) {
      query += " AND p.category_id = ?";
      params.push(filters.category_id);
    }

    if (filters.status) {
      query += " AND p.status = ?";
      params.push(filters.status);
    }

    if (filters.search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.min_price) {
      query += " AND p.price >= ?";
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      query += " AND p.price <= ?";
      params.push(filters.max_price);
    }

    // Sorting
    const sortBy = filters.sort_by || "created_at";
    const sortOrder = filters.sort_order === "asc" ? "ASC" : "DESC";
    query += ` ORDER BY p.${sortBy} ${sortOrder}`;

    // Pagination
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM products p WHERE 1=1";
    const countParams = [];

    if (filters.category_id) {
      countQuery += " AND p.category_id = ?";
      countParams.push(filters.category_id);
    }

    if (filters.status) {
      countQuery += " AND p.status = ?";
      countParams.push(filters.status);
    }

    if (filters.search) {
      countQuery += " AND (p.name LIKE ? OR p.description LIKE ?)";
      countParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Find product by slug
  static async findBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ?`,
      [slug]
    );
    return rows[0];
  }

  // Find product by ID
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Get product images
  static async getImages(productId) {
    const [rows] = await pool.query(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC",
      [productId]
    );
    return rows;
  }

  // Create product
  static async create(productData) {
    const {
      category_id,
      name,
      slug,
      description,
      price,
      compare_price,
      stock_quantity,
      sku,
      status,
    } = productData;
    const [result] = await pool.query(
      `INSERT INTO products (category_id, name, slug, description, price, compare_price, stock_quantity, sku, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        slug,
        description,
        price,
        compare_price,
        stock_quantity || 0,
        sku,
        status || "active",
      ]
    );
    return result.insertId;
  }

  // Update product
  static async update(id, productData) {
    const fields = [];
    const values = [];

    Object.keys(productData).forEach((key) => {
      if (productData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(productData[key]);
      }
    });

    if (fields.length === 0) return;

    values.push(id);
    await pool.query(
      `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
  }

  // Delete product
  static async delete(id) {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
  }

  // Add product image
  static async addImage(productId, imageData) {
    const { image_url, alt_text, is_primary, display_order } = imageData;

    // If this is primary, unset other primary images
    if (is_primary) {
      await pool.query(
        "UPDATE product_images SET is_primary = FALSE WHERE product_id = ?",
        [productId]
      );
    }

    const [result] = await pool.query(
      `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) 
       VALUES (?, ?, ?, ?, ?)`,
      [productId, image_url, alt_text, is_primary || false, display_order || 0]
    );
    return result.insertId;
  }

  // Delete image
  static async deleteImage(imageId) {
    await pool.query("DELETE FROM product_images WHERE id = ?", [imageId]);
  }

  // Update stock
  static async updateStock(id, action, quantity) {
    let query;
    if (action === "set") {
      query = "UPDATE products SET stock_quantity = ? WHERE id = ?";
      await pool.query(query, [quantity, id]);
    } else if (action === "increase") {
      query =
        "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?";
      await pool.query(query, [quantity, id]);
    } else if (action === "decrease") {
      query =
        "UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - ?) WHERE id = ?";
      await pool.query(query, [quantity, id]);
    }
  }

  // Increment view count
  static async incrementViewCount(id) {
    await pool.query(
      "UPDATE products SET view_count = view_count + 1 WHERE id = ?",
      [id]
    );
  }

  // Check if slug exists
  static async slugExists(slug, excludeId = null) {
    let query = "SELECT id FROM products WHERE slug = ?";
    const params = [slug];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    return rows.length > 0;
  }
}

module.exports = ProductModel;
