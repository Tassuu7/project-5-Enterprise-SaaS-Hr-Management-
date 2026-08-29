/**
 * WorkSphere Enterprise HRMS - SystemSetting Domain Model
 * Layer: Domain Models
 * Table: system_settings
 */

class SystemSetting {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.setting_key = data.setting_key !== undefined ? data.setting_key : null;
    this.setting_value = data.setting_value !== undefined ? data.setting_value : null;
    this.category = data.category !== undefined ? data.category : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'system_settings';
  }

  static get fields() {
    return ['id', 'tenant_id', 'setting_key', 'setting_value', 'category', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'system_settings' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = SystemSetting;
