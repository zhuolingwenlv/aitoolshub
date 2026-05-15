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

  // Step1: 先不带 database 连接，用于创建库
  const tempPool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    charset: 'utf8',
    timezone: '+08:00',
    connectTimeout: 10000,
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

export function getPool() {
  if (!pool) throw new Error('MySQL 池未初始化，调用 initPool() 等待完成')
  return pool
}

export async function initPool() {
  return initDatabase()
}