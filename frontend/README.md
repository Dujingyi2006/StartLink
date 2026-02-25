# StartLink 前端 - 新拟态卡片化设计

基于 React + Tailwind CSS 的现代化愿望管理系统前端界面，采用新拟态 (Neumorphism) 设计风格。

## 设计特点

### 新拟态风格
- 柔和的浮雕效果，营造立体感
- 使用双向阴影创造凸起和凹陷效果
- 温馨舒适的视觉体验
- 适合愿望管理的情感化设计

### 卡片化布局
- **愿望卡片**: 展示愿望状态、优先级、目标日期
- **推荐卡片**: 显示匹配度、用户数量、完成率
- **链条卡片**: 可视化愿望之间的连接关系

## 技术栈

- **React 18** - 现代化组件库
- **Tailwind CSS 3** - 实用优先的 CSS 框架
- **Framer Motion** - 流畅的动画效果
- **Lucide React** - 精美的图标库
- **Axios** - HTTP 请求库
- **Vite** - 快速的构建工具

## 项目结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── WishCard.jsx              # 愿望卡片组件
│   │   ├── WishList.jsx              # 愿望列表组件
│   │   ├── RecommendationList.jsx    # 推荐列表组件
│   │   └── WishChainVisualization.jsx # 愿望链条可视化
│   ├── services/
│   │   └── api.js                    # API 服务层
│   ├── App.jsx                       # 主应用组件
│   ├── main.jsx                      # 应用入口
│   └── index.css                     # 全局样式
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 安装和运行

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

前端将运行在 `http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

## 核心组件

### WishCard - 愿望卡片
展示单个愿望的详细信息，包括：
- 状态指示器（待开始/进行中/已完成）
- 优先级标记（低/中/高）
- 目标日期
- 下一个愿望链接

### WishList - 愿望列表
- 筛选功能（全部/待开始/进行中/已完成）
- 网格布局展示
- 创建新愿望按钮
- 响应式设计

### RecommendationList - 推荐列表
- 个性化推荐展示
- 匹配度显示
- 用户数量和完成率统计
- 一键添加到愿望列表

### WishChainVisualization - 愿望链条可视化
- 横向滚动的链条展示
- 箭头连接显示流程
- 节点点击交互
- 统计信息展示

## 新拟态设计系统

### 颜色配置
```javascript
colors: {
  neumorphic: {
    light: '#e0e5ec',  // 高光
    dark: '#a3b1c6',   // 阴影
    bg: '#e0e5ec'      // 背景
  }
}
```

### 阴影效果
```javascript
boxShadow: {
  'neu-sm': '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
  'neu-md': '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff',
  'neu-lg': '12px 12px 24px #a3b1c6, -12px -12px 24px #ffffff',
  'neu-inset': 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff',
  'neu-hover': '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff'
}
```

## API 集成

前端通过 Vite 代理连接到后端 API：

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

### 主要 API 端点

- `GET /api/wishes` - 获取用户愿望
- `GET /api/recommendations` - 获取推荐
- `GET /api/graph` - 获取愿望链条
- `POST /api/wishes` - 创建新愿望

## 动画效果

使用 Framer Motion 实现流畅的动画：

- **淡入动画**: 组件加载时的渐显效果
- **缩放动画**: 悬停和点击时的交互反馈
- **延迟动画**: 列表项的错开显示
- **过渡动画**: 状态变化的平滑过渡

## 响应式设计

- **移动端**: 单列布局
- **平板**: 双列布局
- **桌面**: 三列布局

使用 Tailwind 的响应式类：
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

## 可访问性

- 语义化 HTML 标签
- 键盘导航支持
- ARIA 属性（需进一步完善）
- 颜色对比度符合 WCAG 标准

## 后续优化建议

1. **认证系统**: 添加登录/注册界面
2. **表单组件**: 创建愿望的表单界面
3. **详情页面**: 愿望详情展示页
4. **奖励系统**: 积分和奖励展示界面
5. **暗色模式**: 支持深色主题切换
6. **国际化**: 多语言支持
7. **性能优化**: 虚拟滚动、懒加载
8. **测试**: 单元测试和 E2E 测试

## 开发建议

1. 保持组件的单一职责
2. 使用 Tailwind 的实用类而非自定义 CSS
3. 利用 Framer Motion 增强用户体验
4. 遵循 React Hooks 最佳实践
5. 保持代码简洁和可维护性

## 许可证

MIT
