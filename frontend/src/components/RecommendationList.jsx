import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, TrendingUp, ArrowRight } from 'lucide-react';

const RecommendationCard = ({ recommendation, onAccept }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-neumorphic-bg rounded-2xl p-6 shadow-neu-md hover:shadow-neu-hover
                 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">为你推荐</span>
        </div>
        <div className="px-3 py-1 rounded-lg shadow-neu-sm text-xs font-medium text-blue-600">
          匹配度 {Math.round(recommendation.score * 100)}%
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {recommendation.description}
      </h3>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{recommendation.user_count || 0} 人有此愿望</span>
        </div>
        {recommendation.completion_rate && (
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{Math.round(recommendation.completion_rate * 100)}% 完成率</span>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onAccept(recommendation)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                   shadow-neu-md hover:shadow-neu-hover transition-all
                   bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium"
      >
        <span>添加到我的愿望</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

const RecommendationList = ({ recommendations, onAccept }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">个性化推荐</h2>
        <p className="text-gray-600">基于你的兴趣和相似用户的选择</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RecommendationCard recommendation={rec} onAccept={onAccept} />
          </motion.div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">暂无推荐内容</p>
          <p className="text-gray-400 text-sm mt-2">多浏览一些愿望，我们会为你推荐更多内容</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
