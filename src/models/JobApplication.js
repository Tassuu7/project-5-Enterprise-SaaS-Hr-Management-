/**
 * WorkSphere Enterprise HRMS - JobApplication Domain Model
 * Layer: Domain Models
 * Table: job_applications
 */

class JobApplication {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.job_posting_id = data.job_posting_id !== undefined ? data.job_posting_id : null;
    this.candidate_id = data.candidate_id !== undefined ? data.candidate_id : null;
    this.stage = data.stage !== undefined ? data.stage : null;
    this.overall_rating = data.overall_rating !== undefined ? data.overall_rating : null;
    this.rejection_reason = data.rejection_reason !== undefined ? data.rejection_reason : null;
    this.offer_salary = data.offer_salary !== undefined ? data.offer_salary : null;
    this.offer_date = data.offer_date !== undefined ? data.offer_date : null;
    this.hired_date = data.hired_date !== undefined ? data.hired_date : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'job_applications';
  }

  static get fields() {
    return ['id', 'tenant_id', 'job_posting_id', 'candidate_id', 'stage', 'overall_rating', 'rejection_reason', 'offer_salary', 'offer_date', 'hired_date', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'job_applications' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = JobApplication;
