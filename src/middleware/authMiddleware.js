/**
 * WorkSphere Enterprise HRMS - JWT Authentication Middleware
 * Layer: Middleware
 */

const authService = require('../services/AuthService');
const ResponseFormatter = require('../core/ResponseFormatter');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseFormatter.error(res, 'Authentication token missing or invalid format', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const user = await authService.verifyTokenAndGetUser(token);
    req.user = user;
    req.tenantId = user.tenant_id;
    next();
  } catch (err) {
    return ResponseFormatter.error(res, err.message, err.statusCode || 401, err.errorCode || 'UNAUTHORIZED');
  }
};

module.exports = authMiddleware;
