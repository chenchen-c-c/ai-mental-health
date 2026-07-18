'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Input, Tag } from 'antd';
import { SendOutlined, MessageOutlined, RobotOutlined, LoadingOutlined, UserOutlined, ClockCircleOutlined, BulbOutlined } from '@ant-design/icons';
import FrontendLayout from '../components/FrontendLayout';

async function sendMessageToAI(content, sessionId = null) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { success: false, message: '请先登录' };
    }
    
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        session_id: sessionId,
      }),
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      return {
        success: true,
        content: data.data.ai_message.content,
        sessionId: data.data.session.id,
      };
    } else {
      return { success: false, message: data.msg || '发送失败' };
    }
  } catch (error) {
    console.error('AI API error:', error);
    return { success: false, message: '网络错误' };
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedHistory = localStorage.getItem('chatSessionHistory');
    
    let currentMessages = [];
    
    if (savedMessages) {
      try {
        currentMessages = JSON.parse(savedMessages);
        setMessages(currentMessages);
      } catch (e) {
        localStorage.removeItem('chatMessages');
      }
    } else {
      const welcomeMsg = {
        id: Date.now(),
        type: 'ai',
        content: '你好！我是小暖，你的AI情绪助手。很高兴陪伴你，为你提供温暖的心理支持。请告诉我，今天你感觉怎么样？有什么想要分享的吗？',
        timestamp: new Date().toLocaleString(),
      };
      currentMessages = [welcomeMsg];
      setMessages(currentMessages);
      localStorage.setItem('chatMessages', JSON.stringify(currentMessages));
    }

    if (savedHistory) {
      try {
        setSessionHistory(JSON.parse(savedHistory));
      } catch (e) {
        localStorage.removeItem('chatSessionHistory');
      }
    } else if (currentMessages.length > 0) {
      const lastAiMsg = [...currentMessages].reverse().find(msg => msg.type === 'ai');
      if (lastAiMsg) {
        const initialHistory = [{
          id: Date.now(),
          name: 'AI情绪助手',
          time: lastAiMsg.timestamp,
          preview: lastAiMsg.content.length > 30 ? lastAiMsg.content.substring(0, 30) + '...' : lastAiMsg.content,
          unread: 0,
        }];
        setSessionHistory(initialHistory);
        localStorage.setItem('chatSessionHistory', JSON.stringify(initialHistory));
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const [currentSessionId, setCurrentSessionId] = useState(null);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : { username: '匿名用户', role: 'guest' };

    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleString(),
      userId: userData.username || 'guest',
    };

    setMessages(prev => {
      const newMessages = [...prev, userMsg];
      localStorage.setItem('chatMessages', JSON.stringify(newMessages));
      return newMessages;
    });

    setInputValue('');
    setLoading(true);

    const result = await sendMessageToAI(inputValue.trim(), currentSessionId);
    
    if (result.success) {
      setCurrentSessionId(result.sessionId);
      
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: result.content,
        timestamp: new Date().toLocaleString(),
      };

      setMessages(prev => {
        const newMessages = [...prev, aiMsg];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        return newMessages;
      });

      setSessionHistory(prev => {
        const newSession = {
          id: result.sessionId,
          name: 'AI情绪助手',
          time: new Date().toLocaleString(),
          preview: result.content.length > 30 ? result.content.substring(0, 30) + '...' : result.content,
          unread: 0,
        };
        const newHistory = [newSession, ...prev].slice(0, 10);
        localStorage.setItem('chatSessionHistory', JSON.stringify(newHistory));
        return newHistory;
      });
    } else {
      console.error('Send message failed:', result.message);
      
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: '抱歉，我现在无法回应，请稍后再试。',
        timestamp: new Date().toLocaleString(),
      };
      
      setMessages(prev => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('chatSessionHistory');
    setSessionHistory([]);
  };

  return (
    <FrontendLayout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #ecfeff 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 48px', display: 'flex', gap: '24px', height: 'calc(100vh - 80px)' }}>
          <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)' }}>
                  <RobotOutlined style={{ color: '#ffffff', fontSize: '28px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>AI情绪助手</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#10b981' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    在线服务中
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>会话历史</h3>
                {sessionHistory.length > 0 && (
                  <button 
                    style={{ fontSize: '13px', color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={handleClearHistory}
                  >
                    清空
                  </button>
                )}
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {sessionHistory.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sessionHistory.map(session => (
                      <div
                        key={session.id}
                        style={{
                          padding: '16px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: session.unread > 0 ? '#fef3c7' : '#f8fafc',
                          border: '1px solid transparent',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = session.unread > 0 ? '#fef3c7' : '#f8fafc'; e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{session.name}</span>
                          {session.unread > 0 && (
                            <Tag color="orange" style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '10px' }}>
                              {session.unread}
                            </Tag>
                          )}
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {session.preview}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94a3b8' }}>
                          <ClockCircleOutlined style={{ fontSize: '12px' }} />
                          {session.time}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    <p style={{ fontSize: '14px' }}>暂无会话记录</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: '#fffbeb', borderRadius: '20px', padding: '20px', border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BulbOutlined style={{ color: '#f59e0b', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#92400e' }}>给你的小建议</span>
              </div>
              <p style={{ fontSize: '13px', color: '#b45309', lineHeight: '1.5' }}>
                情绪状态平稳，建议保持规律作息，适当进行放松训练。
              </p>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', borderRadius: '20px', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '24px' }}>💛</span>
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>AI情绪助手</h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>您的贴心AI心理健康助手</p>
              </div>
              <button style={{ marginLeft: 'auto', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                +
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)', marginBottom: '20px' }}>
              {messages.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <RobotOutlined style={{ fontSize: '40px', color: '#cbd5e1' }} />
                  </div>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>还没有对话记录</p>
                  <p style={{ fontSize: '13px' }}>点击下方输入框，开始你的倾诉之旅</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                        gap: '16px',
                      }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {msg.type === 'user' ? (
                          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserOutlined style={{ color: '#3b82f6', fontSize: '18px' }} />
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <RobotOutlined style={{ color: '#ffffff', fontSize: '18px' }} />
                          </div>
                        )}
                      </div>
                      <div style={{ maxWidth: '70%' }}>
                        <div
                          style={{
                            padding: '16px 20px',
                            borderRadius: msg.type === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                            background: msg.type === 'user' ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : '#f8fafc',
                            border: msg.type === 'user' ? 'none' : '1px solid #e2e8f0',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            color: '#334155',
                            wordBreak: 'break-word',
                          }}
                        >
                          {msg.content}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <RobotOutlined style={{ color: '#ffffff', fontSize: '18px' }} />
                      </div>
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{ padding: '16px 20px', borderRadius: '4px 20px 20px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <LoadingOutlined style={{ color: '#f97316', fontSize: '18px', animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontSize: '15px', color: '#94a3b8' }}>正在思考...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)', display: 'flex', gap: '16px' }}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您想分享的内容..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', background: '#f8fafc', borderRadius: '16px', padding: '14px 20px' }}
                disabled={loading}
                autoFocus
              />
              <Button
                type="primary"
                onClick={handleSend}
                disabled={!inputValue.trim() || loading}
                icon={<SendOutlined />}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: loading ? '#94a3b8' : 'linear-gradient(135deg, #f97316, #fb923c)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
}