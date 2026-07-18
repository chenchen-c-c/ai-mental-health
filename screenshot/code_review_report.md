# ai-mental-health Code Review 报告

> 审查范围：前端 Next.js + 后端 Flask + MySQL 全量源码  
> 审查日期：2026-07-18

---

## 一、安全漏洞

### 1.1 密码使用 SHA256 无盐哈希（严重）

- **文件**：`backend/routes/auth.py`
- **问题**：密码直接用 `hashlib.sha256(password.encode()).hexdigest()` 哈希，没有加盐。相同密码产生相同哈希，容易被彩虹表破解。
- **建议**：改用 `werkzeug.security.generate_password_hash` / `check_password_hash`，自动加盐且算法更安全。

### 1.2 CORS 配置为 `origins: '*'`（严重）

- **文件**：`backend/app.py`
- **问题**：允许任意域名跨域访问 API，存在被恶意网站利用的风险。
- **建议**：生产环境限定为实际前端域名，如 `origins=['http://localhost:3000']`。

### 1.3 JWT 密钥和数据库密码硬编码（严重）

- **文件**：`backend/config.py`
- **问题**：`SECRET_KEY`、`JWT_SECRET_KEY`、数据库密码硬编码在源码中，源码泄露则 token 可被伪造。
- **建议**：通过环境变量或 `.env` 文件加载敏感配置。

### 1.4 AI_API_KEY 明文打印到日志

- **文件**：`backend/app.py`
- **问题**：启动时 `print(f'AI_API_KEY: ...')` 将密钥输出到控制台，可能被日志系统保存。
- **建议**：改为仅打印 `'AI_API_KEY: 已配置/未配置'`。

---

## 二、后端接口问题

### 2.1 缺少输入校验

- **问题**：所有路由均没有请求参数校验。`journal` 创建接口直接 `int(request.json.get('score'))` 无 try/catch，传入非数字会抛 500；`score` 没有范围校验；`chat` 消息 `content` 没有长度限制。
- **建议**：对关键入参做类型检查和范围约束，至少用 try/catch 包裹类型转换。

### 2.2 Dashboard 全表加载

- **文件**：`backend/routes/dashboard.py`
- **问题**：计算平均情绪分数时执行 `Journal.query.all()` 加载全表到内存再求平均，数据量大时会导致内存溢出。
- **建议**：改用 `db.session.query(db.func.avg(Journal.score)).scalar()` 在数据库层面计算。

---

## 三、前端页面规范问题

### 3.1 路由守卫缺失

- **问题**：前端没有路由鉴权逻辑，未登录用户可以直接访问 `/journal`、`/chat` 等页面，仅在页面内部 `useEffect` 中检查 token 后跳转，会短暂闪现页面内容。
- **建议**：在 `layout.jsx` 中统一做登录态判断，未登录直接重定向到 `/login`。

---

## 四、代码冗余优化建议

### 4.1 后端 auth_required 与 admin_required 重复逻辑

- **文件**：`backend/utils/jwt.py`
- **问题**：两个装饰器中大段相同的 token 提取和解码代码，仅最后权限判断不同。
- **建议**：抽取 `_get_current_user()` 内部函数复用。

### 4.2 前端 API 调用模式不统一

- **问题**：部分页面直接 `fetch`，部分用封装的 `api` 函数，错误处理也各不相同。
- **建议**：统一封装请求层，内置 token 注入和错误处理。

---

## 五、数据库优化建议

### 5.1 缺少复合索引

- **问题**：`journal` 表按 `user_id + created_at` 查询、`chat_session` 按 `user_id + updated_at` 查询是高频操作，但缺少对应复合索引。
- **建议**：
  - `journal` 表添加 `INDEX idx_user_created (user_id, created_at DESC)`
  - `chat_session` 表添加 `INDEX idx_user_updated (user_id, updated_at DESC)`

### 5.2 缺少 CHECK 约束

- **问题**：`journal.score` 应在数据库层面限制为 1-10，目前完全依赖应用层。
- **建议**：添加 `CHECK (score BETWEEN 1 AND 10)` 约束兜底。
