const ProductModel = require("../models/product.model");

class ProductsController {
  // Get all products
  static async getProducts(req, res, next) {
    try {
      const {
        category_id,
        status = "active",
        search,
        min_price,
        max_price,
        sort_by,
        sort_order,
        page = 1,
        limit = 20,
      } = req.query;

      const filters = {
        category_id,
        status,
        search,
        min_price,
        max_price,
        sort_by,
        sort_order,
      };

      const result = await ProductModel.findAll(
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

  // Get product by slug
  static async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const product = await ProductModel.findBySlug(slug);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Get images
      const images = await ProductModel.getImages(product.id);

      // Increment view count
      await ProductModel.incrementViewCount(product.id);

      res.json({
        success: true,
        data: {
          ...product,
          images,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductsController;
