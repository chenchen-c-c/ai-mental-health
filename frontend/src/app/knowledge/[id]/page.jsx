'use client';

import { useState, useEffect, use } from 'react';
import { Empty, Button } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import FrontendLayout from '../../components/FrontendLayout';

const mockArticles = [
  {
    id: 1,
    title: '正念练习入门指南：如何在喧嚣中找到内心的平静',
    summary: '正念是一种通过有意识地关注当下而不做评判的方式来培养觉察力的心理练习。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
    category: 'emotion',
    categoryName: '情绪调节',
    publishTime: '2024-01-15',
    views: 1256,
    content: [
      {
        type: 'paragraph',
        text: '正念是一种专注于当下体验的练习方法，能够帮助我们更好地管理情绪和压力。在快节奏的现代生活中，我们常常被各种琐事和杂念所困扰，而正念练习可以帮助我们重新找回内心的平静。',
      },
      {
        type: 'heading',
        text: '什么是正念？',
      },
      {
        type: 'paragraph',
        text: '正念是有意识地、不带评判地关注当下时刻的能力。它起源于古老的佛教修行，但现在已经成为现代心理学和医学中广泛应用的心理干预方法。',
      },
      {
        type: 'paragraph',
        text: '<highlight>正念的核心在于「觉察」</highlight>——觉察自己的思维、情绪和身体感受，而不被它们牵着走。通过持续的练习，我们可以培养出一种更加客观、平静的看待事物的方式。',
      },
      {
        type: 'heading',
        text: '正念的益处',
      },
      {
        type: 'list',
        items: [
          '减少焦虑和抑郁',
          '提高专注力',
          '改善情绪调节',
          '增强自我觉察',
          '提升睡眠质量',
        ],
      },
      {
        type: 'heading',
        text: '基础正念练习',
      },
      {
        type: 'paragraph',
        text: '开始正念练习并不需要特殊的设备或环境，你可以从以下几个简单的练习开始：',
      },
      {
        type: 'subheading',
        text: '1. 呼吸觉察',
      },
      {
        type: 'paragraph',
        text: '找一个安静舒适的地方坐下，闭上眼睛，将注意力集中在呼吸上。感受吸气时腹部的起伏，感受呼气时身体的放松。当思绪飘走时，温柔地将它拉回到呼吸上。',
      },
      {
        type: 'subheading',
        text: '2. 身体扫描',
      },
      {
        type: 'paragraph',
        text: '躺下或坐下，从头部开始，逐步将注意力移动到身体的各个部位。感受每个部位的感觉，注意是否有紧张或不适感，然后有意识地放松这些部位。',
      },
      {
        type: 'subheading',
        text: '3. 日常正念',
      },
      {
        type: 'paragraph',
        text: '在日常生活中保持觉察，比如在吃饭时专注于食物的味道和口感，走路时感受脚与地面的接触，这些都可以成为正念练习的机会。',
      },
      {
        type: 'heading',
        text: '练习建议',
      },
      {
        type: 'paragraph',
        text: '<highlight>坚持是正念练习的关键</highlight>。建议每天练习10-15分钟，可以选择早上起床后或晚上睡觉前进行。刚开始可能会觉得很难集中注意力，这是正常的，重要的是保持耐心和坚持。',
      },
      {
        type: 'paragraph',
        text: '随着练习的深入，你会逐渐发现自己变得更加平静、专注，也更能应对生活中的各种挑战。',
      },
    ],
  },
  {
    id: 2,
    title: '学生心理压力应对策略：轻松应对考试焦虑',
    summary: '学生群体面临着学业、社交等多方面的压力。本文分享了科学有效的压力管理方法。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    category: 'stress',
    categoryName: '压力缓解',
    publishTime: '2024-01-12',
    views: 892,
    content: [
      {
        type: 'paragraph',
        text: '学生时期是人生中充满挑战和机遇的阶段，但同时也伴随着各种压力。考试压力、学业负担、社交关系等都可能对学生的心理健康产生影响。学会科学地应对压力，是每个学生都应该掌握的技能。',
      },
      {
        type: 'heading',
        text: '认识考试焦虑',
      },
      {
        type: 'paragraph',
        text: '考试焦虑是学生中非常普遍的现象。它表现为在考试前或考试过程中出现的紧张、担忧、心跳加速、失眠等症状。适度的焦虑可以帮助我们集中注意力，但过度的焦虑则会影响表现。',
      },
      {
        type: 'heading',
        text: '有效的应对策略',
      },
      {
        type: 'subheading',
        text: '1. 充分准备是基础',
      },
      {
        type: 'paragraph',
        text: '<highlight>充分的准备是减轻考试焦虑最有效的方法</highlight>。制定合理的学习计划，提前复习，避免临时抱佛脚。当你对考试内容充满信心时，焦虑自然会减少。',
      },
      {
        type: 'subheading',
        text: '2. 调整认知方式',
      },
      {
        type: 'paragraph',
        text: '试着用更理性的方式看待考试。一次考试的结果并不能决定你的全部能力，重要的是从中学到的知识和经验。告诉自己：「我已经尽力了，无论结果如何，我都能接受。」',
      },
      {
        type: 'subheading',
        text: '3. 放松训练',
      },
      {
        type: 'paragraph',
        text: '学习一些简单的放松技巧，比如深呼吸、冥想、肌肉放松等。在考试前进行几分钟的放松训练，可以有效缓解紧张情绪。',
      },
      {
        type: 'subheading',
        text: '4. 保持良好的生活习惯',
      },
      {
        type: 'list',
        items: [
          '保证充足的睡眠',
          '合理饮食，避免暴饮暴食',
          '适当进行体育锻炼',
          '保持规律的作息',
        ],
      },
      {
        type: 'heading',
        text: '考试当天的建议',
      },
      {
        type: 'paragraph',
        text: '考试当天提前到达考场，给自己留出足够的准备时间。拿到试卷后，先花几分钟浏览一遍，了解题目的分布和难度，然后按照自己的节奏答题。遇到不会的题目不要慌张，先跳过，最后再回头解决。',
      },
    ],
  },
  {
    id: 3,
    title: '睡眠质量与心理健康：打造完美的睡眠习惯',
    summary: '良好的睡眠是心理健康的基石。本文探讨了睡眠与情绪、压力之间的关系。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    category: 'sleep',
    categoryName: '睡眠改善',
    publishTime: '2024-01-10',
    views: 2103,
    content: [
      {
        type: 'paragraph',
        text: '睡眠是我们每天都需要的基本需求，它对身体恢复、大脑功能和心理健康都至关重要。然而，很多人都面临着睡眠质量不佳的问题。本文将帮助你了解睡眠的重要性，并提供改善睡眠的实用技巧。',
      },
      {
        type: 'heading',
        text: '睡眠与心理健康的关系',
      },
      {
        type: 'paragraph',
        text: '<highlight>睡眠不足会直接影响情绪和心理状态</highlight>。研究表明，长期睡眠不足的人更容易出现焦虑、抑郁、易怒等情绪问题。同时，心理健康问题也可能反过来影响睡眠质量，形成恶性循环。',
      },
      {
        type: 'heading',
        text: '打造完美的睡眠习惯',
      },
      {
        type: 'subheading',
        text: '1. 建立规律的作息',
      },
      {
        type: 'paragraph',
        text: '尽量每天在同一时间上床睡觉，同一时间起床，即使是周末和节假日也要坚持。规律的作息可以帮助身体建立稳定的生物钟，提高睡眠质量。',
      },
      {
        type: 'subheading',
        text: '2. 创建舒适的睡眠环境',
      },
      {
        type: 'list',
        items: [
          '保持卧室安静、黑暗、凉爽',
          '使用舒适的床垫和枕头',
          '避免在床上使用电子设备',
          '保持卧室整洁有序',
        ],
      },
      {
        type: 'subheading',
        text: '3. 睡前放松仪式',
      },
      {
        type: 'paragraph',
        text: '睡前30-60分钟进行一些放松活动，比如阅读一本纸质书、听舒缓的音乐、进行冥想或深呼吸练习。避免在睡前进行剧烈运动或刺激性活动。',
      },
      {
        type: 'subheading',
        text: '4. 注意饮食和运动',
      },
      {
        type: 'paragraph',
        text: '避免在睡前吃大餐、喝咖啡或浓茶、饮酒。适度的体育锻炼可以改善睡眠，但尽量避免在睡前进行。',
      },
    ],
  },
  {
    id: 4,
    title: '情绪调节的五个有效策略：掌控自己的情绪',
    summary: '情绪调节是一项重要的心理技能。本文介绍了深呼吸、认知重构、运动等五种科学有效的方法。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    category: 'emotion',
    categoryName: '情绪调节',
    publishTime: '2024-01-08',
    views: 1567,
    content: [
      {
        type: 'paragraph',
        text: '情绪是我们生活中不可或缺的一部分，它可以给我们带来快乐、激励，也可能带来痛苦、困扰。学会有效地调节情绪，是维护心理健康的重要能力。本文将介绍五种科学有效的情绪调节策略。',
      },
      {
        type: 'heading',
        text: '策略一：深呼吸',
      },
      {
        type: 'paragraph',
        text: '当你感到情绪激动时，<highlight>深呼吸是最简单有效的调节方法</highlight>。通过缓慢、深长的呼吸，可以激活身体的副交感神经系统，帮助身体和情绪恢复平静。',
      },
      {
        type: 'heading',
        text: '策略二：认知重构',
      },
      {
        type: 'paragraph',
        text: '很多时候，影响我们情绪的不是事件本身，而是我们对事件的看法。试着从不同的角度看待问题，挑战不合理的思维模式，用更理性、积极的方式重新解读事件。',
      },
      {
        type: 'heading',
        text: '策略三：运动',
      },
      {
        type: 'paragraph',
        text: '运动是天然的「抗焦虑药」。跑步、游泳、瑜伽等都可以帮助释放身体中的压力激素，同时促进内啡肽的分泌，让你感到愉悦和放松。',
      },
      {
        type: 'heading',
        text: '策略四：表达与倾诉',
      },
      {
        type: 'paragraph',
        text: '不要把情绪憋在心里，找一个信任的朋友或家人倾诉，或者通过写日记的方式表达自己的感受。有时候，仅仅是把问题说出来，就能减轻很多负担。',
      },
      {
        type: 'heading',
        text: '策略五：正念冥想',
      },
      {
        type: 'paragraph',
        text: '通过正念冥想，我们可以学会观察自己的情绪而不被它控制。当情绪出现时，试着像旁观者一样看待它，让它自然地来来去去。',
      },
    ],
  },
  {
    id: 5,
    title: '职场压力管理指南：在工作中保持身心健康',
    summary: '职场压力是现代社会普遍面临的问题。本文提供了从时间管理到心理调适的全面策略。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    category: 'stress',
    categoryName: '压力缓解',
    publishTime: '2024-01-05',
    views: 1342,
    content: [
      {
        type: 'paragraph',
        text: '职场压力是现代社会普遍面临的问题。长时间的工作、复杂的人际关系、职业发展的不确定性等都可能给我们带来压力。学会有效地管理职场压力，对于保持身心健康至关重要。',
      },
      {
        type: 'heading',
        text: '时间管理技巧',
      },
      {
        type: 'paragraph',
        text: '<highlight>合理的时间管理是减轻工作压力的关键</highlight>。制定清晰的工作计划，分清任务的优先级，避免过度承诺。学会说「不」，保护自己的时间和精力。',
      },
      {
        type: 'heading',
        text: '建立工作边界',
      },
      {
        type: 'paragraph',
        text: '尽量保持工作和生活的平衡。设定固定的工作时间，下班后尽量不再处理工作事务。给自己留出足够的休息和娱乐时间，这有助于恢复精力，提高工作效率。',
      },
      {
        type: 'heading',
        text: '沟通技巧',
      },
      {
        type: 'paragraph',
        text: '良好的沟通可以避免很多误解和冲突。与同事和上级保持开放、真诚的沟通，学会表达自己的需求和感受，同时也善于倾听他人的意见。',
      },
    ],
  },
  {
    id: 6,
    title: '自我成长之旅：如何成为更好的自己',
    summary: '自我成长是一生的课题。本文探讨了自我觉察、设定目标、持续学习等方面。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #10b981, #22c55e)',
    category: 'growth',
    categoryName: '自我成长',
    publishTime: '2024-01-02',
    views: 987,
    content: [
      {
        type: 'paragraph',
        text: '自我成长是一生的课题。每个人都有潜力成为更好的自己，关键在于持续地学习、反思和行动。本文将为你提供一份全面的自我成长指南。',
      },
      {
        type: 'heading',
        text: '自我觉察',
      },
      {
        type: 'paragraph',
        text: '<highlight>自我觉察是自我成长的起点</highlight>。了解自己的优点和不足，认识自己的价值观和目标，才能明确前进的方向。',
      },
      {
        type: 'heading',
        text: '设定明确的目标',
      },
      {
        type: 'paragraph',
        text: '设定具体、可衡量、可实现的目标，并制定详细的行动计划。将大目标分解为小步骤，一步步实现。',
      },
      {
        type: 'heading',
        text: '持续学习',
      },
      {
        type: 'paragraph',
        text: '保持好奇心，不断学习新知识、新技能。阅读、学习课程、参加培训、与他人交流，都是很好的学习方式。',
      },
      {
        type: 'heading',
        text: '接受挑战',
      },
      {
        type: 'paragraph',
        text: '成长往往发生在舒适区之外。勇敢地接受新的挑战，即使会遇到困难和挫折，也是宝贵的学习机会。',
      },
    ],
  },
  {
    id: 7,
    title: '深度睡眠的奥秘：让大脑真正得到休息',
    summary: '深度睡眠对于身体恢复和大脑健康至关重要。本文解析了睡眠周期的奥秘。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    category: 'sleep',
    categoryName: '睡眠改善',
    publishTime: '2023-12-28',
    views: 1892,
    content: [
      {
        type: 'paragraph',
        text: '我们每天都在睡觉，但你真的了解睡眠吗？睡眠不仅仅是休息，它对大脑功能、记忆力、情绪调节都有着至关重要的作用。本文将带你了解深度睡眠的奥秘。',
      },
      {
        type: 'heading',
        text: '睡眠周期的结构',
      },
      {
        type: 'paragraph',
        text: '一个完整的睡眠周期大约持续90分钟，包括浅睡眠、深睡眠和快速眼动睡眠三个阶段。每个阶段都有不同的特点和功能。',
      },
      {
        type: 'heading',
        text: '深度睡眠的重要性',
      },
      {
        type: 'paragraph',
        text: '<highlight>深度睡眠是睡眠中最重要的阶段</highlight>。在深度睡眠期间，身体会分泌生长激素，促进身体修复和生长。同时，深度睡眠对于巩固记忆、调节情绪也非常重要。',
      },
      {
        type: 'heading',
        text: '如何提高深度睡眠质量',
      },
      {
        type: 'list',
        items: [
          '保持规律的作息时间',
          '创建黑暗、安静的睡眠环境',
          '避免睡前使用电子设备',
          '适度的体育锻炼',
          '避免睡前摄入咖啡因和酒精',
        ],
      },
    ],
  },
  {
    id: 8,
    title: '积极心理学：培养乐观向上的心态',
    summary: '积极心理学关注人类的积极品质和潜力。本文介绍了积极思考、感恩练习等方法。',
    cover: '',
    coverBg: 'linear-gradient(135deg, #f97316, #fbbf24)',
    category: 'growth',
    categoryName: '自我成长',
    publishTime: '2023-12-25',
    views: 1456,
    content: [
      {
        type: 'paragraph',
        text: '积极心理学是心理学的一个重要分支，它关注人类的积极品质、优势和潜力，而不仅仅是治疗心理问题。通过培养积极的心态，我们可以提高幸福感、增强韧性，更好地应对生活中的挑战。',
      },
      {
        type: 'heading',
        text: '积极思考的力量',
      },
      {
        type: 'paragraph',
        text: '<highlight>积极思考并不是盲目乐观</highlight>，而是一种看待事物的方式。即使在困难面前，也能看到其中的机会和成长的可能。积极思考可以帮助我们减轻压力、提高免疫力、改善人际关系。',
      },
      {
        type: 'heading',
        text: '感恩练习',
      },
      {
        type: 'paragraph',
        text: '每天花几分钟时间思考自己所拥有的，感谢生活中的美好事物。感恩可以帮助我们关注生活中的积极方面，减少抱怨和不满。',
      },
      {
        type: 'heading',
        text: '寻找意义和目标',
      },
      {
        type: 'paragraph',
        text: '拥有明确的人生目标和意义，可以给我们带来方向感和动力。思考什么对自己最重要，追求那些能够让自己感到充实和满足的事情。',
      },
    ],
  },
];

