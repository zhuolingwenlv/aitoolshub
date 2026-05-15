// 内存数据层（Mock模式，重启丢失）
// 真实部署时替换为 MySQL

import { v4 as uuidv4 } from 'uuid'

// 用户
const users = new Map<string, { id: string; phone: string; nickname: string; password: string; memberLevel: number; createdAt: string }>()

// 验证码: phone -> { code, expiresAt, used }
const verifyCodes = new Map<string, { code: string; expiresAt: number; used: boolean }>()

// 报告: reportId -> ReportGenerateRes
const reports = new Map<string, any>()

// 会员订单: orderId -> { userId, level, status, paidAt }
const orders = new Map<string, any>()

// 会员信息: phone -> { memberLevel, remainCount, expireDate, lastUpdated }
const memberInfo = new Map<string, { memberLevel: number; remainCount: number; expireDate: string; lastUpdated: string }>()

// 证据分析结果: draftId -> { [evidenceType]: AnalysisResult }
const evidenceAnalysis = new Map<string, Record<string, any>>()

// 管理员种子测试账号
const seedUsers = [
  { phone: '13800138001', nickname: '测试用户A', password: 'qxt123456', memberLevel: 1 },
  { phone: '13800138002', nickname: '测试用户B', password: 'qxt123456', memberLevel: 2 },
  { phone: '13800138003', nickname: '测试用户C', password: 'qxt123456', memberLevel: 0 },
  { phone: '13800138004', nickname: '测试用户D', password: 'qxt123456', memberLevel: 0 },
  { phone: '13800138888', nickname: '黑金用户', password: 'qxt123456', memberLevel: 3 },
]

for (const u of seedUsers) {
  users.set(u.phone, {
    id: uuidv4(),
    phone: u.phone,
    nickname: u.nickname,
    password: u.password,
    memberLevel: u.memberLevel,
    createdAt: new Date().toISOString(),
  })
  memberInfo.set(u.phone, {
    memberLevel: u.memberLevel,
    remainCount: u.memberLevel === 1 ? 10 : u.memberLevel === 2 ? 20 : u.memberLevel === 3 ? 50 : 0,
    expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString(),
  })
}

// 普通用户
users.set('13800138000', {
  id: uuidv4(),
  phone: '13800138000',
  nickname: '测试用户',
  password: '123456', // 真实项目必须 bcrypt
  memberLevel: 0,
  createdAt: new Date().toISOString(),
})

// 初始化测试用户的会员信息
memberInfo.set('13800138000', {
  memberLevel: 0,
  remainCount: 0,
  expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  lastUpdated: new Date().toISOString(),
})

export const mockDb = { users, verifyCodes, reports, orders, memberInfo, evidenceAnalysis }

// ==================== 用户操作 ====================

export function findUserByPhone(phone: string) {
  return users.get(phone)
}

export function createUser(phone: string, nickname?: string) {
  const user = {
    id: uuidv4(),
    phone,
    nickname: nickname || `用户${phone.slice(-4)}`,
    password: '',
    memberLevel: 0,
    createdAt: new Date().toISOString(),
  }
  users.set(phone, user)
  return user
}

// ==================== 验证码操作 ====================

export function setVerifyCode(phone: string, code: string, expiresMs = 10 * 60 * 1000) {
  const entry = { code, expiresAt: Date.now() + expiresMs, used: false }
  verifyCodes.set(phone, entry)
  console.log(`📱 验证码 ${phone} -> ${code}（Mock模式，仅开发环境显示）`)
}

export function consumeVerifyCode(phone: string, code: string): boolean {
  // 开发模式：123456 永远有效
  if (code === '123456') return true
  const entry = verifyCodes.get(phone)
  if (!entry) return false
  if (entry.used) return false
  if (Date.now() > entry.expiresAt) return false
  if (entry.code !== code) return false
  entry.used = true
  return true
}

// ==================== 报告操作 ====================

export function saveReport(reportId: string, data: any) {
  reports.set(reportId, data)
}

export function getReport(reportId: string) {
  return reports.get(reportId)
}

export function deleteReport(reportId: string): boolean {
  return reports.delete(reportId)
}

// ==================== 订单操作 ====================

export function createOrder(orderId: string, userId: string, level: number) {
  const order = { orderId, userId, level, status: 'pending', paidAt: null, createAt: new Date().toISOString() }
  orders.set(orderId, order)
  return order
}

export function updateOrderPaid(orderId: string) {
  const order = orders.get(orderId)
  if (order) {
    order.status = 'paid'
    order.paidAt = new Date().toISOString()
  }
}

// ==================== 会员操作 ====================

export function getMemberInfo(phone: string) {
  return memberInfo.get(phone)
}

export function setMemberInfo(phone: string, info: { memberLevel: number; remainCount: number; expireDate: string }) {
  memberInfo.set(phone, {
    ...info,
    lastUpdated: new Date().toISOString(),
  })
}

export function deductMemberRemainCount(phone: string, count = 1): boolean {
  const info = memberInfo.get(phone)
  if (!info) return false
  if (info.remainCount <= 0) return false
  info.remainCount -= count
  info.lastUpdated = new Date().toISOString()
  return true
}
