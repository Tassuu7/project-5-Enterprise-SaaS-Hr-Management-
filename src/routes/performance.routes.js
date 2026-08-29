const express = require('express');
const router = express.Router();
const PerformanceController = require('../controllers/PerformanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/goals/:employeeId', PerformanceController.getGoals);
router.post('/goals', PerformanceController.createGoal);
router.post('/reviews/:reviewId/submit', PerformanceController.submitReview);
router.get('/nine-box-matrix', PerformanceController.getNineBoxMatrix);

module.exports = router;
