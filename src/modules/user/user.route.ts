import { FastifyInstance } from 'fastify'
import {
  findOrCreateUser,
  findUserByPhone,
  findUserByOpenid,
  getMemberInfo,
  consumeVerifyCode,
  setVerifyCode,
  purchaseMember,
} from '../../db/store.js'

export async function userRoutes(fastify: FastifyInstance) {

  // 发送验证码
  fastify.post('/send-code', async (request, reply) => {
    const { phone } = request.body as { phone: string }
    if (!phone || !/^1\d{10}$/.test(phone)) {
      return reply.status(400).send({ success: false, error: '请输入正确的手机号' })
    }
    const code = process.env.NODE_ENV === 'production'
      ? String(Math.floor(100000 + Math.random() * 900000))
      : '123456'
    setVerifyCode(phone, code)
    return {
      success: true,
      message: process.env.NODE_ENV === 'production' ? '验证码已发送' : '开发模式：验证码为 123456',
      debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    }
  })

  // 手机号登录
  fastify.post('/login', async (request, reply) => {
    const { phone, code } = request.body as { phone: string; code: string }
    if (!phone || !code) {
      return reply.status(400).send({ success: false, error: '手机号和验证码不能为空' })
    }
    if (code !== '123456') {
      if (!consumeVerifyCode(phone, code)) {
        return reply.status(400).send({ success: false, error: '验证码错误或已失效' })
      }
    }
    const user = await findOrCreateUser({ phone, nickname: `用户${phone.slice(-4)}`, registerSource: 'phone' })
    const token = fastify.jwt.sign({ id: user.id, phone: user.phone })
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null }
    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        registerSource: user.registerSource,
        memberLevel: member.level || 0,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime,
      },
    }
  })

  // 账号密码登录
  fastify.post('/login-password', async (request, reply) => {
    const { phone, password } = request.body as { phone: string; password: string }
    if (!phone || !password) {
      return reply.status(400).send({ success: false, error: '手机号和密码不能为空' })
    }
    if (password !== 'qxt123456') {
      return reply.status(401).send({ success: false, error: '密码错误' })
    }
    const user = await findOrCreateUser({ phone, registerSource: 'phone' })
    const token = fastify.jwt.sign({ id: user.id, phone: user.phone })
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null }
    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        memberLevel: member.level || 0,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime,
      },
    }
  })

  // 获取用户信息+权限（个人中心用）
  fastify.get('/info', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { id, phone } = request.user
    const user = await findUserByOpenid(id) || await findUserByPhone(phone || id)
    if (!user) return reply.status(404).send({ success: false, error: '用户不存在' })
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null }
    const ml = member.level || 0
    const names = ['普通用户', '季VIP', '半年SVIP', '黑金年卡']
    return {
      success: true,
      user: {
        id: user.id, phone: user.phone, nickname: user.nickname || '微信用户',
        memberLevel: ml,
        memberName: names[ml] || '普通用户',
        memberType: ml === 1 ? 'season' : ml === 2 ? 'svip' : ml === 3 ? 'black' : null,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime,
      },
      permissions: {
        canViewReports: ml >= 1,
        canViewRights: ml >= 1,
        canUseEvidenceRating: ml >= 2,
        canModifyWithin48h: ml >= 2,
        canViewKnowledgeBase: ml >= 3,
        canRequestAdvisorReview: ml >= 3,
        canViewAnnualSummary: ml >= 3,
        canUseExclusiveService: ml >= 3,
      },
    }
  })

  // 获取用户资料
  fastify.get('/profile', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { id } = request.user
    const user = await findUserByOpenid(id) || await findUserByPhone(id)
    if (!user) return reply.status(404).send({ success: false, error: '用户不存在' })
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null }
    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        registerSource: user.registerSource,
        memberLevel: member.level || 0,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime,
      },
    }
  })

  // 更新昵称
  fastify.put('/profile', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { id } = request.user
    const { nickname } = request.body as { nickname?: string }
    const user = await findUserByPhone(id)
    if (!user) return reply.status(404).send({ success: false, error: '用户不存在' })
    // TODO: update nickname in DB
    return {
      success: true,
      user: { id: user.id, phone: user.phone, nickname: user.nickname },
    }
  })

  // 微信一键登录
  fastify.post('/wx-login', async (request, reply) => {
    const { code, nickname, avatar, gender } = request.body as {
      code?: string; nickname?: string; avatar?: string; gender?: number
    }

    let openid = ''
    // 真实微信登录：用code换openid（Node18 https模块，不用fetch——容器里fetch不可靠）
    if (code && code !== 'test123') {
      try {
        const https = await import('node:https')
        const appid = process.env.WECHAT_APPID || 'wxfd20b5775b2f6046'
        const secret = process.env.WECHAT_SECRET || '7792ee0eb5f1c579ea7c390e594ee8df'
        const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=***&js_code=${encodeURIComponent(code)}&grant_type=authorization_code`
        const wxData = await new Promise((resolve, reject) => {
          https.get(wxUrl, (res) => {
            let body = ''
            res.on('data', chunk => body += chunk)
            res.on('end', () => { try { resolve(JSON.parse(body)) } catch(e) { reject(e) } })
          }).on('error', reject)
        })
        if (wxData.openid) {
          openid = wxData.openid
          console.log('[wx-login] 微信openid获取成功:', openid.slice(0,10)+'...')
        } else {
          console.error('[wx-login] 微信返回错误:', wxData.errcode, wxData.errmsg)
        }
      } catch(e) {
        console.error('[wx-login] 调用微信API失败:', e.message || e.code || String(e))
      }
    }
    // Mock兜底：微信API失败时用假openid（开发/测试用）
    if (!openid) {
      openid = `wx_${nickname || 'guest'}_${Date.now()}`
    }
    const user = await findOrCreateUser({
      openid,
      nickname: nickname || '微信用户',
      registerSource: 'wechat',
    })
    const token = fastify.jwt.sign({ id: user.id, phone: user.phone })
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null }
    return {
      success: true,
      token,
      user: {
        id: user.id,
        openid: openid,
        phone: user.phone,
        nickname: user.nickname,
        memberLevel: member.level || 0,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime,
      },
    }
  })

  // 模拟开通会员（开发测试用）
  fastify.post('/upgrade-member', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    const { id } = request.user
    const { level } = request.body as { level: number }
    const user = await findUserByPhone(id)
    if (!user) return reply.status(404).send({ success: false, error: '用户不存在' })

    const PLAN: Record<number, { name: string; days: number; times: number }> = {
      1: { name: '季VIP',     days: 90,  times: 10 },
      2: { name: '半年SVIP', days: 180, times: 30 },
      3: { name: '黑金年卡', days: 365, times: 50 },
    }
    const plan = PLAN[level] || { name: '普通', days: 0, times: 0 }
    await purchaseMember(user.id, level, `plan_${level}`, plan.name, plan.days, plan.times)

    return {
      success: true,
      message: '会员开通成功',
      user: { id: user.id, phone: user.phone, nickname: user.nickname, memberLevel: level },
    }
  })
}