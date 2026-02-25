const pool = require('../config/database');

// 奖励类型
const REWARD_TYPES = {
  VIEW_WISH: { points: 1, description: '浏览愿望' },
  CREATE_WISH: { points: 10, description: '创建愿望' },
  COMPLETE_WISH: { points: 50, description: '完成愿望' },
  DAILY_LOGIN: { points: 5, description: '每日登录' },
  SHARE_WISH: { points: 20, description: '分享愿望' },
  RANDOM_BONUS: { points: 0, description: '随机奖励' }
};

// 奖励服务
class RewardService {
  // 给用户添加奖励
  async addReward(userId, rewardType, customPoints = null) {
    try {
      const reward = REWARD_TYPES[rewardType];
      if (!reward) {
        throw new Error('无效的奖励类型');
      }

      let points = customPoints || reward.points;

      // 随机奖励机制
      if (rewardType === 'RANDOM_BONUS') {
        points = this.getRandomBonus();
      }

      await pool.query(
        'INSERT INTO user_rewards (user_id, points, reward_type, description) VALUES ($1, $2, $3, $4)',
        [userId, points, rewardType, reward.description]
      );

      return {
        points,
        message: `获得 ${points} 积分！${reward.description}`
      };
    } catch (error) {
      console.error('添加奖励错误:', error);
      throw error;
    }
  }

  // 获取随机奖励积分
  getRandomBonus() {
    const bonuses = [5, 10, 15, 20, 50, 100];
    const weights = [40, 30, 15, 10, 4, 1]; // 权重

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < bonuses.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return bonuses[i];
      }
    }

    return bonuses[0];
  }

  // 获取用户总积分
  async getUserTotalPoints(userId) {
    const result = await pool.query(
      'SELECT COALESCE(SUM(points), 0) as total_points FROM user_rewards WHERE user_id = $1',
      [userId]
    );

    return result.rows[0].total_points;
  }

  // 获取用户奖励历史
  async getUserRewardHistory(userId, limit = 20) {
    const result = await pool.query(
      'SELECT * FROM user_rewards WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );

    return result.rows;
  }

  // 触发随机奖励（斯纳金机制）
  async triggerRandomReward(userId) {
    // 10% 概率触发随机奖励
    if (Math.random() < 0.1) {
      return await this.addReward(userId, 'RANDOM_BONUS');
    }
    return null;
  }

  // 检查并给予每日登录奖励
  async checkDailyLoginReward(userId) {
    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      'SELECT * FROM user_rewards WHERE user_id = $1 AND reward_type = $2 AND DATE(created_at) = $3',
      [userId, 'DAILY_LOGIN', today]
    );

    if (result.rows.length === 0) {
      return await this.addReward(userId, 'DAILY_LOGIN');
    }

    return null;
  }
}

module.exports = new RewardService();
