'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, message } from 'antd';
import { EyeOutlined, UserOutlined, ClockCircleOutlined, MessageOutlined } from '@ant-design/icons';

const emotionTags = [
  { id: 'happy', name: '开心', emoji: '😊', color: '#fbbf24' },
  { id: 'calm', name: '平静', emoji: '😌', color: '#60a5fa' },
  { id: 'anxious', name: '焦虑', emoji: '😰', color: '#ef4444' },
  { id: 'sad', name: '悲伤', emoji: '😢', color: '#9ca3af' },
  { id: 'excited', name: '兴奋', emoji: '🤩', color: '#22c55e' },
  { id: 'angry', name: '生气', emoji: '😠', color: '#dc2626' },
  { id: 'neutral', name: '中性', emoji: '😐', color: '#94a3b8' },
];

const getEmotionInfo = (emotionId) => {
  return emotionTags.find(e => e.id === emotionId) || { name: emotionId, emoji: '📝', color: '#94a3b8' };
};

const getEmotionFromMessage = (content) => {
  const lowerMsg = content.toLowerCase();
  if (lowerMsg.includes('难过') || lowerMsg.includes('伤心') || lowerMsg.includes('悲伤') || lowerMsg.includes('想哭') || lowerMsg.includes('不开心')) {
    return 'sad';
  }
  if (lowerMsg.includes('焦虑') || lowerMsg.includes('担心') || lowerMsg.includes('害怕') || lowerMsg.includes('不安') || lowerMsg.includes('紧张')) {
    return 'anxious';
  }
  if (lowerMsg.includes('生气') || lowerMsg.includes('愤怒') || lowerMsg.includes('烦') || lowerMsg.includes('讨厌') || lowerMsg.includes('恨')) {
    return 'angry';
  }
  if (lowerMsg.includes('开心') || lowerMsg.includes('高兴') || lowerMsg.includes('快乐') || lowerMsg.includes('幸福') || lowerMsg.includes('好') && !lowerMsg.includes('不好')) {
    return 'happy';
  }
  return 'neutral';
};

const getSessionsFromStorage = () => {
  const storedMessages = localStorage.getItem('chatMessages');
  
  if (!storedMessages) {
    return [];
  }
  
  try {
    const messages = JSON.parse(storedMessages);
    
    const userMessages = messages.filter(msg => msg.type === 'user');
    if (userMessages.length === 0) {
      return [];
    }
    
    const sessions = [];
    userMessages.forEach((userMsg, index) => {
      const nextAiMsg = messages.find(m => m.id > userMsg.id && m.type === 'ai');
      const emotion = getEmotionFromMessage(userMsg.content);
      const userName = userMsg.userId || '匿名用户';
      
      sessions.push({
        id: index + 1,
        userId: userName,
        userName: userName,
        emotion: emotion,
        startTime: userMsg.timestamp,
        messageCount: nextAiMsg ? 2 : 1,
        preview: userMsg.content.length > 50 ? userMsg.content.substring(0, 50) + '...' : userMsg.content,
        messages: nextAiMsg ? [userMsg, nextAiMsg] : [userMsg],
      });
    });
    
    return sessions.reverse();
  } catch (e) {
    return [];
  }
};

export default function ChatMonitorPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filterValues, setFilterValues] = useState({ userId: '', emotion: '' });
  const [activeFilters, setActiveFilters] = useState({ userId: '', emotion: '' });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [pagination.current, pagination.pageSize, activeFilters]);

  const fetchSessions = () => {
    setLoading(true);
    const allSessions = getSessionsFromStorage();
    setSessions(allSessions);
    setPagination(prev => ({ ...prev, total: allSessions.length }));
    setLoading(false);
  };

  const filterSessions = () => {
    let result = getSessionsFromStorage();
    
    if (activeFilters.userId) {
      result = result.filter(s => s.userName.toLowerCase().includes(activeFilters.userId.toLowerCase()));
    }
    if (activeFilters.emotion) {
      result = result.filter(s => s.emotion === activeFilters.emotion);
    }

    setPagination(prev => ({ ...prev, total: result.length }));
    
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    setSessions(result.slice(start, end));
  };

  const handleViewDetail = (session) => {
    setSelectedSession(session);
    setDetailVisible(true);
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
      dataIndex: 'userName',
      key: 'userName',
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
          <span style={{ fontSize: '14px', color: '#263238' }}>{userName}</span>
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
      dataIndex: 'messageCount',
      key: 'messageCount',
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
          {count}
        </div>
      ),
    },
    {
      title: '时间',
      dataIndex: 'startTime',
      key: 'startTime',
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
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#263238' }}>{selectedSession.userName}</span>
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
                <span>消息数：{selectedSession.messageCount}</span>
              </div>
              <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>对话记录</div>
                {selectedSession.messages?.map((msg) => (
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
                ))}
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