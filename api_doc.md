# 心理健康AI助手 — API 接口文档

> 基础地址：`http://127.0.0.1:5000/api`
> 统一返回格式：`{ "code": 200, "data": {}, "msg": "操作成功" }`
> 鉴权方式：请求头携带 `Authorization: Bearer <token>`

---

## 通用说明

### 返回结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | int | 状态码，200 为成功，400/401/403/404/500 为错误 |
| `data` | object / array / null | 响应数据，失败时为 `null` |
| `msg` | string | 提示信息 |

### 鉴权说明

| 级别 | 说明 |
|------|------|
| 公开 | 无需登录即可访问 |
| 登录 | 需携带有效 Token（`role=0` 或 `role=1`） |
| 管理员 | 需携带有效 Token 且 `role=1` |

---

## 1. 认证模块 `/api/auth`

### 1.1 用户注册

| 项目 | 说明 |
|------|------|
| 地址 | `POST /api/auth/register` |
| 鉴权 | 公开 |

**请求体 (JSON)**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名，唯一 |
| `password` | string | 是 | 密码 |
| `confirm_password` | string | 是 | 确认密码，需与 password 一致 |
| `email` | string | 否 | 邮箱，唯一 |
| `nickname` | string | 否 | 昵称 |
| `phone` | string | 否 | 手机号 |

**返回示例**

```json
{
  "code": 200,
  "data": { "username": "zhangsan" },
  "msg": "注册成功"
}
```

---

### 1.2 用户登录

| 项目 | 说明 |
|------|------|
| 地址 | `POST /api/auth/login` |
| 鉴权 | 公开 |

**请求体 (JSON)**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "zhangsan",
      "email": "zhang@example.com",
      "nickname": "张三",
      "role": 0
    }
  },
  "msg": "登录成功"
}
```

---

### 1.3 获取当前用户信息

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/auth/info` |
| 鉴权 | 登录 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "zhangsan",
    "email": "zhang@example.com",
    "role": 0,
    "nickname": "张三",
    "phone": "13800138000",
    "created_at": "2025-01-01 12:00:00",
    "updated_at": "2025-01-01 12:00:00"
  },
  "msg": "操作成功"
}
```

---

## 2. 心情日记模块 `/api/journal`

### 2.1 查询日记列表

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/journal/` |
| 鉴权 | 登录 |

**Query 参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | int | 否 | 页码，默认 1 |
| `per_page` | int | 否 | 每页条数，默认 10 |
| `user_id` | int | 否 | 按用户筛选（仅管理员可用） |
| `emotion` | string | 否 | 按情绪标签筛选，如 `happy`、`sad` |
| `score_min` | int | 否 | 最低情绪分数 |
| `score_max` | int | 否 | 最高情绪分数 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "user_id": 1,
        "user_name": "zhangsan",
        "score": 7,
        "emotion": "happy",
        "trigger": "完成了一个重要项目",
        "content": "今天心情不错...",
        "sleep": "良好",
        "pressure": "一般",
        "created_at": "2025-07-18 10:00:00",
        "updated_at": "2025-07-18 10:00:00"
      }
    ],
    "total": 20,
    "page": 1,
    "per_page": 10,
    "pages": 2
  },
  "msg": "操作成功"
}
```

---

### 2.2 查询单篇日记

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/journal/<id>` |
| 鉴权 | 登录（仅本人或管理员可查看） |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "user_id": 1,
    "user_name": "zhangsan",
    "score": 7,
    "emotion": "happy",
    "trigger": "完成了一个重要项目",
    "content": "今天心情不错...",
    "sleep": "良好",
    "pressure": "一般",
    "created_at": "2025-07-18 10:00:00",
    "updated_at": "2025-07-18 10:00:00"
  },
  "msg": "操作成功"
}
```

---

### 2.3 新增日记

| 项目 | 说明 |
|------|------|
| 地址 | `POST /api/journal/` |
| 鉴权 | 登录 |

**请求体 (JSON)**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `score` | int | 是 | 情绪分数，1-10 |
| `emotion` | string | 是 | 情绪标签，如 `happy`、`sad`、`anxious`、`angry`、`neutral` |
| `content` | string | 否 | 感想内容 |

> 注：模型中还有 `trigger`（触发因素）、`sleep`（睡眠情况）、`pressure`（压力程度）字段，当前创建接口暂未开放写入，后续版本会补充。

**返回示例**

```json
{
  "code": 200,
  "data": {
    "id": 2,
    "user_id": 1,
    "user_name": "zhangsan",
    "score": 8,
    "emotion": "happy",
    "trigger": null,
    "content": "今天天气很好",
    "sleep": null,
    "pressure": null,
    "created_at": "2025-07-18 14:00:00",
    "updated_at": "2025-07-18 14:00:00"
  },
  "msg": "日记创建成功"
}
```

---

### 2.4 编辑日记

| 项目 | 说明 |
|------|------|
| 地址 | `PUT /api/journal/<id>` |
| 鉴权 | 登录（仅本人或管理员可修改） |

**请求体 (JSON)** — 所有字段可选，传什么改什么

| 字段 | 类型 | 说明 |
|------|------|------|
| `score` | int | 情绪分数 |
| `emotion` | string | 情绪标签 |
| `content` | string | 感想内容 |

> 注：`trigger`、`sleep`、`pressure` 字段当前编辑接口暂未开放修改，后续版本会补充。

**返回示例**

```json
{
  "code": 200,
  "data": { "id": 1, "score": 9, "emotion": "happy", "..." : "..." },
  "msg": "日记更新成功"
}
```

---

### 2.5 删除日记

| 项目 | 说明 |
|------|------|
| 地址 | `DELETE /api/journal/<id>` |
| 鉴权 | 登录（仅本人或管理员可删除） |

**返回示例**

```json
{
  "code": 200,
  "data": null,
  "msg": "日记删除成功"
}
```

---

## 3. AI 对话模块 `/api/chat`

### 3.1 获取会话列表

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/chat/sessions` |
| 鉴权 | 登录 |

