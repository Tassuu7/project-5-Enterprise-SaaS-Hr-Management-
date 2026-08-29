/**
 * WorkSphere Enterprise HRMS - TrainingModule Domain Model
 * Layer: Domain Models
 * Table: training_modules
 */

class TrainingModule {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.title = data.title !== undefined ? data.title : null;
    this.category = data.category !== undefined ? data.category : null;
    this.duration_minutes = data.duration_minutes !== undefined ? data.duration_minutes : null;
    this.passing_score = data.passing_score !== undefined ? data.passing_score : null;
    this.content_url = data.content_url !== undefined ? data.content_url : null;
    this.is_mandatory = data.is_mandatory !== undefined ? data.is_mandatory : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'training_modules';
  }

  static get fields() {
    return ['id', 'tenant_id', 'title', 'category', 'duration_minutes', 'passing_score', 'content_url', 'is_mandatory', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'training_modules' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = TrainingModule;
