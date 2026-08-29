/**
 * WorkSphere Enterprise HRMS - Executive BI & Analytics Engine
 * Layer: Business Logic (Services)
 */

const db = require('../database/connection');

class AnalyticsService {
  async getDashboardSummary(tenantId = 'org_tenant_enterprise_001') {
    const totalEmployees = await db.get('SELECT COUNT(*) as count FROM employees WHERE tenant_id = ? AND employment_status = "ACTIVE"', [tenantId]);
    const totalDepts = await db.get('SELECT COUNT(*) as count FROM departments WHERE tenant_id = ? AND is_active = 1', [tenantId]);
    const openJobs = await db.get('SELECT COUNT(*) as count FROM job_postings WHERE tenant_id = ? AND status = "OPEN"', [tenantId]);
    const pendingLeaves = await db.get('SELECT COUNT(*) as count FROM leave_requests WHERE tenant_id = ? AND status = "PENDING"', [tenantId]);
    const openTickets = await db.get('SELECT COUNT(*) as count FROM helpdesk_tickets WHERE tenant_id = ? AND status IN ("OPEN", "IN_PROGRESS")', [tenantId]);

    // Monthly payroll expense
    const lastPayroll = await db.get('SELECT total_gross, total_net_payable FROM payroll_runs WHERE tenant_id = ? ORDER BY year DESC, month DESC LIMIT 1', [tenantId]);

    // Department Distribution
    const deptDistribution = await db.all(
      `SELECT d.name, COUNT(e.id) as employee_count
       FROM departments d
       LEFT JOIN employees e ON d.id = e.department_id AND e.employment_status = "ACTIVE"
       WHERE d.tenant_id = ?
       GROUP BY d.id`,
      [tenantId]
    );

    // Gender diversity
    const genderRatio = await db.all(
      `SELECT gender, COUNT(*) as count FROM employees WHERE tenant_id = ? AND employment_status = "ACTIVE" GROUP BY gender`,
      [tenantId]
    );

    return {
      metrics: {
        activeEmployees: totalEmployees.count || 0,
        departmentsCount: totalDepts.count || 0,
        openJobRequisitions: openJobs.count || 0,
        pendingLeaveRequests: pendingLeaves.count || 0,
        openSupportTickets: openTickets.count || 0,
        monthlyPayrollSpend: lastPayroll ? lastPayroll.total_gross : 0,
      },
      charts: {
        departmentDistribution: deptDistribution,
        genderDiversity: genderRatio,
      }
    };
  }
}

module.exports = new AnalyticsService();