**Query 参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | int | 否 | 页码，默认 1 |
| `per_page` | int | 否 | 每页条数，默认 10 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "user_id": 1,
        "user_name": "zhangsan",
        "emotion": "sad",
        "preview": "最近工作压力好大...",
        "message_count": 6,
        "created_at": "2025-07-18 10:00:00",
        "updated_at": "2025-07-18 10:30:00"
      }
    ],
    "total": 5,
    "page": 1,
    "per_page": 10,
    "pages": 1
  },
  "msg": "操作成功"
}
```

---

### 3.2 获取会话详情（含消息列表）

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/chat/sessions/<id>` |
| 鉴权 | 登录（仅本人或管理员可查看） |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "session": {
      "id": 1,
      "user_id": 1,
      "user_name": "zhangsan",
      "emotion": "sad",
      "preview": "最近工作压力好大...",
      "message_count": 6,
      "created_at": "2025-07-18 10:00:00",
      "updated_at": "2025-07-18 10:30:00"
    },
    "messages": [
      {
        "id": 1,
        "session_id": 1,
        "user_id": 1,
        "user_name": "zhangsan",
        "type": "user",
        "content": "最近工作压力好大",
        "timestamp": "2025-07-18 10:00:00"
      },
      {
        "id": 2,
        "session_id": 1,
        "user_id": 1,
        "user_name": "zhangsan",
        "type": "ai",
        "content": "感受到你的压力了，能具体说说是什么让你感到压力吗？",
        "timestamp": "2025-07-18 10:00:02"
      }
    ]
  },
  "msg": "操作成功"
}
```

---

### 3.3 发送消息

| 项目 | 说明 |
|------|------|
| 地址 | `POST /api/chat/send` |
| 鉴权 | 登录 |

**请求体 (JSON)**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` | string | 是 | 消息内容 |
| `session_id` | int | 否 | 会话 ID，不传则自动创建新会话 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "session": {
      "id": 1,
      "user_id": 1,
      "user_name": "zhangsan",
      "emotion": "sad",
      "preview": "最近工作压力好大...",
      "message_count": 6,
      "created_at": "2025-07-18 10:00:00",
      "updated_at": "2025-07-18 10:30:00"
    },
    "user_message": {
      "id": 7,
      "session_id": 1,
      "user_id": 1,
      "user_name": "zhangsan",
      "type": "user",
      "content": "项目deadline快到了",
      "timestamp": "2025-07-18 10:30:00"
    },
    "ai_message": {
      "id": 8,
      "session_id": 1,
      "user_id": 1,
      "user_name": "zhangsan",
      "type": "ai",
      "content": "deadline 临近确实容易让人焦虑。你可以试着把任务拆解成小步骤...",
      "timestamp": "2025-07-18 10:30:02"
    }
  },
  "msg": "消息发送成功"
}
```

---

### 3.4 删除会话

| 项目 | 说明 |
|------|------|
| 地址 | `DELETE /api/chat/sessions/<id>` |
| 鉴权 | 登录（仅本人或管理员可删除） |

**返回示例**

```json
{
  "code": 200,
  "data": null,
  "msg": "会话删除成功"
}
```

---

## 4. 知识库模块 `/api/knowledge`

### 4.1 获取分类列表

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/knowledge/categories` |
| 鉴权 | 公开 |

