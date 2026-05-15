import { FastifyInstance } from 'fastify'
import { mockDb, findUserByPhone, createUser, consumeVerifyCode, setVerifyCode, setMemberInfo, getMemberInfo } from '../../db/mockStore.js'
import { config } from '../../config/index.js'

export async function userRoutes(fastify: FastifyInstance) {
  // 发送验证码（POST /api/v1/user/send-code）
  fastify.post('/send-code', async (request, reply) => {
    const { phone } = request.body as { phone: string }

    if (!phone || !/^1\d{10}$/.test(phone)) {
      return reply.status(400).send({ success: false, error: '请输入正确的手机号' })
    }

    // 生成6位验证码
    const code = process.env.NODE_ENV === 'production'
      ? String(Math.floor(100000 + Math.random() * 900000))
      : '123456'

    // 用统一导出的 setVerifyCode 存验证码（同一模块实例）
    setVerifyCode(phone, code)
    console.log(`📱 验证码 ${phone} -> ${code}（Mock模式，仅开发环境显示）`)

    return {
      success: true,
      message: process.env.NODE_ENV === 'production' ? '验证码已发送' : '开发模式：验证码为 123456',
      debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    }
  })

  // 手机号登录（POST /api/v1/user/login）
  fastify.post('/login', async (request, reply) => {
    const { phone, code } = request.body as { phone: string; code: string }

    if (!phone || !code) {
      return reply.status(400).send({ success: false, error: '手机号和验证码不能为空' })
    }

    // 开发模式：123456 永远有效（不走 consumeVerifyCode，避免只能使用一次的问题）
    if (code !== '123456') {
      // 真实环境调用验证码校验（用顶层 import 的同一模块实例）
      if (!consumeVerifyCode(phone, code)) {
        return reply.status(400).send({ success: false, error: '验证码错误或已失效' })
      }
    }

    // 查找或创建用户（内联，不走 import）
    const { v4: uuidv4 } = await import('uuid')
    let user = mockDb.users.get(phone)
    if (!user) {
      user = {
        id: uuidv4(),
        phone,
        nickname: `用户${phone.slice(-4)}`,
        password: '',
        memberLevel: 0,
        createdAt: new Date().toISOString(),
      }
      mockDb.users.set(phone, user)
    }

    // 生成 JWT token
    const token = fastify.jwt.sign({
      id: user.id,
      phone: user.phone,
      memberLevel: user.memberLevel,
    })

    // 查询会员信息
    const member = getMemberInfo(user.phone) || { remainCount: 0, expireDate: null }

    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        memberLevel: user.memberLevel,
        remainCount: member.remainCount,
        expireDate: member.expireDate,
      },
    }
  })

  // 账号密码登录（开发测试用，POST /api/v1/user/login-password）
  fastify.post('/login-password', async (request, reply) => {
    const { phone, password } = request.body as { phone: string; password: string }

    if (!phone || !password) {
      return reply.status(400).send({ success: false, error: '手机号和密码不能为空' })
    }

    // 开发测试账号：任何手机号 + 密码 qxt123456 都能登录
    // 真实环境替换为数据库查询
    if (password !== 'qxt123456') {
      return reply.status(401).send({ success: false, error: '密码错误' })
    }

    let user = findUserByPhone(phone)
    if (!user) {
      user = createUser(phone)
    }

    const token = fastify.jwt.sign({
      id: user.id,
      phone: user.phone,
      memberLevel: user.memberLevel,
    })

    const member = getMemberInfo(user.phone) || { remainCount: 0, expireDate: null }

    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        memberLevel: user.memberLevel,
        remainCount: member.remainCount,
        expireDate: member.expireDate,
      },
    }
  })

  // 获取用户资料（需登录）
  fastify.get('/profile', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user
    const user = findUserByPhone(phone)
    if (!user) {
      return reply.status(404).send({ success: false, error: '用户不存在' })
    }
    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        memberLevel: user.memberLevel,
      },
    }
  })

  // 更新昵称（需登录）
  fastify.put('/profile', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user
    const { nickname } = request.body as { nickname?: string }
    const user = findUserByPhone(phone)
    if (!user) {
      return reply.status(404).send({ success: false, error: '用户不存在' })
    }
    if (nickname) user.nickname = nickname
    return { success: true, user: { id: user.id, phone: user.phone, nickname: user.nickname, memberLevel: user.memberLevel } }
  })

  // 微信一键登录（POST /api/v1/user/wx-login）
  // 开发模式：直接用 nickname 创建用户，不校验真实 openid
  // 生产模式：需用 code 调微信 api.weixin.qq.com 换 openid（需 AppID + AppSecret）
  fastify.post('/wx-login', async (request, reply) => {
    const { code, nickname, avatar, gender } = request.body as {
      code?: string; nickname?: string; avatar?: string; gender?: number
    }

    // Mock模式：用 nickname 生成一个唯一标识（生产替换为真实 openid）
    const openidKey = `wx_mock_${nickname || 'guest'}_${Date.now()}`
    const { v4: uuidv4 } = await import('uuid')

    // 查找或创建用户（Mock用 openidKey 作为 phone 替代）
    let user = mockDb.users.get(openidKey)
    if (!user) {
      user = {
        id: uuidv4(),
        phone: openidKey,
        nickname: nickname || '微信用户',
        password: '',
        memberLevel: 0,
        createdAt: new Date().toISOString(),
      }
      mockDb.users.set(openidKey, user)
    }

    const token = fastify.jwt.sign({
      id: user.id,
      phone: user.phone,
      memberLevel: user.memberLevel,
    })

    const member = getMemberInfo(user.phone) || { remainCount: 0, expireDate: null }

    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        memberLevel: user.memberLevel,
        remainCount: member.remainCount,
        expireDate: member.expireDate,
      },
    }
  })

  // 模拟开通会员（需登录）
  fastify.post('/upgrade-member', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { phone } = request.user
    const { level } = request.body as { level: number }

    const user = findUserByPhone(phone)
    if (!user) return reply.status(404).send({ success: false, error: '用户不存在' })

    // 模拟支付成功，直接升级（同步更新user和memberInfo）
    user.memberLevel = Math.max(user.memberLevel, level)

    // 同步更新memberInfo
    const MEMBER_PLANS: any = {
      1: { name: '季VIP', count: 10, days: 90 },
      2: { name: '半年SVIP', count: 30, days: 180 },
      3: { name: '黑金年卡', count: 50, days: 365 },
    }
    const plan = MEMBER_PLANS[level] || { name: '普通用户', count: 0, days: 0 }
    const expireDate = new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString()
    setMemberInfo(phone, {
      memberLevel: level,
      remainCount: plan.count,
      expireDate,
    })

    return {
      success: true,
      message: '会员开通成功',
      user: { id: user.id, phone: user.phone, nickname: user.nickname, memberLevel: user.memberLevel },
    }
  })
}
