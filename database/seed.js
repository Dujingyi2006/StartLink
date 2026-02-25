require('dotenv').config(); // 加载.env配置
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

// 直接指定连接信息，不用读取.env
const pool = new Pool({
  host: 'localhost',        // 本地数据库
  port: 5432,               // 默认端口
  database: 'startlink',    // 数据库名
  user: 'postgres',         // 强制用postgres用户（关键！）
  password: '3101',  // 填你自己的密码，比如123456
});

// 加密函数
const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '12345678901234567890123456789012', 'utf8');

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// 虚拟用户数据
const users = [
  { username: '追梦者小李', email: 'xiaoli@example.com', avatar: '👨‍💻' },
  { username: '健身达人王芳', email: 'wangfang@example.com', avatar: '💪' },
  { username: '读书爱好者张伟', email: 'zhangwei@example.com', avatar: '📚' },
  { username: '旅行家刘洋', email: 'liuyang@example.com', avatar: '✈️' },
  { username: '美食探索者陈静', email: 'chenjing@example.com', avatar: '🍜' },
  { username: '音乐人赵明', email: 'zhaoming@example.com', avatar: '🎵' },
  { username: '摄影师孙丽', email: 'sunli@example.com', avatar: '📷' },
  { username: '创业者周杰', email: 'zhoujie@example.com', avatar: '🚀' },
  { username: '设计师吴娜', email: 'wuna@example.com', avatar: '🎨' },
  { username: '程序员郑强', email: 'zhengqiang@example.com', avatar: '⌨️' },
  { username: '瑜伽教练林美', email: 'linmei@example.com', avatar: '🧘' },
  { username: '厨师黄涛', email: 'huangtao@example.com', avatar: '👨‍🍳' },
  { username: '教师马丽', email: 'mali@example.com', avatar: '👩‍🏫' },
  { username: '医生徐峰', email: 'xufeng@example.com', avatar: '👨‍⚕️' },
  { username: '作家钱红', email: 'qianhong@example.com', avatar: '✍️' },
  { username: '运动员孙强', email: 'sunqiang@example.com', avatar: '🏃' },
  { username: '投资人周敏', email: 'zhoumin@example.com', avatar: '💼' },
  { username: '艺术家吴刚', email: 'wugang@example.com', avatar: '🎭' },
  { username: '科学家郑芳', email: 'zhengfang@example.com', avatar: '🔬' },
  { username: '志愿者李娜', email: 'lina@example.com', avatar: '❤️' }
];

