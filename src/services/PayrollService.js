/**
 * WorkSphere Enterprise HRMS - Enterprise Payroll & Compensation Engine
 * Layer: Business Logic (Services)
 */

const payrollRepository = require('../repositories/PayrollRepository');
const payslipRepository = require('../repositories/PayslipRepository');
const db = require('../database/connection');
const taxCalculator = require('../utils/taxCalculator');
const { ValidationError, NotFoundError } = require('../core/AppError');
const logger = require('../core/Logger');
const eventBus = require('../core/EventBus');

class PayrollService {
  async calculateSalaryBreakdown(annualGross) {
    const monthlyGross = annualGross / 12;
    const basic = monthlyGross * 0.50; // 50% Basic
    const hra = monthlyGross * 0.20;   // 20% HRA
    const conveyance = 200;
    const medical = 150;
    const special = Math.max(0, monthlyGross - (basic + hra + conveyance + medical));

    // Statutory deductions
    const pfEmployee = Math.min(basic * 0.06, 600); // 6% PF
    const pfEmployer = pfEmployee;
    const healthInsurance = monthlyGross * 0.015; // 1.5%
    const professionalTax = monthlyGross > 6000 ? 100 : 50;

    // Estimated monthly income tax
    const estimatedTax = taxCalculator.calculateMonthlyTDS(annualGross);

    const totalDeductions = pfEmployee + healthInsurance + professionalTax + estimatedTax;
    const netSalary = monthlyGross - totalDeductions;

    return {
      annualGross,
      monthlyGross,
      earnings: {
        basicSalary: basic,
        hra,
        conveyanceAllowance: conveyance,
        medicalAllowance: medical,
        specialAllowance: special,
      },
      deductions: {
        providentFund: pfEmployee,
        healthInsurance,
        professionalTax,
        incomeTaxTds: estimatedTax,
        totalDeductions,
      },
      employerContributions: {
        providentFundEmployer: pfEmployer,
      },
      netSalary,
    };
  }

  async runMonthlyPayroll(month, year, processedByUserId, tenantId = 'org_tenant_enterprise_001') {
    logger.info(`Starting enterprise payroll execution for ${month}/${year}`);

    // Check existing run
    const existing = await payrollRepository.findOne({ tenant_id: tenantId, month, year });
    if (existing && existing.status === 'DISBURSED') {
      throw new ValidationError(`Payroll for ${month}/${year} has already been disbursed`);
    }

    const employees = await db.all(
      `SELECT e.id as employee_id, e.employee_code, e.first_name, e.last_name, e.department_id, s.annual_ctc, s.monthly_gross, s.basic_salary, s.hra
       FROM employees e
       JOIN salary_structures s ON e.id = s.employee_id
       WHERE e.tenant_id = ? AND e.employment_status = 'ACTIVE' AND s.is_active = 1`,
      [tenantId]
    );

    if (employees.length === 0) {
      throw new ValidationError('No active employees with valid salary structure found to process');
    }

    const periodStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const periodEnd = `${year}-${String(month).padStart(2, '0')}-28`;

    let payrollRun = existing;
    if (!payrollRun) {
      payrollRun = await payrollRepository.create({
        tenant_id: tenantId,
        month,
        year,
        period_start: periodStart,
        period_end: periodEnd,
        total_employees: employees.length,
        total_gross: 0,
        total_deductions: 0,
        total_net_payable: 0,
        status: 'PROCESSING',
        processed_by: processedByUserId || 'usr_001',
      });
    }

    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    // Delete old draft payslips if re-running
    await db.run('DELETE FROM payslips WHERE payroll_run_id = ?', [payrollRun.id]);

    for (const emp of employees) {
      const breakdown = await this.calculateSalaryBreakdown(emp.annual_ctc);

      const payslipNumber = `PS-${year}${String(month).padStart(2, '0')}-${emp.employee_code}`;

      await payslipRepository.create({
        tenant_id: tenantId,
        payroll_run_id: payrollRun.id,
        employee_id: emp.employee_id,
        payslip_number: payslipNumber,
        month,
        year,
        days_in_month: 30,
        worked_days: 30,
        paid_leaves: 0,
        loss_of_pay_days: 0,
        gross_earnings: breakdown.monthlyGross,
        total_deductions: breakdown.deductions.totalDeductions,
        net_salary: breakdown.netSalary,
        earnings_breakdown_json: JSON.stringify(breakdown.earnings),
        deductions_breakdown_json: JSON.stringify(breakdown.deductions),
        payment_status: 'PENDING',
        payment_mode: 'DIRECT_DEPOSIT',
      });

      totalGross += breakdown.monthlyGross;
      totalDeductions += breakdown.deductions.totalDeductions;
      totalNet += breakdown.netSalary;
    }

    const finalRun = await payrollRepository.update(payrollRun.id, {
      total_gross: parseFloat(totalGross.toFixed(2)),
      total_deductions: parseFloat(totalDeductions.toFixed(2)),
      total_net_payable: parseFloat(totalNet.toFixed(2)),
      status: 'APPROVED',
    });

    eventBus.publish('PAYROLL_PROCESSED', { payrollRunId: finalRun.id, month, year, totalNet });
    return finalRun;
  }

  async disbursePayroll(payrollRunId, tenantId = 'org_tenant_enterprise_001') {
    const run = await payrollRepository.findById(payrollRunId, tenantId);
    if (!run) throw new NotFoundError('PayrollRun', payrollRunId);

    await db.run('UPDATE payslips SET payment_status = "PAID", disbursement_reference = ? WHERE payroll_run_id = ?', [`TXN_WIRE_${Date.now()}`, payrollRunId]);

    const updated = await payrollRepository.update(payrollRunId, {
      status: 'DISBURSED',
      disbursed_at: new Date().toISOString(),
    });

    eventBus.publish('PAYROLL_DISBURSED', { batchId: payrollRunId, totalAmount: run.total_net_payable });
    return updated;
  }

  async getPayslipsForEmployee(employeeId) {
    return payslipRepository.findDetailed({ employee_id: employeeId }, { orderBy: 'year DESC, month DESC' });
  }

  async getPayslipById(payslipId) {
    const slip = await db.get(
      `SELECT p.*, e.first_name, e.last_name, e.employee_code, e.email, d.name as department_name, des.title as designation_title,
              b.bank_name, b.account_number, b.routing_number, b.tax_identification_number
       FROM payslips p
       JOIN employees e ON p.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN designations des ON e.designation_id = des.id
       LEFT JOIN employee_bank_details b ON e.id = b.employee_id
       WHERE p.id = ?`,
      [payslipId]
    );

    if (!slip) throw new NotFoundError('Payslip', payslipId);

    slip.earnings = JSON.parse(slip.earnings_breakdown_json || '{}');
    slip.deductions = JSON.parse(slip.deductions_breakdown_json || '{}');
    return slip;
  }
}

module.exports = new PayrollService();
