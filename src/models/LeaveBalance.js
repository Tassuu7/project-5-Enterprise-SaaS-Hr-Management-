/**
 * WorkSphere Enterprise HRMS - LeaveBalance Domain Model
 * Layer: Domain Models
 * Table: leave_balances
 */

class LeaveBalance {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.leave_type_id = data.leave_type_id !== undefined ? data.leave_type_id : null;
    this.year = data.year !== undefined ? data.year : null;
    this.allocated_days = data.allocated_days !== undefined ? data.allocated_days : null;
    this.used_days = data.used_days !== undefined ? data.used_days : null;
    this.pending_days = data.pending_days !== undefined ? data.pending_days : null;
    this.carried_forward_days = data.carried_forward_days !== undefined ? data.carried_forward_days : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'leave_balances';
  }

  static get fields() {
    return ['id', 'tenant_id', 'employee_id', 'leave_type_id', 'year', 'allocated_days', 'used_days', 'pending_days', 'carried_forward_days', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'leave_balances' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = LeaveBalance;
