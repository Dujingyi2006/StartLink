import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WishList from './components/WishList';
import RecommendationList from './components/RecommendationList';
import WishChainVisualization from './components/WishChainVisualization';
import { wishAPI, recommendationAPI, graphAPI } from './services/api';

function App() {
  // 模拟数据用于演示
  const mockWishes = [
    { id: 1, description: '学习 React 和现代前端开发', status: 'in_progress', priority: 'high', target_date: '2026-03-15' },
    { id: 2, description: '完成个人项目并开源', status: 'pending', priority: 'medium', target_date: '2026-04-01' },
    { id: 3, description: '阅读 10 本技术书籍', status: 'in_progress', priority: 'medium', target_date: '2026-12-31' }
  ];

  const mockRecommendations = [
    { id: 1, description: '掌握 TypeScript 高级特性', score: 0.92, user_count: 156, completion_rate: 0.78 },
    { id: 2, description: '学习系统设计和架构', score: 0.85, user_count: 203, completion_rate: 0.65 }
  ];

  const mockChains = [
    {
      wishes: [
        { id: 1, description: '学习 React 基础', status: 'completed', user_count: 245 },
        { id: 2, description: '掌握 React Hooks', status: 'completed', user_count: 189 },
        { id: 3, description: '学习状态管理', status: 'in_progress', user_count: 134 }
      ],
      statistics: { total_users: 245, completion_rate: 0.77 }
    }
  ];

  const [wishes, setWishes] = useState(mockWishes);
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [chains, setChains] = useState(mockChains);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 注释掉 API 调用，使用模拟数据
    // loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [wishesData, recsData, chainsData] = await Promise.all([
        wishAPI.getWishes(),
        recommendationAPI.getRecommendations(),
        graphAPI.getGraph()
      ]);
      setWishes(wishesData);
      setRecommendations(recsData);
      setChains(chainsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishClick = (wish) => {
    console.log('点击愿望:', wish);
  };

  const handleCreateWish = () => {
    console.log('创建新愿望');
  };

  const handleAcceptRecommendation = async (rec) => {
    try {
      await wishAPI.createWish({
        description: rec.description,
        is_public: true
      });
      loadData();
    } catch (error) {
      console.error('添加愿望失败:', error);
    }
  };

  const handleNodeClick = (wish) => {
    console.log('点击链条节点:', wish);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neumorphic-bg flex items-center justify-center">
        <div className="text-neumorphic-text text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neumorphic-bg pb-20">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-neumorphic-text mb-2">StartLink</h1>
          <p className="text-neumorphic-text">愿望管理与推荐系统</p>
        </header>

        <div className="space-y-20">
          <section>
            <WishList
              wishes={wishes}
              onWishClick={handleWishClick}
              onCreateWish={handleCreateWish}
            />
          </section>

          <section>
            <RecommendationList
              recommendations={recommendations}
              onAccept={handleAcceptRecommendation}
            />
          </section>

          <section>
            <WishChainVisualization
              chains={chains}
              onNodeClick={handleNodeClick}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
