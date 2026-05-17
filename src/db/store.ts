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
    reportNo = '',
    scene = '',
    subType = '',
    amount = '',
    focus = [],
    status = '',
    evidence = [],
    memberLevel = 0,
    reportData = null,
    isLocked = true,
    genStatus = 0,
    reportVersion = 'blur',
    orderId = '',
  } = data

  const focusJson = JSON.stringify(focus)
  const evidenceJson = JSON.stringify(evidence)
  const reportDataJson = reportData ? JSON.stringify(reportData) : null

  const existing: any[] = await query('SELECT 1 FROM drafts WHERE report_id = ? LIMIT 1', [reportId])
  if (existing.length > 0) {
    // 部分更新：只更新明确传入的字段
    const sets: string[] = []
    const vals: any[] = []
    if (data.reportNo !== undefined) { sets.push('report_no=?'); vals.push(reportNo) }
    if (data.scene !== undefined) { sets.push('scene=?'); vals.push(scene) }
    if (data.subType !== undefined) { sets.push('sub_type=?'); vals.push(subType) }
    if (data.amount !== undefined) { sets.push('amount=?'); vals.push(amount) }
    if (data.focus !== undefined) { sets.push('focus=?'); vals.push(focusJson) }
    if (data.status !== undefined) { sets.push('status=?'); vals.push(status) }
    if (data.evidence !== undefined) { sets.push('evidence=?'); vals.push(evidenceJson) }
    if (data.memberLevel !== undefined) { sets.push('member_level=?'); vals.push(memberLevel) }
    if (data.reportData !== undefined) { sets.push('report_data=?'); vals.push(reportDataJson) }
    if (data.isLocked !== undefined) { sets.push('is_locked=?'); vals.push(isLocked ? 1 : 0) }
    if (data.genStatus !== undefined) { sets.push('gen_status=?'); vals.push(genStatus) }
    if (data.reportVersion !== undefined) { sets.push('report_version=?'); vals.push(reportVersion) }
    if (data.orderId !== undefined) { sets.push('order_id=?'); vals.push(orderId) }
    if (sets.length > 0) {
      sets.push('updated_at=NOW()')
      vals.push(reportId)
      await query(`UPDATE drafts SET ${sets.join(', ')} WHERE report_id=? AND is_deleted=0`, vals)
    }
  } else {
    await insert(
      `INSERT INTO drafts (report_id, report_no, user_id, scene, sub_type, amount, focus, status, evidence,
       member_level, report_data, is_locked, gen_status, report_version, order_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [reportId, reportNo, userId, scene, subType, amount, focusJson, status, evidenceJson,
       memberLevel, reportDataJson, isLocked ? 1 : 0, genStatus, reportVersion, orderId]
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
    'UPDATE drafts SET is_deleted = 1, updated_at = NOW() WHERE report_id = ?',
    [reportId]
  )
  return result.affectedRows > 0
}

export async function listReportsByUser(userId: string, limit = 20) {
  const rows: any[] = await query(
    'SELECT * FROM drafts WHERE user_id = ? AND is_deleted = 0 ORDER BY created_at DESC LIMIT ?',
    [userId, limit]
  )
  return rows.map(parseDraft)
}

function parseDraft(row: any) {
  return {
    id: row.report_id,
    reportId: row.report_id,
    reportNo: row.report_no || '',
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
    genStatus: row.gen_status || 0,
    reportVersion: row.report_version || 'blur',
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

export async function listOrdersByUser(userId: string, limit = 20) {
  const rows: any[] = await query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [userId, limit]
  )
  return rows.map(parseOrder)
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
       expire_time = ?, renew_discount = ?, is_deleted = 0, updated_at = NOW()
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
// 商城商品（goods）和商城订单（mall_orders）
// ============================================================

export async function listGoods() {
  const rows: any[] = await query(
    'SELECT * FROM goods WHERE status = 1 ORDER BY id ASC'
  )
  return rows.map(parseGoods)
}

export async function getGoods(goodsId: number) {
  const rows: any[] = await query('SELECT * FROM goods WHERE id = ? AND status = 1 LIMIT 1', [goodsId])
  if (!rows[0]) return null
  return parseGoods(rows[0])
}

export async function createMallOrder(
  orderId: string,
  userId: string,
  goodsId: number,
  goodsName: string,
  amount: number
) {
  await insert(
    'INSERT INTO mall_orders (order_id, user_id, goods_id, goods_name, amount) VALUES (?,?,?,?,?)',
    [orderId, userId, goodsId, goodsName, amount]
  )
}

export async function getMallOrder(orderId: string) {
  const rows: any[] = await query('SELECT * FROM mall_orders WHERE order_id = ? LIMIT 1', [orderId])
  if (!rows[0]) return null
  return parseMallOrder(rows[0])
}

export async function updateMallOrderPaid(orderId: string, wechatTradeNo: string, downloadUrl: string) {
  await query(
    'UPDATE mall_orders SET pay_status=?, wechat_trade_no=?, paid_at=NOW(), download_url=? WHERE order_id=?',
    ['success', wechatTradeNo, downloadUrl, orderId]
  )
}

export async function listUserMallOrders(userId: string) {
  const rows: any[] = await query(
    'SELECT * FROM mall_orders WHERE user_id = ? AND pay_status = ? ORDER BY created_at DESC',
    [userId, 'success']
  )
  return rows.map(parseMallOrder)
}

function parseGoods(row: any) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    productType: row.product_type,
    coverImage: row.cover_image,
    fileUrl: row.file_url,
    description: row.description,
    status: row.status,
  }
}

function parseMallOrder(row: any) {
  return {
    id: row.order_id,
    orderId: row.order_id,
    userId: row.user_id,
    goodsId: row.goods_id,
    goodsName: row.goods_name,
    amount: row.amount,
    payStatus: row.pay_status,
    wechatTradeNo: row.wechat_trade_no,
    paidAt: row.paid_at,
    downloadUrl: row.download_url,
    createdAt: row.created_at,
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
      INDEX idx_phone (phone),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,

    `CREATE TABLE IF NOT EXISTS drafts (
      report_id     VARCHAR(36)  PRIMARY KEY,
      report_no     VARCHAR(20)  DEFAULT '' COMMENT '业务编号QX-YYYYMMDD-NNN',
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
      INDEX idx_user_id (user_id),
      INDEX idx_pay_status (pay_status)
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
      paid_at         TIMESTAMP    DEFAULT 0,
      wx_callback_raw TEXT         DEFAULT NULL,
      created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_pay_status (pay_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,

    `CREATE TABLE IF NOT EXISTS members (
      user_id        VARCHAR(64)  PRIMARY KEY,
      level          VARCHAR(20)  NOT NULL DEFAULT '0',
      plan_id        VARCHAR(32)  DEFAULT '',
      plan_name      VARCHAR(64)  DEFAULT '',
      total_times    INT UNSIGNED DEFAULT 0,
      remain_times   INT UNSIGNED DEFAULT 0,
      expire_time    TIMESTAMP    DEFAULT 0,
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

    `CREATE TABLE IF NOT EXISTS goods (
      id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(128) NOT NULL,
      price        INT UNSIGNED NOT NULL COMMENT '金额分',
      product_type VARCHAR(20)  NOT NULL COMMENT 'ebook|material',
      cover_image  VARCHAR(255) DEFAULT '',
      file_url     VARCHAR(255) DEFAULT '',
      description  TEXT         DEFAULT NULL,
      status       TINYINT(1)   DEFAULT 1,
      created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,

    `CREATE TABLE IF NOT EXISTS mall_orders (
      order_id        VARCHAR(36)  PRIMARY KEY,
      user_id         VARCHAR(64)  NOT NULL,
      goods_id        INT UNSIGNED NOT NULL,
      goods_name      VARCHAR(128) NOT NULL,
      amount          INT UNSIGNED NOT NULL COMMENT '金额分',
      pay_status      VARCHAR(20)  DEFAULT 'pending',
      wechat_trade_no  VARCHAR(64)  DEFAULT '',
      paid_at         TIMESTAMP    DEFAULT 0,
      download_url    VARCHAR(255) DEFAULT '',
      created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_pay_status (pay_status),
      INDEX idx_goods_id (goods_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,

    `CREATE TABLE IF NOT EXISTS sequences (
      seq_key    VARCHAR(30)  PRIMARY KEY COMMENT 'report_YYYYMMDD',
      seq_value  INT UNSIGNED DEFAULT 0,
      updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
  ]

  for (const stmt of statements) {
    const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 'unknown'
    try {
      await query(stmt, [])
      console.log(`[MySQL] 建表成功: ${tableName}`)
    } catch (e: any) {
      console.error(`[MySQL] 建表失败 [${tableName}]:`, e.message)
      throw e // 失败就抛出来，不要静默
    }
  }
  console.log('[MySQL] 八张表检查完成')

  // 种子商品数据（¥198电子书 + ¥299素材库）
  const seedGoods = [
    [1, '消费者纠纷梳理与普法操作指南', 16600, 'ebook', '/images/shop-ebook.png', '', '14类纠纷场景梳理，280+页电子版汇编工具书'],
    [2, '全行业永久工具素材库', 26600, 'material', '/images/shop-material.png', '', '全行业模板合集，可编辑可导出，终身更新权益'],
  ]
  for (const [id, name, price, type, cover, url, desc] of seedGoods) {
    try {
      await query(
        'INSERT IGNORE INTO goods (id, name, price, product_type, cover_image, file_url, description) VALUES (?,?,?,?,?,?,?)',
        [id, name, price, type, cover, url, desc]
      )
      console.log(`[MySQL] 商品种子: ${name}`)
    } catch (e: any) {
      console.warn(`[MySQL] 种子商品跳过: ${e.message}`)
    }
  }
}

// ============================================================
// 报告编号生成器（QX-YYYYMMDD-NNN 每日序列）
// ============================================================
export async function generateReportNo(): Promise<string> {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const seqKey = 'report_' + y + m + d

  // 原子自增
  await query(
    'INSERT INTO sequences (seq_key, seq_value) VALUES (?, 1) ON DUPLICATE KEY UPDATE seq_value = seq_value + 1',
    [seqKey]
  )
  const rows = await query('SELECT seq_value FROM sequences WHERE seq_key = ? LIMIT 1', [seqKey])
  const seq = String(rows[0]?.seq_value || 1).padStart(3, '0')
  return 'QX-' + y + m + d + '-' + seq
}

// ============================================================
// 财务管理：订单汇总 + 收入统计
// ============================================================
export async function getRevenueStats() {
  const [today] = await query(
    "SELECT COALESCE(SUM(amount),0) as todayRevenue, COUNT(*) as todayOrders FROM orders WHERE pay_status='success' AND DATE(paid_at)=CURDATE()"
  )
  const [month] = await query(
    "SELECT COALESCE(SUM(amount),0) as monthRevenue, COUNT(*) as monthOrders FROM orders WHERE pay_status='success' AND YEAR(paid_at)=YEAR(NOW()) AND MONTH(paid_at)=MONTH(NOW())"
  )
  const [total] = await query(
    "SELECT COALESCE(SUM(amount),0) as totalRevenue, COUNT(*) as totalOrders FROM orders WHERE pay_status='success'"
  )
  // 商城订单
  const [mallTotal] = await query(
    "SELECT COALESCE(SUM(amount),0) as mallRevenue, COUNT(*) as mallOrders FROM mall_orders WHERE pay_status='success'"
  )
  return {
    today: { revenue: Number(today?.todayRevenue || 0), orders: Number(today?.todayOrders || 0) },
    thisMonth: { revenue: Number(month?.monthRevenue || 0), orders: Number(month?.monthOrders || 0) },
    total: { revenue: Number(total?.totalRevenue || 0) + Number(mallTotal?.mallRevenue || 0), orders: Number(total?.totalOrders || 0) + Number(mallTotal?.mallOrders || 0) },
    mall: { revenue: Number(mallTotal?.mallRevenue || 0), orders: Number(mallTotal?.mallOrders || 0) },
  }
}

export async function listAllOrders(page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize
  // 合并会员订单和商城订单
  const rows = await query(
    `SELECT order_id, user_id, plan_name as product_name, amount, pay_status, paid_at, created_at, 'member' as order_type FROM orders
     UNION ALL
     SELECT order_id, user_id, goods_name as product_name, amount, pay_status, paid_at, created_at, 'mall' as order_type FROM mall_orders
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [pageSize, offset]
  )
  const [cnt] = await query(
    `SELECT (SELECT COUNT(*) FROM orders) + (SELECT COUNT(*) FROM mall_orders) as total`
  )
  return {
    list: rows.map((r: any) => ({
      orderId: r.order_id,
      userId: r.user_id,
      productName: r.product_name,
      amount: Number(r.amount),
      payStatus: r.pay_status,
      paidAt: r.paid_at,
      createdAt: r.created_at,
      orderType: r.order_type,
    })),
    total: Number(cnt?.total || 0),
    page,
    pageSize,
  }
}