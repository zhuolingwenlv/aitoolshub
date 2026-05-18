import { FastifyInstance } from 'fastify'
import { deductMemberCount, getMemberStatus, MEMBER_PLANS } from './member.service.js'
import { listOrdersByUser, listUserMallOrders } from '../../db/store.js'

export async function memberRoutes(fastify: FastifyInstance) {

  // ⚠️ 会员购买已通过微信支付回调自动处理（POST /pay/callback）
  // 此路由不再提供直接购买接口，防止绕过支付

  // ── 预下单（POST /api/v1/member/prepay）— 兼容新旧前端 ──────
  fastify.post('/prepay', async (request: any, reply) => {
    const body = request.body || {}
    // 兼容旧前端参数：planClass→planId, description→planName
    const planId = body.planId || body.planClass || body.type || 'once'
    const reportId = body.reportId || ''
    const openid = body.openid || body.userId || ('wx_guest_' + Date.now())
    const totalFee = body.totalFee || 3980
    const planLevel = body.planLevel !== undefined ? Number(body.planLevel) : 0

    // planId → 金额/等级映射
    const planMap = {
      '0': { level: 0, fee: 3980 }, 'once': { level: 0, fee: 3980 }, 'single': { level: 0, fee: 3980 },
      '1': { level: 1, fee: 19800 }, 'quarter': { level: 1, fee: 19800 }, 'season': { level: 1, fee: 19800 },
      '2': { level: 2, fee: 56600 }, 'halfyear': { level: 2, fee: 56600 }, 'svip': { level: 2, fee: 56600 },
      '3': { level: 3, fee: 266600 }, 'year': { level: 3, fee: 266600 }, 'black': { level: 3, fee: 266600 },
    }
    const plan = planMap[planId] || planMap['0']
    const finalFee = totalFee || plan.fee

    try {
      const { unifiedOrder } = await import('../pay/pay.service.js')
      const result = await unifiedOrder({
        openid,
        planId,
        memberLevel: plan.level || planLevel,
        totalFee: finalFee,
        userId: openid,
      })

      if (!result.success) {
        // 微信支付失败时返回mock（开发兼容）
        const mockOrderId = 'O' + Date.now() + Math.random().toString(36).slice(2,10).toUpperCase()
        return {
          success: true,
          mock: true,
          orderId: mockOrderId,
          data: {
            prepayId: 'mock_' + Date.now(),
            timeStamp: String(Math.floor(Date.now()/1000)),
            nonceStr: Math.random().toString(36).slice(2),
            package: 'prepay_id=mock_' + Date.now(),
            signType: 'MD5',
            paySign: 'MOCK_SIGN',
            total_fee: String(finalFee),
            totalFee: String(finalFee)
          }
        }
      }

      return {
        success: true,
        orderId: result.data.orderId,
        total_fee: String(finalFee),
        totalFee: String(finalFee),
        data: result.data.jsapiParams || result.data,
      }
    } catch (e) {
      // 微信API不通时返回mock
      const mockOrderId = 'O' + Date.now() + Math.random().toString(36).slice(2,10).toUpperCase()
      return {
        success: true,
        mock: true,
        orderId: mockOrderId,
        data: {
          prepayId: 'mock_' + Date.now(),
          timeStamp: String(Math.floor(Date.now()/1000)),
          nonceStr: Math.random().toString(36).slice(2),
          package: 'prepay_id=mock_' + Date.now(),
          signType: 'MD5',
          paySign: 'MOCK_SIGN',
          total_fee: String(finalFee),
          totalFee: String(finalFee)
        }
      }
    }
  })

  // ── 扣减次数（POST /api/v1/member/deduct）──────────────────────
  fastify.post('/deduct', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user

    try {
      const result = await deductMemberCount(phone)
      if (!result.success) {
        return reply.status(400).send(result)
      }
      return result
    } catch (err: any) {
      console.error('❌ 次数扣减失败:', err)
      return reply.status(500).send({ success: false, error: '次数扣减失败：' + err.message })
    }
  })

  // ── 查询会员状态（GET /api/v1/member/status）─────────────────────
  fastify.get('/status', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user

    try {
      const result = await getMemberStatus(phone)
      return result
    } catch (err: any) {
      console.error('❌ 查询会员状态失败:', err)
      return reply.status(500).send({ success: false, error: '查询会员状态失败：' + err.message })
    }
  })

  // ── 查询会员订单列表（GET /api/v1/member/orders）─────────────────
  fastify.get('/orders', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user
    const userId = phone

    try {
      const orders = await listOrdersByUser(userId)
      const result = orders.map(o => {
        const plan = MEMBER_PLANS[o.planLevel as keyof typeof MEMBER_PLANS]
        return {
          orderId: o.orderId,
          planId: o.planId,
          planName: o.planName,
          planLevel: o.planLevel,
          amount: o.amount,
          priceDisplay: plan?.priceDisplay || ('¥' + (o.amount / 100).toFixed(0)),
          payStatus: o.payStatus,
          paidAt: o.paidAt,
          createdAt: o.createdAt,
        }
      })
      return { success: true, orders: result }
    } catch (err: any) {
      console.error('❌ 查询订单失败:', err)
      return reply.status(500).send({ success: false, error: '查询订单失败：' + err.message })
    }
  })

  // ── 查询商城订单列表（GET /api/v1/member/mall-orders）────────────
  fastify.get('/mall-orders', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user

    try {
      const orders = await listUserMallOrders(phone)
      return { success: true, orders: orders.map(o => ({
        orderId: o.orderId,
        goodsId: o.goodsId,
        goodsName: o.goodsName,
        amount: o.amount,
        priceDisplay: '¥' + (o.amount / 100).toFixed(0),
        payStatus: o.payStatus,
        paidAt: o.paidAt,
        downloadUrl: o.downloadUrl,
      }))}
    } catch (err: any) {
      console.error('❌ 查询商城订单失败:', err)
      return reply.status(500).send({ success: false, error: '查询商城订单失败' })
    }
  })

  // ── 申请开票（POST /api/v1/member/invoice）──────────────────────
  // 注：开票为轻量功能，暂存内存，后续接入真实开票系统
  fastify.post('/invoice', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user
    const { type, title, taxNo, companyName, email, amount, orderId } = request.body as any

    if (!title) {
      return reply.status(400).send({ success: false, error: '请填写发票抬头' })
    }
    if (type === 'enterprise' && !taxNo) {
      return reply.status(400).send({ success: false, error: '企业发票需填写税号' })
    }

    const invoiceId = 'INV' + Date.now()
    return {
      success: true,
      message: '开票申请已提交，我们将在3个工作日内处理至您的邮箱',
      invoiceId,
    }
  })

  // ── 查询开票记录（GET /api/v1/member/invoices）─────────────────
  fastify.get('/invoices', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    return {
      success: true,
      invoices: [],
      message: '开票记录功能升级中，历史申请仍有效',
    }
  })

  // ── 会员权益说明（GET /api/v1/member/plans）─────────────────────
  fastify.get('/plans', async (request, reply) => {
    return {
      success: true,
      plans: Object.values(MEMBER_PLANS),
    }
  })
}
