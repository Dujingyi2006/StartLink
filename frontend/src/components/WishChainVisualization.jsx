import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, CheckCircle2, Target } from 'lucide-react';

const ChainNode = ({ wish, isActive, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative bg-neumorphic-bg rounded-xl p-4 shadow-neu-md
                  hover:shadow-neu-hover transition-all cursor-pointer
                  ${isActive ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {wish.status === 'completed' ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <Target className="w-4 h-4 text-blue-500" />
        )}
        <span className="text-xs font-medium text-gray-600">
          {wish.status === 'completed' ? '已完成' : '进行中'}
        </span>
      </div>

      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
        {wish.description}
      </h4>

      {wish.user_count && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          <span>{wish.user_count} 人</span>
        </div>
      )}
    </motion.div>
  );
};

const WishChainVisualization = ({ chains, onNodeClick }) => {
  const [activeNode, setActiveNode] = useState(null);

  const handleNodeClick = (wish) => {
    setActiveNode(wish.id);
    onNodeClick && onNodeClick(wish);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">愿望链条</h2>
        <p className="text-gray-600">查看完成此愿望的用户们的下一步选择</p>
      </div>

      <div className="space-y-8">
        {chains.map((chain, chainIndex) => (
          <motion.div
            key={chainIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: chainIndex * 0.1 }}
            className="bg-neumorphic-bg rounded-2xl p-6 shadow-neu-lg"
          >
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {chain.wishes.map((wish, wishIndex) => (
                <React.Fragment key={wish.id}>
                  <div className="flex-shrink-0 w-64">
                    <ChainNode
                      wish={wish}
                      isActive={activeNode === wish.id}
                      onClick={() => handleNodeClick(wish)}
                    />
                  </div>

                  {wishIndex < chain.wishes.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (chainIndex * 0.1) + (wishIndex * 0.05) }}
                      className="flex-shrink-0"
                    >
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {chain.statistics && (
              <div className="mt-4 pt-4 border-t border-gray-300 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {chain.statistics.total_users} 人选择了这条路径
                  </span>
                </div>
                {chain.statistics.completion_rate && (
                  <div className="text-gray-600">
                    完成率: {Math.round(chain.statistics.completion_rate * 100)}%
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {chains.length === 0 && (
        <div className="text-center py-12 bg-neumorphic-bg rounded-2xl shadow-neu-md">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">暂无愿望链条</p>
          <p className="text-gray-400 text-sm mt-2">完成愿望并设置下一个目标来创建链条</p>
        </div>
      )}
    </div>
  );
};

export default WishChainVisualization;
