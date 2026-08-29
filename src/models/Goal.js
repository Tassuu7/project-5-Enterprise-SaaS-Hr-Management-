/**
 * WorkSphere Enterprise HRMS - Goal Domain Model
 * Layer: Domain Models
 * Table: goals
 */

class Goal {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.appraisal_cycle_id = data.appraisal_cycle_id !== undefined ? data.appraisal_cycle_id : null;
    this.title = data.title !== undefined ? data.title : null;
    this.description = data.description !== undefined ? data.description : null;
    this.category = data.category !== undefined ? data.category : null;
    this.weightage = data.weightage !== undefined ? data.weightage : null;
    this.progress_percentage = data.progress_percentage !== undefined ? data.progress_percentage : null;
    this.status = data.status !== undefined ? data.status : null;
    this.due_date = data.due_date !== undefined ? data.due_date : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'goals';
  }

  static get fields() {
    return ['id', 'tenant_id', 'employee_id', 'appraisal_cycle_id', 'title', 'description', 'category', 'weightage', 'progress_percentage', 'status', 'due_date', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'goals' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Goal;
