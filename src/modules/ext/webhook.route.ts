import { FastifyInstance } from 'fastify'
import crypto from 'crypto'

// ============================================================
// Webhook 签名验证中间件
// ============================================================
async function verifyWebhook(request: any, reply: any) {
  const secret = process.env.WEBHOOK_SECRET || 'dev_webhook_secret'
  const sig = request.headers['x-signature'] || ''
  const body = JSON.stringify(request.body || {})

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  if (sig !== expected) {
    console.warn('⚠️ Webhook 签名验证失败')
    return reply.status(401).send({ code: 401, msg: '签名验证失败' })
  }
}

// ============================================================
// 飞书消息处理器
// ============================================================
async function handleFeishuMessage(body: any) {
  const { open_id, content, message_type } = body
  console.log(`📨 飞书消息 from ${open_id}: ${content}`)

  // TODO: 路由到 AI 客服（接入 LLM 或规则引擎）
  // 目前返回引导回复
  return {
    success: true,
    reply: {
      type: 'text',
      content: '您好！我是启信通智能客服小启。请告诉我您的手机号，我帮您查询报告进度；或直接点击下方菜单使用纠纷梳理服务。',
    },
  }
}

// ============================================================
// 企微消息处理器
// ============================================================
async function handleWecomMessage(body: any) {
  const { open_id, content } = body
  console.log(`📨 企微消息 from ${open_id}: ${content}`)
  return { success: true, reply: '收到消息，正在处理中...' }
}

// ============================================================
// AI 客服意图路由
// ============================================================
const INTENT_KEYWORDS: Record<string, string[]> = {
  '查询报告': ['报告', '查报告', '看报告', '报告在哪', '我的报告'],
  '开通会员': ['会员', '开通', '续费', '升级', '买会员'],
  '退款问题': ['退款', '退钱', '取消', '退掉'],
  '联系人工': ['人工', '客服', '有人吗', '转人工'],
  '报告未生成': ['没生成', '还没', '没出来', '还没好', '等很久'],
  '开发票': ['发票', '开票', '报销'],
  '修改手机号': ['改手机', '换手机', '手机号'],
}

function matchIntent(message: string): string {
  for (const [intent, words] of Object.entries(INTENT_KEYWORDS)) {
    if (words.some((w) => message.includes(w))) return intent
  }
  return '默认回复'
}

// ============================================================
// 报告生成完成 → 通知外部（outbound webhook）
// ============================================================
export async function notifyExternalReportReady(params: {
  platform: string
  open_id: string
  report_id: string
  scene_label: string
  member_level: number
  report_summary: string
}) {
  // TODO: 从数据库/Redis 读取该用户配置的外跳 webhook URL
  // const webhookUrl = await getUserWebhookUrl(params.open_id)
  // if (!webhookUrl) return
  // await fetch(webhookUrl, { method: 'POST', body: JSON.stringify({ event_type: 'report.generated', ...params }) })
}

