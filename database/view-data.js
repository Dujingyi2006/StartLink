const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// 解密函数
const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '12345678901234567890123456789012', 'utf8');

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function viewData() {
  try {
    console.log('='.repeat(80));
    console.log('StartLink 测试数据概览');
    console.log('='.repeat(80));
    console.log();

    // 获取所有用户
    const usersResult = await pool.query(
      'SELECT id, username, email, avatar_url FROM users ORDER BY id'
    );

    for (const user of usersResult.rows) {
      console.log(`\n👤 ${user.avatar_url} ${user.username} (${user.email})`);
      console.log('-'.repeat(80));

      // 获取用户的愿望
      const wishesResult = await pool.query(
        'SELECT id, description, status, priority, target_date FROM wishes WHERE user_id = $1 ORDER BY id',
        [user.id]
      );

      if (wishesResult.rows.length > 0) {
        console.log('  愿望链条:');

        wishesResult.rows.forEach((wish, index) => {
          const decryptedDesc = decrypt(wish.description);
          const statusEmoji = {
            'completed': '✅',
            'in_progress': '🔄',
            'pending': '⏳'
          }[wish.status] || '❓';

          console.log(`    ${index + 1}. ${statusEmoji} ${decryptedDesc}`);
          console.log(`       状态: ${wish.status} | 优先级: ${wish.priority} | 目标日期: ${wish.target_date.toISOString().split('T')[0]}`);
        });

        // 获取用户积分
        const pointsResult = await pool.query(
          'SELECT COALESCE(SUM(points), 0) as total_points FROM user_rewards WHERE user_id = $1',
          [user.id]
        );

        console.log(`\n  💰 总积分: ${pointsResult.rows[0].total_points}`);

        // 获取行为统计
        const behaviorResult = await pool.query(
          'SELECT action_type, COUNT(*) as count FROM user_behaviors WHERE user_id = $1 GROUP BY action_type',
          [user.id]
        );

        if (behaviorResult.rows.length > 0) {
          console.log('  📊 行为统计:');
          behaviorResult.rows.forEach(behavior => {
            console.log(`     ${behavior.action_type}: ${behavior.count}次`);
          });
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('数据统计');
    console.log('='.repeat(80));

    const statsResult = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM wishes) as total_wishes,
        (SELECT COUNT(*) FROM wish_chains) as total_chains,
        (SELECT COUNT(*) FROM user_behaviors) as total_behaviors,
        (SELECT COALESCE(SUM(points), 0) FROM user_rewards) as total_points
    `);

    const stats = statsResult.rows[0];
    console.log(`总用户数: ${stats.total_users}`);
    console.log(`总愿望数: ${stats.total_wishes}`);
    console.log(`总链条数: ${stats.total_chains}`);
    console.log(`总行为数: ${stats.total_behaviors}`);
    console.log(`总积分数: ${stats.total_points}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('查看数据时出错:', error);
  } finally {
    await pool.end();
  }
}

viewData();