**返回示例**

```json
{
  "code": 200,
  "data": [
    { "id": 1, "name": "情绪管理", "description": null, "color": "#fbbf24", "created_at": "2025-01-01 00:00:00" },
    { "id": 2, "name": "压力缓解", "description": null, "color": "#ef4444", "created_at": "2025-01-01 00:00:00" }
  ],
  "msg": "操作成功"
}
```

---

### 4.2 新增分类

| 项目 | 说明 |
|------|------|
| 地址 | `POST /api/knowledge/categories` |
| 鉴权 | 管理员 |

**请求体 (JSON)**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 分类名称，唯一 |
| `description` | string | 否 | 分类描述 |
| `color` | string | 否 | 分类颜色（十六进制） |

**返回示例**

```json
{
  "code": 200,
  "data": { "id": 5, "name": "自我成长", "description": "...", "color": "#22c55e", "created_at": "..." },
  "msg": "分类创建成功"
}
```

---

### 4.3 获取文章列表

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/knowledge/articles` |
| 鉴权 | 公开 |

**Query 参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | int | 否 | 页码，默认 1 |
| `per_page` | int | 否 | 每页条数，默认 10 |
| `keyword` | string | 否 | 搜索关键词（匹配标题和摘要） |
| `category_id` | int | 否 | 按分类筛选 |
| `status` | string | 否 | 按状态筛选：`draft` / `published` |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "title": "如何识别和管理焦虑情绪",
        "category_id": 1,
        "category_name": "情绪管理",
        "cover": null,
        "content": "焦虑是一种常见的情绪反应...",
        "views": 128,
        "author": "系统管理员",
        "summary": "了解焦虑的成因与应对方法",
        "tags": "焦虑,情绪",
        "status": "published",
        "created_at": "2025-07-01 10:00:00",
        "updated_at": "2025-07-01 10:00:00"
      }
    ],
    "total": 15,
    "page": 1,
    "per_page": 10,
    "pages": 2
  },
  "msg": "操作成功"
}
```

---

### 4.4 获取文章详情

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/knowledge/articles/<id>` |
| 鉴权 | 公开（未发布文章需携带有效 Token） |

> 访问详情时 `views` 字段会自动 +1。未发布（`draft`）的文章需携带有效 Token 才能访问（任意登录用户即可，不要求管理员）。

**返回示例**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "如何识别和管理焦虑情绪",
    "category_id": 1,
    "category_name": "情绪管理",
    "cover": null,
    "content": "焦虑是一种常见的情绪反应...",
    "views": 129,
    "author": "系统管理员",
    "summary": "了解焦虑的成因与应对方法",
    "tags": "焦虑,情绪",
    "status": "published",
    "created_at": "2025-07-01 10:00:00",
    "updated_at": "2025-07-01 10:00:00"
  },
  "msg": "操作成功"
}
```

---

### 4.5 新增文章

| 项目 | 说明 |
|------|------|
| 地址 | `POST /api/knowledge/articles` |
| 鉴权 | 管理员 |

**请求体 (JSON)**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 文章标题 |
| `category_id` | int | 否 | 分类 ID |
| `author` | string | 否 | 作者，默认"系统管理员" |
| `summary` | string | 否 | 文章摘要 |
| `tags` | string | 否 | 标签，逗号分隔 |
| `cover` | string | 否 | 封面图片 URL |
| `content` | string | 否 | 正文内容 |
| `status` | string | 否 | 状态，`draft`（默认）或 `published` |

**返回示例**

```json
{
  "code": 200,
  "data": { "id": 2, "title": "...", "status": "draft", "..." : "..." },
  "msg": "文章创建成功"
}
```

---

### 4.6 编辑文章

| 项目 | 说明 |
|------|------|
| 地址 | `PUT /api/knowledge/articles/<id>` |
| 鉴权 | 管理员 |

