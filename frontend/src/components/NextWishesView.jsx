import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Users, TrendingUp, Sparkles } from 'lucide-react';

const NextWishesView = ({ currentWish, nextWishes, onClose, onSelectWish }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // 为每个愿望生成略有差异的复古自然色调
  const getWishColor = (index, total) => {
    // 使用复古自然色系：米色、豆沙绿、燕麦色的变化
    const hueBase = 75; // 基础色调（黄绿色系，更温暖）
    const hueVariation = 30; // 色调变化范围
    const hue = hueBase + (index / total) * hueVariation - hueVariation / 2;
    const saturation = 12 + Math.sin(index * 0.5) * 4; // 8-16%（更柔和）
    const lightness = 87 + Math.cos(index * 0.7) * 3; // 84-90%（温暖明亮）
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8
      }
    },
    hover: {
      scale: 1.05,
      y: -8,
      rotateX: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const currentWishVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="fixed inset-0 bg-neumorphic-bg bg-opacity-95 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="container mx-auto px-4 py-12">
        {/* 关闭按钮 */}
        <motion.button
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="fixed top-8 right-8 p-3 rounded-full shadow-neu-md hover:shadow-neu-hover
                     bg-neumorphic-card border border-neumorphic-border transition-all"
        >
          <X className="w-6 h-6 text-neumorphic-text" />
        </motion.button>

        {/* 当前愿望 */}
        <motion.div
          variants={currentWishVariants}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-block p-4 rounded-full shadow-neu-lg bg-neumorphic-card
                         border border-neumorphic-border mb-4"
            >
              <Sparkles className="w-8 h-8 text-neumorphic-accent" />
            </motion.div>
            <h2 className="text-3xl font-bold text-neumorphic-text mb-2">
              接下来的愿望
            </h2>
            <p className="text-neumorphic-text opacity-70">
              完成「{currentWish.description}」后，其他用户选择了这些目标
            </p>
          </div>

          <motion.div
            className="bg-neumorphic-card rounded-2xl p-6 shadow-neu-lg border border-neumorphic-border"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-neumorphic-accent animate-pulse" />
              <span className="text-sm font-medium text-neumorphic-text">当前愿望</span>
            </div>
            <h3 className="text-xl font-semibold text-neumorphic-text">
              {currentWish.description}
            </h3>
          </motion.div>
        </motion.div>

        {/* 接下来的愿望卡片 */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {nextWishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => onSelectWish(wish)}
                style={{
                  backgroundColor: getWishColor(index, nextWishes.length),
                  perspective: "1000px"
                }}
                className="rounded-2xl p-6 shadow-neu-lg border border-neumorphic-border
                           cursor-pointer relative overflow-hidden"
              >
                {/* 光晕效果 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent
                             opacity-0 pointer-events-none"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* 内容 */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="px-3 py-1 rounded-lg shadow-neu-sm bg-white/40 backdrop-blur-sm
                                 border border-white/30"
                    >
                      <span className="text-xs font-medium text-neumorphic-text">
                        #{index + 1}
                      </span>
                    </motion.div>
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5 text-neumorphic-accent" />
                    </motion.div>
                  </div>

                  <h3 className="text-lg font-semibold text-neumorphic-text mb-4 line-clamp-3">
                    {wish.description}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-neumorphic-text">
                    <motion.div
                      className="flex items-center gap-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Users className="w-4 h-4" />
                      <span>{wish.user_count || 0} 人</span>
                    </motion.div>
                    {wish.completion_rate && (
                      <motion.div
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>{Math.round(wish.completion_rate * 100)}%</span>
                      </motion.div>
                    )}
                  </div>

                  {/* 选择指示器 */}
                  <AnimatePresence>
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-4 right-4 w-6 h-6 rounded-full
                                   bg-neumorphic-accent flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="w-3 h-3 rounded-full bg-white"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 空状态 */}
        {nextWishes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <Sparkles className="w-16 h-16 text-neumorphic-text opacity-30 mx-auto mb-4" />
            <p className="text-neumorphic-text text-lg opacity-70">
              暂无接下来的愿望推荐
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default NextWishesView;