// ============================================================
// 路由注册
// ============================================================
export async function webhookRoutes(fastify: FastifyInstance) {

  // ── Webhook 接收入口（飞书/企微/Chatbot）────────────────────
  fastify.post('/webhook', async (request, reply) => {
    // 签名验证（生产建议开启）
    // await verifyWebhook(request, reply)

    const body: any = request.body || {}
    const platform = body.platform || request.headers['x-platform'] || 'unknown'
    const eventType = body.event_type || 'unknown'

    console.log(`🔔 Webhook [${platform}] 事件: ${eventType}`)

    try {
      switch (eventType) {
        case 'im.message.receive_v2':
          if (platform === 'feishu') {
            const result = await handleFeishuMessage(body)
            return { code: 0, msg: 'ok', ...result }
          }
          if (platform === 'wecom') {
            await handleWecomMessage(body)
            return { code: 0, msg: 'ok' }
          }
          break

        case 'report.generated':
          // 报告生成完成事件（内部触发，通知外部）
          await notifyExternalReportReady({
            platform: body.platform || 'feishu',
            open_id: body.open_id || '',
            report_id: body.report_id || '',
            scene_label: body.scene_label || '',
            member_level: body.member_level || 0,
            report_summary: body.report_summary || '',
          })
          return { code: 0, msg: 'ok' }
      }

      return { code: 0, msg: 'unknown event, ignored' }
    } catch (err: any) {
      console.error('❌ Webhook 处理异常:', err)
      return { code: 500, msg: '处理异常' }
    }
  })

  // ── 发送消息到外部平台（飞书/企微）───────────────────────────
  fastify.post('/send-message', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { platform, to, msg_type, content } = request.body as any

    if (!platform || !to || !content) {
      return reply.status(400).send({ success: false, error: '缺少必要参数' })
    }

    // TODO: 根据 platform 调用对应平台的发送消息 API
    // 飞书：POST https://open.feishu.cn/open-apis/im/v1/messages
    // 企微：POST https://qyapi.weixin.qq.com/cgi-bin/message/send
    // 这里先记录，部署后接入真实 API
    console.log(`📤 发送消息 [${platform}] → ${to}:`, content)

    return {
      success: true,
      message_id: `om_${Date.now()}`,
      timestamp: Date.now(),
    }
  })

  // ── 外部查询会员状态 ─────────────────────────────────────────
  fastify.get('/member-status', async (request, reply) => {
    const { open_id } = request.query as { open_id?: string }
    if (!open_id) {
      return reply.status(400).send({ success: false, error: '缺少 open_id' })
    }

    // TODO: 根据 open_id 查找用户在启信通的账号和会员信息
    // 目前返回 mock 数据，部署后替换为真实查询
    return {
      success: true,
      member: {
        level: 2,
        level_name: '半年SVIP',
        remain_count: 15,
        expire_date: '2026-11-15T00:00:00+08:00',
        total_reports: 8,
      },
    }
  })

  // ── OAuth2 回调（飞书/企微侧边栏授权）─────────────────────────
  fastify.get('/oauth/callback', async (request, reply) => {
    const { code, platform, state } = request.query as any

    if (!code || !platform) {
      return reply.status(400).send({ success: false, error: '缺少 code 或 platform' })
    }

    // TODO: 用 code 换 open_id/union_id，存储映射关系
    // 飞书：POST https://open.feishu.cn/open-apis/authen/v1/oidc/access_token
    // 企微：GET https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=...&code=...
    console.log(`🔑 OAuth 回调 [${platform}] code=${code}`)

    // 重定向回小程序（授权成功后）
    return reply.redirect(`/pages/home/index?oauth=success&platform=${platform}&state=${state}`)
  })

  // ── AI 客服 Chatbot（POST /api/v1/ext/chatbot）──────────────
  fastify.post('/chatbot', async (request, reply) => {
    const body: any = request.body || {}
    const { platform, open_id, session_id, message } = body
    const userMessage: string = message?.content || message?.text || ''

    console.log(`🤖 Chatbot [${platform}] from ${open_id}: ${userMessage}`)

    // 意图识别
    const intent = matchIntent(userMessage)

    // 按意图回复（目前是规则引擎，生产可替换为 LLM 调用）
    const replies: Record<string, string> = {
      '查询报告': '请告诉我您的手机号，我帮您查询报告进度。',
      '开通会员': '您可以在启信通小程序 → 权益中心开通会员，季VIP仅¥168/10次。点击了解详情 👉 https://...',
      '退款问题': '您好！未解锁的报告可申请退款，请联系黑金专属客服处理。',
      '联系人工': '好的，已为您转接人工客服，请稍候。',
      '报告未生成': '抱歉给您带来不便！报告生成通常需要3-5分钟。请提供手机号，我帮您核查进度。',
      '开发票': '您可以在启信通 → 个人中心 → 申请开票，支持个人/企业普票，3个工作日内发出。',
      '修改手机号': '请前往个人中心 → 账号设置修改手机号，或联系客服协助处理。',
      '默认回复': '您好！我是启信通智能客服小启。请告诉我您想咨询的问题，例如：查询报告、开通会员、申请开票等。',
    }

    return {
      success: true,
      reply: {
        type: 'text',
        content: replies[intent] || replies['默认回复'],
      },
      intent,
      session_id,
    }
  })
}
