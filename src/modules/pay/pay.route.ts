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

  // 微信支付统一下单（JSAPI）— 强制auth，userId从JWT提取
  fastify.post('/pay/create', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply: any) => {
    const body = request.body || {}
    console.log('[Pay] create called, body:', JSON.stringify(body))

    const {
      openid,
      planId = 'plan_default',
      planLevel = 0,
      totalFee = 3980,
      reportId = '',
      planName = '单次诊断',
    } = body

    // userId从JWT提取，不允许客户端传入
    const userId = request.user?.phone || request.user?.id || ''
    if (!userId) {
      return reply.status(401).send({ success: false, error: '请先登录' })
    }

    // 开发阶段无真实 openid 时使用 mock（生产必须替换为真实 openid）
    const payOpenid = openid || `mock_openid_${Date.now()}`

    try {
      const result = await unifiedOrder({
        openid: payOpenid,
        planId,
        memberLevel: Number(planLevel),
        totalFee: Number(totalFee),
        userId,
      })

      if (result.success && result.data) {
        // 返回虚拟支付参数（wx.requestVirtualPayment 所需格式）
        const vp = result.data.virtualParams
        return reply.send({
          success: true,
          data: {
            mock: false,
            orderId: result.data.orderId,
            prepayId: result.data.prepayId,
            offerId: vp.offerId,
            buyQuantity: vp.buyQuantity,
            currencyType: vp.currencyType,
            env: vp.env,
            zoneId: vp.zoneId,
            signature: vp.signature,
            paySig: vp.paySig,
            signType: vp.signType,
            totalFee: vp.total_fee,
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

  // 微信支付回调（XML 格式）
  fastify.post('/pay/callback', async (request: any, reply: any) => {
    console.log('[Pay] callback called, body:', JSON.stringify(request.body).slice(0, 300))
    try {
      const rawBody = request.rawBody || ''
      const resultXml = await handlePayCallback(rawBody)
      reply.type('application/xml').send(resultXml)
    } catch (err: any) {
      console.error('[Pay] callback error:', err)
      reply.type('application/xml').send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>')
    }
  })
}
