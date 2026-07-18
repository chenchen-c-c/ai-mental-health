'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, message, Popconfirm } from 'antd';
import { EyeOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import { request } from '../../utils/request';

const emotionTags = [
  { id: 'happy', name: '开心', emoji: '😊', color: '#fbbf24' },
  { id: 'calm', name: '平静', emoji: '😌', color: '#60a5fa' },
  { id: 'anxious', name: '焦虑', emoji: '😰', color: '#ef4444' },
  { id: 'sad', name: '悲伤', emoji: '😢', color: '#9ca3af' },
  { id: 'excited', name: '兴奋', emoji: '🤩', color: '#22c55e' },
  { id: 'tired', name: '疲惫', emoji: '😴', color: '#8b5cf6' },
  { id: 'surprised', name: '惊讶', emoji: '😲', color: '#f97316' },
  { id: 'confused', name: '困惑', emoji: '😕', color: '#1f2937' },
];

const getEmotionInfo = (emotionId) => {
  return emotionTags.find(e => e.id === emotionId) || { name: emotionId, emoji: '📝', color: '#94a3b8' };
};

const getScoreColor = (score) => {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#fbbf24';
  if (score >= 4) return '#f97316';
  return '#ef4444';
};

const getScoreStars = (score) => {
  return Array.from({ length: 10 }, (_, i) => i < score);
};

const mapJournalFromApi = (item) => ({
  id: item.id,
  userId: item.user_id,
  userName: item.user_name,
  score: item.score,
  emotion: item.emotion,
  content: item.content || '',
  createdAt: item.created_at,
});

export default function JournalMonitorPage() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filterValues, setFilterValues] = useState({ userId: '', emotion: '', scoreRange: '' });
  const [activeFilters, setActiveFilters] = useState({ userId: '', emotion: '', scoreRange: '' });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  useEffect(() => {
    fetchDiaries();
  }, [pagination.current, pagination.pageSize, activeFilters]);

  const buildQueryParams = () => {
    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    if (activeFilters.userId) {
      params.user_id = activeFilters.userId;
    }
    if (activeFilters.emotion) {
      params.emotion = activeFilters.emotion;
    }
    if (activeFilters.scoreRange) {
      const [min, max] = activeFilters.scoreRange.split('-').map(Number);
      params.score_min = min;
      params.score_max = max;
    }

    return params;
  };

  const fetchDiaries = async () => {
    setLoading(true);
    try {
      const response = await request({
        url: '/journal/',
        method: 'get',
        params: buildQueryParams(),
      });
      setDiaries((response.data.list || []).map(mapJournalFromApi));
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
      }));
    } catch (error) {
      message.error('加载情绪日志失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (diary) => {
    setSelectedDiary(diary);
    setDetailVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await request({
        url: `/journal/${id}`,
        method: 'delete',
      });
      message.success('删除成功');
      fetchDiaries();
    } catch (error) {
      message.error(error.message || error.msg || '删除失败，请稍后重试');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilterValues({ userId: '', emotion: '', scoreRange: '' });
    setActiveFilters({ userId: '', emotion: '', scoreRange: '' });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearch = () => {
    setActiveFilters({ ...filterValues });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      align: 'center',
      render: (userId) => (
        <span style={{ color: '#64748b', fontSize: '14px' }}>
          用户{userId}
        </span>
      ),
    },
    {
      title: '记录日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '情绪评分',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      align: 'center',
      render: (score) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <span style={{ color: getScoreColor(score), fontWeight: '600' }}>{score}/10</span>
          <div style={{ display: 'flex' }}>
            {getScoreStars(score).map((filled, idx) => (
              <StarOutlined 
                key={idx} 
                style={{ 
                  fontSize: '12px', 
                  color: filled ? '#fbbf24' : '#e2e8f0' 
                }} 
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '情绪标签',
      dataIndex: 'emotion',
      key: 'emotion',
      width: 120,
      align: 'center',
      render: (emotion) => {
        const info = getEmotionInfo(emotion);
        return (
          <Tag color={info.color}>
            {info.emoji} {info.name}
          </Tag>
        );
      },
    },
    {
      title: '日记内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 300,
      render: (content) => (
        <span style={{ color: '#475569', fontSize: '14px' }}>
          {content || '无内容'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => handleViewDetail(record)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1890ff',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <EyeOutlined />
            详情
          </button>
          <Popconfirm
            title="确定要删除这篇日记吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#ff4d4f',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <DeleteOutlined />
              删除
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#263238' }}>用户情绪日志</h2>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>用户ID</span>
            <Input
              placeholder="请输入用户ID"
              value={filterValues.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              style={{ width: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>情绪类型</span>
            <Select
              placeholder="选择情绪"
              value={filterValues.emotion || undefined}
              onChange={(value) => handleFilterChange('emotion', value)}
              options={emotionTags.map(e => ({ value: e.id, label: `${e.emoji} ${e.name}` }))}
              style={{ width: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>评分范围</span>
            <Select
              placeholder="选择评分范围"
              value={filterValues.scoreRange || undefined}
              onChange={(value) => handleFilterChange('scoreRange', value)}
              options={[
                { value: '1-4', label: '1-4分' },
                { value: '5-6', label: '5-6分' },
                { value: '7-10', label: '7-10分' },
              ]}
              style={{ width: '120px' }}
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
          dataSource={diaries}
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
          scroll={{ x: 1200 }}
        />
      </div>

      {detailVisible && selectedDiary && (
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
            width: '500px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#263238' }}>日记详情</h3>
              <button
                onClick={() => setDetailVisible(false)}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>用户ID</span>
                <span style={{ fontSize: '14px', color: '#263238', fontWeight: '500' }}>用户{selectedDiary.userId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>记录时间</span>
                <span style={{ fontSize: '14px', color: '#263238' }}>{selectedDiary.createdAt}</span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '8px' }}>情绪评分</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: getScoreColor(selectedDiary.score), fontWeight: '600', fontSize: '16px' }}>
                    {selectedDiary.score}/10
                  </span>
                  <div style={{ display: 'flex' }}>
                    {getScoreStars(selectedDiary.score).map((filled, idx) => (
                      <StarOutlined 
                        key={idx} 
                        style={{ 
                          fontSize: '14px', 
                          color: filled ? '#fbbf24' : '#e2e8f0' 
                        }} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '8px' }}>情绪标签</span>
                {(() => {
                  const info = getEmotionInfo(selectedDiary.emotion);
                  return (
                    <Tag color={info.color} style={{ fontSize: '14px', padding: '6px 12px' }}>
                      {info.emoji} {info.name}
                    </Tag>
                  );
                })()}
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#64748b', display: 'block', marginBottom: '8px' }}>日记内容</span>
                <div style={{
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  minHeight: '80px',
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.6',
                }}>
                  {selectedDiary.content || '无内容'}
                </div>
              </div>
            </div>
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={() => setDetailVisible(false)}
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
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}