import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { purchaseMember } from '../member/member.service.js'
import { updateOrderPaid, createOrder, purchaseMember as storePurchaseMember } from '../../db/store.js'
import { acquirePayLock, releasePayLock } from '../../db/redis.js'

// ============================================================
// 微信虚拟支付配置（从环境变量读取）
// ============================================================
const VIRTUAL_OFFER_ID = process.env.VIRTUAL_OFFER_ID || 'wxfd20b5775b2f6046'
const MCH_ID = process.env.WEIXIN_MCH_ID || '1745479207'
const API_KEY = process.env.WEIXIN_API_KEY || 'a7B9xW2qR5tY8uI3oP6sD1fG4hJ0kL9m'
const APP_ID = 'wxfd20b5775b2f6046'

// ============================================================
// 微信支付 API v2 签名（MD5）
// ============================================================
function signParams(params: Record<string, string>): string {
  // 按 key 字典序排序，用 & 连接，末尾加 API_KEY
  const sorted = Object.keys(params)
    .filter(k => params[k] !== '' && params[k] !== undefined && params[k] !== null)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  const signStr = sorted + '&key=' + API_KEY
  return crypto.createHash('md5').update(signStr, 'utf8').digest('hex').toUpperCase()
}

// ============================================================
// 统一下单（JSAPI）
// ============================================================
export async function unifiedOrder(params: {
  openid: string
  planId: string
  memberLevel: number
  totalFee: number // 单位：分
  userId: string
  goodsId?: number  // 商城商品ID（商城订单用）
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const { openid, planId, memberLevel, totalFee, userId } = params
  const orderId = 'O' + Date.now() + uuidv4().replace(/-/g, '').slice(0, 12).toUpperCase()

  // Redis分布式锁（120秒，防并发重复下单）
  const lockAcquired = await acquirePayLock(userId, String(memberLevel), 120)
  if (!lockAcquired) {
    return { success: false, error: '请勿重复提交，您的上一笔订单仍在处理中' }
  }

  // 防重复：检查近60秒是否有该用户的待支付/已支付同级别订单
  const { query } = await import('../../db/mysql.js')
  const recent = await query(
    'SELECT 1 FROM orders WHERE user_id = ? AND plan_level = ? AND pay_status IN (?,?) AND created_at > DATE_SUB(NOW(), INTERVAL 60 SECOND) LIMIT 1',
    [userId, memberLevel, 'pending', 'success']
  )
  if (recent.length > 0) {
    return { success: false, error: '您已有一笔进行中的订单，请稍后再试' }
  }

  // 在调用微信支付前先把订单写入MySQL（P0修复）
  try {
    await createOrder(orderId, userId, planId, getPlanName(memberLevel), memberLevel, totalFee)
    console.log('[Pay] 订单已创建:', orderId)
  } catch (e: any) {
    console.error('[Pay] 创建订单失败:', e.message)
    return { success: false, error: '下单失败，请稍后重试' }
  }

  // 微信支付V2要求格式 yyyyMMddHHmmss（不能有T）
  const fmtDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  }
  const timeStart = fmtDate(new Date())
  const timeExpire = fmtDate(new Date(Date.now() + 30 * 60 * 1000))

  const nonceStr = uuidv4().replace(/-/g, '')

  const postData: Record<string, string> = {
    appid: APP_ID,
    mch_id: MCH_ID,
    nonce_str: nonceStr,
    body: '启信通会员-' + getPlanName(memberLevel),
    out_trade_no: orderId,
    total_fee: String(totalFee),
    spbill_create_ip: '127.0.0.1',
    notify_url: 'https://qixintong-prod-254473-7-1429024094.sh.run.tcloudbase.com/api/v1/pay/callback',
    trade_type: 'JSAPI',
    openid: openid,
    time_start: timeStart,
    time_expire: timeExpire,
    attach: JSON.stringify({ planId, memberLevel, userId, goodsId: params.goodsId }),
  }

  // 生成签名
  postData.sign = signParams(postData)
  console.log('[Pay] 统一下单参数:', JSON.stringify({ appid: postData.appid, mch_id: postData.mch_id, body: postData.body, out_trade_no: postData.out_trade_no, total_fee: postData.total_fee, openid: postData.openid, trade_type: postData.trade_type, spbill_create_ip: postData.spbill_create_ip }))

  // 转换XML
  const xmlBody = xmlEncode(postData)

  try {
    // Node.js https 模块（不用 fetch——容器里 fetch 不可靠）
    const https = await import('node:https')
    const xmlText = await new Promise<string>((resolve, reject) => {
      const u = new URL('https://api.mch.weixin.qq.com/pay/unifiedorder')
      const req = https.request({
        hostname: u.hostname, port: 443, path: u.pathname + u.search,
        method: 'POST', headers: { 'Content-Type': 'text/xml' }, timeout: 30000,
      }, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => resolve(data))
      })
      req.on('timeout', () => { req.destroy(); reject(new Error('ETIMEDOUT')) })
      req.on('error', reject)
      req.write(xmlBody)
      req.end()
    })
    const result = xmlDecode(xmlText)

    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      // 签名用5字段（不含 total_fee），签完再追加上去
      const signParams2: Record<string, string> = {
        appId: APP_ID,
        timeStamp: String(Math.floor(Date.now() / 1000)),
        nonceStr: nonceStr,
        package: 'prepay_id=' + result.prepay_id,
        signType: 'MD5',
      }
      signParams2.paySign = signParams(signParams2)

      // total_fee 不参与 paySign，但基础库3.16要求必须传给 wx.requestPayment
      const jsapiParams: Record<string, string> = {}
      for (const k in signParams2) { jsapiParams[k] = signParams2[k] }
      jsapiParams.total_fee = String(totalFee)

      // 转换为虚拟支付参数（wx.requestVirtualPayment 所需格式）
      const virtualParams = {
        offerId: VIRTUAL_OFFER_ID,
        buyQuantity: 1,
        currencyType: 'CNY',
        env: 0,
        zoneId: '1',
        signature: jsapiParams.paySign,
        paySig: jsapiParams.paySign,
        signType: 'MD5',
        total_fee: String(totalFee),
      }

      return {
        success: true,
        data: {
          orderId,
          prepayId: result.prepay_id,
          jsapiParams,      // 保留兼容
          virtualParams,    // 新虚拟支付参数
        },
      }
    } else {
      console.error('[Pay] 统一下单失败 微信返回:', JSON.stringify({ return_code: result.return_code, result_code: result.result_code, err_code: result.err_code, err_code_des: result.err_code_des, return_msg: result.return_msg }))
      return { success: false, error: result.err_code_des || result.return_msg || '下单失败' }
    }
  } catch (err: any) {
    console.error('[Pay] 统一下单异常:', err.message, err.stack)
    return { success: false, error: err.message }
  }
}

