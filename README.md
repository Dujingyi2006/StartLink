# StartLink 后端系统

愿望管理和推荐系统的后端服务，支持用户愿望设定、个性化推荐、奖励机制等功能。

## 技术栈

- **Node.js** + **Express** - 后端框架
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话管理
- **JWT** - 用户认证
- **bcryptjs** - 密码加密
- **AES-256-CBC** - 数据加密

## 核心功能

### 1. 用户管理
- 用户注册、登录、注销
- 个人信息更新（用户名、头像）
- 密码修改
- JWT认证和授权

### 2. 愿望管理
- 创建、查看、更新、删除愿望
- 愿望加密存储（AES-256）
- 公开/私密愿望设置
- 愿望状态跟踪（pending, in_progress, completed）
- 优先级管理

### 3. 愿望链条查看（核心功能）⭐
- **查看完成某愿望的用户们的下一个愿望**
- 基于真实用户数据的愿望链条
- 完成愿望并设置下一个愿望
- 统计分析最受欢迎的下一步
- 为用户提供目标规划的启发和指引

详细说明请查看 [CORE_FEATURE_GUIDE.md](CORE_FEATURE_GUIDE.md)

### 4. 推荐系统
- 基于协同过滤的个性化推荐
- 用户行为分析
- 相似用户发现
- 推荐分数计算
- 热门愿望推荐

### 5. 奖励机制（斯纳金机制）
- 多种奖励类型（浏览、创建、完成愿望等）
- 随机奖励触发（10%概率）
- 每日登录奖励
- 积分系统
- 奖励历史记录

### 6. 愿望图谱
- 愿望链条管理
- 图形化数据结构
- 节点和边的关系
- 目标进展可视化

### 7. 安全特性
- Helmet安全头
- CORS跨域配置
- 速率限制（15分钟100次请求）
- 数据加密存储
- JWT令牌认证
- 权限控制

## 项目结构

```
StartLink/
├── src/
│   ├── config/
│   │   ├── database.js          # 数据库连接配置
│   │   └── redis.js             # Redis配置
│   ├── controllers/
│   │   ├── authController.js    # 认证控制器
│   │   ├── wishController.js    # 愿望控制器
│   │   ├── recommendationController.js  # 推荐控制器
│   │   ├── rewardController.js  # 奖励控制器
│   │   └── graphController.js   # 图谱控制器
│   ├── middleware/
│   │   └── auth.js              # JWT认证中间件
│   ├── routes/
│   │   ├── auth.js              # 认证路由
│   │   ├── wishes.js            # 愿望路由
│   │   ├── recommendations.js   # 推荐路由
│   │   ├── rewards.js           # 奖励路由
│   │   └── graph.js             # 图谱路由
│   ├── services/
│   │   ├── recommendationService.js  # 推荐服务
│   │   └── rewardService.js     # 奖励服务
│   ├── utils/
│   │   └── encryption.js        # 加密工具
│   └── server.js                # 主服务器文件
├── database/
│   └── schema.sql               # 数据库架构
├── .env.example                 # 环境变量示例
├── .gitignore
└── package.json

```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=startlink
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

REDIS_HOST=localhost
REDIS_PORT=6379

ENCRYPTION_KEY=your_32_character_encryption_key
```

### 3. 初始化数据库

```bash
psql -U postgres -f database/schema.sql
```

### 4. 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

### 5. 生成测试数据（可选）

系统提供了20个虚拟用户及其愿望链条的测试数据：

```bash
# 生成测试数据
npm run seed

