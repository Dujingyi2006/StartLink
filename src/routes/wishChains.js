const express = require('express');
const router = express.Router();
const wishChainController = require('../controllers/wishChainController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// 核心功能：查看完成某个愿望的用户们的下一个愿望
router.get('/next-wishes', wishChainController.getNextWishesAfterCompletion);

// 根据愿望ID查看其他人完成后的下一个愿望
router.get('/next-wishes/:id', wishChainController.getNextWishesByWishId);

// 完成愿望并设置下一个愿望
router.post('/complete-and-next', wishChainController.completeWishAndSetNext);

module.exports = router;
