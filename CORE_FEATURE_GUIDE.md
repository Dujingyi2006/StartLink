# 核心功能：愿望链条查看

## 功能说明

这是 StartLink 的核心价值功能：**让用户看到完成某个愿望的其他人，他们的下一个愿望是什么**。

### 使用场景

1. **高中生**：当前愿望是"提高成绩"
   - 查看其他完成"提高成绩"的用户
   - 发现他们的下一个愿望可能是："考上理想大学"、"学习新技能"、"参加社团活动"

2. **大四学生**：当前愿望是"找到实习"
   - 查看其他完成"找到实习"的用户
   - 发现他们的下一个愿望可能是："转正"、"跳槽到更好的公司"、"考研"

3. **上班族**：当前愿望是"早点下班"
   - 查看其他完成"早点下班"的用户
   - 发现他们的下一个愿望可能是："学习新技能"、"陪伴家人"、"健身"

## API 接口

### 1. 根据愿望描述查看下一个愿望

**接口**: `GET /api/wish-chains/next-wishes?wishDescription=<愿望描述>`

**说明**: 输入一个愿望描述，查看完成类似愿望的用户们的下一个愿望。

**请求示例**:
```bash
curl -X GET "http://localhost:3000/api/wish-chains/next-wishes?wishDescription=学习JavaScript" \
  -H "Authorization: Bearer <token>"
```

**响应示例**:
```json
{
  "message": "找到 15 位用户完成过类似愿望",
  "totalNextWishes": 12,
  "nextWishes": [
    {
      "previousWish": "学习JavaScript基础知识",
      "nextWish": {
        "id": 23,
        "description": "掌握React框架开发",
        "priority": 5,
        "status": "in_progress"
      },
      "user": {
        "username": "追梦者小李",
        "avatar_url": "👨‍💻"
      },
      "timeGap": 30
    },
    {
      "previousWish": "学习JavaScript高级特性",
      "nextWish": {
        "id": 45,
        "description": "完成一个全栈项目",
        "priority": 4,
        "status": "pending"
      },
      "user": {
        "username": "程序员郑强",
        "avatar_url": "⌨️"
      },
      "timeGap": 45
    }
  ],
  "popularNextWishes": [
    {
      "description": "掌握React框架开发",
      "count": 5,
      "users": ["追梦者小李", "程序员郑强", "设计师吴娜"]
    },
    {
      "description": "完成一个全栈项目",
      "count": 4,
      "users": ["追梦者小李", "程序员郑强"]
    },
    {
      "description": "学习Node.js后端开发",
      "count": 3,
      "users": ["程序员郑强"]
    }
  ],
  "statistics": {
    "totalUsersCompleted": 15,
    "usersWithNextWish": 12,
    "conversionRate": "80.00%"
  }
}
```

### 2. 根据愿望ID查看下一个愿望

**接口**: `GET /api/wish-chains/next-wishes/:id`

**说明**: 输入一个愿望ID，查看完成类似愿望的用户们的下一个愿望。

**请求示例**:
```bash
curl -X GET "http://localhost:3000/api/wish-chains/next-wishes/123" \
  -H "Authorization: Bearer <token>"
```

**响应示例**:
```json
{
  "currentWish": {
    "id": 123,
    "description": "减重10公斤"
  },
  "totalMatches": 8,
  "nextWishes": [
    {
      "completed_wish_id": 45,
      "completed_description": "减重10公斤",
      "next_wish_id": 46,
      "next_description": "参加半程马拉松",
      "next_priority": 4,
      "next_status": "pending",
      "username": "健身达人王芳",
      "avatar_url": "💪",
      "completed_at": "2026-01-15T10:30:00Z"
    }
  ],
  "popularNextWishes": [
    {
      "description": "参加半程马拉松",
      "count": 3,
      "avgPriority": "4.3",
      "users": [
        { "username": "健身达人王芳", "avatar_url": "💪" },
        { "username": "运动员孙强", "avatar_url": "🏃" }
      ],
      "examples": [
        {
          "username": "健身达人王芳",
          "completedAt": "2026-01-15T10:30:00Z"
        }
      ]
    },
    {
      "description": "成为健身教练",
      "count": 2,
      "avgPriority": "3.5",
      "users": [
        { "username": "健身达人王芳", "avatar_url": "💪" }
      ]
    }
  ],
  "insights": {
    "message": "8 位用户完成类似愿望后，最常见的下一步是：参加半程马拉松"
  }
}
```

