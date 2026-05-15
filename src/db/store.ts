/**
 * MySQL 数据访问层
 * 替代 mockStore.ts，支持真实的用户/报告/订单/会员数据持久化
 */
import { v4 as uuidv4 } from 'uuid'
import { query, insert, getPool } from './mysql.js'

// ============================================================
// 验证码（仍然用内存，因为频率低且临时）
// ============================================================
const verifyCodes = new Map<string, { code: string; expiresAt: number; used: boolean }>()

export function setVerifyCode(phone: string, code: string, expiresMs = 10 * 60 * 1000) {
  verifyCodes.set(phone, { code, expiresAt: Date.now() + expiresMs, used: false })
  console.log(`📱 验证码 ${phone} -> ${code}`)
}

export function consumeVerifyCode(phone: string, code: string): boolean {
  if (code === '123456') return true // 开发模式
  const entry = verifyCodes.get(phone)
  if (!entry || entry.used || Date.now() > entry.expiresAt || entry.code !== code) return false
  entry.used = true
  return true
}

// ============================================================
// 用户
// ============================================================

/**
 * 根据 openid 查找用户
 */
export async function findUserByOpenid(openid: string) {
  const rows: any[] = await query('SELECT * FROM users WHERE openid = ? LIMIT 1', [openid])
  return rows[0] || null
}

/**
 * 根据手机号查找用户
 */
export async function findUserByPhone(phone: string) {
  const rows: any[] = await query('SELECT * FROM users WHERE phone = ? LIMIT 1', [phone])
  return rows[0] || null
}

/**
 * 创建用户（微信登录或手机号登录）
 */
export async function createUser(opts: { openid?: string; phone?: string; nickname?: string }) {
  const { openid = '', phone = '', nickname = '' } = opts
  const finalNickname = nickname || `用户${(phone || openid).slice(-4)}`
  const id = await insert(
    'INSERT INTO users (openid, phone, nickname) VALUES (?, ?, ?)',
    [openid, phone, finalNickname]
  )
  return findUserByPhone(phone) || findUserByOpenid(openid)
}

/**
 * 确保用户存在（根据 openid 或 phone 查找，没有则创建）
 */
export async function findOrCreateUser(opts: { openid?: string; phone?: string; nickname?: string }) {
  const { openid, phone, nickname } = opts
  let user = openid ? await findUserByOpenid(openid) : null
  if (!user && phone) user = await findUserByPhone(phone)
  if (!user) user = await createUser({ openid, phone, nickname })
  return user
}

// ============================================================
// 报告（drafts 表）
// ============================================================

/**
 * 保存报告（插入或更新）
 */
