-- 添加完成时间字段
ALTER TABLE wishes ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- 为已完成的愿望设置完成时间（使用更新时间作为默认值）
UPDATE wishes SET completed_at = updated_at WHERE status = 'completed' AND completed_at IS NULL;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_wishes_status ON wishes(status);
CREATE INDEX IF NOT EXISTS idx_wishes_next_wish_id ON wishes(next_wish_id);
CREATE INDEX IF NOT EXISTS idx_wishes_completed_at ON wishes(completed_at);
