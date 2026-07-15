'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const categories = [
  { value: 'emotion', label: '情绪管理' },
  { value: 'stress', label: '压力缓解' },
  { value: 'interpersonal', label: '人际关系' },
  { value: 'sleep', label: '睡眠质量' },
  { value: 'foundation', label: '心理健康基础' },
];

const statusMap = {
  published: { label: '已发布', color: 'success' },
  draft: { label: '草稿', color: 'default' },
  offline: { label: '已下架', color: 'error' },
};

const getCategoryName = (category) => {
  const found = categories.find(c => c.value === category);
  return found ? found.label : category;
};

const defaultArticles = [
  { id: 1, title: '测试233', category: 'interpersonal', author: '系统管理员', views: 0, publishTime: '2026-01-20 09:45:37', status: 'published', summary: '', content: '', tags: [] },
  { id: 2, title: '学生心理压力应对策略', category: 'stress', author: '系统管理员', views: 35, publishTime: '2026-09-07 08:30:00', status: 'published', summary: '', content: '', tags: [] },
  { id: 3, title: '正念练习入门指南', category: 'emotion', author: '系统管理员', views: 42, publishTime: '2025-09-06 13:10:00', status: 'published', summary: '', content: '', tags: [] },
  { id: 4, title: '睡眠质量与心理健康', category: 'foundation', author: '系统管理员', views: 27, publishTime: '2025-09-05 11:45:00', status: 'published', summary: '', content: '', tags: [] },
  { id: 5, title: '睡眠健康与人际关系', category: 'foundation', author: '系统管理员', views: 27, publishTime: '2025-09-04 16:20:00', status: 'published', summary: '', content: '', tags: [] },
  { id: 6, title: '建立健康的人际关系', category: 'interpersonal', author: '系统管理员', views: 18, publishTime: '2025-09-04 16:20:00', status: 'published', summary: '', content: '', tags: [] },
  { id: 7, title: '职场压力管理指南', category: 'stress', author: '系统管理员', views: 31, publishTime: '2025-09-03 09:15:00', status: 'published', summary: '', content: '', tags: [] },
  { id: 8, title: '情绪调节的五个有效策略', category: 'emotion', author: '系统管理员', views: 23, publishTime: '2025-09-02 14:30:00', status: 'published', summary: '', content: '', tags: [] },
  { id: 9, title: '如何识别和管理焦虑情绪', category: 'foundation', author: '系统管理员', views: 15, publishTime: '2025-09-01 10:00:00', status: 'published', summary: '', content: '', tags: [] },
];

const getArticlesFromStorage = () => {
  const stored = localStorage.getItem('articles');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultArticles;
    }
  }
  localStorage.setItem('articles', JSON.stringify(defaultArticles));
  return defaultArticles;
};

const saveArticlesToStorage = (articles) => {
  localStorage.setItem('articles', JSON.stringify(articles));
};

