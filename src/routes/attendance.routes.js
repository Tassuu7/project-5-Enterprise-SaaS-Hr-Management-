const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/punch-in', AttendanceController.punchIn);
router.post('/punch-out', AttendanceController.punchOut);
router.get('/overview', AttendanceController.getDailyOverview);
router.get('/monthly', AttendanceController.getMonthly);

module.exports = router;
