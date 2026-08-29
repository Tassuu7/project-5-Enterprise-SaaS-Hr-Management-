/**
 * WorkSphere Enterprise HRMS - Notification Domain Model
 * Layer: Domain Models
 * Table: notifications
 */

class Notification {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.user_id = data.user_id !== undefined ? data.user_id : null;
    this.title = data.title !== undefined ? data.title : null;
    this.message = data.message !== undefined ? data.message : null;
    this.link_url = data.link_url !== undefined ? data.link_url : null;
    this.is_read = data.is_read !== undefined ? data.is_read : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'notifications';
  }

  static get fields() {
    return ['id', 'tenant_id', 'user_id', 'title', 'message', 'link_url', 'is_read', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'notifications' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Notification;
