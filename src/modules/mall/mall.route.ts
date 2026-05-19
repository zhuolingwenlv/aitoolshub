// 商城路由（指引商城 ¥166电子书 + ¥266素材库）
import { listGoods, getGoods, createMallOrder, getMallOrder, updateMallOrderPaid } from '../../db/store.js'
import { unifiedOrder } from '../pay/pay.service.js'

export async function mallRoutes(fastify) {

  // ── 商品列表（GET /api/v1/mall/goods）─────────────────────
  fastify.get('/goods', async (request, reply) => {
    try {
      const goods = await listGoods()
      return {
        success: true,
        goods: goods.map(g => ({
          id: g.id,
          name: g.name,
          price: g.price,
          priceDisplay: '¥' + (g.price / 100).toFixed(0),
          productType: g.productType,
          coverImage: g.coverImage,
          description: g.description,
        })),
      }
    } catch (err) {
      console.error('商品列表查询失败:', err)
      return reply.status(500).send({ success: false, error: '查询失败' })
    }
  })

  // ── 商品详情（GET /api/v1/mall/goods/:id）─────────────────
  fastify.get('/goods/:id', async (request, reply) => {
    const id = parseInt(request.params.id)
    if (isNaN(id)) {
      return reply.status(400).send({ success: false, error: '无效的商品ID' })
    }
    try {
      const goods = await getGoods(id)
      if (!goods) {
        return reply.status(404).send({ success: false, error: '商品不存在' })
      }
      return {
        success: true,
        goods: {
          ...goods,
          priceDisplay: '¥' + (goods.price / 100).toFixed(0),
        },
      }
    } catch (err) {
      console.error('商品详情查询失败:', err)
      return reply.status(500).send({ success: false, error: '查询失败' })
    }
  })

  // ── 创建商城订单 + 唤起支付（POST /api/v1/mall/order）─────
  fastify.post('/order', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { goodsId, openid } = request.body || {}
    const userId = request.user?.phone || request.user?.id || ''

    if (!goodsId) {
      return reply.status(400).send({ success: false, error: '缺少goodsId' })
    }

    try {
      const goods = await getGoods(Number(goodsId))
      if (!goods) {
        return reply.status(404).send({ success: false, error: '商品不存在' })
      }

      // 先创建商城订单记录
      const orderId = 'M' + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase()
      await createMallOrder(orderId, userId, goods.id, goods.name, goods.price)

      // 调用微信支付统一下单
      const payResult = await unifiedOrder({
        openid: openid || 'mock_openid_' + Date.now(),
        planId: 'mall_' + goods.id,
        memberLevel: 0,
        totalFee: goods.price,
        userId,
        goodsId: goods.id,  // 传给微信支付attach，回调时识别商城订单
      })

      if (!payResult.success) {
        return reply.status(500).send({ success: false, error: payResult.error })
      }

      // 返回虚拟支付参数（扁平化）
      const vp = payResult.data?.virtualParams || {}
      return {
        success: true,
        orderId,
        jsapiParams: {
          mock: false,
          orderId: payResult.data?.orderId || orderId,
          prepayId: payResult.data?.prepayId || '',
          offerId: vp.offerId || 'wxfd20b5775b2f6046',
          buyQuantity: vp.buyQuantity || 1,
          currencyType: vp.currencyType || 'CNY',
          env: vp.env || 0,
          zoneId: vp.zoneId || '1',
          signature: vp.signature || '',
          paySig: vp.paySig || '',
          signType: vp.signType || 'MD5',
        },
      }
    } catch (err) {
      console.error('商城下单失败:', err)
      return reply.status(500).send({ success: false, error: '下单失败' })
    }
  })
}
