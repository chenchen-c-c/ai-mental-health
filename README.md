# 心理健康AI助手

基于 Next.js + Flask + MySQL 的全栈实训项目，提供 AI 情绪陪伴对话、心情日记管理、心理知识库浏览及管理员数据看板等功能。

## 功能模块

- 用户登录 / 注册（JWT 鉴权）
- AI 情绪对话（接入智谱 AI GLM-4-Flash 大模型）
- 心情日记 CRUD
- 心理知识库浏览
- 管理员数据看板

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16 + React 19 + Ant Design 6 + Tailwind CSS |
| 后端 | Python Flask + Flask-SQLAlchemy + Flask-CORS + PyJWT |
| 数据库 | MySQL（Navicat 17 管理） |
| AI 接口 | 智谱 AI GLM-4-Flash（OpenAI 兼容格式） |

## 本地启动

### 前端

```bash
cd frontend
npm install
npm run dev
```

启动后访问 http://localhost:3000

### 后端

```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```

接口地址 http://127.0.0.1:5000/api

### 数据库

使用 Navicat 17 新建数据库 `mental_health`，字符集选择 `utf8mb4`。后端启动时 SQLAlchemy 会自动建表。数据库连接信息通过 `backend/.env` 文件配置（参考 `config.py` 中的字段）。

## 线上部署

线上部署 URL：http://119.91.201.198/

### 账号说明

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 管理员 | admin | 123456 | 登录后台管理看板（/back/dashboard/） |
| 普通用户 | — | — | 在前台自行注册即可 |

> 管理员账号仅用于项目演示与评审，密码为默认值，实际部署请注意修改。

## 仓库结构

```
ai-mental-health/
├── frontend/          # Next.js 前端源码
├── backend/           # Flask 后端源码
├── screenshots/       # 功能截图
├── api-docs/          # API 接口文档
├── ai-logs/           # AI 对话日志
├── demo-video/        # 演示录屏
└── summary/           # 实训总结文档
```

## 接口规范

所有 API 统一返回 JSON 格式：

```json
{
  "code": 200,
  "data": {},
  "msg": "操作成功"
}
```

| 字段 | 说明 |
|------|------|
| `code` | 状态码，200 为成功，其余为错误码 |
| `data` | 响应数据，失败时为 `null` |
| `msg`  | 提示信息 |
