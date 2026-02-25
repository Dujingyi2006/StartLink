const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100个请求
  message: '请求过于频繁，请稍后再试'
});

app.use('/api/', limiter);

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wishes', require('./routes/wishes'));
app.use('/api/wish-chains', require('./routes/wishChains'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/rewards', require('./routes/rewards'));
app.use('/api/graph', require('./routes/graph'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? '服务器错误' : err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
