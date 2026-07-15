'use client';

import { useState, useEffect } from 'react';
import { UserOutlined, HeartOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons';
import { request } from '../../utils/request';

const defaultMockData = {
  totalUsers: 2522,
  activeUsers: 268,
  moodDiaries: 3,
  todayDiaries: 2,
  consultations: 21237,
  todayConsultations: 17,
  avgMood: 8,
  moodTrend: [
    { date: '06-23', score: 6.2 },
    { date: '06-24', score: 6.5 },
    { date: '06-25', score: 6.8 },
    { date: '06-26', score: 7.0 },
    { date: '06-27', score: 7.2 },
    { date: '06-28', score: 7.5 },
    { date: '06-29', score: 9.5 },
  ],
  consultationStats: {
    total: 12355,
    avgDuration: 28271.4,
    activeUsers: 268,
  },
  consultationChart: [
    { date: '06-23', count: 2000 },
    { date: '06-26', count: 8000 },
    { date: '06-29', count: 10000 },
    { date: '07-02', count: 6000 },
    { date: '07-05', count: 8000 },
    { date: '07-08', count: 10000 },
    { date: '07-11', count: 9000 },
  ],
  activityTrend: [
    { date: '06-23', active: 150, new: 20, diary: 80, consult: 60 },
    { date: '06-26', active: 180, new: 25, diary: 100, consult: 80 },
    { date: '06-29', active: 220, new: 30, diary: 120, consult: 100 },
    { date: '07-02', active: 240, new: 35, diary: 140, consult: 120 },
    { date: '07-05', active: 260, new: 40, diary: 160, consult: 140 },
    { date: '07-08', active: 280, new: 45, diary: 180, consult: 160 },
    { date: '07-11', active: 300, new: 50, diary: 200, consult: 180 },
    { date: '07-14', active: 320, new: 55, diary: 220, consult: 200 },
  ],
};

function StatCard({ icon: Icon, title, value, subValue, color }) {
  return (
    <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '13px', color: '#757575', marginBottom: '8px' }}>{title}</p>
          <h3 style={{ fontSize: '26px', fontWeight: '600', color: '#212121' }}>{value}</h3>
          {subValue && (
            <p style={{ fontSize: '12px', color: '#9e9e9e', marginTop: '4px' }}>{subValue}</p>
          )}
        </div>
        <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ color: '#ffffff', fontSize: '22px' }} />
        </div>
      </div>
    </div>
  );
}

function LineChart({ data }) {
  const maxScore = 10;
  const minScore = 0;
  const chartHeight = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = '100%';

  const getX = (index, total) => {
    const width = parseInt(chartWidth) || 600;
    return padding.left + (index / (total - 1)) * (width - padding.left - padding.right);
  };

  const getY = (score) => {
    return padding.top + ((maxScore - score) / (maxScore - minScore)) * (chartHeight - padding.top - padding.bottom);
  };

  const points = data.map((item, index) => ({
    x: getX(index, data.length),
    y: getY(item.score),
    date: item.date,
    score: item.score,
  }));

  const linePath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  const yAxis = [0, 2, 4, 6, 8, 10];

  return (
    <div style={{ position: 'relative', height: chartHeight }}>
      <svg width={chartWidth} height={chartHeight}>
        {yAxis.map((val, i) => {
          const y = getY(val);
          return (
            <g key={i}>
              <line 
                x1={padding.left} 
                y1={y} 
                x2="100%" 
                y2={y} 
                stroke="#e0e0e0" 
                strokeWidth="1" 
                strokeDasharray="4,4" 
              />
              <text 
                x={padding.left - 10} 
                y={y + 4} 
                textAnchor="end" 
                style={{ fontSize: '11px', fill: '#9e9e9e' }}
              >
                {val}
              </text>
            </g>
          );
        })}
        
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path d={areaPath} fill="url(#areaGradient)" />
        
        <path 
          d={linePath} 
          fill="none" 
          stroke="#fbbf24" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
            <text 
              x={p.x} 
              y={chartHeight - 10} 
              textAnchor="middle" 
              style={{ fontSize: '11px', fill: '#9e9e9e' }}
            >
              {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BarChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.count));
  const chartHeight = 150;
  const padding = { top: 10, right: 10, bottom: 30, left: 10 };

  return (
    <div style={{ height: chartHeight, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: padding.top, paddingBottom: padding.bottom }}>
      {data.map((item, index) => {
        const height = (item.count / maxValue) * (chartHeight - padding.top - padding.bottom);
        return (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
            <div 
              style={{ 
                width: '40%', 
                height: height,
                minHeight: '10px',
                borderRadius: '4px 4px 0 0',
                background: '#64b5f6',
                transition: 'height 0.3s ease',
              }} 
            />
            <span style={{ fontSize: '10px', color: '#9e9e9e' }}>{item.date}</span>
          </div>
        );
      })}
    </div>
  );
}

