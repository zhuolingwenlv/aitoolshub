import { FastifyInstance } from 'fastify'

export async function payRoutes(fastify: FastifyInstance) {
  // 健康测试
  fastify.get('/pay/test', async () => ({ pay: 'ok' }))

  // 微信支付下单
  fastify.post('/pay/create', async (request: any, reply: any) => {
    const body = request.body as any
    console.log('[Pay] create called with', body)
    return reply.send({ success: true, data: { test: 'hello' } })
  })

  // 微信支付回调
  fastify.post('/pay/callback', async (request: any, reply: any) => {
    console.log('[Pay] callback called')
    return reply.type('application/xml').send('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>')
  })
}
