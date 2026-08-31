/**
 * WorkSphere Enterprise HRMS - Application Configuration
 * Layer: Configuration
 */
require('dotenv').config();

const path = require('path');

const appConfig = {
  app: {
    name: process.env.APP_NAME || 'WorkSphere Enterprise HRMS',
    version: '4.2.0',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5005,
    host: process.env.HOST || '127.0.0.1',
    url: process.env.APP_URL || 'http://localhost:5005',
    apiPrefix: '/api/v1',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_key_worksphere_hrms_enterprise_security_2026',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    sessionSecret: process.env.SESSION_SECRET || 'enterprise_session_hash_cookie_secret_key_2026',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 1000,
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Tenant-ID'],
    }
  },
  database: {
    storage: path.resolve(__dirname, '../../storage/database.sqlite'),
    inMemory: false,
    verbose: process.env.NODE_ENV === 'development',
  },
  storage: {
    uploadDir: path.resolve(__dirname, '../../storage/uploads'),
    maxFileSize: 25 * 1024 * 1024, // 25 MB
    allowedExtensions: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.xlsx', '.csv'],
  },
  tenancy: {
    defaultTenantId: process.env.DEFAULT_TENANT_ID || 'org_tenant_enterprise_001',
    defaultOrgName: 'Apex Global Technologies Enterprises',
  },
  audit: {
    enabled: true,
    retentionDays: 365,
    sensitiveFields: ['password', 'token', 'jwtSecret', 'creditCard', 'ssn'],
  },
  modules: {
    auth: true,
    employees: true,
    orgChart: true,
    attendance: true,
    leaves: true,
    payroll: true,
    recruitment: true,
    performance: true,
    onboarding: true,
    helpdesk: true,
    documents: true,
    analytics: true,
    auditLogs: true,
    settings: true
  }
};

module.exports = appConfig;
