/**
 * WorkSphere Enterprise HRMS - AuditLog Domain Model
 * Layer: Domain Models
 * Table: audit_logs
 */

class AuditLog {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.user_id = data.user_id !== undefined ? data.user_id : null;
    this.action = data.action !== undefined ? data.action : null;
    this.entity_type = data.entity_type !== undefined ? data.entity_type : null;
    this.entity_id = data.entity_id !== undefined ? data.entity_id : null;
    this.old_values_json = data.old_values_json !== undefined ? data.old_values_json : null;
    this.new_values_json = data.new_values_json !== undefined ? data.new_values_json : null;
    this.ip_address = data.ip_address !== undefined ? data.ip_address : null;
    this.user_agent = data.user_agent !== undefined ? data.user_agent : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'audit_logs';
  }

  static get fields() {
    return ['id', 'tenant_id', 'user_id', 'action', 'entity_type', 'entity_id', 'old_values_json', 'new_values_json', 'ip_address', 'user_agent', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'audit_logs' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = AuditLog;
