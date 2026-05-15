import { FastifyInstance } from 'fastify'
import { purchaseMember, deductMemberCount, getMemberStatus, MEMBER_PLANS } from './member.service.js'
import { mockDb } from '../../db/mockStore.js'

export async function memberRoutes(fastify: FastifyInstance) {

  // ── 购买会员（POST /api/v1/member/purchase）──────────────────────
  fastify.post('/purchase', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { memberLevel, planId } = request.body as { memberLevel: number; planId: string }
    const { phone } = request.user

    if (!MEMBER_PLANS[memberLevel as keyof typeof MEMBER_PLANS]) {
      return reply.status(400).send({ success: false, error: '无效的会员等级' })
    }

    try {
      const result = await purchaseMember(phone, memberLevel, planId)
      return result
    } catch (err: any) {
      console.error('❌ 会员购买失败:', err)
      return reply.status(500).send({ success: false, error: '会员购买失败：' + err.message })
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

  // ── 查询订单列表（GET /api/v1/member/orders）─────────────────────
  fastify.get('/orders', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user
    const user = mockDb.users.get(phone)
    if (!user) return reply.status(404).send({ success: false, error: '用户不存在' })

    // 遍历所有订单，找出发给该用户的
    const userOrders: any[] = []
    for (const [, order] of mockDb.orders) {
      if ((order as any).userId === user.id) {
        const plan = MEMBER_PLANS[(order as any).level as keyof typeof MEMBER_PLANS]
        userOrders.push({
          orderId: (order as any).orderId,
          level: (order as any).level,
          levelName: plan?.name || '未知',
          price: plan?.price || 0,
          priceDisplay: plan?.priceDisplay || '¥0',
          status: (order as any).status,
          paidAt: (order as any).paidAt,
          createdAt: (order as any).createdAt,
        })
      }
    }

    // 按时间倒序
    userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return { success: true, orders: userOrders }
  })

  // ── 申请开票（POST /api/v1/member/invoice）──────────────────────
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

    // 存到 mockDb（生产替换为 MySQL insert）
    const invoiceRecord = {
      invoiceId,
      userId: mockDb.users.get(phone)?.id,
      phone,
      type,           // 'personal' | 'enterprise'
      title,          // 发票抬头
      taxNo: taxNo || '',       // 税号（企业）
      companyName: companyName || '', // 公司名称
      email,           // 接收邮箱
      amount: Number(amount) || 0,
      status: 'pending',       // pending | issued | rejected
      orderId: orderId || '',
      createdAt: new Date().toISOString(),
    }

    // 存到全局 mockDb（需先确认 mockStore 有 invoices Map）
    if (!(mockDb as any).invoices) {
      (mockDb as any).invoices = new Map()
    }
    (mockDb as any).invoices.set(invoiceId, invoiceRecord)

    return {
      success: true,
      message: '开票申请已提交，我们将在3个工作日内处理',
      invoiceId,
    }
  })

  // ── 查询开票记录（GET /api/v1/member/invoices）─────────────────
  fastify.get('/invoices', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user
    const user = mockDb.users.get(phone)
    if (!user) return reply.status(404).send({ success: false, error: '用户不存在' })

    const invoices: any[] = []
    const invMap = (mockDb as any).invoices
    if (invMap) {
      for (const [, inv] of invMap) {
        if ((inv as any).phone === phone) {
          invoices.push(inv)
        }
      }
    }
    invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return { success: true, invoices }
  })

  // ── 会员权益说明（GET /api/v1/member/plans）─────────────────────
  fastify.get('/plans', async (request, reply) => {
    return {
      success: true,
      plans: Object.values(MEMBER_PLANS),
    }
  })
}
