const rewardService = require('../services/rewardService');

// 获取用户总积分
exports.getUserPoints = async (req, res) => {
  try {
    const totalPoints = await rewardService.getUserTotalPoints(req.userId);

    res.json({ totalPoints });
  } catch (error) {
    console.error('获取积分错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取用户奖励历史
exports.getRewardHistory = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const history = await rewardService.getUserRewardHistory(
      req.userId,
      parseInt(limit)
    );

    res.json({ history });
  } catch (error) {
    console.error('获取奖励历史错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 触发随机奖励
exports.triggerRandomReward = async (req, res) => {
  try {
    const reward = await rewardService.triggerRandomReward(req.userId);

    if (reward) {
      res.json({
        success: true,
        reward
      });
    } else {
      res.json({
        success: false,
        message: '未触发奖励'
      });
    }
  } catch (error) {
    console.error('触发随机奖励错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 每日登录奖励
exports.dailyLoginReward = async (req, res) => {
  try {
    const reward = await rewardService.checkDailyLoginReward(req.userId);

    if (reward) {
      res.json({
        success: true,
        reward
      });
    } else {
      res.json({
        success: false,
        message: '今日已领取'
      });
    }
  } catch (error) {
    console.error('每日登录奖励错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = exports;
