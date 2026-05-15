/**
 * 支付路由
 * GET  /pay/test      - 健康测试
 * POST /pay/create    - 微信支付统一下单
 * POST /pay/callback  - 微信支付回调
 */
import { FastifyInstance } from 'fastify'
import { unifiedOrder } from './pay.service.js'
import { handlePayCallback } from './pay.service.js'

export async function payRoutes(fastify: FastifyInstance) {

  // 健康测试
  fastify.get('/pay/test', async (_req, reply) => {
    return reply.send({ success: true, message: 'pay route ok', time: new Date().toISOString() })
  })

  // 微信支付统一下单（JSAPI）
  fastify.post('/pay/create', async (request: any, reply: any) => {
    const body = request.body || {}
    console.log('[Pay] create called, body:', JSON.stringify(body))

    const { openid, planId, memberLevel, totalFee, userId } = body

    if (!openid) {
      return reply.status(400).send({ success: false, error: '缺少 openid 参数' })
    }
    if (!planId || memberLevel === undefined || !totalFee) {
      return reply.status(400).send({ success: false, error: '缺少必要支付参数' })
    }

    try {
      const result = await unifiedOrder({
        openid,
        planId,
        memberLevel: Number(memberLevel),
        totalFee: Number(totalFee), // 单位：分
        userId: userId || '',
      })

      if (result.success && result.data) {
        // 返回调起支付所需参数（供 wx.requestPayment 使用）
        return reply.send({
          success: true,
          data: {
            mock: false,
            orderId: result.data.orderId,
            jsapiParams: result.data.jsapiParams,
          }
        })
      } else {
        console.error('[Pay] unifiedOrder failed:', result.error)
        return reply.status(500).send({ success: false, error: result.error || '支付创建失败' })
      }
    } catch (err: any) {
      console.error('[Pay] create exception:', err)
      return reply.status(500).send({ success: false, error: '支付创建失败' })
    }
  })

  // 微信支付回调
  // 微信支付回调是 XML 格式：<xml>...</xml>
  // @fastify/multipart 自动解析 XML 为嵌套对象：body.return_code, body.transaction_id 等
  fastify.post('/pay/callback', async (request: any, reply: any) => {
    console.log('[Pay] callback called, body:', JSON.stringify(request.body).slice(0, 300))

    try {
      // 获取原始 XML（如果 available）
      const rawBody = request.rawBody || ''
      const resultXml = await handlePayCallback(rawBody)
      reply.type('application/xml').send(resultXml)
    } catch (err: any) {
      console.error('[Pay] callback error:', err)
      reply.type('application/xml').send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>')
    }
  })
}
