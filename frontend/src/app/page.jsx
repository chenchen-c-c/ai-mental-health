'use client';

import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { MessageOutlined, BookOutlined, HeartOutlined, RobotOutlined } from '@ant-design/icons';
import Link from 'next/link';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500">
      <div className="min-h-screen flex items-center justify-center px-6 py-40">
        <div className="max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            <div className="flex-1 text-center lg:text-left px-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-[120px]">
                一次温暖的对话
              </h1>
              <br></br>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-[120px]">
                <span className="text-yellow-300">化孤独为慰藉</span>
              </h2>
              <br></br>

              <div className="space-y-[40px] mb-[120px]">
                <p className="text-white/80 text-base md:text-lg lg:text-xl leading-loose">
                  每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天。
                </p>
                <br></br>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-[80px]">
                <Link href={user ? '/chat' : '/login'}>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<MessageOutlined />}
                    className="px-8 py-3 bg-white text-teal-600 hover:bg-white/90 border-none rounded font-medium text-base"
                  >
                    {user ? '开始倾诉，获得陪伴' : '开始倾诉'}
                  </Button>
                </Link>
                
                <Link href={user ? '/journal' : '/login'}>
                  <Button 
                    size="large"
                    icon={<BookOutlined />}
                    className="px-8 py-3 bg-transparent text-white hover:bg-white/10 border-2 border-white/50 rounded font-medium text-base"
                  >
                    {user ? '记录心情，释放情感' : '记录心情'}
                  </Button>
                </Link>
              </div>
              <br></br>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <HeartOutlined className="text-yellow-300" />
                <span className="text-white/60 text-sm">
                  {user ? `欢迎回来，${user.username}` : '温暖陪伴，随时在线'}
                </span>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[320px] lg:h-[320px] rounded-full bg-white/10 flex items-center justify-center">
                <RobotOutlined className="text-white text-6xl md:text-7xl lg:text-8xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}