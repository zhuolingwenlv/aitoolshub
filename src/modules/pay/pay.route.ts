import { FastifyInstance } from 'fastify'
import { unifiedOrder, handlePayCallback } from './pay.service.js'

export async function payRoutes(fastify: FastifyInstance) {
  // 微信支付下单 POST /api/v1/pay/create
  fastify.post('/api/v1/pay/create', async (request: any, reply: any) => {
    const { openid, planId, memberLevel, totalFee, userId } = request.body as any
    if (!openid || !planId || memberLevel === undefined || !totalFee) {
      return reply.code(400).send({ success: false, error: '缺少参数' })
    }
    const result = await unifiedOrder({ openid, planId, memberLevel, totalFee, userId: userId || openid })
    if (!result.success) {
      return reply.code(500).send({ success: false, error: result.error })
    }
    return reply.send({ success: true, data: result.data })
  })

  // 微信支付回调 POST /api/v1/pay/callback
  fastify.post('/api/v1/pay/callback', async (request: any, reply: any) => {
    const xmlBody = request.body instanceof Buffer ? request.body.toString('utf8') : JSON.stringify(request.body)
    const result = await handlePayCallback(xmlBody)
    reply.type('application/xml').send(result)
  })
}
