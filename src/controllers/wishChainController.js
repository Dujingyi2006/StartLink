const pool = require('../config/database');
const { decrypt } = require('../utils/encryption');

// 核心功能：获取完成某个愿望的用户们的下一个愿望
exports.getNextWishesAfterCompletion = async (req, res) => {
  try {
    const { wishDescription } = req.query;

    if (!wishDescription) {
      return res.status(400).json({ error: '请提供愿望描述' });
    }

    // 1. 找到所有描述相似的已完成愿望
    const completedWishesResult = await pool.query(
      `SELECT id, user_id, description, completed_at
       FROM wishes
       WHERE status = 'completed'
       AND is_public = true
       ORDER BY completed_at DESC`
    );

    // 解密并筛选相似的愿望
    const similarCompletedWishes = completedWishesResult.rows
      .map(wish => ({
        ...wish,
        description: decrypt(wish.description)
      }))
      .filter(wish =>
        wish.description.toLowerCase().includes(wishDescription.toLowerCase()) ||
        wishDescription.toLowerCase().includes(wish.description.toLowerCase())
      );

    if (similarCompletedWishes.length === 0) {
      return res.json({
        message: '暂无用户完成过类似的愿望',
        nextWishes: []
      });
    }

    // 2. 获取这些用户完成此愿望后创建的下一个愿望
    const nextWishesData = [];

    for (const completedWish of similarCompletedWishes) {
      // 找到该用户在完成此愿望之后创建的愿望
      const nextWishResult = await pool.query(
        `SELECT w.*, u.username, u.avatar_url
         FROM wishes w
         JOIN users u ON w.user_id = u.id
         WHERE w.user_id = $1
         AND w.created_at > $2
         AND w.is_public = true
         ORDER BY w.created_at ASC
         LIMIT 1`,
        [completedWish.user_id, completedWish.completed_at || completedWish.created_at]
      );

      if (nextWishResult.rows.length > 0) {
        const nextWish = nextWishResult.rows[0];
        nextWishesData.push({
          previousWish: completedWish.description,
          nextWish: {
            ...nextWish,
            description: decrypt(nextWish.description)
          },
          user: {
            username: nextWish.username,
            avatar_url: nextWish.avatar_url
          },
          timeGap: Math.floor(
            (new Date(nextWish.created_at) - new Date(completedWish.completed_at || completedWish.created_at)) /
            (1000 * 60 * 60 * 24)
          ) // 天数
        });
      }
    }

    // 3. 统计最常见的下一个愿望类型
    const nextWishSummary = {};
    nextWishesData.forEach(item => {
      const desc = item.nextWish.description;
      if (!nextWishSummary[desc]) {
        nextWishSummary[desc] = {
          description: desc,
          count: 0,
          users: []
        };
      }
      nextWishSummary[desc].count++;
      nextWishSummary[desc].users.push(item.user.username);
    });

    const popularNextWishes = Object.values(nextWishSummary)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      message: `找到 ${similarCompletedWishes.length} 位用户完成过类似愿望`,
      totalNextWishes: nextWishesData.length,
      nextWishes: nextWishesData,
      popularNextWishes,
      statistics: {
        totalUsersCompleted: similarCompletedWishes.length,
        usersWithNextWish: nextWishesData.length,
        conversionRate: ((nextWishesData.length / similarCompletedWishes.length) * 100).toFixed(2) + '%'
      }
    });

  } catch (error) {
    console.error('获取下一个愿望错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 用户完成愿望并设置下一个愿望
exports.completeWishAndSetNext = async (req, res) => {
  try {
    const { wishId, nextWishDescription, nextWishPriority, nextWishTargetDate } = req.body;

    // 1. 验证当前愿望属于用户
    const currentWishResult = await pool.query(
      'SELECT * FROM wishes WHERE id = $1 AND user_id = $2',
      [wishId, req.userId]
    );

    if (currentWishResult.rows.length === 0) {
      return res.status(404).json({ error: '愿望不存在或无权操作' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 2. 标记当前愿望为已完成
      await client.query(
        'UPDATE wishes SET status = $1, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['completed', wishId]
      );

      // 3. 创建下一个愿望
      const { encrypt } = require('../utils/encryption');
      const encryptedDescription = encrypt(nextWishDescription);

      const nextWishResult = await client.query(
        `INSERT INTO wishes (user_id, description, target_date, priority, is_public, status)
         VALUES ($1, $2, $3, $4, true, 'pending')
         RETURNING *`,
        [req.userId, encryptedDescription, nextWishTargetDate, nextWishPriority || 3]
      );

      // 4. 更新当前愿望的 next_wish_id
      await client.query(
        'UPDATE wishes SET next_wish_id = $1 WHERE id = $2',
        [nextWishResult.rows[0].id, wishId]
      );

      // 5. 给用户奖励积分
      await client.query(
        'INSERT INTO user_rewards (user_id, points, reward_type, description) VALUES ($1, $2, $3, $4)',
        [req.userId, 50, 'COMPLETE_WISH', '完成愿望']
      );

      await client.query('COMMIT');

      const nextWish = nextWishResult.rows[0];
      nextWish.description = decrypt(nextWish.description);

      res.json({
        message: '愿望已完成，下一个愿望已设置',
        completedWishId: wishId,
        nextWish,
        reward: {
          points: 50,
          message: '获得50积分奖励！'
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('完成愿望并设置下一个愿望错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 根据愿望ID查看其他人完成后的下一个愿望
exports.getNextWishesByWishId = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. 获取当前愿望
    const currentWishResult = await pool.query(
      'SELECT * FROM wishes WHERE id = $1',
      [id]
    );

    if (currentWishResult.rows.length === 0) {
      return res.status(404).json({ error: '愿望不存在' });
    }

    const currentWish = currentWishResult.rows[0];
    const currentDescription = decrypt(currentWish.description);

    // 2. 找到所有相似的已完成愿望及其下一个愿望
    const result = await pool.query(
      `SELECT
        w1.id as completed_wish_id,
        w1.description as completed_description,
        w1.user_id,
        w1.completed_at,
        w2.id as next_wish_id,
        w2.description as next_description,
        w2.priority as next_priority,
        w2.status as next_status,
        u.username,
        u.avatar_url
       FROM wishes w1
       LEFT JOIN wishes w2 ON w1.next_wish_id = w2.id
       JOIN users u ON w1.user_id = u.id
       WHERE w1.status = 'completed'
       AND w1.is_public = true
       AND w1.next_wish_id IS NOT NULL
       ORDER BY w1.completed_at DESC
       LIMIT 100`
    );

    // 解密并筛选相似的愿望
    const nextWishesData = result.rows
      .map(row => ({
        ...row,
        completed_description: decrypt(row.completed_description),
        next_description: decrypt(row.next_description)
      }))
      .filter(row =>
        row.completed_description.toLowerCase().includes(currentDescription.toLowerCase()) ||
        currentDescription.toLowerCase().includes(row.completed_description.toLowerCase())
      );

    // 3. 统计分析
    const nextWishStats = {};
    nextWishesData.forEach(item => {
      const desc = item.next_description;
      if (!nextWishStats[desc]) {
        nextWishStats[desc] = {
          description: desc,
          count: 0,
          avgPriority: 0,
          users: [],
          examples: []
        };
      }
      nextWishStats[desc].count++;
      nextWishStats[desc].avgPriority += item.next_priority;
      nextWishStats[desc].users.push({
        username: item.username,
        avatar_url: item.avatar_url
      });
      if (nextWishStats[desc].examples.length < 3) {
        nextWishStats[desc].examples.push({
          username: item.username,
          completedAt: item.completed_at
        });
      }
    });

    // 计算平均优先级
    Object.values(nextWishStats).forEach(stat => {
      stat.avgPriority = (stat.avgPriority / stat.count).toFixed(1);
    });

    const popularNextWishes = Object.values(nextWishStats)
      .sort((a, b) => b.count - a.count);

    res.json({
      currentWish: {
        id: currentWish.id,
        description: currentDescription
      },
      totalMatches: nextWishesData.length,
      nextWishes: nextWishesData.slice(0, 20),
      popularNextWishes: popularNextWishes.slice(0, 10),
      insights: {
        message: nextWishesData.length > 0
          ? `${nextWishesData.length} 位用户完成类似愿望后，最常见的下一步是：${popularNextWishes[0]?.description}`
          : '暂无用户完成过类似愿望'
      }
    });

  } catch (error) {
    console.error('获取下一个愿望错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = exports;
