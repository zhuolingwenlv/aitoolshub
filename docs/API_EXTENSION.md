# 启信通 API 扩展文档
> 支撑飞书、企业微信、智能客服等第三方平台接入
> 版本：v1.0 | 更新：2026-05-15

---

## 一、整体架构

```
第三方平台（飞书/企微/AI客服）
        │
        ▼
  ┌─────────────────┐
  │  Webhook 接入层  │  ← 接收第三方回调（事件推送）
  │  /api/v1/ext/   │
  └────────┬────────┘
           │ 验证 + 路由
           ▼
  ┌─────────────────┐
  │   业务服务层     │
  │ member/report  │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   数据存储层     │
  │   MySQL / Redis │
  └─────────────────┘
```

---

## 二、Webhook 事件接入（飞书 / 企业微信 通用）

### 2.1 注册 Webhook 地址

将以下地址配置到飞书/企微的企业应用设置中：

```
https://express-1c5z-254473-7-1429024094.sh.run.tcloudbase.com/api/v1/ext/webhook
```

### 2.2 验证方式

Headers 必须包含：

| Header | 说明 |
|--------|------|
| `X-Webhook-Secret` | 双方约定的签名密钥（自行生成，建议32位随机字符串） |
| `X-Platform` | `feishu` 或 `wecom` 或 `chatbot` |

请求 Body 的签名校验方式：
```
HMAC-SHA256(原始 Body, secret) == X-Signature
```

### 2.3 Webhook 路由（POST /api/v1/ext/webhook）

```typescript
// 接收的事件类型分发
const eventType = body.event_type;

switch (eventType) {
  case 'im.message.receive_v2':   // 飞书：接收用户消息
    return handleFeishuMessage(body);
  case 'wecom.message.callback':   // 企微：消息回调
    return handleWecomMessage(body);
  case 'report.generated':        // 内部事件：报告生成完成（用于通知外部）
    return handleReportGenerated(body);
}
```

### 2.4 事件定义

#### 事件 A：外部平台用户发消息（inbound）

```json
{
  "event_type": "im.message.receive_v2",
  "platform": "feishu",
  "open_id": "ou_xxxxx",
  "open conversation_id": "oc_xxxxx",
  "content": "我想查一下我的报告",
  "timestamp": "1747200000000"
}
```

响应（异步，200 OK 立即返回）：
```json
{ "code": 0, "msg": "ok" }
```

#### 事件 B：报告生成完成（outbound webhook 通知）

当会员完成诊断后，可选择通知外部系统：

```json
{
  "event_type": "report.generated",
  "platform": "feishu",
  "user_open_id": "ou_xxxxx",
  "report_id": "RPT-20260515-001",
  "scene_type": "01",
  "scene_label": "网购纠纷",
  "member_level": 2,
  "report_summary": "争议焦点：退货退款...（最多100字）",
  "generated_at": "2026-05-15T20:30:00+08:00"
}
```

---

## 三、消息推送 API（启信通 → 飞书 / 企微）

### 3.1 发送消息（POST /api/v1/ext/send-message）

**请求**
```
POST /api/v1/ext/send-message
Headers:
  X-Webhook-Secret: <secret>
  Content-Type: application/json
```

```json
{
  "platform": "feishu",
  "to": "ou_xxxxx",
  "msg_type": "text",
  "content": {
    "text": "【启信通】您的报告已生成，点击查看：https://..."
  }
}
```

**支持的 msg_type**
| type | content 格式 |
|------|-------------|
| `text` | `{ "text": "..." }` |
| `post` | 富文本消息（飞书专属） |
| `markdown` | Markdown 格式文本（企微） |
| `mini_program` | 小程序消息卡片（微信系） |
| `template_card` | 模板消息卡片（带按钮） |

**响应**
```json
{
  "success": true,
  "message_id": "om_xxxxx",
  "timestamp": 1747200000000
}
```

### 3.2 发送小程序跳转卡片（企微 / 飞书）

```json
{
  "platform": "wecom",
  "to": "ou_xxxxx",
  "msg_type": "miniprogram",
  "content": {
    "appid": "wxfd20b5775b2f6046",
    "title": "您的诊断报告已就绪",
    "description": "点击查看完整纠纷梳理档案",
    "page_path": "/pages/draft/index"
  }
}
```

---

## 四、智能客服（AI Chatbot）接入

### 4.1 客服消息转发（POST /api/v1/ext/chatbot）

当用户在飞书/企微中 @智能客服 时，平台将消息转发至此接口：

```
POST /api/v1/ext/chatbot
```

**请求**
```json
{
  "platform": "feishu",
  "open_id": "ou_xxxxx",
  "session_id": "sess_xxxxx",
  "message": {
    "type": "text",
    "content": "我的报告还没生成"
  }
}
```

**响应（同步，最长5秒）**
```json
{
  "success": true,
  "reply": {
    "type": "text",
    "content": "您好！我是启信通智能客服小启。请告诉我您的手机号，我帮您查询报告进度。"
  }
}
```

### 4.2 意图识别路由

