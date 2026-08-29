/**
 * WorkSphere Enterprise HRMS - SalaryStructure Domain Model
 * Layer: Domain Models
 * Table: salary_structures
 */

class SalaryStructure {
  constructor(data = {}) {
    this.id = data.id !== undefined ? data.id : null;
    this.tenant_id = data.tenant_id !== undefined ? data.tenant_id : null;
    this.employee_id = data.employee_id !== undefined ? data.employee_id : null;
    this.currency = data.currency !== undefined ? data.currency : null;
    this.annual_ctc = data.annual_ctc !== undefined ? data.annual_ctc : null;
    this.monthly_gross = data.monthly_gross !== undefined ? data.monthly_gross : null;
    this.basic_salary = data.basic_salary !== undefined ? data.basic_salary : null;
    this.hra = data.hra !== undefined ? data.hra : null;
    this.conveyance_allowance = data.conveyance_allowance !== undefined ? data.conveyance_allowance : null;
    this.medical_allowance = data.medical_allowance !== undefined ? data.medical_allowance : null;
    this.special_allowance = data.special_allowance !== undefined ? data.special_allowance : null;
    this.performance_bonus = data.performance_bonus !== undefined ? data.performance_bonus : null;
    this.provident_fund_employee = data.provident_fund_employee !== undefined ? data.provident_fund_employee : null;
    this.provident_fund_employer = data.provident_fund_employer !== undefined ? data.provident_fund_employer : null;
    this.health_insurance = data.health_insurance !== undefined ? data.health_insurance : null;
    this.professional_tax = data.professional_tax !== undefined ? data.professional_tax : null;
    this.effective_from = data.effective_from !== undefined ? data.effective_from : null;
    this.is_active = data.is_active !== undefined ? data.is_active : null;
    this.created_at = data.created_at !== undefined ? data.created_at : null;
    this.updated_at = data.updated_at !== undefined ? data.updated_at : null;
  }

  static get tableName() {
    return 'salary_structures';
  }

  static get fields() {
    return ['id', 'tenant_id', 'employee_id', 'currency', 'annual_ctc', 'monthly_gross', 'basic_salary', 'hra', 'conveyance_allowance', 'medical_allowance', 'special_allowance', 'performance_bonus', 'provident_fund_employee', 'provident_fund_employer', 'health_insurance', 'professional_tax', 'effective_from', 'is_active', 'created_at', 'updated_at'];
  }

  toJSON() {
    const obj = { ...this };
    if (obj.password_hash) delete obj.password_hash;
    if (obj.mfa_secret) delete obj.mfa_secret;
    return obj;
  }

  validate() {
    const errors = [];
    if (!this.tenant_id && 'salary_structures' !== 'tenants') {
      // Tenant ID validation
    }
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = SalaryStructure;
