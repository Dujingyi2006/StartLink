import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Camera, Home, Trophy } from 'lucide-react';

const WishCompletionFlow = ({ completedWish, onClose, onSaveNextWish }) => {
  const [step, setStep] = useState('celebration'); // celebration -> form -> card
  const [nextWishDescription, setNextWishDescription] = useState('');
  const [scholarNumber] = useState(Math.floor(Math.random() * 500) + 100); // 模拟数据

  const handleSubmitNextWish = () => {
    if (nextWishDescription.trim()) {
      onSaveNextWish({
        description: nextWishDescription,
        previous_wish_id: completedWish.id
      });
      setStep('card');
    }
  };

  const handleScreenshot = () => {
    // 触发截图功能
    console.log('截图功能');
  };

  const celebrationVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-neumorphic-bg bg-opacity-95 backdrop-blur-sm z-50
                 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl"
      >
        {/* 关闭按钮 */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute -top-4 -right-4 p-3 rounded-full shadow-neu-md hover:shadow-neu-hover
                     bg-neumorphic-card border border-neumorphic-border transition-all z-10"
        >
          <X className="w-5 h-5 text-neumorphic-text" />
        </motion.button>

        <AnimatePresence mode="wait">
          {/* 步骤1: 庆贺 */}
          {step === 'celebration' && (
            <motion.div
              key="celebration"
              variants={celebrationVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-neumorphic-card rounded-2xl shadow-neu-lg border border-neumorphic-border
                         p-12 text-center"
            >
              <motion.div
                variants={sparkleVariants}
                animate="animate"
                className="inline-block mb-6"
              >
                <Trophy className="w-20 h-20 text-neumorphic-accent mx-auto" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-neumorphic-text mb-4"
              >
                恭喜完成愿望！
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-neumorphic-text mb-8 opacity-80"
              >
                「{completedWish.description}」
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep('form')}
                className="px-8 py-4 rounded-xl shadow-neu-md hover:shadow-neu-hover
                           bg-neumorphic-accent text-white font-medium
                           border border-neumorphic-border transition-all
                           flex items-center gap-2 mx-auto"
              >
                <span>继续前行，设定下一个目标</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* 步骤2: 填写下一个愿望 */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="bg-neumorphic-card rounded-2xl shadow-neu-lg border border-neumorphic-border
                         p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-neumorphic-accent" />
                <h2 className="text-2xl font-bold text-neumorphic-text">
                  接下来的愿望
                </h2>
              </div>

              <p className="text-neumorphic-text opacity-70 mb-6">
                完成了「{completedWish.description}」，下一步你想实现什么？
              </p>

              <textarea
                value={nextWishDescription}
                onChange={(e) => setNextWishDescription(e.target.value)}
                placeholder="描述你的下一个愿望..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl shadow-neu-inset border border-neumorphic-border
                           bg-neumorphic-light text-neumorphic-text placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-neumorphic-accent
                           transition-all resize-none mb-6"
              />

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('celebration')}
                  className="flex-1 px-6 py-3 rounded-xl shadow-neu-sm hover:shadow-neu-hover
                             border border-neumorphic-border text-neumorphic-text font-medium
                             transition-all"
                >
                  返回
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitNextWish}
                  disabled={!nextWishDescription.trim()}
                  className="flex-1 px-6 py-3 rounded-xl shadow-neu-md hover:shadow-neu-hover
                             bg-neumorphic-accent text-white font-medium
                             border border-neumorphic-border transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* 步骤3: 精美贺卡 */}
          {step === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="bg-neumorphic-card rounded-2xl shadow-neu-lg border-2 border-neumorphic-border
                         p-12 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #F2EFE9 0%, #E3E5DB 100%)'
              }}
            >
              {/* 装饰性元素 */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-neumorphic-accent rounded-full" />
                <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-neumorphic-accent rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                w-32 h-32 border border-neumorphic-accent rounded-full" />
              </div>

              <div className="relative z-10">
                {/* 贺卡内容 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <div className="inline-block p-4 rounded-full shadow-neu-md bg-neumorphic-light
                                  border border-neumorphic-border mb-6">
                    <Trophy className="w-12 h-12 text-neumorphic-accent" />
                  </div>

                  <h2 className="text-2xl font-bold text-neumorphic-text mb-6">
                    您是完成该愿望后继续上路的
                  </h2>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="inline-block px-8 py-4 rounded-xl shadow-neu-inset
                               bg-neumorphic-light border border-neumorphic-border mb-6"
                  >
                    <span className="text-5xl font-bold text-neumorphic-accent">
                      第 {scholarNumber} 位
                    </span>
                  </motion.div>

                  <h3 className="text-xl font-semibold text-neumorphic-text mb-8">
                    学者
                  </h3>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="border-t-2 border-b-2 border-neumorphic-border py-6 mb-8"
                  >
                    <p className="text-lg text-neumorphic-text leading-relaxed italic">
                      路漫漫其修远兮
                      <br />
                      我将上下而求索
                    </p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-sm text-neumorphic-text opacity-60"
                  >
                    下一个愿望：{nextWishDescription}
                  </motion.p>
                </motion.div>

                {/* 操作按钮 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex gap-4 justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleScreenshot}
                    className="px-6 py-3 rounded-xl shadow-neu-md hover:shadow-neu-hover
                               bg-neumorphic-card text-neumorphic-text font-medium
                               border border-neumorphic-border transition-all
                               flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    <span>截图保存</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl shadow-neu-md hover:shadow-neu-hover
                               bg-neumorphic-accent text-white font-medium
                               border border-neumorphic-border transition-all
                               flex items-center gap-2"
                  >
                    <Home className="w-5 h-5" />
                    <span>返回首页</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default WishCompletionFlow;
