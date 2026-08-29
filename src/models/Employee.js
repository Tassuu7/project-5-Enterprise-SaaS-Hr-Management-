/**
 * WorkSphere Enterprise HRMS - Employee Domain Model
 * Layer: Domain Models
 * Table: employees
 */

class Employee {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.user_id = data.user_id !== undefined ? data.user_id : null;
    this.employee_code = data.employee_code !== undefined ? data.employee_code : null;
    this.first_name = data.first_name !== undefined ? data.first_name : null;
    this.last_name = data.last_name !== undefined ? data.last_name : null;
    this.email = data.email !== undefined ? data.email : null;
    this.phone = data.phone !== undefined ? data.phone : null;
    this.gender = data.gender !== undefined ? data.gender : null;
    this.date_of_birth = data.date_of_birth !== undefined ? data.date_of_birth : null;
    this.joining_date = data.joining_date !== undefined ? data.joining_date : null;
    this.confirmation_date = data.confirmation_date !== undefined ? data.confirmation_date : null;
    this.department_id = data.department_id !== undefined ? data.department_id : null;
    this.designation_id = data.designation_id !== undefined ? data.designation_id : null;
    this.manager_id = data.manager_id !== undefined ? data.manager_id : null;
    this.employment_type = data.employment_type !== undefined ? data.employment_type : null;
    this.employment_status = data.employment_status !== undefined ? data.employment_status : null;
    this.work_location = data.work_location !== undefined ? data.work_location : null;
    this.is_remote = data.is_remote !== undefined ? data.is_remote : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'employees';
  }

  static get fields() {
    return ['id', 'tenant_id', 'user_id', 'employee_code', 'first_name', 'last_name', 'email', 'phone', 'gender', 'date_of_birth', 'joining_date', 'confirmation_date', 'department_id', 'designation_id', 'manager_id', 'employment_type', 'employment_status', 'work_location', 'is_remote', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'employees' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Employee;
