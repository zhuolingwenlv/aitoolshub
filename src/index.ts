import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { config } from './config/index.js'
import { evidenceRoutes } from './modules/evidence/evidence.route.js'
import { reportRoutes } from './modules/report/report.route.js'
import { userRoutes } from './modules/user/user.route.js'
import { verifyRoutes } from './modules/verify/verify.route.js'
import { memberRoutes } from './modules/member/member.route.js'
import adminRoute from './modules/admin/admin.route.js'
import { webhookRoutes } from './modules/ext/webhook.route.js'
import { payRoutes } from './modules/pay/pay.route.js'
import { mallRoutes } from './modules/mall/mall.route.js'
import { initPool } from './db/mysql.js'
import { ensureTables } from './db/store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = Fastify({
  logger: process.env.NODE_ENV === 'production'
    ? { level: 'warn' }
    : true,
})

// CORS
await app.register(cors, {
  origin: true,
  credentials: true,
})

// JWT
await app.register(jwt, {
  secret: config.jwt.secret,
})

// 全局装饰器：验证token
app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ error: '未授权，请先登录' })
  }
})

// 文件上传 multipart（同时捕获原始 body 用于支付回调验签）
await app.register(multipart, {
  limits: { fileSize: 25 * 1024 * 1024 },
  // 捕获原始 XML body（微信支付回调用）
  onFilePart: (field, stream, filename, encoding, mimetype) => {
    // multipart 文件 part 由内置逻辑处理，这里不做额外操作
  },
})

// 捕获原始 request body（用于微信 XML 回调验签）
app.addContentTypeParser('application/xml', { parseAs: 'string' }, (req, body, done) => {
  try {
    ;(req as any).rawBody = body
    done(null, body)
  } catch (err) {
    done(err as Error, '')
  }
})
app.addContentTypeParser('text/xml', { parseAs: 'string' }, (req, body, done) => {
  try {
    ;(req as any).rawBody = body
    done(null, body)
  } catch (err) {
    done(err as Error, '')
  }
})

// PDF静态文件访问 /pdfs/*
// root指向public/pdfs/，prefix为/pdfs，这样 PDF 文件直接通过 /pdfs/文件名 访问
// PDF静态文件访问 /pdfs/*
const PROJECT_ROOT = process.env.NODE_ENV === 'production'
  ? '/app'
  : path.join(__dirname, '..')
const PUBLIC_DIR = process.env.NODE_ENV === 'production'
  ? '/app/public/pdfs'
  : path.join(PROJECT_ROOT, 'public/pdfs')
const STATIC_DIR = process.env.NODE_ENV === 'production'
  ? '/app/public'
  : path.join(PROJECT_ROOT, 'public')
// PDF 目录不存在则自动创建（生产环境 /app 可能有写权限限制）
try {
  const fs = await import('fs')
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  fs.mkdirSync(STATIC_DIR, { recursive: true })
  // 证据上传目录（容器持久化存储）
  fs.mkdirSync('/app/uploads/evidence', { recursive: true })
} catch (e) {
  console.warn('[Static] 目录创建失败（可能已存在或无权限）:', String(e))
}

try {
  await app.register(staticFiles, {
    root: PUBLIC_DIR,
    prefix: '/pdfs',
    decorateReply: false,
  })
  console.log('[Static] PDF静态文件已注册:', PUBLIC_DIR)

  // 证据上传静态文件服务
  await app.register(staticFiles, {
    root: '/app/uploads/evidence',
    prefix: '/uploads/evidence',
    decorateReply: false,
  })
  console.log('[Static] 证据文件静态服务已注册: /app/uploads/evidence')
} catch (e) {
  console.warn('[Static] PDF静态文件注册失败，服务继续运行:', String(e))
}

// 隐私政策路由
app.get('/privacy', async (_req, reply) => {
  const fs = await import('fs')
  const privacyPath = path.join(STATIC_DIR, 'privacy.html')
  const html = fs.readFileSync(privacyPath, 'utf-8')
  return reply.type('text/html').send(html)
})

