import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import path from 'path'
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

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = Fastify({
  logger: true,
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
console.log('[Static] PUBLIC_DIR =', PUBLIC_DIR, '| STATIC_DIR =', STATIC_DIR)
await app.register(staticFiles, {
  root: PUBLIC_DIR,
  prefix: '/pdfs',
  decorateReply: false,
})

// 隐私政策路由
app.get('/privacy', async (_req, reply) => {
  const fs = await import('fs')
  const privacyPath = path.join(STATIC_DIR, 'privacy.html')
  const html = fs.readFileSync(privacyPath, 'utf-8')
  return reply.type('text/html').send(html)
})

// 路由注册
await app.register(evidenceRoutes, { prefix: '/api/v1/evidence', bodyLimit: 25 * 1024 * 1024 })
await app.register(reportRoutes, { prefix: '/api/v1/report' })
await app.register(userRoutes, { prefix: '/api/v1/user' })
await app.register(verifyRoutes, { prefix: '/api/v1/verify' })
await app.register(memberRoutes, { prefix: '/api/v1/member' })
await app.register(adminRoute, { prefix: '/api/v1/admin' })
await app.register(webhookRoutes, { prefix: '/api/v1/ext' })
await app.register(payRoutes, { prefix: '' })

// 健康检查
app.get('/health', async () => ({ status: 'ok', time: new Date().toISOString() }))

// 启动
const start = async () => {
  try {
    // MySQL 连接测试 + 自动建表
    try {
      const { initPool } = await import('./db/mysql.js')
      await initPool()
      const { ensureTables } = await import('./db/store.js')
      await ensureTables()
    } catch (err) {
      console.warn('[MySQL] 初始化跳过（可能 DATABASE_URL 未配置）:', (err as Error).message)
    }

    await app.listen({ port: config.port, host: config.host })
    console.log(`✅ 启信通后端已启动: http://${config.host}:${config.port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
