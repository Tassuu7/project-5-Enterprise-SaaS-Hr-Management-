/**
 * WorkSphere Enterprise HRMS - Payslip Domain Model
 * Layer: Domain Models
 * Table: payslips
 */

class Payslip {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.payroll_run_id = data.payroll_run_id !== undefined ? data.payroll_run_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.payslip_number = data.payslip_number !== undefined ? data.payslip_number : null;
    this.month = data.month !== undefined ? data.month : null;
    this.year = data.year !== undefined ? data.year : null;
    this.days_in_month = data.days_in_month !== undefined ? data.days_in_month : null;
    this.worked_days = data.worked_days !== undefined ? data.worked_days : null;
    this.paid_leaves = data.paid_leaves !== undefined ? data.paid_leaves : null;
    this.loss_of_pay_days = data.loss_of_pay_days !== undefined ? data.loss_of_pay_days : null;
    this.gross_earnings = data.gross_earnings !== undefined ? data.gross_earnings : null;
    this.total_deductions = data.total_deductions !== undefined ? data.total_deductions : null;
    this.net_salary = data.net_salary !== undefined ? data.net_salary : null;
    this.earnings_breakdown_json = data.earnings_breakdown_json !== undefined ? data.earnings_breakdown_json : null;
    this.deductions_breakdown_json = data.deductions_breakdown_json !== undefined ? data.deductions_breakdown_json : null;
    this.payment_status = data.payment_status !== undefined ? data.payment_status : null;
    this.payment_mode = data.payment_mode !== undefined ? data.payment_mode : null;
    this.disbursement_reference = data.disbursement_reference !== undefined ? data.disbursement_reference : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
  }

  static get tableName() {
    return 'payslips';
  }

  static get fields() {
    return ['id', 'tenant_id', 'payroll_run_id', 'employee_id', 'payslip_number', 'month', 'year', 'days_in_month', 'worked_days', 'paid_leaves', 'loss_of_pay_days', 'gross_earnings', 'total_deductions', 'net_salary', 'earnings_breakdown_json', 'deductions_breakdown_json', 'payment_status', 'payment_mode', 'disbursement_reference', 'created_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'payslips' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = Payslip;
