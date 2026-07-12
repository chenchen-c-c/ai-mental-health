import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientOnly from './components/ClientOnly';
import Navbar from './components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: '心理健康AI助手',
  description: '专业的心理健康AI陪伴，倾听你的心声',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen">
        <ClientOnly>
          <Navbar />
        </ClientOnly>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}