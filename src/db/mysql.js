/**
 * MySQL 连接池（单例）
 * 先连接不带 database，创建库后切换
 */
import mysql from 'mysql2/promise'

let pool = null

function getConfig() {
  return {
    host: process.env.DB_HOST || '10.15.110.221',
    port: Number(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'yaoqixing',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'yaoqixing',
  }
}

async function initDatabase() {
  const cfg = getConfig()
  if (!cfg.password) throw new Error('MySQL 密码未配置（DB_PASS 环境变量）')

  // 腾讯云 MySQL 要求 explicit_zero_for_timestamp 参数，需要显式设置 zerofill
  // 所有 TIMESTAMP 列用 DEFAULT 0 避免 NO_ZERO_DATE 拒绝
  const timestampOpt = 'ERROR_FOR_DIVISION_BY_ZERO=0,NO_ZERO_DATE=0,NO_ZERO_IN_DATE=0'

  // Step1: 先不带 database 连接，用于创建库
  const tempPool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    charset: 'utf8',
    timezone: '+08:00',
    connectTimeout: 10000,
    // 宽松模式，避免严格模式拒绝 TIMESTAMP DEFAULT NULL
    flags: ['-STRICT_TRANS_TABLES', '-STRICT_ALL_TABLES'],
  })

  // 创建数据库（如果不存在）
  await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8 COLLATE utf8_general_ci`)
  console.log(`[MySQL] 库 ${cfg.database} 已就绪`)
  await tempPool.end()

  // Step2: 正式建池
  pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: 'utf8',
    timezone: '+08:00',
    // 宽松模式，TIMESTAMP 允许 0 值
    flags: ['-STRICT_TRANS_TABLES', '-STRICT_ALL_TABLES'],
  })
  console.log(`[MySQL] 连接池创建: ${cfg.host}:${cfg.port}/${cfg.database}`)
  return pool
}

export function getPool() {
  if (!pool) throw new Error('MySQL 池未初始化，调用 initPool() 等待完成')
  return pool
}

export async function initPool() {
  return initDatabase()
}

// 通用查询
export async function query(sql, params = []) {
  const p = getPool()
  const [rows] = await p.query(sql, params)
  return rows
}

// 通用插入，返回自增ID或影响行数
export async function insert(sql, params = []) {
  const p = getPool()
  const [result] = await p.query(sql, params)
  return result.insertId || result.affectedRows || 0
}

// 自动建表（启动时调用）
export async function ensureTables() {
  const p = getPool()

  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      openid         VARCHAR(64)  PRIMARY KEY,
      phone          VARCHAR(20)  DEFAULT NULL,
      unionid        VARCHAR(64)  DEFAULT NULL,
      nickname       VARCHAR(50)  DEFAULT NULL,
      register_source VARCHAR(20) NOT NULL DEFAULT 'wechat',
      is_deleted     TINYINT(1)   DEFAULT 0,
      created_at     TIMESTAMP    DEFAULT 0,
      updated_at     TIMESTAMP    DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8
  `)

  await p.query(`
    CREATE TABLE IF NOT EXISTS drafts (
      report_id   VARCHAR(36)  PRIMARY KEY,
      user_id     VARCHAR(64)  NOT NULL,
      scene       VARCHAR(10)  DEFAULT NULL,
      focus       JSON         DEFAULT NULL,
      evidence    JSON         DEFAULT NULL,
      report_data JSON         DEFAULT NULL,
      is_locked   TINYINT(1)   DEFAULT 0,
      order_id    VARCHAR(36)  DEFAULT NULL,
      is_deleted  TINYINT(1)   DEFAULT 0,
      created_at  TIMESTAMP    DEFAULT 0,
      updated_at  TIMESTAMP    DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8
  `)

  await p.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id        VARCHAR(36)  PRIMARY KEY,
      user_id         VARCHAR(64)  NOT NULL,
      plan_id         VARCHAR(20)  NOT NULL,
      plan_name       VARCHAR(50)  NOT NULL,
      amount          DECIMAL(10,2) NOT NULL,
      pay_status      VARCHAR(20)  DEFAULT 'pending',
      wechat_trade_no VARCHAR(64)  DEFAULT NULL,
      paid_at         TIMESTAMP    DEFAULT 0,
      wx_callback_raw TEXT         DEFAULT NULL,
      created_at      TIMESTAMP    DEFAULT 0,
      updated_at      TIMESTAMP    DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8
  `)

  await p.query(`
    CREATE TABLE IF NOT EXISTS members (
      user_id        VARCHAR(64)  PRIMARY KEY,
      level          VARCHAR(20)  NOT NULL DEFAULT 'free',
      plan_name      VARCHAR(50)  DEFAULT NULL,
      total_times    INT          DEFAULT 0,
      remain_times   INT          DEFAULT 0,
      expire_time    TIMESTAMP    DEFAULT 0,
      renew_discount DECIMAL(3,2) DEFAULT NULL,
      is_deleted     TINYINT(1)   DEFAULT 0,
      created_at     TIMESTAMP    DEFAULT 0,
      updated_at     TIMESTAMP    DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8
  `)

  // 审计日志表（合规必需，用户注销前必须记录操作）
  await p.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id           VARCHAR(36)  PRIMARY KEY,
      user_id      VARCHAR(64)  NOT NULL,
      action_type  VARCHAR(30)  NOT NULL,
      target_id    VARCHAR(36)  DEFAULT NULL,
      ip_address   VARCHAR(45)  DEFAULT NULL,
      user_agent   TEXT         DEFAULT NULL,
      created_at   TIMESTAMP    DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8
  `)

  console.log('[MySQL] 全部表创建/检查完成')
}