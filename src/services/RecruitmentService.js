/**
 * WorkSphere Enterprise HRMS - Recruitment & Applicant Tracking System (ATS)
 * Layer: Business Logic (Services)
 */

const jobPostingRepository = require('../repositories/JobPostingRepository');
const candidateRepository = require('../repositories/CandidateRepository');
const applicationRepository = require('../repositories/ApplicationRepository');
const interviewRepository = require('../repositories/InterviewRepository');
const db = require('../database/connection');
const { ValidationError, NotFoundError } = require('../core/AppError');
const logger = require('../core/Logger');
const eventBus = require('../core/EventBus');

class RecruitmentService {
  async getJobPostings(filter = {}, options = {}) {
    return jobPostingRepository.findDetailed(filter, options);
  }

  async createJobPosting(data, tenantId = 'org_tenant_enterprise_001') {
    const code = data.code || `REQ-${Date.now().toString().slice(-4)}`;
    return jobPostingRepository.create({
      tenant_id: tenantId,
      title: data.title,
      code,
      department_id: data.departmentId,
      designation_id: data.designationId || null,
      openings_count: data.openingsCount || 1,
      employment_type: data.employmentType || 'FULL_TIME',
      experience_required_years: data.experienceRequiredYears || 2,
      min_salary: data.minSalary || 0,
      max_salary: data.maxSalary || 0,
      location: data.location || 'San Francisco, CA',
      is_remote: data.isRemote ? 1 : 0,
      description: data.description,
      requirements: data.requirements,
      status: 'OPEN',
      closing_date: data.closingDate || null,
    });
  }

  async getCandidatePipeline(jobPostingId = null, tenantId = 'org_tenant_enterprise_001') {
    let sql = `SELECT a.*, c.first_name, c.last_name, c.email, c.phone, c.current_company, c.current_title, c.total_experience_years,
                      j.title as job_title, j.code as job_code
               FROM job_applications a
               JOIN candidates c ON a.candidate_id = c.id
               JOIN job_postings j ON a.job_posting_id = j.id
               WHERE a.tenant_id = ?`;
    const params = [tenantId];
    if (jobPostingId) {
      sql += ' AND a.job_posting_id = ?';
      params.push(jobPostingId);
    }
    sql += ' ORDER BY a.created_at DESC';

    const applications = await db.all(sql, params);

    const stages = {
      APPLIED: [],
      SCREENING: [],
      TECHNICAL_INTERVIEW: [],
      HR_INTERVIEW: [],
      OFFER_EXTENDED: [],
      HIRED: [],
      REJECTED: [],
    };

    applications.forEach((app) => {
      if (stages[app.stage]) {
        stages[app.stage].push(app);
      } else {
        stages.APPLIED.push(app);
      }
    });

    return stages;
  }

  async moveCandidateStage(applicationId, newStage, meta = {}) {
    const app = await applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundError('JobApplication', applicationId);

    const updateData = { stage: newStage };
    if (newStage === 'HIRED') {
      updateData.hired_date = new Date().toISOString().slice(0, 10);
    }
    if (newStage === 'OFFER_EXTENDED') {
      updateData.offer_salary = meta.offerSalary || 0;
      updateData.offer_date = new Date().toISOString().slice(0, 10);
    }

    const updated = await applicationRepository.update(applicationId, updateData);
    eventBus.publish('CANDIDATE_STAGE_CHANGED', { applicationId, newStage });
    return updated;
  }

  async scheduleInterview(data, tenantId = 'org_tenant_enterprise_001') {
    return interviewRepository.create({
      tenant_id: tenantId,
      application_id: data.applicationId,
      interviewer_id: data.interviewerId,
      round_name: data.roundName || 'Technical Assessment',
      scheduled_at: data.scheduledAt,
      duration_minutes: data.durationMinutes || 45,
      meeting_link: data.meetingLink || 'https://meet.worksphere.corp/room-101',
      status: 'SCHEDULED',
    });
  }
}

module.exports = new RecruitmentService();