// 愿望链条数据（每个用户3-5个相关联的愿望）
const wishChains = [
  // 追梦者小李 - 技术成长路径
  [
    { description: '学习JavaScript基础知识', priority: 5, status: 'completed' },
    { description: '掌握React框架开发', priority: 5, status: 'in_progress' },
    { description: '完成一个全栈项目', priority: 4, status: 'pending' },
    { description: '找到理想的开发工作', priority: 5, status: 'pending' }
  ],
  // 健身达人王芳 - 健身目标
  [
    { description: '每周健身3次持续一个月', priority: 5, status: 'completed' },
    { description: '减重10公斤', priority: 5, status: 'in_progress' },
    { description: '参加半程马拉松', priority: 4, status: 'pending' },
    { description: '成为健身教练', priority: 3, status: 'pending' }
  ],
  // 读书爱好者张伟 - 阅读计划
  [
    { description: '今年阅读50本书', priority: 5, status: 'in_progress' },
    { description: '写10篇读书笔记', priority: 4, status: 'in_progress' },
    { description: '建立个人读书博客', priority: 3, status: 'pending' },
    { description: '出版一本书评集', priority: 2, status: 'pending' }
  ],
  // 旅行家刘洋 - 旅行梦想
  [
    { description: '游览中国所有省份', priority: 5, status: 'in_progress' },
    { description: '去10个国家旅行', priority: 4, status: 'pending' },
    { description: '学会三门外语', priority: 4, status: 'pending' },
    { description: '写一本旅行游记', priority: 3, status: 'pending' }
  ],
  // 美食探索者陈静 - 美食之旅
  [
    { description: '尝遍本地所有特色餐厅', priority: 4, status: 'in_progress' },
    { description: '学会做20道拿手菜', priority: 5, status: 'in_progress' },
    { description: '考取营养师证书', priority: 3, status: 'pending' },
    { description: '开一家自己的餐厅', priority: 5, status: 'pending' }
  ],
  // 音乐人赵明 - 音乐梦想
  [
    { description: '学会弹吉他', priority: 5, status: 'completed' },
    { description: '创作10首原创歌曲', priority: 5, status: 'in_progress' },
    { description: '举办个人音乐会', priority: 4, status: 'pending' },
    { description: '发行个人专辑', priority: 5, status: 'pending' }
  ],
  // 摄影师孙丽 - 摄影之路
  [
    { description: '掌握专业摄影技巧', priority: 5, status: 'completed' },
    { description: '拍摄1000张优质照片', priority: 4, status: 'in_progress' },
    { description: '举办个人摄影展', priority: 4, status: 'pending' },
    { description: '成为签约摄影师', priority: 5, status: 'pending' }
  ],
  // 创业者周杰 - 创业计划
  [
    { description: '完成商业计划书', priority: 5, status: 'completed' },
    { description: '获得天使投资', priority: 5, status: 'in_progress' },
    { description: '组建核心团队', priority: 5, status: 'in_progress' },
    { description: '产品上线并获得1万用户', priority: 4, status: 'pending' },
    { description: '实现盈利', priority: 5, status: 'pending' }
  ],
  // 设计师吴娜 - 设计成长
  [
    { description: '学习UI/UX设计', priority: 5, status: 'completed' },
    { description: '完成50个设计作品', priority: 4, status: 'in_progress' },
    { description: '建立个人设计品牌', priority: 4, status: 'pending' },
    { description: '获得国际设计奖项', priority: 3, status: 'pending' }
  ],
  // 程序员郑强 - 技术进阶
  [
    { description: '掌握三种编程语言', priority: 5, status: 'completed' },
    { description: '为开源项目贡献代码', priority: 4, status: 'in_progress' },
    { description: '成为技术团队Leader', priority: 4, status: 'pending' },
    { description: '出版一本技术书籍', priority: 3, status: 'pending' }
  ],
  // 瑜伽教练林美 - 瑜伽之路
  [
    { description: '获得瑜伽教练资格证', priority: 5, status: 'completed' },
    { description: '教授100节瑜伽课', priority: 4, status: 'in_progress' },
    { description: '开设瑜伽工作室', priority: 5, status: 'pending' },
    { description: '培训50名瑜伽教练', priority: 3, status: 'pending' }
  ],
  // 厨师黄涛 - 厨艺精进
  [
    { description: '学习法式料理', priority: 4, status: 'in_progress' },
    { description: '获得米其林餐厅工作经验', priority: 5, status: 'pending' },
    { description: '创立个人料理品牌', priority: 4, status: 'pending' },
    { description: '出版烹饪书籍', priority: 3, status: 'pending' }
  ],
  // 教师马丽 - 教育理想
  [
    { description: '获得高级教师资格', priority: 5, status: 'completed' },
    { description: '培养100名优秀学生', priority: 4, status: 'in_progress' },
    { description: '开发创新教学方法', priority: 4, status: 'in_progress' },
    { description: '成为教育专家', priority: 5, status: 'pending' }
  ],
  // 医生徐峰 - 医学追求
  [
    { description: '完成住院医师培训', priority: 5, status: 'completed' },
    { description: '发表5篇医学论文', priority: 4, status: 'in_progress' },
    { description: '成为主任医师', priority: 5, status: 'pending' },
    { description: '攻克一项医学难题', priority: 3, status: 'pending' }
  ],
  // 作家钱红 - 写作梦想
  [
    { description: '每天写作2000字', priority: 5, status: 'in_progress' },
    { description: '完成第一部长篇小说', priority: 5, status: 'in_progress' },
    { description: '出版畅销书', priority: 4, status: 'pending' },
    { description: '获得文学奖项', priority: 3, status: 'pending' }
  ],
  // 运动员孙强 - 竞技目标
  [
    { description: '打破个人最好成绩', priority: 5, status: 'completed' },
    { description: '参加全国比赛', priority: 5, status: 'in_progress' },
    { description: '获得金牌', priority: 5, status: 'pending' },
    { description: '代表国家参赛', priority: 4, status: 'pending' }
  ],
  // 投资人周敏 - 投资规划
  [
    { description: '学习价值投资理论', priority: 5, status: 'completed' },
    { description: '建立投资组合', priority: 5, status: 'in_progress' },
    { description: '实现年化收益20%', priority: 4, status: 'pending' },
    { description: '成立投资基金', priority: 5, status: 'pending' }
  ],
  // 艺术家吴刚 - 艺术追求
  [
    { description: '完成100幅画作', priority: 4, status: 'in_progress' },
    { description: '举办个人画展', priority: 5, status: 'pending' },
    { description: '作品被美术馆收藏', priority: 4, status: 'pending' },
    { description: '成为知名艺术家', priority: 3, status: 'pending' }
  ],
  // 科学家郑芳 - 科研目标
  [
    { description: '完成博士学位', priority: 5, status: 'completed' },
    { description: '在顶级期刊发表论文', priority: 5, status: 'in_progress' },
    { description: '获得科研基金', priority: 4, status: 'pending' },
    { description: '做出重大科学发现', priority: 5, status: 'pending' }
  ],
  // 志愿者李娜 - 公益梦想
  [
    { description: '参与100小时志愿服务', priority: 4, status: 'in_progress' },
    { description: '组织公益活动', priority: 5, status: 'in_progress' },
    { description: '建立公益组织', priority: 5, status: 'pending' },
    { description: '帮助1000个需要帮助的人', priority: 4, status: 'pending' }
  ]
];

