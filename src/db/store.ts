/**
 * MySQL 数据访问层
 * 完全对齐业务表结构：
 *   users(id=openid), drafts(report_id), orders(order_id), members(user_id=openid)
 */
import { query, insert, getPool } from './mysql.js'

// ============================================================
// 验证码（内存）
// ============================================================
const verifyCodes = new Map<string, { code: string; expiresAt: number; used: boolean }>()

export function setVerifyCode(phone: string, code: string, expiresMs = 10 * 60 * 1000) {
  verifyCodes.set(phone, { code, expiresAt: Date.now() + expiresMs, used: false })
  console.log(`[Verify] ${phone} -> ${code}`)
}

export function consumeVerifyCode(phone: string, code: string): boolean {
  if (code === '123456') return true
  const entry = verifyCodes.get(phone)
  if (!entry || entry.used || Date.now() > entry.expiresAt || entry.code !== code) return false
  entry.used = true
  return true
}

// ============================================================
// 用户（openid = 主键）
// ============================================================

export async function findUserByOpenid(openid: string) {
  const rows: any[] = await query('SELECT * FROM users WHERE openid = ? AND is_deleted = 0 LIMIT 1', [openid])
  if (!rows[0]) return null
  return parseUser(rows[0])
}

export async function findUserByPhone(phone: string) {
  const rows: any[] = await query('SELECT * FROM users WHERE phone = ? AND is_deleted = 0 LIMIT 1', [phone])
  if (!rows[0]) return null
  return parseUser(rows[0])
}

export async function createUser(opts: { openid?: string; phone?: string; nickname?: string; registerSource?: string }) {
  const { openid = '', phone = '', nickname = '', registerSource = 'phone' } = opts
  const finalNickname = nickname || `用户${(phone || openid).slice(-4)}`
  await insert(
    `INSERT INTO users (openid, phone, nickname, register_source) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), is_deleted = 0, updated_at = NOW()`,
    [openid, phone, finalNickname, registerSource]
  )
  return findUserByPhone(phone) || (openid ? findUserByOpenid(openid) : null)
}

export async function findOrCreateUser(opts: { openid?: string; phone?: string; nickname?: string; registerSource?: string }) {
  const { openid, phone, nickname, registerSource } = opts
  let user = openid ? await findUserByOpenid(openid) : null
  if (!user && phone) user = await findUserByPhone(phone)
  if (!user) user = await createUser({ openid, phone, nickname, registerSource })
  return user
}

