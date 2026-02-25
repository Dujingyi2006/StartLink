const recommendationService = require('../services/recommendationService');

// 获取个性化推荐
exports.getRecommendations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recommendations = await recommendationService.getRecommendations(
      req.userId,
      parseInt(limit)
    );

    res.json({ recommendations });
  } catch (error) {
    console.error('获取推荐错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取基于特定愿望的下一步推荐
exports.getNextWishRecommendations = async (req, res) => {
  try {
    const { wishId } = req.params;
    const { limit = 5 } = req.query;

    const recommendations = await recommendationService.getRecommendations(
      req.userId,
      parseInt(limit)
    );

    res.json({ recommendations });
  } catch (error) {
    console.error('获取下一步推荐错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = exports;
