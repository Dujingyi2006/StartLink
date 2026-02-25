-- 创建数据库
CREATE DATABASE startlink;

-- 连接到数据库
\c startlink;

-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 愿望表
CREATE TABLE wishes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    next_wish_id INTEGER REFERENCES wishes(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 愿望链条表
CREATE TABLE wish_chains (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    wish_id INTEGER REFERENCES wishes(id) ON DELETE CASCADE,
    next_wish_id INTEGER REFERENCES wishes(id),
    chain_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户行为记录表（用于推荐算法）
CREATE TABLE user_behaviors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    wish_id INTEGER REFERENCES wishes(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 推荐记录表
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    wish_id INTEGER REFERENCES wishes(id) ON DELETE CASCADE,
    recommended_wish_id INTEGER REFERENCES wishes(id),
    score FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 奖励积分表
CREATE TABLE user_rewards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    reward_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_wishes_user_id ON wishes(user_id);
CREATE INDEX idx_wish_chains_user_id ON wish_chains(user_id);
CREATE INDEX idx_user_behaviors_user_id ON user_behaviors(user_id);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
