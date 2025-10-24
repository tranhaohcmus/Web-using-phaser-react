const CategoryModel = require("../models/category.model");

class CategoriesController {
  // Get all categories
  static async getCategories(req, res, next) {
    try {
      const { is_active = true, parent_id } = req.query;

      const filters = {
        is_active: is_active === "true",
        parent_id: parent_id === "null" ? null : parent_id,
      };

      const categories = await CategoryModel.findAll(filters);

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get category by slug
  static async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const category = await CategoryModel.findBySlug(slug);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriesController;
