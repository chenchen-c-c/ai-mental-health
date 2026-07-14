'use client';

import { useState, useEffect } from 'react';
import { Button, Modal, Empty, Tag } from 'antd';
import { BookOutlined, EditOutlined, DeleteOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons';
import FrontendLayout from '../components/FrontendLayout';

const emotionTags = [
  { id: 'happy', name: '开心', emoji: '😊', color: '#fbbf24' },
  { id: 'calm', name: '平静', emoji: '😌', color: '#60a5fa' },
  { id: 'anxious', name: '焦虑', emoji: '😰', color: '#ef4444' },
  { id: 'sad', name: '悲伤', emoji: '😢', color: '#9ca3af' },
  { id: 'excited', name: '兴奋', emoji: '🤩', color: '#22c55e' },
  { id: 'tired', name: '疲惫', emoji: '😴', color: '#8b5cf6' },
  { id: 'surprised', name: '惊讶', emoji: '😲', color: '#f97316' },
  { id: 'confused', name: '困惑', emoji: '😕', color: '#1f2937' },
];

const getScoreColor = (score) => {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#fbbf24';
  if (score >= 4) return '#f97316';
  return '#ef4444';
};

const getScoreStars = (score) => {
  return Array.from({ length: 10 }, (_, i) => i < score);
};

export default function JournalPage() {
  const [diaries, setDiaries] = useState([]);
  const [score, setScore] = useState(5);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [content, setContent] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingDiary, setEditingDiary] = useState(null);
  const [deletingDiary, setDeletingDiary] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('journalDiaries');
    if (saved) {
      try {
        setDiaries(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('journalDiaries');
      }
    }
  }, []);

  const saveDiaries = (newDiaries) => {
    setDiaries(newDiaries);
    localStorage.setItem('journalDiaries', JSON.stringify(newDiaries));
  };

  const handleSave = () => {
    if (!selectedEmotion || !content.trim()) return;

    const newDiary = {
      id: Date.now(),
      score,
      emotion: selectedEmotion,
      content: content.trim(),
      createdAt: new Date().toLocaleString(),
    };

    saveDiaries([newDiary, ...diaries]);
    resetForm();
  };

  const resetForm = () => {
    setScore(5);
    setSelectedEmotion('');
    setContent('');
  };

  const handleEdit = (diary) => {
    setEditingDiary(diary);
    setScore(diary.score);
    setSelectedEmotion(diary.emotion);
    setContent(diary.content);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!selectedEmotion || !content.trim() || !editingDiary) return;

    const updatedDiaries = diaries.map(d => 
      d.id === editingDiary.id 
        ? { ...d, score, emotion: selectedEmotion, content: content.trim() }
        : d
    );

    saveDiaries(updatedDiaries);
    setEditModalVisible(false);
    setEditingDiary(null);
    resetForm();
  };

  const handleDelete = (diary) => {
    setDeletingDiary(diary);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (!deletingDiary) return;

    const updatedDiaries = diaries.filter(d => d.id !== deletingDiary.id);
    saveDiaries(updatedDiaries);
    setDeleteModalVisible(false);
    setDeletingDiary(null);
  };

  const getEmotionInfo = (emotionId) => {
    return emotionTags.find(e => e.id === emotionId) || { name: emotionId, emoji: '😐', color: '#6b7280' };
  };

  return (
    <FrontendLayout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #ecfeff 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(34, 197, 94, 0.3)' }}>
              <BookOutlined style={{ color: '#ffffff', fontSize: '32px' }} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>心情日记</h1>
            <p style={{ fontSize: '16px', color: '#64748b' }}>记录每一天的心情变化，发现内心的成长轨迹</p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)', marginBottom: '32px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>今日情绪评分</h2>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>你今天的整体情绪状态如何？(1-10分)</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                {getScoreStars(score).map((filled, index) => (
                  <button
                    key={index}
                    onClick={() => setScore(index + 1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <StarOutlined 
                      style={{ 
                        fontSize: '28px', 
                        color: filled ? getScoreColor(score) : '#e2e8f0',
                        transition: 'color 0.2s ease',
                      }} 
                    />
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: '#e2e8f0',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                <span>低落不悦</span>
                <span style={{ fontWeight: '600', color: getScoreColor(score), fontSize: '16px' }}>{score} 分</span>
                <span>开心愉悦</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>主要情绪</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {emotionTags.map(emotion => (
                  <button
                    key={emotion.id}
                    onClick={() => setSelectedEmotion(emotion.id)}
                    style={{
                      padding: '16px 8px',
                      borderRadius: '16px',
                      border: selectedEmotion === emotion.id ? '2px solid ' + emotion.color : '1px solid #e2e8f0',
                      background: selectedEmotion === emotion.id ? emotion.color + '15' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{emotion.emoji}</div>
                    <div style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{emotion.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>详细记录</h2>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你今天的想法、感受或发生的有趣事情..."
                maxLength={1000}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  color: '#334155',
                  resize: 'vertical',
                  outline: 'none',
                  background: '#f8fafc',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#93c5fd'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
              />
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                {content.length}/1000
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                type="default"
                onClick={resetForm}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '16px',
                  fontSize: '15px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#64748b',
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                disabled={!selectedEmotion || !content.trim()}
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '16px',
                  fontSize: '15px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  color: '#ffffff',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                }}
              >
                保存日记
              </Button>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>历史记录</h2>
            
            {diaries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {diaries.map(diary => {
                  const emotionInfo = getEmotionInfo(diary.emotion);
                  return (
                    <div
                      key={diary.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '32px' }}>{emotionInfo.emoji}</div>
                          <div>
                            <Tag color={emotionInfo.color} style={{ fontSize: '13px', borderRadius: '8px' }}>
                              {emotionInfo.name}
                            </Tag>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                              {getScoreStars(diary.score).slice(0, 5).map((filled, index) => (
                                <StarOutlined 
                                  key={index}
                                  style={{ fontSize: '14px', color: filled ? getScoreColor(diary.score) : '#e2e8f0' }}
                                />
                              ))}
                              <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '8px' }}>{diary.score}分</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(diary)}
                            style={{ color: '#3b82f6', fontSize: '14px' }}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(diary)}
                            style={{ color: '#ef4444', fontSize: '14px' }}
                          />
                        </div>
                      </div>
                      <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
                        {diary.content}
                      </p>
                      <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <HeartOutlined style={{ fontSize: '12px' }} />
                        {diary.createdAt}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '64px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
                <Empty 
                  description={
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>还没有日记记录</p>
                      <p style={{ fontSize: '13px', color: '#94a3b8' }}>写下你的第一篇心情日记，开始记录内心的成长轨迹</p>
                    </div>
                  }
                />
              </div>
            )}
          </div>
        </div>

        <Modal
          title="编辑日记"
          open={editModalVisible}
          onCancel={() => { setEditModalVisible(false); setEditingDiary(null); resetForm(); }}
          footer={[
            <Button key="back" onClick={() => { setEditModalVisible(false); setEditingDiary(null); resetForm(); }}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleSaveEdit} disabled={!selectedEmotion || !content.trim()}>
              保存修改
            </Button>,
          ]}
          centered
          width={600}
        >
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '12px', display: 'block' }}>情绪评分</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {getScoreStars(score).map((filled, index) => (
                <button
                  key={index}
                  onClick={() => setScore(index + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                >
                  <StarOutlined 
                    style={{ fontSize: '24px', color: filled ? getScoreColor(score) : '#e2e8f0' }} 
                  />
                </button>
              ))}
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#e2e8f0', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '12px', display: 'block' }}>主要情绪</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {emotionTags.map(emotion => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  style={{
                    padding: '12px 4px',
                    borderRadius: '12px',
                    border: selectedEmotion === emotion.id ? '2px solid ' + emotion.color : '1px solid #e2e8f0',
                    background: selectedEmotion === emotion.id ? emotion.color + '15' : '#f8fafc',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{emotion.emoji}</div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>{emotion.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '12px', display: 'block' }}>日记内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下你今天的想法、感受..."
              maxLength={1000}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                lineHeight: '1.6',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>
        </Modal>

        <Modal
          title="确认删除"
          open={deleteModalVisible}
          onCancel={() => { setDeleteModalVisible(false); setDeletingDiary(null); }}
          footer={[
            <Button key="back" onClick={() => { setDeleteModalVisible(false); setDeletingDiary(null); }}>
              取消
            </Button>,
            <Button key="submit" type="danger" onClick={confirmDelete}>
              确认删除
            </Button>,
          ]}
          centered
        >
          <p style={{ fontSize: '14px', color: '#64748b' }}>确定要删除这篇日记吗？删除后无法恢复。</p>
        </Modal>
      </div>
    </FrontendLayout>
  );
}