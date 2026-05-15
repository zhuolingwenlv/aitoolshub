import { FastifyInstance } from 'fastify'
import { setVerifyCode, consumeVerifyCode } from '../../db/mockStore.js'

export async function verifyRoutes(fastify: FastifyInstance) {
  // 发送验证码
  fastify.post('/send', async (request, reply) => {
    const { phone } = request.body as { phone: string }

    if (!phone || !/^1\d{10}$/.test(phone)) {
      return reply.status(400).send({ success: false, error: '请输入正确的手机号' })
    }

    // 生成6位验证码（开发环境固定为 123456）
    const code = process.env.NODE_ENV === 'production'
      ? String(Math.floor(100000 + Math.random() * 900000))
      : '123456'

    setVerifyCode(phone, code)

    // 生产环境真实发送（接短信网关），开发环境 mock
    return {
      success: true,
      message: process.env.NODE_ENV === 'production' ? '验证码已发送' : '开发模式：验证码为 123456',
      // 调试时返回验证码
      debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    }
  })

  // 验证验证码
  fastify.post('/check', async (request, reply) => {
    const { phone, code } = request.body as { phone: string; code: string }

    if (!phone || !code) {
      return reply.status(400).send({ success: false, error: '参数不完整' })
    }

    const valid = consumeVerifyCode(phone, code)

    if (!valid) {
      return reply.status(400).send({
        success: false,
        error: '验证码错误或已失效，请重新获取',
      })
    }

    return { success: true, message: '验证通过' }
  })
}
