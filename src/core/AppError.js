/**
 * WorkSphere Enterprise HRMS - Enterprise Application Error Hierarchy
 * Layer: Core
 */

class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed for request payload', errors = []) {
    super(message, 400, 'VALIDATION_ERROR', errors);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Invalid authentication credentials provided') {
    super(message, 401, 'AUTHENTICATION_FAILED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Insufficient enterprise permissions to access this resource') {
    super(message, 403, 'FORBIDDEN_RESOURCE');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource', identifier = '') {
    const msg = identifier ? `${resource} with identifier '${identifier}' not found` : `${resource} was not found`;
    super(msg, 404, 'RESOURCE_NOT_FOUND', { resource, identifier });
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict occurred with existing records') {
    super(message, 409, 'RESOURCE_CONFLICT');
  }
}

class PayrollCalculationError extends AppError {
  constructor(message = 'Payroll calculation anomaly or invalid salary structure') {
    super(message, 422, 'PAYROLL_CALCULATION_ERROR');
  }
}

class BusinessRuleViolationError extends AppError {
  constructor(ruleName, explanation) {
    super(`Enterprise Policy Violation: ${ruleName}. ${explanation}`, 422, 'BUSINESS_RULE_VIOLATION', { ruleName, explanation });
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  PayrollCalculationError,
  BusinessRuleViolationError,
};