```typescript
// 客服机器人意图路由
const intents = {
  '查询报告':       handleQueryReport,
  '开通会员':       handleUpgradeMember,
  '退款问题':       handleRefund,
  '联系人工':       handleHumanAgent,
  '报告未生成':     handleReportPending,
  '修改手机号':     handleChangePhone,
  '开发票':         handleInvoice,
  '默认回复':       handleDefault,
};

function matchIntent(message: string): string {
  const keywords: Record<string, string[]> = {
    '查询报告': ['报告', '查报告', '看报告', '报告在哪'],
    '开通会员': ['会员', '开通', '续费', '升级'],
    '退款问题': ['退款', '退钱', '取消', '退款'],
    '联系人工': ['人工', '客服', '有人吗', '转人工'],
    '报告未生成': ['没生成', '还没', '没出来', '还没好'],
  };
  // 简单关键词匹配，生产可替换为 LLM 意图识别
  for (const [intent, words] of Object.entries(keywords)) {
    if (words.some(w => message.includes(w))) return intent;
  }
  return '默认回复';
}
```

### 4.3 上下文记忆（Session）

会话状态存储在 Redis（生产）或内存（开发），Key 格式：

```
chatbot:session:{open_id}  →  {
  lastIntent: '查询报告',
  lastPhone: '138****8888',
  lastReportId: 'RPT-xxx',
  history: [{role: 'user', content: '...'}, {role: 'bot', content: '...'}]
}
```

Session 有效期：30分钟无交互自动清除。

---

## 五、会员状态查询（供外部系统验证）

### 5.1 查询用户会员状态（GET /api/v1/ext/member-status）

```
GET /api/v1/ext/member-status?open_id=ou_xxxxx
```

**响应**
```json
{
  "success": true,
  "member": {
    "level": 2,
    "level_name": "半年SVIP",
    "remain_count": 15,
    "expire_date": "2026-11-15T00:00:00+08:00",
    "total_reports": 8
  }
}
```

此接口需要：
- Header 携带 `X-Webhook-Secret` 验证
- 或者通过 OAuth2 获取用户授权后查询

---

## 六、OAuth2 授权接入（企微 / 飞书 侧边栏）

### 6.1 授权流程

```
用户点击侧边栏 → 跳转授权页面 → 用户同意 → 回调获取 code → 换 token → 存储 open_id 映射
```

**授权回调地址（启信通后端）**
```
GET /api/v1/ext/oauth/callback?code=xxxxx&platform=feishu&state=xxx
```

**存储用户映射**
```typescript
// 授权后存储 open_id → 手机号/会员账号 的映射
// 用于后续 webhook 事件能关联到真实用户
await saveUserMapping({
  platform: 'feishu',
  open_id: 'ou_xxxxx',
  union_id: 'on_xxxxx',  // 跨应用唯一 ID（飞书）
  phone: '13800138888', // 用户在启信通的账号
  token: 'refresh_token_xxx',
  expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
});
```

---

## 七、部署清单

### 7.1 环境变量（.env）

```bash
# Webhook 签名密钥（必须自行设置，建议32位随机字符串）
WEBHOOK_SECRET=your_webhook_secret_here

# 飞书 App ID / Secret（消息推送用到）
FEISHU_APP_ID=cli_xxxxx
FEISHU_APP_SECRET=xxxxx

# 企微 Agent ID / Secret
WECOM_AGENT_ID=1000001
WECOM_APP_SECRET=xxxxx

# Redis（Session 存储，生产必须）
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 7.2 路由注册（server.ts）

```typescript
import { memberRoutes } from './modules/member/member.route.js'
import { reportRoutes } from './modules/report/report.route.js'
import { webhookRoutes } from './modules/ext/webhook.route.js'  // 新增

// 注册 Webhook 路由（放在 auth 之后）
await app.register(webhookRoutes, { prefix: '/api/v1/ext' })
await app.register(memberRoutes, { prefix: '/api/v1/member' })
```

### 7.3 飞书应用配置

1. 登录 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用 → 获取 `App ID` + `App Secret`
3. 配置权限：`im:message`、`contact:user.id`、`mini_program`
4. 配置事件订阅：`im.message.receive_v2`（接收消息）
5. 配置请求地址：`https://your-domain.com/api/v1/ext/webhook`

### 7.4 企微应用配置

1. 登录企业微信管理后台
2. 应用管理 → 创建应用 → 获取 `AgentId` + `Secret`
3. 配置「接收消息」→ 设置 `URL` 为上述 webhook 地址
4. 配置「网页授权」→ 填写 OAuth2 回调地址

---

## 八、数据安全注意事项

1. **签名验证**：所有 webhook 请求必须验证 `X-Webhook-Secret` 签名，拒绝无签名或签名错误请求
2. **IP 白名单**：生产环境建议在云托管防火墙限制只有飞书/企微服务器 IP 才能访问 `/api/v1/ext/` 路径
3. **敏感数据加密**：手机号/会员信息在日志中脱敏（`138****8888`）
4. **Token 存储**：第三方平台的 `refresh_token` 必须加密存储，不要明文写进日志
5. **频率限制**：同一 open_id 发送消息频率不超过 1条/秒，防止刷消息

---

## 九、当前版本状态

| 功能 | 状态 | 说明 |
|------|------|------|
| Webhook 接入层骨架 | ✅ 已完成 | 路由分发 + 签名验证中间件 |
| 消息推送 API | ✅ 已完成 | send-message 接口 |
| 会员状态查询 | ✅ 已完成 | /ext/member-status |
| 飞书平台适配 | ⏳ 待接入 | 需提供 App ID/Secret |
| 企微平台适配 | ⏳ 待接入 | 需提供 Agent ID/Secret |
| AI 客服意图路由 | ✅ 已完成 | 基础版，支持7种意图 |
| Session 管理 | ⏳ 待接Redis | 开发模式用内存，生产必须用Redis |
| OAuth2 授权 | ⏳ 待开发 | 侧边栏场景需要 |
