const CategoryModel = require("../../models/category.model");
const slugify = require("../../utils/slugify.util");

class AdminCategoriesController {
  // Create category
  static async createCategory(req, res, next) {
    try {
      const {
        name,
        description,
        image_url,
        parent_id,
        is_active,
        display_order,
      } = req.body;

      // Generate slug
      const slug = slugify(name);

      // Check if slug already exists
      const slugExists = await CategoryModel.slugExists(slug);
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }

      // If parent_id is provided, check if parent exists
      if (parent_id) {
        const parent = await CategoryModel.findById(parent_id);
        if (!parent) {
          return res.status(400).json({
            success: false,
            message: "Parent category not found",
          });
        }
      }

      // Create category
      const categoryId = await CategoryModel.create({
        name,
        slug,
        description,
        image_url,
        parent_id,
        is_active: is_active !== undefined ? is_active : true,
        display_order: display_order || 0,
      });

      const category = await CategoryModel.findById(categoryId);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update category
  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Check if category exists
      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // If name is being updated, regenerate slug
      if (updateData.name && updateData.name !== category.name) {
        const newSlug = slugify(updateData.name);
        const slugExists = await CategoryModel.slugExists(newSlug, id);
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: "Category with this name already exists",
          });
        }
        updateData.slug = newSlug;
      }

      // If parent_id is being updated, check if parent exists
      if (updateData.parent_id) {
        // Can't set self as parent
        if (updateData.parent_id === parseInt(id)) {
          return res.status(400).json({
            success: false,
            message: "Category cannot be its own parent",
          });
        }

        const parent = await CategoryModel.findById(updateData.parent_id);
        if (!parent) {
          return res.status(400).json({
            success: false,
            message: "Parent category not found",
          });
        }
      }

      // Update category
      await CategoryModel.update(id, updateData);

      const updatedCategory = await CategoryModel.findById(id);

      res.json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete category
  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Check if category has products
      // This will fail if there are products due to foreign key constraint
      // You might want to handle this more gracefully
      await CategoryModel.delete(id);

      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      // Check if error is due to foreign key constraint
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          success: false,
          message: "Cannot delete category that has products or subcategories",
        });
      }
      next(error);
    }
  }
}

module.exports = AdminCategoriesController;
