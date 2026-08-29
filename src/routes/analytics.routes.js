const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/AnalyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.get('/summary', AnalyticsController.getSummary);

module.exports = router;