async function seedDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('开始生成测试数据...\n');

    // 生成用户和愿望
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const wishes = wishChains[i];

      // 创建用户
      const passwordHash = await bcrypt.hash('password123', 10);
      const userResult = await client.query(
        'INSERT INTO users (username, email, password_hash, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id',
        [user.username, user.email, passwordHash, user.avatar]
      );

      const userId = userResult.rows[0].id;
      console.log(`✓ 创建用户: ${user.username} (ID: ${userId})`);

      // 创建愿望链条
      const wishIds = [];
      for (let j = 0; j < wishes.length; j++) {
        const wish = wishes[j];
        const encryptedDescription = encrypt(wish.description);

        // 随机设置目标日期（未来3-12个月）
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + Math.floor(Math.random() * 9) + 3);

        const wishResult = await client.query(
          'INSERT INTO wishes (user_id, description, target_date, status, priority, is_public) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          [userId, encryptedDescription, targetDate, wish.status, wish.priority, true]
        );

        wishIds.push(wishResult.rows[0].id);
      }

      console.log(`  └─ 创建 ${wishes.length} 个愿望`);

      // 创建愿望链条关系
      for (let j = 0; j < wishIds.length - 1; j++) {
        await client.query(
          'INSERT INTO wish_chains (user_id, wish_id, next_wish_id, chain_order) VALUES ($1, $2, $3, $4)',
          [userId, wishIds[j], wishIds[j + 1], j + 1]
        );
      }

      if (wishIds.length > 1) {
        console.log(`  └─ 创建 ${wishIds.length - 1} 个链条关系`);
      }

      // 生成一些用户行为数据
      const behaviorTypes = ['view', 'like', 'share'];
      const behaviorCount = Math.floor(Math.random() * 10) + 5;

      for (let j = 0; j < behaviorCount; j++) {
        const randomWishIndex = Math.floor(Math.random() * wishIds.length);
        const randomBehavior = behaviorTypes[Math.floor(Math.random() * behaviorTypes.length)];

        await client.query(
          'INSERT INTO user_behaviors (user_id, wish_id, action_type) VALUES ($1, $2, $3)',
          [userId, wishIds[randomWishIndex], randomBehavior]
        );
      }

      console.log(`  └─ 生成 ${behaviorCount} 条行为记录`);

      // 给用户一些初始积分
      const initialPoints = Math.floor(Math.random() * 100) + 50;
      await client.query(
        'INSERT INTO user_rewards (user_id, points, reward_type, description) VALUES ($1, $2, $3, $4)',
        [userId, initialPoints, 'INITIAL', '初始积分']
      );

      console.log(`  └─ 赠送 ${initialPoints} 初始积分\n`);
    }

    await client.query('COMMIT');

    console.log('✅ 测试数据生成完成！');
    console.log(`\n总计创建：`);
    console.log(`- ${users.length} 个用户`);
    console.log(`- ${wishChains.reduce((sum, chain) => sum + chain.length, 0)} 个愿望`);
    console.log(`- ${wishChains.reduce((sum, chain) => sum + chain.length - 1, 0)} 个愿望链条`);

    console.log('\n所有用户的默认密码为: password123');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 生成数据时出错:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// 运行脚本
seedDatabase().catch(console.error);
