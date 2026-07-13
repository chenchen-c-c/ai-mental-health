'use client';

import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined, RobotOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (values) => {
    setLoading(true);

    setTimeout(() => {
      if (values.username === 'user' && values.password === '123456') {
        const userData = {
          username: values.username,
          role: 'user',
        };
        localStorage.setItem('user', JSON.stringify(userData));
        document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${30 * 24 * 60 * 60}`;
        message.success('登录成功');
        router.push('/');
      } else {
        message.error('账号或密码错误，请使用：user / 123456');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 flex-col items-center justify-center p-12">
        <div className="text-center flex flex-col items-center justify-center flex-1">
          <h1 className="text-4xl font-bold text-white mb-6">心理健康AI助手</h1>
          <p className="text-white/80 text-lg mb-12 leading-relaxed">
            每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天。
          </p>
          <div className="w-40 h-40 rounded-full bg-white/10 flex items-center justify-center">
            <RobotOutlined className="text-white text-6xl" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-teal-600 mb-8">
            <ArrowLeftOutlined />
            返回首页
          </Link>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">登录您的账户</h2>
          <p className="text-gray-500 mb-8">请输入您的登录信息</p>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="请输入用户名"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 text-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 border-none rounded-lg"
              >
                登录账户
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <p className="text-gray-500">
              还没有账户？{' '}
              <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                去注册
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-400 text-sm text-center">
              Mock账号：<span className="text-teal-600 font-medium">user</span> / <span className="text-teal-600 font-medium">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}