const categoryColors = {
  emotion: { bgColor: '#dbeafe', textColor: '#1d4ed8' },
  stress: { bgColor: '#ccfbf1', textColor: '#0d9488' },
  sleep: { bgColor: '#e0e7ff', textColor: '#4f46e5' },
  growth: { bgColor: '#dcfce7', textColor: '#16a34a' },
};

function renderContent(content) {
  return content.map((item, index) => {
    switch (item.type) {
      case 'heading':
        return (
          <h2 key={index} style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b',
            marginTop: '32px',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #f1f5f9',
          }}>
            {item.text}
          </h2>
        );
      case 'subheading':
        return (
          <h3 key={index} style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#334155',
            marginTop: '24px',
            marginBottom: '8px',
          }}>
            {item.text}
          </h3>
        );
      case 'paragraph':
        return (
          <p key={index} style={{
            color: '#475569',
            lineHeight: '1.8',
            marginBottom: '16px',
            fontSize: '15px',
          }} dangerouslySetInnerHTML={{
            __html: item.text.replace(/<highlight>(.*?)<\/highlight>/g, '<span style="background: #ccfbf1; color: #0d9488; padding: 2px 6px; border-radius: 4px;">$1</span>')
          }} />
        );
      case 'list':
        return (
          <ul key={index} style={{
            listStyle: 'disc',
            listStylePosition: 'inside',
            color: '#475569',
            lineHeight: '1.8',
            marginBottom: '16px',
            paddingLeft: '8px',
          }}>
            {item.items.map((listItem, listIndex) => (
              <li key={listIndex} style={{ marginBottom: '8px', fontSize: '15px' }}>{listItem}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  });
}

export default function KnowledgeDetailPage({ params }) {
  const id = parseInt(use(params).id);
  const [article, setArticle] = useState(null);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const foundArticle = mockArticles.find(a => a.id === id);
    setArticle(foundArticle);

    if (foundArticle) {
      const otherArticles = mockArticles.filter(a => a.id !== id);
      const shuffled = otherArticles.sort(() => Math.random() - 0.5);
      setRecommended(shuffled.slice(0, 3));
    }
  }, [id]);

  if (!article) {
    return (
      <FrontendLayout>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #ecfeff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
          <div style={{ textAlign: 'center' }}>
            <Empty description={<span style={{ color: '#64748b' }}>未找到该文章</span>} />
            <Button
              type="primary"
              style={{
                marginTop: '24px',
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                border: 'none',
              }}
            >
              <Link href="/knowledge">返回知识库</Link>
            </Button>
          </div>
        </div>
      </FrontendLayout>
    );
  }

  const categoryStyle = categoryColors[article.category];

  return (
    <FrontendLayout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #ecfeff 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <Link href="/knowledge" style={{ textDecoration: 'none' }}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                style={{ color: '#475569', fontSize: '14px', padding: '0' }}
              >
                返回知识库
              </Button>
            </Link>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)' }}>
            <div style={{ width: '100%', height: '200px', background: article.coverBg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <BookOutlined style={{ color: 'rgba(255,255,255,0.2)', fontSize: '64px' }} />
              <span style={{
                position: 'absolute',
                bottom: '16px',
                left: '24px',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500',
                background: categoryStyle.bgColor,
                color: categoryStyle.textColor,
              }}>
                {article.categoryName}
              </span>
            </div>

            <div style={{ padding: '32px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
                {article.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13px', color: '#94a3b8', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarOutlined style={{ fontSize: '14px' }} />
                  {article.publishTime}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClockCircleOutlined style={{ fontSize: '14px' }} />
                  {article.views} 阅读
                </span>
              </div>

              <div>
                {renderContent(article.content)}
              </div>
            </div>
          </div>

          {recommended.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <BookOutlined style={{ color: '#14b8a6', fontSize: '20px' }} />
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>推荐阅读</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recommended.map(item => {
                  const recCatStyle = categoryColors[item.category];
                  return (
                    <Link
                      key={item.id}
                      href={`/knowledge/${item.id}`}
                      style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '16px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <div style={{ width: '80px', height: '60px', borderRadius: '10px', background: item.coverBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOutlined style={{ color: 'rgba(255,255,255,0.3)', fontSize: '24px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{item.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#94a3b8' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '8px',
                            background: recCatStyle.bgColor,
                            color: recCatStyle.textColor,
                          }}>
                            {item.categoryName}
                          </span>
                          <span>{item.publishTime}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
}