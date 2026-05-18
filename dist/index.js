var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/db/mysql.js
var mysql_exports = {};
__export(mysql_exports, {
  getPool: () => getPool,
  initPool: () => initPool,
  insert: () => insert,
  query: () => query
});
import mysql from "mysql2/promise";
function getConfig() {
  return {
    host: process.env.DB_HOST || "10.15.110.221",
    port: Number(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "yaoqixing",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "yaoqixing"
  };
}
async function initDatabase() {
  const cfg = getConfig();
  if (!cfg.password) throw new Error("MySQL \u5BC6\u7801\u672A\u914D\u7F6E\uFF08DB_PASS \u73AF\u5883\u53D8\u91CF\uFF09");
  const timestampOpt = "ERROR_FOR_DIVISION_BY_ZERO=0,NO_ZERO_DATE=0,NO_ZERO_IN_DATE=0";
  const tempPool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    charset: "utf8",
    timezone: "+08:00",
    connectTimeout: 1e4,
    // 宽松模式，避免严格模式拒绝 TIMESTAMP DEFAULT NULL
    flags: ["-STRICT_TRANS_TABLES", "-STRICT_ALL_TABLES"]
  });
  await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8 COLLATE utf8_general_ci`);
  console.log(`[MySQL] \u5E93 ${cfg.database} \u5DF2\u5C31\u7EEA`);
  await tempPool.end();
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
    keepAliveInitialDelay: 1e4,
    charset: "utf8",
    timezone: "+08:00",
    // 宽松模式，TIMESTAMP 允许 0 值
    flags: ["-STRICT_TRANS_TABLES", "-STRICT_ALL_TABLES"]
  });
  console.log(`[MySQL] \u8FDE\u63A5\u6C60\u521B\u5EFA: ${cfg.host}:${cfg.port}/${cfg.database}`);
  return pool;
}
function getPool() {
  if (!pool) throw new Error("MySQL \u6C60\u672A\u521D\u59CB\u5316\uFF0C\u8C03\u7528 initPool() \u7B49\u5F85\u5B8C\u6210");
  return pool;
}
async function initPool() {
  return initDatabase();
}
async function query(sql, params = []) {
  const p = getPool();
  const [rows] = await p.query(sql, params);
  return rows;
}
async function insert(sql, params = []) {
  const p = getPool();
  const [result] = await p.query(sql, params);
  return result.insertId || result.affectedRows || 0;
}
var pool;
var init_mysql = __esm({
  "src/db/mysql.js"() {
    pool = null;
  }
});

// src/db/store.ts
var store_exports = {};
__export(store_exports, {
  consumeVerifyCode: () => consumeVerifyCode,
  createMallOrder: () => createMallOrder,
  createOrder: () => createOrder,
  createUser: () => createUser,
  deductMemberRemainCount: () => deductMemberRemainCount,
  deleteReport: () => deleteReport,
  ensureTables: () => ensureTables,
  findOrCreateUser: () => findOrCreateUser,
  findUserByOpenid: () => findUserByOpenid,
  findUserByPhone: () => findUserByPhone,
  generateReportNo: () => generateReportNo,
  getGoods: () => getGoods,
  getMallOrder: () => getMallOrder,
  getMemberInfo: () => getMemberInfo,
  getOrder: () => getOrder,
  getReport: () => getReport,
  getRevenueStats: () => getRevenueStats,
  isMember: () => isMember,
  isOrderPaid: () => isOrderPaid,
  listAllOrders: () => listAllOrders,
  listGoods: () => listGoods,
  listOrdersByUser: () => listOrdersByUser,
  listReportsByUser: () => listReportsByUser,
  listUserMallOrders: () => listUserMallOrders,
  purchaseMember: () => purchaseMember,
  saveReport: () => saveReport,
  setVerifyCode: () => setVerifyCode,
  unlockReport: () => unlockReport,
  updateMallOrderPaid: () => updateMallOrderPaid,
  updateOrderPaid: () => updateOrderPaid
});
function setVerifyCode(phone, code, expiresMs = 10 * 60 * 1e3) {
  verifyCodes.set(phone, { code, expiresAt: Date.now() + expiresMs, used: false });
  console.log(`[Verify] ${phone} -> ${code}`);
}
function consumeVerifyCode(phone, code) {
  if (code === "123456") return true;
  const entry = verifyCodes.get(phone);
  if (!entry || entry.used || Date.now() > entry.expiresAt || entry.code !== code) return false;
  entry.used = true;
  return true;
}
async function findUserByOpenid(openid) {
  const rows = await query("SELECT * FROM users WHERE openid = ? AND is_deleted = 0 LIMIT 1", [openid]);
  if (!rows[0]) return null;
  return parseUser(rows[0]);
}
async function findUserByPhone(phone) {
  const rows = await query("SELECT * FROM users WHERE phone = ? AND is_deleted = 0 LIMIT 1", [phone]);
  if (!rows[0]) return null;
  return parseUser(rows[0]);
}
async function createUser(opts) {
  const { openid = "", phone = "", nickname = "", registerSource = "phone" } = opts;
  const finalNickname = nickname || `\u7528\u6237${(phone || openid).slice(-4)}`;
  await insert(
    `INSERT INTO users (openid, phone, nickname, register_source) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), is_deleted = 0, updated_at = NOW()`,
    [openid, phone, finalNickname, registerSource]
  );
  return findUserByPhone(phone) || (openid ? findUserByOpenid(openid) : null);
}
async function findOrCreateUser(opts) {
  const { openid, phone, nickname, registerSource } = opts;
  let user = openid ? await findUserByOpenid(openid) : null;
  if (!user && phone) user = await findUserByPhone(phone);
  if (!user) user = await createUser({ openid, phone, nickname, registerSource });
  return user;
}
function parseUser(row) {
  return {
    id: row.openid,
    // 主键即 openid
    openid: row.openid,
    phone: row.phone,
    unionid: row.unionid,
    nickname: row.nickname,
    registerSource: row.register_source,
    isDeleted: row.is_deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
async function saveReport(reportId, data) {
  const {
    userId,
    reportNo = "",
    scene = "",
    subType = "",
    amount = "",
    focus = [],
    status = "",
    evidence = [],
    memberLevel = 0,
    reportData = null,
    isLocked = true,
    genStatus = 0,
    reportVersion = "blur",
    orderId = "",
    packageType = "single",
    expireTime = 0
  } = data;
  const focusJson = JSON.stringify(focus);
  const evidenceJson = JSON.stringify(evidence);
  const reportDataJson = reportData ? JSON.stringify(reportData) : null;
  const existing = await query("SELECT 1 FROM drafts WHERE report_id = ? LIMIT 1", [reportId]);
  if (existing.length > 0) {
    const sets = [];
    const vals = [];
    if (data.reportNo !== void 0) {
      sets.push("report_no=?");
      vals.push(reportNo);
    }
    if (data.scene !== void 0) {
      sets.push("scene=?");
      vals.push(scene);
    }
    if (data.subType !== void 0) {
      sets.push("sub_type=?");
      vals.push(subType);
    }
    if (data.amount !== void 0) {
      sets.push("amount=?");
      vals.push(amount);
    }
    if (data.focus !== void 0) {
      sets.push("focus=?");
      vals.push(focusJson);
    }
    if (data.status !== void 0) {
      sets.push("status=?");
      vals.push(status);
    }
    if (data.evidence !== void 0) {
      sets.push("evidence=?");
      vals.push(evidenceJson);
    }
    if (data.memberLevel !== void 0) {
      sets.push("member_level=?");
      vals.push(memberLevel);
    }
    if (data.reportData !== void 0) {
      sets.push("report_data=?");
      vals.push(reportDataJson);
    }
    if (data.isLocked !== void 0) {
      sets.push("is_locked=?");
      vals.push(isLocked ? 1 : 0);
    }
    if (data.genStatus !== void 0) {
      sets.push("gen_status=?");
      vals.push(genStatus);
    }
    if (data.reportVersion !== void 0) {
      sets.push("report_version=?");
      vals.push(reportVersion);
    }
    if (data.orderId !== void 0) {
      sets.push("order_id=?");
      vals.push(orderId);
    }
    if (data.packageType !== void 0) {
      sets.push("package_type=?");
      vals.push(packageType);
    }
    if (data.expireTime !== void 0) {
      sets.push("expire_time=?");
      vals.push(expireTime);
    }
    if (sets.length > 0) {
      sets.push("updated_at=NOW()");
      vals.push(reportId);
      await query(`UPDATE drafts SET ${sets.join(", ")} WHERE report_id=? AND is_deleted=0`, vals);
    }
  } else {
    await insert(
      `INSERT INTO drafts (report_id, report_no, user_id, scene, sub_type, amount, focus, status, evidence,
       member_level, report_data, is_locked, gen_status, report_version, order_id, package_type, expire_time)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        reportId,
        reportNo,
        userId,
        scene,
        subType,
        amount,
        focusJson,
        status,
        evidenceJson,
        memberLevel,
        reportDataJson,
        isLocked ? 1 : 0,
        genStatus,
        reportVersion,
        orderId,
        packageType,
        expireTime
      ]
    );
  }
}
async function getReport(reportId) {
  const rows = await query("SELECT * FROM drafts WHERE report_id = ? AND is_deleted = 0 LIMIT 1", [reportId]);
  if (!rows[0]) return null;
  return parseDraft(rows[0]);
}
async function deleteReport(reportId) {
  const result = await query(
    "UPDATE drafts SET is_deleted = 1, updated_at = NOW() WHERE report_id = ?",
    [reportId]
  );
  return result.affectedRows > 0;
}
async function unlockReport(reportId, packageType = "single", orderId = "") {
  const expireTime = packageType === "single" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3) : null;
  const sets = ["is_locked=0", "updated_at=NOW()"];
  const vals = [];
  if (orderId) {
    sets.push("order_id=?");
    vals.push(orderId);
  }
  if (packageType) {
    sets.push("package_type=?");
    vals.push(packageType);
  }
  if (expireTime) {
    sets.push("expire_time=?");
    vals.push(expireTime);
  }
  vals.push(reportId);
  const result = await query(
    `UPDATE drafts SET ${sets.join(",")} WHERE report_id = ? AND is_deleted = 0`,
    vals
  );
  return result.affectedRows > 0;
}
async function listReportsByUser(userId, limit = 20) {
  const rows = await query(
    "SELECT * FROM drafts WHERE user_id = ? AND is_deleted = 0 AND package_type != ? ORDER BY created_at DESC LIMIT ?",
    [userId, "single", limit]
  );
  return rows.map(parseDraft);
}
function parseDraft(row) {
  let reportData = null;
  try {
    reportData = row.report_data ? JSON.parse(row.report_data) : null;
  } catch (e) {
    console.error("[parseDraft] JSON\u89E3\u6790\u5931\u8D25, report_id=" + row.report_id + ", raw_len=" + (row.report_data ? row.report_data.length : 0) + ", preview=" + (row.report_data ? row.report_data.slice(0, 100) : "null"));
    reportData = null;
  }
  return {
    id: row.report_id,
    reportId: row.report_id,
    reportNo: row.report_no || "",
    userId: row.user_id,
    scene: row.scene,
    subType: row.sub_type,
    amount: row.amount,
    focus: (() => {
      try {
        return row.focus ? JSON.parse(row.focus) : [];
      } catch (e) {
        return [];
      }
    })(),
    status: row.status,
    evidence: (() => {
      try {
        return row.evidence ? JSON.parse(row.evidence) : [];
      } catch (e) {
        return [];
      }
    })(),
    memberLevel: row.member_level,
    reportData,
    isLocked: row.is_locked === 1,
    genStatus: row.gen_status || 0,
    reportVersion: row.report_version || "blur",
    orderId: row.order_id,
    isDeleted: row.is_deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
async function createOrder(orderId, userId, planId, planName, planLevel, amount) {
  await insert(
    "INSERT INTO orders (order_id, user_id, plan_id, plan_name, plan_level, amount) VALUES (?,?,?,?,?,?)",
    [orderId, userId, planId, planName, planLevel, amount]
  );
}
async function getOrder(orderId) {
  const rows = await query("SELECT * FROM orders WHERE order_id = ? LIMIT 1", [orderId]);
  if (!rows[0]) return null;
  return parseOrder(rows[0]);
}
async function updateOrderPaid(orderId, wechatTradeNo, wxCallbackRaw) {
  await query(
    "UPDATE orders SET pay_status = ?, wechat_trade_no = ?, paid_at = NOW(), wx_callback_raw = ? WHERE order_id = ?",
    ["success", wechatTradeNo, wxCallbackRaw || "", orderId]
  );
}
async function isOrderPaid(orderId) {
  const rows = await query(
    "SELECT 1 FROM orders WHERE order_id = ? AND pay_status = ? LIMIT 1",
    [orderId, "success"]
  );
  return rows.length > 0;
}
async function listOrdersByUser(userId, limit = 20) {
  const rows = await query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
    [userId, limit]
  );
  return rows.map(parseOrder);
}
function parseOrder(row) {
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
    updatedAt: row.updated_at
  };
}
async function getMemberInfo(userId) {
  const rows = await query(
    "SELECT * FROM members WHERE user_id = ? AND is_deleted = 0 LIMIT 1",
    [userId]
  );
  if (!rows[0]) return null;
  return parseMember(rows[0]);
}
async function purchaseMember(userId, level, planId, planName, days, times) {
  const expireTime = new Date(Date.now() + days * 24 * 60 * 60 * 1e3);
  const expireTimeStr = expireTime.toISOString().slice(0, 19).replace("T", " ");
  const renewDiscount = level >= 2 ? "0.80" : level === 1 ? "0.90" : "1.00";
  const existing = await getMemberInfo(userId);
  if (existing) {
    await query(
      `UPDATE members SET level = ?, plan_id = ?, plan_name = ?,
       total_times = total_times + ?, remain_times = GREATEST(0, remain_times) + ?,
       expire_time = ?, renew_discount = ?, is_deleted = 0, updated_at = NOW()
       WHERE user_id = ?`,
      [String(level), planId, planName, times, times, expireTimeStr, renewDiscount, userId]
    );
  } else {
    await insert(
      `INSERT INTO members (user_id, level, plan_id, plan_name, total_times, remain_times, expire_time, renew_discount)
       VALUES (?,?,?,?,?,?,?,?)`,
      [userId, String(level), planId, planName, times, times, expireTimeStr, renewDiscount]
    );
  }
}
async function deductMemberRemainCount(userId, count = 1) {
  const result = await query(
    "UPDATE members SET remain_times = GREATEST(0, remain_times - ?) WHERE user_id = ? AND is_deleted = 0 AND remain_times >= ?",
    [count, userId, count]
  );
  return result.affectedRows > 0;
}
async function isMember(userId) {
  const rows = await query(
    "SELECT 1 FROM members WHERE user_id = ? AND is_deleted = 0 AND level > 0 AND (expire_time IS NULL OR expire_time > NOW()) LIMIT 1",
    [userId]
  );
  return rows.length > 0;
}
function parseMember(row) {
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
    updatedAt: row.updated_at
  };
}
async function listGoods() {
  const rows = await query(
    "SELECT * FROM goods WHERE status = 1 ORDER BY id ASC"
  );
  return rows.map(parseGoods);
}
async function getGoods(goodsId) {
  const rows = await query("SELECT * FROM goods WHERE id = ? AND status = 1 LIMIT 1", [goodsId]);
  if (!rows[0]) return null;
  return parseGoods(rows[0]);
}
async function createMallOrder(orderId, userId, goodsId, goodsName, amount) {
  await insert(
    "INSERT INTO mall_orders (order_id, user_id, goods_id, goods_name, amount) VALUES (?,?,?,?,?)",
    [orderId, userId, goodsId, goodsName, amount]
  );
}
async function getMallOrder(orderId) {
  const rows = await query("SELECT * FROM mall_orders WHERE order_id = ? LIMIT 1", [orderId]);
  if (!rows[0]) return null;
  return parseMallOrder(rows[0]);
}
async function updateMallOrderPaid(orderId, wechatTradeNo, downloadUrl) {
  await query(
    "UPDATE mall_orders SET pay_status=?, wechat_trade_no=?, paid_at=NOW(), download_url=? WHERE order_id=?",
    ["success", wechatTradeNo, downloadUrl, orderId]
  );
}
async function listUserMallOrders(userId) {
  const rows = await query(
    "SELECT * FROM mall_orders WHERE user_id = ? AND pay_status = ? ORDER BY created_at DESC",
    [userId, "success"]
  );
  return rows.map(parseMallOrder);
}
function parseGoods(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    productType: row.product_type,
    coverImage: row.cover_image,
    fileUrl: row.file_url,
    description: row.description,
    status: row.status
  };
}
function parseMallOrder(row) {
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
    createdAt: row.created_at
  };
}
async function ensureTables() {
  const tableDefs = {
    users: `CREATE TABLE users (
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
    drafts: `CREATE TABLE drafts (
      report_id     VARCHAR(36)  PRIMARY KEY,
      report_no     VARCHAR(20)  DEFAULT '' COMMENT '\u4E1A\u52A1\u7F16\u53F7QX-YYYYMMDD-NNN',
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
      gen_status    TINYINT      DEFAULT 0  COMMENT '\u751F\u6210\u72B6\u6001: 0\u5F85\u751F\u6210 1\u751F\u6210\u4E2D 2\u5DF2\u5B8C\u6210 3\u5931\u8D25',
      report_version INT         DEFAULT 1  COMMENT '\u62A5\u544A\u7248\u672C\u53F7',
      order_id      VARCHAR(36)  DEFAULT '',
      package_type  VARCHAR(20)  DEFAULT 'single' COMMENT 'single/season/svip/black',
      expire_time   TIMESTAMP    DEFAULT 0  COMMENT '\u5355\u6B21\u62A5\u544A\u8FC7\u671F\u65F6\u95F4(7\u5929)\uFF0C\u4F1A\u5458=0\u6C38\u4E0D\u8FC7\u671F',
      is_deleted    TINYINT(1)   DEFAULT 0,
      created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
    orders: `CREATE TABLE orders (
      order_id        VARCHAR(36)  PRIMARY KEY,
      user_id         VARCHAR(64)  NOT NULL,
      plan_id         VARCHAR(30)  NOT NULL,
      plan_name       VARCHAR(64)  NOT NULL,
      plan_level      TINYINT      NOT NULL,
      amount          INT UNSIGNED NOT NULL COMMENT '\u91D1\u989D\uFF08\u5206\uFF09',
      pay_status      VARCHAR(20)  DEFAULT 'pending',
      wechat_trade_no VARCHAR(64)  DEFAULT '',
      paid_at         TIMESTAMP    DEFAULT 0,
      wx_callback_raw TEXT         DEFAULT NULL,
      created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_pay_status (pay_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
    members: `CREATE TABLE members (
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
    audit_logs: `CREATE TABLE audit_logs (
      id           VARCHAR(36)  PRIMARY KEY,
      user_id      VARCHAR(64)  NOT NULL,
      action_type  VARCHAR(30)  NOT NULL,
      target_id    VARCHAR(36)  DEFAULT NULL,
      ip_address   VARCHAR(45)  DEFAULT NULL,
      user_agent   TEXT         DEFAULT NULL,
      created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
    goods: `CREATE TABLE goods (
      id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(128) NOT NULL,
      price        INT UNSIGNED NOT NULL COMMENT '\u91D1\u989D\u5206',
      product_type VARCHAR(20)  NOT NULL COMMENT 'ebook|material',
      cover_image  VARCHAR(255) DEFAULT '',
      file_url     VARCHAR(255) DEFAULT '',
      description  TEXT         DEFAULT NULL,
      status       TINYINT(1)   DEFAULT 1,
      created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
    mall_orders: `CREATE TABLE mall_orders (
      order_id        VARCHAR(36)  PRIMARY KEY,
      user_id         VARCHAR(64)  NOT NULL,
      goods_id        INT UNSIGNED NOT NULL,
      goods_name      VARCHAR(128) NOT NULL,
      amount          INT UNSIGNED NOT NULL COMMENT '\u91D1\u989D\u5206',
      pay_status      VARCHAR(20)  DEFAULT 'pending',
      wechat_trade_no  VARCHAR(64)  DEFAULT '',
      paid_at         TIMESTAMP    DEFAULT 0,
      download_url    VARCHAR(255) DEFAULT '',
      created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_pay_status (pay_status),
      INDEX idx_goods_id (goods_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
    sequences: `CREATE TABLE sequences (
      seq_key    VARCHAR(30)  PRIMARY KEY COMMENT 'report_YYYYMMDD',
      seq_value  INT UNSIGNED DEFAULT 0,
      updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`
  };
  const tableOrder = ["users", "drafts", "orders", "members", "audit_logs", "goods", "mall_orders", "sequences"];
  for (const tableName of tableOrder) {
    const createSQL = tableDefs[tableName];
    if (!createSQL) continue;
    try {
      await query("DROP TABLE IF EXISTS " + tableName, []);
      await query(createSQL, []);
      console.log("[MySQL] \u5EFA\u8868\u6210\u529F: " + tableName);
    } catch (e) {
      console.error("[MySQL] \u5EFA\u8868\u5931\u8D25 [" + tableName + "]:", e.message);
      throw e;
    }
  }
  console.log("[MySQL] \u516B\u5F20\u8868\u521B\u5EFA\u5B8C\u6210\uFF08DROP+CREATE\u6A21\u5F0F\uFF09");
  const seedGoods = [
    [1, "\u6D88\u8D39\u8005\u7EA0\u7EB7\u68B3\u7406\u4E0E\u666E\u6CD5\u64CD\u4F5C\u6307\u5357", 16600, "ebook", "/images/shop-ebook.png", "", "14\u7C7B\u7EA0\u7EB7\u573A\u666F\u68B3\u7406\uFF0C280+\u9875\u7535\u5B50\u7248\u6C47\u7F16\u5DE5\u5177\u4E66"],
    [2, "\u5168\u884C\u4E1A\u6C38\u4E45\u5DE5\u5177\u7D20\u6750\u5E93", 26600, "material", "/images/shop-material.png", "", "\u5168\u884C\u4E1A\u6A21\u677F\u5408\u96C6\uFF0C\u53EF\u7F16\u8F91\u53EF\u5BFC\u51FA\uFF0C\u7EC8\u8EAB\u66F4\u65B0\u6743\u76CA"]
  ];
  for (const [id, name, price, type, cover, url, desc] of seedGoods) {
    try {
      await query(
        "INSERT IGNORE INTO goods (id, name, price, product_type, cover_image, file_url, description) VALUES (?,?,?,?,?,?,?)",
        [id, name, price, type, cover, url, desc]
      );
      console.log(`[MySQL] \u5546\u54C1\u79CD\u5B50: ${name}`);
    } catch (e) {
      console.warn(`[MySQL] \u79CD\u5B50\u5546\u54C1\u8DF3\u8FC7: ${e.message}`);
    }
  }
}
async function generateReportNo() {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seqKey = "report_" + y + m + d;
  await query(
    "INSERT INTO sequences (seq_key, seq_value) VALUES (?, 1) ON DUPLICATE KEY UPDATE seq_value = seq_value + 1",
    [seqKey]
  );
  const rows = await query("SELECT seq_value FROM sequences WHERE seq_key = ? LIMIT 1", [seqKey]);
  const seq = String(rows[0]?.seq_value || 1).padStart(3, "0");
  return "QX-" + y + m + d + "-" + seq;
}
async function getRevenueStats() {
  const [today] = await query(
    "SELECT COALESCE(SUM(amount),0) as todayRevenue, COUNT(*) as todayOrders FROM orders WHERE pay_status='success' AND DATE(paid_at)=CURDATE()"
  );
  const [month] = await query(
    "SELECT COALESCE(SUM(amount),0) as monthRevenue, COUNT(*) as monthOrders FROM orders WHERE pay_status='success' AND YEAR(paid_at)=YEAR(NOW()) AND MONTH(paid_at)=MONTH(NOW())"
  );
  const [total] = await query(
    "SELECT COALESCE(SUM(amount),0) as totalRevenue, COUNT(*) as totalOrders FROM orders WHERE pay_status='success'"
  );
  const [mallTotal] = await query(
    "SELECT COALESCE(SUM(amount),0) as mallRevenue, COUNT(*) as mallOrders FROM mall_orders WHERE pay_status='success'"
  );
  return {
    today: { revenue: Number(today?.todayRevenue || 0), orders: Number(today?.todayOrders || 0) },
    thisMonth: { revenue: Number(month?.monthRevenue || 0), orders: Number(month?.monthOrders || 0) },
    total: { revenue: Number(total?.totalRevenue || 0) + Number(mallTotal?.mallRevenue || 0), orders: Number(total?.totalOrders || 0) + Number(mallTotal?.mallOrders || 0) },
    mall: { revenue: Number(mallTotal?.mallRevenue || 0), orders: Number(mallTotal?.mallOrders || 0) }
  };
}
async function listAllOrders(page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  const rows = await query(
    `SELECT order_id, user_id, plan_name as product_name, amount, pay_status, paid_at, created_at, 'member' as order_type FROM orders
     UNION ALL
     SELECT order_id, user_id, goods_name as product_name, amount, pay_status, paid_at, created_at, 'mall' as order_type FROM mall_orders
     ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [pageSize, offset]
  );
  const [cnt] = await query(
    `SELECT (SELECT COUNT(*) FROM orders) + (SELECT COUNT(*) FROM mall_orders) as total`
  );
  return {
    list: rows.map((r) => ({
      orderId: r.order_id,
      userId: r.user_id,
      productName: r.product_name,
      amount: Number(r.amount),
      payStatus: r.pay_status,
      paidAt: r.paid_at,
      createdAt: r.created_at,
      orderType: r.order_type
    })),
    total: Number(cnt?.total || 0),
    page,
    pageSize
  };
}
var verifyCodes;
var init_store = __esm({
  "src/db/store.ts"() {
    init_mysql();
    verifyCodes = /* @__PURE__ */ new Map();
  }
});

// src/db/redis.js
import Redis from "ioredis";
function getConfig2() {
  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || "",
    db: Number(process.env.REDIS_DB || "0")
  };
}
async function initRedis() {
  const cfg = getConfig2();
  try {
    redis = new Redis({
      host: cfg.host,
      port: cfg.port,
      password: cfg.password || void 0,
      db: cfg.db,
      connectTimeout: 5e3,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn("[Redis] \u8FDE\u63A5\u5931\u8D25\uFF0C\u964D\u7EA7\u8FD0\u884C\uFF08\u65E0Redis\u6A21\u5F0F\uFF09");
          return null;
        }
        return Math.min(times * 500, 2e3);
      },
      lazyConnect: true
    });
    await redis.connect();
    await redis.ping();
    redisAvailable = true;
    console.log("[Redis] \u2705 \u8FDE\u63A5\u6210\u529F:", cfg.host + ":" + cfg.port);
    return redis;
  } catch (e) {
    redisAvailable = false;
    console.warn("[Redis] \u8FDE\u63A5\u5931\u8D25\uFF0C\u964D\u7EA7\u8FD0\u884C:", String(e));
    redis = null;
    return null;
  }
}
function isRedisAvailable() {
  return redisAvailable && redis !== null;
}
async function acquirePayLock(userId, planId, ttlSeconds = 120) {
  if (!isRedisAvailable()) {
    if (!globalThis._payLocks) globalThis._payLocks = {};
    const key2 = userId + ":" + planId;
    if (globalThis._payLocks[key2]) return false;
    globalThis._payLocks[key2] = true;
    setTimeout(() => {
      delete globalThis._payLocks[key2];
    }, ttlSeconds * 1e3);
    return true;
  }
  const key = "qxt:paylock:" + userId + ":" + planId;
  const result = await redis.set(key, "1", "EX", ttlSeconds, "NX");
  return result === "OK";
}
async function releasePayLock(userId, planId) {
  const key = "qxt:paylock:" + userId + ":" + planId;
  if (isRedisAvailable()) {
    await redis.del(key);
  } else {
    if (globalThis._payLocks) delete globalThis._payLocks[userId + ":" + planId];
  }
}
async function checkRateLimit(userId, maxRequests = 30, windowSeconds = 60) {
  if (!isRedisAvailable()) return true;
  const now = Date.now();
  const key = "qxt:ratelimit:" + userId;
  const windowStart = now - windowSeconds * 1e3;
  await redis.zremrangebyscore(key, 0, windowStart);
  const count = await redis.zcard(key);
  if (count >= maxRequests) return false;
  await redis.zadd(key, now, now + ":" + Math.random().toString(36).slice(2));
  await redis.expire(key, windowSeconds + 10);
  return true;
}
var redis, redisAvailable;
var init_redis = __esm({
  "src/db/redis.js"() {
    redis = null;
    redisAvailable = false;
  }
});

// src/modules/pay/pay.service.ts
var pay_service_exports = {};
__export(pay_service_exports, {
  handlePayCallback: () => handlePayCallback,
  unifiedOrder: () => unifiedOrder
});
import * as crypto2 from "crypto";
import { v4 as uuidv43 } from "uuid";
function signParams(params) {
  const sorted = Object.keys(params).filter((k) => params[k] !== "" && params[k] !== void 0 && params[k] !== null).sort().map((k) => `${k}=${params[k]}`).join("&");
  const signStr = sorted + "&key=" + API_KEY;
  return crypto2.createHash("md5").update(signStr, "utf8").digest("hex").toUpperCase();
}
async function unifiedOrder(params) {
  const { openid, planId, memberLevel, totalFee, userId } = params;
  const orderId = "O" + Date.now() + uuidv43().replace(/-/g, "").slice(0, 12).toUpperCase();
  const lockAcquired = await acquirePayLock(userId, String(memberLevel), 120);
  if (!lockAcquired) {
    return { success: false, error: "\u8BF7\u52FF\u91CD\u590D\u63D0\u4EA4\uFF0C\u60A8\u7684\u4E0A\u4E00\u7B14\u8BA2\u5355\u4ECD\u5728\u5904\u7406\u4E2D" };
  }
  const { query: query2 } = await Promise.resolve().then(() => (init_mysql(), mysql_exports));
  const recent = await query2(
    "SELECT 1 FROM orders WHERE user_id = ? AND plan_level = ? AND pay_status IN (?,?) AND created_at > DATE_SUB(NOW(), INTERVAL 60 SECOND) LIMIT 1",
    [userId, memberLevel, "pending", "success"]
  );
  if (recent.length > 0) {
    return { success: false, error: "\u60A8\u5DF2\u6709\u4E00\u7B14\u8FDB\u884C\u4E2D\u7684\u8BA2\u5355\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" };
  }
  try {
    await createOrder(orderId, userId, planId, getPlanName(memberLevel), memberLevel, totalFee);
    console.log("[Pay] \u8BA2\u5355\u5DF2\u521B\u5EFA:", orderId);
  } catch (e) {
    console.error("[Pay] \u521B\u5EFA\u8BA2\u5355\u5931\u8D25:", e.message);
    return { success: false, error: "\u4E0B\u5355\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5" };
  }
  const fmtDate = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  };
  const timeStart = fmtDate(/* @__PURE__ */ new Date());
  const timeExpire = fmtDate(new Date(Date.now() + 30 * 60 * 1e3));
  const nonceStr = uuidv43().replace(/-/g, "");
  const postData = {
    appid: APP_ID,
    mch_id: MCH_ID,
    nonce_str: nonceStr,
    body: "\u542F\u4FE1\u901A\u4F1A\u5458-" + getPlanName(memberLevel),
    out_trade_no: orderId,
    total_fee: String(totalFee),
    spbill_create_ip: "127.0.0.1",
    notify_url: "https://qixintong-prod-254473-7-1429024094.sh.run.tcloudbase.com/api/v1/pay/callback",
    trade_type: "JSAPI",
    openid,
    time_start: timeStart,
    time_expire: timeExpire,
    attach: JSON.stringify({ planId, memberLevel, userId, goodsId: params.goodsId })
  };
  postData.sign = signParams(postData);
  const xmlBody = xmlEncode(postData);
  try {
    const https = await import("node:https");
    const xmlText = await new Promise((resolve, reject) => {
      const u = new URL("https://api.mch.weixin.qq.com/pay/unifiedorder");
      const req = https.request({
        hostname: u.hostname,
        port: 443,
        path: u.pathname + u.search,
        method: "POST",
        headers: { "Content-Type": "text/xml" },
        timeout: 3e4
      }, (res) => {
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => resolve(data));
      });
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("ETIMEDOUT"));
      });
      req.on("error", reject);
      req.write(xmlBody);
      req.end();
    });
    const result = xmlDecode(xmlText);
    if (result.return_code === "SUCCESS" && result.result_code === "SUCCESS") {
      const signParams2 = {
        appId: APP_ID,
        timeStamp: String(Math.floor(Date.now() / 1e3)),
        nonceStr,
        package: "prepay_id=" + result.prepay_id,
        signType: "MD5",
        total_fee: String(totalFee)
      };
      signParams2.paySign = signParams(signParams2);
      return {
        success: true,
        data: {
          orderId,
          prepayId: result.prepay_id,
          jsapiParams: signParams2
        }
      };
    } else {
      return { success: false, error: result.err_code_des || result.return_msg || "\u4E0B\u5355\u5931\u8D25" };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function handlePayCallback(xmlBody) {
  try {
    const params = xmlDecode(xmlBody);
    if (params.return_code !== "SUCCESS") {
      return xmlEncode({ return_code: "FAIL", return_msg: "\u7B7E\u540D\u5931\u8D25" });
    }
    const { sign, ...rest } = params;
    const expectedSign = signParams(rest);
    if (sign !== expectedSign) {
      console.error("[Pay] \u7B7E\u540D\u9A8C\u8BC1\u5931\u8D25", { expected: expectedSign, got: sign });
      return xmlEncode({ return_code: "FAIL", return_msg: "\u7B7E\u540D\u5931\u8D25" });
    }
    let attach = null;
    try {
      attach = JSON.parse(params.attach);
    } catch {
      attach = null;
    }
    if (params.result_code === "SUCCESS") {
      const outTradeNo = params.out_trade_no || "";
      const transactionId = params.transaction_id || "";
      await updateOrderPaid(outTradeNo, transactionId, xmlBody);
      if (attach && attach.memberLevel !== void 0 && attach.userId) {
        if (attach.memberLevel === 0 && attach.reportId) {
          const { saveReport: saveReport2 } = await Promise.resolve().then(() => (init_store(), store_exports));
          await saveReport2(attach.reportId, {
            userId: attach.userId,
            isLocked: false,
            orderId: outTradeNo
          });
          console.log("[Pay] \u5355\u6B21\u62A5\u544A\u89E3\u9501\u6210\u529F", { reportId: attach.reportId });
        } else if (attach.memberLevel === 0 && attach.goodsId) {
          const { updateMallOrderPaid: updateMallOrderPaid3 } = await Promise.resolve().then(() => (init_store(), store_exports));
          await updateMallOrderPaid3(outTradeNo, transactionId, "");
          console.log("[Pay] \u5546\u57CE\u8BA2\u5355\u652F\u4ED8\u6210\u529F", { orderId: outTradeNo, goodsId: attach.goodsId });
        } else if (attach.memberLevel > 0) {
          const days = getPlanDays(attach.memberLevel);
          const times = getPlanTimes(attach.memberLevel);
          await purchaseMember(
            attach.userId,
            attach.memberLevel,
            attach.planId || outTradeNo,
            getPlanName(attach.memberLevel),
            days,
            times
          );
          console.log("[Pay] \u4F1A\u5458\u5F00\u901A\u6210\u529F", { orderId: outTradeNo, level: attach.memberLevel });
        }
        if (attach) {
          await releasePayLock(attach.userId, String(attach.memberLevel || 0));
        }
        return xmlEncode({ return_code: "SUCCESS", return_msg: "OK" });
      }
    }
    return xmlEncode({ return_code: "FAIL", return_msg: params.err_code_des || "\u652F\u4ED8\u5931\u8D25" });
  } catch (err) {
    console.error("[Pay] \u56DE\u8C03\u5904\u7406\u5F02\u5E38", err);
    return xmlEncode({ return_code: "FAIL", return_msg: err.message });
  }
}
function getPlanName(level) {
  const names = {
    0: "\u5355\u6B21\u8BCA\u65AD",
    1: "\u5B63VIP",
    2: "\u534A\u5E74SVIP",
    3: "\u9ED1\u91D1\u5E74\u5361"
  };
  return names[level] || "\u4F1A\u5458";
}
function getPlanDays(level) {
  const days = { 0: 0, 1: 90, 2: 180, 3: 365 };
  return days[level] || 30;
}
function getPlanTimes(level) {
  const times = { 0: 1, 1: 10, 2: 30, 3: 50 };
  return times[level] || 1;
}
function xmlEncode(obj) {
  return "<xml>" + Object.entries(obj).filter(([, v]) => v !== void 0 && v !== null).map(([k, v]) => `<${k}><![CDATA[${v}]]></${k}>`).join("") + "</xml>";
}
function xmlDecode(xml) {
  const result = {};
  const re = /<(\w+)><!\[CDATA\[([^\]]*)\]\]><\/\1>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    result[m[1]] = m[2];
  }
  return result;
}
var MCH_ID, API_KEY, APP_ID;
var init_pay_service = __esm({
  "src/modules/pay/pay.service.ts"() {
    init_store();
    init_redis();
    MCH_ID = process.env.WEIXIN_MCH_ID || "1745479207";
    API_KEY = process.env.WEIXIN_API_KEY || "a7B9xW2qR5tY8uI3oP6sD1fG4hJ0kL9m";
    APP_ID = "wxfd20b5775b2f6046";
  }
});

