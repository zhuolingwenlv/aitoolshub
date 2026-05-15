import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { purchaseMember } from '../member/member.service.js'

// ============================================================
// 微信支付配置（从环境变量读取）
// ============================================================
const MCH_ID = process.env.WEIXIN_MCH_ID || '1745479207'
const API_KEY = process.env.WEINXIN_PAY_API_KEY || ''
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
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const { openid, planId, memberLevel, totalFee, userId } = params
  const orderId = 'O' + Date.now() + uuidv4().replace(/-/g, '').slice(0, 12).toUpperCase()

  const timeStart = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
  const timeExpire = new Date(Date.now() + 30 * 60 * 1000).toISOString().replace(/[-:T]/g, '').slice(0, 14)

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
    attach: JSON.stringify({ planId, memberLevel, userId }),
  }

  // 生成签名
  postData.sign = signParams(postData)

  // 转换XML
  const xmlBody = xmlEncode(postData)

  try {
    const resp = await fetch('https://api.mch.weixin.qq.com/pay/unifiedorder', {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      body: xmlBody,
    })

    const xmlText = await resp.text()
    const result = xmlDecode(xmlText)

    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      // 构造 JSAPI 调起参数
      const signParams2: Record<string, string> = {
        appId: APP_ID,
        timeStamp: String(Math.floor(Date.now() / 1000)),
        nonceStr: nonceStr,
        package: 'prepay_id=' + result.prepay_id,
        signType: 'MD5',
      }
      signParams2.paySign = signParams(signParams2)

      return {
        success: true,
        data: {
          orderId,
          prepayId: result.prepay_id,
          jsapiParams: signParams2,
        },
      }
    } else {
      return { success: false, error: result.err_code_des || result.return_msg || '下单失败' }
    }
  } catch (err: any) {
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
    let attach: { planId: string; memberLevel: number; userId: string } | null = null
    try {
      attach = JSON.parse(params.attach)
    } catch {
      attach = null
    }

    if (params.result_code === 'SUCCESS') {
      // 更新订单状态 → 开通会员
      const phone = params.attach?.phone || ''
      if (attach && attach.memberLevel !== undefined) {
        await purchaseMember(
          phone || params.attach?.userId || '',
          attach.memberLevel,
          attach.planId || params.out_trade_no
        )
        console.log('[Pay] 会员开通成功', { orderId: params.out_trade_no, level: attach.memberLevel })
      }
    }

    return xmlEncode({ return_code: 'SUCCESS', return_msg: 'OK' })
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
    0: '单次诊断',
    1: '季VIP',
    2: '半年SVIP',
    3: '黑金年卡',
  }
  return names[level] || '会员'
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
  const matches = xml.matchAll(/<(\w+)><!\[CDATA\[([^\]]*)\]\]><\/\1>/g)
  for (const m of matches) {
    result[m[1]] = m[2]
  }
  return result
}