**请求体 (JSON)** — 所有字段可选，传什么改什么，字段同"新增文章"。

**返回示例**

```json
{
  "code": 200,
  "data": { "id": 1, "title": "更新后的标题", "status": "published", "..." : "..." },
  "msg": "文章更新成功"
}
```

---

### 4.7 删除文章

| 项目 | 说明 |
|------|------|
| 地址 | `DELETE /api/knowledge/articles/<id>` |
| 鉴权 | 管理员 |

**返回示例**

```json
{
  "code": 200,
  "data": null,
  "msg": "文章删除成功"
}
```

---

## 5. 管理员看板模块 `/api/dashboard`

> 以下接口均需管理员权限（`role=1`）。

### 5.1 总览统计

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/dashboard/total` |
| 鉴权 | 管理员 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "total_users": 120,
    "total_journals": 580,
    "total_consultations": 340,
    "avg_mood_score": 6.8
  },
  "msg": "操作成功"
}
```

---

### 5.2 近 7 天情绪趋势

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/dashboard/mood-trend` |
| 鉴权 | 管理员 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "data": [
      { "date": "07-12", "score": 6.5 },
      { "date": "07-13", "score": 7.0 },
      { "date": "07-14", "score": 6.2 },
      { "date": "07-15", "score": 7.3 },
      { "date": "07-16", "score": 6.8 },
      { "date": "07-17", "score": 7.1 },
      { "date": "07-18", "score": 6.9 }
    ]
  },
  "msg": "操作成功"
}
```

---

### 5.3 近 7 天对话统计

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/dashboard/chat-stat` |
| 鉴权 | 管理员 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "data": [
      { "date": "07-12", "count": 15 },
      { "date": "07-13", "count": 22 },
      { "date": "07-14", "count": 18 },
      { "date": "07-15", "count": 30 },
      { "date": "07-16", "count": 25 },
      { "date": "07-17", "count": 20 },
      { "date": "07-18", "count": 12 }
    ]
  },
  "msg": "操作成功"
}
```

---

### 5.4 近 7 天用户活跃

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/dashboard/user-active` |
| 鉴权 | 管理员 |

**返回示例**

```json
{
  "code": 200,
  "data": {
    "data": [
      { "date": "07-12", "active": 35, "new": 5, "diary": 18, "consult": 12 },
      { "date": "07-13", "active": 42, "new": 8, "diary": 20, "consult": 14 },
      { "date": "07-14", "active": 30, "new": 3, "diary": 15, "consult": 12 }
    ]
  },
  "msg": "操作成功"
}
```

> `active` = 新用户 + 日记数 + 对话数（当日活跃总量）

---

### 5.5 综合看板数据

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/dashboard/stats` |
| 鉴权 | 管理员 |

> 此接口为前端看板页面提供一站式数据，包含总量、趋势、图表等全部字段。

**返回示例**

```json
{
  "code": 200,
  "data": {
    "totalUsers": 120,
    "activeUsers": 45,
    "moodDiaries": 580,
    "todayDiaries": 12,
    "consultations": 340,
    "todayConsultations": 8,
    "avgMood": 6.8,
    "moodTrend": [
      { "date": "07-12", "score": 6.5 },
      { "date": "07-13", "score": 7.0 }
    ],
    "consultationStats": {
      "total": 142,
      "avgDuration": 0,
      "activeUsers": 45
    },
    "consultationChart": [
      { "date": "07-12", "count": 15 },
      { "date": "07-13", "count": 22 }
    ],
    "activityTrend": [
      { "date": "07-12", "active": 35, "new": 5, "diary": 18, "consult": 12 }
    ]
  },
  "msg": "操作成功"
}
```

---

## 附录

### 错误码一览

| code | 含义 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录 / Token 过期 / 权限不足 |
| 403 | 无权操作该资源 |
| 404 | 资源不存在 / 接口不存在 |
| 500 | 服务器内部错误 |

### 情绪标签枚举

| 标签 | 含义 |
|------|------|
| `happy` | 开心 |
| `sad` | 难过 |
| `anxious` | 焦虑 |
| `angry` | 愤怒 |
| `neutral` | 平静 |

### 健康检查

| 项目 | 说明 |
|------|------|
| 地址 | `GET /api/health` |
| 鉴权 | 公开 |
| 返回 | `{ "code": 200, "data": "OK", "msg": "健康检查通过" }` |
