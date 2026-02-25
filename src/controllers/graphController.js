const pool = require('../config/database');
const { decrypt } = require('../utils/encryption');

// 获取用户的愿望图谱
exports.getWishGraph = async (req, res) => {
  try {
    // 获取用户所有愿望
    const wishesResult = await pool.query(
      'SELECT * FROM wishes WHERE user_id = $1',
      [req.userId]
    );

    // 获取愿望链条关系
    const chainsResult = await pool.query(
      'SELECT * FROM wish_chains WHERE user_id = $1 ORDER BY chain_order',
      [req.userId]
    );

    const wishes = wishesResult.rows.map(wish => ({
      ...wish,
      description: decrypt(wish.description)
    }));

    const chains = chainsResult.rows;

    // 构建图谱数据结构
    const graph = {
      nodes: wishes.map(wish => ({
        id: wish.id,
        label: wish.description.substring(0, 50),
        status: wish.status,
        priority: wish.priority,
        target_date: wish.target_date
      })),
      edges: chains.map(chain => ({
        from: chain.wish_id,
        to: chain.next_wish_id,
        order: chain.chain_order
      }))
    };

    res.json({ graph });
  } catch (error) {
    console.error('获取愿望图谱错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 创建愿望链条
exports.createWishChain = async (req, res) => {
  try {
    const { wish_id, next_wish_id, chain_order } = req.body;

    // 验证愿望是否属于当前用户
    const wishCheck = await pool.query(
      'SELECT * FROM wishes WHERE id = $1 AND user_id = $2',
      [wish_id, req.userId]
    );

    if (wishCheck.rows.length === 0) {
      return res.status(404).json({ error: '愿望不存在' });
    }

    const result = await pool.query(
      'INSERT INTO wish_chains (user_id, wish_id, next_wish_id, chain_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, wish_id, next_wish_id, chain_order]
    );

    res.status(201).json({
      message: '愿望链条创建成功',
      chain: result.rows[0]
    });
  } catch (error) {
    console.error('创建愿望链条错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 删除愿望链条
exports.deleteWishChain = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM wish_chains WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '链条不存在或无权删除' });
    }

    res.json({ message: '愿望链条删除成功' });
  } catch (error) {
    console.error('删除愿望链条错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

module.exports = exports;