// ============================================================
// 支付回调处理
// ============================================================
export async function handlePayCallback(xmlBody: string): Promise<string> {
  try {
    const params = xmlDecode(xmlBody)

    if (params.return_code !== 'SUCCESS') {
      return xmlEncode({ return_code: 'FAIL', return_msg: '签名失败' })
    }

    // 验证签名
    const { sign, ...rest } = params
    const expectedSign = signParams(rest)
    if (sign !== expectedSign) {
      console.error('[Pay] 签名验证失败', { expected: expectedSign, got: sign })
      return xmlEncode({ return_code: 'FAIL', return_msg: '签名失败' })
    }

    // 解析 attach
    let attach: { planId: string; memberLevel: number; userId: string; reportId?: string; goodsId?: number } | null = null
    try {
      attach = JSON.parse(params.attach)
    } catch {
      attach = null
    }

    if (params.result_code === 'SUCCESS') {
      const outTradeNo = params.out_trade_no || ''
      const transactionId = params.transaction_id || ''

      // 1. 更新订单为已支付
      await updateOrderPaid(outTradeNo, transactionId, xmlBody)

      // 2. 开通会员（level>0）或解锁单次报告（level===0）
      if (attach && attach.memberLevel !== undefined && attach.userId) {
        if (attach.memberLevel === 0 && attach.reportId) {
          // 单次购买 → 解锁报告
          const { saveReport } = await import('../../db/store.js')
          await saveReport(attach.reportId, {
            userId: attach.userId,
            isLocked: false,
            orderId: outTradeNo,
          })
          console.log('[Pay] 单次报告解锁成功', { reportId: attach.reportId })
        } else if (attach.memberLevel === 0 && attach.goodsId) {
          // 商城商品购买 → 标记商城订单已支付
          const { updateMallOrderPaid } = await import('../../db/store.js')
          await updateMallOrderPaid(outTradeNo, transactionId, '')
          console.log('[Pay] 商城订单支付成功', { orderId: outTradeNo, goodsId: attach.goodsId })
        } else if (attach.memberLevel > 0) {
          // 会员购买 → 开通会员
          const days = getPlanDays(attach.memberLevel)
          const times = getPlanTimes(attach.memberLevel)
          await storePurchaseMember(
            attach.userId,
            attach.memberLevel,
            attach.planId || outTradeNo,
            getPlanName(attach.memberLevel),
            days,
            times
          )
          console.log('[Pay] 会员开通成功', { orderId: outTradeNo, level: attach.memberLevel })
        }
      // 释放支付锁
      if (attach) {
        await releasePayLock(attach.userId, String(attach.memberLevel || 0))
      }

      return xmlEncode({ return_code: 'SUCCESS', return_msg: 'OK' })
    }
    }

    // 支付失败
    return xmlEncode({ return_code: 'FAIL', return_msg: params.err_code_des || '支付失败' })
  } catch (err: any) {
    console.error('[Pay] 回调处理异常', err)
    return xmlEncode({ return_code: 'FAIL', return_msg: err.message })
  }
}

// ============================================================
// 工具函数
// ============================================================
function getPlanName(level: number): string {
  const names: Record<number, string> = {
    0: '单次诊断', 1: '季VIP', 2: '半年SVIP', 3: '黑金年卡',
  }
  return names[level] || '会员'
}

function getPlanDays(level: number): number {
  const days: Record<number, number> = { 0: 0, 1: 90, 2: 180, 3: 365 }
  return days[level] || 30
}

function getPlanTimes(level: number): number {
  const times: Record<number, number> = { 0: 1, 1: 10, 2: 30, 3: 50 }
  return times[level] || 1
}

function xmlEncode(obj: Record<string, string>): string {
  return '<xml>' +
    Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `<${k}><![CDATA[${v}]]></${k}>`)
      .join('') +
    '</xml>'
}

function xmlDecode(xml: string): Record<string, string> {
  const result: Record<string, string> = {}
  const re = /<(\w+)><!\[CDATA\[([^\]]*)\]\]><\/\1>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) !== null) {
    result[m[1]] = m[2]
  }
  return result
}
