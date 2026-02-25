const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', recommendationController.getRecommendations);
router.get('/next/:wishId', recommendationController.getNextWishRecommendations);

module.exports = router;
