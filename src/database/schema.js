/**
 * WorkSphere Enterprise HRMS - Relational Schema DDL Definitions
 * Layer: Database
 */

const schemaSql = `
-- 1. SaaS Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  plan TEXT DEFAULT 'ENTERPRISE',
  subscription_status TEXT DEFAULT 'ACTIVE',
  max_employees INTEGER DEFAULT 5000,
  features_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. System Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  is_active INTEGER DEFAULT 1,
  mfa_enabled INTEGER DEFAULT 0,
  mfa_secret TEXT,
  last_login_at DATETIME,
  password_changed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 3. Departments
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  head_employee_id TEXT,
  parent_department_id TEXT,
  budget_annual REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Designations / Job Titles
CREATE TABLE IF NOT EXISTS designations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  pay_grade TEXT,
  min_salary REAL DEFAULT 0,
  max_salary REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 5. Employees
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT UNIQUE,
  employee_code TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  gender TEXT,
  date_of_birth DATE,
  joining_date DATE NOT NULL,
  confirmation_date DATE,
  department_id TEXT,
  designation_id TEXT,
  manager_id TEXT,
  employment_type TEXT DEFAULT 'FULL_TIME',
  employment_status TEXT DEFAULT 'ACTIVE',
  work_location TEXT DEFAULT 'Headquarters',
  is_remote INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (designation_id) REFERENCES designations(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- 6. Employee Extended Profiles
CREATE TABLE IF NOT EXISTS employee_profiles (
  employee_id TEXT PRIMARY KEY,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relation TEXT,
  blood_group TEXT,
  marital_status TEXT,
  education_json TEXT,
  experience_json TEXT,
  bio TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 7. Employee Bank & Statutory Info
CREATE TABLE IF NOT EXISTS employee_bank_details (
  employee_id TEXT PRIMARY KEY,
  bank_name TEXT,
  account_number TEXT,
  routing_number TEXT,
  swift_code TEXT,
  tax_identification_number TEXT,
  social_security_number TEXT,
  pf_account_number TEXT,
  is_verified INTEGER DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 8. Employee Skills
CREATE TABLE IF NOT EXISTS employee_skills (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'INTERMEDIATE',
  years_experience REAL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 9. Work Shifts
CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  grace_period_minutes INTEGER DEFAULT 15,
  half_day_hours REAL DEFAULT 4.0,
  full_day_hours REAL DEFAULT 8.0,
  is_night_shift INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Attendance Records
CREATE TABLE IF NOT EXISTS attendances (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  shift_id TEXT,
  date DATE NOT NULL,
  punch_in_time DATETIME,
  punch_out_time DATETIME,
  punch_in_ip TEXT,
  punch_out_ip TEXT,
  total_work_hours REAL DEFAULT 0,
  break_duration_minutes REAL DEFAULT 0,
  overtime_hours REAL DEFAULT 0,
  status TEXT DEFAULT 'PRESENT',
  is_late INTEGER DEFAULT 0,
  late_by_minutes INTEGER DEFAULT 0,
  is_early_leaving INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, date),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL
);

-- 11. Timesheets
CREATE TABLE IF NOT EXISTS timesheets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_billable_hours REAL DEFAULT 0,
  total_non_billable_hours REAL DEFAULT 0,
  status TEXT DEFAULT 'DRAFT',
  approved_by TEXT,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 12. Leave Types & Policies
CREATE TABLE IF NOT EXISTS leave_types (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  days_per_year REAL DEFAULT 12,
  is_paid INTEGER DEFAULT 1,
  is_carry_forward INTEGER DEFAULT 1,
  max_carry_forward_days REAL DEFAULT 5,
  requires_attachment INTEGER DEFAULT 0,
  gender_restriction TEXT DEFAULT 'ALL',
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. Leave Balances
CREATE TABLE IF NOT EXISTS leave_balances (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  leave_type_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  allocated_days REAL DEFAULT 0,
  used_days REAL DEFAULT 0,
  pending_days REAL DEFAULT 0,
  carried_forward_days REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(employee_id, leave_type_id, year),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE
);

-- 14. Leave Requests
CREATE TABLE IF NOT EXISTS leave_requests (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  leave_type_id TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days REAL NOT NULL,
  is_half_day INTEGER DEFAULT 0,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  manager_comment TEXT,
  approved_by TEXT,
  actioned_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE
);

-- 15. Salary Structures
CREATE TABLE IF NOT EXISTS salary_structures (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  employee_id TEXT NOT NULL UNIQUE,
  currency TEXT DEFAULT 'USD',
  annual_ctc REAL NOT NULL,
  monthly_gross REAL NOT NULL,
  basic_salary REAL NOT NULL,
  hra REAL NOT NULL,
  conveyance_allowance REAL DEFAULT 0,
  medical_allowance REAL DEFAULT 0,
  special_allowance REAL DEFAULT 0,
  performance_bonus REAL DEFAULT 0,
  provident_fund_employee REAL DEFAULT 0,
  provident_fund_employer REAL DEFAULT 0,
  health_insurance REAL DEFAULT 0,
  professional_tax REAL DEFAULT 0,
  effective_from DATE NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 16. Payroll Runs
CREATE TABLE IF NOT EXISTS payroll_runs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_employees INTEGER DEFAULT 0,
  total_gross REAL DEFAULT 0,
  total_deductions REAL DEFAULT 0,
  total_net_payable REAL DEFAULT 0,
  status TEXT DEFAULT 'DRAFT',
  processed_by TEXT,
  disbursed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, month, year)
);

-- 17. Payslips
CREATE TABLE IF NOT EXISTS payslips (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  payroll_run_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  payslip_number TEXT NOT NULL UNIQUE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  days_in_month INTEGER DEFAULT 30,
  worked_days REAL DEFAULT 30,
  paid_leaves REAL DEFAULT 0,
  loss_of_pay_days REAL DEFAULT 0,
  gross_earnings REAL NOT NULL,
  total_deductions REAL NOT NULL,
  net_salary REAL NOT NULL,
  earnings_breakdown_json TEXT,
  deductions_breakdown_json TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  payment_mode TEXT DEFAULT 'DIRECT_DEPOSIT',
  disbursement_reference TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 18. Recruitment - Job Postings
CREATE TABLE IF NOT EXISTS job_postings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  department_id TEXT NOT NULL,
  designation_id TEXT,
  openings_count INTEGER DEFAULT 1,
  employment_type TEXT DEFAULT 'FULL_TIME',
  experience_required_years REAL DEFAULT 2,
  min_salary REAL DEFAULT 0,
  max_salary REAL DEFAULT 0,
  location TEXT DEFAULT 'San Francisco, CA',
  is_remote INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN',
  closing_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- 19. Recruitment - Candidates
CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  current_company TEXT,
  current_title TEXT,
  total_experience_years REAL DEFAULT 0,
  expected_salary REAL DEFAULT 0,
  notice_period_days INTEGER DEFAULT 30,
  resume_url TEXT,
  linkedin_url TEXT,
  source TEXT DEFAULT 'PORTAL',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 20. Recruitment - Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  job_posting_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  stage TEXT DEFAULT 'APPLIED',
  overall_rating REAL DEFAULT 0,
  rejection_reason TEXT,
  offer_salary REAL DEFAULT 0,
  offer_date DATE,
  hired_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_posting_id) REFERENCES job_postings(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 21. Recruitment - Interviews
CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  application_id TEXT NOT NULL,
  interviewer_id TEXT NOT NULL,
  round_name TEXT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  duration_minutes INTEGER DEFAULT 45,
  meeting_link TEXT,
  status TEXT DEFAULT 'SCHEDULED',
  feedback TEXT,
  recommendation TEXT,
  rating REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
  FOREIGN KEY (interviewer_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 22. Performance - Appraisal Cycles
CREATE TABLE IF NOT EXISTS appraisal_cycles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  cycle_type TEXT DEFAULT 'ANNUAL',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  guidelines TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 23. Performance - Goals & OKRs
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  appraisal_cycle_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'OPERATIONAL',
  weightage REAL DEFAULT 20,
  progress_percentage REAL DEFAULT 0,
  status TEXT DEFAULT 'IN_PROGRESS',
  due_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (appraisal_cycle_id) REFERENCES appraisal_cycles(id) ON DELETE SET NULL
);

-- 24. Performance - Key Results
CREATE TABLE IF NOT EXISTS key_results (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL,
  title TEXT NOT NULL,
  target_value REAL DEFAULT 100,
  current_value REAL DEFAULT 0,
  metric_unit TEXT DEFAULT '%',
  progress_percentage REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- 25. Performance - Reviews & 360 Feedback
CREATE TABLE IF NOT EXISTS performance_reviews (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  appraisal_cycle_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  reviewer_id TEXT NOT NULL,
  review_type TEXT DEFAULT 'MANAGER',
  self_rating REAL DEFAULT 0,
  self_comments TEXT,
  reviewer_rating REAL DEFAULT 0,
  reviewer_comments TEXT,
  final_rating REAL DEFAULT 0,
  potential_rating REAL DEFAULT 0,
  nine_box_quadrant TEXT,
  status TEXT DEFAULT 'PENDING',
  submitted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appraisal_cycle_id) REFERENCES appraisal_cycles(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 26. Onboarding Tasks & Checklists
CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  task_name TEXT NOT NULL,
  category TEXT DEFAULT 'HR_DOCUMENTATION',
  assigned_to_role TEXT DEFAULT 'EMPLOYEE',
  due_days_from_joining INTEGER DEFAULT 7,
  status TEXT DEFAULT 'PENDING',
  completed_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 27. Learning & Training Modules
CREATE TABLE IF NOT EXISTS training_modules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'COMPLIANCE',
  duration_minutes INTEGER DEFAULT 60,
  passing_score REAL DEFAULT 80,
  content_url TEXT,
  is_mandatory INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 28. Training Enrollments
CREATE TABLE IF NOT EXISTS training_enrollments (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  training_module_id TEXT NOT NULL,
  status TEXT DEFAULT 'NOT_STARTED',
  progress_percentage REAL DEFAULT 0,
  score REAL DEFAULT 0,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (training_module_id) REFERENCES training_modules(id) ON DELETE CASCADE
);

-- 29. HR Helpdesk Tickets
CREATE TABLE IF NOT EXISTS helpdesk_tickets (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  ticket_number TEXT NOT NULL UNIQUE,
  employee_id TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'MEDIUM',
  status TEXT DEFAULT 'OPEN',
  assigned_to TEXT,
  resolved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 30. Ticket Messages / Notes
CREATE TABLE IF NOT EXISTS ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  sender_user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_internal_note INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 31. Document Templates & Uploads
CREATE TABLE IF NOT EXISTS employee_documents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER DEFAULT 0,
  mime_type TEXT,
  requires_signature INTEGER DEFAULT 0,
  is_signed INTEGER DEFAULT 0,
  signed_at DATETIME,
  expiry_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 32. Security Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values_json TEXT,
  new_values_json TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 33. Tenant System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value TEXT NOT NULL,
  category TEXT DEFAULT 'GENERAL',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, setting_key)
);

-- 34. Notifications Center
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 35. Webhooks & API Keys
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  prefix TEXT NOT NULL,
  scopes_json TEXT,
  last_used_at DATETIME,
  expires_at DATETIME,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

module.exports = schemaSql;
