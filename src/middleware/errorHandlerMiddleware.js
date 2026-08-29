/**
 * WorkSphere Enterprise HRMS - Centralized Error Handler Middleware
 * Layer: Middleware
 */

const logger = require('../core/Logger');
const ResponseFormatter = require('../core/ResponseFormatter');
const { AppError } = require('../core/AppError');

const errorHandlerMiddleware = (err, req, res, next) => {
  logger.error(`[Unhandled Error] ${req.method} ${req.originalUrl}: ${err.message}`, err);

  if (err instanceof AppError) {
    return ResponseFormatter.error(res, err.message, err.statusCode, err.errorCode, err.details);
  }

  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'An internal enterprise server error occurred' : err.message;
  return ResponseFormatter.error(res, message, statusCode, 'INTERNAL_SERVER_ERROR', err.stack);
};

module.exports = errorHandlerMiddleware;
