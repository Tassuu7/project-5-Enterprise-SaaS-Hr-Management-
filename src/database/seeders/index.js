/**
 * WorkSphere Enterprise HRMS - Master Database Seeder Orchestrator
 * Layer: Database Seeders
 */

const db = require('../connection');
const logger = require('../../core/Logger');
const SecurityUtil = require('../../core/SecurityUtil');
const { ROLES } = require('../../config/roles.config');

class MasterSeeder {
  static async seedAll() {
    const existingTenants = await db.get('SELECT COUNT(*) as count FROM tenants');
    if (existingTenants && existingTenants.count > 0) {
      logger.info('Database already contains records. Skipping seed execution.');
      return;
    }

    logger.info('Starting Enterprise Master Seeder execution...');
    const tenantId = 'org_tenant_enterprise_001';

    // 1. Tenant
    await db.run(
      `INSERT INTO tenants (id, name, domain, plan, subscription_status, max_employees)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tenantId, 'Apex Global Enterprises Cloud SaaS', 'apexglobal.worksphere.io', 'ENTERPRISE_UNLIMITED', 'ACTIVE', 10000]
    );

    // 2. Departments
    const depts = [
      { id: 'dept_eng', name: 'Engineering & Technology', code: 'ENG', budget: 4500000 },
      { id: 'dept_hr', name: 'Human Resources & Talent', code: 'HR', budget: 1200000 },
      { id: 'dept_fin', name: 'Finance & Accounting', code: 'FIN', budget: 1800000 },
      { id: 'dept_prod', name: 'Product & UX Design', code: 'PROD', budget: 2200000 },
      { id: 'dept_sales', name: 'Enterprise Sales & Revenue', code: 'SALES', budget: 3500000 },
      { id: 'dept_mktg', name: 'Global Marketing', code: 'MKTG', budget: 1900000 },
      { id: 'dept_legal', name: 'Legal & Corporate Compliance', code: 'LEGAL', budget: 950000 },
      { id: 'dept_ops', name: 'Customer Operations & Support', code: 'OPS', budget: 1400000 },
    ];

    for (const d of depts) {
      await db.run(
        `INSERT INTO departments (id, tenant_id, name, code, description, budget_annual)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [d.id, tenantId, d.name, d.code, `Department for ${d.name}`, d.budget]
      );
    }

    // 3. Designations
    const desgs = [
      { id: 'des_vp_eng', deptId: 'dept_eng', title: 'VP of Engineering', code: 'VP-ENG', minSal: 180000, maxSal: 250000 },
      { id: 'des_eng_dir', deptId: 'dept_eng', title: 'Director of Engineering', code: 'DIR-ENG', minSal: 150000, maxSal: 200000 },
      { id: 'des_staff_arch', deptId: 'dept_eng', title: 'Staff Cloud Architect', code: 'STF-ARCH', minSal: 140000, maxSal: 190000 },
      { id: 'des_sr_dev', deptId: 'dept_eng', title: 'Senior Full Stack Engineer', code: 'SR-SWE', minSal: 110000, maxSal: 160000 },
      { id: 'des_swe', deptId: 'dept_eng', title: 'Software Engineer', code: 'SWE', minSal: 80000, maxSal: 120000 },
      { id: 'des_qa_lead', deptId: 'dept_eng', title: 'Lead QA Automation Engineer', code: 'LD-QA', minSal: 95000, maxSal: 135000 },
      { id: 'des_hr_dir', deptId: 'dept_hr', title: 'VP of Human Resources', code: 'VP-HR', minSal: 160000, maxSal: 210000 },
      { id: 'des_hr_mgr', deptId: 'dept_hr', title: 'Senior HR Manager', code: 'SR-HRM', minSal: 90000, maxSal: 130000 },
      { id: 'des_rec_lead', deptId: 'dept_hr', title: 'Talent Acquisition Lead', code: 'LD-TA', minSal: 85000, maxSal: 120000 },
      { id: 'des_cfo', deptId: 'dept_fin', title: 'Chief Financial Officer', code: 'CFO', minSal: 220000, maxSal: 300000 },
      { id: 'des_pay_lead', deptId: 'dept_fin', title: 'Senior Payroll Specialist', code: 'SR-PAY', minSal: 80000, maxSal: 115000 },
      { id: 'des_vp_prod', deptId: 'dept_prod', title: 'VP of Product Management', code: 'VP-PROD', minSal: 175000, maxSal: 240000 },
      { id: 'des_lead_des', deptId: 'dept_prod', title: 'Principal UI/UX Designer', code: 'PRN-DES', minSal: 120000, maxSal: 165000 },
      { id: 'des_vp_sales', deptId: 'dept_sales', title: 'VP of Global Enterprise Sales', code: 'VP-SALES', minSal: 180000, maxSal: 260000 },
      { id: 'des_sr_ae', deptId: 'dept_sales', title: 'Senior Enterprise Account Executive', code: 'SR-AE', minSal: 100000, maxSal: 170000 },
    ];

