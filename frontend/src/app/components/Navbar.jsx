'use client';

import { useState, useEffect } from 'react';
import { Button, Menu, Dropdown, Drawer } from 'antd';
import { LogoutOutlined, UserOutlined, HomeOutlined, MessageOutlined, BookOutlined, FileTextOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { key: '/', label: <Link href="/">首页</Link>, icon: <HomeOutlined /> },
  { key: '/chat', label: <Link href="/chat">AI情绪倾诉</Link>, icon: <MessageOutlined /> },
  { key: '/journal', label: <Link href="/journal">心情日记</Link>, icon: <BookOutlined /> },
  { key: '/knowledge', label: <Link href="/knowledge">知识库</Link>, icon: <FileTextOutlined /> },
];

export default function Navbar() {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    }
    return null;
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {}, []);

  const getSelectedKey = () => {
    if (pathname.startsWith('/knowledge')) {
      return '/knowledge';
    }
    return pathname;
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      router.push('/');
    }
  };

  const userMenuItems = [
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
              <span className="text-white font-bold text-lg">心</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">心理健康AI助手</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Menu 
              mode="horizontal" 
              items={navItems} 
              selectedKeys={[getSelectedKey()]}
              className="border-none min-w-0"
            />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                placement="bottomRight"
              >
                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
                    <UserOutlined className="text-white" />
                  </div>
                  <span className="hidden sm:inline text-gray-700 font-medium">{user.username}</span>
                </div>
              </Dropdown>
            ) : (
              <>
                <Link href="/login">
                  <Button type="text" className="hidden sm:block text-gray-600 hover:text-blue-500">
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button type="primary" className="hidden sm:block bg-blue-400 hover:bg-blue-500 border-none">
                    注册
                  </Button>
                </Link>
              </>
            )}

            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gray-600"
            />
          </div>
        </div>
      </div>

      <Drawer
        title="心理健康AI助手"
        placement="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className="md:hidden"
      >
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.key}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                getSelectedKey() === item.key
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label.props.children}
              </span>
            </Link>
          ))}

          {!user && (
            <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-center bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </nav>
  );
}