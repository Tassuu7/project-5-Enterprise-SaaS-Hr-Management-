/**
 * WorkSphere Enterprise HRMS - Security & Cryptographic Utilities
 * Layer: Core
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');

class SecurityUtil {
  static async hashPassword(plainTextPassword) {
    const saltRounds = appConfig.security.bcryptRounds || 10;
    return bcrypt.hash(plainTextPassword, saltRounds);
  }

  static async comparePassword(plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  static generateJwtToken(payload, customExpiry = null) {
    return jwt.sign(payload, appConfig.security.jwtSecret, {
      expiresIn: customExpiry || appConfig.security.jwtExpiresIn,
    });
  }

  static verifyJwtToken(token) {
    return jwt.verify(token, appConfig.security.jwtSecret);
  }

  static generateRandomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  static generateUuid() {
    return crypto.randomUUID();
  }

  static sanitizeInput(input) {
    if (typeof input === 'string') {
      return input.trim().replace(/[<>]/g, '');
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized = Array.isArray(input) ? [] : {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = SecurityUtil.sanitizeInput(value);
      }
      return sanitized;
    }
    return input;
  }

  static maskSensitiveData(data, fieldsToMask = ['password', 'ssn', 'bankAccount', 'taxId']) {
    if (!data || typeof data !== 'object') return data;
    const masked = { ...data };
    for (const field of fieldsToMask) {
      if (masked[field]) {
        const val = String(masked[field]);
        masked[field] = val.length > 4 ? `****${val.slice(-4)}` : '****';
      }
    }
    return masked;
  }
}

module.exports = SecurityUtil;
