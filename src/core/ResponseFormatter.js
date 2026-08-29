/**
 * WorkSphere Enterprise HRMS - Standard API Response Formatter
 * Layer: Core
 */

class ResponseFormatter {
  static success(res, data = null, message = 'Operation successful', statusCode = 200, meta = null) {
    const payload = {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    if (meta) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  }

  static created(res, data = null, message = 'Resource successfully created') {
    return ResponseFormatter.success(res, data, message, 201);
  }

  static paginated(res, items, total, page = 1, limit = 20, message = 'Items retrieved successfully') {
    const totalPages = Math.ceil(total / limit) || 1;
    const meta = {
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalItems: parseInt(total, 10),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    };
    return ResponseFormatter.success(res, items, message, 200, meta);
  }

  static error(res, message = 'An unexpected error occurred', statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      errorCode,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = ResponseFormatter;
