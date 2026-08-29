/**
 * WorkSphere Enterprise HRMS - Recruitment Controller
 * Layer: Controllers
 */

const recruitmentService = require('../services/RecruitmentService');
const ResponseFormatter = require('../core/ResponseFormatter');

class RecruitmentController {
  static async getJobs(req, res, next) {
    try {
      const jobs = await recruitmentService.getJobPostings({ tenant_id: req.tenantId });
      return ResponseFormatter.success(res, jobs, 'Job postings retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async createJob(req, res, next) {
    try {
      const job = await recruitmentService.createJobPosting(req.body, req.tenantId);
      return ResponseFormatter.created(res, job, 'Job requisition created');
    } catch (err) {
      next(err);
    }
  }

  static async getPipeline(req, res, next) {
    try {
      const pipeline = await recruitmentService.getCandidatePipeline(req.query.jobId, req.tenantId);
      return ResponseFormatter.success(res, pipeline, 'Candidate pipeline retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async moveStage(req, res, next) {
    try {
      const { stage, offerSalary } = req.body;
      const updated = await recruitmentService.moveCandidateStage(req.params.applicationId, stage, { offerSalary });
      return ResponseFormatter.success(res, updated, `Candidate moved to stage ${stage}`);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RecruitmentController;