    for (const d of desgs) {
      await db.run(
        `INSERT INTO designations (id, tenant_id, department_id, title, code, min_salary, max_salary)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [d.id, tenantId, d.deptId, d.title, d.code, d.minSal, d.maxSal]
      );
    }

    // 4. Shifts
    await db.run(
      `INSERT INTO shifts (id, tenant_id, name, start_time, end_time, grace_period_minutes, half_day_hours, full_day_hours)
       VALUES ('shift_std_01', ?, 'Standard Enterprise Shift', '09:00', '18:00', 15, 4.0, 8.0)`,
      [tenantId]
    );

    // 5. Leave Types
    const leaveTypes = [
      { id: 'lt_casual', name: 'Casual Leave', code: 'CL', days: 12, paid: 1, cf: 0 },
      { id: 'lt_sick', name: 'Sick / Medical Leave', code: 'SL', days: 10, paid: 1, cf: 0 },
      { id: 'lt_privilege', name: 'Privilege / Annual Vacation', code: 'PL', days: 18, paid: 1, cf: 1 },
      { id: 'lt_maternity', name: 'Maternity Leave', code: 'ML', days: 90, paid: 1, cf: 0 },
      { id: 'lt_paternity', name: 'Paternity Leave', code: 'PTL', days: 15, paid: 1, cf: 0 },
      { id: 'lt_unpaid', name: 'Loss of Pay / Unpaid Leave', code: 'LOP', days: 30, paid: 0, cf: 0 },
    ];

    for (const lt of leaveTypes) {
      await db.run(
        `INSERT INTO leave_types (id, tenant_id, name, code, description, days_per_year, is_paid, is_carry_forward)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [lt.id, tenantId, lt.name, lt.code, `Annual ${lt.name} Policy`, lt.days, lt.paid, lt.cf]
      );
    }

    // 6. Users & Employees Dataset (Executive & Core Roster)
    const defaultPasswordHash = await SecurityUtil.hashPassword('Admin@123456');