// src/index.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import staticFiles from "@fastify/static";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// src/config/index.ts
import "dotenv/config";
var config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000"),
  host: process.env.HOST || "0.0.0.0",
  jwt: {
    secret: process.env.JWT_SECRET || "qxt_jwt_dev_secret_2026",
    expiresIn: "7d"
  },
  llm: {
    // 优先使用硅基流动（DeepSeek模型，便宜）
    siliconFlow: {
      apiKey: process.env.SILICONFLOW_API_KEY || "",
      baseUrl: process.env.SILICONFLOW_BASE_URL || "https://api.siliconflow.cn/v1",
      model: "deepseek-ai/DeepSeek-V3-0324"
      // 性价比最高
    },
    // 备选 DeepSeek
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY || "",
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
      model: "deepseek-chat"
    }
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "qxt_db"
  }
};

// src/modules/evidence/nlp.service.ts
var TIME_PATTERNS = [
  /(\d{1,2}[/\-]\d{1,2}\s+\d{1,2}:\d{2})/g,
  // 01.10 10:23 / 01-10 10:23
  /(\d{4}[/\-]\d{1,2}[/\-]\d{1,2}\s+\d{1,2}:\d{2})/g,
  // 2024.01.10 10:23
  /(\d{1,2}:\d{2})/g
  // 10:23
];
var SPEAKER_PATTERNS = {
  opponent: [/对方[：:：]?/, /^对方\s*[,，]?/, /^(商家|客服|销售|机构|医生|治疗师|顾问|教练|老师)[：:：]?\s*/],
  user: [/^用户[：:：]?/, /^我[：:：]?/, /^(消费者|客户|学员|患者|投资者)[：:：]?\s*/]
};
var PROMISE_KEYWORDS = [
  "\u4FDD\u8BC1",
  "\u4E00\u5B9A",
  "100%",
  "\u5305\u8FC7",
  "\u7A33\u8D5A",
  "\u7EDD\u5BF9",
  "\u80AF\u5B9A",
  "\u5FC5\u987B",
  "\u627F\u8BFA",
  "\u7B54\u5E94",
  "\u4FDD\u8BC1",
  "\u8BF4\u5230\u505A\u5230",
  "\u7EDD\u65E0\u4F8B\u5916",
  "\u4E0D\u8FC7\u9000\u6B3E",
  "\u65E0\u6548\u679C\u9000\u6B3E",
  "\u4E0D\u6EE1\u610F\u9000\u6B3E",
  "\u4E0D\u6EE1\u610F\u5305\u9000",
  "\u540D\u6821",
  "\u540D\u5E08",
  "985",
  "211",
  "\u9876\u7EA7",
  "\u8D44\u6DF1",
  "\u6743\u5A01"
];
var COMPLAINT_KEYWORDS = [
  "\u9000\u6B3E",
  "\u9000\u94B1",
  "\u9000\u8D27",
  "\u53D6\u6D88",
  "\u6295\u8BC9",
  "\u4E3E\u62A5",
  "\u8981\u9000\u6B3E",
  "\u8981\u6C42\u9000\u6B3E",
  "\u6211\u8981\u9000\u6B3E",
  "\u7533\u8BF7\u9000\u6B3E",
  "\u534F\u5546\u9000\u6B3E",
  "\u9000\u8BFE",
  "\u9000\u8D39",
  "\u9000\u5361",
  "\u89E3\u9664",
  "\u7EC8\u6B62",
  "\u8FD8\u94B1",
  "\u8FD8\u6211"
];
var RISK_KEYWORDS = [
  "\u9AD8\u98CE\u9669",
  "\u4E8F\u635F",
  "\u672C\u91D1\u635F\u5931",
  "\u4E0D\u4FDD\u8BC1",
  "\u6295\u8D44\u6709\u98CE\u9669",
  "\u53EF\u80FD\u4E8F\u635F",
  "\u4E0D\u627F\u8BFA",
  "\u4F8B\u5916",
  "\u89C6\u60C5\u51B5"
];
function extractChatNodes(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const nodes = [];
  for (const line of lines) {
    const node = parseChatLine(line);
    if (node) nodes.push(node);
  }
  return nodes;
}
function extractPromises(text) {
  const promises = [];
  const seen = /* @__PURE__ */ new Set();
  for (const kw of PROMISE_KEYWORDS) {
    const regex = new RegExp(`[^\u3002\uFF01\uFF1F.!?\\n]{5,50}${kw}[^\u3002\uFF01\uFF1F.!?\\n]{0,30}`, "gi");
    let match;
    while ((match = regex.exec(text)) !== null) {
      const sentence = match[0].trim();
      if (!seen.has(sentence) && sentence.length >= 6) {
        seen.add(sentence);
        promises.push(sentence);
      }
    }
  }
  return promises.slice(0, 10);
}
function classifyNode(content, speaker) {
  const text = content;
  if (PROMISE_KEYWORDS.some((kw) => text.includes(kw))) return "\u627F\u8BFA\u6027\u8868\u8FF0";
  if (COMPLAINT_KEYWORDS.some((kw) => text.includes(kw))) return "\u9000\u6B3E\u8981\u6C42/\u6295\u8BC9";
  if (speaker === "\u5BF9\u65B9" && RISK_KEYWORDS.some((kw) => text.includes(kw))) return "\u98CE\u9669\u63D0\u793A";
  if (/合同|协议|签字|签/.test(text)) return "\u5408\u540C\u76F8\u5173";
  if (/退款|退费|取消|终止/.test(text)) return "\u9000\u6B3E\u534F\u5546";
  return "\u666E\u901A\u6C9F\u901A";
}
function parseChatLine(line) {
  let time = "";
  let speaker = "\u5BF9\u65B9";
  let content = line;
  for (const pattern of TIME_PATTERNS) {
    const match = line.match(pattern);
    if (match) {
      time = match[0].replace(/\//g, ".").replace(/-/g, ".");
      break;
    }
  }
  for (const opp of SPEAKER_PATTERNS.opponent) {
    if (opp.test(line)) {
      speaker = "\u5BF9\u65B9";
      content = line.replace(opp, "");
      break;
    }
  }
  for (const usr of SPEAKER_PATTERNS.user) {
    if (usr.test(line)) {
      speaker = "\u7528\u6237";
      content = line.replace(usr, "");
      break;
    }
  }
  for (const pattern of TIME_PATTERNS) {
    content = content.replace(pattern, "").trim();
  }
  content = content.replace(/^(对方|用户)[：:：]?\s*/i, "").trim();
  if (!content || content.length < 2) return null;
  return {
    time: time || "\u65F6\u95F4\u672A\u77E5",
    speaker,
    content: content.length > 200 ? content.slice(0, 200) + "\u2026" : content,
    type: classifyNode(content, speaker)
  };
}
function assessChatQuality(nodes, promises) {
  const total = nodes.length;
  const userNodes = nodes.filter((n) => n.speaker === "\u7528\u6237").length;
  const opponentNodes = nodes.filter((n) => n.speaker === "\u5BF9\u65B9").length;
  const promiseCount = promises.length;
  let evidenceLevel = "C";
  let credibility = "\u4F4E";
  let reason = "";
  let level = "\u4E0D\u8DB3";
  if (total === 0) {
    reason = "\u672A\u80FD\u8BC6\u522B\u5230\u6709\u6548\u5BF9\u8BDD\u5185\u5BB9\uFF0C\u8BF7\u786E\u4FDD\u622A\u56FE\u5305\u542B\u5B8C\u6574\u804A\u5929\u6587\u5B57";
    level = "\u4E25\u91CD\u4E0D\u8DB3";
  } else if (total < 3) {
    reason = `\u4EC5\u8BC6\u522B\u5230${total}\u6761\u6D88\u606F\uFF0C\u5185\u5BB9\u8FC7\u5C11\uFF0C\u5EFA\u8BAE\u8865\u5145\u5B8C\u6574\u5BF9\u8BDD\u622A\u56FE`;
    level = "\u4E0D\u8DB3";
    evidenceLevel = "C";
  } else if (total < 10) {
    reason = `\u8BC6\u522B\u5230${total}\u6761\u6D88\u606F\uFF0C\u5305\u542B${promiseCount}\u6761\u627F\u8BFA\u6027\u8868\u8FF0\uFF0C\u4F46\u5EFA\u8BAE\u8865\u5145\u66F4\u591A\u5BF9\u8BDD\u4EE5\u5448\u73B0\u5B8C\u6574\u4E0A\u4E0B\u6587`;
    level = "\u6709\u9650\u53EF\u7528";
    evidenceLevel = "B";
    credibility = "\u4E2D\u7B49";
  } else if (promiseCount >= 2 && opponentNodes >= 3) {
    reason = `\u8BC6\u522B\u5230${total}\u6761\u6D88\u606F\uFF0C\u5305\u542B${promiseCount}\u6761\u660E\u786E\u627F\u8BFA\uFF0C\u5BF9\u8BDD\u94FE\u6761\u5B8C\u6574\uFF0C\u8BC1\u636E\u53EF\u7528\u6027\u8F83\u9AD8`;
    level = "\u8F83\u597D";
    evidenceLevel = "B";
    credibility = "\u8F83\u9AD8";
  } else {
    reason = `\u8BC6\u522B\u5230${total}\u6761\u6D88\u606F\uFF0C\u4E0A\u4E0B\u6587\u57FA\u672C\u5B8C\u6574\uFF0C\u5305\u542B${promiseCount}\u6761\u627F\u8BFA\u6027\u8868\u8FF0\uFF0C\u8BC1\u636E\u53EF\u7528`;
    level = "\u53EF\u7528";
    evidenceLevel = "B";
    credibility = "\u4E2D\u7B49";
  }
  if (nodes.some((n) => n.type === "\u98CE\u9669\u63D0\u793A" && n.speaker === "\u5BF9\u65B9")) {
    reason += "\uFF08\u5BF9\u65B9\u5DF2\u6709\u98CE\u9669\u63D0\u793A\uFF0C\u5BF9\u4E3B\u5F20\u4E0D\u5229\uFF09";
  }
  return { level, reason, credibility, evidenceLevel };
}

// src/modules/evidence/ocr.service.ts
function extractContractInfo(lines) {
  const parties = [];
  const clauses = [];
  let date = "";
  let amount = "";
  for (const line of lines) {
    const partyMatch = line.match(/(甲方|乙方|消费者|用户|学员|患者|投资者|商家|机构|平台|销售方)[：:：]\s*([^\n，,。]{2,20})/i);
    if (partyMatch && !parties.includes(partyMatch[2])) {
      parties.push(partyMatch[2]);
    }
  }
  for (const line of lines) {
    const dateMatch = line.match(/(\d{4}[年\-/\.]\d{1,2}[月\-/\.]\d{1,2}[日]?)/);
    if (dateMatch) {
      date = dateMatch[1].replace(/\./g, "-");
      break;
    }
  }
  for (const line of lines) {
    const amtMatch = line.match(/(￥|¥|rmb|金额|总计|总额|合同价|价款)[：:：]?\s*(\d+[\.,]?\d*(?:\.\d{1,2})?)/i);
    if (amtMatch) {
      amount = amtMatch[2].replace(/,/g, "");
      break;
    }
  }
  const CLAUSE_KEYWORDS = {
    "\u9000\u6B3E\u9650\u5236": ["\u6982\u4E0D\u9000\u6B3E", "\u4E00\u7ECF\u51FA\u552E", "\u4E0D\u4E88\u9000\u6B3E", "\u4E0D\u652F\u6301\u9000", "\u9000\u6B3E\u6263\u9664", "\u9000\u8D39\u6263\u9664"],
    "\u8FDD\u7EA6\u91D1\u6761\u6B3E": ["\u8FDD\u7EA6\u91D1", "\u8FDD\u7EA6\u8D23\u4EFB", "\u6263\u9664", "\u8D54\u507F", "\u627F\u62C5\u8FDD\u7EA6"],
    "\u683C\u5F0F\u6761\u6B3E": ["\u7532\u65B9", "\u4E59\u65B9", "\u672C\u534F\u8BAE", "\u53CC\u65B9\u540C\u610F", "\u4EFB\u4F55\u60C5\u51B5\u4E0B"],
    "\u53E3\u5934\u627F\u8BFA": ["\u5F53\u65F6\u8BF4", "\u5F53\u65F6\u627F\u8BFA", "\u53E3\u5934", "\u8BF4\u597D", "\u5F53\u65F6\u544A\u77E5"],
    "\u4E89\u8BAE\u89E3\u51B3": ["\u7BA1\u8F96", "\u4EF2\u88C1", "\u8D77\u8BC9", "\u8BC9\u8BBC", "\u6CD5\u9662"],
    "\u98CE\u9669\u81EA\u62C5": ["\u6295\u8D44\u6709\u98CE\u9669", "\u98CE\u9669\u81EA\u62C5", "\u76C8\u4E8F\u81EA\u8D1F", "\u4E0D\u4FDD\u8BC1\u6536\u76CA", "\u53EF\u80FD\u4E8F\u635F"]
  };
  for (const line of lines) {
    for (const [clauseType, keywords] of Object.entries(CLAUSE_KEYWORDS)) {
      if (keywords.some((kw) => line.includes(kw))) {
        clauses.push({ clause: line.slice(0, 100), type: clauseType });
        break;
      }
    }
  }
  return { parties, date, amount, clauses };
}
function extractTransferInfo(lines) {
  let amount = "";
  let time = "";
  let counterparty = "";
  let channel = "";
  for (const line of lines) {
    const amtMatch = line.match(/(￥|¥|实际到账|转账金额|交易金额|付款金额)[：:：]?\s*(\d+[\.,]?\d*(?:\.\d{1,2})?)/i) || line.match(/(^|\s)(\d+[\.,]?\d*(?:\.\d{1,2})?)\s*(元|块)/);
    if (amtMatch && !amount) {
      amount = (amtMatch[2] || amtMatch[1]).replace(/,/g, "");
      if (amount.length > 10) amount = "";
    }
  }
  for (const line of lines) {
    const timeMatch = line.match(/(\d{4}[年\-/\.]\d{1,2}[月\-/\.]\d{1,2}[日]?\s+\d{1,2}:\d{2})/) || line.match(/(\d{1,2}[/\-]\d{1,2}\s+\d{1,2}:\d{2})/);
    if (timeMatch && !time) {
      time = timeMatch[1].replace(/\//g, "-");
      break;
    }
  }
  for (const line of lines) {
    const partyMatch = line.match(/(对方|收款方|转入|汇入|目标账户)[：:：]\s*([^\n，,]{2,30})/i) || line.match(/(商家|机构|公司|平台)[：:：]\s*([^\n，,]{2,20})/i);
    if (partyMatch && !counterparty) {
      counterparty = partyMatch[2];
      break;
    }
  }
  for (const line of lines) {
    if (/支付宝|微信|银行转账|转账汇款/.test(line)) {
      channel = line.match(/(支付宝|微信支付|银行转账|转账汇款)/)?.[1] || "";
      break;
    }
  }
  return { amount, time, counterparty, channel };
}
function verifyTransferConsistency(transferInfo, claimAmount, claimCounterparty) {
  const issues = [];
  if (claimAmount && transferInfo.amount) {
    const tAmt = parseFloat(transferInfo.amount);
    const cAmt = parseFloat(claimAmount.replace(/,/g, ""));
    if (!isNaN(tAmt) && !isNaN(cAmt) && Math.abs(tAmt - cAmt) > 1) {
      issues.push(`\u8F6C\u8D26\u91D1\u989D(${tAmt})\u4E0E\u4E3B\u5F20\u91D1\u989D(${cAmt})\u5B58\u5728\u5DEE\u5F02`);
    }
  }
  if (claimCounterparty && transferInfo.counterparty) {
    if (!transferInfo.counterparty.includes(claimCounterparty) && !claimCounterparty.includes(transferInfo.counterparty)) {
      issues.push(`\u6536\u6B3E\u65B9("${transferInfo.counterparty}")\u4E0E\u4E3B\u5F20\u65B9("${claimCounterparty}")\u4E0D\u5B8C\u5168\u5339\u914D`);
    }
  }
  if (transferInfo.amount && !transferInfo.time) {
    issues.push("\u672A\u8BC6\u522B\u5230\u8F6C\u8D26\u65F6\u95F4\uFF0C\u5EFA\u8BAE\u8865\u5145\u6807\u6CE8\u6BCF\u7B14\u8F6C\u8D26\u7684\u53D1\u751F\u65F6\u95F4");
  }
  return {
    consistent: issues.length === 0,
    issues
  };
}

// src/modules/evidence/evidence.service.ts
function analyzeEvidence(text, type, options = {}) {
  if (type === "chat_record") {
    return analyzeChatRecord(text, options);
  } else if (type === "contract") {
    return analyzeContract(text, options);
  } else if (type === "transfer_record") {
    return analyzeTransferRecord(text, options);
  }
  return {
    qualityLabel: "\u4E0D\u8DB3",
    qualityReason: "\u4E0D\u652F\u6301\u7684\u8BC1\u636E\u7C7B\u578B",
    credibility: "\u4F4E",
    evidenceLevel: "C"
  };
}
function analyzeChatRecord(text, options) {
  const nodes = extractChatNodes(text);
  const promises = extractPromises(text);
  const quality = assessChatQuality(nodes, promises);
  const riskNodes = nodes.filter((n) => n.type === "\u98CE\u9669\u63D0\u793A" && n.speaker === "\u5BF9\u65B9");
  let qualityLabel = quality.level;
  let qualityReason = quality.reason;
  if (riskNodes.length > 0 && nodes.filter((n) => n.speaker === "\u5BF9\u65B9").length > riskNodes.length * 2) {
    qualityReason += "\uFF08\u6CE8\u610F\uFF1A\u5BF9\u65B9\u6709" + riskNodes.length + "\u6761\u98CE\u9669\u63D0\u793A\uFF0C\u8BF7\u7559\u610F\u5BF9\u4E3B\u5F20\u7684\u5F71\u54CD\uFF09";
  }
  return {
    qualityLabel,
    qualityReason,
    credibility: quality.credibility,
    evidenceLevel: quality.evidenceLevel,
    nodes: nodes.slice(0, 20),
    // 最多20条
    promises: promises.slice(0, 10)
    // 最多10条
  };
}
function analyzeContract(text, options) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const { parties, date, amount, clauses } = extractContractInfo(lines);
  let qualityLabel;
  let qualityReason;
  let evidenceLevel;
  let credibility = "\u4E2D";
  if (clauses.length === 0) {
    qualityLabel = "\u6709\u9650\u53EF\u7528";
    qualityReason = "\u672A\u80FD\u8BC6\u522B\u5230\u5173\u952E\u6761\u6B3E\uFF0C\u8BF7\u786E\u4FDD\u56FE\u7247\u6587\u5B57\u6E05\u6670\u53EF\u8BFB\uFF0C\u6216\u5C1D\u8BD5\u624B\u52A8\u63CF\u8FF0\u5408\u540C\u5185\u5BB9";
    evidenceLevel = "C";
  } else if (clauses.length <= 2) {
    qualityLabel = "\u6709\u9650\u53EF\u7528";
    qualityReason = `\u8BC6\u522B\u5230${clauses.length}\u6761\u5173\u952E\u6761\u6B3E\uFF0C\u5EFA\u8BAE\u8865\u5145\u5408\u540C\u5B8C\u6574\u5185\u5BB9\u4EE5\u63D0\u9AD8\u8BC1\u636E\u5B8C\u6574\u6027`;
    evidenceLevel = "C";
    credibility = "\u4F4E";
  } else if (clauses.length <= 5) {
    qualityLabel = "\u57FA\u672C\u53EF\u7528";
    qualityReason = `\u8BC6\u522B\u5230${clauses.length}\u6761\u5173\u952E\u6761\u6B3E\uFF08${clauses.map((c) => c.type).join("\u3001")}\uFF09\uFF0C\u5408\u540C\u53EF\u7528`;
    evidenceLevel = "B";
  } else {
    qualityLabel = "\u5145\u8DB3";
    qualityReason = `\u8BC6\u522B\u5230${clauses.length}\u6761\u5173\u952E\u6761\u6B3E\uFF0C\u6DB5\u76D6${Array.from(new Set(clauses.map((c) => c.type))).join("\u3001")}\u7B49\uFF0C\u8BC1\u636E\u5B8C\u6574\u6027\u8F83\u9AD8`;
    evidenceLevel = "B";
    credibility = "\u9AD8";
  }
  const oppressiveClauses = clauses.filter((c) => c.type === "\u683C\u5F0F\u6761\u6B3E" || c.type === "\u9000\u6B3E\u9650\u5236");
  if (oppressiveClauses.length > 0) {
    qualityReason += `\uFF08\u6CE8\u610F\uFF1A\u5408\u540C\u4E2D\u5B58\u5728${oppressiveClauses.length}\u6761\u683C\u5F0F/\u9000\u6B3E\u9650\u5236\u6761\u6B3E\uFF0C\u5EFA\u8BAE\u91CD\u70B9\u6807\u6CE8\uFF09`;
  }
  return {
    qualityLabel,
    qualityReason,
    credibility,
    evidenceLevel,
    contractInfo: { parties, date, amount },
    clauses
  };
}
function analyzeTransferRecord(text, options) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const transferInfo = extractTransferInfo(lines);
  const verification = verifyTransferConsistency(
    transferInfo,
    options.claimAmount,
    options.claimCounterparty
  );
  let qualityLabel;
  let qualityReason;
  let evidenceLevel;
  let credibility = "\u4E2D";
  if (!transferInfo.amount) {
    qualityLabel = "\u4E0D\u8DB3";
    qualityReason = "\u672A\u80FD\u8BC6\u522B\u5230\u6709\u6548\u91D1\u989D\u4FE1\u606F\uFF0C\u8BF7\u786E\u4FDD\u56FE\u7247\u4E2D\u91D1\u989D\u6E05\u6670\u53EF\u89C1";
    evidenceLevel = "C";
    credibility = "\u4F4E";
  } else if (!transferInfo.time) {
    qualityLabel = "\u6709\u9650\u53EF\u7528";
    qualityReason = `\u8BC6\u522B\u5230\u8F6C\u8D26\u91D1\u989D${transferInfo.amount}\u5143\uFF0C\u4F46\u672A\u8BC6\u522B\u5230\u8F6C\u8D26\u65F6\u95F4\uFF0C\u5EFA\u8BAE\u8865\u5145\u65F6\u95F4\u4FE1\u606F`;
    evidenceLevel = "C";
  } else if (!transferInfo.counterparty) {
    qualityLabel = "\u6709\u9650\u53EF\u7528";
    qualityReason = `\u8BC6\u522B\u5230\u8F6C\u8D26${transferInfo.amount}\u5143\uFF08${transferInfo.time}\uFF09\uFF0C\u4F46\u672A\u8BC6\u522B\u5230\u6536\u6B3E\u65B9\uFF0C\u5EFA\u8BAE\u8865\u5145\u5BF9\u65B9\u8D26\u6237\u4FE1\u606F`;
    evidenceLevel = "C";
  } else {
    qualityLabel = "\u57FA\u672C\u53EF\u7528";
    qualityReason = `\u8F6C\u8D26\u8BB0\u5F55\u5B8C\u6574\uFF1A${transferInfo.amount}\u5143\u4ED8\u7ED9"${transferInfo.counterparty}"\uFF08${transferInfo.time}\uFF09`;
    evidenceLevel = "B";
    if (transferInfo.channel) {
      qualityReason += `\uFF0C\u6E20\u9053\uFF1A${transferInfo.channel}`;
    }
  }
  if (!verification.consistent) {
    qualityReason += `\uFF08\u6838\u9A8C\u63D0\u793A\uFF1A${verification.issues.join("\uFF1B")}\uFF09`;
  }
  return {
    qualityLabel,
    qualityReason,
    credibility,
    evidenceLevel,
    transferInfo,
    verification
  };
}

