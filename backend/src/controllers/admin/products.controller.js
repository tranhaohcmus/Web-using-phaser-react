const ProductModel = require("../../models/product.model");
const slugify = require("../../utils/slugify.util");
const path = require("path");
const fs = require("fs").promises;

class AdminProductsController {
  // Create product
  static async createProduct(req, res, next) {
    try {
      const {
        category_id,
        name,
        description,
        price,
        compare_price,
        stock_quantity,
        sku,
        status,
      } = req.body;

      // Generate slug
      const slug = slugify(name);

      // Check if slug already exists
      const slugExists = await ProductModel.slugExists(slug);
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Product with this name already exists",
        });
      }

      // Create product
      const productId = await ProductModel.create({
        category_id,
        name,
        slug,
        description,
        price,
        compare_price,
        stock_quantity,
        sku,
        status,
      });

      // Upload images if provided
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          await ProductModel.addImage(productId, {
            image_url: `/uploads/products/${req.files[i].filename}`,
            alt_text: name,
            is_primary: i === 0,
            display_order: i,
          });
        }
      }

      const product = await ProductModel.findById(productId);
      const images = await ProductModel.getImages(productId);

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
          ...product,
          images,
        },
      });
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            await fs.unlink(file.path);
          } catch (err) {
            // Ignore errors during cleanup
          }
        }
      }
      next(error);
    }
  }

  // Update product
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      // Check if product exists
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // If name is being updated, regenerate slug
      if (updateData.name && updateData.name !== product.name) {
        const newSlug = slugify(updateData.name);
        const slugExists = await ProductModel.slugExists(newSlug, id);
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: "Product with this name already exists",
          });
        }
        updateData.slug = newSlug;
      }

      // Update product
      await ProductModel.update(id, updateData);

      const updatedProduct = await ProductModel.findById(id);
      const images = await ProductModel.getImages(id);

      res.json({
        success: true,
        message: "Product updated successfully",
        data: {
          ...updatedProduct,
          images,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete product
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Get and delete product images from filesystem
      const images = await ProductModel.getImages(id);
      for (const image of images) {
        try {
          const imagePath = path.join(__dirname, "../../../", image.image_url);
          await fs.unlink(imagePath);
        } catch (err) {
          // Ignore errors if file doesn't exist
        }
      }

      // Delete product (will cascade delete images from DB)
      await ProductModel.delete(id);

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Upload additional images
  static async uploadImages(req, res, next) {
    try {
      const { id } = req.params;

      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No images provided",
        });
      }

      // Get current image count for display order
      const existingImages = await ProductModel.getImages(id);
      let displayOrder = existingImages.length;

      // Add new images
      const newImages = [];
      for (const file of req.files) {
        const imageId = await ProductModel.addImage(id, {
          image_url: `/uploads/products/${file.filename}`,
          alt_text: product.name,
          is_primary: false,
          display_order: displayOrder++,
        });
        newImages.push({
          id: imageId,
          image_url: `/uploads/products/${file.filename}`,
        });
      }

      res.json({
        success: true,
        message: "Images uploaded successfully",
        data: newImages,
      });
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            await fs.unlink(file.path);
          } catch (err) {
            // Ignore errors during cleanup
          }
        }
      }
      next(error);
    }
  }

  // Delete image
  static async deleteImage(req, res, next) {
    try {
      const { id } = req.params;

      // Get image info before deleting
      const [image] = await ProductModel.pool.query(
        "SELECT * FROM product_images WHERE id = ?",
        [id]
      );

      if (!image || image.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Image not found",
        });
      }

      // Delete file from filesystem
      try {
        const imagePath = path.join(__dirname, "../../../", image[0].image_url);
        await fs.unlink(imagePath);
      } catch (err) {
        // Ignore errors if file doesn't exist
      }

      // Delete from database
      await ProductModel.deleteImage(id);

      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Update stock
  static async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { action, quantity } = req.body;

      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      await ProductModel.updateStock(id, action, quantity);

      const updatedProduct = await ProductModel.findById(id);

      res.json({
        success: true,
        message: "Stock updated successfully",
        data: {
          stock_quantity: updatedProduct.stock_quantity,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminProductsController;
