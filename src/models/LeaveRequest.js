/**
 * WorkSphere Enterprise HRMS - LeaveRequest Domain Model
 * Layer: Domain Models
 * Table: leave_requests
 */

class LeaveRequest {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.leave_type_id = data.leave_type_id !== undefined ? data.leave_type_id : null;
    this.start_date = data.start_date !== undefined ? data.start_date : null;
    this.end_date = data.end_date !== undefined ? data.end_date : null;
    this.total_days = data.total_days !== undefined ? data.total_days : null;
    this.is_half_day = data.is_half_day !== undefined ? data.is_half_day : null;
    this.reason = data.reason !== undefined ? data.reason : null;
    this.status = data.status !== undefined ? data.status : null;
    this.manager_comment = data.manager_comment !== undefined ? data.manager_comment : null;
    this.approved_by = data.approved_by !== undefined ? data.approved_by : null;
    this.actioned_at = data.actioned_at !== undefined ? data.actioned_at : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'leave_requests';
  }

  static get fields() {
    return ['id', 'tenant_id', 'employee_id', 'leave_type_id', 'start_date', 'end_date', 'total_days', 'is_half_day', 'reason', 'status', 'manager_comment', 'approved_by', 'actioned_at', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'leave_requests' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = LeaveRequest;