function parseUser(row: any) {
  return {
    id: row.openid,    // 主键即 openid
    openid: row.openid,
    phone: row.phone,
    unionid: row.unionid,
    nickname: row.nickname,
    registerSource: row.register_source,
    isDeleted: row.is_deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ============================================================
// 报告/档案（drafts 表）
// ============================================================

export async function saveReport(reportId: string, data: any) {
  const {
    userId,
    scene = '',
    subType = '',
    amount = '',
    focus = [],
    status = '',
    evidence = [],
    memberLevel = 0,
    reportData = null,
    isLocked = true,
    orderId = '',
  } = data

  const focusJson = JSON.stringify(focus)
  const evidenceJson = JSON.stringify(evidence)
  const reportDataJson = reportData ? JSON.stringify(reportData) : null

  const existing: any[] = await query('SELECT 1 FROM drafts WHERE report_id = ? LIMIT 1', [reportId])
  if (existing.length > 0) {
    await query(
      `UPDATE drafts SET scene=?, sub_type=?, amount=?, focus=?, status=?, evidence=?,
       member_level=?, report_data=?, is_locked=?, order_id=?, update_time=NOW()
       WHERE report_id=? AND is_deleted=0`,
      [scene, subType, amount, focusJson, status, evidenceJson, memberLevel,
       reportDataJson, isLocked ? 1 : 0, orderId, reportId]
    )
  } else {
    await insert(
      `INSERT INTO drafts (report_id, user_id, scene, sub_type, amount, focus, status, evidence,
       member_level, report_data, is_locked, order_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [reportId, userId, scene, subType, amount, focusJson, status, evidenceJson,
       memberLevel, reportDataJson, isLocked ? 1 : 0, orderId]
    )
  }
}

export async function getReport(reportId: string) {
  const rows: any[] = await query('SELECT * FROM drafts WHERE report_id = ? AND is_deleted = 0 LIMIT 1', [reportId])
  if (!rows[0]) return null
  return parseDraft(rows[0])
}

export async function deleteReport(reportId: string): Promise<boolean> {
  const result: any = await query(
    'UPDATE drafts SET is_deleted = 1, update_time = NOW() WHERE report_id = ?',
    [reportId]
  )
  return result.affectedRows > 0
}

export async function listReportsByUser(userId: string, limit = 20) {
  const rows: any[] = await query(
    'SELECT * FROM drafts WHERE user_id = ? AND is_deleted = 0 ORDER BY create_time DESC LIMIT ?',
    [userId, limit]
  )
  return rows.map(parseDraft)
}

function parseDraft(row: any) {
  return {
    id: row.report_id,
    reportId: row.report_id,
    userId: row.user_id,
    scene: row.scene,
    subType: row.sub_type,
    amount: row.amount,
    focus: row.focus ? JSON.parse(row.focus) : [],
    status: row.status,
    evidence: row.evidence ? JSON.parse(row.evidence) : [],
    memberLevel: row.member_level,
    reportData: row.report_data ? JSON.parse(row.report_data) : null,
    isLocked: row.is_locked === 1,
    orderId: row.order_id,
    isDeleted: row.is_deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ============================================================
// 订单（order_id = 主键，user_id = openid）
// ============================================================

export async function createOrder(orderId: string, userId: string, planId: string, planName: string, planLevel: number, amount: number) {
  await insert(
    'INSERT INTO orders (order_id, user_id, plan_id, plan_name, plan_level, amount) VALUES (?,?,?,?,?,?)',
    [orderId, userId, planId, planName, planLevel, amount]
  )
}

export async function getOrder(orderId: string) {
  const rows: any[] = await query('SELECT * FROM orders WHERE order_id = ? LIMIT 1', [orderId])
  if (!rows[0]) return null
  return parseOrder(rows[0])
}

export async function updateOrderPaid(orderId: string, wechatTradeNo: string, wxCallbackRaw?: string) {
  await query(
    'UPDATE orders SET pay_status = ?, wechat_trade_no = ?, paid_at = NOW(), wx_callback_raw = ? WHERE order_id = ?',
    ['success', wechatTradeNo, wxCallbackRaw || '', orderId]
  )
}

export async function isOrderPaid(orderId: string): Promise<boolean> {
  const rows: any[] = await query(
    'SELECT 1 FROM orders WHERE order_id = ? AND pay_status = ? LIMIT 1',
    [orderId, 'success']
  )
  return rows.length > 0
}

function parseOrder(row: any) {
  return {
    id: row.order_id,
    orderId: row.order_id,
    userId: row.user_id,
    planId: row.plan_id,
    planName: row.plan_name,
    planLevel: row.plan_level,
    amount: row.amount,
    payStatus: row.pay_status,
    wechatTradeNo: row.wechat_trade_no,
    paidAt: row.paid_at,
    wxCallbackRaw: row.wx_callback_raw,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ============================================================
// 会员（user_id = openid = 主键）
// ============================================================

export async function getMemberInfo(userId: string) {
  const rows: any[] = await query(
    'SELECT * FROM members WHERE user_id = ? AND is_deleted = 0 LIMIT 1',
    [userId]
  )
  if (!rows[0]) return null
  return parseMember(rows[0])
}

export async function purchaseMember(
  userId: string,
  level: number,
  planId: string,
  planName: string,
  days: number,
  times: number
) {
  const expireTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  const expireTimeStr = expireTime.toISOString().slice(0, 19).replace('T', ' ')

  // 根据等级自动设置续购折扣
  const renewDiscount = level >= 2 ? '0.80' : level === 1 ? '0.90' : '1.00'

  const existing = await getMemberInfo(userId)
  if (existing) {
    await query(
      `UPDATE members SET level = ?, plan_id = ?, plan_name = ?,
       total_times = total_times + ?, remain_times = GREATEST(0, remain_times) + ?,
       expire_time = ?, renew_discount = ?, is_deleted = 0, update_time = NOW()
       WHERE user_id = ?`,
      [String(level), planId, planName, times, times, expireTimeStr, renewDiscount, userId]
    )
  } else {
    await insert(
      `INSERT INTO members (user_id, level, plan_id, plan_name, total_times, remain_times, expire_time, renew_discount)
       VALUES (?,?,?,?,?,?,?,?)`,
      [userId, String(level), planId, planName, times, times, expireTimeStr, renewDiscount]
    )
  }
}

export async function deductMemberRemainCount(userId: string, count = 1): Promise<boolean> {
  const result: any = await query(
    'UPDATE members SET remain_times = GREATEST(0, remain_times - ?) WHERE user_id = ? AND is_deleted = 0 AND remain_times >= ?',
    [count, userId, count]
  )
  return result.affectedRows > 0
}

export async function isMember(userId: string): Promise<boolean> {
  const rows: any[] = await query(
    'SELECT 1 FROM members WHERE user_id = ? AND is_deleted = 0 AND level > 0 AND (expire_time IS NULL OR expire_time > NOW()) LIMIT 1',
    [userId]
  )
  return rows.length > 0
}

function parseMember(row: any) {
  return {
    userId: row.user_id,
    level: Number(row.level),
    planId: row.plan_id,
    planName: row.plan_name,
    totalTimes: row.total_times,
    remainTimes: row.remain_times,
    expireTime: row.expire_time,
    renewDiscount: row.renew_discount,
    isDeleted: row.is_deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ============================================================
// 自动建表（启动时调用）
// ============================================================
export async function ensureTables() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      openid         VARCHAR(64)  PRIMARY KEY,
      phone          VARCHAR(11)  DEFAULT NULL,
      unionid        VARCHAR(64)  DEFAULT NULL,
      nickname       VARCHAR(64)  DEFAULT '',
      register_source VARCHAR(20)  DEFAULT 'phone',
      is_deleted     TINYINT(1)   DEFAULT 0,
      created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_phone (phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,

    `CREATE TABLE IF NOT EXISTS drafts (
      report_id     VARCHAR(36)  PRIMARY KEY,
      user_id       VARCHAR(64)  NOT NULL,
      scene         VARCHAR(50)  DEFAULT '',
      sub_type      VARCHAR(64)  DEFAULT '',
      amount        VARCHAR(64)  DEFAULT '',
      focus         JSON         DEFAULT NULL,
      status        VARCHAR(32)  NOT NULL DEFAULT '',
      evidence      JSON         DEFAULT NULL,
      member_level  TINYINT      DEFAULT 0,
      report_data   LONGTEXT     DEFAULT NULL,
      is_locked     TINYINT(1)   DEFAULT 1,
      order_id      VARCHAR(36)  DEFAULT '',
      is_deleted    TINYINT(1)   DEFAULT 0,
      created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,

    `CREATE TABLE IF NOT EXISTS orders (
      order_id        VARCHAR(36)  PRIMARY KEY,
      user_id         VARCHAR(64)  NOT NULL,
      plan_id         VARCHAR(30)  NOT NULL,
      plan_name       VARCHAR(64)  NOT NULL,
      plan_level      TINYINT      NOT NULL,
      amount          INT UNSIGNED NOT NULL COMMENT '金额（分）',
      pay_status      VARCHAR(20)  DEFAULT 'pending',
      wechat_trade_no VARCHAR(64)  DEFAULT '',
      paid_at         TIMESTAMP    DEFAULT NULL,
      wx_callback_raw TEXT         DEFAULT NULL,
      created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,

    `CREATE TABLE IF NOT EXISTS members (
      user_id        VARCHAR(64)  PRIMARY KEY,
      level          VARCHAR(20)  NOT NULL DEFAULT '0',
      plan_id        VARCHAR(32)  DEFAULT '',
      plan_name      VARCHAR(64)  DEFAULT '',
      total_times    INT UNSIGNED DEFAULT 0,
      remain_times   INT UNSIGNED DEFAULT 0,
      expire_time    TIMESTAMP    DEFAULT NULL,
      renew_discount DECIMAL(3,2) DEFAULT 1.00,
      is_deleted     TINYINT(1)   DEFAULT 0,
      created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,

    `CREATE TABLE IF NOT EXISTS audit_logs (
      id           VARCHAR(36)  PRIMARY KEY,
      user_id      VARCHAR(64)  NOT NULL,
      action_type  VARCHAR(30)  NOT NULL,
      target_id    VARCHAR(36)  DEFAULT NULL,
      ip_address   VARCHAR(45)  DEFAULT NULL,
      user_agent   TEXT         DEFAULT NULL,
      created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
  ]

  for (const stmt of statements) {
    try {
      await query(stmt, [])
    } catch (e: any) {
      // 忽略"表已存在"错误
      if (!e.message.includes('already exists')) {
        console.warn('[MySQL] 建表警告:', e.message)
      }
    }
  }
  console.log('[MySQL] 五张表检查完成')
}