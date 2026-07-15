'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { request } from '../../utils/request';

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

const mockArticles = [
  { id: 1, title: '测试233', category: 'interpersonal', categoryName: '人际关系', author: '系统管理员', views: 0, publishTime: '2026-01-20 09:45:37', status: 'published' },
  { id: 2, title: '学生心理压力应对策略', category: 'stress', categoryName: '压力缓解', author: '系统管理员', views: 35, publishTime: '2026-09-07 08:30:00', status: 'published' },
  { id: 3, title: '正念练习入门指南', category: 'emotion', categoryName: '情绪管理', author: '系统管理员', views: 42, publishTime: '2025-09-06 13:10:00', status: 'published' },
  { id: 4, title: '睡眠质量与心理健康', category: 'foundation', categoryName: '心理健康基础', author: '系统管理员', views: 27, publishTime: '2025-09-05 11:45:00', status: 'published' },
  { id: 5, title: '睡眠健康与人际关系', category: 'foundation', categoryName: '心理健康基础', author: '系统管理员', views: 27, publishTime: '2025-09-04 16:20:00', status: 'published' },
  { id: 6, title: '建立健康的人际关系', category: 'interpersonal', categoryName: '人际关系', author: '系统管理员', views: 18, publishTime: '2025-09-04 16:20:00', status: 'published' },
  { id: 7, title: '职场压力管理指南', category: 'stress', categoryName: '压力缓解', author: '系统管理员', views: 31, publishTime: '2025-09-03 09:15:00', status: 'published' },
  { id: 8, title: '情绪调节的五个有效策略', category: 'emotion', categoryName: '情绪管理', author: '系统管理员', views: 23, publishTime: '2025-09-02 14:30:00', status: 'published' },
  { id: 9, title: '如何识别和管理焦虑情绪', category: 'foundation', categoryName: '心理健康基础', author: '系统管理员', views: 15, publishTime: '2025-09-01 10:00:00', status: 'published' },
];

export default function KnowledgePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ title: '', category: '', status: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingArticle, setEditingArticle] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await request({
        url: '/api/admin/articles',
        method: 'get',
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          title: filters.title,
          category: filters.category,
          status: filters.status,
        },
      });

      if (response.code === 200 && response.data) {
        setArticles(response.data.list || mockArticles);
        setPagination(prev => ({ ...prev, total: response.data.total || mockArticles.length }));
      } else {
        setArticles(mockArticles);
        setPagination(prev => ({ ...prev, total: mockArticles.length }));
      }
    } catch (error) {
      setArticles(mockArticles);
      setPagination(prev => ({ ...prev, total: mockArticles.length }));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingArticle(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    form.setFieldsValue({
      title: article.title,
      category: article.category,
      author: article.author,
      status: article.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await request({
        url: `/api/admin/articles/${id}`,
        method: 'delete',
      });
      message.success('删除成功');
      fetchArticles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleToggleStatus = async (article) => {
    const newStatus = article.status === 'published' ? 'offline' : 'published';
    try {
      await request({
        url: `/api/admin/articles/${article.id}/status`,
        method: 'put',
        data: { status: newStatus },
      });
      message.success(newStatus === 'published' ? '上架成功' : '下架成功');
      fetchArticles();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const articleData = {
          ...values,
          id: editingArticle?.id,
        };

        const apiUrl = editingArticle 
          ? `/api/admin/articles/${editingArticle.id}` 
          : '/api/admin/articles';
        const method = editingArticle ? 'put' : 'post';

        request({ url: apiUrl, method, data: articleData })
          .then(() => {
            message.success(editingArticle ? '编辑成功' : '新增成功');
            setIsModalVisible(false);
            form.resetFields();
            setEditingArticle(null);
            fetchArticles();
          })
          .catch(() => {
            message.error('操作失败');
          });
      })
      .catch(() => {
        message.error('表单验证失败');
      });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    setFilters({ title: '', category: '', status: '' });
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
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增
        </Button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>文章标题</span>
            <Input
              placeholder="请输入文章标题"
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              style={{ width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>分类</span>
            <Select
              placeholder="选择分类"
              value={filters.category || undefined}
              onChange={(value) => handleFilterChange('category', value)}
              options={categories}
              style={{ width: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>状态</span>
            <Select
              placeholder="选择状态"
              value={filters.status || undefined}
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
            <Button onClick={fetchArticles}>查询</Button>
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

      <Modal
        title={editingArticle ? '编辑文章' : '新增文章'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingArticle(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingArticle(null);
          }}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSubmit}>
            {editingArticle ? '保存' : '新增'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="文章标题"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类" options={categories} />
          </Form.Item>
          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input placeholder="请输入作者" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              options={[
                { value: 'published', label: '已发布' },
                { value: 'draft', label: '草稿' },
                { value: 'offline', label: '已下架' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}