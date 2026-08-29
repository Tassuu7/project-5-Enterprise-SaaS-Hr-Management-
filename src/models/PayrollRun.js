/**
 * WorkSphere Enterprise HRMS - PayrollRun Domain Model
 * Layer: Domain Models
 * Table: payroll_runs
 */

class PayrollRun {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.month = data.month !== undefined ? data.month : null;
    this.year = data.year !== undefined ? data.year : null;
    this.period_start = data.period_start !== undefined ? data.period_start : null;
    this.period_end = data.period_end !== undefined ? data.period_end : null;
    this.total_employees = data.total_employees !== undefined ? data.total_employees : null;
    this.total_gross = data.total_gross !== undefined ? data.total_gross : null;
    this.total_deductions = data.total_deductions !== undefined ? data.total_deductions : null;
    this.total_net_payable = data.total_net_payable !== undefined ? data.total_net_payable : null;
    this.status = data.status !== undefined ? data.status : null;
    this.processed_by = data.processed_by !== undefined ? data.processed_by : null;
    this.disbursed_at = data.disbursed_at !== undefined ? data.disbursed_at : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'payroll_runs';
  }

  static get fields() {
    return ['id', 'tenant_id', 'month', 'year', 'period_start', 'period_end', 'total_employees', 'total_gross', 'total_deductions', 'total_net_payable', 'status', 'processed_by', 'disbursed_at', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'payroll_runs' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = PayrollRun;