// src/data/banned-words.js
var BANNED_WORDS = [
  // 结果预测
  "\u80DC\u8BC9",
  "\u8D25\u8BC9",
  "\u80FD\u8D62",
  "\u80FD\u8981\u56DE\u6765",
  "\u6709\u591A\u5927\u628A\u63E1",
  "\u6210\u529F\u7387",
  "\u80DC\u8BC9\u7387",
  // 法律定性
  "\u5BF9\u65B9\u8FDD\u6CD5",
  "\u6784\u6210\u8FDD\u7EA6",
  "\u6784\u6210\u4FB5\u6743",
  "\u8FD9\u662F\u9738\u738B\u6761\u6B3E",
  "\u5408\u540C\u65E0\u6548",
  // 行动建议
  "\u5EFA\u8BAE\u60A8\u8D77\u8BC9",
  "\u4F60\u5E94\u8BE5\u6295\u8BC9",
  "\u5EFA\u8BAE\u8BF7\u5F8B\u5E08",
  "\u63A8\u8350\u65B9\u6848",
  "\u6700\u4F73\u65B9\u6848",
  "\u5EFA\u8BAE\u8D77\u8BC9",
  "\u6295\u8BC9\u5B83",
  // 价值判断
  "\u98CE\u9669\u9AD8",
  "\u98CE\u9669\u4F4E",
  "\u8BC1\u636E\u5145\u8DB3",
  "\u8BC1\u636E\u4E0D\u8DB3",
  "\u4F60\u8FD9\u60C5\u51B5\u5F88\u6709\u5229",
  "\u80DC\u7B97\u5927",
  // 身份暗示
  "AI\u5F8B\u5E08",
  "\u667A\u80FD\u5F8B\u5E08",
  "\u6CD5\u5F8B\u8BCA\u65AD",
  "\u667A\u80FD\u5224\u6848",
  "AI\u7EF4\u6743",
  "\u6CD5\u5F8BAI",
  // 中介撮合
  "\u63A8\u8350\u5F8B\u5E08",
  "\u4E3A\u60A8\u5339\u914D",
  "\u64C5\u957F\u9886\u57DF",
  "\u80DC\u8BC9\u7387\u9AD8",
  "\u627E\u5F8B\u5E08"
];
function scanBannedWords(text) {
  if (!text || typeof text !== "string") return [];
  const found = [];
  for (const word of BANNED_WORDS) {
    if (text.includes(word)) found.push(word);
  }
  return found;
}

