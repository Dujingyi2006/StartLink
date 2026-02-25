const pool = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');

// 创建愿望
exports.createWish = async (req, res) => {
  try {
    const { description, target_date, priority, is_public } = req.body;

    // 加密愿望描述
    const encryptedDescription = encrypt(description);

    const result = await pool.query(
      'INSERT INTO wishes (user_id, description, target_date, priority, is_public) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, encryptedDescription, target_date, priority || 0, is_public || false]
    );

    const wish = result.rows[0];
    wish.description = decrypt(wish.description);

    res.status(201).json({
      message: '愿望创建成功',
      wish
    });
  } catch (error) {
    console.error('创建愿望错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取用户的所有愿望
exports.getUserWishes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM wishes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    const wishes = result.rows.map(wish => ({
      ...wish,
      description: decrypt(wish.description)
    }));

    res.json({ wishes });
  } catch (error) {
    console.error('获取愿望错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取单个愿望详情
exports.getWishById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM wishes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '愿望不存在' });
    }

    const wish = result.rows[0];

    // 检查权限
    if (wish.user_id !== req.userId && !wish.is_public) {
      return res.status(403).json({ error: '无权访问此愿望' });
    }

    wish.description = decrypt(wish.description);

    res.json({ wish });
  } catch (error) {
    console.error('获取愿望详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 更新愿望
exports.updateWish = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, target_date, status, priority, is_public } = req.body;

    // 检查愿望是否存在且属于当前用户
    const checkResult = await pool.query(
      'SELECT * FROM wishes WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: '愿望不存在或无权修改' });
    }

    let encryptedDescription = checkResult.rows[0].description;
    if (description) {
      encryptedDescription = encrypt(description);
    }

    const result = await pool.query(
      'UPDATE wishes SET description = $1, target_date = COALESCE($2, target_date), status = COALESCE($3, status), priority = COALESCE($4, priority), is_public = COALESCE($5, is_public), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [encryptedDescription, target_date, status, priority, is_public, id]
    );

    const wish = result.rows[0];
    wish.description = decrypt(wish.description);

    res.json({
      message: '愿望更新成功',
      wish
    });
  } catch (error) {
    console.error('更新愿望错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 删除愿望
exports.deleteWish = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM wishes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '愿望不存在或无权删除' });
    }

    res.json({ message: '愿望删除成功' });
  } catch (error) {
    console.error('删除愿望错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取公开的愿望（用于浏览）
exports.getPublicWishes = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      'SELECT w.*, u.username, u.avatar_url FROM wishes w JOIN users u ON w.user_id = u.id WHERE w.is_public = true ORDER BY w.created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const wishes = result.rows.map(wish => ({
      ...wish,
      description: decrypt(wish.description)
    }));

    res.json({ wishes });
  } catch (error) {
    console.error('获取公开愿望错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 记录用户行为（用于推荐算法）
exports.recordUserBehavior = async (req, res) => {
  try {
    const { wish_id, action_type } = req.body;

    await pool.query(
      'INSERT INTO user_behaviors (user_id, wish_id, action_type) VALUES ($1, $2, $3)',
      [req.userId, wish_id, action_type]
    );

    res.json({ message: '行为记录成功' });
  } catch (error) {
    console.error('记录用户行为错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};
