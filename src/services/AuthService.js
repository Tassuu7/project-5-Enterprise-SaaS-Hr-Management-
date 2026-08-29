/**
 * WorkSphere Enterprise HRMS - Authentication & Identity Management Service
 * Layer: Business Logic (Services)
 */

const userRepository = require('../repositories/UserRepository');
const SecurityUtil = require('../core/SecurityUtil');
const { AuthenticationError, ConflictError, ValidationError, NotFoundError } = require('../core/AppError');
const logger = require('../core/Logger');
const eventBus = require('../core/EventBus');
const { ROLES, ROLE_PERMISSIONS } = require('../config/roles.config');

class AuthService {
  async login(email, password, tenantId = 'org_tenant_enterprise_001') {
    if (!email || !password) {
      throw new ValidationError('Email and password credentials are required');
    }

    const user = await userRepository.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      logger.warn(`Failed login attempt for unknown email: ${email}`);
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user.is_active) {
      throw new AuthenticationError('Account has been deactivated. Contact HR Administration.');
    }

    const isMatch = await SecurityUtil.comparePassword(password, user.password_hash);
    if (!isMatch) {
      logger.warn(`Failed login attempt for user ID: ${user.id}`);
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login timestamp
    await userRepository.update(user.id, { last_login_at: new Date().toISOString() });

    const payload = {
      userId: user.id,
      tenantId: user.tenant_id,
      email: user.email,
      role: user.role,
      name: `${user.first_name} ${user.last_name}`,
    };

    const token = SecurityUtil.generateJwtToken(payload);

    eventBus.publish('USER_LOGGED_IN', { userId: user.id, email: user.email, tenantId: user.tenant_id });

    return {
      token,
      user: {
        id: user.id,
        tenantId: user.tenant_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatarUrl: user.avatar_url,
        permissions: ROLE_PERMISSIONS[user.role] || [],
      }
    };
  }

  async registerTenantUser(data) {
    const existing = await userRepository.findOne({ email: data.email.toLowerCase().trim() });
    if (existing) {
      throw new ConflictError(`User with email '${data.email}' already exists in system`);
    }

    const passwordHash = await SecurityUtil.hashPassword(data.password || 'EnterprisePass2026!');

    const user = await userRepository.create({
      tenant_id: data.tenantId || 'org_tenant_enterprise_001',
      email: data.email.toLowerCase().trim(),
      password_hash: passwordHash,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role || ROLES.EMPLOYEE,
      avatar_url: data.avatarUrl || null,
      is_active: 1,
      mfa_enabled: 0,
    });

    eventBus.publish('USER_REGISTERED', { userId: user.id, email: user.email });
    return user;
  }

  async verifyTokenAndGetUser(token) {
    try {
      const decoded = SecurityUtil.verifyJwtToken(token);
      const user = await userRepository.findById(decoded.userId);
      if (!user || !user.is_active) {
        throw new AuthenticationError('User session is invalid or user deactivated');
      }
      return {
        ...user,
        permissions: ROLE_PERMISSIONS[user.role] || [],
      };
    } catch (err) {
      throw new AuthenticationError('Token expired or invalid signature');
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User', userId);

    const isMatch = await SecurityUtil.comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new ValidationError('Current password entered is incorrect');
    }

    if (newPassword.length < 8) {
      throw new ValidationError('New password must be at least 8 characters in length');
    }

    const newHash = await SecurityUtil.hashPassword(newPassword);
    await userRepository.update(userId, {
      password_hash: newHash,
      password_changed_at: new Date().toISOString(),
    });

    return { message: 'Password updated successfully' };
  }
}

module.exports = new AuthService();
