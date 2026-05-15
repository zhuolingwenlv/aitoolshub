import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { unifiedOrder, handlePayCallback } from './pay.service.js'

// ============================================================
// 微信支付下单接口
// POST /api/v1/pay/create
// ============================================================
async function createPayOrder(req: FastifyRequest, reply: FastifyReply) {
  const { openid, planId, memberLevel, totalFee, userId } = req.body as any

  if (!openid || !planId || memberLevel === undefined || !totalFee) {
    return reply.code(400).send({ success: false, error: '缺少参数' })
  }

  const result = await unifiedOrder({ openid, planId, memberLevel, totalFee, userId: userId || openid })

  if (!result.success) {
    return reply.code(500).send({ success: false, error: result.error })
  }

  return reply.send({
    success: true,
    data: result.data,
  })
}

// ============================================================
// 微信支付回调接口
// POST /api/v1/pay/callback
// ============================================================
async function payCallback(req: FastifyRequest, reply: FastifyReply) {
  // 微信支付回调是 XML body
  const xmlBody = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body)
  const result = await handlePayCallback(xmlBody)
  reply.type('application/xml').send(result)
}

// ============================================================
// 注册路由
// ============================================================
export default async function payRoutes(fastify: FastifyInstance) {
  fastify.post('/api/v1/pay/create', createPayOrder)
  fastify.post('/api/v1/pay/callback', payCallback)
}
