const express = require('express');
const router = express.Router();
const wishController = require('../controllers/wishController');
const authMiddleware = require('../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 愿望CRUD
router.post('/', wishController.createWish);
router.get('/', wishController.getUserWishes);
router.get('/public', wishController.getPublicWishes);
router.get('/:id', wishController.getWishById);
router.put('/:id', wishController.updateWish);
router.delete('/:id', wishController.deleteWish);

// 记录用户行为
router.post('/behavior', wishController.recordUserBehavior);

module.exports = router;
