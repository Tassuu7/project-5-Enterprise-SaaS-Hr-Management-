/**
 * WorkSphere Enterprise HRMS - Employee Lifecycle & 360 Profile Service
 * Layer: Business Logic (Services)
 */

const employeeRepository = require('../repositories/EmployeeRepository');
const departmentRepository = require('../repositories/DepartmentRepository');
const designationRepository = require('../repositories/DesignationRepository');
const db = require('../database/connection');
const { NotFoundError, ValidationError, ConflictError } = require('../core/AppError');
const logger = require('../core/Logger');
const eventBus = require('../core/EventBus');

class EmployeeService {
  async getAllEmployees(filter = {}, options = {}) {
    return employeeRepository.findDetailed(filter, options);
  }

  async getEmployeeById(id, tenantId = null) {
    const employee = await db.get(
      `SELECT e.*, d.name as department_name, des.title as designation_title,
              m.first_name as manager_first_name, m.last_name as manager_last_name,
              p.address_line1, p.city, p.state, p.country, p.emergency_contact_name, p.emergency_contact_phone, p.blood_group, p.bio,
              b.bank_name, b.account_number, b.routing_number, b.tax_identification_number,
              s.annual_ctc, s.monthly_gross, s.basic_salary, s.hra, s.special_allowance
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN designations des ON e.designation_id = des.id
       LEFT JOIN employees m ON e.manager_id = m.id
       LEFT JOIN employee_profiles p ON e.id = p.employee_id
       LEFT JOIN employee_bank_details b ON e.id = b.employee_id
       LEFT JOIN salary_structures s ON e.id = s.employee_id
       WHERE e.id = ?`,
      [id]
    );

    if (!employee) {
      throw new NotFoundError('Employee', id);
    }

    const skills = await db.all('SELECT * FROM employee_skills WHERE employee_id = ?', [id]);
    employee.skills = skills || [];

    return employee;
  }

  async createEmployee(data, tenantId = 'org_tenant_enterprise_001') {
    if (!data.firstName || !data.lastName || !data.email) {
      throw new ValidationError('First name, last name, and corporate email are required');
    }

    const existing = await employeeRepository.findOne({ email: data.email.toLowerCase().trim() });
    if (existing) {
      throw new ConflictError(`Employee with corporate email '${data.email}' already exists`);
    }

    const count = await employeeRepository.count();
    const employeeCode = data.employeeCode || `EMP-${String(count + 101).padStart(4, '0')}`;

    const employee = await employeeRepository.create({
      tenant_id: tenantId,
      employee_code: employeeCode,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email.toLowerCase().trim(),
      phone: data.phone || null,
      gender: data.gender || 'MALE',
      date_of_birth: data.dateOfBirth || null,
      joining_date: data.joiningDate || new Date().toISOString().slice(0, 10),
      department_id: data.departmentId || null,
      designation_id: data.designationId || null,
      manager_id: data.managerId || null,
      employment_type: data.employmentType || 'FULL_TIME',
      employment_status: data.employmentStatus || 'ACTIVE',
      work_location: data.workLocation || 'Headquarters',
      is_remote: data.isRemote ? 1 : 0,
    });

    // Create extended profile
    await db.run(
      `INSERT INTO employee_profiles (employee_id, address_line1, city, state, country, emergency_contact_name, emergency_contact_phone, blood_group, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee.id,
        data.addressLine1 || '100 Enterprise Way',
        data.city || 'San Francisco',
        data.state || 'CA',
        data.country || 'USA',
        data.emergencyContactName || 'Family Contact',
        data.emergencyContactPhone || '+1-555-0199',
        data.bloodGroup || 'O+',
        data.bio || 'Enterprise team member',
      ]
    );

    // Create initial leave balance for current year
    const currentYear = new Date().getFullYear();
    const leaveTypes = await db.all('SELECT * FROM leave_types WHERE tenant_id = ? AND is_active = 1', [tenantId]);
    for (const lt of leaveTypes) {
      await db.run(
        `INSERT INTO leave_balances (id, tenant_id, employee_id, leave_type_id, year, allocated_days, used_days, pending_days, carried_forward_days)
         VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0)`,
        [`lvb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, tenantId, employee.id, lt.id, currentYear, lt.days_per_year]
      );
    }

    eventBus.publish('EMPLOYEE_CREATED', { employeeId: employee.id, name: `${employee.first_name} ${employee.last_name}` });
    return employee;
  }

  async updateEmployee(id, data, tenantId = null) {
    await this.getEmployeeById(id, tenantId);
    const updated = await employeeRepository.update(id, data, tenantId);
    eventBus.publish('EMPLOYEE_UPDATED', { employeeId: id });
    return updated;
  }

  async deleteEmployee(id, tenantId = null) {
    const res = await employeeRepository.delete(id, tenantId);
    eventBus.publish('EMPLOYEE_DELETED', { employeeId: id });
    return res;
  }

  async getDepartmentList(tenantId = 'org_tenant_enterprise_001') {
    return departmentRepository.findMany({ tenant_id: tenantId, is_active: 1 });
  }

  async getDesignationList(tenantId = 'org_tenant_enterprise_001') {
    return designationRepository.findMany({ tenant_id: tenantId, is_active: 1 });
  }
}

module.exports = new EmployeeService();
