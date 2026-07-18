'use client';

import { useState, useEffect } from 'react';
import { Button, Card } from 'antd';
import { MessageOutlined, BookOutlined, HeartOutlined, RobotOutlined, SafetyOutlined, BulbOutlined } from '@ant-design/icons';
import Link from 'next/link';
import FrontendLayout from './components/FrontendLayout';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const features = [
    {
      icon: <RobotOutlined style={{ fontSize: 28, color: '#7c3aed' }} />,
      title: 'AI 情绪陪伴',
      desc: '7×24 小时在线，随时倾听你的心声',
    },
    {
      icon: <BookOutlined style={{ fontSize: 28, color: '#ec4899' }} />,
      title: '心情日记',
      desc: '记录每一天的情绪变化，看见自己的成长',
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 28, color: '#f59e0b' }} />,
      title: '隐私保护',
      desc: '数据加密存储，你的秘密只属于你自己',
    },
  ];

  return (
    <FrontendLayout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f5f3ff 0%, #ede9fe 30%, #fce7f3 70%, #fff1f2 100%)' }}>
        {/* Hero */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 40px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
            {/* Left text */}
            <div style={{ flex: '1 1 420px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 999, padding: '6px 16px', marginBottom: 28, boxShadow: '0 2px 12px rgba(124,58,237,0.08)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>AI 情绪助手在线中</span>
              </div>

              <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#1e1b4b', lineHeight: 1.2, margin: 0, letterSpacing: -1 }}>
                一次温暖的对话
              </h1>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, margin: '12px 0 24px', background: 'linear-gradient(90deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                化孤独为慰藉
              </h2>

              <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.8, maxWidth: 480, margin: '0 0 36px' }}>
                每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天。
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
                <Link href={user ? '/chat' : '/login'} style={{ textDecoration: 'none' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<MessageOutlined />}
                    style={{
                      height: 48,
                      padding: '0 28px',
                      borderRadius: 14,
                      fontSize: 15,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      border: 'none',
                      boxShadow: '0 6px 20px rgba(124,58,237,0.35)',
                    }}
                  >
                    {user ? '开始倾诉，获得陪伴' : '开始倾诉'}
                  </Button>
                </Link>

                <Link href={user ? '/journal' : '/login'} style={{ textDecoration: 'none' }}>
                  <Button
                    size="large"
                    icon={<BookOutlined />}
                    style={{
                      height: 48,
                      padding: '0 28px',
                      borderRadius: 14,
                      fontSize: 15,
                      fontWeight: 600,
                      background: '#fff',
                      color: '#7c3aed',
                      border: '1.5px solid #ddd6fe',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    {user ? '记录心情，释放情感' : '记录心情'}
                  </Button>
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HeartOutlined style={{ color: '#ec4899', fontSize: 14 }} />
                <span style={{ fontSize: 13, color: '#9ca3af' }}>
                  {user ? `欢迎回来，${user.username}` : '温暖陪伴，随时在线'}
                </span>
              </div>
            </div>

            {/* Right illustration */}
            <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 320, height: 320 }}>
                {/* decorative blobs */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.1))', filter: 'blur(2px)' }} />
                <div style={{ position: 'absolute', bottom: -10, left: -10, width: 140, height: 140, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(245,158,11,0.08))', filter: 'blur(2px)' }} />
                {/* main circle */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(124,58,237,0.3)',
                }}>
                  <RobotOutlined style={{ color: '#fff', fontSize: 100 }} />
                </div>
                {/* floating badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 20,
                  right: -10,
                  background: '#fff',
                  borderRadius: 16,
                  padding: '10px 16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <BulbOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>随时倾听</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <Card
                key={i}
                hoverable
                style={{
                  borderRadius: 20,
                  border: '1px solid #f3f0ff',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                }}
                styles={{ body: { padding: '28px 24px' } }}
              >
                <div style={{ marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
}