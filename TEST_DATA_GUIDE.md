# 测试数据使用指南

## 虚拟用户数据

系统已准备了20个虚拟用户及其愿望链条，每个用户都有独特的背景和目标。

### 用户列表

| 用户名 | 邮箱 | 特点 | 愿望数量 |
|--------|------|------|----------|
| 追梦者小李 👨‍💻 | xiaoli@example.com | 技术学习者 | 4个 |
| 健身达人王芳 💪 | wangfang@example.com | 健身爱好者 | 4个 |
| 读书爱好者张伟 📚 | zhangwei@example.com | 阅读爱好者 | 4个 |
| 旅行家刘洋 ✈️ | liuyang@example.com | 旅行探索者 | 4个 |
| 美食探索者陈静 🍜 | chenjing@example.com | 美食达人 | 4个 |
| 音乐人赵明 🎵 | zhaoming@example.com | 音乐创作者 | 4个 |
| 摄影师孙丽 📷 | sunli@example.com | 摄影爱好者 | 4个 |
| 创业者周杰 🚀 | zhoujie@example.com | 创业者 | 5个 |
| 设计师吴娜 🎨 | wuna@example.com | UI/UX设计师 | 4个 |
| 程序员郑强 ⌨️ | zhengqiang@example.com | 全栈开发者 | 4个 |
| 瑜伽教练林美 🧘 | linmei@example.com | 瑜伽教练 | 4个 |
| 厨师黄涛 👨‍🍳 | huangtao@example.com | 专业厨师 | 4个 |
| 教师马丽 👩‍🏫 | mali@example.com | 教育工作者 | 4个 |
| 医生徐峰 👨‍⚕️ | xufeng@example.com | 医疗工作者 | 4个 |
| 作家钱红 ✍️ | qianhong@example.com | 文学创作者 | 4个 |
| 运动员孙强 🏃 | sunqiang@example.com | 职业运动员 | 4个 |
| 投资人周敏 💼 | zhoumin@example.com | 投资者 | 4个 |
| 艺术家吴刚 🎭 | wugang@example.com | 艺术创作者 | 4个 |
| 科学家郑芳 🔬 | zhengfang@example.com | 科研工作者 | 4个 |
| 志愿者李娜 ❤️ | lina@example.com | 公益志愿者 | 4个 |

**所有用户的默认密码**: `password123`

## 愿望链条示例

### 追梦者小李的技术成长路径
1. ✅ 学习JavaScript基础知识 (已完成)
2. 🔄 掌握React框架开发 (进行中)
3. ⏳ 完成一个全栈项目 (待开始)
4. ⏳ 找到理想的开发工作 (待开始)

### 健身达人王芳的健身目标
1. ✅ 每周健身3次持续一个月 (已完成)
2. 🔄 减重10公斤 (进行中)
3. ⏳ 参加半程马拉松 (待开始)
4. ⏳ 成为健身教练 (待开始)

### 创业者周杰的创业计划
1. ✅ 完成商业计划书 (已完成)
2. 🔄 获得天使投资 (进行中)
3. 🔄 组建核心团队 (进行中)
4. ⏳ 产品上线并获得1万用户 (待开始)
5. ⏳ 实现盈利 (待开始)

## 使用步骤

### 1. 初始化数据库

首先确保PostgreSQL已安装并运行，然后创建数据库：

```bash
# 创建数据库并导入架构
psql -U postgres -f database/schema.sql
```

### 2. 配置环境变量

确保 `.env` 文件已正确配置：

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=startlink
DB_USER=postgres
DB_PASSWORD=your_password

ENCRYPTION_KEY=12345678901234567890123456789012
JWT_SECRET=your_jwt_secret_key
```

### 3. 生成测试数据

运行数据生成脚本：

```bash
npm run seed
```

输出示例：
```
开始生成测试数据...

✓ 创建用户: 追梦者小李 (ID: 1)
  └─ 创建 4 个愿望
  └─ 创建 3 个链条关系
  └─ 生成 8 条行为记录
  └─ 赠送 75 初始积分

✓ 创建用户: 健身达人王芳 (ID: 2)
  └─ 创建 4 个愿望
  ...

✅ 测试数据生成完成！

总计创建：
- 20 个用户
- 81 个愿望
- 61 个愿望链条
```

### 4. 查看生成的数据

```bash
npm run view-data
```

这将显示所有用户及其愿望链条的详细信息。

### 5. 测试API

使用任意用户登录：

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "xiaoli@example.com",
    "password": "password123"
  }'
```

获取推荐：

```bash
TOKEN="your_token_here"

curl -X GET "http://localhost:3000/api/recommendations?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

## 数据特点

### 愿望状态分布
- **已完成 (completed)**: 每个用户的第一个愿望
- **进行中 (in_progress)**: 部分用户的第2-3个愿望
- **待开始 (pending)**: 后续的愿望

### 用户行为数据
- 每个用户有5-15条随机行为记录
- 行为类型：view（浏览）、like（点赞）、share（分享）
- 用于推荐算法的训练数据

### 初始积分
- 每个用户获得50-150的随机初始积分
- 可用于测试奖励系统

### 愿望链条
- 每个愿望都与下一个愿望形成链条关系
- 体现了目标的递进关系
- 支持图谱可视化

## 推荐算法测试

生成的数据已经包含了用户行为，可以直接测试推荐功能：

1. **协同过滤**: 基于相似用户的行为推荐
2. **热门推荐**: 当用户行为不足时，推荐热门愿望
3. **个性化**: 根据用户历史行为调整推荐权重

## 清空数据

如果需要重新生成数据，先清空现有数据：

```sql
-- 连接到数据库
psql -U postgres -d startlink

-- 清空所有表
TRUNCATE users, wishes, wish_chains, user_behaviors, recommendations, user_rewards RESTART IDENTITY CASCADE;
```

然后重新运行 `npm run seed`。

## 注意事项

1. **密码安全**: 测试数据使用统一密码 `password123`，生产环境请使用强密码
2. **数据加密**: 愿望描述已使用AES-256加密存储
3. **数据隐私**: 所有数据都是虚拟的，不包含真实个人信息
4. **性能测试**: 20个用户适合功能测试，压力测试需要更多数据

## 扩展数据

如果需要更多测试数据，可以修改 `database/seed.js`：

1. 增加 `users` 数组中的用户数量
2. 为每个用户添加更多愿望
3. 调整行为记录的生成数量
4. 修改初始积分范围

## 后续替换真实数据

当系统上线后，可以通过以下方式替换为真实用户数据：

1. **保留数据库结构**: 不需要修改表结构
2. **清空测试数据**: 使用上述清空命令
3. **用户注册**: 通过API接口让真实用户注册
4. **数据迁移**: 如果有现有数据，编写迁移脚本

测试数据的设计完全符合生产环境的数据结构，可以无缝过渡。
