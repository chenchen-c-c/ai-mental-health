'use client';

import { useState, useEffect } from 'react';
import { Tag, Empty } from 'antd';
import { BookOutlined, CalendarOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import FrontendLayout from '../components/FrontendLayout';

const categories = [
  { id: 'all', name: '全部' },
  { id: 'emotion', name: '情绪调节' },
  { id: 'stress', name: '压力缓解' },
  { id: 'sleep', name: '睡眠改善' },
  { id: 'interpersonal', name: '人际关系' },
  { id: 'foundation', name: '心理健康基础' },
];

const categoryStyles = {
  emotion: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  stress: { backgroundColor: '#ccfbf1', color: '#0d9488' },
  sleep: { backgroundColor: '#e0e7ff', color: '#4f46e5' },
  interpersonal: { backgroundColor: '#fef3c7', color: '#d97706' },
  foundation: { backgroundColor: '#dcfce7', color: '#16a34a' },
};

const coverBgMap = {
  emotion: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
  stress: 'linear-gradient(135deg, #22c55e, #14b8a6)',
  sleep: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  interpersonal: 'linear-gradient(135deg, #f97316, #fbbf24)',
  foundation: 'linear-gradient(135deg, #3b82f6, #6366f1)',
};

const defaultArticles = [
  {
    id: 1,
    title: '正念练习入门指南：如何在喧嚣中找到内心的平静',
    summary: '正念是一种通过有意识地关注当下而不做评判的方式来培养觉察力的心理练习。本文将带你了解正念的基本概念、练习方法以及它如何帮助你减轻压力、改善情绪。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
    category: 'emotion',
    categoryName: '情绪调节',
    publishTime: '2024-01-15',
    views: 1256,
    author: '系统管理员',
    status: 'published',
  },
  {
    id: 2,
    title: '学生心理压力应对策略：轻松应对考试焦虑',
    summary: '学生群体面临着学业、社交等多方面的压力。本文分享了科学有效的压力管理方法，帮助学生建立健康的应对机制，保持良好的心理状态。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    category: 'stress',
    categoryName: '压力缓解',
    publishTime: '2024-01-12',
    views: 892,
    author: '系统管理员',
    status: 'published',
  },
  {
    id: 3,
    title: '睡眠质量与心理健康：打造完美的睡眠习惯',
    summary: '良好的睡眠是心理健康的基石。本文探讨了睡眠与情绪、压力之间的关系，并提供了实用的睡眠改善技巧，帮助你拥有更好的睡眠质量。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    category: 'sleep',
    categoryName: '睡眠改善',
    publishTime: '2024-01-10',
    views: 2103,
    author: '系统管理员',
    status: 'published',
  },
  {
    id: 4,
    title: '情绪调节的五个有效策略：掌控自己的情绪',
    summary: '情绪调节是一项重要的心理技能。本文介绍了深呼吸、认知重构、运动等五种科学有效的情绪调节方法，帮助你更好地管理和调节自己的情绪。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    category: 'emotion',
    categoryName: '情绪调节',
    publishTime: '2024-01-08',
    views: 1567,
    author: '系统管理员',
    status: 'published',
  },
  {
    id: 5,
    title: '职场压力管理指南：在工作中保持身心健康',
    summary: '职场压力是现代社会普遍面临的问题。本文提供了从时间管理到心理调适的全面职场压力管理策略，帮助你在繁忙的工作中找到平衡。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    category: 'stress',
    categoryName: '压力缓解',
    publishTime: '2024-01-05',
    views: 1342,
    author: '系统管理员',
    status: 'published',
  },
  {
    id: 6,
    title: '建立健康的人际关系',
    summary: '良好的人际关系是心理健康的重要支撑。本文探讨了如何建立和维护健康的人际关系，提高社交能力。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #f97316, #fbbf24)',
    category: 'interpersonal',
    categoryName: '人际关系',
    publishTime: '2024-01-02',
    views: 987,
    author: '系统管理员',
    status: 'published',
  },
];

const getArticlesFromStorage = () => {
  const stored = localStorage.getItem('articles');
  if (stored) {
    try {
      const articles = JSON.parse(stored);
      return articles.map(a => ({
        ...a,
        coverBg: coverBgMap[a.category] || 'linear-gradient(135deg, #14b8a6, #06b6d4)',
        summary: a.summary || '暂无简介',
      }));
    } catch (e) {
      return defaultArticles;
    }
  }
  localStorage.setItem('articles', JSON.stringify(defaultArticles));
  return defaultArticles;
};

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    setArticles(getArticlesFromStorage());
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredArticles = activeCategory === 'all'
    ? articles.filter(a => a.status === 'published')
    : articles.filter(a => a.category === activeCategory && a.status === 'published');

  if (!isClient) {
    return null;
  }

  return (
    <FrontendLayout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #ecfeff 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(20, 184, 166, 0.3)' }}>
              <BookOutlined style={{ color: '#ffffff', fontSize: '32px' }} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>心理健康知识库</h1>
            <p style={{ fontSize: '16px', color: '#64748b' }}>科学心理知识，舒缓情绪压力</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: activeCategory === category.id ? 'none' : '1px solid #e2e8f0',
                  background: activeCategory === category.id ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : '#ffffff',
                  color: activeCategory === category.id ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeCategory === category.id ? '0 8px 24px rgba(20, 184, 166, 0.3)' : 'none',
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {filteredArticles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredArticles.map(article => {
                const style = categoryStyles[article.category] || {};
                const foundCategory = categories.find(c => c.id === article.category);
                const categoryName = foundCategory ? foundCategory.name : article.categoryName || article.category;
                return (
                  <Link
                    key={article.id}
                    href={`/knowledge/${article.id}`}
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ width: isMobile ? '100%' : '200px', height: isMobile ? '160px' : 'auto', flexShrink: 0 }}>
                      {article.cover ? (
                        <img src={article.cover} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: article.coverBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOutlined style={{ color: 'rgba(255,255,255,0.2)', fontSize: '48px' }} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '24px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>{article.title}</h3>
                          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {article.summary}
                          </p>
                        </div>
                        <span style={{ ...style, padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                          {categoryName}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px', fontSize: '12px', color: '#94a3b8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <UserOutlined style={{ fontSize: '14px' }} />
                          {article.author}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CalendarOutlined style={{ fontSize: '14px' }} />
                          {article.publishTime?.split(' ')[0] || article.publishTime}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <EyeOutlined style={{ fontSize: '14px' }} />
                          {article.views} 阅读
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '64px', background: '#ffffff', borderRadius: '20px' }}>
              <Empty description={<span style={{ color: '#64748b' }}>暂无该分类下的文章</span>} />
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
}