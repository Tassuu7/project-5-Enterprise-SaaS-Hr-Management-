/**
 * WorkSphere Enterprise HRMS - User Domain Model
 * Layer: Domain Models
 * Table: users
 */

class User {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.email = data.email !== undefined ? data.email : null;
    this.password_hash = data.password_hash !== undefined ? data.password_hash : null;
    this.first_name = data.first_name !== undefined ? data.first_name : null;
    this.last_name = data.last_name !== undefined ? data.last_name : null;
    this.role = data.role !== undefined ? data.role : null;
    this.avatar_url = data.avatar_url !== undefined ? data.avatar_url : null;
    this.is_active = data.is_active !== undefined ? data.is_active : null;
    this.mfa_enabled = data.mfa_enabled !== undefined ? data.mfa_enabled : null;
    this.mfa_secret = data.mfa_secret !== undefined ? data.mfa_secret : null;
    this.last_login_at = data.last_login_at !== undefined ? data.last_login_at : null;
    this.password_changed_at = data.password_changed_at !== undefined ? data.password_changed_at : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'users';
  }

  static get fields() {
    return ['id', 'tenant_id', 'email', 'password_hash', 'first_name', 'last_name', 'role', 'avatar_url', 'is_active', 'mfa_enabled', 'mfa_secret', 'last_login_at', 'password_changed_at', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'users' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = User;
