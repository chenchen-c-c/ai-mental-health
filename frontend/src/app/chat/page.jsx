'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Input, Tag } from 'antd';
import { SendOutlined, MessageOutlined, RobotOutlined, LoadingOutlined, UserOutlined, ClockCircleOutlined, BulbOutlined } from '@ant-design/icons';
import FrontendLayout from '../components/FrontendLayout';

const aiReplies = {
  default: [
    '谢谢你愿意和我分享这些，我在这里认真倾听。你的感受很重要，每一种情绪都值得被看见和理解。',
    '我能感受到你现在的情绪，这是很正常的反应。让我们一起慢慢梳理，找到让你感到舒服的方式。',
    '你不是一个人在面对这些，我会一直陪伴着你。无论什么时候，你都可以来找我倾诉。',
    '我理解你的感受，有时候生活确实会让人感到疲惫和迷茫。但请记住，你已经做得很棒了。',
    '谢谢你的信任，愿意把这些告诉我。你的勇气和坦诚让我很感动，这本身就是一种成长。',
  ],
  sad: [
    '我很抱歉听到你现在感到难过。悲伤是一种正常的情绪，就像下雨一样，总会停的。给自己一些时间和空间去感受它。',
    '难过的时候，不要强迫自己马上好起来。哭泣、倾诉、或者只是静静地待一会儿，都是可以的。我在这里陪着你。',
    '悲伤的背后往往是深深的在意和爱。允许自己感受悲伤，也是一种温柔的自我关怀。',
    '我知道现在很难，但请相信，黑暗总会过去，黎明终会到来。你不是一个人，我在这里。',
  ],
  anxious: [
    '焦虑就像一个警报器，提醒我们有些事情需要关注。让我们一起深呼吸，慢慢放松下来。',
    '我理解你现在感到不安和担忧。试着把注意力集中在当下，感受自己的呼吸，一步一步来。',
    '焦虑的时候，思绪会像脱缰的野马。试着写下那些担心的事情，然后告诉自己："这只是想法，不是事实。"',
    '深呼吸，吸气4秒，屏息2秒，呼气6秒。重复几次，让身体和情绪都慢慢平静下来。',
  ],
  angry: [
    '生气是一种很有力量的情绪，它在告诉我们有些东西需要改变。允许自己感受愤怒，但不要被它控制。',
    '我理解你现在很生气，这种感觉一定很不好受。试着找一个安全的方式释放出来，比如运动、呐喊或者写下来。',
    '愤怒的背后往往是受伤和失望。当你准备好的时候，我们可以一起看看是什么让你感到受伤。',
    '生气的时候，先停下来，做几个深呼吸。告诉自己："我可以选择如何回应。"',
  ],
  happy: [
    '听到你感到开心，我也很为你高兴！快乐是很珍贵的礼物，好好享受当下的美好时刻。',
    '你的快乐感染了我！分享快乐会让快乐加倍，谢谢你让我也感受到这份喜悦。',
    '看到你开心，我真的很欣慰。记住这种感觉，当遇到困难时，它会成为你前行的力量。',
    '快乐是生活给我们的奖励，好好珍惜每一个让你微笑的瞬间。继续保持这份好心情！',
  ],
};

function getReply(userMessage) {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('难过') || lowerMsg.includes('伤心') || lowerMsg.includes('悲伤') || lowerMsg.includes('想哭') || lowerMsg.includes('不开心')) {
    return aiReplies.sad[Math.floor(Math.random() * aiReplies.sad.length)];
  }
  if (lowerMsg.includes('焦虑') || lowerMsg.includes('担心') || lowerMsg.includes('害怕') || lowerMsg.includes('不安') || lowerMsg.includes('紧张')) {
    return aiReplies.anxious[Math.floor(Math.random() * aiReplies.anxious.length)];
  }
  if (lowerMsg.includes('生气') || lowerMsg.includes('愤怒') || lowerMsg.includes('烦') || lowerMsg.includes('讨厌') || lowerMsg.includes('恨')) {
    return aiReplies.angry[Math.floor(Math.random() * aiReplies.angry.length)];
  }
  if (lowerMsg.includes('开心') || lowerMsg.includes('高兴') || lowerMsg.includes('快乐') || lowerMsg.includes('幸福') || lowerMsg.includes('好') && !lowerMsg.includes('不好')) {
    return aiReplies.happy[Math.floor(Math.random() * aiReplies.happy.length)];
  }
  
  return aiReplies.default[Math.floor(Math.random() * aiReplies.default.length)];
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

  const handleSend = () => {
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

    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: getReply(inputValue),
        timestamp: new Date().toLocaleString(),
      };

      setMessages(prev => {
        const newMessages = [...prev, aiMsg];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        return newMessages;
      });

      setSessionHistory(prev => {
        const newSession = {
          id: Date.now(),
          name: 'AI情绪助手',
          time: new Date().toLocaleString(),
          preview: aiMsg.content.length > 30 ? aiMsg.content.substring(0, 30) + '...' : aiMsg.content,
          unread: 0,
        };
        const newHistory = [newSession, ...prev].slice(0, 10);
        localStorage.setItem('chatSessionHistory', JSON.stringify(newHistory));
        return newHistory;
      });

      setLoading(false);
    }, 2000);
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