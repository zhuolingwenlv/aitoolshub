/**
 * 支付路由
 * GET  /pay/test      - 健康测试
 * POST /pay/create    - 微信支付统一下单
 * POST /pay/callback  - 微信支付回调
 */
import { FastifyInstance } from 'fastify'

export async function payRoutes(fastify: FastifyInstance) {

  // 健康测试
  fastify.get('/pay/test', async (_req, reply) => {
    return reply.send({ success: true, message: 'pay route ok', time: new Date().toISOString() })
  })

  // 微信支付统一下单
  fastify.post('/pay/create', async (request: any, reply: any) => {
    const body = request.body || {}
    console.log('[Pay] create called, body:', JSON.stringify(body))

    // 微信支付必要参数
    const { openid, planLevel, planName, amount, reportId } = body
    if (!openid) {
      return reply.status(400).send({ success: false, error: '缺少 openid 参数' })
    }

    try {
      // 这里调用微信支付统一下单 API（环境变量已配置）
      // WEIXIN_MCH_ID=1745479207, WEIXIN_PAY_API_KEY 已设置
      const mchId = process.env.WEIXIN_MCH_ID
      const payKey = process.env.WEIXIN_PAY_API_KEY

      console.log('[Pay] mchId:', mchId, 'payKey configured:', !!payKey)

      // Mock 返回：真实环境需要调用微信 JSAPI 统一下单
      // 微信支付文档：https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_1.shtml
      return reply.send({
        success: true,
        data: {
          mock: true,  // TODO: 真实微信支付时设为 false
          prepay_id: `wx_mock_${Date.now()}`,
          order_id: `ord_${Date.now()}`,
          // 调起支付参数（JSAPI）
          paySign: 'mock_sign_' + Date.now(),
          nonceStr: Math.random().toString(36).slice(2, 12),
          timestamp: Math.floor(Date.now() / 1000).toString(),
          package: 'prepay_id=wx_mock_' + Date.now(),
        }
      })
    } catch (err: any) {
      console.error('[Pay] create error:', err)
      return reply.status(500).send({ success: false, error: '支付创建失败' })
    }
  })

  // 微信支付回调（云托管公网回调地址）
  fastify.post('/pay/callback', async (request: any, reply: any) => {
    console.log('[Pay] callback called, body type:', typeof request.body)
    try {
      const body = request.body
      console.log('[Pay] callback body:', JSON.stringify(body).slice(0, 300))

      // 微信支付回调是 XML 格式，需要解析
      // @fastify/multipart 会把 XML 解析为普通字段
      const returnCode = body?.return_code || body?.return_code?._ || ''
      const transactionId = body?.transaction_id || body?.transaction_id?._ || ''

      if (returnCode === 'SUCCESS') {
        // 支付成功：更新用户会员状态
        console.log('[Pay] payment success, transactionId:', transactionId)
        return reply.type('application/xml').send(
          '<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>'
        )
      } else {
        console.error('[Pay] payment failed:', body)
        return reply.type('application/xml').send(
          '<xml><return_code><![CDATA[FAIL]]></return_code></xml>'
        )
      }
    } catch (err: any) {
      console.error('[Pay] callback error:', err)
      return reply.type('application/xml').send(
        '<xml><return_code><![CDATA[FAIL]]></return_code></xml>'
      )
    }
  })
}
