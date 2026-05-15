/**
 * MySQL 迁移脚本 - 自动建表（幂等）
 * 启动时调用 runMigrate(pool)
 */

export async function runMigrate(pool) {
  const sqls = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      openid VARCHAR(64) UNIQUE NOT NULL,
      nickname VARCHAR(64) DEFAULT '',
      phone VARCHAR(20) DEFAULT '',
      avatar VARCHAR(255) DEFAULT '',
      city VARCHAR(64) DEFAULT '',
      member_level ENUM('normal','vip','svip','black') DEFAULT 'normal',
      member_expire DATETIME DEFAULT NULL,
      report_count INT DEFAULT 0,
      total_reports INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_active DATETIME DEFAULT NULL,
      INDEX idx_openid (openid),
      INDEX idx_phone (phone)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS members (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      level ENUM('vip','svip','black') NOT NULL,
      start_date DATE NOT NULL,
      expire_date DATE NOT NULL,
      total_reports INT DEFAULT 0,
      auto_renew TINYINT DEFAULT 0,
      source ENUM('wxpay','gift','admin') DEFAULT 'wxpay',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_expire (expire_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      order_no VARCHAR(64) UNIQUE NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      product_name VARCHAR(128) DEFAULT '',
      product_type VARCHAR(32) DEFAULT '',
      amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      pay_status ENUM('pending','paid','refunded','closed') DEFAULT 'pending',
      pay_time DATETIME DEFAULT NULL,
      transaction_id VARCHAR(128) DEFAULT '',
      prepay_id VARCHAR(128) DEFAULT '',
      refund_time DATETIME DEFAULT NULL,
      refund_amount DECIMAL(10,2) DEFAULT NULL,
      refund_reason VARCHAR(256) DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_order_no (order_no),
      INDEX idx_user_id (user_id),
      INDEX idx_pay_status (pay_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS reports (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      order_id VARCHAR(36) DEFAULT '',
      report_type VARCHAR(64) DEFAULT '',
      dispute_type VARCHAR(64) DEFAULT '',
      report_title VARCHAR(256) DEFAULT '',
      pdf_url VARCHAR(512) DEFAULT '',
      pdf_path VARCHAR(256) DEFAULT '',
      status ENUM('generating','completed','failed') DEFAULT 'generating',
      score INT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME DEFAULT NULL,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS admin_logs (
      id VARCHAR(36) PRIMARY KEY,
      admin_id VARCHAR(64) DEFAULT '',
      action ENUM('extend_member','gift_report','refund','update_user') NOT NULL,
      target_user VARCHAR(36) DEFAULT '',
      detail TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_admin (admin_id),
      INDEX idx_target (target_user)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  ];

  for (const sql of sqls) {
    try {
      await pool.query(sql);
    } catch (err) {
      // 忽略 "table already exists" 错误
      if (!err.message.includes('already exists')) {
        console.warn('[Migrate] 警告:', err.message);
      }
    }
  }
  console.log('[Migrate] ✅ 数据库表结构就绪');
}