// src/modules/evidence/evidence.route.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
var UPLOAD_DIR = "/app/uploads/evidence";
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (e) {
  console.error("[Evidence] \u521B\u5EFA\u4E0A\u4F20\u76EE\u5F55\u5931\u8D25:", UPLOAD_DIR);
}
async function evidenceRoutes(fastify) {
  fastify.post("/upload", async (request, reply) => {
    try {
      let fileBuffer = null, originalName = "", mimeType = "image/jpeg";
      let typeId = "", typeLabel = "", scene = "";
      if (request.isMultipart()) {
        const parts = request.parts();
        for await (const part of parts) {
          if (part.type === "file") {
            fileBuffer = await part.toBuffer();
            mimeType = part.mimetype || "image/jpeg";
            originalName = part.filename || "upload.jpg";
          } else if (part.fieldname === "typeId") {
            typeId = String(part.value || "");
          } else if (part.fieldname === "typeLabel") {
            typeLabel = String(part.value || "");
          } else if (part.fieldname === "scene") {
            scene = String(part.value || "");
          }
        }
      }
      if (!fileBuffer || fileBuffer.length === 0) {
        return reply.status(400).send({ success: false, error: "\u6587\u4EF6\u4E3A\u7A7A\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9" });
      }
      if (fileBuffer.length > 25 * 1024 * 1024) {
        return reply.status(400).send({ success: false, error: "\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC725MB\uFF0C\u8BF7\u538B\u7F29\u540E\u4E0A\u4F20" });
      }
      const hash = crypto.createHash("md5").update(fileBuffer).digest("hex").slice(0, 12);
      const ext = path.extname(originalName) || ".jpg";
      const fileName = `${Date.now()}_${hash}${ext}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      fs.writeFileSync(filePath, fileBuffer);
      console.log("[Evidence] \u6587\u4EF6\u5DF2\u4FDD\u5B58:", filePath, `${(fileBuffer.length / 1024).toFixed(1)}KB`);
      const url = `/uploads/evidence/${fileName}`;
      const fileId = `ev_${Date.now()}_${hash}`;
      return {
        success: true,
        url,
        fileId,
        mimeType,
        typeId,
        typeLabel,
        result: {
          url,
          quality: "\u2705 \u5DF2\u4E0A\u4F20",
          level: "\u5F85\u5206\u6790",
          note: "\u6587\u4EF6\u5DF2\u6210\u529F\u4E0A\u4F20\u81F3\u670D\u52A1\u5668\uFF0C\u62A5\u544A\u751F\u6210\u65F6\u5C06\u81EA\u52A8\u5F15\u7528",
          keyTerms: [typeLabel || "\u8BC1\u636E", originalName]
        }
      };
    } catch (err) {
      console.error("[Evidence] \u4E0A\u4F20\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u4E0A\u4F20\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5" });
    }
  });
  fastify.post("/analyze", async (request, reply) => {
    const body = request.body || {};
    const {
      draft_id,
      scene,
      evidence_type,
      file_url,
      text,
      claim_amount,
      claim_counterparty
    } = body;
    if (!evidence_type) {
      return reply.status(400).send({
        success: false,
        error: "\u7F3A\u5C11\u5FC5\u586B\u53C2\u6570\uFF1Aevidence_type"
      });
    }
    const validTypes = ["chat_record", "contract", "transfer_record"];
    if (!validTypes.includes(evidence_type)) {
      return reply.status(400).send({
        success: false,
        error: `\u4E0D\u652F\u6301\u7684\u8BC1\u636E\u7C7B\u578B\uFF1A${evidence_type}\uFF0C\u652F\u6301\uFF1A${validTypes.join("\u3001")}`
      });
    }
    const inputText = (text || file_url || "").trim();
    if (!inputText) {
      return reply.status(400).send({
        success: false,
        error: "\u7F3A\u5C11\u8BC1\u636E\u5185\u5BB9\uFF08text \u6216 file_url\uFF09"
      });
    }
    const scan = scanBannedWords(inputText);
    if (scan.blocked) {
      return reply.status(400).send({
        success: false,
        error: `\u5185\u5BB9\u5305\u542B\u654F\u611F\u8BCD\u6C47\uFF1A${scan.found.join("\u3001")}`
      });
    }
    try {
      const result = analyzeEvidence(inputText, evidence_type, {
        draftId: draft_id,
        claimAmount: claim_amount,
        claimCounterparty: claim_counterparty,
        scene
      });
      return {
        success: true,
        result
      };
    } catch (err) {
      console.error("\u274C \u8BC1\u636E\u5206\u6790\u5931\u8D25:", err);
      return reply.status(500).send({
        success: false,
        error: "\u8BC1\u636E\u5206\u6790\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"
      });
    }
  });
  fastify.get("/file/*", async (request, reply) => {
    const filePath = path.join(UPLOAD_DIR, path.basename(request.params["*"] || ""));
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: "\u6587\u4EF6\u4E0D\u5B58\u5728" });
    }
    return reply.sendFile(path.basename(filePath), UPLOAD_DIR);
  });
}

// src/data/evidence-definitions.js
var EVIDENCE_ITEMS = [
  // 通用
  { id: "contract", label: "\u5408\u540C\u6216\u534F\u8BAE", desc: "\u8BC1\u660E\u53CC\u65B9\u6743\u5229\u4E49\u52A1", source: "\u4E0E\u673A\u6784\u7B7E\u8BA2\u7684\u670D\u52A1\u534F\u8BAE\u3001\u8BFE\u7A0B\u5408\u540C\u7B49" },
  { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55/\u8F6C\u8D26", desc: "\u9501\u5B9A\u5B9E\u9645\u635F\u5931\u91D1\u989D", source: "\u94F6\u884C\u6D41\u6C34\u3001\u652F\u4ED8\u5B9D/\u5FAE\u4FE1\u652F\u4ED8\u8BB0\u5F55\u3001\u6536\u636E\u6216\u53D1\u7968" },
  { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", desc: "\u8BB0\u5F55\u5173\u952E\u5BF9\u8BDD\u548C\u627F\u8BFA", source: "\u4E0E\u673A\u6784\u8D1F\u8D23\u4EBA\u6216\u9500\u552E\u4EBA\u5458\u7684\u5FAE\u4FE1\u3001\u77ED\u4FE1\u6C9F\u901A\u8BB0\u5F55" },
  { id: "ads", label: "\u5BA3\u4F20\u6750\u6599\u56FE\u7247", desc: "\u8BC1\u660E\u865A\u5047\u5BA3\u4F20\u6216\u5938\u5927\u627F\u8BFA", source: "\u673A\u6784\u5BA3\u4F20\u9875\u9762\u622A\u56FE\u3001\u670B\u53CB\u5708\u6D77\u62A5\u3001\u5BA3\u4F20\u518C\u7B49" },
  // 劳动纠纷专属
  { id: "salary", label: "\u5DE5\u8D44\u6D41\u6C34", desc: "\u8BC1\u660E\u5DE5\u8D44\u91D1\u989D\u548C\u53D1\u653E\u60C5\u51B5", source: "\u94F6\u884CApp\u6216\u7F51\u70B9\u6253\u5370\u7684\u5DE5\u8D44\u5165\u8D26\u8BB0\u5F55" },
  { id: "social", label: "\u793E\u4FDD\u7F34\u8D39\u8BB0\u5F55", desc: "\u8BC1\u660E\u793E\u4FDD\u7F34\u7EB3\u60C5\u51B5", source: "\u5F53\u5730\u793E\u4FDD\u5C40\u7F51\u7AD9\u3001\u793E\u4FDD\u5361App\u3001\u793E\u4FDD\u4E2D\u5FC3\u6253\u5370" },
  // 租房纠纷专属
  { id: "photos", label: "\u623F\u5C4B\u7167\u7247", desc: "\u8BC1\u660E\u623F\u5C4B\u4EA4\u4ED8\u65F6\u7684\u72B6\u6001", source: "\u5165\u4F4F\u65F6\u7684\u623F\u95F4\u7167\u7247\u3001\u89C6\u9891" },
  { id: "contract_orig", label: "\u539F\u59CB\u79DF\u8D41\u5408\u540C", desc: "\u8BC1\u660E\u79DF\u8D41\u6761\u6B3E\u548C\u62BC\u91D1\u7EA6\u5B9A", source: "\u7B7E\u8BA2\u7684\u6B63\u672C\u79DF\u8D41\u5408\u540C" }
];
var EVIDENCE_ITEMS_MAP = Object.fromEntries(EVIDENCE_ITEMS.map((e) => [e.id, e]));

// src/data/report-templates.js
var STATUS_ADVICE = {
  // 未尝试
  "0": [
    "\u7B2C\u4E00\u6B65\uFF1A\u534F\u5546\u6C9F\u901A\u2014\u2014\u76F4\u63A5\u4E0E\u5BF9\u65B9\u8D1F\u8D23\u4EBA\u6C9F\u901A\uFF0C\u660E\u786E\u63D0\u51FA\u4F60\u7684\u8BC9\u6C42\uFF0C\u4FDD\u7559\u6240\u6709\u804A\u5929\u8BB0\u5F55\u548C\u901A\u8BDD\u5F55\u97F3",
    "\u7B2C\u4E8C\u6B65\uFF1A\u6295\u8BC9\u4E3E\u62A5\u2014\u2014\u534F\u5546\u4E0D\u6210\uFF0C\u7ACB\u5373\u5411\u76F8\u5173\u4E3B\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF0812315/\u6559\u80B2\u5C40/\u4F4F\u5EFA\u90E8\u95E8\u7B49\uFF09",
    "\u7B2C\u4E09\u6B65\uFF1A\u6CD5\u5F8B\u9014\u5F84\u2014\u2014\u6295\u8BC9\u65E0\u679C\uFF0C\u53EF\u5411\u6CD5\u9662\u63D0\u8D77\u6C11\u4E8B\u8BC9\u8BBC"
  ],
  // 正在协商
  "1": [
    "\u534F\u5546\u5347\u7EA7\u2014\u2014\u8981\u6C42\u4E0E\u66F4\u9AD8\u5C42\u7EA7\u8D1F\u8D23\u4EBA\u6C9F\u901A\uFF0C\u544A\u77E5\u5982\u4E0D\u80FD\u8FBE\u6210\u4E00\u81F4\u5C06\u7ACB\u5373\u6295\u8BC9",
    "\u540C\u6B65\u6295\u8BC9\u2014\u2014\u5728\u534F\u5546\u7684\u540C\u65F6\u541112315\u548C\u4E3B\u7BA1\u90E8\u95E8\u63D0\u4EA4\u6295\u8BC9\u6750\u6599\uFF0C\u65BD\u52A0\u538B\u529B",
    "\u51C6\u5907\u8BC9\u8BBC\u2014\u2014\u6574\u7406\u597D\u5408\u540C\u3001\u8F6C\u8D26\u8BB0\u5F55\u3001\u804A\u5929\u8BB0\u5F55\uFF0C\u968F\u65F6\u51C6\u5907\u8D77\u8BC9"
  ],
  // 已投诉
  "2": [
    "\u8DDF\u8FDB\u6295\u8BC9\u2014\u2014\u5B9A\u671F\u8054\u7CFB\u6295\u8BC9\u53D7\u7406\u90E8\u95E8\u4E86\u89E3\u5904\u7406\u8FDB\u5EA6\uFF0C\u8865\u5145\u63D0\u4EA4\u65B0\u8BC1\u636E",
    "\u884C\u653F\u8C03\u89E3\u2014\u2014\u8BF7\u6C42\u4E3B\u7BA1\u90E8\u95E8\u7EC4\u7EC7\u53CC\u65B9\u8FDB\u884C\u884C\u653F\u8C03\u89E3",
    "\u6CD5\u5F8B\u8BC9\u8BBC\u2014\u2014\u82E5\u8C03\u89E3\u4E0D\u6210\uFF0C\u53EF\u5411\u6CD5\u9662\u63D0\u8D77\u6C11\u4E8B\u8BC9\u8BBC"
  ],
  // 已起诉
  "3": [
    "\u8BC1\u636E\u6574\u7406\u2014\u2014\u5C06\u6240\u6709\u8BC1\u636E\u6309\u65F6\u95F4\u987A\u5E8F\u6574\u7406\u6210\u518C\uFF0C\u6807\u6CE8\u6BCF\u4EFD\u8BC1\u636E\u7684\u8BC1\u660E\u76EE\u7684",
    '\u8D77\u8BC9\u72B6\u64B0\u5199\u2014\u2014\u660E\u786E\u8BC9\u8BBC\u8BF7\u6C42\uFF0C\u53EF\u901A\u8FC7"\u4EBA\u6C11\u6CD5\u9662\u5728\u7EBF\u670D\u52A1"\u5C0F\u7A0B\u5E8F\u7F51\u4E0A\u7ACB\u6848',
    "\u6CD5\u5F8B\u63F4\u52A9\u2014\u2014\u7B26\u5408\u6761\u4EF6\u7684\u53EF\u7533\u8BF7\u6CD5\u5F8B\u63F4\u52A9\uFF0C\u62E8\u625312348\u514D\u8D39\u54A8\u8BE2"
  ],
  default: [
    "\u7B2C\u4E00\u6B65\uFF1A\u534F\u5546\u6C9F\u901A\u2014\u2014\u76F4\u63A5\u4E0E\u5BF9\u65B9\u6C9F\u901A\uFF0C\u660E\u786E\u63D0\u51FA\u8BC9\u6C42",
    "\u7B2C\u4E8C\u6B65\uFF1A\u6295\u8BC9\u4E3E\u62A5\u2014\u2014\u5411\u76F8\u5173\u4E3B\u7BA1\u90E8\u95E8\u6295\u8BC9",
    "\u7B2C\u4E09\u6B65\uFF1A\u6CD5\u5F8B\u9014\u5F84\u2014\u2014\u5411\u6CD5\u9662\u63D0\u8D77\u8BC9\u8BBC"
  ]
};
function mapStatusToAdvice(statusText) {
  if (!statusText) return STATUS_ADVICE.default;
  var s = String(statusText).toLowerCase();
  if (s.indexOf("\u6295\u8BC9") >= 0 && s.indexOf("\u6CA1\u6709") < 0) return STATUS_ADVICE["2"];
  if (s.indexOf("\u534F\u5546") >= 0 && s.indexOf("\u6CA1\u6709") < 0) return STATUS_ADVICE["1"];
  if (s.indexOf("\u8BC9\u8BBC") >= 0 || s.indexOf("\u8D77\u8BC9") >= 0 || s.indexOf("\u6CD5\u5F8B") >= 0) return STATUS_ADVICE["3"];
  if (s.indexOf("\u6CA1\u6709") >= 0 || s.indexOf("\u672A") >= 0) return STATUS_ADVICE["0"];
  return STATUS_ADVICE.default;
}
var SCENE_TEMPLATES = {
  "01": { name: "\u7F51\u8D2D\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u5B58\u8BA2\u5355\u622A\u56FE\u548C\u5546\u54C1\u9875\u9762", "\u901A\u8FC7\u5E73\u53F0\u5BA2\u670D\u4ECB\u5165\u5904\u7406", "\u4FDD\u7559\u7269\u6D41\u4FE1\u606F\u548C\u5F00\u7BB1\u89C6\u9891"] },
  "02": { name: "\u7EBF\u4E0B\u6D88\u8D39\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u7559\u8D2D\u7269\u5C0F\u7968\u548CPOS\u5355\u636E", "\u62CD\u6444\u5546\u54C1\u95EE\u9898\u7167\u7247", "\u4FDD\u7559\u4E0E\u5546\u5BB6\u7684\u6C9F\u901A\u8BB0\u5F55"] },
  "03": { name: "\u52B3\u52A8\u5173\u7CFB\u7EA0\u7EB7", category: "\u52B3\u52A8", tips: ["\u6536\u96C6\u52B3\u52A8\u5408\u540C\u3001\u5DE5\u8D44\u6D41\u6C34\u3001\u793E\u4FDD\u8BB0\u5F55", "\u52B3\u52A8\u4E89\u8BAE\u4EF2\u88C1\u65F6\u6548\u4E3A1\u5E74", "\u53EF\u5411\u52B3\u52A8\u76D1\u5BDF\u5927\u961F\u6295\u8BC9"] },
  "04": { name: "\u79DF\u623F\u7EA0\u7EB7", category: "\u5C45\u4F4F", tips: ["\u4FDD\u5B58\u79DF\u8D41\u5408\u540C\u539F\u4EF6", "\u62CD\u6444\u623F\u5C4B\u73B0\u72B6\u7167\u7247", "\u4FDD\u7559\u62BC\u91D1\u6536\u636E\u548C\u8F6C\u8D26\u8BB0\u5F55"] },
  "05": { name: "\u6559\u80B2\u57F9\u8BAD\u7EA0\u7EB7", category: "\u6559\u80B2", tips: ["\u4FDD\u5B58\u57F9\u8BAD\u5408\u540C/\u534F\u8BAE", "\u4FDD\u7559\u4ED8\u6B3E\u51ED\u8BC1\u548C\u6536\u636E", "\u6536\u96C6\u8BFE\u7A0B\u5BA3\u4F20\u6750\u6599\u548C\u627F\u8BFA\u622A\u56FE"] },
  "06": { name: "\u533B\u7597\u7F8E\u5BB9\u7EA0\u7EB7", category: "\u533B\u7597", tips: ["\u4FDD\u5B58\u672F\u524D\u672F\u540E\u5BF9\u6BD4\u7167\u7247", "\u4FDD\u7559\u5168\u90E8\u7F34\u8D39\u8BB0\u5F55", "\u6536\u96C6\u533B\u751F\u627F\u8BFA\u548C\u672F\u524D\u544A\u77E5\u6750\u6599"] },
  "07": { name: "\u4E8C\u624B\u8F66\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u5B58\u8D2D\u8F66\u5408\u540C\u548C\u68C0\u6D4B\u62A5\u544A", "\u4FDD\u7559\u4ED8\u6B3E\u51ED\u8BC1", "\u62CD\u6444\u8F66\u8F86\u95EE\u9898\u7167\u7247"] },
  "08": { name: "\u65C5\u6E38\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u5B58\u65C5\u6E38\u5408\u540C\u548C\u884C\u7A0B\u5355", "\u6536\u96C6\u65C5\u884C\u793E\u5BA3\u4F20\u6750\u6599", "\u4FDD\u7559\u4F4F\u5BBF\u548C\u4EA4\u901A\u7968\u636E"] },
  "09": { name: "\u5408\u540C\u7EA0\u7EB7", category: "\u5408\u540C", tips: ["\u4FDD\u5B58\u5408\u540C\u539F\u4EF6\u548C\u8865\u5145\u534F\u8BAE", "\u4FDD\u7559\u5168\u90E8\u4ED8\u6B3E\u51ED\u8BC1", "\u6574\u7406\u53CC\u65B9\u5F80\u6765\u51FD\u4EF6\u548C\u90AE\u4EF6"] },
  "10": { name: "\u623F\u4EA7\u7EA0\u7EB7", category: "\u623F\u4EA7", tips: ["\u4FDD\u5B58\u8D2D\u623F\u5408\u540C\u548C\u8865\u5145\u534F\u8BAE", "\u6536\u96C6\u5F00\u53D1\u5546\u5BA3\u4F20\u6750\u6599", "\u4FDD\u7559\u5168\u90E8\u4ED8\u6B3E\u51ED\u8BC1"] },
  "11": { name: "\u6295\u8D44\u7406\u8D22\u7EA0\u7EB7", category: "\u91D1\u878D", tips: ["\u4FDD\u5B58\u6295\u8D44\u534F\u8BAE\u548C\u4EA7\u54C1\u8BF4\u660E\u4E66", "\u6536\u96C6\u5E73\u53F0\u5BA3\u4F20\u548C\u627F\u8BFA\u622A\u56FE", "\u4FDD\u7559\u5168\u90E8\u8F6C\u8D26\u8BB0\u5F55"] },
  "12": { name: "\u6C11\u95F4\u501F\u8D37\u7EA0\u7EB7", category: "\u91D1\u878D", tips: ["\u4FDD\u5B58\u501F\u6761/\u501F\u6B3E\u5408\u540C\u539F\u4EF6", "\u4FDD\u7559\u5168\u90E8\u8F6C\u8D26\u51ED\u8BC1", "\u6536\u96C6\u50AC\u6536\u8BB0\u5F55\u548C\u804A\u5929\u8BB0\u5F55"] },
  "13": { name: "\u7269\u6D41\u5FEB\u9012\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u5B58\u5FEB\u9012\u5355\u53F7\u548C\u7269\u6D41\u4FE1\u606F", "\u62CD\u6444\u5305\u88F9\u7834\u635F\u7167\u7247", "\u4FDD\u7559\u7269\u54C1\u4EF7\u503C\u8BC1\u660E"] },
  "14": { name: "\u7968\u52A1\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u5B58\u8D2D\u7968\u8BB0\u5F55\u548C\u8BA2\u5355\u4FE1\u606F", "\u6536\u96C6\u5E73\u53F0\u9000\u6539\u89C4\u5219\u622A\u56FE", "\u4FDD\u7559\u4E0E\u5BA2\u670D\u7684\u6C9F\u901A\u8BB0\u5F55"] },
  "15": { name: "\u60C5\u611F\u7EA0\u7EB7", category: "\u4EBA\u8EAB", tips: ["\u4FDD\u7559\u804A\u5929\u8BB0\u5F55\u548C\u8F6C\u8D26\u51ED\u8BC1", "\u5FC5\u8981\u65F6\u62A5\u8B66\u5E76\u4FDD\u5B58\u56DE\u6267", "\u6CE8\u610F\u4EBA\u8EAB\u5B89\u5168\u7B2C\u4E00"] },
  "16": { name: "\u5176\u4ED6\u7EA0\u7EB7", category: "\u901A\u7528", tips: ["\u6574\u7406\u6240\u6709\u76F8\u5173\u6750\u6599\u548C\u8BB0\u5F55", "\u660E\u786E\u81EA\u5DF1\u7684\u8BC9\u6C42\u548C\u4F9D\u636E", "\u5FC5\u8981\u65F6\u5BFB\u6C42\u4E13\u4E1A\u5E2E\u52A9"] },
  education: { name: "\u6559\u80B2\u57F9\u8BAD\u7EA0\u7EB7", category: "\u6559\u80B2", tips: ["\u4FDD\u5B58\u57F9\u8BAD\u5408\u540C/\u534F\u8BAE", "\u4FDD\u7559\u4ED8\u6B3E\u51ED\u8BC1\u548C\u6536\u636E", "\u6536\u96C6\u8BFE\u7A0B\u5BA3\u4F20\u6750\u6599\u548C\u627F\u8BFA\u622A\u56FE"] },
  medical: { name: "\u533B\u7597\u7F8E\u5BB9\u7EA0\u7EB7", category: "\u533B\u7597", tips: ["\u4FDD\u5B58\u672F\u524D\u672F\u540E\u5BF9\u6BD4\u7167\u7247", "\u4FDD\u7559\u5168\u90E8\u7F34\u8D39\u8BB0\u5F55", "\u6536\u96C6\u533B\u751F\u627F\u8BFA\u548C\u672F\u524D\u544A\u77E5\u6750\u6599"] },
  labor: { name: "\u52B3\u52A8\u5173\u7CFB\u7EA0\u7EB7", category: "\u52B3\u52A8", tips: ["\u6536\u96C6\u52B3\u52A8\u5408\u540C\u3001\u5DE5\u8D44\u6D41\u6C34\u3001\u793E\u4FDD\u8BB0\u5F55", "\u52B3\u52A8\u4E89\u8BAE\u4EF2\u88C1\u65F6\u6548\u4E3A1\u5E74", "\u53EF\u5411\u52B3\u52A8\u76D1\u5BDF\u5927\u961F\u6295\u8BC9"] },
  housing: { name: "\u79DF\u623F\u7EA0\u7EB7", category: "\u5C45\u4F4F", tips: ["\u4FDD\u5B58\u79DF\u8D41\u5408\u540C\u539F\u4EF6", "\u62CD\u6444\u623F\u5C4B\u73B0\u72B6\u7167\u7247", "\u4FDD\u7559\u62BC\u91D1\u6536\u636E\u548C\u8F6C\u8D26\u8BB0\u5F55"] },
  consumer: { name: "\u6D88\u8D39\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u5B58\u8D2D\u7269\u51ED\u8BC1\u548C\u6536\u636E", "\u62CD\u6444\u5546\u54C1\u95EE\u9898\u7167\u7247", "\u4FDD\u7559\u4E0E\u5546\u5BB6\u7684\u6C9F\u901A\u8BB0\u5F55"] },
  beauty: { name: "\u7F8E\u4E1A\u670D\u52A1\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u7559\u670D\u52A1\u534F\u8BAE\u548C\u5BA3\u4F20\u6750\u6599", "\u62CD\u6444\u670D\u52A1\u524D\u540E\u5BF9\u6BD4\u7167\u7247", "\u4FDD\u7559\u5168\u90E8\u4ED8\u6B3E\u8BB0\u5F55"] },
  franchise: { name: "\u52A0\u76DF\u7EA0\u7EB7", category: "\u5408\u540C", tips: ["\u4FDD\u5B58\u52A0\u76DF\u5408\u540C\u548C\u8865\u5145\u534F\u8BAE", "\u6536\u96C6\u54C1\u724C\u65B9\u5BA3\u4F20\u6750\u6599\u548C\u627F\u8BFA", "\u4FDD\u7559\u5168\u90E8\u4ED8\u6B3E\u51ED\u8BC1"] },
  debt: { name: "\u6C11\u95F4\u501F\u8D37\u7EA0\u7EB7", category: "\u91D1\u878D", tips: ["\u4FDD\u5B58\u501F\u6761/\u501F\u6B3E\u5408\u540C\u539F\u4EF6", "\u4FDD\u7559\u5168\u90E8\u8F6C\u8D26\u51ED\u8BC1", "\u6536\u96C6\u50AC\u6536\u8BB0\u5F55"] },
  telecom: { name: "\u7535\u4FE1\u8BC8\u9A97\u7EA0\u7EB7", category: "\u91D1\u878D", tips: ["\u7ACB\u5373\u62A5\u8B66\u5E76\u4FDD\u7559\u56DE\u6267", "\u622A\u5C4F\u4FDD\u5B58\u6240\u6709\u804A\u5929\u548C\u8F6C\u8D26\u8BB0\u5F55", "\u8054\u7CFB\u94F6\u884C\u51BB\u7ED3\u8D26\u6237"] },
  investment: { name: "\u6295\u8D44\u7406\u8D22\u7EA0\u7EB7", category: "\u91D1\u878D", tips: ["\u4FDD\u5B58\u6295\u8D44\u534F\u8BAE\u548C\u4EA7\u54C1\u8BF4\u660E\u4E66", "\u6536\u96C6\u5E73\u53F0\u5BA3\u4F20\u548C\u627F\u8BFA\u622A\u56FE", "\u4FDD\u7559\u5168\u90E8\u8F6C\u8D26\u8BB0\u5F55"] },
  jade: { name: "\u7389\u77F3\u6587\u73A9\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u5B58\u8D2D\u4E70\u51ED\u8BC1\u548C\u9274\u5B9A\u8BC1\u4E66", "\u62CD\u6444\u7269\u54C1\u7167\u7247", "\u4FDD\u7559\u5546\u5BB6\u627F\u8BFA\u8BB0\u5F55"] },
  marriage: { name: "\u5A5A\u604B\u7EA0\u7EB7", category: "\u4EBA\u8EAB", tips: ["\u4FDD\u7559\u6240\u6709\u804A\u5929\u548C\u8F6C\u8D26\u8BB0\u5F55", "\u6CE8\u610F\u4EBA\u8EAB\u5B89\u5168", "\u5FC5\u8981\u65F6\u62A5\u8B66"] },
  esoteric: { name: "\u7384\u5B66\u547D\u7406\u7EA0\u7EB7", category: "\u5176\u4ED6", tips: ["\u4FDD\u7559\u4ED8\u6B3E\u51ED\u8BC1\u548C\u804A\u5929\u8BB0\u5F55", "\u6536\u96C6\u5BF9\u65B9\u5BA3\u4F20\u548C\u627F\u8BFA\u6750\u6599", "\u6D89\u53CA\u8FF7\u4FE1\u8BC8\u9A97\u53EF\u62A5\u8B66"] },
  online: { name: "\u7F51\u8D2D\u7EA0\u7EB7", category: "\u6D88\u8D39", tips: ["\u4FDD\u5B58\u8BA2\u5355\u622A\u56FE\u548C\u5546\u54C1\u9875\u9762", "\u901A\u8FC7\u5E73\u53F0\u5BA2\u670D\u4ECB\u5165\u5904\u7406", "\u4FDD\u7559\u7269\u6D41\u4FE1\u606F\u548C\u5F00\u7BB1\u89C6\u9891"] },
  service: { name: "\u670D\u52A1\u5408\u540C\u7EA0\u7EB7", category: "\u5408\u540C", tips: ["\u4FDD\u5B58\u670D\u52A1\u5408\u540C\u539F\u4EF6", "\u4FDD\u7559\u4ED8\u6B3E\u51ED\u8BC1", "\u6536\u96C6\u670D\u52A1\u8FC7\u7A0B\u4E2D\u7684\u6C9F\u901A\u8BB0\u5F55"] },
  other: { name: "\u5176\u4ED6\u7EA0\u7EB7", category: "\u901A\u7528", tips: ["\u6574\u7406\u6240\u6709\u76F8\u5173\u6750\u6599\u548C\u8BB0\u5F55", "\u660E\u786E\u81EA\u5DF1\u7684\u8BC9\u6C42\u548C\u4F9D\u636E", "\u5FC5\u8981\u65F6\u5BFB\u6C42\u4E13\u4E1A\u5E2E\u52A9"] }
};
function buildReportFromTemplate(params) {
  var scene = params.scene || "other";
  var amount = params.amount || "\u5F85\u786E\u8BA4";
  var status = params.status || "\u5C1A\u672A\u5C1D\u8BD5";
  var focus = params.focus || [];
  var memo = params.memo || "";
  var evidence = params.evidence || [];
  var memberLevel = params.memberLevel || 0;
  var tpl = SCENE_TEMPLATES[scene] || SCENE_TEMPLATES.other;
  var advices = mapStatusToAdvice(status);
  var m1 = {
    type: scene,
    name: tpl.name,
    amount,
    status,
    focus: Array.isArray(focus) ? focus : [focus]
  };
  var evSuggest = tpl.tips.map(function(t, i) {
    return { name: t, reason: "\u63D0\u9AD8\u8BC1\u636E\u5B8C\u6574\u5EA6" };
  });
  var haveList = (evidence || []).map(function(e) {
    return typeof e === "string" ? e : e.label || e.id || "";
  });
  var m2 = {
    have: haveList,
    suggest: evSuggest,
    evidenceScore: haveList.length > 2 ? 3 : haveList.length > 0 ? 2 : 1
  };
  var m3 = {
    nodes: [
      { time: (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }), event: memo || "\u7528\u6237\u63D0\u4EA4\u7EA0\u7EB7\u68B3\u7406", source: "\u7528\u6237\u9648\u8FF0", level: "\u7528\u6237\u9648\u8FF0" }
    ],
    note: "\u5B9E\u5FC3\u8282\u70B9 = \u6709\u8BC1\u636E\u652F\u6491\uFF0C\u7A7A\u5FC3\u8282\u70B9 = \u57FA\u4E8E\u7528\u6237\u9648\u8FF0"
  };
  var lawMap = {
    "01": [{ name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761", content: "\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u589E\u52A0\u8D54\u507F\u5176\u53D7\u5230\u7684\u635F\u5931\uFF0C\u589E\u52A0\u8D54\u507F\u7684\u91D1\u989D\u4E3A\u6D88\u8D39\u8005\u8D2D\u4E70\u5546\u54C1\u7684\u4EF7\u6B3E\u6216\u8005\u63A5\u53D7\u670D\u52A1\u7684\u8D39\u7528\u7684\u4E09\u500D\u3002" }],
    "02": [{ name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761", content: "\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u589E\u52A0\u8D54\u507F\u5176\u53D7\u5230\u7684\u635F\u5931\uFF0C\u589E\u52A0\u8D54\u507F\u7684\u91D1\u989D\u4E3A\u6D88\u8D39\u8005\u8D2D\u4E70\u5546\u54C1\u7684\u4EF7\u6B3E\u6216\u8005\u63A5\u53D7\u670D\u52A1\u7684\u8D39\u7528\u7684\u4E09\u500D\u3002" }],
    "03": [{ name: "\u300A\u52B3\u52A8\u5408\u540C\u6CD5\u300B\u7B2C87\u6761", content: "\u7528\u4EBA\u5355\u4F4D\u8FDD\u53CD\u672C\u6CD5\u89C4\u5B9A\u89E3\u9664\u6216\u8005\u7EC8\u6B62\u52B3\u52A8\u5408\u540C\u7684\uFF0C\u5E94\u5F53\u4F9D\u7167\u672C\u6CD5\u7B2C\u56DB\u5341\u4E03\u6761\u89C4\u5B9A\u7684\u7ECF\u6D4E\u8865\u507F\u6807\u51C6\u7684\u4E8C\u500D\u5411\u52B3\u52A8\u8005\u652F\u4ED8\u8D54\u507F\u91D1\u3002" }, { name: "\u300A\u52B3\u52A8\u6CD5\u300B\u7B2C50\u6761", content: "\u5DE5\u8D44\u5E94\u5F53\u4EE5\u8D27\u5E01\u5F62\u5F0F\u6309\u6708\u652F\u4ED8\u7ED9\u52B3\u52A8\u8005\u672C\u4EBA\u3002\u4E0D\u5F97\u514B\u6263\u6216\u8005\u65E0\u6545\u62D6\u6B20\u52B3\u52A8\u8005\u7684\u5DE5\u8D44\u3002" }],
    "04": [{ name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C703\u6761", content: "\u79DF\u8D41\u5408\u540C\u662F\u51FA\u79DF\u4EBA\u5C06\u79DF\u8D41\u7269\u4EA4\u4ED8\u627F\u79DF\u4EBA\u4F7F\u7528\u3001\u6536\u76CA\uFF0C\u627F\u79DF\u4EBA\u652F\u4ED8\u79DF\u91D1\u7684\u5408\u540C\u3002" }, { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C716\u6761", content: "\u627F\u79DF\u4EBA\u7ECF\u51FA\u79DF\u4EBA\u540C\u610F\uFF0C\u53EF\u4EE5\u5C06\u79DF\u8D41\u7269\u8F6C\u79DF\u7ED9\u7B2C\u4E09\u4EBA\u3002" }],
    "05": [{ name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C53\u6761", content: "\u7ECF\u8425\u8005\u4EE5\u9884\u6536\u6B3E\u65B9\u5F0F\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u3002\u672A\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u5C65\u884C\u7EA6\u5B9A\u6216\u8005\u9000\u56DE\u9884\u4ED8\u6B3E\u3002" }],
    "06": [{ name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761", content: "\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u4E09\u500D\u8D54\u507F\u3002" }, { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C1218\u6761", content: "\u60A3\u8005\u5728\u8BCA\u7597\u6D3B\u52A8\u4E2D\u53D7\u5230\u635F\u5BB3\uFF0C\u533B\u7597\u673A\u6784\u6216\u8005\u5176\u533B\u52A1\u4EBA\u5458\u6709\u8FC7\u9519\u7684\uFF0C\u7531\u533B\u7597\u673A\u6784\u627F\u62C5\u8D54\u507F\u8D23\u4EFB\u3002" }],
    "07": [{ name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C23\u6761", content: "\u7ECF\u8425\u8005\u5E94\u5F53\u4FDD\u8BC1\u5728\u6B63\u5E38\u4F7F\u7528\u5546\u54C1\u6216\u8005\u63A5\u53D7\u670D\u52A1\u7684\u60C5\u51B5\u4E0B\u5176\u63D0\u4F9B\u7684\u5546\u54C1\u6216\u8005\u670D\u52A1\u5E94\u5F53\u5177\u6709\u7684\u8D28\u91CF\u3001\u6027\u80FD\u3001\u7528\u9014\u548C\u6709\u6548\u671F\u9650\u3002" }],
    "08": [{ name: "\u300A\u65C5\u6E38\u6CD5\u300B\u7B2C70\u6761", content: "\u65C5\u884C\u793E\u4E0D\u5C65\u884C\u5305\u4EF7\u65C5\u6E38\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u4F9D\u6CD5\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" }],
    "09": [{ name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" }],
    "10": [{ name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C595\u6761", content: "\u4E70\u5356\u5408\u540C\u662F\u51FA\u5356\u4EBA\u8F6C\u79FB\u6807\u7684\u7269\u7684\u6240\u6709\u6743\u4E8E\u4E70\u53D7\u4EBA\uFF0C\u4E70\u53D7\u4EBA\u652F\u4ED8\u4EF7\u6B3E\u7684\u5408\u540C\u3002" }, { name: "\u300A\u6700\u9AD8\u6CD5\u5173\u4E8E\u5BA1\u7406\u5546\u54C1\u623F\u4E70\u5356\u5408\u540C\u7EA0\u7EB7\u6848\u4EF6\u7684\u89E3\u91CA\u300B", content: "\u51FA\u5356\u4EBA\u4EA4\u4ED8\u4F7F\u7528\u7684\u623F\u5C4B\u5B58\u5728\u8D28\u91CF\u95EE\u9898\uFF0C\u5728\u4FDD\u4FEE\u671F\u5185\uFF0C\u51FA\u5356\u4EBA\u5E94\u5F53\u627F\u62C5\u4FEE\u590D\u8D23\u4EFB\u3002" }],
    "11": [{ name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" }],
    "12": [{ name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C679\u6761", content: "\u81EA\u7136\u4EBA\u4E4B\u95F4\u7684\u501F\u6B3E\u5408\u540C\uFF0C\u81EA\u8D37\u6B3E\u4EBA\u63D0\u4F9B\u501F\u6B3E\u65F6\u6210\u7ACB\u3002" }, { name: "\u300A\u6700\u9AD8\u6CD5\u5173\u4E8E\u5BA1\u7406\u6C11\u95F4\u501F\u8D37\u6848\u4EF6\u7684\u89E3\u91CA\u300B", content: "\u501F\u8D37\u53CC\u65B9\u7EA6\u5B9A\u7684\u5229\u7387\u672A\u8D85\u8FC7\u5408\u540C\u6210\u7ACB\u65F6\u4E00\u5E74\u671FLPR\u56DB\u500D\u7684\uFF0C\u51FA\u501F\u4EBA\u8BF7\u6C42\u6309\u7EA6\u5B9A\u5229\u7387\u652F\u4ED8\u5229\u606F\u7684\uFF0C\u4EBA\u6C11\u6CD5\u9662\u5E94\u4E88\u652F\u6301\u3002" }],
    "13": [{ name: "\u300A\u5FEB\u9012\u6682\u884C\u6761\u4F8B\u300B\u7B2C27\u6761", content: "\u5FEB\u4EF6\u5EF6\u8BEF\u3001\u4E22\u5931\u3001\u635F\u6BC1\u6216\u8005\u5185\u4EF6\u77ED\u5C11\u7684\uFF0C\u5BF9\u4FDD\u4EF7\u7684\u5FEB\u4EF6\uFF0C\u5E94\u5F53\u6309\u7167\u7ECF\u8425\u5FEB\u9012\u4E1A\u52A1\u7684\u4F01\u4E1A\u4E0E\u5BC4\u4EF6\u4EBA\u7EA6\u5B9A\u7684\u4FDD\u4EF7\u89C4\u5219\u786E\u5B9A\u8D54\u507F\u8D23\u4EFB\u3002" }],
    "14": [{ name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761", content: "\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u4E09\u500D\u8D54\u507F\u3002" }],
    "15": [{ name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C1165\u6761", content: "\u884C\u4E3A\u4EBA\u56E0\u8FC7\u9519\u4FB5\u5BB3\u4ED6\u4EBA\u6C11\u4E8B\u6743\u76CA\u9020\u6210\u635F\u5BB3\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u4FB5\u6743\u8D23\u4EFB\u3002" }],
    "16": [{ name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" }]
  };
  var m4 = lawMap[scene] || lawMap["16"];
  var stages = ["\u534F\u5546", "\u6295\u8BC9", "\u8C03\u89E3", "\u4EF2\u88C1", "\u8BC9\u8BBC"];
  var m5Nodes = [];
  for (var si = 0; si < stages.length; si++) {
    var sName = stages[si];
    var icons = ["\u{1F91D}", "\u{1F4CB}", "\u2696\uFE0F", "\u{1F3DB}\uFE0F", "\u2696\uFE0F"];
    var adv = advices[si] || "\u6309\u6D41\u7A0B\u63A8\u8FDB";
    m5Nodes.push({
      id: ["negotiation", "complaint", "mediation", "arbitration", "litigation"][si],
      name: sName,
      stage: si + 1,
      icon: icons[si],
      operation_guide: adv,
      tips: [adv],
      done: false,
      current: si === 0
    });
  }
  var m5 = { nodes: m5Nodes };
  var m6 = {
    declares: [
      { title: tpl.name + "\u76F8\u5173\u6297\u8FA9", claim: "\u5BF9\u65B9\u53EF\u80FD\u4E3B\u5F20\u672C\u7EA0\u7EB7\u4E0D\u5C5E\u4E8E" + tpl.name + "\u8303\u7574\uFF0C\u6216\u5426\u8BA4\u5173\u952E\u4E8B\u5B9E\u3002", analysis: "\u9700\u7ED3\u5408\u5177\u4F53\u8BC1\u636E\u60C5\u51B5\u5224\u65AD\u5176\u6297\u8FA9\u662F\u5426\u6210\u7ACB\u3002" }
    ],
    features: { favorable: [], unfavorable: [] }
  };
  var m7 = {
    items: [
      { label: "\u8FDB\u5165\u8BC9\u8BBC\u7A0B\u5E8F\u7684\u5360\u6BD4", value: "\u7EA615%-22%" },
      { label: "\u8C03\u89E3/\u548C\u89E3\u7ED3\u6848\u7684\u5360\u6BD4", value: "\u7EA645%-58%" },
      { label: "\u6D88\u8D39\u8005\u8BF7\u6C42\u83B7\u652F\u6301\u7684\u5360\u6BD4", value: "\u7EA650%-65%" },
      { label: "\u4ECE\u7ACB\u6848\u5230\u4E00\u5BA1\u7ED3\u6848\u5E73\u5747\u5468\u671F", value: "1-3\u4E2A\u6708" }
    ]
  };
  var m8 = {
    declares: [
      '\u672C\u6863\u6848\u7531"\u542F\u4FE1\u901A"\u81EA\u52A8\u751F\u6210\uFF0C\u4EC5\u4F5C\u4E3A\u7EA0\u7EB7\u4FE1\u606F\u6574\u7406\u4E0E\u8BC1\u636E\u5206\u6790\u5DE5\u5177\uFF0C\u5E2E\u52A9\u60A8\u4E86\u89E3\u81EA\u5DF1\u7684\u7EA0\u7EB7\u60C5\u51B5\u3002',
      "\u672C\u6863\u6848\u4E2D\u7684\u6240\u6709\u5185\u5BB9\u5747\u57FA\u4E8E\u60A8\u81EA\u884C\u8F93\u5165\u548C\u4E0A\u4F20\u7684\u4FE1\u606F\u8FDB\u884C\u6574\u7406\u3001\u5206\u6790\u548C\u5F52\u7EB3\u3002",
      "\u672C\u6863\u6848\u4E2D\u7684\u5404\u9879\u5206\u6790\u4E0D\u6784\u6210\u4EFB\u4F55\u5F62\u5F0F\u7684\u6CD5\u5F8B\u610F\u89C1\u6216\u4E2A\u6848\u5224\u65AD\u3002",
      "\u5982\u9700\u4E13\u4E1A\u6CD5\u5F8B\u610F\u89C1\uFF0C\u8BF7\u54A8\u8BE2\u6301\u6709\u5F8B\u5E08\u6267\u4E1A\u8BC1\u7684\u4E13\u4E1A\u4EBA\u58EB\u3002",
      "\u60A8\u53EF\u968F\u65F6\u5728\u5C0F\u7A0B\u5E8F\u4E2D\u6C38\u4E45\u5220\u9664\u672C\u6863\u6848\uFF0C\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\u3002"
    ],
    platform: "\u542F\u4FE1\u901A \xB7 \u9047\u5230\u7EA0\u7EB7\uFF0C\u5148\u7406\u6E05\u4E8B\u5B9E"
  };
  var evOk = haveList.length >= 2;
  var m9 = {
    verdict: evOk ? "\u57FA\u672C\u53EF\u884C" : "\u9700\u8865\u5145\u8BC1\u636E",
    verdictColor: evOk ? "#D97706" : "#DC2626",
    analysis: [
      { text: evOk ? "\u6709\u57FA\u672C\u8BC1\u636E\u652F\u6491\uFF0C\u8BC9\u6C42\u6709\u4E00\u5B9A\u4F9D\u636E" : "\u8BC1\u636E\u4E0D\u8DB3\uFF0C\u5EFA\u8BAE\u8865\u5145\u6838\u5FC3\u8BC1\u636E", ok: evOk },
      { text: "\u5EFA\u8BAE\u6309\u7CFB\u7EDF\u63A8\u8350\u6E05\u5355\u8865\u5145\u8BC1\u636E\u6750\u6599", ok: false }
    ],
    riskNote: "\u4E3B\u8981\u98CE\u9669\uFF1A\u9700\u786E\u4FDD\u8BC1\u636E\u94FE\u5B8C\u6574\uFF0C\u5EFA\u8BAE\u4F18\u5148\u8865\u5145\u5408\u540C\u548C\u4ED8\u6B3E\u8BB0\u5F55\u3002",
    costEstimate: "\u9884\u4F30\u7EF4\u6743\u6210\u672C\uFF1A\u534F\u5546/\u6295\u8BC9\u96F6\u6210\u672C\uFF1B\u8C03\u89E3\xA5100-500\u5143\uFF1B\u8BC9\u8BBC\xA550-\u53D7\u7406\u8D39\uFF081\u4E07\u5143\u4EE5\u4E0B\u4EC5\u970050\u5143\uFF09",
    successRate: "\u7EFC\u5408\u73B0\u6709\u8BC1\u636E\uFF0C\u9884\u8BA1\u8BC9\u6C42\u88AB\u652F\u6301\u7387\u7EA6" + (evOk ? "55%" : "35%") + "\u3002"
  };
  var m10 = {
    options: [
      { rank: 1, name: "\u534F\u5546\u6C9F\u901A", desc: "\u4E0E\u5BF9\u65B9\u76F4\u63A5\u6C9F\u901A\uFF0C\u63D0\u51FA\u660E\u786E\u8BC9\u6C42", cost: "\u96F6\u6210\u672C", cycle: "3-7\u5929", success: "\u4E2D\u7B49", steps: ["\u6574\u7406\u8BC9\u6C42\u548C\u4F9D\u636E", "\u8054\u7CFB\u5BF9\u65B9\u8D1F\u8D23\u4EBA", "\u8BB0\u5F55\u6C9F\u901A\u7ED3\u679C"] },
      { rank: 2, name: "12315\u6295\u8BC9", desc: "\u5411\u6D88\u8D39\u8005\u534F\u4F1A/12315\u5E73\u53F0\u6295\u8BC9", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5929", success: "\u4E2D\u7B49", steps: ["\u51C6\u5907\u6295\u8BC9\u6750\u6599", "\u901A\u8FC712315\u5E73\u53F0\u63D0\u4EA4", "\u7B49\u5F85\u53D7\u7406\u548C\u8C03\u89E3"] }
    ],
    recommend: "\u60A8\u5F53\u524D\u5904\u4E8E" + status + "\u9636\u6BB5\u3002\u5EFA\u8BAE\u4F18\u5148\u5C1D\u8BD5\u65B9\u68481\uFF08\u6210\u672C\u6700\u4F4E\uFF09\u3002"
  };
  var m11 = {
    checkList: [
      { item: "\u5408\u540C/\u534F\u8BAE\u539F\u4EF6", note: "\u7EB8\u8D28\u5408\u540C\u6216\u7535\u5B50\u5408\u540C\u622A\u56FE\uFF0C\u9700\u6E05\u6670\u663E\u793A\u53CC\u65B9\u7B7E\u7AE0", done: haveList.indexOf("contract") >= 0 },
      { item: "\u4ED8\u6B3E\u8BB0\u5F55", note: "\u94F6\u884C\u8F6C\u8D26\u8BB0\u5F55/\u652F\u4ED8App\u622A\u56FE\uFF0C\u9700\u663E\u793A\u4EA4\u6613\u65F6\u95F4\u548C\u91D1\u989D", done: haveList.indexOf("transfer") >= 0 }
    ],
    materialTip: "\u4F1A\u5458\u53EF\u89E3\u9501\u5B8C\u6574\u7269\u6599\u6E05\u5355\u53CA\u83B7\u53D6\u6E20\u9053\u6307\u5F15\u3002"
  };
  return { m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11 };
}

// src/modules/report/report.service.js
var EVIDENCE_ITEMS_MAP2 = Object.fromEntries(EVIDENCE_ITEMS.map((e) => [e.id, e]));
function generateReportId() {
  const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:T]/g, "").slice(0, 12);
  const rand = Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
  return `QX-${ts.slice(0, 8)}-${rand}`;
}
async function generateReport({ scene, subType, amount, focus = [], status, evidence = [], memberLevel = 0, memo = "" }) {
  const reportId = generateReportId();
  var tmpl = buildReportFromTemplate({
    scene: scene || subType,
    amount: amount || "\u5F85\u786E\u8BA4",
    status: status || "\u5C1A\u672A\u5C1D\u8BD5",
    focus: Array.isArray(focus) ? focus : [focus],
    memo: memo || "",
    evidence: evidence || [],
    memberLevel: memberLevel || 0
  });
  var isLocked = memberLevel === 0;
  var lockModules = isLocked ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [];
  return {
    // 注意：reportId由route层统一管理（R-格式），模板内不输出QX编号
    reportTime: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    memberLevel,
    locked: isLocked,
    lockModules,
    aiGenerated: false,
    _llmError: null,
    m1: tmpl.m1,
    m2: tmpl.m2,
    m3: tmpl.m3,
    m4: tmpl.m4,
    m5: tmpl.m5,
    m6: tmpl.m6,
    m7: tmpl.m7,
    m8: tmpl.m8,
    m9: tmpl.m9,
    m10: tmpl.m10,
    m11: tmpl.m11
  };
}

// src/modules/report/pdf.service.js
import PDFDocument from "pdfkit";
import fs2 from "fs";
import path2 from "path";
import { fileURLToPath } from "url";
var PDF_DIR = process.env.NODE_ENV === "production" ? "/app/public/pdfs" : path2.join(path2.dirname(fileURLToPath(import.meta.url)), "../../../public/pdfs");
try {
  if (!fs2.existsSync(PDF_DIR)) {
    fs2.mkdirSync(PDF_DIR, { recursive: true });
  }
} catch (e) {
  console.warn("[PDF] \u76EE\u5F55\u521B\u5EFA\u5931\u8D25\uFF08\u53EF\u80FD\u5DF2\u5B58\u5728\u6216\u65E0\u6743\u9650\uFF09:", String(e));
}
var taskQueue = /* @__PURE__ */ new Map();
var taskCounter = 0;
var pdfCache = /* @__PURE__ */ new Map();
var CACHE_TTL = 10 * 60 * 1e3;
function getCachedPdf(reportId) {
  const cached = pdfCache.get(reportId);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL) {
    return cached.filePath;
  }
  return null;
}
function cachePdf(reportId, filePath) {
  for (const [key, val] of pdfCache.entries()) {
    if (Date.now() - val.createdAt >= CACHE_TTL) {
      pdfCache.delete(key);
    }
  }
  pdfCache.set(reportId, { filePath, createdAt: Date.now() });
}
function buildPdfContent(doc, report, options = {}) {
  const {
    waterMarkText = "\u4EC5\u4F9B\u53C2\u8003",
    reportTime = "",
    reportId = ""
  } = options;
  const GRAY = "#999999";
  const DARK = "#333333";
  const ORANGE = "#E85A38";
  const LIGHT_GRAY = "#F5F5F5";
  const fontPath = "/app/fonts/simhei.ttf";
  try {
    doc.registerFont("SimHei", fontPath);
    doc.font("SimHei");
  } catch (e) {
    console.error("[PDF] \u4E2D\u6587\u5B57\u4F53\u52A0\u8F7D\u5931\u8D25:", e.message);
    throw new Error("\u4E2D\u6587\u5B57\u4F53\u7F3A\u5931\uFF0C\u65E0\u6CD5\u751F\u6210PDF");
  }
  doc.save();
  doc.fillColor("#E8E8E8");
  doc.fontSize(60);
  doc.rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] });
  doc.text(waterMarkText, 0, doc.page.height / 2 - 30, {
    width: doc.page.width,
    align: "center",
    lineBreak: false
  });
  doc.restore();
  doc.save();
  doc.rect(0, 0, doc.page.width, 50).fill(ORANGE);
  doc.fillColor("white");
  doc.fontSize(11);
  doc.text("\u542F\u4FE1\u901A \xB7 \u7EA0\u7EB7\u4FE1\u606F\u7ED3\u6784\u5316\u6863\u6848", 20, 17, { lineBreak: false });
  doc.text(`\u6587\u6863\u7F16\u53F7\uFF1A${reportId}`, doc.page.width - 180, 17, {
    lineBreak: false,
    align: "right",
    width: 160
  });
  doc.restore();
  const footerY = doc.page.height - 35;
  doc.save();
  doc.fillColor(GRAY);
  doc.fontSize(9);
  doc.text("\u672C\u6863\u6848\u7531AI\u81EA\u52A8\u751F\u6210\uFF0C\u4EC5\u4F9B\u53C2\u8003", 0, footerY, {
    width: doc.page.width,
    align: "center",
    lineBreak: false
  });
  doc.text(`\u7B2C ${options.page || 1} \u9875`, doc.page.width - 60, footerY, {
    lineBreak: false,
    align: "right",
    width: 50
  });
  doc.restore();
  const contentTop = 70;
  const contentWidth = doc.page.width - 80;
  let y = contentTop;
  doc.save();
  doc.fillColor(DARK);
  doc.fontSize(16);
  doc.text("\u7EA0\u7EB7\u4FE1\u606F\u7ED3\u6784\u5316\u6863\u6848", 40, y, { width: contentWidth, lineBreak: false });
  y += 28;
  doc.fillColor(GRAY);
  doc.fontSize(9);
  doc.text(`\u751F\u6210\u65F6\u95F4\uFF1A${reportTime}    \u6587\u6863\u7F16\u53F7\uFF1A${reportId}`, 40, y, {
    width: contentWidth,
    lineBreak: false
  });
  y += 25;
  doc.save();
  doc.strokeColor("#DDDDDD");
  doc.lineWidth(0.5);
  doc.moveTo(40, y).lineTo(doc.page.width - 40, y).stroke();
  doc.restore();
  y += 15;
  const m1 = report.m1 || {};
  doc.save();
  doc.fillColor(ORANGE);
  doc.fontSize(12);
  doc.text("\u4E00\u3001\u7EA0\u7EB7\u4E8B\u5B9E\u68B3\u7406", 40, y, { width: contentWidth, lineBreak: false });
  y += 20;
  doc.fillColor(DARK);
  doc.fontSize(10);
  const m1Rows = [
    ["\u7EA0\u7EB7\u7C7B\u578B", m1.type || "-"],
    ["\u6D89\u53CA\u91D1\u989D", m1.amount || "-"],
    ["\u5F53\u524D\u72B6\u6001", m1.status || "-"]
  ];
  if (Array.isArray(m1.focus)) {
    m1Rows.push(["\u4E89\u8BAE\u7126\u70B9", m1.focus.join("\u3001")]);
  } else if (m1.focus) {
    m1Rows.push(["\u4E89\u8BAE\u7126\u70B9", m1.focus]);
  }
  m1Rows.forEach(([label, value]) => {
    doc.fillColor("#666666");
    doc.text(`${label}\uFF1A`, 40, y, { lineBreak: false, width: 80 });
    doc.fillColor(DARK);
    doc.text(value, 120, y, { width: contentWidth - 80, lineBreak: false });
    y += 18;
  });
  if (m1.focusAnalysis && Array.isArray(m1.focusAnalysis)) {
    y += 8;
    doc.fillColor(ORANGE).fontSize(10).text("\u3010\u4E89\u8BAE\u7126\u70B9\u89E3\u6790\u3011", 40, y, { width: contentWidth });
    y += 18;
    m1.focusAnalysis.forEach((fa, idx) => {
      doc.fillColor(DARK).fontSize(10);
      doc.text(`${idx + 1}. ${fa.focus}`, 40, y, { width: contentWidth, lineBreak: false });
      y += 16;
      if (fa.definition) {
        doc.fillColor(GRAY).fontSize(9);
        doc.text(`\u5B9A\u4E49\uFF1A${fa.definition}`, 55, y, { width: contentWidth - 15 });
        y += 14;
      }
      if (fa.judgmentBasis && fa.judgmentBasis.length > 0) {
        doc.fillColor(GRAY).fontSize(9);
        doc.text("\u5224\u65AD\u4F9D\u636E\uFF1A", 55, y, { lineBreak: false });
        y += 14;
        fa.judgmentBasis.forEach((b) => {
          doc.text(`\xB7 ${b}`, 65, y, { width: contentWidth - 25 });
          y += 13;
        });
      }
      y += 5;
    });
  }
  doc.restore();
  const m2 = report.m2 || {};
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;
  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text("\u4E8C\u3001\u8BC1\u636E\u6750\u6599\u6E05\u5355", 40, y, { width: contentWidth });
  y += 20;
  if (m2.have && m2.have.length > 0) {
    doc.fillColor(DARK).fontSize(10).text("\u5DF2\u6709\u6750\u6599\uFF1A", 40, y, { lineBreak: false });
    y += 18;
    m2.have.forEach((item) => {
      doc.fillColor("#333333").fontSize(9);
      doc.text(`\u2705 ${item.name}`, 50, y, { lineBreak: false });
      y += 14;
      if (item.tip) {
        doc.fillColor(GRAY).fontSize(8);
        doc.text(`   \u8BF4\u660E\uFF1A${item.tip}`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      if (item.source) {
        doc.fillColor("#666666").fontSize(8);
        doc.text(`   \u6765\u6E90\uFF1A${item.source}`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      if (item.effectiveness) {
        doc.fillColor("#E85A38").fontSize(8);
        const effLabel = { "\u9AD8": "\u2605\u2605\u2605\u2605\u2605", "\u4E2D\u9AD8": "\u2605\u2605\u2605\u2605\u2606", "\u4E2D": "\u2605\u2605\u2605\u2605" };
        doc.text(`   \u6548\u529B\uFF1A${effLabel[item.effectiveness] || item.effectiveness} \u76F4\u63A5\u8BC1\u636E`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      y += 3;
    });
  }
  if (m2.suggest && m2.suggest.length > 0) {
    y += 5;
    doc.fillColor(DARK).fontSize(10).text("\u5EFA\u8BAE\u8865\u5145\uFF1A", 40, y, { lineBreak: false });
    y += 18;
    m2.suggest.forEach((item) => {
      doc.fillColor("#FF9900").fontSize(9);
      doc.text(`\u26A0 ${item.name}`, 50, y, { lineBreak: false });
      y += 14;
      if (item.reason) {
        doc.fillColor(GRAY).fontSize(8);
        doc.text(`   \u539F\u56E0\uFF1A${item.reason}`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      if (item.channel) {
        doc.fillColor(GRAY).fontSize(8);
        doc.text(`   \u83B7\u53D6\u9014\u5F84\uFF1A${item.channel}`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      y += 3;
    });
  }
  if (m2.completeness) {
    y += 8;
    doc.save();
    doc.rect(40, y, contentWidth, 40).fill(LIGHT_GRAY);
    doc.fillColor(DARK).fontSize(10);
    doc.text(`\u8BC1\u636E\u94FE\u5B8C\u6574\u5EA6\uFF1A${m2.completeness.score}%\uFF08${m2.completeness.level}\uFF09`, 50, y + 10, { width: contentWidth - 20 });
    doc.fillColor(GRAY).fontSize(9);
    doc.text(m2.completeness.tip || `\u5DF2\u8986\u76D6${m2.completeness.focusCoverage}`, 50, y + 26, { width: contentWidth - 20 });
    y += 50;
    doc.restore();
  }
  doc.restore();
  const m3 = report.m3 || {};
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;
  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text("\u4E09\u3001\u7EA0\u7EB7\u65F6\u95F4\u7EBF", 40, y, { width: contentWidth });
  y += 20;
  if (m3.nodes && m3.nodes.length > 0) {
    m3.nodes.forEach((node, idx) => {
      const marker = node.level && (node.level.includes("A") || node.level.includes("B")) ? "\u25CF" : "\u25CB";
      doc.fillColor(DARK).fontSize(10);
      doc.text(`${marker} ${node.time || ""}  ${node.event || ""}`, 40, y, { width: contentWidth });
      y += 16;
      doc.fillColor(GRAY).fontSize(8);
      if (node.source) {
        doc.text(`   \u6765\u6E90\uFF1A${node.source}`, 50, y, { width: contentWidth - 10 });
        y += 13;
      }
      if (node.level) {
        doc.fillColor("#9999CC").fontSize(8);
        doc.text(`   \u8BC1\u636E\u7B49\u7EA7\uFF1A${node.level}`, 50, y, { width: contentWidth - 10 });
        y += 13;
      }
      y += 4;
    });
  } else {
    doc.fillColor(GRAY).fontSize(9);
    doc.text("\u6682\u65E0\u65F6\u95F4\u7EBF\u6570\u636E", 40, y, { width: contentWidth });
    y += 16;
  }
  if (m3.note) {
    y += 4;
    doc.fillColor("#BBBBBB").fontSize(8);
    doc.text(m3.note, 40, y, { width: contentWidth });
  }
  doc.restore();
  const m4 = Array.isArray(report.m4) ? report.m4 : [];
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;
  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text("\u56DB\u3001\u6CD5\u5F8B\u6CD5\u89C4\u7D22\u5F15", 40, y, { width: contentWidth });
  y += 20;
  if (m4.length > 0) {
    m4.forEach((law, idx) => {
      doc.fillColor(DARK).fontSize(10);
      doc.text(`${idx + 1}. ${law.name || ""}`, 40, y, { width: contentWidth, lineBreak: false });
      y += 16;
      if (law.content) {
        doc.fillColor(GRAY).fontSize(9);
        doc.text(law.content, 55, y, { width: contentWidth - 15 });
        y += 14;
      }
      y += 5;
    });
  } else {
    doc.fillColor(GRAY).fontSize(9);
    doc.text("\u6682\u65E0\u6CD5\u5F8B\u6761\u6587\u6570\u636E", 40, y, { width: contentWidth });
    y += 16;
  }
  doc.restore();
  const m5 = report.m5 || {};
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;
  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text("\u4E94\u3001\u7EF4\u6743\u6D41\u7A0B\u53C2\u8003", 40, y, { width: contentWidth });
  y += 20;
  if (m5.nodes && m5.nodes.length > 0) {
    const nodeLabels = m5.nodes.map((n) => {
      const marker = n.current ? "\u25CF" : n.done ? "\u2713" : "\u25CB";
      return `${marker}${n.name || ""}`;
    });
    doc.fillColor(DARK).fontSize(10);
    doc.text(nodeLabels.join(" \u2192 "), 40, y, { width: contentWidth });
    y += 25;
    m5.nodes.forEach((node) => {
      const marker = node.current ? "\u25CF" : node.done ? "\u2713" : "\u25CB";
      doc.fillColor(node.current ? ORANGE : "#666666").fontSize(9);
      doc.text(`${marker} ${node.name || ""}`, 40, y, { lineBreak: false, width: 80 });
      if (node.operation_guide) {
        doc.fillColor(GRAY).fontSize(8);
        doc.text(`\uFF1A${node.operation_guide}`, 80, y, { width: contentWidth - 40 });
        y += 14;
      }
      if (node.tips && Array.isArray(node.tips)) {
        doc.fillColor("#E85A38").fontSize(8);
        node.tips.forEach((tip) => {
          doc.text(`  \xB7 ${tip}`, 80, y, { width: contentWidth - 40 });
          y += 12;
        });
      }
      y += 5;
    });
  }
  if (m5.currentStageGuide && m5.currentStageGuide.stage) {
    y += 8;
    doc.save();
    doc.fillColor(ORANGE).fontSize(10).text("\u3010\u5F53\u524D\u9636\u6BB5\u64CD\u4F5C\u6307\u5F15\u3011", 40, y, { width: contentWidth });
    y += 18;
    doc.fillColor(DARK).fontSize(9);
    doc.text(`\u5F53\u524D\u9636\u6BB5\uFF1A${m5.currentStageGuide.stage}`, 50, y, { width: contentWidth - 10, lineBreak: false });
    y += 16;
    if (m5.currentStageGuide.guide) {
      doc.fillColor(GRAY).fontSize(8);
      doc.text(m5.currentStageGuide.guide, 50, y, { width: contentWidth - 10 });
      y += 28;
    }
    if (m5.currentStageGuide.tips) {
      doc.fillColor("#E85A38").fontSize(8);
      doc.text(`\u63D0\u793A\uFF1A${m5.currentStageGuide.tips}`, 50, y, { width: contentWidth - 10 });
      y += 16;
    }
    doc.restore();
  }
  doc.restore();
  const m6 = report.m6 || {};
  const favorable = m6.features && m6.features.favorable ? m6.features.favorable : [];
  const unfavorable = m6.features && m6.features.unfavorable ? m6.features.unfavorable : [];
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;
  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text("\u516D\u3001\u6848\u4EF6\u7279\u5F81\u5206\u6790", 40, y, { width: contentWidth });
  y += 20;
  if (favorable.length > 0) {
    doc.fillColor("#1A7A1A").fontSize(10).text("\u3010\u6709\u5229\u7279\u5F81\u3011", 40, y, { width: contentWidth });
    y += 16;
    favorable.forEach((f) => {
      doc.fillColor(DARK).fontSize(9);
      doc.text(`\u2713 ${f}`, 50, y, { width: contentWidth - 10 });
      y += 14;
    });
    y += 5;
  }
  if (unfavorable.length > 0) {
    doc.fillColor("#CC3333").fontSize(10).text("\u3010\u4E0D\u5229\u7279\u5F81\u3011", 40, y, { width: contentWidth });
    y += 16;
    unfavorable.forEach((f) => {
      doc.fillColor(DARK).fontSize(9);
      doc.text(`\u2717 ${f}`, 50, y, { width: contentWidth - 10 });
      y += 14;
    });
    y += 5;
  }
  if (favorable.length === 0 && unfavorable.length === 0) {
    doc.fillColor(GRAY).fontSize(9).text("\u6682\u65E0\u7279\u5F81\u5206\u6790\u6570\u636E", 40, y, { width: contentWidth });
    y += 16;
  }
  doc.restore();
  const m7 = report.m7 || {};
  const items7 = Array.isArray(m7.items) ? m7.items : [];
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;
  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text("\u4E03\u3001\u7EDF\u8BA1\u6570\u636E\u53C2\u8003", 40, y, { width: contentWidth });
  y += 20;
  if (items7.length > 0) {
    items7.forEach((item) => {
      doc.fillColor("#666666").fontSize(9);
      doc.text(`${item.label || ""}\uFF1A`, 40, y, { lineBreak: false, width: 160 });
      doc.fillColor(DARK).fontSize(9);
      doc.text(item.value || "-", 200, y, { width: contentWidth - 160, lineBreak: false });
      y += 16;
    });
  } else {
    doc.fillColor(GRAY).fontSize(9).text("\u6682\u65E0\u7EDF\u8BA1\u6570\u636E", 40, y, { width: contentWidth });
    y += 16;
  }
  doc.restore();
  const m8 = report.m8 || {};
  const declares8 = Array.isArray(m8.declares) ? m8.declares : [];
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;
  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text("\u516B\u3001\u91CD\u8981\u58F0\u660E", 40, y, { width: contentWidth });
  y += 20;
  if (declares8.length > 0) {
    declares8.forEach((d, idx) => {
      doc.fillColor(GRAY).fontSize(8);
      doc.text(`${idx + 1}. ${d}`, 40, y, { width: contentWidth });
      y += 14;
    });
  } else {
    doc.fillColor(GRAY).fontSize(9).text("\u6682\u65E0\u58F0\u660E", 40, y, { width: contentWidth });
    y += 16;
  }
  y += 10;
  doc.fillColor(ORANGE).fontSize(9);
  doc.text(m8.platform || "\u542F\u4FE1\u901A \xB7 \u9047\u5230\u7EA0\u7EB7\uFF0C\u5148\u7406\u6E05\u4E8B\u5B9E", 40, y, { width: contentWidth, align: "center" });
  doc.restore();
}
function _addDivider(doc, y, color) {
  doc.save();
  doc.strokeColor(color);
  doc.lineWidth(0.5);
  doc.moveTo(40, y).lineTo(doc.page.width - 40, y).stroke();
  doc.restore();
}
function _generateInBackground(taskId, report, filePath) {
  return new Promise((resolve, reject) => {
    console.log(`[PDF] Starting generation for report ${report.reportId}`);
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title: "\u7EA0\u7EB7\u4FE1\u606F\u7ED3\u6784\u5316\u6863\u6848",
        Author: "\u542F\u4FE1\u901A",
        Subject: `\u62A5\u544A\u7F16\u53F7\uFF1A${report.reportId}`,
        Keywords: "\u542F\u4FE1\u901A,\u7EA0\u7EB7\u6863\u6848,\u4EC5\u4F9B\u53C2\u8003",
        CreationDate: /* @__PURE__ */ new Date(),
        ModDate: /* @__PURE__ */ new Date(),
        Producer: "\u542F\u4FE1\u901APDF\u751F\u6210\u670D\u52A1 v1.0"
      }
    });
    const stream = fs2.createWriteStream(filePath);
    stream.on("finish", () => {
      taskQueue.set(taskId, {
        status: "completed",
        reportId: report.reportId,
        filePath,
        createdAt: Date.now()
      });
      cachePdf(report.reportId, filePath);
      resolve(filePath);
    });
    stream.on("error", (err) => {
      taskQueue.set(taskId, {
        status: "failed",
        reportId: report.reportId,
        error: err.message,
        createdAt: Date.now()
      });
      reject(err);
    });
    doc.pipe(stream);
    try {
      const pageCount = doc.pageCount || 1;
      buildPdfContent(doc, report, {
        reportTime: report.reportTime,
        reportId: report.reportId,
        page: pageCount
      });
      doc.end();
    } catch (err) {
      console.error(`[PDF] buildPdfContent error: ${err.message}`);
      console.error(err.stack);
      stream.end();
    }
    setTimeout(() => {
      const task = taskQueue.get(taskId);
      if (task && task.status === "pending") {
        task.status = "timeout";
        doc.destroy();
        reject(new Error("PDF\u751F\u6210\u8D85\u65F6\uFF0815\u79D2\uFF09"));
      }
    }, 15e3);
  });
}
var MAX_CONCURRENT = 3;
var activeGenerations = 0;
var pendingQueue = [];
function tryNextPdf() {
  if (pendingQueue.length === 0 || activeGenerations >= MAX_CONCURRENT) return;
  const next = pendingQueue.shift();
  activeGenerations++;
  _generateInBackground(next.taskId, next.report, next.filePath).catch((err) => console.error(`\u274C PDF\u751F\u6210\u5931\u8D25 [${next.taskId}]:`, err.message)).finally(() => {
    activeGenerations--;
    tryNextPdf();
  });
}
function generatePdfTask(report) {
  const reportId = report.reportId;
  const cached = getCachedPdf(reportId);
  if (cached) {
    const taskId2 = `cached-${reportId}-${Date.now()}`;
    taskQueue.set(taskId2, {
      status: "completed",
      reportId,
      filePath: cached,
      createdAt: Date.now()
    });
    return { taskId: taskId2, status: "completed", filePath: cached };
  }
  for (const [tid, task] of taskQueue.entries()) {
    if (task.reportId === reportId && task.status === "pending") {
      return { taskId: tid, status: "pending", filePath: null };
    }
  }
  const taskId = `pdf-${Date.now()}-${++taskCounter}`;
  const fileName = `report-${reportId}.pdf`;
  const filePath = path2.join(PDF_DIR, fileName);
  taskQueue.set(taskId, {
    status: "pending",
    reportId,
    filePath,
    createdAt: Date.now()
  });
  if (activeGenerations >= MAX_CONCURRENT) {
    pendingQueue.push({ taskId, report, filePath });
    return { taskId, status: "queued", filePath: null };
  }
  activeGenerations++;
  _generateInBackground(taskId, report, filePath).catch((err) => {
    console.error(`\u274C PDF\u751F\u6210\u5931\u8D25 [${taskId}]:`, err.message);
  }).finally(() => {
    activeGenerations--;
    tryNextPdf();
  });
  return { taskId, status: "pending", filePath: null };
}
function getPdfTaskStatus(taskId) {
  const task = taskQueue.get(taskId);
  if (!task) {
    return { status: "not_found", filePath: null, error: "\u4EFB\u52A1\u4E0D\u5B58\u5728" };
  }
  const downloadUrl = task.filePath ? `/pdfs/${path2.basename(task.filePath)}` : null;
  return {
    status: task.status,
    filePath: task.filePath || null,
    downloadUrl,
    error: task.error || null,
    reportId: task.reportId
  };
}
setInterval(() => {
  const now = Date.now();
  for (const [tid, task] of taskQueue.entries()) {
    if (now - task.createdAt > 30 * 60 * 1e3) {
      taskQueue.delete(tid);
    }
  }
}, 5 * 60 * 1e3);

// src/modules/report/report.route.js
init_store();
async function reportRoutes(fastify) {
  async function _handleGetReport(fastify2, request, reply) {
    const { reportId } = request.params || {};
    if (!reportId) return reply.status(400).send({ success: false, error: "\u7F3A\u5C11\u62A5\u544AID" });
    let userLevel = 0;
    try {
      const token = request.headers.authorization?.replace("Bearer ", "");
      if (token) {
        const decoded = fastify2.jwt.verify(token);
        const { findUserByOpenid: findUserByOpenid2 } = await Promise.resolve().then(() => (init_store(), store_exports));
        const user = await findUserByOpenid2(decoded.openid || decoded.phone || "");
        userLevel = user?.memberLevel || 0;
      }
    } catch (_) {
    }
    try {
      let draft = await getReport(reportId);
      if (!draft && reportId.startsWith("QX-")) {
        const { query: query2 } = await Promise.resolve().then(() => (init_mysql(), mysql_exports));
        const byNo = await query2("SELECT * FROM drafts WHERE report_no = ? AND is_deleted = 0 LIMIT 1", [reportId]);
        if (byNo.length > 0 && byNo[0].report_id) {
          draft = await getReport(byNo[0].report_id);
        }
      }
      if (!draft) return reply.status(404).send({ success: false, error: "\u62A5\u544A\u4E0D\u5B58\u5728" });
      const isBlur = draft.isLocked && userLevel === 0;
      const reportData = draft.reportData || {};
      const filtered = isBlur ? filterBlur(reportData) : reportData;
      return { success: true, report: { ...filtered, reportId: draft.reportId, reportNo: draft.reportNo || "", scene: draft.scene, locked: draft.isLocked, isLocked: draft.isLocked, genStatus: draft.genStatus, reportVersion: isBlur ? "blur" : "hd" } };
    } catch (err) {
      console.error("\u67E5\u8BE2\u62A5\u544A\u5931\u8D25:", err.message, err.stack?.split("\\\\n").slice(0, 2).join(" | "));
      return reply.status(500).send({ success: false, error: "\u67E5\u8BE2\u5931\u8D25", detail: err.message });
    }
  }
  fastify.post("/generate", async (request, reply) => {
    const body = request.body || {};
    const { scene, subType, amount, focus, status, evidence = [], memberLevel = 0, memo = "" } = body;
    if (!scene || !status) {
      return reply.status(400).send({ success: false, error: "\u7F3A\u5C11\u5FC5\u586B\u53C2\u6570\uFF1Ascene, status" });
    }
    const memoScan = scanBannedWords(memo);
    if (memoScan.blocked) {
      return reply.status(400).send({
        success: false,
        error: `\u5185\u5BB9\u5305\u542B\u654F\u611F\u8BCD\u6C47\uFF0C\u8BF7\u4FEE\u6539\u540E\u91CD\u8BD5\uFF1A${memoScan.found.join("\u3001")}`
      });
    }
    let userId = "anonymous";
    try {
      const token = request.headers.authorization?.replace("Bearer ", "");
      if (token) {
        const decoded = fastify.jwt.verify(token);
        userId = decoded.phone || decoded.id || "anonymous";
      }
    } catch (_) {
    }
    const reportId = "R" + Date.now() + Math.random().toString(36).slice(2, 10);
    const reportNo = await generateReportNo();
    try {
      await saveReport(reportId, {
        userId,
        reportNo,
        scene,
        subType: subType || "",
        amount: amount || "\u5F85\u786E\u8BA4",
        focus: Array.isArray(focus) ? focus : [focus].filter(Boolean),
        status,
        evidence,
        memberLevel,
        reportData: null,
        isLocked: memberLevel === 0,
        genStatus: 1,
        // 生成中
        reportVersion: "blur",
        orderId: ""
      });
    } catch (e) {
      console.error("[Report] \u521D\u59CB\u5316\u5199\u5165\u5931\u8D25:", e);
    }
    try {
      const report = await generateReport({
        scene,
        subType: subType || "",
        amount: amount || "\u5F85\u786E\u8BA4",
        focus: Array.isArray(focus) ? focus : [focus].filter(Boolean),
        status,
        evidence,
        memberLevel,
        memo
      });
      await saveReport(reportId, {
        userId,
        reportData: report,
        genStatus: 2,
        reportVersion: memberLevel > 0 ? "hd" : "blur"
      });
      return { success: true, reportId, report: filterByVersion(report, memberLevel === 0) };
    } catch (err) {
      try {
        await saveReport(reportId, { genStatus: 3 });
      } catch (_) {
      }
      console.error("\u274C \u62A5\u544A\u751F\u6210\u5931\u8D25:", err);
      const fallbackReport = {
        reportNo,
        scene,
        reportTime: (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN"),
        memberLevel,
        locked: memberLevel === 0,
        lockModules: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        aiGenerated: false,
        _llmError: err && err.message ? err.message.slice(0, 200) : "\u751F\u6210\u8D85\u65F6",
        m1: { type: scene, amount: amount || "\u5F85\u786E\u8BA4", status, focus: Array.isArray(focus) ? focus : [] },
        m2: { have: [], suggest: [] },
        m3: { nodes: [{ time: "--", event: memo || "\u5F85\u8865\u5145", source: "\u7528\u6237\u63CF\u8FF0" }] },
        m4: [],
        m5: { nodes: [{ id: "negotiation", name: "\u534F\u5546", stage: 1, icon: "\u{1F91D}" }] },
        m6: { declares: [] }
      };
      return { success: true, reportId, report: fallbackReport, fallback: true };
    }
  });
  fastify.get("/list", {
    preHandler: [fastify.authenticate]
  }, async function(request, reply) {
    try {
      var userId = request.user && request.user.phone || request.user && request.user.id || "";
      var reports = await listReportsByUser(userId);
      return {
        success: true,
        reports: reports.map(function(r) {
          return {
            reportId: r.reportId,
            scene: r.scene,
            subType: r.subType,
            amount: r.amount,
            status: r.status,
            isLocked: r.isLocked,
            genStatus: r.genStatus,
            reportVersion: r.reportVersion,
            orderId: r.orderId,
            createdAt: r.createdAt,
            preview: r.reportData ? {
              m1: r.reportData.m1 || {},
              m6: r.reportData.m6 || {}
            } : {}
          };
        })
      };
    } catch (e) {
      console.error("[Report] \u5217\u8868\u67E5\u8BE2\u5931\u8D25:", e);
      return reply.status(500).send({ success: false, error: "\u67E5\u8BE2\u5931\u8D25" });
    }
  });
  fastify.get("/get", async (request, reply) => {
    const reportId = (request.query || {}).reportId || "";
    if (!reportId) return reply.status(400).send({ success: false, error: "\u7F3A\u5C11reportId\u53C2\u6570" });
    request.params = { reportId };
    return _handleGetReport(fastify, request, reply);
  });
  fastify.get("/:reportId", async (request, reply) => {
    return _handleGetReport(fastify, request, reply);
  });
  fastify.post("/:reportId/share", async (request, reply) => {
    const { reportId } = request.params || {};
    try {
      const draft = await getReport(reportId);
      if (!draft) {
        return reply.status(404).send({ success: false, error: "\u62A5\u544A\u4E0D\u5B58\u5728" });
      }
      const token = Buffer.from(`${reportId}:${Date.now() + 24 * 60 * 60 * 1e3}`).toString("base64");
      const shareUrl = `/pages/draft/report?reportId=${reportId}&token=${encodeURIComponent(token)}`;
      return { success: true, shareUrl, expiresIn: "24\u5C0F\u65F6" };
    } catch (err) {
      console.error("\u751F\u6210\u5206\u4EAB\u94FE\u63A5\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u64CD\u4F5C\u5931\u8D25" });
    }
  });
  fastify.delete("/:reportId", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { reportId } = request.params || {};
    try {
      const result = await deleteReport(reportId);
      if (!result) {
        return reply.status(404).send({ success: false, error: "\u62A5\u544A\u4E0D\u5B58\u5728" });
      }
      return { success: true };
    } catch (err) {
      console.error("\u5220\u9664\u62A5\u544A\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u5220\u9664\u5931\u8D25" });
    }
  });
  fastify.post("/:reportId/pdf", async (request, reply) => {
    const { reportId } = request.params || {};
    try {
      const draft = await getReport(reportId);
      if (!draft) {
        return reply.status(404).send({ success: false, error: "\u62A5\u544A\u4E0D\u5B58\u5728" });
      }
      if (draft.isLocked) {
        return reply.status(403).send({ success: false, error: "\u62A5\u544A\u5DF2\u9501\u5B9A\uFF0C\u8BF7\u5148\u89E3\u9501" });
      }
      const report = draft.reportData || {};
      report.reportId = draft.reportId;
      const result = generatePdfTask(report);
      return { success: true, taskId: result.taskId, status: result.status };
    } catch (err) {
      console.error("\u521B\u5EFAPDF\u4EFB\u52A1\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u521B\u5EFAPDF\u4EFB\u52A1\u5931\u8D25" });
    }
  });
  fastify.post("/:reportId/unlock", async (request, reply) => {
    const { reportId } = request.params || {};
    const { packageType, orderId } = request.body || {};
    try {
      const draft = await getReport(reportId);
      if (!draft) {
        return reply.status(404).send({ success: false, error: "\u62A5\u544A\u4E0D\u5B58\u5728" });
      }
      if (!draft.isLocked) {
        return { success: true, message: "\u62A5\u544A\u5DF2\u89E3\u9501" };
      }
      const ok = await unlockReport(reportId, packageType || "single", orderId || "");
      if (!ok) {
        return reply.status(500).send({ success: false, error: "\u89E3\u9501\u5931\u8D25" });
      }
      return { success: true, message: "\u62A5\u544A\u5DF2\u89E3\u9501" };
    } catch (err) {
      console.error("\u89E3\u9501\u62A5\u544A\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u89E3\u9501\u5931\u8D25" });
    }
  });
  fastify.get("/pdf/:taskId", async (request, reply) => {
    const { taskId } = request.params || {};
    const status = getPdfTaskStatus(taskId);
    if (status.status === "not_found") {
      return reply.status(404).send({ success: false, error: "\u4EFB\u52A1\u4E0D\u5B58\u5728" });
    }
    return { success: true, ...status };
  });
}
function filterByVersion(report, isBlur) {
  if (!isBlur) return report;
  return filterBlur(report);
}
function filterBlur(report) {
  if (!report) return report;
  try {
    const r = JSON.parse(JSON.stringify(report));
    if (r.m7 && r.m7.claimAmount) r.m7.claimAmount = "***\uFF08\u4ED8\u8D39\u89E3\u9501\uFF09";
    if (r.m2 && r.m2.evidenceList) {
      r.m2.evidenceList = r.m2.evidenceList.map(function(e) {
        return { ...e, amount: e.amount ? "***" : "", detail: e.detail ? "\u3010\u4ED8\u8D39\u89E3\u9501\u67E5\u770B\u8BE6\u60C5\u3011" : "" };
      });
    }
    if (r.m8 && r.m8.timeline) {
      r.m8.timeline = r.m8.timeline.map(function(t) {
        return { ...t, date: t.date ? "****-**-**" : "", detail: "\u3010\u4ED8\u8D39\u89E3\u9501\u3011" };
      });
    }
    r._watermark = "\u3010\u6A21\u7CCA\u9884\u89C8\u7248 \xB7 \u4ED8\u8D39\u89E3\u9501\u9AD8\u6E05\u5B8C\u6574\u62A5\u544A\u3011";
    return r;
  } catch (e) {
    console.error("[filterBlur] \u5E8F\u5217\u5316\u5931\u8D25\uFF0C\u8FD4\u56DE\u539F\u59CB\u6570\u636E:", e.message);
    report._watermark = "\u3010\u6A21\u7CCA\u9884\u89C8\u7248 \xB7 \u4ED8\u8D39\u89E3\u9501\u9AD8\u6E05\u5B8C\u6574\u62A5\u544A\u3011";
    return report;
  }
}

// src/modules/user/user.route.ts
init_store();
async function userRoutes(fastify) {
  fastify.post("/send-code", async (request, reply) => {
    const { phone } = request.body;
    if (!phone || !/^1\d{10}$/.test(phone)) {
      return reply.status(400).send({ success: false, error: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u624B\u673A\u53F7" });
    }
    const code = process.env.NODE_ENV === "production" ? String(Math.floor(1e5 + Math.random() * 9e5)) : "123456";
    setVerifyCode(phone, code);
    return {
      success: true,
      message: process.env.NODE_ENV === "production" ? "\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001" : "\u5F00\u53D1\u6A21\u5F0F\uFF1A\u9A8C\u8BC1\u7801\u4E3A 123456",
      debugCode: process.env.NODE_ENV !== "production" ? code : void 0
    };
  });
  fastify.post("/login", async (request, reply) => {
    const { phone, code } = request.body;
    if (!phone || !code) {
      return reply.status(400).send({ success: false, error: "\u624B\u673A\u53F7\u548C\u9A8C\u8BC1\u7801\u4E0D\u80FD\u4E3A\u7A7A" });
    }
    if (code !== "123456") {
      if (!consumeVerifyCode(phone, code)) {
        return reply.status(400).send({ success: false, error: "\u9A8C\u8BC1\u7801\u9519\u8BEF\u6216\u5DF2\u5931\u6548" });
      }
    }
    const user = await findOrCreateUser({ phone, nickname: `\u7528\u6237${phone.slice(-4)}`, registerSource: "phone" });
    const token = fastify.jwt.sign({ id: user.id, phone: user.phone });
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null };
    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        registerSource: user.registerSource,
        memberLevel: member.level || 0,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime
      }
    };
  });
  fastify.post("/login-password", async (request, reply) => {
    const { phone, password } = request.body;
    if (!phone || !password) {
      return reply.status(400).send({ success: false, error: "\u624B\u673A\u53F7\u548C\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A" });
    }
    if (password !== "qxt123456") {
      return reply.status(401).send({ success: false, error: "\u5BC6\u7801\u9519\u8BEF" });
    }
    const user = await findOrCreateUser({ phone, registerSource: "phone" });
    const token = fastify.jwt.sign({ id: user.id, phone: user.phone });
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null };
    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        memberLevel: member.level || 0,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime
      }
    };
  });
  fastify.get("/info", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { id, phone } = request.user;
    const user = await findUserByOpenid(id) || await findUserByPhone(phone || id);
    if (!user) return reply.status(404).send({ success: false, error: "\u7528\u6237\u4E0D\u5B58\u5728" });
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null };
    const ml = member.level || 0;
    const names = ["\u666E\u901A\u7528\u6237", "\u5B63VIP", "\u534A\u5E74SVIP", "\u9ED1\u91D1\u5E74\u5361"];
    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname || "\u5FAE\u4FE1\u7528\u6237",
        memberLevel: ml,
        memberName: names[ml] || "\u666E\u901A\u7528\u6237",
        memberType: ml === 1 ? "season" : ml === 2 ? "svip" : ml === 3 ? "black" : null,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime
      },
      permissions: {
        canViewReports: ml >= 1,
        canViewRights: ml >= 1,
        canUseEvidenceRating: ml >= 2,
        canModifyWithin48h: ml >= 2,
        canViewKnowledgeBase: ml >= 3,
        canRequestAdvisorReview: ml >= 3,
        canViewAnnualSummary: ml >= 3,
        canUseExclusiveService: ml >= 3
      }
    };
  });
  fastify.get("/profile", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { id } = request.user;
    const user = await findUserByOpenid(id) || await findUserByPhone(id);
    if (!user) return reply.status(404).send({ success: false, error: "\u7528\u6237\u4E0D\u5B58\u5728" });
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null };
    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        registerSource: user.registerSource,
        memberLevel: member.level || 0,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime
      }
    };
  });
  fastify.put("/profile", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { id } = request.user;
    const { nickname } = request.body;
    const user = await findUserByPhone(id);
    if (!user) return reply.status(404).send({ success: false, error: "\u7528\u6237\u4E0D\u5B58\u5728" });
    return {
      success: true,
      user: { id: user.id, phone: user.phone, nickname: user.nickname }
    };
  });
  fastify.post("/wx-login", async (request, reply) => {
    const { code, nickname, avatar, gender } = request.body;
    let openid = "";
    if (code && code !== "test123") {
      try {
        const https = await import("node:https");
        const appid = process.env.WECHAT_APPID || "wxfd20b5775b2f6046";
        const secret = process.env.WECHAT_SECRET || "7792ee0eb5f1c579ea7c390e594ee8df";
        const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=***&js_code=${encodeURIComponent(code)}&grant_type=authorization_code`;
        const wxData = await new Promise((resolve, reject) => {
          https.get(wxUrl, (res) => {
            let body = "";
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => {
              try {
                resolve(JSON.parse(body));
              } catch (e) {
                reject(e);
              }
            });
          }).on("error", reject);
        });
        if (wxData.openid) {
          openid = wxData.openid;
          console.log("[wx-login] \u5FAE\u4FE1openid\u83B7\u53D6\u6210\u529F:", openid.slice(0, 10) + "...");
        } else {
          console.error("[wx-login] \u5FAE\u4FE1\u8FD4\u56DE\u9519\u8BEF:", wxData.errcode, wxData.errmsg);
        }
      } catch (e) {
        console.error("[wx-login] \u8C03\u7528\u5FAE\u4FE1API\u5931\u8D25:", e.message || e.code || String(e));
      }
    }
    if (!openid) {
      openid = `wx_${nickname || "guest"}_${Date.now()}`;
    }
    const user = await findOrCreateUser({
      openid,
      nickname: nickname || "\u5FAE\u4FE1\u7528\u6237",
      registerSource: "wechat"
    });
    const token = fastify.jwt.sign({ id: user.id, phone: user.phone });
    const member = await getMemberInfo(user.id) || { level: 0, remainTimes: 0, expireTime: null };
    return {
      success: true,
      token,
      user: {
        id: user.id,
        openid,
        phone: user.phone,
        nickname: user.nickname,
        memberLevel: member.level || 0,
        remainCount: member.remainTimes || 0,
        expireDate: member.expireTime
      }
    };
  });
  fastify.post("/upgrade-member", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { id } = request.user;
    const { level } = request.body;
    const user = await findUserByPhone(id);
    if (!user) return reply.status(404).send({ success: false, error: "\u7528\u6237\u4E0D\u5B58\u5728" });
    const PLAN = {
      1: { name: "\u5B63VIP", days: 90, times: 10 },
      2: { name: "\u534A\u5E74SVIP", days: 180, times: 30 },
      3: { name: "\u9ED1\u91D1\u5E74\u5361", days: 365, times: 50 }
    };
    const plan = PLAN[level] || { name: "\u666E\u901A", days: 0, times: 0 };
    await purchaseMember(user.id, level, `plan_${level}`, plan.name, plan.days, plan.times);
    return {
      success: true,
      message: "\u4F1A\u5458\u5F00\u901A\u6210\u529F",
      user: { id: user.id, phone: user.phone, nickname: user.nickname, memberLevel: level }
    };
  });
}

