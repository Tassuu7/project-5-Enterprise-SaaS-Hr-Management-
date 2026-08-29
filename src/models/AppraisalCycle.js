/**
 * WorkSphere Enterprise HRMS - AppraisalCycle Domain Model
 * Layer: Domain Models
 * Table: appraisal_cycles
 */

class AppraisalCycle {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.name = data.name !== undefined ? data.name : null;
    this.cycle_type = data.cycle_type !== undefined ? data.cycle_type : null;
    this.start_date = data.start_date !== undefined ? data.start_date : null;
    this.end_date = data.end_date !== undefined ? data.end_date : null;
    this.status = data.status !== undefined ? data.status : null;
    this.guidelines = data.guidelines !== undefined ? data.guidelines : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'appraisal_cycles';
  }

  static get fields() {
    return ['id', 'tenant_id', 'name', 'cycle_type', 'start_date', 'end_date', 'status', 'guidelines', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'appraisal_cycles' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = AppraisalCycle;