// 测试账号种子（一次调用创建4个测试会员）
app.post('/api/v1/admin/seed-test', async (_request, reply) => {
  try {
    const { createUser, purchaseMember } = await import('./db/store.js')
    const accounts = [
      { phone: '15000000001', level: 0, planId: 'free',     planName: '普通用户',  days: 0,   times: 0  },
      { phone: '15000000002', level: 1, planId: 'quarter',  planName: '季VIP',      days: 90,  times: 10 },
      { phone: '15000000003', level: 2, planId: 'half_year',planName: '半年SVIP',   days: 180, times: 30 },
      { phone: '15000000004', level: 3, planId: 'annual',   planName: '黑金年卡',   days: 365, times: 50 },
    ]
    const results = []
    for (const a of accounts) {
      const openid = 'test_' + a.phone
      await createUser({ phone: a.phone, nickname: '测试' + a.planName, openid, registerSource: 'seed' })
      if (a.level > 0) await purchaseMember(openid, a.level, a.planId, a.planName, a.days, a.times)
      results.push({ phone: a.phone, level: a.level, plan: a.planName, times: a.times, days: a.days })
    }
    return { success: true, accounts: results, loginTip: '验证码统一 123456' }
  } catch (e: any) {
    return reply.status(500).send({ success: false, error: e.message })
  }
})

// 路由注册
await app.register(evidenceRoutes, { prefix: '/api/v1/evidence', bodyLimit: 25 * 1024 * 1024 })
await app.register(reportRoutes, { prefix: '/api/v1/report' })
await app.register(userRoutes, { prefix: '/api/v1/user' })
await app.register(verifyRoutes, { prefix: '/api/v1/verify' })
await app.register(memberRoutes, { prefix: '/api/v1/member' })
await app.register(mallRoutes, { prefix: '/api/v1/mall' })
await app.register(adminRoute, { prefix: '/api/v1/admin' })
await app.register(webhookRoutes, { prefix: '/api/v1/ext' })
await app.register(payRoutes, { prefix: '' })

// 健康检查 /api/v1/health
app.get('/health', async () => ({ status: 'ok', time: new Date().toISOString() }))

// 诊断接口：查看真实表状态
app.get('/api/v1/admin/tables', async (_req, reply) => {
  try {
    const { getPool } = await import('./db/mysql.js')
    const pool = getPool()
    const [rows] = await pool.query('SHOW TABLES')
    const tables = rows.map((r: any) => Object.values(r)[0])
    return { ok: true, tables }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
})

// 强制重建五张表（先删后建）
app.post('/api/v1/admin/init-db', async (_req, reply) => {
  try {
    const { initPool, query } = await import('./db/mysql.js')
    await initPool()
    const { ensureTables } = await import('./db/store.js')
    // 先查现有表
    const pool = (await import('./db/mysql.js')).getPool()
    const [rows] = await pool.query('SHOW TABLES')
    const existingTables = rows.map((r: any) => Object.values(r)[0])
    if (existingTables.length > 0) {
      // 有旧表，先删掉（防止结构错误）
      for (const t of existingTables) {
        await pool.query(`DROP TABLE IF EXISTS \`${t}\``)
      }
      console.log('[Admin] 已删除旧表:', existingTables)
    }
    await ensureTables()
    const [rows2] = await pool.query('SHOW TABLES')
    const tables = rows2.map((r: any) => Object.values(r)[0])
    return { ok: true, message: '五张表重建完成', tables }
  } catch (err) {
    console.error('[Admin] 建表失败:', err)
    return reply.status(500).send({ ok: false, error: String(err) })
  }
})

// 启动
const start = async () => {
  try {
    // MySQL 连接测试 + 自动建表（失败直接抛错，不吞掉）
    await initPool()
    await ensureTables()
    console.log('[MySQL] ✅ 初始化完成')

    await app.listen({ port: config.port, host: config.host })
    console.log(`✅ 启信通后端已启动: http://${config.host}:${config.port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