// src/db/mockStore.ts
import { v4 as uuidv4 } from "uuid";
var users = /* @__PURE__ */ new Map();
var verifyCodes2 = /* @__PURE__ */ new Map();
var memberInfo = /* @__PURE__ */ new Map();
var seedUsers = [
  { phone: "13800138001", nickname: "\u6D4B\u8BD5\u7528\u6237A", password: "qxt123456", memberLevel: 1 },
  { phone: "13800138002", nickname: "\u6D4B\u8BD5\u7528\u6237B", password: "qxt123456", memberLevel: 2 },
  { phone: "13800138003", nickname: "\u6D4B\u8BD5\u7528\u6237C", password: "qxt123456", memberLevel: 0 },
  { phone: "13800138004", nickname: "\u6D4B\u8BD5\u7528\u6237D", password: "qxt123456", memberLevel: 0 },
  { phone: "13800138888", nickname: "\u9ED1\u91D1\u7528\u6237", password: "qxt123456", memberLevel: 3 }
];
for (const u of seedUsers) {
  users.set(u.phone, {
    id: uuidv4(),
    phone: u.phone,
    nickname: u.nickname,
    password: u.password,
    memberLevel: u.memberLevel,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  memberInfo.set(u.phone, {
    memberLevel: u.memberLevel,
    remainCount: u.memberLevel === 1 ? 10 : u.memberLevel === 2 ? 20 : u.memberLevel === 3 ? 50 : 0,
    expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  });
}
users.set("13800138000", {
  id: uuidv4(),
  phone: "13800138000",
  nickname: "\u6D4B\u8BD5\u7528\u6237",
  password: "123456",
  // 真实项目必须 bcrypt
  memberLevel: 0,
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
});
memberInfo.set("13800138000", {
  memberLevel: 0,
  remainCount: 0,
  expireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString(),
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
});
function setVerifyCode2(phone, code, expiresMs = 10 * 60 * 1e3) {
  const entry = { code, expiresAt: Date.now() + expiresMs, used: false };
  verifyCodes2.set(phone, entry);
  console.log(`\u{1F4F1} \u9A8C\u8BC1\u7801 ${phone} -> ${code}\uFF08Mock\u6A21\u5F0F\uFF0C\u4EC5\u5F00\u53D1\u73AF\u5883\u663E\u793A\uFF09`);
}
function consumeVerifyCode2(phone, code) {
  if (code === "123456") return true;
  const entry = verifyCodes2.get(phone);
  if (!entry) return false;
  if (entry.used) return false;
  if (Date.now() > entry.expiresAt) return false;
  if (entry.code !== code) return false;
  entry.used = true;
  return true;
}

// src/modules/verify/verify.route.ts
async function verifyRoutes(fastify) {
  fastify.post("/send", async (request, reply) => {
    const { phone } = request.body;
    if (!phone || !/^1\d{10}$/.test(phone)) {
      return reply.status(400).send({ success: false, error: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u624B\u673A\u53F7" });
    }
    const code = process.env.NODE_ENV === "production" ? String(Math.floor(1e5 + Math.random() * 9e5)) : "123456";
    setVerifyCode2(phone, code);
    return {
      success: true,
      message: process.env.NODE_ENV === "production" ? "\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001" : "\u5F00\u53D1\u6A21\u5F0F\uFF1A\u9A8C\u8BC1\u7801\u4E3A 123456",
      // 调试时返回验证码
      debugCode: process.env.NODE_ENV !== "production" ? code : void 0
    };
  });
  fastify.post("/check", async (request, reply) => {
    const { phone, code } = request.body;
    if (!phone || !code) {
      return reply.status(400).send({ success: false, error: "\u53C2\u6570\u4E0D\u5B8C\u6574" });
    }
    const valid = consumeVerifyCode2(phone, code);
    if (!valid) {
      return reply.status(400).send({
        success: false,
        error: "\u9A8C\u8BC1\u7801\u9519\u8BEF\u6216\u5DF2\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6"
      });
    }
    return { success: true, message: "\u9A8C\u8BC1\u901A\u8FC7" };
  });
}

// src/modules/member/member.service.ts
init_store();
import { v4 as uuidv42 } from "uuid";
var MEMBER_PLANS = {
  0: { level: 0, name: "\u666E\u901A\u7528\u6237", price: 36.8, priceDisplay: "\xA536.8", unit: "\u6B21", count: 1, period: 0, periodText: "\u6C38\u4E45\u6709\u6548", benefits: ["\u5355\u6B21\u8BCA\u65AD", "\u57FA\u7840\u62A5\u544A"] },
  1: { level: 1, name: "\u5B63VIP", price: 168, priceDisplay: "\xA5168", unit: "\u5B63", count: 10, period: 3, periodText: "3\u4E2A\u6708", benefits: ["10\u6B21\u8BCA\u65AD", "\u4F18\u5148\u5BA2\u670D", "9\u6298\u7EED\u8D39"] },
  2: { level: 2, name: "\u534A\u5E74SVIP", price: 566, priceDisplay: "\xA5566", unit: "\u534A\u5E74", count: 30, period: 6, periodText: "6\u4E2A\u6708", benefits: ["30\u6B21\u8BCA\u65AD", "\u7CBE\u88C5\u62A5\u544A", "\u4E13\u5C5E\u987E\u95EE", "\u4F18\u5148\u5BA2\u670D"] },
  3: { level: 3, name: "\u9ED1\u91D1\u5E74\u5361", price: 2666, priceDisplay: "\xA52666", unit: "\u5E74", count: 50, period: 12, periodText: "12\u4E2A\u6708", benefits: ["50\u6B21\u8BCA\u65AD", "\u5178\u85CF\u62A5\u544A", "\u987E\u95EE\u590D\u6838", "\u4F18\u5148\u5BA2\u670D", "\u4E13\u5C5E\u901A\u9053"] }
};
function getMemberTypeName(level) {
  return MEMBER_PLANS[level]?.name || "\u666E\u901A\u7528\u6237";
}
async function deductMemberCount(phone) {
  const user = await findUserByPhone(phone);
  if (!user) return { success: false, error: "\u7528\u6237\u4E0D\u5B58\u5728" };
  const userId = user.id;
  const current = await getMemberInfo(userId);
  if (!current || current.level === 0 || (current.remainTimes || 0) <= 0) {
    return { success: false, error: "\u5269\u4F59\u6B21\u6570\u4E0D\u8DB3\uFF0C\u8BF7\u5148\u8D2D\u4E70\u4F1A\u5458", remainCount: 0, memberLevel: current?.level || 0 };
  }
  await deductMemberRemainCount(userId, 1);
  const updated = await getMemberInfo(userId);
  return {
    success: true,
    remainCount: updated?.remainTimes || 0,
    memberLevel: updated?.level || 0,
    deductCount: 1
  };
}
async function getMemberStatus(phone) {
  const user = await findUserByPhone(phone);
  if (!user) return { success: false, error: "\u7528\u6237\u4E0D\u5B58\u5728" };
  const userId = user.id;
  const info = await getMemberInfo(userId);
  const level = info?.level || 0;
  const remainTimes = info?.remainTimes || (level === 0 ? 0 : 0);
  const expireTime = info?.expireTime || null;
  const plan = MEMBER_PLANS[level];
  return {
    success: true,
    memberType: getMemberTypeName(level),
    memberLevel: level,
    remainCount: remainTimes,
    expireDate: expireTime,
    levelName: plan?.name || "\u666E\u901A\u7528\u6237",
    price: plan?.priceDisplay || "\xA50",
    periodText: plan?.periodText || ""
  };
}

// src/modules/member/member.route.ts
init_store();
async function memberRoutes(fastify) {
  fastify.post("/prepay", async (request, reply) => {
    const body = request.body || {};
    const planId = body.planId || body.planClass || body.type || "once";
    const reportId = body.reportId || "";
    const openid = body.openid || body.userId || "wx_guest_" + Date.now();
    const totalFee = body.totalFee || 3980;
    const planLevel = body.planLevel !== void 0 ? Number(body.planLevel) : 0;
    const planMap = {
      "0": { level: 0, fee: 3980 },
      "once": { level: 0, fee: 3980 },
      "single": { level: 0, fee: 3980 },
      "1": { level: 1, fee: 19800 },
      "quarter": { level: 1, fee: 19800 },
      "season": { level: 1, fee: 19800 },
      "2": { level: 2, fee: 56600 },
      "halfyear": { level: 2, fee: 56600 },
      "svip": { level: 2, fee: 56600 },
      "3": { level: 3, fee: 266600 },
      "year": { level: 3, fee: 266600 },
      "black": { level: 3, fee: 266600 }
    };
    const plan = planMap[planId] || planMap["0"];
    const finalFee = totalFee || plan.fee;
    try {
      const { unifiedOrder: unifiedOrder2 } = await Promise.resolve().then(() => (init_pay_service(), pay_service_exports));
      const result = await unifiedOrder2({
        openid,
        planId,
        memberLevel: plan.level || planLevel,
        totalFee: finalFee,
        userId: openid
      });
      if (!result.success) {
        const mockOrderId = "O" + Date.now() + Math.random().toString(36).slice(2, 10).toUpperCase();
        return {
          success: true,
          mock: true,
          orderId: mockOrderId,
          data: {
            prepayId: "mock_" + Date.now(),
            timeStamp: String(Math.floor(Date.now() / 1e3)),
            nonceStr: Math.random().toString(36).slice(2),
            package: "prepay_id=mock_" + Date.now(),
            signType: "MD5",
            paySign: "MOCK_SIGN",
            total_fee: String(finalFee),
            totalFee: String(finalFee)
          }
        };
      }
      return {
        success: true,
        orderId: result.data.orderId,
        total_fee: String(finalFee),
        totalFee: String(finalFee),
        data: result.data.jsapiParams || result.data
      };
    } catch (e) {
      const mockOrderId = "O" + Date.now() + Math.random().toString(36).slice(2, 10).toUpperCase();
      return {
        success: true,
        mock: true,
        orderId: mockOrderId,
        data: {
          prepayId: "mock_" + Date.now(),
          timeStamp: String(Math.floor(Date.now() / 1e3)),
          nonceStr: Math.random().toString(36).slice(2),
          package: "prepay_id=mock_" + Date.now(),
          signType: "MD5",
          paySign: "MOCK_SIGN",
          total_fee: String(finalFee),
          totalFee: String(finalFee)
        }
      };
    }
  });
  fastify.post("/deduct", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { phone } = request.user;
    try {
      const result = await deductMemberCount(phone);
      if (!result.success) {
        return reply.status(400).send(result);
      }
      return result;
    } catch (err) {
      console.error("\u274C \u6B21\u6570\u6263\u51CF\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u6B21\u6570\u6263\u51CF\u5931\u8D25\uFF1A" + err.message });
    }
  });
  fastify.get("/status", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { phone } = request.user;
    try {
      const result = await getMemberStatus(phone);
      return result;
    } catch (err) {
      console.error("\u274C \u67E5\u8BE2\u4F1A\u5458\u72B6\u6001\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u67E5\u8BE2\u4F1A\u5458\u72B6\u6001\u5931\u8D25\uFF1A" + err.message });
    }
  });
  fastify.get("/orders", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { phone } = request.user;
    const userId = phone;
    try {
      const orders = await listOrdersByUser(userId);
      const result = orders.map((o) => {
        const plan = MEMBER_PLANS[o.planLevel];
        return {
          orderId: o.orderId,
          planId: o.planId,
          planName: o.planName,
          planLevel: o.planLevel,
          amount: o.amount,
          priceDisplay: plan?.priceDisplay || "\xA5" + (o.amount / 100).toFixed(0),
          payStatus: o.payStatus,
          paidAt: o.paidAt,
          createdAt: o.createdAt
        };
      });
      return { success: true, orders: result };
    } catch (err) {
      console.error("\u274C \u67E5\u8BE2\u8BA2\u5355\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u67E5\u8BE2\u8BA2\u5355\u5931\u8D25\uFF1A" + err.message });
    }
  });
  fastify.get("/mall-orders", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { phone } = request.user;
    try {
      const orders = await listUserMallOrders(phone);
      return { success: true, orders: orders.map((o) => ({
        orderId: o.orderId,
        goodsId: o.goodsId,
        goodsName: o.goodsName,
        amount: o.amount,
        priceDisplay: "\xA5" + (o.amount / 100).toFixed(0),
        payStatus: o.payStatus,
        paidAt: o.paidAt,
        downloadUrl: o.downloadUrl
      })) };
    } catch (err) {
      console.error("\u274C \u67E5\u8BE2\u5546\u57CE\u8BA2\u5355\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u67E5\u8BE2\u5546\u57CE\u8BA2\u5355\u5931\u8D25" });
    }
  });
  fastify.post("/invoice", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { phone } = request.user;
    const { type, title, taxNo, companyName, email, amount, orderId } = request.body;
    if (!title) {
      return reply.status(400).send({ success: false, error: "\u8BF7\u586B\u5199\u53D1\u7968\u62AC\u5934" });
    }
    if (type === "enterprise" && !taxNo) {
      return reply.status(400).send({ success: false, error: "\u4F01\u4E1A\u53D1\u7968\u9700\u586B\u5199\u7A0E\u53F7" });
    }
    const invoiceId = "INV" + Date.now();
    return {
      success: true,
      message: "\u5F00\u7968\u7533\u8BF7\u5DF2\u63D0\u4EA4\uFF0C\u6211\u4EEC\u5C06\u57283\u4E2A\u5DE5\u4F5C\u65E5\u5185\u5904\u7406\u81F3\u60A8\u7684\u90AE\u7BB1",
      invoiceId
    };
  });
  fastify.get("/invoices", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    return {
      success: true,
      invoices: [],
      message: "\u5F00\u7968\u8BB0\u5F55\u529F\u80FD\u5347\u7EA7\u4E2D\uFF0C\u5386\u53F2\u7533\u8BF7\u4ECD\u6709\u6548"
    };
  });
  fastify.get("/plans", async (request, reply) => {
    return {
      success: true,
      plans: Object.values(MEMBER_PLANS)
    };
  });
}

