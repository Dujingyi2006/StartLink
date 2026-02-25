const pool = require('../config/database');
const { decrypt } = require('../utils/encryption');

// 基于协同过滤的推荐算法
class RecommendationService {
  // 获取用户的推荐愿望
  async getRecommendations(userId, limit = 10) {
    try {
      // 1. 获取用户的历史行为
      const userBehaviors = await this.getUserBehaviors(userId);

      // 2. 找到相似用户
      const similarUsers = await this.findSimilarUsers(userId, userBehaviors);

      // 3. 获取相似用户喜欢的愿望
      const recommendedWishes = await this.getWishesFromSimilarUsers(
        userId,
        similarUsers,
        limit
      );

      // 4. 计算推荐分数
      const scoredWishes = await this.calculateScores(userId, recommendedWishes);

      return scoredWishes;
    } catch (error) {
      console.error('获取推荐错误:', error);
      throw error;
    }
  }

  // 获取用户行为
  async getUserBehaviors(userId) {
    const result = await pool.query(
      'SELECT wish_id, action_type, created_at FROM user_behaviors WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
      [userId]
    );
    return result.rows;
  }

  // 找到相似用户
  async findSimilarUsers(userId, userBehaviors) {
    const wishIds = userBehaviors.map(b => b.wish_id);

    if (wishIds.length === 0) {
      return [];
    }

    const result = await pool.query(
      `SELECT user_id, COUNT(*) as common_wishes
       FROM user_behaviors
       WHERE wish_id = ANY($1) AND user_id != $2
       GROUP BY user_id
       ORDER BY common_wishes DESC
       LIMIT 20`,
      [wishIds, userId]
    );

    return result.rows;
  }

  // 获取相似用户喜欢的愿望
  async getWishesFromSimilarUsers(userId, similarUsers, limit) {
    if (similarUsers.length === 0) {
      // 如果没有相似用户，返回热门愿望
      return this.getPopularWishes(limit);
    }

    const similarUserIds = similarUsers.map(u => u.user_id);

    const result = await pool.query(
      `SELECT DISTINCT w.*, COUNT(ub.id) as interaction_count
       FROM wishes w
       JOIN user_behaviors ub ON w.id = ub.wish_id
       WHERE ub.user_id = ANY($1)
         AND w.is_public = true
         AND w.user_id != $2
         AND w.id NOT IN (
           SELECT wish_id FROM user_behaviors WHERE user_id = $2
         )
       GROUP BY w.id
       ORDER BY interaction_count DESC
       LIMIT $3`,
      [similarUserIds, userId, limit * 2]
    );

    return result.rows;
  }

  // 获取热门愿望
  async getPopularWishes(limit) {
    const result = await pool.query(
      `SELECT w.*, COUNT(ub.id) as interaction_count
       FROM wishes w
       LEFT JOIN user_behaviors ub ON w.id = ub.wish_id
       WHERE w.is_public = true
       GROUP BY w.id
       ORDER BY interaction_count DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  }

  // 计算推荐分数
  async calculateScores(userId, wishes) {
    const scoredWishes = [];

    for (const wish of wishes) {
      let score = 0;

      // 基于交互次数的分数
      score += (wish.interaction_count || 0) * 0.3;

      // 基于时间的分数（越新越高）
      const daysSinceCreation = (Date.now() - new Date(wish.created_at)) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 10 - daysSinceCreation) * 0.2;

      // 基于优先级的分数
      score += wish.priority * 0.5;

      wish.description = decrypt(wish.description);
      wish.recommendation_score = score;

      scoredWishes.push(wish);
    }

    // 按分数排序
    scoredWishes.sort((a, b) => b.recommendation_score - a.recommendation_score);

    return scoredWishes;
  }

  // 保存推荐记录
  async saveRecommendation(userId, wishId, recommendedWishId, score) {
    await pool.query(
      'INSERT INTO recommendations (user_id, wish_id, recommended_wish_id, score) VALUES ($1, $2, $3, $4)',
      [userId, wishId, recommendedWishId, score]
    );
  }
}

module.exports = new RecommendationService();
