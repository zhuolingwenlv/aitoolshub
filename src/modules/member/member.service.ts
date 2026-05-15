import { v4 as uuidv4 } from 'uuid'
import { getMemberInfo, setMemberInfo, deductMemberRemainCount, findUserByPhone } from '../../db/mockStore.js'

// ============================================================
// 会员权益配置（与前端权益中心完全一致）
// ============================================================
export const MEMBER_PLANS = {
  0: {
    level: 0,
    name: '普通用户',
    price: 39.8,
    priceDisplay: '¥39.8',
    unit: '次',
    count: 1,
    period: 0,       // 0 = 一次性，不过期
    periodText: '永久有效',
    benefits: ['单次诊断', '基础报告'],
  },
  1: {
    level: 1,
    name: '季VIP',
    price: 198,
    priceDisplay: '¥198',
    unit: '季',
    count: 10,
    period: 3,       // 月
    periodText: '3个月',
    benefits: ['10次诊断', '优先客服', '9折续费'],
  },
  2: {
    level: 2,
    name: '半年SVIP',
    price: 598,
    priceDisplay: '¥598',
    unit: '半年',
    count: 30,
    period: 6,       // 月
    periodText: '6个月',
    benefits: ['30次诊断', '精装报告', '专属顾问', '优先客服'],
  },
  3: {
    level: 3,
    name: '黑金年卡',
    price: 2988,
    priceDisplay: '¥2988',
    unit: '年',
    count: 50,
    period: 12,      // 月
    periodText: '12个月',
    benefits: ['50次诊断', '典藏报告', '顾问复核', '优先客服', '专属通道'],
  },
} as const

// 计算过期时间（仅限有时限套餐）
export function calcExpireDate(level: number, fromDate: Date = new Date()): string {
  const plan = MEMBER_PLANS[level as keyof typeof MEMBER_PLANS]
  if (!plan || !plan.period) {
    // 一次性（Lv0单次）或无期限：1年后
    return new Date(fromDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
  }
  const d = new Date(fromDate)
  d.setMonth(d.getMonth() + plan.period)
  return d.toISOString()
}

// 会员类型名称
export function getMemberTypeName(level: number): string {
  return MEMBER_PLANS[level as keyof typeof MEMBER_PLANS]?.name || '普通用户'
}

// ============================================================
// 购买会员（叠加次数逻辑）
// ============================================================
export async function purchaseMember(phone: string, memberLevel: number, planId: string): Promise<any> {
  const plan = MEMBER_PLANS[memberLevel as keyof typeof MEMBER_PLANS]
  if (!plan) {
    return { success: false, error: '无效的会员等级' }
  }

  const user = findUserByPhone(phone)
  if (!user) {
    return { success: false, error: '用户不存在' }
  }

  const orderId = uuidv4()
  const now = new Date()

  // 叠加次数：同等级购买次数累加，不同等级取 max
  const current = getMemberInfo(phone)
  let newLevel = memberLevel
  let newCount: number
  let newExpire: string

  if (!current || current.memberLevel === 0) {
    // 首次购买或普通用户：直接设定
    newCount = plan.count
    newExpire = calcExpireDate(memberLevel, now)
  } else if (current.memberLevel === memberLevel) {
    // 同等级续费：次数叠加，到期时间顺延
    newLevel = memberLevel
    newCount = current.remainCount + plan.count
    const baseDate = new Date(current.expireDate) > now ? new Date(current.expireDate) : now
    newExpire = calcExpireDate(memberLevel, baseDate)
  } else {
    // 升级：取较大等级，次数 = 当前剩余 + 新等级次数（升级补差价模式）
    newLevel = Math.max(current.memberLevel, memberLevel)
    newCount = current.remainCount + plan.count
    const baseDate = new Date(current.expireDate) > now ? new Date(current.expireDate) : now
    newExpire = calcExpireDate(newLevel, baseDate)
  }

  // 更新用户会员等级
  user.memberLevel = newLevel

  // 更新会员信息
  setMemberInfo(phone, {
    memberLevel: newLevel,
    remainCount: newCount,
    expireDate: newExpire,
  })

  return {
    success: true,
    memberType: MEMBER_PLANS[newLevel as keyof typeof MEMBER_PLANS].name,
    remainCount: newCount,
    expireDate: newExpire,
    memberLevel: newLevel,
    orderId,
  }
}

// ============================================================
// 扣减次数（解锁报告时调用）
// ============================================================
export async function deductMemberCount(phone: string): Promise<any> {
  let info = getMemberInfo(phone)

  // 如果没有会员信息，初始化为普通用户
  if (!info) {
    setMemberInfo(phone, {
      memberLevel: 0,
      remainCount: 0,
      expireDate: calcExpireDate(0),
    })
    info = getMemberInfo(phone)!
  }

  // 检查是否过期（仅有时限套餐需要检查）
  const plan = MEMBER_PLANS[info.memberLevel as keyof typeof MEMBER_PLANS]
  if (plan && plan.period > 0 && new Date(info.expireDate) < new Date()) {
    // 已过期，重置为普通用户
    setMemberInfo(phone, {
      memberLevel: 0,
      remainCount: 0,
      expireDate: calcExpireDate(0),
    })
    info = getMemberInfo(phone)!
  }

  // 检查剩余次数
  if (info!.remainCount <= 0) {
    return {
      success: false,
      error: '剩余次数不足，请先购买会员',
      remainCount: 0,
      memberLevel: info!.memberLevel,
    }
  }

  // 扣减次数
  deductMemberRemainCount(phone, 1)

  const updatedInfo = getMemberInfo(phone)!
  return {
    success: true,
    remainCount: updatedInfo.remainCount,
    memberLevel: updatedInfo.memberLevel,
    deductCount: 1,
  }
}

// ============================================================
// 查询会员状态
// ============================================================
export async function getMemberStatus(phone: string): Promise<any> {
  let info = getMemberInfo(phone)

  // 如果没有会员信息，初始化为普通用户
  if (!info) {
    setMemberInfo(phone, {
      memberLevel: 0,
      remainCount: 0,
      expireDate: calcExpireDate(0),
    })
    info = getMemberInfo(phone)!
  }

  // 检查是否过期
  const plan = MEMBER_PLANS[info.memberLevel as keyof typeof MEMBER_PLANS]
  if (plan && plan.period > 0 && new Date(info.expireDate) < new Date()) {
    // 已过期，重置为普通用户
    setMemberInfo(phone, {
      memberLevel: 0,
      remainCount: 0,
      expireDate: calcExpireDate(0),
    })
    info = getMemberInfo(phone)!
  }

  return {
    success: true,
    memberType: getMemberTypeName(info!.memberLevel),
    memberLevel: info!.memberLevel,
    remainCount: info!.remainCount,
    expireDate: info!.expireDate,
    // 显示文案
    levelName: MEMBER_PLANS[info!.memberLevel as keyof typeof MEMBER_PLANS].name,
    price: MEMBER_PLANS[info!.memberLevel as keyof typeof MEMBER_PLANS].priceDisplay,
    periodText: MEMBER_PLANS[info!.memberLevel as keyof typeof MEMBER_PLANS].periodText,
  }
}
