'use client';

import { useState, useEffect } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { 
  BarChartOutlined, 
  BookOutlined, 
  MessageSquareOutlined, 
  FileTextOutlined, 
  RobotOutlined, 
  LogoutOutlined,
  UserOutlined,
  MenuOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const menuItems = [
  { key: '/back/dashboard', label: '数据分析', icon: <BarChartOutlined /> },
  { key: '/back/knowledge', label: '知识文章', icon: <BookOutlined /> },
  { key: '/back/consultation', label: '咨询记录', icon: <MessageSquareOutlined /> },
  { key: '/back/mood', label: '情绪日志', icon: <FileTextOutlined /> },
];

export default function BackLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        try {
          setAdmin(JSON.parse(storedAdmin));
        } catch (e) {
          localStorage.removeItem('admin');
          router.push('/back/login');
        }
      } else {
        router.push('/back/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    document.cookie = 'admin=; path=/; max-age=0';
    setAdmin(null);
    router.push('/back/login');
  };

  const adminMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const getSelectedKey = () => {
    if (pathname.startsWith('/back/knowledge')) return '/back/knowledge';
    if (pathname.startsWith('/back/consultation')) return '/back/consultation';
    if (pathname.startsWith('/back/mood')) return '/back/mood';
    return '/back/dashboard';
  };

  if (!admin) {
    return null;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <aside 
        style={{ 
          width: collapsed ? '64px' : '220px', 
          background: '#1e293b', 
          color: '#ffffff', 
          flexShrink: 0,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          transition: 'width 0.3s ease',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RobotOutlined style={{ color: '#ffffff', fontSize: '20px' }} />
            </div>
            {!collapsed && (
              <div>
                <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>心理健康AI助手</h1>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>管理后台</p>
              </div>
            )}
          </div>
        </div>

        <nav style={{ padding: '16px 8px' }}>
          <Menu 
            mode="vertical" 
            items={menuItems}
            selectedKeys={[getSelectedKey()]}
            style={{ 
              background: 'transparent', 
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
            }}
            inlineCollapsed={collapsed}
          />
        </nav>

        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px' }}
          >
            <MenuOutlined />
          </Button>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: collapsed ? '64px' : '220px', transition: 'margin-left 0.3s ease' }}>
        <header style={{ background: '#ffffff', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
            {pathname.startsWith('/back/knowledge') && '知识文章'}
            {pathname.startsWith('/back/consultation') && '咨询记录'}
            {pathname.startsWith('/back/mood') && '情绪日志'}
            {pathname.startsWith('/back/dashboard') && '数据分析'}
          </div>
          
          <Dropdown overlay={adminMenu} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserOutlined style={{ color: '#ffffff', fontSize: '16px' }} />
              </div>
              <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>{admin.username}</span>
            </div>
          </Dropdown>
        </header>

        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}