export async function saveReport(reportId: string, data: any) {
  const {
    userId, scene, subType = '', amount = '',
    focus = [], status, evidence = [],
    memberLevel = 0, reportData = null,
    reportLocked = true,
    expiresAt = null,
  } = data

  const focusJson = JSON.stringify(focus)
  const evidenceJson = JSON.stringify(evidence)
  const reportDataJson = reportData ? JSON.stringify(reportData) : null

  // 检查是否已存在
  const existing: any[] = await query('SELECT id FROM drafts WHERE report_id = ? LIMIT 1', [reportId])
  if (existing.length > 0) {
    await query(
      `UPDATE drafts SET scene=?, sub_type=?, amount=?, focus=?, status=?, evidence=?,
       member_level=?, report_data=?, report_locked=?, update_time=NOW() WHERE report_id=?`,
      [scene, subType, amount, focusJson, status, evidenceJson, memberLevel, reportDataJson, reportLocked ? 1 : 0, reportId]
    )
  } else {
    await insert(
      `INSERT INTO drafts (user_id, report_id, scene, sub_type, amount, focus, status, evidence,
       member_level, report_data, report_locked, expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [userId, reportId, scene, subType, amount, focusJson, status, evidenceJson,
       memberLevel, reportDataJson, reportLocked ? 1 : 0, expiresAt]
    )
  }
}

/**
 * 根据 reportId 获取报告
 */
export async function getReport(reportId: string) {
  const rows: any[] = await query('SELECT * FROM drafts WHERE report_id = ? LIMIT 1', [reportId])
  if (!rows[0]) return null
  const r = rows[0]
  return {
    ...r,
    focus: r.focus ? JSON.parse(r.focus) : [],
    evidence: r.evidence ? JSON.parse(r.evidence) : [],
    reportData: r.report_data ? JSON.parse(r.report_data) : null,
    reportLocked: r.report_locked === 1,
  }
}

/**
 * 删除报告
 */
export async function deleteReport(reportId: string): Promise<boolean> {
  const result: any = await query('DELETE FROM drafts WHERE report_id = ?', [reportId])
  return result.affectedRows > 0
}

/**
 * 获取用户的所有报告列表
 */
export async function listReportsByUser(userId: string | number, limit = 20) {
  const rows: any[] = await query(
    'SELECT * FROM drafts WHERE user_id = ? ORDER BY create_time DESC LIMIT ?',
    [userId, limit]
  )
  return rows.map(r => ({
    ...r,
    focus: r.focus ? JSON.parse(r.focus) : [],
    evidence: r.evidence ? JSON.parse(r.evidence) : [],
  }))
}

// ============================================================
// 订单
// ============================================================

/**
 * 创建订单
 */
export async function createOrder(orderId: string, userId: string | number, planId: string, planName: string, planLevel: number, amount: number) {
  await insert(
    'INSERT INTO orders (order_id, user_id, plan_id, plan_name, plan_level, amount) VALUES (?,?,?,?,?,?)',
    [orderId, userId, planId, planName, planLevel, amount]
  )
}

/**
 * 根据 orderId 查询订单
 */
export async function getOrder(orderId: string) {
  const rows: any[] = await query('SELECT * FROM orders WHERE order_id = ? LIMIT 1', [orderId])
  return rows[0] || null
}

/**
 * 更新订单为已支付
 */
export async function updateOrderPaid(orderId: string, wechatTradeNo: string) {
  await query(
    'UPDATE orders SET pay_status=?, wechat_trade_no=?, pay_time=NOW() WHERE order_id=?',
    ['success', wechatTradeNo, orderId]
  )
}

/**
 * 检查订单是否已支付（幂等）
 */
export async function isOrderPaid(orderId: string): Promise<boolean> {
  const rows: any[] = await query('SELECT pay_status FROM orders WHERE order_id = ? LIMIT 1', [orderId])
  return rows.length > 0 && rows[0].pay_status === 'success'
}

// ============================================================
// 会员
// ============================================================

/**
 * 获取用户会员信息
 */
export async function getMemberInfo(userId: string | number) {
  const rows: any[] = await query('SELECT * FROM members WHERE user_id = ? LIMIT 1', [userId])
  return rows[0] || null
}

/**
 * 开通/续费会员
 */
export async function purchaseMember(userId: string | number, level: number, planId: string, planName: string, days: number, times: number) {
  const expireTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')

  const existing = await getMemberInfo(userId)
  if (existing) {
    await query(
      `UPDATE members SET level=?, plan_id=?, plan_name=?, total_times=total_times+?,
       remain_times=GREATEST(0, remain_times)+?, expire_time=?, update_time=NOW() WHERE user_id=?`,
      [level, planId, planName, times, times, expireTime, userId]
    )
  } else {
    await insert(
      'INSERT INTO members (user_id, level, plan_id, plan_name, total_times, remain_times, expire_time) VALUES (?,?,?,?,?,?,?)',
      [userId, level, planId, planName, times, times, expireTime]
    )
  }
}

/**
 * 扣除诊断次数
 */
export async function deductMemberRemainCount(userId: string | number, count = 1): Promise<boolean> {
  const result: any = await query(
    'UPDATE members SET remain_times=GREATEST(0, remain_times-?) WHERE user_id=? AND remain_times>=?',
    [count, userId, count]
  )
  return result.affectedRows > 0
}

/**
 * 检查用户是否是会员（level > 0 且未过期）
 */
export async function isMember(userId: string | number): Promise<boolean> {
  const rows: any[] = await query(
    'SELECT 1 FROM members WHERE user_id=? AND level>0 AND (expire_time IS NULL OR expire_time > NOW()) LIMIT 1',
    [userId]
  )
  return rows.length > 0
}

// ============================================================
// 自动建表（启动时调用）
// ============================================================
export async function ensureTables() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      openid      VARCHAR(128) NOT NULL UNIQUE,
      unionid     VARCHAR(128) DEFAULT NULL,
      phone       VARCHAR(20)  DEFAULT NULL,
      nickname    VARCHAR(64)  DEFAULT '',
      avatar      VARCHAR(512) DEFAULT '',
      create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
      update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      status      TINYINT     DEFAULT 1,
      INDEX idx_openid (openid),
      INDEX idx_phone  (phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    CREATE TABLE IF NOT EXISTS drafts (
      id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id       BIGINT UNSIGNED NOT NULL,
      report_id     VARCHAR(64)  NOT NULL UNIQUE,
      scene         VARCHAR(32)  NOT NULL,
      sub_type      VARCHAR(64)  DEFAULT '',
      amount        VARCHAR(64)  DEFAULT '',
      focus         TEXT         DEFAULT NULL,
      status        VARCHAR(32)  NOT NULL,
      evidence      TEXT         DEFAULT NULL,
      member_level  TINYINT      DEFAULT 0,
      report_data   LONGTEXT     DEFAULT NULL,
      report_locked TINYINT     DEFAULT 1,
      create_time   DATETIME     DEFAULT CURRENT_TIMESTAMP,
      update_time   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      expires_at    DATETIME     DEFAULT NULL,
      INDEX idx_user_id   (user_id),
      INDEX idx_report_id (report_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    CREATE TABLE IF NOT EXISTS orders (
      id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_id        VARCHAR(64)  NOT NULL UNIQUE,
      user_id         BIGINT UNSIGNED NOT NULL,
      plan_id         VARCHAR(32)  NOT NULL,
      plan_name       VARCHAR(64)  NOT NULL,
      plan_level      TINYINT      NOT NULL,
      amount          INT UNSIGNED NOT NULL,
      pay_status      VARCHAR(16)  DEFAULT 'pending',
      pay_channel     VARCHAR(16)  DEFAULT 'wechat',
      wechat_trade_no VARCHAR(64)  DEFAULT '',
      create_time     DATETIME     DEFAULT CURRENT_TIMESTAMP,
      pay_time        DATETIME    DEFAULT NULL,
      update_time     DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id  (user_id),
      INDEX idx_order_id (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    CREATE TABLE IF NOT EXISTS members (
      id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id      BIGINT UNSIGNED NOT NULL UNIQUE,
      level        TINYINT     NOT NULL DEFAULT 0,
      plan_id      VARCHAR(32) DEFAULT '',
      plan_name    VARCHAR(64) DEFAULT '',
      total_times  INT UNSIGNED DEFAULT 0,
      remain_times INT UNSIGNED DEFAULT 0,
      expire_time  DATETIME    DEFAULT NULL,
      create_time  DATETIME    DEFAULT CURRENT_TIMESTAMP,
      update_time  DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `
  // 分4条执行（MySQL不支持一条IF NOT EXISTS创建多个表）
  for (const stmt of sql.split(';').filter(s => s.trim())) {
    try {
      await query(stmt + ';', [])
    } catch { /* 表已存在则忽略 */ }
  }
  console.log('[MySQL] 数据表检查完成')
}
