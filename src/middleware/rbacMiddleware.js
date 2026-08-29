/**
 * WorkSphere Enterprise HRMS - Role & Permission Gating Middleware
 * Layer: Middleware
 */

const ResponseFormatter = require('../core/ResponseFormatter');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseFormatter.error(res, 'Unauthenticated user', 401, 'UNAUTHORIZED');
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next(); // Super admin bypasses all role constraints
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ResponseFormatter.error(res, 'Access denied: Insufficient role permissions', 403, 'FORBIDDEN');
    }

    next();
  };
};

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseFormatter.error(res, 'Unauthenticated user', 401, 'UNAUTHORIZED');
    }

    if (req.user.role === 'SUPER_ADMIN' || (req.user.permissions && req.user.permissions.includes(permission))) {
      return next();
    }

    return ResponseFormatter.error(res, `Access denied: Missing permission '${permission}'`, 403, 'FORBIDDEN');
  };
};

module.exports = { requireRole, requirePermission };