function ActivityChart({ data }) {
  const maxVal = Math.max(...data.flatMap(d => [d.active, d.new, d.diary, d.consult]));
  const chartHeight = 80;

  return (
    <div style={{ height: chartHeight, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
      {data.map((item, index) => {
        return (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
            <div style={{ width: '80%', height: chartHeight - 20, display: 'flex', alignItems: 'flex-end', gap: '2px', justifyContent: 'center' }}>
              <div style={{ width: '18%', height: `${(item.active / maxVal) * 100}%`, background: '#64b5f6', borderRadius: '2px' }} />
              <div style={{ width: '18%', height: `${(item.new / maxVal) * 100}%`, background: '#ef5350', borderRadius: '2px' }} />
              <div style={{ width: '18%', height: `${(item.diary / maxVal) * 100}%`, background: '#66bb6a', borderRadius: '2px' }} />
              <div style={{ width: '18%', height: `${(item.consult / maxVal) * 100}%`, background: '#ffa726', borderRadius: '2px' }} />
            </div>
            <span style={{ fontSize: '10px', color: '#9e9e9e' }}>{item.date}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await request({
          url: '/api/dashboard/stats',
          method: 'get',
        });
        
        if (response.code === 200 && response.data && response.data.totalUsers !== undefined) {
          setData(response.data);
        } else {
          setData(defaultMockData);
        }
      } catch (error) {
        setData(defaultMockData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ fontSize: '14px', color: '#9e9e9e' }}>加载数据中...</div>
      </div>
    );
  }

  const stats = data !== null ? data : defaultMockData;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <StatCard 
          icon={UserOutlined} 
          title="总用户数" 
          value={stats.totalUsers.toLocaleString()}
          subValue={`活跃用户: ${stats.activeUsers}`}
          color="#9c27b0"
        />
        <StatCard 
          icon={HeartOutlined} 
          title="情绪日志" 
          value={stats.moodDiaries}
          subValue={`今日新增: ${stats.todayDiaries}`}
          color="#e91e63"
        />
        <StatCard 
          icon={MessageOutlined} 
          title="咨询会话" 
          value={stats.consultations.toLocaleString()}
          subValue={`今日新增: ${stats.todayConsultations}`}
          color="#2196f3"
        />
        <StatCard 
          icon={SmileOutlined} 
          title="平均情绪" 
          value={`${stats.avgMood}/10`}
          subValue="情绪健康指数"
          color="#4caf50"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#212121', marginBottom: '16px' }}>情绪趋势分析</h3>
          <LineChart data={stats.moodTrend} />
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f5f5f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '3px', background: '#fbbf24', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', color: '#757575' }}>平均情绪评分</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#212121', marginBottom: '16px' }}>咨询会话统计</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#757575', marginBottom: '4px' }}>总会话数</p>
              <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#212121' }}>{stats.consultationStats.total.toLocaleString()}</h4>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#757575', marginBottom: '4px' }}>平均时长(秒)</p>
              <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#212121' }}>{stats.consultationStats.avgDuration.toFixed(1)}</h4>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#757575', marginBottom: '4px' }}>活跃用户</p>
              <h4 style={{ fontSize: '22px', fontWeight: '600', color: '#212121' }}>{stats.consultationStats.activeUsers}</h4>
            </div>
          </div>
          <BarChart data={stats.consultationChart} />
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f5f5f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '3px', background: '#64b5f6', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', color: '#757575' }}>会话数量</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', padding: '20px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#212121', marginBottom: '16px' }}>用户活跃度趋势</h3>
        <ActivityChart data={stats.activityTrend} />
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f5f5f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '3px', background: '#64b5f6', borderRadius: '2px' }} />
            <span style={{ fontSize: '12px', color: '#757575' }}>活跃用户</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '3px', background: '#ef5350', borderRadius: '2px' }} />
            <span style={{ fontSize: '12px', color: '#757575' }}>新增用户</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '3px', background: '#66bb6a', borderRadius: '2px' }} />
            <span style={{ fontSize: '12px', color: '#757575' }}>日记用户</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '3px', background: '#ffa726', borderRadius: '2px' }} />
            <span style={{ fontSize: '12px', color: '#757575' }}>咨询用户</span>
          </div>
        </div>
      </div>
    </div>
  );
}