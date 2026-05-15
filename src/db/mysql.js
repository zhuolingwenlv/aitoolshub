/**
 * MySQL 连接池（单例）
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

export function getPool() {
  if (pool) return pool
  const cfg = getConfig()
  if (!cfg.password) {
    throw new Error('MySQL 密码未配置（DB_PASS 环境变量）')
  }
  pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: 'utf8',
    timezone: '+08:00',
  })
  console.log(`[MySQL] 连接池创建: ${cfg.host}:${cfg.port}/${cfg.database}`)
  return pool
}

export async function query(sql, params = []) {
  const p = getPool()
  const [rows] = await p.query(sql, params)
  return rows
}

export async function insert(sql, params = []) {
  const p = getPool()
  const [result] = await p.query(sql, params)
  return result.insertId
}

export async function testConnection() {
  try {
    await query('SELECT 1 AS ok')
    console.log('[MySQL] ✅ 连接正常')
    return true
  } catch (err) {
    console.error('[MySQL] ❌ 连接失败:', err.message)
    return false
  }
}
