'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu } from 'antd';
import { 
  BarChartOutlined, 
  BookOutlined, 
  MessageOutlined, 
  FileTextOutlined, 
  RobotOutlined, 
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { key: '/back/dashboard', label: '数据看板', icon: <BarChartOutlined /> },
  { key: '/back/knowledge', label: '知识文章', icon: <BookOutlined /> },
  { key: '/back/mood-logs', label: '用户情绪日志', icon: <FileTextOutlined /> },
  { key: '/back/consultation', label: 'AI咨询记录', icon: <MessageOutlined /> },
];

export default function BackLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
          try {
            const adminData = JSON.parse(storedAdmin);
            if (adminData && adminData.role === 'admin') {
              setAdmin(adminData);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error('Failed to parse admin data:', e);
          }
        }
        localStorage.removeItem('admin');
        window.location.replace('/login');
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    document.cookie = 'admin=; path=/; max-age=0';
    window.location.replace('/login');
  };

  const getSelectedKey = () => {
    if (pathname.startsWith('/back/knowledge')) return '/back/knowledge';
    if (pathname.startsWith('/back/mood-logs')) return '/back/mood-logs';
    if (pathname.startsWith('/back/consultation')) return '/back/consultation';
    return '/back/dashboard';
  };

  const getPageTitle = () => {
    if (pathname.startsWith('/back/knowledge')) return '知识文章';
    if (pathname.startsWith('/back/mood-logs')) return '用户情绪日志';
    if (pathname.startsWith('/back/consultation')) return 'AI咨询记录';
    return '数据看板';
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <div style={{ fontSize: '14px', color: '#64748b' }}>加载中...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>未授权访问，请登录管理员账号</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <aside 
        style={{ 
          width: '220px', 
          background: '#ffffff', 
          flexShrink: 0,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RobotOutlined style={{ color: '#ffffff', fontSize: '18px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>心理健康AI助手</h1>
              <p style={{ fontSize: '10px', color: '#94a3b8' }}>管理后台</p>
            </div>
          </div>
        </div>

        <nav style={{ padding: '16px 0' }}>
          <Menu 
            mode="vertical" 
            items={menuItems}
            selectedKeys={[getSelectedKey()]}
            onClick={(e) => {
              if (e.key) {
                router.push(e.key);
              }
            }}
            style={{ 
              background: 'transparent', 
              border: 'none',
            }}
            theme="light"
          />
        </nav>
      </aside>

      <div style={{ flex: 1, marginLeft: '220px' }}>
        <header style={{ background: '#ffffff', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#263238' }}>
            {getPageTitle()}
          </div>
          
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowMenu(!showMenu)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer', 
                padding: '8px',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#00bcd4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserOutlined style={{ color: '#ffffff', fontSize: '14px' }} />
              </div>
              <span style={{ fontSize: '14px', color: '#546e7a', fontWeight: '500' }}>{admin.username}</span>
            </div>
            
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                minWidth: '160px',
                zIndex: 1000,
                border: '1px solid #f0f0f0',
              }}>
                <div 
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#546e7a',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <LogoutOutlined style={{ fontSize: '14px' }} />
                  <span>退出登录</span>
                </div>
              </div>
            )}
          </div>
        </header>

        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}