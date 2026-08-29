/**
 * WorkSphere Enterprise HRMS - Organizational Hierarchy & Visual Tree Service
 * Layer: Business Logic (Services)
 */

const db = require('../database/connection');
const logger = require('../core/Logger');

class OrgChartService {
  async getHierarchyTree(tenantId = 'org_tenant_enterprise_001') {
    const employees = await db.all(
      `SELECT e.id, e.first_name, e.last_name, e.email, e.employee_code, e.manager_id, e.work_location,
              d.name as department_name, des.title as designation_title, e.user_id, u.avatar_url
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN designations des ON e.designation_id = des.id
       LEFT JOIN users u ON e.user_id = u.id
       WHERE e.tenant_id = ? AND e.employment_status = 'ACTIVE'`,
      [tenantId]
    );

    const empMap = {};
    const roots = [];

    employees.forEach((emp) => {
      empMap[emp.id] = {
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        title: emp.designation_title || 'Executive Specialist',
        department: emp.department_name || 'Enterprise Operations',
        email: emp.email,
        code: emp.employee_code,
        avatar: emp.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.first_name + '+' + emp.last_name)}&background=0D8ABC&color=fff`,
        location: emp.work_location,
        children: [],
      };
    });

    employees.forEach((emp) => {
      if (emp.manager_id && empMap[emp.manager_id]) {
        empMap[emp.manager_id].children.push(empMap[emp.id]);
      } else {
        roots.push(empMap[emp.id]);
      }
    });

    return {
      totalEmployees: employees.length,
      rootCount: roots.length,
      tree: roots,
    };
  }

  async getDepartmentStats(tenantId = 'org_tenant_enterprise_001') {
    return db.all(
      `SELECT d.id, d.name, d.code, d.budget_annual, COUNT(e.id) as employee_count,
              h.first_name as head_first_name, h.last_name as head_last_name
       FROM departments d
       LEFT JOIN employees e ON d.id = e.department_id AND e.employment_status = 'ACTIVE'
       LEFT JOIN employees h ON d.head_employee_id = h.id
       WHERE d.tenant_id = ? AND d.is_active = 1
       GROUP BY d.id`,
      [tenantId]
    );
  }
}

module.exports = new OrgChartService();
