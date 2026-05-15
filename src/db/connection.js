/**
 * MySQL 连接池（非阻塞初始化）
 * MySQL 不可用时自动降级到 Mock 模式，不影响服务启动
 */

import mysql from 'mysql2/promise';
import { config } from '../config/index.js';
import { runMigrate } from './migrate.js';

const poolConfig = {
  host: config.db?.host || 'localhost',
  port: config.db?.port || 3306,
  user: config.db?.user || 'root',
  password: config.db?.password || '',
  database: config.db?.name || 'qxt',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let mysqlAvailable = false;
let mysqlChecked = false;

// 通知各模块 MySQL 可用性
const listeners = [];

export function onMysqlAvailable(callback) {
  listeners.push(callback);
}

function notifyListeners(available) {
  for (const cb of listeners) cb(available);
}

function checkMysql() {
  if (mysqlChecked) return;
  mysqlChecked = true;

  try {
    pool = mysql.createPool(poolConfig);

    const timer = setTimeout(() => {
      if (!mysqlAvailable) {
        console.warn('[DB] ⚠️  MySQL 连接超时（5s），自动切换到 Mock 模式');
        notifyListeners(false);
      }
    }, 5000);

    pool.getConnection()
      .then(async (conn) => {
        clearTimeout(timer);
        mysqlAvailable = true;
        notifyListeners(true);
        console.log('[DB] ✅ MySQL 连接成功');
        conn.release();
        // 自动建表
        try {
          await runMigrate(pool);
        } catch (mErr) {
          console.warn('[DB] ⚠️  迁移异常:', mErr.message);
        }
      })
      .catch(err => {
        clearTimeout(timer);
        mysqlAvailable = false;
        notifyListeners(false);
        console.warn('[DB] ⚠️  MySQL 连接失败，使用 Mock 模式:', err.message);
      });
  } catch (err) {
    mysqlAvailable = false;
    notifyListeners(false);
    console.warn('[DB] ⚠️  MySQL 初始化异常，使用 Mock 模式:', err.message);
  }
}

// 延迟启动，等 Fastify/JWT 先初始化
setTimeout(checkMysql, 200);

export function isMysqlAvailable() {
  return mysqlAvailable;
}

export function getPool() {
  if (!mysqlAvailable || !pool) return null;
  return pool;
}
