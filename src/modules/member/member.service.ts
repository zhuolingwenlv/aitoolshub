/**
 * 会员服务（MySQL版）
 * 所有会员操作均走 MySQL，替代 mockStore 的内存逻辑
 */
import { v4 as uuidv4 } from 'uuid'
import {
  getMemberInfo,
  purchaseMember as storePurchaseMember,
  deductMemberRemainCount,
  findUserByPhone,
} from '../../db/store.js'

// ============================================================
// 会员权益配置
// ============================================================
export const MEMBER_PLANS = {
  0: { level: 0, name: '普通用户',    price: 39.8, priceDisplay: '¥39.8', unit: '次',  count: 1,  period: 0,  periodText: '永久有效', benefits: ['单次诊断', '基础报告'] },
  1: { level: 1, name: '季VIP',      price: 198,  priceDisplay: '¥198',  unit: '季',  count: 10, period: 3,  periodText: '3个月',   benefits: ['10次诊断', '优先客服', '9折续费'] },
  2: { level: 2, name: '半年SVIP',    price: 598,  priceDisplay: '¥598',  unit: '半年',count: 30, period: 6,  periodText: '6个月',   benefits: ['30次诊断', '精装报告', '专属顾问', '优先客服'] },
  3: { level: 3, name: '黑金年卡',    price: 2988, priceDisplay: '¥2988', unit: '年',  count: 50, period: 12, periodText: '12个月',  benefits: ['50次诊断', '典藏报告', '顾问复核', '优先客服', '专属通道'] },
} as const

function calcExpireDate(level: number, fromDate: Date = new Date()): string {
  const plan = MEMBER_PLANS[level as keyof typeof MEMBER_PLANS]
  if (!plan || !plan.period) {
    return new Date(fromDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
  }
  const d = new Date(fromDate)
  d.setMonth(d.getMonth() + plan.period)
  return d.toISOString()
}

function getMemberTypeName(level: number): string {
  return MEMBER_PLANS[level as keyof typeof MEMBER_PLANS]?.name || '普通用户'
}

// ============================================================
// 开通/续费会员
// ============================================================
export async function purchaseMember(
  phone: string,
  memberLevel: number,
  planId: string
): Promise<any> {
  const plan = MEMBER_PLANS[memberLevel as keyof typeof MEMBER_PLANS]
  if (!plan) return { success: false, error: '无效的会员等级' }

  const user = await findUserByPhone(phone)
  if (!user) return { success: false, error: '用户不存在' }

  const userId = Number(user.id)

  // 计算新等级/次数/到期时间
  const current = await getMemberInfo(userId)
  let newLevel = memberLevel
  let newCount: number
  let newExpire: string
  const now = new Date()

  if (!current || !current.level || current.level === 0) {
    newCount = plan.count
    newExpire = calcExpireDate(memberLevel, now)
  } else if (current.level === memberLevel) {
    newLevel = memberLevel
    newCount = (current.remain_times || 0) + plan.count
    const base = current.expire_time && new Date(current.expire_time) > now
      ? new Date(current.expire_time) : now
    newExpire = calcExpireDate(memberLevel, base)
  } else {
    newLevel = Math.max(current.level, memberLevel)
    newCount = (current.remain_times || 0) + plan.count
    const base = current.expire_time && new Date(current.expire_time) > now
      ? new Date(current.expire_time) : now
    newExpire = calcExpireDate(newLevel, base)
  }

  // 写入 MySQL
  await storePurchaseMember(userId, newLevel, planId, plan.name, plan.count, plan.period || 1)

  return {
    success: true,
    memberType: getMemberTypeName(newLevel),
    remainCount: newCount,
    expireDate: newExpire,
    memberLevel: newLevel,
    orderId: uuidv4(),
  }
}

// ============================================================
// 扣减次数
// ============================================================
export async function deductMemberCount(phone: string): Promise<any> {
  const user = await findUserByPhone(phone)
  if (!user) return { success: false, error: '用户不存在' }

  const userId = Number(user.id)
  const current = await getMemberInfo(userId)

  // 无会员或已用完
  if (!current || current.level === 0 || (current.remain_times || 0) <= 0) {
    return { success: false, error: '剩余次数不足，请先购买会员', remainCount: 0, memberLevel: current?.level || 0 }
  }

  await deductMemberRemainCount(userId, 1)
  const updated = await getMemberInfo(userId)

  return {
    success: true,
    remainCount: updated?.remain_times || 0,
    memberLevel: updated?.level || 0,
    deductCount: 1,
  }
}

// ============================================================
// 查询会员状态
// ============================================================
export async function getMemberStatus(phone: string): Promise<any> {
  const user = await findUserByPhone(phone)
  if (!user) return { success: false, error: '用户不存在' }

  const userId = Number(user.id)
  const info = await getMemberInfo(userId)

  const level = info?.level || 0
  const remainTimes = info?.remain_times || (level === 0 ? 0 : 0)
  const expireTime = info?.expire_time || null
  const plan = MEMBER_PLANS[level as keyof typeof MEMBER_PLANS]

  return {
    success: true,
    memberType: getMemberTypeName(level),
    memberLevel: level,
    remainCount: remainTimes,
    expireDate: expireTime,
    levelName: plan?.name || '普通用户',
    price: plan?.priceDisplay || '¥0',
    periodText: plan?.periodText || '',
  }
}