export default function KnowledgePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filterValues, setFilterValues] = useState({ title: '', category: '', status: '' });
  const [activeFilters, setActiveFilters] = useState({ title: '', category: '', status: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    author: '系统管理员',
    status: 'draft',
    summary: '',
    tags: [],
    cover: '',
    content: '',
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [pagination.current, pagination.pageSize, activeFilters]);

  const fetchArticles = () => {
    setLoading(true);
    const allArticles = getArticlesFromStorage();
    setArticles(allArticles);
    setPagination(prev => ({ ...prev, total: allArticles.length }));
    setLoading(false);
  };

  const filterArticles = () => {
    let result = getArticlesFromStorage();
    
    if (activeFilters.title) {
      result = result.filter(a => a.title.includes(activeFilters.title));
    }
    if (activeFilters.category) {
      result = result.filter(a => a.category === activeFilters.category);
    }
    if (activeFilters.status) {
      result = result.filter(a => a.status === activeFilters.status);
    }

    setPagination(prev => ({ ...prev, total: result.length }));
    
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setArticles(result.slice(start, end));
  };

  const handleAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: '',
      author: '系统管理员',
      status: 'draft',
      summary: '',
      tags: [],
      cover: '',
      content: '',
    });
    setIsModalVisible(true);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      author: article.author,
      status: article.status,
      summary: article.summary || '',
      tags: article.tags || [],
      cover: article.cover || '',
      content: article.content || '',
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    const allArticles = getArticlesFromStorage();
    const updated = allArticles.filter(a => a.id !== id);
    saveArticlesToStorage(updated);
    message.success('删除成功');
    fetchArticles();
    filterArticles();
  };

  const handleToggleStatus = (article) => {
    const newStatus = article.status === 'published' ? 'offline' : 'published';
    const allArticles = getArticlesFromStorage();
    const updated = allArticles.map(a => 
      a.id === article.id ? { ...a, status: newStatus } : a
    );
    saveArticlesToStorage(updated);
    message.success(newStatus === 'published' ? '上架成功' : '下架成功');
    fetchArticles();
    filterArticles();
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      message.error('请输入文章标题');
      return;
    }
    if (!formData.category) {
      message.error('请选择分类');
      return;
    }
    if (!formData.author.trim()) {
      message.error('请输入作者');
      return;
    }
    if (!formData.status) {
      message.error('请选择状态');
      return;
    }

    const allArticles = getArticlesFromStorage();
    
    if (editingArticle) {
      const updated = allArticles.map(a => 
        a.id === editingArticle.id 
          ? { ...a, ...formData, categoryName: getCategoryName(formData.category) }
          : a
      );
      saveArticlesToStorage(updated);
      message.success('编辑成功');
    } else {
      const newArticle = {
        ...formData,
        id: Date.now(),
        views: 0,
        publishTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        categoryName: getCategoryName(formData.category),
      };
      saveArticlesToStorage([newArticle, ...allArticles]);
      message.success('新增成功');
    }

    setIsModalVisible(false);
    setEditingArticle(null);
    fetchArticles();
    filterArticles();
  };

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilterValues({ title: '', category: '', status: '' });
    setActiveFilters({ title: '', category: '', status: '' });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearch = () => {
    setActiveFilters({ ...filterValues });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 250,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => getCategoryName(category),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: '阅读量',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.label}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ color: '#1890ff' }}>
            编辑
          </Button>
          <Button 
            type="text" 
            onClick={() => handleToggleStatus(record)}
            style={{ color: record.status === 'published' ? '#ff4d4f' : '#52c41a' }}
          >
            {record.status === 'published' ? '下架' : '上线'}
          </Button>
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" icon={<DeleteOutlined />} style={{ color: '#ff4d4f' }}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#263238' }}>知识文章</h2>
        <button
          onClick={handleAdd}
          style={{
            padding: '8px 16px',
            background: '#1890ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <PlusOutlined />
          新增
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>文章标题</span>
            <Input
              placeholder="请输入文章标题"
              value={filterValues.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              style={{ width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>分类</span>
            <Select
              placeholder="选择分类"
              value={filterValues.category || undefined}
              onChange={(value) => handleFilterChange('category', value)}
              options={categories}
              style={{ width: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>状态</span>
            <Select
              placeholder="选择状态"
              value={filterValues.status || undefined}
              onChange={(value) => handleFilterChange('status', value)}
              options={[
                { value: 'published', label: '已发布' },
                { value: 'draft', label: '草稿' },
                { value: 'offline', label: '已下架' },
              ]}
              style={{ width: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <Button onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <Table
          dataSource={articles}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize }));
            },
          }}
          scroll={{ x: 1000 }}
        />
      </div>

      {isModalVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            width: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#263238' }}>
                {editingArticle ? '编辑文章' : '新增文章'}
              </h3>
              <button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingArticle(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#263238' }}>
                  * 文章标题
                </label>
                <input
                  type="text"
                  placeholder="请输入文章标题"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={200}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#263238' }}>
                  * 所属分类
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">请选择分类</option>
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#263238' }}>
                  文章摘要
                </label>
                <textarea
                  placeholder="请输入文章摘要（可选）"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  maxLength={1000}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#263238' }}>
                  * 作者
                </label>
                <input
                  type="text"
                  placeholder="请输入作者"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#263238' }}>
                  * 状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                  <option value="offline">已下架</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#263238' }}>
                  文章内容
                </label>
                <textarea
                  placeholder="请输入文章内容"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  maxLength={5000}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}>
              <button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingArticle(null);
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#64748b',
                  background: '#ffffff',
                }}
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#ffffff',
                  background: '#1890ff',
                }}
              >
                {editingArticle ? '保存' : '新增'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}