### 3. 完成愿望并设置下一个愿望

**接口**: `POST /api/wish-chains/complete-and-next`

**说明**: 用户完成当前愿望，并设置下一个愿望，为其他用户提供参考。

**请求示例**:
```bash
curl -X POST "http://localhost:3000/api/wish-chains/complete-and-next" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "wishId": 123,
    "nextWishDescription": "参加半程马拉松",
    "nextWishPriority": 4,
    "nextWishTargetDate": "2026-06-30"
  }'
```

**响应示例**:
```json
{
  "message": "愿望已完成，下一个愿望已设置",
  "completedWishId": 123,
  "nextWish": {
    "id": 456,
    "description": "参加半程马拉松",
    "priority": 4,
    "status": "pending",
    "target_date": "2026-06-30"
  },
  "reward": {
    "points": 50,
    "message": "获得50积分奖励！"
  }
}
```

## 前端集成示例

### 场景1：用户浏览愿望时查看下一步

```javascript
// 用户正在查看某个愿望
const currentWish = {
  id: 123,
  description: "学习JavaScript"
};

// 获取其他人完成此愿望后的下一步
async function showNextWishes() {
  const response = await fetch(
    `/api/wish-chains/next-wishes/${currentWish.id}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  // 显示最受欢迎的下一个愿望
  console.log('其他人完成后最常做的是：');
  data.popularNextWishes.forEach(wish => {
    console.log(`- ${wish.description} (${wish.count}人)`);
  });
}
```

### 场景2：用户完成愿望时引导设置下一个

```javascript
// 用户点击"完成愿望"按钮
async function completeWish(wishId) {
  // 1. 先展示其他人的下一步选择
  const suggestions = await fetch(
    `/api/wish-chains/next-wishes/${wishId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  ).then(r => r.json());

  // 2. 显示建议给用户
  showSuggestions(suggestions.popularNextWishes);

  // 3. 用户选择或输入下一个愿望
  const nextWishDescription = await getUserInput();

  // 4. 提交完成并设置下一个
  const response = await fetch('/api/wish-chains/complete-and-next', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      wishId,
      nextWishDescription,
      nextWishPriority: 4,
      nextWishTargetDate: '2026-12-31'
    })
  });

  const result = await response.json();
  console.log(result.message); // "愿望已完成，下一个愿望已设置"
  console.log(result.reward.message); // "获得50积分奖励！"
}
```

### 场景3：搜索功能

```javascript
// 用户输入愿望描述进行搜索
async function searchNextWishes(description) {
  const response = await fetch(
    `/api/wish-chains/next-wishes?wishDescription=${encodeURIComponent(description)}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  const data = await response.json();

  // 显示统计信息
  console.log(`${data.statistics.totalUsersCompleted} 人完成过类似愿望`);
  console.log(`其中 ${data.statistics.conversionRate} 设置了下一个愿望`);

  // 显示热门下一步
  return data.popularNextWishes;
}
```

## 数据库迁移

在使用新功能前，需要运行数据库迁移：

```bash
psql -U postgres -d startlink -f database/migration_add_completed_at.sql
```

这将添加 `completed_at` 字段和相关索引。

## 核心价值

这个功能的核心价值在于：

1. **启发性**: 让用户看到完成目标后的可能性
2. **社交性**: 通过其他人的经验建立连接
3. **数据驱动**: 基于真实用户数据的推荐
4. **激励性**: 看到其他人的进展会激励自己

## 与推荐系统的区别

| 功能 | 愿望链条查看 | 推荐系统 |
|------|------------|---------|
| 目的 | 看到完成某愿望后的下一步 | 发现可能感兴趣的愿望 |
| 数据来源 | 已完成愿望的真实链条 | 协同过滤算法 |
| 使用场景 | 规划下一步目标 | 探索新的可能性 |
| 核心价值 | 启发和指引 | 发现和推荐 |

两者互补，共同构成完整的用户体验。
