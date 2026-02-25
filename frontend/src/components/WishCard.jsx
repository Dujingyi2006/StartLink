import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';

const WishCard = ({ wish, onClick }) => {
  const statusConfig = {
    pending: { icon: Circle, color: 'text-neumorphic-text', label: '待开始' },
    in_progress: { icon: TrendingUp, color: 'text-neumorphic-accent', label: '进行中' },
    completed: { icon: CheckCircle2, color: 'text-green-700', label: '已完成' }
  };

  const priorityConfig = {
    low: { color: 'bg-yellow-600', label: '低' },
    medium: { color: 'bg-orange-600', label: '中' },
    high: { color: 'bg-red-700', label: '高' }
  };

  const StatusIcon = statusConfig[wish.status]?.icon || Circle;
  const statusColor = statusConfig[wish.status]?.color || 'text-neumorphic-text';
  const statusLabel = statusConfig[wish.status]?.label || '未知';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-neumorphic-card rounded-2xl p-6 shadow-neu-md hover:shadow-neu-hover
                 transition-all duration-300 cursor-pointer border border-neumorphic-border"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-5 h-5 ${statusColor}`} />
          <span className={`text-sm font-medium ${statusColor}`}>{statusLabel}</span>
        </div>
        {wish.priority && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${priorityConfig[wish.priority]?.color}`} />
            <span className="text-xs text-neumorphic-text">{priorityConfig[wish.priority]?.label}</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-neumorphic-text mb-3 line-clamp-2">
        {wish.description}
      </h3>

      {wish.target_date && (
        <div className="flex items-center gap-2 text-sm text-neumorphic-text mb-3">
          <Clock className="w-4 h-4" />
          <span>目标日期: {new Date(wish.target_date).toLocaleDateString('zh-CN')}</span>
        </div>
      )}

      {wish.next_wish_id && (
        <div className="flex items-center gap-2 text-sm text-neumorphic-accent">
          <Target className="w-4 h-4" />
          <span>已设置下一个愿望</span>
        </div>
      )}
    </motion.div>
  );
};

export default WishCard;
