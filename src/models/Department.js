/**
 * WorkSphere Enterprise HRMS - Department Domain Model
 * Layer: Domain Models
 * Table: departments
 */

class Department {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.name = data.name !== undefined ? data.name : null;
    this.code = data.code !== undefined ? data.code : null;
    this.description = data.description !== undefined ? data.description : null;
    this.head_employee_id = data.head_employee_id !== undefined ? data.head_employee_id : null;
    this.parent_department_id = data.parent_department_id !== undefined ? data.parent_department_id : null;
    this.budget_annual = data.budget_annual !== undefined ? data.budget_annual : null;
    this.is_active = data.is_active !== undefined ? data.is_active : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'departments';
  }

  static get fields() {
    return ['id', 'tenant_id', 'name', 'code', 'description', 'head_employee_id', 'parent_department_id', 'budget_annual', 'is_active', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'departments' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Department;
