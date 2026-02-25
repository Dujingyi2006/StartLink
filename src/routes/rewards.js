const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/points', rewardController.getUserPoints);
router.get('/history', rewardController.getRewardHistory);
router.post('/random', rewardController.triggerRandomReward);
router.post('/daily-login', rewardController.dailyLoginReward);

module.exports = router;
