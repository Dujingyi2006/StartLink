const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
require('dotenv').config();

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: '用户名或邮箱已存在' });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 创建用户
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );

    const user = result.rows[0];

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const user = result.rows[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, avatar_url, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
  try {
    const { username, avatar_url } = req.body;

    const result = await pool.query(
      'UPDATE users SET username = COALESCE($1, username), avatar_url = COALESCE($2, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, username, email, avatar_url',
      [username, avatar_url, req.userId]
    );

    res.json({
      message: '更新成功',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 获取当前用户
    const userResult = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.userId]
    );

    const user = userResult.rows[0];

    // 验证旧密码
    const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: '原密码错误' });
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // 更新密码
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.userId]
    );

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};
