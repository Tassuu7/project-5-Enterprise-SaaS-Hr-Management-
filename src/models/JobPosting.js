/**
 * WorkSphere Enterprise HRMS - JobPosting Domain Model
 * Layer: Domain Models
 * Table: job_postings
 */

class JobPosting {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.title = data.title !== undefined ? data.title : null;
    this.code = data.code !== undefined ? data.code : null;
    this.department_id = data.department_id !== undefined ? data.department_id : null;
    this.designation_id = data.designation_id !== undefined ? data.designation_id : null;
    this.openings_count = data.openings_count !== undefined ? data.openings_count : null;
    this.employment_type = data.employment_type !== undefined ? data.employment_type : null;
    this.experience_required_years = data.experience_required_years !== undefined ? data.experience_required_years : null;
    this.min_salary = data.min_salary !== undefined ? data.min_salary : null;
    this.max_salary = data.max_salary !== undefined ? data.max_salary : null;
    this.location = data.location !== undefined ? data.location : null;
    this.is_remote = data.is_remote !== undefined ? data.is_remote : null;
    this.description = data.description !== undefined ? data.description : null;
    this.requirements = data.requirements !== undefined ? data.requirements : null;
    this.status = data.status !== undefined ? data.status : null;
    this.closing_date = data.closing_date !== undefined ? data.closing_date : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'job_postings';
  }

  static get fields() {
    return ['id', 'tenant_id', 'title', 'code', 'department_id', 'designation_id', 'openings_count', 'employment_type', 'experience_required_years', 'min_salary', 'max_salary', 'location', 'is_remote', 'description', 'requirements', 'status', 'closing_date', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'job_postings' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = JobPosting;