    const seedUsersAndEmployees = [
      {
        userId: 'usr_admin_01',
        empId: 'emp_001',
        code: 'EMP-0001',
        first: 'Alexander',
        last: 'Sterling',
        email: 'alexander.sterling@worksphere.corp',
        role: ROLES.SUPER_ADMIN,
        deptId: 'dept_eng',
        desgId: 'des_vp_eng',
        salary: 240000,
        managerId: null,
        gender: 'MALE',
        joined: '2021-01-15',
      },
      {
        userId: 'usr_hr_01',
        empId: 'emp_002',
        code: 'EMP-0002',
        first: 'Eleanor',
        last: 'Vance',
        email: 'eleanor.vance@worksphere.corp',
        role: ROLES.HR_DIRECTOR,
        deptId: 'dept_hr',
        desgId: 'des_hr_dir',
        salary: 195000,
        managerId: 'emp_001',
        gender: 'FEMALE',
        joined: '2021-03-01',
      },
      {
        userId: 'usr_hrm_02',
        empId: 'emp_003',
        code: 'EMP-0003',
        first: 'Marcus',
        last: 'Holloway',
        email: 'marcus.holloway@worksphere.corp',
        role: ROLES.HR_MANAGER,
        deptId: 'dept_hr',
        desgId: 'des_hr_mgr',
        salary: 120000,
        managerId: 'emp_002',
        gender: 'MALE',
        joined: '2022-02-10',
      },
      {
        userId: 'usr_pay_01',
        empId: 'emp_004',
        code: 'EMP-0004',
        first: 'Sophia',
        last: 'Chen',
        email: 'sophia.chen@worksphere.corp',
        role: ROLES.PAYROLL_SPECIALIST,
        deptId: 'dept_fin',
        desgId: 'des_pay_lead',
        salary: 105000,
        managerId: 'emp_001',
        gender: 'FEMALE',
        joined: '2022-05-18',
      },
      {
        userId: 'usr_rec_01',
        empId: 'emp_005',
        code: 'EMP-0005',
        first: 'David',
        last: 'Kim',
        email: 'david.kim@worksphere.corp',
        role: ROLES.RECRUITER,
        deptId: 'dept_hr',
        desgId: 'des_rec_lead',
        salary: 110000,
        managerId: 'emp_002',
        gender: 'MALE',
        joined: '2022-08-01',
      },
      {
        userId: 'usr_eng_02',
        empId: 'emp_006',
        code: 'EMP-0006',
        first: 'Rachel',
        last: 'Adams',
        email: 'rachel.adams@worksphere.corp',
        role: ROLES.DEPT_HEAD,
        deptId: 'dept_eng',
        desgId: 'des_eng_dir',
        salary: 185000,
        managerId: 'emp_001',
        gender: 'FEMALE',
        joined: '2021-06-20',
      },
      {
        userId: 'usr_eng_03',
        empId: 'emp_007',
        code: 'EMP-0007',
        first: 'Jonathan',
        last: 'Mercer',
        email: 'jonathan.mercer@worksphere.corp',
        role: ROLES.EMPLOYEE,
        deptId: 'dept_eng',
        desgId: 'des_staff_arch',
        salary: 165000,
        managerId: 'emp_006',
        gender: 'MALE',
        joined: '2022-01-10',
      },
      {
        userId: 'usr_eng_04',
        empId: 'emp_008',
        code: 'EMP-0008',
        first: 'Elena',
        last: 'Rostova',
        email: 'elena.rostova@worksphere.corp',
        role: ROLES.EMPLOYEE,
        deptId: 'dept_eng',
        desgId: 'des_sr_dev',
        salary: 145000,
        managerId: 'emp_006',
        gender: 'FEMALE',
        joined: '2022-09-15',
      },
      {
        userId: 'usr_eng_05',
        empId: 'emp_009',
        code: 'EMP-0009',
        first: 'Vikram',
        last: 'Patel',
        email: 'vikram.patel@worksphere.corp',
        role: ROLES.EMPLOYEE,
        deptId: 'dept_eng',
        desgId: 'des_swe',
        salary: 105000,
        managerId: 'emp_006',
        gender: 'MALE',
        joined: '2023-03-01',
      },
      {
        userId: 'usr_prod_01',
        empId: 'emp_010',
        code: 'EMP-0010',
        first: 'Clara',
        last: 'Oswald',
        email: 'clara.oswald@worksphere.corp',
        role: ROLES.DEPT_HEAD,
        deptId: 'dept_prod',
        desgId: 'des_vp_prod',
        salary: 190000,
        managerId: 'emp_001',
        gender: 'FEMALE',
        joined: '2021-08-15',
      },
      {
        userId: 'usr_prod_02',
        empId: 'emp_011',
        code: 'EMP-0011',
        first: 'Lucas',
        last: 'Mendoza',
        email: 'lucas.mendoza@worksphere.corp',
        role: ROLES.EMPLOYEE,
        deptId: 'dept_prod',
        desgId: 'des_lead_des',
        salary: 135000,
        managerId: 'emp_010',
        gender: 'MALE',
        joined: '2022-11-20',
      },
      {
        userId: 'usr_sales_01',
        empId: 'emp_012',
        code: 'EMP-0012',
        first: 'Victoria',
        last: 'Sinclair',
        email: 'victoria.sinclair@worksphere.corp',
        role: ROLES.DEPT_HEAD,
        deptId: 'dept_sales',
        desgId: 'des_vp_sales',
        salary: 210000,
        managerId: 'emp_001',
        gender: 'FEMALE',
        joined: '2021-04-10',
      }
    ];

    for (const item of seedUsersAndEmployees) {
      // User record
      await db.run(
        `INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, avatar_url, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          item.userId,
          tenantId,
          item.email,
          defaultPasswordHash,
          item.first,
          item.last,
          item.role,
          `https://ui-avatars.com/api/?name=${encodeURIComponent(item.first + '+' + item.last)}&background=1E3A8A&color=fff`,
        ]
      );

