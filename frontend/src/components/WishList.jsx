import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WishCard from './WishCard';
import { Plus, Filter } from 'lucide-react';

const WishList = ({ wishes, onWishClick, onCreateWish, onComplete }) => {
  const [filter, setFilter] = useState('all');
  const [filteredWishes, setFilteredWishes] = useState(wishes);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredWishes(wishes);
    } else {
      setFilteredWishes(wishes.filter(wish => wish.status === filter));
    }
  }, [filter, wishes]);

  const filterOptions = [
    { value: 'all', label: '全部' },
    { value: 'pending', label: '待开始' },
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-neumorphic-text" />
          <div className="flex gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  border border-neumorphic-border
                  ${filter === option.value
                    ? 'shadow-neu-inset text-neumorphic-text bg-neumorphic-card'
                    : 'shadow-neu-sm text-neumorphic-text bg-neumorphic-light hover:shadow-neu-hover'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateWish}
          className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-neu-md
                     hover:shadow-neu-hover transition-all bg-neumorphic-card text-neumorphic-text
                     border border-neumorphic-border font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>创建愿望</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWishes.map((wish, index) => (
          <motion.div
            key={wish.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <WishCard wish={wish} onClick={() => onWishClick(wish)} onComplete={onComplete} />
          </motion.div>
        ))}
      </div>

      {filteredWishes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neumorphic-text text-lg">暂无愿望</p>
        </div>
      )}
    </div>
  );
};

export default WishList;
