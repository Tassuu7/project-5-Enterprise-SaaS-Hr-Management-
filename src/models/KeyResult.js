/**
 * WorkSphere Enterprise HRMS - KeyResult Domain Model
 * Layer: Domain Models
 * Table: key_results
 */

class KeyResult {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.goal_id = data.goal_id !== undefined ? data.goal_id : null;
    this.title = data.title !== undefined ? data.title : null;
    this.target_value = data.target_value !== undefined ? data.target_value : null;
    this.current_value = data.current_value !== undefined ? data.current_value : null;
    this.metric_unit = data.metric_unit !== undefined ? data.metric_unit : null;
    this.progress_percentage = data.progress_percentage !== undefined ? data.progress_percentage : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'key_results';
  }

  static get fields() {
    return ['id', 'goal_id', 'title', 'target_value', 'current_value', 'metric_unit', 'progress_percentage', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'key_results' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = KeyResult;
