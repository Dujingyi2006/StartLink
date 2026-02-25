# API 测试示例

## 使用 curl 测试 API

### 1. 用户注册

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

响应示例：
```json
{
  "message": "注册成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 2. 用户登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. 创建愿望

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3000/api/wishes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "学习Node.js后端开发",
    "target_date": "2026-12-31",
    "priority": 5,
    "is_public": true
  }'
```

### 4. 获取用户愿望列表

```bash
curl -X GET http://localhost:3000/api/wishes \
  -H "Authorization: Bearer $TOKEN"
```

### 5. 获取个性化推荐

```bash
curl -X GET "http://localhost:3000/api/recommendations?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. 触发随机奖励

```bash
curl -X POST http://localhost:3000/api/rewards/random \
  -H "Authorization: Bearer $TOKEN"
```

### 7. 获取用户积分

```bash
curl -X GET http://localhost:3000/api/rewards/points \
  -H "Authorization: Bearer $TOKEN"
```

### 8. 获取愿望图谱

```bash
curl -X GET http://localhost:3000/api/graph \
  -H "Authorization: Bearer $TOKEN"
```

### 9. 创建愿望链条

```bash
curl -X POST http://localhost:3000/api/graph/chains \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "wish_id": 1,
    "next_wish_id": 2,
    "chain_order": 1
  }'
```

### 10. 记录用户行为

```bash
curl -X POST http://localhost:3000/api/wishes/behavior \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "wish_id": 1,
    "action_type": "view"
  }'
```

## 核心功能测试

### 11. 查看完成某愿望后的下一步（根据描述）

```bash
curl -X GET "http://localhost:3000/api/wish-chains/next-wishes?wishDescription=学习JavaScript" \
  -H "Authorization: Bearer $TOKEN"
```

### 12. 查看完成某愿望后的下一步（根据ID）

```bash
curl -X GET "http://localhost:3000/api/wish-chains/next-wishes/1" \
  -H "Authorization: Bearer $TOKEN"
```

### 13. 完成愿望并设置下一个愿望

```bash
curl -X POST http://localhost:3000/api/wish-chains/complete-and-next \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "wishId": 1,
    "nextWishDescription": "掌握React框架开发",
    "nextWishPriority": 5,
    "nextWishTargetDate": "2026-12-31"
  }'
```

## 使用 Postman 测试

1. 导入环境变量：
   - `base_url`: http://localhost:3000
   - `token`: (登录后获取)

2. 设置 Authorization：
   - Type: Bearer Token
   - Token: {{token}}

3. 测试流程：
   - 注册 → 登录 → 创建愿望 → 浏览愿望 → 获取推荐 → 触发奖励

## 常见错误码

- `400` - 请求参数错误
- `401` - 未认证或令牌无效
- `403` - 无权访问
- `404` - 资源不存在
- `429` - 请求过于频繁
- `500` - 服务器错误

## 测试数据示例

### 愿望描述示例
- "完成一个全栈项目"
- "学习机器学习基础"
- "阅读10本技术书籍"
- "参加一次技术分享会"
- "掌握Docker容器技术"

### 行为类型
- `view` - 浏览
- `like` - 点赞
- `share` - 分享
- `complete` - 完成

### 愿望状态
- `pending` - 待开始
- `in_progress` - 进行中
- `completed` - 已完成
- `cancelled` - 已取消