      // Employee record
      await db.run(
        `INSERT INTO employees (id, tenant_id, user_id, employee_code, first_name, last_name, email, phone, gender, joining_date, department_id, designation_id, manager_id, employment_status, work_location)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 'San Francisco HQ')`,
        [
          item.empId,
          tenantId,
          item.userId,
          item.code,
          item.first,
          item.last,
          item.email,
          `+1-555-${String(Math.floor(1000 + Math.random() * 9000))}`,
          item.gender,
          item.joined,
          item.deptId,
          item.desgId,
          item.managerId,
        ]
      );

      // Extended profile
      await db.run(
        `INSERT INTO employee_profiles (employee_id, address_line1, city, state, country, emergency_contact_name, emergency_contact_phone, blood_group, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.empId,
          '100 Enterprise Way, Suite 400',
          'San Francisco',
          'CA',
          'USA',
          'Emergency Contact ' + item.last,
          '+1-555-9999',
          'O+',
          `Senior team member at Apex Global. Specialized in scalable enterprise domain workflows.`,
        ]
      );

      // Bank Details
      await db.run(
        `INSERT INTO employee_bank_details (employee_id, bank_name, account_number, routing_number, tax_identification_number)
         VALUES (?, ?, ?, ?, ?)`,
        [
          item.empId,
          'Silicon Valley National Bank',
          `ACCT-${item.code.replace('EMP-', '')}892100`,
          '021000089',
          `TAX-${item.code.replace('EMP-', '')}-99`,
        ]
      );

      // Salary Structure
      const monthly = item.salary / 12;
      const basic = monthly * 0.50;
      const hra = monthly * 0.20;
      const special = monthly - (basic + hra + 350);
      await db.run(
        `INSERT INTO salary_structures (id, tenant_id, employee_id, annual_ctc, monthly_gross, basic_salary, hra, conveyance_allowance, medical_allowance, special_allowance, effective_from)
         VALUES (?, ?, ?, ?, ?, ?, ?, 200, 150, ?, ?)`,
        [`sal_${item.empId}`, tenantId, item.empId, item.salary, monthly, basic, hra, special, item.joined]
      );

      // Leave Balances
      const year = new Date().getFullYear();
      for (const lt of leaveTypes) {
        await db.run(
          `INSERT INTO leave_balances (id, tenant_id, employee_id, leave_type_id, year, allocated_days, used_days, pending_days, carried_forward_days)
           VALUES (?, ?, ?, ?, ?, ?, 2, 0, 0)`,
          [`lvb_${item.empId}_${lt.id}`, tenantId, item.empId, lt.id, year, lt.days]
        );
      }
    }

    // Set Department heads
    await db.run('UPDATE departments SET head_employee_id = "emp_001" WHERE id = "dept_eng"');
    await db.run('UPDATE departments SET head_employee_id = "emp_002" WHERE id = "dept_hr"');
    await db.run('UPDATE departments SET head_employee_id = "emp_004" WHERE id = "dept_fin"');
    await db.run('UPDATE departments SET head_employee_id = "emp_010" WHERE id = "dept_prod"');
    await db.run('UPDATE departments SET head_employee_id = "emp_012" WHERE id = "dept_sales"');

    // 7. Seed Job Openings & Candidates
    const job1 = {
      id: 'job_001',
      title: 'Principal Distributed Systems Architect',
      code: 'REQ-ENG-01',
      deptId: 'dept_eng',
      desgId: 'des_staff_arch',
      minSal: 160000,
      maxSal: 220000,
      desc: 'Lead cloud distributed systems architecture for multi-tenant SaaS modules.',
      reqs: '10+ years backend microservices, high-concurrency systems, Kubernetes, PostgreSQL/SQLite.',
    };
    const job2 = {
      id: 'job_002',
      title: 'Senior Enterprise Product Designer',
      code: 'REQ-PROD-02',
      deptId: 'dept_prod',
      desgId: 'des_lead_des',
      minSal: 130000,
      maxSal: 170000,
      desc: 'Shape next-generation workforce intelligence interfaces and user experiences.',
      reqs: '5+ years B2B SaaS design, design system governance, user research.',
    };

    await db.run(
      `INSERT INTO job_postings (id, tenant_id, title, code, department_id, designation_id, min_salary, max_salary, description, requirements, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [job1.id, tenantId, job1.title, job1.code, job1.deptId, job1.desgId, job1.minSal, job1.maxSal, job1.desc, job1.reqs]
    );
    await db.run(
      `INSERT INTO job_postings (id, tenant_id, title, code, department_id, designation_id, min_salary, max_salary, description, requirements, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [job2.id, tenantId, job2.title, job2.code, job2.deptId, job2.desgId, job2.minSal, job2.maxSal, job2.desc, job2.reqs]
    );

    // Candidates
    const cand1 = { id: 'cand_01', first: 'Julian', last: 'Archer', email: 'julian.archer@example.com', exp: 8, title: 'Lead Backend Engineer' };
    const cand2 = { id: 'cand_02', first: 'Maya', last: 'Lin', email: 'maya.lin@example.com', exp: 6, title: 'Senior UX Lead' };

    await db.run(
      `INSERT INTO candidates (id, tenant_id, first_name, last_name, email, current_title, total_experience_years)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cand1.id, tenantId, cand1.first, cand1.last, cand1.email, cand1.title, cand1.exp]
    );
    await db.run(
      `INSERT INTO candidates (id, tenant_id, first_name, last_name, email, current_title, total_experience_years)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cand2.id, tenantId, cand2.first, cand2.last, cand2.email, cand2.title, cand2.exp]
    );

    // Applications
    await db.run(
      `INSERT INTO job_applications (id, tenant_id, job_posting_id, candidate_id, stage, overall_rating)
       VALUES ('app_01', ?, 'job_001', 'cand_01', 'TECHNICAL_INTERVIEW', 4.5)`,
      [tenantId]
    );
    await db.run(
      `INSERT INTO job_applications (id, tenant_id, job_posting_id, candidate_id, stage, overall_rating)
       VALUES ('app_02', ?, 'job_002', 'cand_02', 'HR_INTERVIEW', 4.8)`,
      [tenantId]
    );

    // 8. Performance Appraisal Cycle
    await db.run(
      `INSERT INTO appraisal_cycles (id, tenant_id, name, cycle_type, start_date, end_date, status, guidelines)
       VALUES ('cycle_2026_h1', ?, '2026 H1 Executive & Employee Performance Review', 'BI_ANNUAL', '2026-01-01', '2026-06-30', 'ACTIVE', 'Focus on OKR achievements, leadership competencies, and organizational impact.')`,
      [tenantId]
    );

    // Performance reviews & 9-Box samples
    await db.run(
      `INSERT INTO performance_reviews (id, tenant_id, appraisal_cycle_id, employee_id, reviewer_id, reviewer_rating, potential_rating, final_rating, nine_box_quadrant, status)
       VALUES ('rev_01', ?, 'cycle_2026_h1', 'emp_008', 'emp_006', 3.0, 3.0, 3.0, 'STAR', 'COMPLETED')`,
      [tenantId]
    );
    await db.run(
      `INSERT INTO performance_reviews (id, tenant_id, appraisal_cycle_id, employee_id, reviewer_id, reviewer_rating, potential_rating, final_rating, nine_box_quadrant, status)
       VALUES ('rev_02', ?, 'cycle_2026_h1', 'emp_007', 'emp_006', 3.0, 2.0, 2.7, 'HIGH_PERFORMER', 'COMPLETED')`,
      [tenantId]
    );
    await db.run(
      `INSERT INTO performance_reviews (id, tenant_id, appraisal_cycle_id, employee_id, reviewer_id, reviewer_rating, potential_rating, final_rating, nine_box_quadrant, status)
       VALUES ('rev_03', ?, 'cycle_2026_h1', 'emp_009', 'emp_006', 2.0, 3.0, 2.3, 'HIGH_POTENTIAL', 'COMPLETED')`,
      [tenantId]
    );

    // 9. Helpdesk tickets
    await db.run(
      `INSERT INTO helpdesk_tickets (id, tenant_id, ticket_number, employee_id, category, subject, description, priority, status)
       VALUES ('tkt_01', ?, 'TKT-100291', 'emp_008', 'PAYROLL', 'Tax exemption certificate submission verification', 'Kindly confirm if the submitted investment declarations have been verified for Q1 TDS deduction calculation.', 'MEDIUM', 'OPEN')`,
      [tenantId]
    );

    // 10. Audit Logs
    await db.run(
      `INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, ip_address, user_agent)
       VALUES ('aud_01', ?, 'usr_admin_01', 'SYSTEM_INITIALIZATION', 'TENANT', ?, '127.0.0.1', 'Enterprise Provisioner Service')`,
      [tenantId, tenantId]
    );

    logger.info('Enterprise Master Seeder execution finished successfully.');
  }
}

module.exports = MasterSeeder;