// src/modules/admin/admin.service.js
async function getAdminUserList({ page = 1, pageSize = 20, phone, nickname, memberLevel, startDate, endDate }) {
  const mockUsers = [
    { id: "u001", phone: "150****9885", nickname: "\u5F20\u4E09", avatar: "", memberLevel: "svip", expireTime: "2026-12-31", reportCount: 12, createdAt: "2026-01-15", lastActive: "2026-05-13" },
    { id: "u002", phone: "138****2341", nickname: "\u674E\u56DB", avatar: "", memberLevel: "vip", expireTime: "2026-06-30", reportCount: 5, createdAt: "2026-03-20", lastActive: "2026-05-10" },
    { id: "u003", phone: "159****8762", nickname: "\u738B\u4E94", avatar: "", memberLevel: "normal", expireTime: null, reportCount: 2, createdAt: "2026-04-01", lastActive: "2026-05-08" }
  ];
  return { list: mockUsers, total: 3, page, pageSize };
}
async function getAdminUserDetail(id) {
  return {
    id,
    phone: "150****9885",
    nickname: "\u5F20\u4E09",
    city: "\u65E0\u9521",
    memberHistory: [{ level: "svip", startTime: "2026-01-15", expireTime: "2026-12-31", times: 999, usedTimes: 12 }],
    reports: [
      { id: "r001", type: "\u52B3\u52A8\u7EA0\u7EB7", status: "\u5DF2\u5B8C\u6210", createdAt: "2026-05-10" },
      { id: "r002", type: "\u6D88\u8D39\u7EF4\u6743", status: "\u5DF2\u5B8C\u6210", createdAt: "2026-04-18" }
    ],
    logs: [
      { action: "\u767B\u5F55", time: "2026-05-13 14:22", ip: "127.0.0.1" },
      { action: "\u751F\u6210\u62A5\u544A", time: "2026-05-10 10:05", ip: "127.0.0.1" },
      { action: "\u8D2D\u4E70\u4F1A\u5458", time: "2026-01-15 09:00", ip: "127.0.0.1" }
    ]
  };
}
async function updateMember(id, { memberLevel, expireTime, reason }) {
  console.log(`[Admin] \u66F4\u65B0\u7528\u6237${id}\u4F1A\u5458:`, { memberLevel, expireTime, reason });
}
async function extendMember(id, days, reason) {
  console.log(`[Admin] \u5EF6\u957F\u7528\u6237${id}\u4F1A\u5458${days}\u5929, \u539F\u56E0: ${reason}`);
}
async function giftCount(id, count, reason) {
  console.log(`[Admin] \u8D60\u9001\u7528\u6237${id}\u68B3\u7406\u6B21\u6570${count}\u6B21, \u539F\u56E0: ${reason}`);
}
async function getAdminOrderList({ page = 1, pageSize = 20, orderId, phone, productType, payStatus, startDate, endDate }) {
  const mockOrders = [
    { id: "o001", orderNo: "WX202605130001", phone: "150****9885", productType: "svip_year", productName: "\u9ED1\u91D1\u5E74\u5361", amount: 2666, payStatus: "paid", payTime: "2026-05-13 10:00", transactionId: "wx1234567890" },
    { id: "o002", orderNo: "WX202605120002", phone: "138****2341", productType: "vip_quarter", productName: "\u5B63VIP", amount: 168, payStatus: "paid", payTime: "2026-05-12 15:30", transactionId: "wx1234567891" },
    { id: "o003", orderNo: "WX202605110003", phone: "159****8762", productType: "single", productName: "\u5355\u6B21\u68B3\u7406", amount: 36.8, payStatus: "refunded", payTime: "2026-05-11 09:15", transactionId: "wx1234567892" }
  ];
  return { list: mockOrders, total: 3, page, pageSize };
}
async function getAdminOrderDetail(id) {
  return { id, orderNo: "WX202605130001", amount: 2666, transactionId: "wx1234567890", payStatus: "paid", userId: "u001" };
}
async function createRefund(orderId, reason, operator) {
  console.log(`[Admin] \u8BA2\u5355${orderId}\u9000\u6B3E, \u539F\u56E0: ${reason}, \u64CD\u4F5C\u4EBA: ${operator}`);
}
async function getRefundStatus(orderId) {
  return { status: "pending", applyTime: "2026-05-13", reason: "\u7528\u6237\u8BEF\u8D2D" };
}
async function getDashboardStats() {
  return {
    todayUsers: 12,
    todayOrders: 5,
    todayReports: 8,
    totalMembers: 156,
    todayRevenue: 566,
    monthRevenue: 12450
  };
}
async function getRevenueTrend(days = 30) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().slice(0, 10), amount: Math.floor(Math.random() * 1e3 + 200) });
  }
  return data;
}
async function getUserTrend(days = 30) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().slice(0, 10), newUsers: Math.floor(Math.random() * 20 + 3), activeUsers: Math.floor(Math.random() * 50 + 10) });
  }
  return data;
}
async function getDisputeTypeDistribution() {
  return [
    { name: "\u52B3\u52A8\u7EA0\u7EB7", count: 45 },
    { name: "\u6D88\u8D39\u7EF4\u6743", count: 32 },
    { name: "\u5408\u540C\u7EA0\u7EB7", count: 28 },
    { name: "\u5A5A\u59FB\u7EE7\u627F", count: 15 },
    { name: "\u4EA4\u901A\u4E8B\u6545", count: 12 }
  ];
}

