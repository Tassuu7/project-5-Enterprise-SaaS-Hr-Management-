/**
 * WorkSphere Enterprise HRMS - Designation Domain Model
 * Layer: Domain Models
 * Table: designations
 */

class Designation {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.department_id = data.department_id !== undefined ? data.department_id : null;
    this.title = data.title !== undefined ? data.title : null;
    this.code = data.code !== undefined ? data.code : null;
    this.pay_grade = data.pay_grade !== undefined ? data.pay_grade : null;
    this.min_salary = data.min_salary !== undefined ? data.min_salary : null;
    this.max_salary = data.max_salary !== undefined ? data.max_salary : null;
    this.is_active = data.is_active !== undefined ? data.is_active : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'designations';
  }

  static get fields() {
    return ['id', 'tenant_id', 'department_id', 'title', 'code', 'pay_grade', 'min_salary', 'max_salary', 'is_active', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'designations' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Designation;
