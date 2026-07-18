'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, message } from 'antd';
import { EyeOutlined, UserOutlined, ClockCircleOutlined, MessageOutlined } from '@ant-design/icons';
import { get } from '../../utils/request';

const emotionTags = [
  { id: 'happy', name: '开心', emoji: '😊', color: '#fbbf24' },
  { id: 'calm', name: '平静', emoji: '', color: '#60a5fa' },
  { id: 'anxious', name: '焦虑', emoji: '😰', color: '#ef4444' },
  { id: 'sad', name: '悲伤', emoji: '😢', color: '#9ca3af' },
  { id: 'excited', name: '兴奋', emoji: '🤩', color: '#22c55e' },
  { id: 'angry', name: '生气', emoji: '', color: '#dc2626' },
  { id: 'neutral', name: '中性', emoji: '😐', color: '#94a3b8' },
];

const getEmotionInfo = (emotionId) => {
  return emotionTags.find(e => e.id === emotionId) || { name: emotionId || 'neutral', emoji: '📝', color: '#94a3b8' };
};

export default function ChatMonitorPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filterValues, setFilterValues] = useState({ userId: '', emotion: '' });
  const [activeFilters, setActiveFilters] = useState({ userId: '', emotion: '' });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [pagination.current, pagination.pageSize, activeFilters]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };
      const res = await get('/chat/sessions', params);
      let list = res.data.list || [];

      // 前端过滤
      if (activeFilters.userId) {
        list = list.filter(s => (s.user_name || '').toLowerCase().includes(activeFilters.userId.toLowerCase()));
      }
      if (activeFilters.emotion) {
        list = list.filter(s => s.emotion === activeFilters.emotion);
      }

      setSessions(list);
      setPagination(prev => ({ ...prev, total: res.data.total || 0 }));
    } catch (err) {
      message.error('获取咨询记录失败');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (session) => {
    setDetailLoading(true);
    setSelectedSession({ ...session, messages: [] });
    setDetailVisible(true);
    try {
      const res = await get(`/chat/sessions/${session.id}`);
      setSelectedSession({
        ...session,
        messages: res.data.messages || [],
        userName: res.data.session?.user_name || session.user_name,
        emotion: res.data.session?.emotion || session.emotion,
        messageCount: res.data.session?.message_count || session.message_count,
        startTime: res.data.session?.created_at || session.startTime,
      });
    } catch (err) {
      message.error('获取会话详情失败');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilterValues({ userId: '', emotion: '' });
    setActiveFilters({ userId: '', emotion: '' });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearch = () => {
    setActiveFilters({ ...filterValues });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: '会话ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      render: (id) => (
        <span style={{ fontSize: '14px', color: '#64748b' }}>{id}</span>
      ),
    },
    {
      title: '用户',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 100,
      align: 'center',
      render: (userName) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <div style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '50%', 
            background: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <UserOutlined style={{ fontSize: '12px', color: '#64748b' }} />
          </div>
          <span style={{ fontSize: '14px', color: '#263238' }}>{userName || '未知用户'}</span>
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
      title: '消息内容',
      dataIndex: 'preview',
      key: 'preview',
      ellipsis: true,
      width: 350,
      render: (preview) => (
        <span style={{ color: '#475569', fontSize: '14px' }}>
          {preview || '无内容'}
        </span>
      ),
    },
    {
      title: '消息数',
      dataIndex: 'message_count',
      key: 'message_count',
      width: 100,
      align: 'center',
      render: (count) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '4px',
          color: '#64748b',
          fontSize: '14px',
        }}>
          <MessageOutlined style={{ fontSize: '12px' }} />
          {count || 0}
        </div>
      ),
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time) => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          color: '#64748b',
          fontSize: '14px',
        }}>
          <ClockCircleOutlined style={{ fontSize: '12px' }} />
          {time}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
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
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#263238' }}>AI咨询记录</h2>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>用户</span>
            <Input
              placeholder="请输入用户名"
              value={filterValues.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              style={{ width: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#546e7a' }}>情绪标签</span>
            <Select
              placeholder="选择情绪"
              value={filterValues.emotion || undefined}
              onChange={(value) => handleFilterChange('emotion', value)}
              options={emotionTags.map(e => ({ value: e.id, label: `${e.emoji} ${e.name}` }))}
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
          dataSource={sessions}
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

      {detailVisible && selectedSession && (
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
            width: '650px',
            maxHeight: '80vh',
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
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#263238' }}>咨询会话详情</h3>
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
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <UserOutlined style={{ fontSize: '14px', color: '#64748b' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#263238' }}>{selectedSession.userName || '未知用户'}</span>
                </div>
                {(() => {
                  const info = getEmotionInfo(selectedSession.emotion);
                  return (
                    <Tag color={info.color}>{info.emoji} {info.name}</Tag>
                  );
                })()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                <span>开始时间：{selectedSession.startTime}</span>
                <span>消息数：{selectedSession.messageCount || 0}</span>
              </div>
              <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>对话记录</div>
                {detailLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>加载中...</div>
                ) : selectedSession.messages?.length > 0 ? (
                  selectedSession.messages.map((msg) => (
                    <div key={msg.id} style={{ display: 'flex', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: msg.type === 'user' ? '#1890ff' : '#fbbf24',
                      }}>
                        {msg.type === 'user' ? (
                          <UserOutlined style={{ color: '#ffffff', fontSize: '16px' }} />
                        ) : (
                          <span style={{ color: '#ffffff', fontSize: '16px' }}>🤖</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: msg.type === 'user' ? '#1890ff' : '#d97706' }}>
                            {msg.type === 'user' ? '用户' : 'AI助手'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{msg.timestamp}</span>
                        </div>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: msg.type === 'user' ? '#e6f7ff' : '#fffbe6',
                          fontSize: '14px',
                          color: '#475569',
                          lineHeight: '1.6',
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>暂无对话记录</div>
                )}
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