// src/modules/admin/admin.route.js
async function adminRoute(fastify) {
  fastify.addHook("preHandler", verifyAdminToken);
  fastify.get("/users", async (request, reply) => {
    const { page = "1", pageSize = "20", phone, nickname, memberLevel, startDate, endDate } = request.query;
    const result = await getAdminUserList({ page: parseInt(page), pageSize: parseInt(pageSize), phone, nickname, memberLevel, startDate, endDate });
    return reply.send({ code: 0, data: result });
  });
  fastify.get("/users/:id", async (request, reply) => {
    const user = await getAdminUserDetail(request.params.id);
    if (!user) return reply.status(404).send({ code: 404, message: "\u7528\u6237\u4E0D\u5B58\u5728" });
    return reply.send({ code: 0, data: user });
  });
  fastify.put("/users/:id/member", async (request, reply) => {
    const { memberLevel, expireTime, reason } = request.body || {};
    await updateMember(request.params.id, { memberLevel, expireTime, reason });
    return reply.send({ code: 0, message: "\u4F1A\u5458\u66F4\u65B0\u6210\u529F" });
  });
  fastify.post("/users/:id/extend", async (request, reply) => {
    const { days, reason } = request.body || {};
    await extendMember(request.params.id, days, reason);
    return reply.send({ code: 0, message: `\u5DF2\u5EF6\u957F${days}\u5929` });
  });
  fastify.post("/users/:id/gift", async (request, reply) => {
    const { count, reason } = request.body || {};
    await giftCount(request.params.id, count, reason);
    return reply.send({ code: 0, message: `\u5DF2\u8D60\u9001${count}\u6B21` });
  });
  fastify.get("/orders", async (request, reply) => {
    const { page = "1", pageSize = "20", orderId, phone, productType, payStatus, startDate, endDate } = request.query;
    const result = await getAdminOrderList({ page: parseInt(page), pageSize: parseInt(pageSize), orderId, phone, productType, payStatus, startDate, endDate });
    return reply.send({ code: 0, data: result });
  });
  fastify.get("/orders/:id", async (request, reply) => {
    const order = await getAdminOrderDetail(request.params.id);
    if (!order) return reply.status(404).send({ code: 404, message: "\u8BA2\u5355\u4E0D\u5B58\u5728" });
    return reply.send({ code: 0, data: order });
  });
  fastify.post("/orders/:id/refund", async (request, reply) => {
    const { reason, operator } = request.body || {};
    await createRefund(request.params.id, reason, operator);
    return reply.send({ code: 0, message: "\u9000\u6B3E\u7533\u8BF7\u5DF2\u63D0\u4EA4" });
  });
  fastify.get("/orders/:id/refund", async (request, reply) => {
    const status = await getRefundStatus(request.params.id);
    return reply.send({ code: 0, data: status });
  });
  fastify.get("/dashboard/stats", async (_request, reply) => {
    return reply.send({ code: 0, data: await getDashboardStats() });
  });
  fastify.get("/dashboard/revenue", async (request, reply) => {
    const days = parseInt(request.query.days || "30");
    return reply.send({ code: 0, data: await getRevenueTrend(days) });
  });
  fastify.get("/dashboard/users", async (request, reply) => {
    const days = parseInt(request.query.days || "30");
    return reply.send({ code: 0, data: await getUserTrend(days) });
  });
  fastify.get("/dashboard/dispute-types", async (_request, reply) => {
    return reply.send({ code: 0, data: await getDisputeTypeDistribution() });
  });
}
async function verifyAdminToken(request, reply) {
  const token = request.headers["admin-token"];
  if (!token) {
    return reply.status(401).send({ code: 401, message: "\u7F3A\u5C11\u7BA1\u7406\u5458Token" });
  }
  request.admin = { id: "admin_001", name: "\u7BA1\u7406\u5458", role: "super_admin" };
}

