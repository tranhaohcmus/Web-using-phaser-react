const UserModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { generateTokens, verifyRefreshToken } = require("../utils/jwt.util");
const { sendPasswordResetEmail } = require("../utils/email.util");
const { v4: uuidv4 } = require("uuid");

class AuthController {
  // Register
  static async register(req, res, next) {
    try {
      const { email, password, full_name, phone, address } = req.body;

      // Check if email exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Hash password
      const password_hash = await hashPassword(password);

      // Create user
      const userId = await UserModel.create({
        email,
        password_hash,
        full_name,
        phone,
        address,
      });

      // Generate tokens
      const tokens = generateTokens({ id: userId, email, role: "customer" });

      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          user: { id: userId, email, full_name, role: "customer" },
          ...tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check password
      const isValidPassword = await comparePassword(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate tokens
      const tokens = generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
          },
          ...tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user info
  static async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user profile
  static async getProfile(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Remove password_hash from response
      delete user.password_hash;

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update profile
  static async updateProfile(req, res, next) {
    try {
      const { full_name, phone, address } = req.body;

      await UserModel.update(req.user.id, {
        full_name,
        phone,
        address,
      });

      const updatedUser = await UserModel.findById(req.user.id);

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // Change password
  static async changePassword(req, res, next) {
    try {
      const { current_password, new_password } = req.body;

      // Get user with password
      const user = await UserModel.findByEmail(req.user.email);

      // Verify current password
      const isValid = await comparePassword(
        current_password,
        user.password_hash
      );
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const password_hash = await hashPassword(new_password);

      // Update password
      await UserModel.updatePassword(req.user.id, password_hash);

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Forgot password
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return res.json({
          success: true,
          message: "If email exists, reset instructions will be sent",
        });
      }

      // Generate reset token
      const resetToken = uuidv4();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save token
      await UserModel.createPasswordReset(user.id, resetToken, expiresAt);

      // Send email
      await sendPasswordResetEmail(email, resetToken);

      res.json({
        success: true,
        message: "Password reset instructions sent to email",
      });
    } catch (error) {
      next(error);
    }
  }

  // Reset password
  static async resetPassword(req, res, next) {
    try {
      const { token, new_password } = req.body;

      // Find valid token
      const resetRecord = await UserModel.findPasswordResetToken(token);
      if (!resetRecord) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      // Hash new password
      const password_hash = await hashPassword(new_password);

      // Update password
      await UserModel.updatePassword(resetRecord.user_id, password_hash);

      // Mark token as used
      await UserModel.markTokenAsUsed(token);

      res.json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
        });
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Generate new tokens
      const tokens = generateTokens({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout (client-side token removal)
  static async logout(req, res) {
    res.json({
      success: true,
      message: "Logout successful",
    });
  }
}

module.exports = AuthController;
