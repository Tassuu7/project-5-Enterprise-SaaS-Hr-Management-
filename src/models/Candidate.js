/**
 * WorkSphere Enterprise HRMS - Candidate Domain Model
 * Layer: Domain Models
 * Table: candidates
 */

class Candidate {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.first_name = data.first_name !== undefined ? data.first_name : null;
    this.last_name = data.last_name !== undefined ? data.last_name : null;
    this.email = data.email !== undefined ? data.email : null;
    this.phone = data.phone !== undefined ? data.phone : null;
    this.current_company = data.current_company !== undefined ? data.current_company : null;
    this.current_title = data.current_title !== undefined ? data.current_title : null;
    this.total_experience_years = data.total_experience_years !== undefined ? data.total_experience_years : null;
    this.expected_salary = data.expected_salary !== undefined ? data.expected_salary : null;
    this.notice_period_days = data.notice_period_days !== undefined ? data.notice_period_days : null;
    this.resume_url = data.resume_url !== undefined ? data.resume_url : null;
    this.linkedin_url = data.linkedin_url !== undefined ? data.linkedin_url : null;
    this.source = data.source !== undefined ? data.source : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'candidates';
  }

  static get fields() {
    return ['id', 'tenant_id', 'first_name', 'last_name', 'email', 'phone', 'current_company', 'current_title', 'total_experience_years', 'expected_salary', 'notice_period_days', 'resume_url', 'linkedin_url', 'source', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'candidates' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Candidate;