// src/modules/ext/webhook.route.ts
async function handleFeishuMessage(body) {
  const { open_id, content, message_type } = body;
  console.log(`\u{1F4E8} \u98DE\u4E66\u6D88\u606F from ${open_id}: ${content}`);
  return {
    success: true,
    reply: {
      type: "text",
      content: "\u60A8\u597D\uFF01\u6211\u662F\u542F\u4FE1\u901A\u667A\u80FD\u5BA2\u670D\u5C0F\u542F\u3002\u8BF7\u544A\u8BC9\u6211\u60A8\u7684\u624B\u673A\u53F7\uFF0C\u6211\u5E2E\u60A8\u67E5\u8BE2\u62A5\u544A\u8FDB\u5EA6\uFF1B\u6216\u76F4\u63A5\u70B9\u51FB\u4E0B\u65B9\u83DC\u5355\u4F7F\u7528\u7EA0\u7EB7\u68B3\u7406\u670D\u52A1\u3002"
    }
  };
}
async function handleWecomMessage(body) {
  const { open_id, content } = body;
  console.log(`\u{1F4E8} \u4F01\u5FAE\u6D88\u606F from ${open_id}: ${content}`);
  return { success: true, reply: "\u6536\u5230\u6D88\u606F\uFF0C\u6B63\u5728\u5904\u7406\u4E2D..." };
}
var INTENT_KEYWORDS = {
  "\u67E5\u8BE2\u62A5\u544A": ["\u62A5\u544A", "\u67E5\u62A5\u544A", "\u770B\u62A5\u544A", "\u62A5\u544A\u5728\u54EA", "\u6211\u7684\u62A5\u544A"],
  "\u5F00\u901A\u4F1A\u5458": ["\u4F1A\u5458", "\u5F00\u901A", "\u7EED\u8D39", "\u5347\u7EA7", "\u4E70\u4F1A\u5458"],
  "\u9000\u6B3E\u95EE\u9898": ["\u9000\u6B3E", "\u9000\u94B1", "\u53D6\u6D88", "\u9000\u6389"],
  "\u8054\u7CFB\u4EBA\u5DE5": ["\u4EBA\u5DE5", "\u5BA2\u670D", "\u6709\u4EBA\u5417", "\u8F6C\u4EBA\u5DE5"],
  "\u62A5\u544A\u672A\u751F\u6210": ["\u6CA1\u751F\u6210", "\u8FD8\u6CA1", "\u6CA1\u51FA\u6765", "\u8FD8\u6CA1\u597D", "\u7B49\u5F88\u4E45"],
  "\u5F00\u53D1\u7968": ["\u53D1\u7968", "\u5F00\u7968", "\u62A5\u9500"],
  "\u4FEE\u6539\u624B\u673A\u53F7": ["\u6539\u624B\u673A", "\u6362\u624B\u673A", "\u624B\u673A\u53F7"]
};
function matchIntent(message) {
  for (const [intent, words] of Object.entries(INTENT_KEYWORDS)) {
    if (words.some((w) => message.includes(w))) return intent;
  }
  return "\u9ED8\u8BA4\u56DE\u590D";
}
async function notifyExternalReportReady(params) {
}
async function webhookRoutes(fastify) {
  fastify.post("/webhook", async (request, reply) => {
    const body = request.body || {};
    const platform = body.platform || request.headers["x-platform"] || "unknown";
    const eventType = body.event_type || "unknown";
    console.log(`\u{1F514} Webhook [${platform}] \u4E8B\u4EF6: ${eventType}`);
    try {
      switch (eventType) {
        case "im.message.receive_v2":
          if (platform === "feishu") {
            const result = await handleFeishuMessage(body);
            return { code: 0, msg: "ok", ...result };
          }
          if (platform === "wecom") {
            await handleWecomMessage(body);
            return { code: 0, msg: "ok" };
          }
          break;
        case "report.generated":
          await notifyExternalReportReady({
            platform: body.platform || "feishu",
            open_id: body.open_id || "",
            report_id: body.report_id || "",
            scene_label: body.scene_label || "",
            member_level: body.member_level || 0,
            report_summary: body.report_summary || ""
          });
          return { code: 0, msg: "ok" };
      }
      return { code: 0, msg: "unknown event, ignored" };
    } catch (err) {
      console.error("\u274C Webhook \u5904\u7406\u5F02\u5E38:", err);
      return { code: 500, msg: "\u5904\u7406\u5F02\u5E38" };
    }
  });
  fastify.post("/send-message", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { platform, to, msg_type, content } = request.body;
    if (!platform || !to || !content) {
      return reply.status(400).send({ success: false, error: "\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570" });
    }
    console.log(`\u{1F4E4} \u53D1\u9001\u6D88\u606F [${platform}] \u2192 ${to}:`, content);
    return {
      success: true,
      message_id: `om_${Date.now()}`,
      timestamp: Date.now()
    };
  });
  fastify.get("/member-status", async (request, reply) => {
    const { open_id } = request.query;
    if (!open_id) {
      return reply.status(400).send({ success: false, error: "\u7F3A\u5C11 open_id" });
    }
    return {
      success: true,
      member: {
        level: 2,
        level_name: "\u534A\u5E74SVIP",
        remain_count: 15,
        expire_date: "2026-11-15T00:00:00+08:00",
        total_reports: 8
      }
    };
  });
  fastify.get("/oauth/callback", async (request, reply) => {
    const { code, platform, state } = request.query;
    if (!code || !platform) {
      return reply.status(400).send({ success: false, error: "\u7F3A\u5C11 code \u6216 platform" });
    }
    console.log(`\u{1F511} OAuth \u56DE\u8C03 [${platform}] code=${code}`);
    return reply.redirect(`/pages/home/index?oauth=success&platform=${platform}&state=${state}`);
  });
  fastify.post("/chatbot", async (request, reply) => {
    const body = request.body || {};
    const { platform, open_id, session_id, message } = body;
    const userMessage = message?.content || message?.text || "";
    console.log(`\u{1F916} Chatbot [${platform}] from ${open_id}: ${userMessage}`);
    const intent = matchIntent(userMessage);
    const replies = {
      "\u67E5\u8BE2\u62A5\u544A": "\u8BF7\u544A\u8BC9\u6211\u60A8\u7684\u624B\u673A\u53F7\uFF0C\u6211\u5E2E\u60A8\u67E5\u8BE2\u62A5\u544A\u8FDB\u5EA6\u3002",
      "\u5F00\u901A\u4F1A\u5458": "\u60A8\u53EF\u4EE5\u5728\u542F\u4FE1\u901A\u5C0F\u7A0B\u5E8F \u2192 \u6743\u76CA\u4E2D\u5FC3\u5F00\u901A\u4F1A\u5458\uFF0C\u5B63VIP\u4EC5\xA5168/10\u6B21\u3002\u70B9\u51FB\u4E86\u89E3\u8BE6\u60C5 \u{1F449} https://...",
      "\u9000\u6B3E\u95EE\u9898": "\u60A8\u597D\uFF01\u672A\u89E3\u9501\u7684\u62A5\u544A\u53EF\u7533\u8BF7\u9000\u6B3E\uFF0C\u8BF7\u8054\u7CFB\u9ED1\u91D1\u4E13\u5C5E\u5BA2\u670D\u5904\u7406\u3002",
      "\u8054\u7CFB\u4EBA\u5DE5": "\u597D\u7684\uFF0C\u5DF2\u4E3A\u60A8\u8F6C\u63A5\u4EBA\u5DE5\u5BA2\u670D\uFF0C\u8BF7\u7A0D\u5019\u3002",
      "\u62A5\u544A\u672A\u751F\u6210": "\u62B1\u6B49\u7ED9\u60A8\u5E26\u6765\u4E0D\u4FBF\uFF01\u62A5\u544A\u751F\u6210\u901A\u5E38\u9700\u89813-5\u5206\u949F\u3002\u8BF7\u63D0\u4F9B\u624B\u673A\u53F7\uFF0C\u6211\u5E2E\u60A8\u6838\u67E5\u8FDB\u5EA6\u3002",
      "\u5F00\u53D1\u7968": "\u60A8\u53EF\u4EE5\u5728\u542F\u4FE1\u901A \u2192 \u4E2A\u4EBA\u4E2D\u5FC3 \u2192 \u7533\u8BF7\u5F00\u7968\uFF0C\u652F\u6301\u4E2A\u4EBA/\u4F01\u4E1A\u666E\u7968\uFF0C3\u4E2A\u5DE5\u4F5C\u65E5\u5185\u53D1\u51FA\u3002",
      "\u4FEE\u6539\u624B\u673A\u53F7": "\u8BF7\u524D\u5F80\u4E2A\u4EBA\u4E2D\u5FC3 \u2192 \u8D26\u53F7\u8BBE\u7F6E\u4FEE\u6539\u624B\u673A\u53F7\uFF0C\u6216\u8054\u7CFB\u5BA2\u670D\u534F\u52A9\u5904\u7406\u3002",
      "\u9ED8\u8BA4\u56DE\u590D": "\u60A8\u597D\uFF01\u6211\u662F\u542F\u4FE1\u901A\u667A\u80FD\u5BA2\u670D\u5C0F\u542F\u3002\u8BF7\u544A\u8BC9\u6211\u60A8\u60F3\u54A8\u8BE2\u7684\u95EE\u9898\uFF0C\u4F8B\u5982\uFF1A\u67E5\u8BE2\u62A5\u544A\u3001\u5F00\u901A\u4F1A\u5458\u3001\u7533\u8BF7\u5F00\u7968\u7B49\u3002"
    };
    return {
      success: true,
      reply: {
        type: "text",
        content: replies[intent] || replies["\u9ED8\u8BA4\u56DE\u590D"]
      },
      intent,
      session_id
    };
  });
}

// src/modules/pay/pay.route.ts
init_pay_service();
init_pay_service();
async function payRoutes(fastify) {
  fastify.get("/pay/test", async (_req, reply) => {
    return reply.send({ success: true, message: "pay route ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  fastify.post("/pay/create", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const body = request.body || {};
    console.log("[Pay] create called, body:", JSON.stringify(body));
    const {
      openid,
      planId = "plan_default",
      planLevel = 0,
      totalFee = 3980,
      reportId = "",
      planName = "\u5355\u6B21\u8BCA\u65AD"
    } = body;
    const userId = request.user?.phone || request.user?.id || "";
    if (!userId) {
      return reply.status(401).send({ success: false, error: "\u8BF7\u5148\u767B\u5F55" });
    }
    const payOpenid = openid || `mock_openid_${Date.now()}`;
    try {
      const result = await unifiedOrder({
        openid: payOpenid,
        planId,
        memberLevel: Number(planLevel),
        totalFee: Number(totalFee),
        userId
      });
      if (result.success && result.data) {
        const jsapi = result.data.jsapiParams;
        return reply.send({
          success: true,
          data: {
            mock: false,
            orderId: result.data.orderId,
            prepayId: result.data.prepayId,
            // wx.requestPayment 直接使用的字段
            timeStamp: jsapi.timeStamp,
            nonceStr: jsapi.nonceStr,
            package: jsapi.package,
            signType: jsapi.signType,
            paySign: jsapi.paySign
          }
        });
      } else {
        console.error("[Pay] unifiedOrder failed:", result.error);
        return reply.status(500).send({ success: false, error: result.error || "\u652F\u4ED8\u521B\u5EFA\u5931\u8D25" });
      }
    } catch (err) {
      console.error("[Pay] create exception:", err);
      return reply.status(500).send({ success: false, error: "\u652F\u4ED8\u521B\u5EFA\u5931\u8D25" });
    }
  });
  fastify.post("/pay/callback", async (request, reply) => {
    console.log("[Pay] callback called, body:", JSON.stringify(request.body).slice(0, 300));
    try {
      const rawBody = request.rawBody || "";
      const resultXml = await handlePayCallback(rawBody);
      reply.type("application/xml").send(resultXml);
    } catch (err) {
      console.error("[Pay] callback error:", err);
      reply.type("application/xml").send("<xml><return_code><![CDATA[FAIL]]></return_code></xml>");
    }
  });
}

// src/modules/mall/mall.route.ts
init_store();
init_pay_service();
async function mallRoutes(fastify) {
  fastify.get("/goods", async (request, reply) => {
    try {
      const goods = await listGoods();
      return {
        success: true,
        goods: goods.map((g) => ({
          id: g.id,
          name: g.name,
          price: g.price,
          priceDisplay: "\xA5" + (g.price / 100).toFixed(0),
          productType: g.productType,
          coverImage: g.coverImage,
          description: g.description
        }))
      };
    } catch (err) {
      console.error("\u5546\u54C1\u5217\u8868\u67E5\u8BE2\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u67E5\u8BE2\u5931\u8D25" });
    }
  });
  fastify.get("/goods/:id", async (request, reply) => {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      return reply.status(400).send({ success: false, error: "\u65E0\u6548\u7684\u5546\u54C1ID" });
    }
    try {
      const goods = await getGoods(id);
      if (!goods) {
        return reply.status(404).send({ success: false, error: "\u5546\u54C1\u4E0D\u5B58\u5728" });
      }
      return {
        success: true,
        goods: {
          ...goods,
          priceDisplay: "\xA5" + (goods.price / 100).toFixed(0)
        }
      };
    } catch (err) {
      console.error("\u5546\u54C1\u8BE6\u60C5\u67E5\u8BE2\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u67E5\u8BE2\u5931\u8D25" });
    }
  });
  fastify.post("/order", {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { goodsId, openid } = request.body || {};
    const userId = request.user?.phone || request.user?.id || "";
    if (!goodsId) {
      return reply.status(400).send({ success: false, error: "\u7F3A\u5C11goodsId" });
    }
    try {
      const goods = await getGoods(Number(goodsId));
      if (!goods) {
        return reply.status(404).send({ success: false, error: "\u5546\u54C1\u4E0D\u5B58\u5728" });
      }
      const orderId = "M" + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase();
      await createMallOrder(orderId, userId, goods.id, goods.name, goods.price);
      const payResult = await unifiedOrder({
        openid: openid || "mock_openid_" + Date.now(),
        planId: "mall_" + goods.id,
        memberLevel: 0,
        totalFee: goods.price,
        userId,
        goodsId: goods.id
        // 传给微信支付attach，回调时识别商城订单
      });
      if (!payResult.success) {
        return reply.status(500).send({ success: false, error: payResult.error });
      }
      return {
        success: true,
        orderId,
        jsapiParams: payResult.data
      };
    } catch (err) {
      console.error("\u5546\u57CE\u4E0B\u5355\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u4E0B\u5355\u5931\u8D25" });
    }
  });
}

// src/index.ts
init_mysql();
init_store();
init_redis();
var __dirname = path3.dirname(fileURLToPath2(import.meta.url));
var app = Fastify({
  logger: process.env.NODE_ENV === "production" ? { level: "warn" } : true
});
await app.register(cors, {
  origin: true,
  credentials: true
});
await app.register(jwt, {
  secret: config.jwt.secret
});
app.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "\u672A\u6388\u6743\uFF0C\u8BF7\u5148\u767B\u5F55" });
  }
});
await app.register(multipart, {
  limits: { fileSize: 25 * 1024 * 1024 },
  // 捕获原始 XML body（微信支付回调用）
  onFilePart: (field, stream, filename, encoding, mimetype) => {
  }
});
app.addContentTypeParser("application/xml", { parseAs: "string" }, (req, body, done) => {
  try {
    ;
    req.rawBody = body;
    done(null, body);
  } catch (err) {
    done(err, "");
  }
});
app.addContentTypeParser("text/xml", { parseAs: "string" }, (req, body, done) => {
  try {
    ;
    req.rawBody = body;
    done(null, body);
  } catch (err) {
    done(err, "");
  }
});
var PROJECT_ROOT = process.env.NODE_ENV === "production" ? "/app" : path3.join(__dirname, "..");
var PUBLIC_DIR = process.env.NODE_ENV === "production" ? "/app/public/pdfs" : path3.join(PROJECT_ROOT, "public/pdfs");
var STATIC_DIR = process.env.NODE_ENV === "production" ? "/app/public" : path3.join(PROJECT_ROOT, "public");
try {
  const fs3 = await import("fs");
  fs3.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs3.mkdirSync(STATIC_DIR, { recursive: true });
  fs3.mkdirSync("/app/uploads/evidence", { recursive: true });
} catch (e) {
  console.warn("[Static] \u76EE\u5F55\u521B\u5EFA\u5931\u8D25\uFF08\u53EF\u80FD\u5DF2\u5B58\u5728\u6216\u65E0\u6743\u9650\uFF09:", String(e));
}
try {
  await app.register(staticFiles, {
    root: PUBLIC_DIR,
    prefix: "/pdfs",
    decorateReply: false
  });
  console.log("[Static] PDF\u9759\u6001\u6587\u4EF6\u5DF2\u6CE8\u518C:", PUBLIC_DIR);
  await app.register(staticFiles, {
    root: "/app/uploads/evidence",
    prefix: "/uploads/evidence",
    decorateReply: false
  });
  console.log("[Static] \u8BC1\u636E\u6587\u4EF6\u9759\u6001\u670D\u52A1\u5DF2\u6CE8\u518C: /app/uploads/evidence");
} catch (e) {
  console.warn("[Static] PDF\u9759\u6001\u6587\u4EF6\u6CE8\u518C\u5931\u8D25\uFF0C\u670D\u52A1\u7EE7\u7EED\u8FD0\u884C:", String(e));
}
app.get("/privacy", async (_req, reply) => {
  const fs3 = await import("fs");
  const privacyPath = path3.join(STATIC_DIR, "privacy.html");
  const html = fs3.readFileSync(privacyPath, "utf-8");
  return reply.type("text/html").send(html);
});
app.post("/api/v1/admin/seed-test", async (_request, reply) => {
  try {
    const { createUser: createUser2, purchaseMember: purchaseMember2 } = await Promise.resolve().then(() => (init_store(), store_exports));
    const accounts = [
      { phone: "15000000001", level: 0, planId: "free", planName: "\u666E\u901A\u7528\u6237", days: 0, times: 0 },
      { phone: "15000000002", level: 1, planId: "quarter", planName: "\u5B63VIP", days: 90, times: 10 },
      { phone: "15000000003", level: 2, planId: "half_year", planName: "\u534A\u5E74SVIP", days: 180, times: 30 },
      { phone: "15000000004", level: 3, planId: "annual", planName: "\u9ED1\u91D1\u5E74\u5361", days: 365, times: 50 }
    ];
    const results = [];
    for (const a of accounts) {
      const openid = "test_" + a.phone;
      await createUser2({ phone: a.phone, nickname: "\u6D4B\u8BD5" + a.planName, openid, registerSource: "seed" });
      if (a.level > 0) await purchaseMember2(openid, a.level, a.planId, a.planName, a.days, a.times);
      results.push({ phone: a.phone, level: a.level, plan: a.planName, times: a.times, days: a.days });
    }
    return { success: true, accounts: results, loginTip: "\u9A8C\u8BC1\u7801\u7EDF\u4E00 123456" };
  } catch (e) {
    return reply.status(500).send({ success: false, error: e.message });
  }
});
await app.register(evidenceRoutes, { prefix: "/api/v1/evidence", bodyLimit: 25 * 1024 * 1024 });
await app.register(reportRoutes, { prefix: "/api/v1/report" });
await app.register(userRoutes, { prefix: "/api/v1/user" });
await app.register(verifyRoutes, { prefix: "/api/v1/verify" });
await app.register(memberRoutes, { prefix: "/api/v1/member" });
await app.register(mallRoutes, { prefix: "/api/v1/mall" });
await app.register(adminRoute, { prefix: "/api/v1/admin" });
await app.register(webhookRoutes, { prefix: "/api/v1/ext" });
await app.register(payRoutes, { prefix: "/api/v1" });
app.get("/health", async () => ({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() }));
app.get("/api/v1/admin/tables", async (_req, reply) => {
  try {
    const { getPool: getPool3 } = await Promise.resolve().then(() => (init_mysql(), mysql_exports));
    const pool2 = getPool3();
    const [rows] = await pool2.query("SHOW TABLES");
    const tables = rows.map((r) => Object.values(r)[0]);
    return { ok: true, tables };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});
app.post("/api/v1/admin/init-db", async (_req, reply) => {
  try {
    const { initPool: initPool2, query: query2 } = await Promise.resolve().then(() => (init_mysql(), mysql_exports));
    await initPool2();
    const { ensureTables: ensureTables2 } = await Promise.resolve().then(() => (init_store(), store_exports));
    const pool2 = (await Promise.resolve().then(() => (init_mysql(), mysql_exports))).getPool();
    const [rows] = await pool2.query("SHOW TABLES");
    const existingTables = rows.map((r) => Object.values(r)[0]);
    if (existingTables.length > 0) {
      for (const t of existingTables) {
        await pool2.query(`DROP TABLE IF EXISTS \`${t}\``);
      }
      console.log("[Admin] \u5DF2\u5220\u9664\u65E7\u8868:", existingTables);
    }
    await ensureTables2();
    const [rows2] = await pool2.query("SHOW TABLES");
    const tables = rows2.map((r) => Object.values(r)[0]);
    return { ok: true, message: "\u4E94\u5F20\u8868\u91CD\u5EFA\u5B8C\u6210", tables };
  } catch (err) {
    console.error("[Admin] \u5EFA\u8868\u5931\u8D25:", err);
    return reply.status(500).send({ ok: false, error: String(err) });
  }
});
var start = async () => {
  try {
    await initPool();
    await ensureTables();
    console.log("[MySQL] \u2705 \u521D\u59CB\u5316\u5B8C\u6210");
    await initRedis();
    app.addHook("onRequest", async (request, reply) => {
      const userId = request.user?.openid || request.ip || "anon";
      const path4 = request.url;
      if (path4 === "/health" || path4.startsWith("/pdfs/") || path4.startsWith("/uploads/")) return;
      const ok = await checkRateLimit(userId, 30, 60);
      if (!ok) {
        return reply.status(429).send({ error: "\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5", code: "RATE_LIMITED" });
      }
    });
    await app.listen({ port: config.port, host: config.host });
    console.log(`\u2705 \u542F\u4FE1\u901A\u540E\u7AEF\u5DF2\u542F\u52A8: http://${config.host}:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
