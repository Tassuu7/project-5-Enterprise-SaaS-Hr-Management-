/**
 * WorkSphere Enterprise HRMS - ApiKey Domain Model
 * Layer: Domain Models
 * Table: api_keys
 */

class ApiKey {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.name = data.name !== undefined ? data.name : null;
    this.key_hash = data.key_hash !== undefined ? data.key_hash : null;
    this.prefix = data.prefix !== undefined ? data.prefix : null;
    this.scopes_json = data.scopes_json !== undefined ? data.scopes_json : null;
    this.last_used_at = data.last_used_at !== undefined ? data.last_used_at : null;
    this.expires_at = data.expires_at !== undefined ? data.expires_at : null;
    this.is_active = data.is_active !== undefined ? data.is_active : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'api_keys';
  }

  static get fields() {
    return ['id', 'tenant_id', 'name', 'key_hash', 'prefix', 'scopes_json', 'last_used_at', 'expires_at', 'is_active', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'api_keys' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = ApiKey;