# 查看生成的数据
npm run view-data
```

详细说明请查看 [TEST_DATA_GUIDE.md](TEST_DATA_GUIDE.md)

**测试用户登录信息**:
- 邮箱: `xiaoli@example.com` (或其他用户邮箱)
- 密码: `password123`

## API 接口文档

### 认证接口

#### 注册
```
POST /api/auth/register
Body: { username, email, password }
```

#### 登录
```
POST /api/auth/login
Body: { email, password }
```

#### 获取当前用户
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

#### 更新用户信息
```
PUT /api/auth/me
Headers: Authorization: Bearer <token>
Body: { username?, avatar_url? }
```

#### 修改密码
```
PUT /api/auth/change-password
Headers: Authorization: Bearer <token>
Body: { oldPassword, newPassword }
```

### 愿望接口

#### 创建愿望
```
POST /api/wishes
Headers: Authorization: Bearer <token>
Body: { description, target_date?, priority?, is_public? }
```

#### 获取用户愿望
```
GET /api/wishes
Headers: Authorization: Bearer <token>
```

#### 获取公开愿望
```
GET /api/wishes/public?limit=20&offset=0
Headers: Authorization: Bearer <token>
```

#### 获取愿望详情
```
GET /api/wishes/:id
Headers: Authorization: Bearer <token>
```

#### 更新愿望
```
PUT /api/wishes/:id
Headers: Authorization: Bearer <token>
Body: { description?, target_date?, status?, priority?, is_public? }
```

#### 删除愿望
```
DELETE /api/wishes/:id
Headers: Authorization: Bearer <token>
```

#### 记录用户行为
```
POST /api/wishes/behavior
Headers: Authorization: Bearer <token>
Body: { wish_id, action_type }
```

### 推荐接口

#### 获取个性化推荐
```
GET /api/recommendations?limit=10
Headers: Authorization: Bearer <token>
```

#### 获取下一步推荐
```
GET /api/recommendations/next/:wishId?limit=5
Headers: Authorization: Bearer <token>
```

### 奖励接口

#### 获取用户积分
```
GET /api/rewards/points
Headers: Authorization: Bearer <token>
```

#### 获取奖励历史
```
GET /api/rewards/history?limit=20
Headers: Authorization: Bearer <token>
```

#### 触发随机奖励
```
POST /api/rewards/random
Headers: Authorization: Bearer <token>
```

#### 每日登录奖励
```
POST /api/rewards/daily-login
Headers: Authorization: Bearer <token>
```

### 图谱接口

#### 获取愿望图谱
```
GET /api/graph
Headers: Authorization: Bearer <token>
```

#### 创建愿望链条
```
POST /api/graph/chains
Headers: Authorization: Bearer <token>
Body: { wish_id, next_wish_id, chain_order }
```

#### 删除愿望链条
```
DELETE /api/graph/chains/:id
Headers: Authorization: Bearer <token>
```

## 数据库架构

### 用户表 (users)
- id, username, email, password_hash, avatar_url, created_at, updated_at

### 愿望表 (wishes)
- id, user_id, description (加密), target_date, status, priority, next_wish_id, is_public, created_at, updated_at

### 愿望链条表 (wish_chains)
- id, user_id, wish_id, next_wish_id, chain_order, created_at

### 用户行为表 (user_behaviors)
- id, user_id, wish_id, action_type, created_at

### 推荐记录表 (recommendations)
- id, user_id, wish_id, recommended_wish_id, score, created_at

### 奖励积分表 (user_rewards)
- id, user_id, points, reward_type, description, created_at

## 推荐算法说明

系统采用协同过滤算法：

1. **用户行为分析** - 记录用户的浏览、创建、完成等行为
2. **相似用户发现** - 基于共同兴趣的愿望找到相似用户
3. **推荐生成** - 推荐相似用户喜欢但当前用户未接触的愿望
4. **分数计算** - 综合考虑交互次数、时间新鲜度、优先级等因素

## 奖励机制说明

### 奖励类型和积分
- 浏览愿望：1分
- 创建愿望：10分
- 完成愿望：50分
- 每日登录：5分
- 分享愿望：20分
- 随机奖励：5-100分（权重分布）

### 随机奖励概率
- 10%概率触发
- 积分范围：5, 10, 15, 20, 50, 100
- 权重分布：40%, 30%, 15%, 10%, 4%, 1%

## 安全措施

1. **数据加密** - 愿望描述使用AES-256-CBC加密
2. **密码安全** - bcrypt加密，salt rounds = 10
3. **JWT认证** - 7天有效期
4. **速率限制** - 15分钟100次请求
5. **CORS配置** - 可配置允许的源
6. **Helmet** - 设置安全HTTP头
7. **权限控制** - 用户只能访问自己的私密数据

## 扩展性设计

1. **数据库连接池** - 最大20个连接
2. **Redis缓存** - 支持会话和数据缓存
3. **模块化架构** - 控制器、服务、路由分离
4. **RESTful API** - 标准化接口设计
5. **错误处理** - 统一的错误处理机制

## 开发建议

1. 使用 `nodemon` 进行开发，自动重启服务
2. 配置合适的 `ENCRYPTION_KEY`（32字符）
3. 生产环境设置强密码和JWT密钥
4. 定期备份数据库
5. 监控Redis内存使用
6. 根据负载调整速率限制

## 许可证

MIT
