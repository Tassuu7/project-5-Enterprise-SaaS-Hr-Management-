/**
 * WorkSphere Enterprise HRMS - Schema Validator Engine
 * Layer: Core
 */

const { ValidationError } = require('./AppError');

class Validator {
  static validate(data, rules) {
    const errors = [];
    for (const [field, ruleSet] of Object.entries(rules)) {
      const value = data[field];

      if (ruleSet.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: ruleSet.message || `${field} is required` });
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (ruleSet.type) {
          if (ruleSet.type === 'email' && !Validator.isEmail(value)) {
            errors.push({ field, message: `${field} must be a valid email address` });
          } else if (ruleSet.type === 'number' && isNaN(Number(value))) {
            errors.push({ field, message: `${field} must be a valid number` });
          } else if (ruleSet.type === 'date' && isNaN(Date.parse(value))) {
            errors.push({ field, message: `${field} must be a valid ISO date string` });
          } else if (ruleSet.type === 'array' && !Array.isArray(value)) {
            errors.push({ field, message: `${field} must be an array` });
          }
        }

        if (ruleSet.minLength && String(value).length < ruleSet.minLength) {
          errors.push({ field, message: `${field} must be at least ${ruleSet.minLength} characters` });
        }

        if (ruleSet.maxLength && String(value).length > ruleSet.maxLength) {
          errors.push({ field, message: `${field} must not exceed ${ruleSet.maxLength} characters` });
        }

        if (ruleSet.enum && !ruleSet.enum.includes(value)) {
          errors.push({ field, message: `${field} must be one of: ${ruleSet.enum.join(', ')}` });
        }

        if (ruleSet.min !== undefined && Number(value) < ruleSet.min) {
          errors.push({ field, message: `${field} must be at least ${ruleSet.min}` });
        }

        if (ruleSet.max !== undefined && Number(value) > ruleSet.max) {
          errors.push({ field, message: `${field} must not exceed ${ruleSet.max}` });
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed for request payload', errors);
    }

    return true;
  }

  static isEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
}

module.exports = Validator;
