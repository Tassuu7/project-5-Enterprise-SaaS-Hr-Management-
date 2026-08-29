/**
 * WorkSphere Enterprise HRMS - Interview Domain Model
 * Layer: Domain Models
 * Table: interviews
 */

class Interview {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.application_id = data.application_id !== undefined ? data.application_id : null;
    this.interviewer_id = data.interviewer_id !== undefined ? data.interviewer_id : null;
    this.round_name = data.round_name !== undefined ? data.round_name : null;
    this.scheduled_at = data.scheduled_at !== undefined ? data.scheduled_at : null;
    this.duration_minutes = data.duration_minutes !== undefined ? data.duration_minutes : null;
    this.meeting_link = data.meeting_link !== undefined ? data.meeting_link : null;
    this.status = data.status !== undefined ? data.status : null;
    this.feedback = data.feedback !== undefined ? data.feedback : null;
    this.recommendation = data.recommendation !== undefined ? data.recommendation : null;
    this.rating = data.rating !== undefined ? data.rating : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'interviews';
  }

  static get fields() {
    return ['id', 'tenant_id', 'application_id', 'interviewer_id', 'round_name', 'scheduled_at', 'duration_minutes', 'meeting_link', 'status', 'feedback', 'recommendation', 'rating', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'interviews' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Interview;
