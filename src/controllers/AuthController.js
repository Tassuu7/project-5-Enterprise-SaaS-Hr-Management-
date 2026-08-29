/**
 * WorkSphere Enterprise HRMS - Auth Controller
 * Layer: Controllers
 */

const authService = require('../services/AuthService');
const ResponseFormatter = require('../core/ResponseFormatter');

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password, tenantId } = req.body;
      const result = await authService.login(email, password, tenantId);
      return ResponseFormatter.success(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const result = await authService.registerTenantUser(req.body);
      return ResponseFormatter.created(res, result, 'User registered successfully');
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      return ResponseFormatter.success(res, req.user, 'Current profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
      return ResponseFormatter.success(res, result, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
