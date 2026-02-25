import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Eye, EyeOff, Save } from 'lucide-react';

const WishFormModal = ({ isOpen, onClose, onSave, editingWish = null }) => {
  const [formData, setFormData] = useState({
    description: '',
    target_date: '',
    priority: 'medium',
    is_public: true
  });

  useEffect(() => {
    if (editingWish) {
      setFormData({
        description: editingWish.description || '',
        target_date: editingWish.target_date || '',
        priority: editingWish.priority || 'medium',
        is_public: editingWish.is_public !== undefined ? editingWish.is_public : true
      });
    } else {
      setFormData({
        description: '',
        target_date: '',
        priority: 'medium',
        is_public: true
      });
    }
  }, [editingWish, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const priorityOptions = [
    { value: 'low', label: '低', color: 'bg-yellow-600' },
    { value: 'medium', label: '中', color: 'bg-orange-600' },
    { value: 'high', label: '高', color: 'bg-red-700' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-neumorphic-bg bg-opacity-90 backdrop-blur-sm z-50
                   flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="bg-neumorphic-card rounded-2xl shadow-neu-lg border border-neumorphic-border
                     w-full max-w-2xl p-8 relative"
        >
          {/* 关闭按钮 */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full shadow-neu-sm hover:shadow-neu-hover
                       transition-all border border-neumorphic-border"
          >
            <X className="w-5 h-5 text-neumorphic-text" />
          </motion.button>

          {/* 标题 */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-neumorphic-text mb-6"
          >
            {editingWish ? '编辑愿望' : '创建新愿望'}
          </motion.h2>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 愿望描述 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-neumorphic-text mb-2">
                愿望描述 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="描述你的愿望..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl shadow-neu-inset border border-neumorphic-border
                           bg-neumorphic-light text-neumorphic-text placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-neumorphic-accent
                           transition-all resize-none"
              />
            </motion.div>

            {/* 目标日期 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-neumorphic-text mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                目标日期
              </label>
              <input
                type="date"
                value={formData.target_date}
                onChange={(e) => handleChange('target_date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl shadow-neu-inset border border-neumorphic-border
                           bg-neumorphic-light text-neumorphic-text
                           focus:outline-none focus:ring-2 focus:ring-neumorphic-accent
                           transition-all"
              />
            </motion.div>

            {/* 优先级 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-neumorphic-text mb-3">
                <Flag className="w-4 h-4 inline mr-2" />
                优先级
              </label>
              <div className="flex gap-3">
                {priorityOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('priority', option.value)}
                    className={`flex-1 px-4 py-3 rounded-xl border border-neumorphic-border
                               transition-all font-medium
                               ${formData.priority === option.value
                                 ? 'shadow-neu-inset bg-neumorphic-light'
                                 : 'shadow-neu-sm hover:shadow-neu-hover'
                               }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      <span className="text-neumorphic-text">{option.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* 公开/私密 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-neumorphic-text mb-3">
                可见性
              </label>
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChange('is_public', true)}
                  className={`flex-1 px-4 py-3 rounded-xl border border-neumorphic-border
                             transition-all font-medium
                             ${formData.is_public
                               ? 'shadow-neu-inset bg-neumorphic-light'
                               : 'shadow-neu-sm hover:shadow-neu-hover'
                             }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-neumorphic-text" />
                    <span className="text-neumorphic-text">公开</span>
                  </div>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChange('is_public', false)}
                  className={`flex-1 px-4 py-3 rounded-xl border border-neumorphic-border
                             transition-all font-medium
                             ${!formData.is_public
                               ? 'shadow-neu-inset bg-neumorphic-light'
                               : 'shadow-neu-sm hover:shadow-neu-hover'
                             }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <EyeOff className="w-4 h-4 text-neumorphic-text" />
                    <span className="text-neumorphic-text">私密</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* 提交按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3 pt-4"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl shadow-neu-sm hover:shadow-neu-hover
                           border border-neumorphic-border text-neumorphic-text font-medium
                           transition-all"
              >
                取消
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 rounded-xl shadow-neu-md hover:shadow-neu-hover
                           bg-neumorphic-accent text-white font-medium
                           border border-neumorphic-border transition-all
                           flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingWish ? '保存' : '创建'}</span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WishFormModal;
