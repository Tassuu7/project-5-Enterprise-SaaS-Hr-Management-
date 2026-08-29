const express = require('express');
const router = express.Router();
const RecruitmentController = require('../controllers/RecruitmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/jobs', RecruitmentController.getJobs);
router.post('/jobs', RecruitmentController.createJob);
router.get('/pipeline', RecruitmentController.getPipeline);
router.put('/pipeline/:applicationId/stage', RecruitmentController.moveStage);

module.exports = router;
