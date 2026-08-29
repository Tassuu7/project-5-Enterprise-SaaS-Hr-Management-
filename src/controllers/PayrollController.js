/**
 * WorkSphere Enterprise HRMS - Payroll Controller
 * Layer: Controllers
 */

const payrollService = require('../services/PayrollService');
const ResponseFormatter = require('../core/ResponseFormatter');

class PayrollController {
  static async runPayroll(req, res, next) {
    try {
      const { month, year } = req.body;
      const m = parseInt(month, 10) || (new Date().getMonth() + 1);
      const y = parseInt(year, 10) || new Date().getFullYear();
      const userId = req.user && req.user.id ? req.user.id : 'usr_001';
      const tenantId = req.tenantId || 'org_tenant_enterprise_001';
      const run = await payrollService.runMonthlyPayroll(m, y, userId, tenantId);
      return ResponseFormatter.success(res, run, 'Monthly payroll processed successfully');
    } catch (err) {
      next(err);
    }
  }

  static async disburse(req, res, next) {
    try {
      const run = await payrollService.disbursePayroll(req.params.id, req.tenantId);
      return ResponseFormatter.success(res, run, 'Payroll marked as disbursed');
    } catch (err) {
      next(err);
    }
  }

  static async getPayslip(req, res, next) {
    try {
      const slip = await payrollService.getPayslipById(req.params.id);
      return ResponseFormatter.success(res, slip, 'Payslip details retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async calculateEstimate(req, res, next) {
    try {
      const { annualGross } = req.body;
      const breakdown = await payrollService.calculateSalaryBreakdown(parseFloat(annualGross));
      return ResponseFormatter.success(res, breakdown, 'Salary breakdown calculated');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PayrollController;
