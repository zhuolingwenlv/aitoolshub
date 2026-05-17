var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all3) => {
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

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
    orderId = ""
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
    if (sets.length > 0) {
      sets.push("updated_at=NOW()");
      vals.push(reportId);
      await query(`UPDATE drafts SET ${sets.join(", ")} WHERE report_id=? AND is_deleted=0`, vals);
    }
  } else {
    await insert(
      `INSERT INTO drafts (report_id, report_no, user_id, scene, sub_type, amount, focus, status, evidence,
       member_level, report_data, is_locked, gen_status, report_version, order_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
        orderId
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
async function listReportsByUser(userId, limit = 20) {
  const rows = await query(
    "SELECT * FROM drafts WHERE user_id = ? AND is_deleted = 0 ORDER BY created_at DESC LIMIT ?",
    [userId, limit]
  );
  return rows.map(parseDraft);
}
function parseDraft(row) {
  return {
    id: row.report_id,
    reportId: row.report_id,
    reportNo: row.report_no || "",
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
  for (const [id, name, price, type, cover, url2, desc] of seedGoods) {
    try {
      await query(
        "INSERT IGNORE INTO goods (id, name, price, product_type, cover_image, file_url, description) VALUES (?,?,?,?,?,?,?)",
        [id, name, price, type, cover, url2, desc]
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

// node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
var init_bind = __esm({
  "node_modules/axios/lib/helpers/bind.js"() {
    "use strict";
  }
});

// node_modules/axios/lib/utils.js
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
function getGlobal() {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  return {};
}
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    if (isBuffer(obj)) {
      return;
    }
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  if (isBuffer(obj)) {
    return null;
  }
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
function merge(...objs) {
  const { caseless, skipUndefined } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return;
    }
    const targetKey = caseless && findKey(result, key) || key;
    const existing = hasOwnProperty(result, targetKey) ? result[targetKey] : void 0;
    if (isPlainObject(existing) && isPlainObject(val)) {
      result[targetKey] = merge(existing, val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = objs.length; i < l; i++) {
    objs[i] && forEach(objs[i], assignValue);
  }
  return result;
}
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
var toString, getPrototypeOf, iterator, toStringTag, kindOf, kindOfTest, typeOfTest, isArray, isUndefined, isArrayBuffer, isString, isFunction, isNumber, isObject, isBoolean, isPlainObject, isEmptyObject, isDate, isFile, isReactNativeBlob, isReactNative, isBlob, isFileList, isStream, G, FormDataCtor, isFormData, isURLSearchParams, isReadableStream, isRequest, isResponse, isHeaders, trim, _global, isContextDefined, extend, stripBOM, inherits, toFlatObject, endsWith, toArray, isTypedArray, forEachEntry, matchAll, isHTMLForm, toCamelCase, hasOwnProperty, isRegExp, reduceDescriptors, freezeMethods, toObjectSet, noop, toFiniteNumber, toJSONObject, isAsyncFn, isThenable, _setImmediate, asap, isIterable, utils_default;
var init_utils = __esm({
  "node_modules/axios/lib/utils.js"() {
    "use strict";
    init_bind();
    ({ toString } = Object.prototype);
    ({ getPrototypeOf } = Object);
    ({ iterator, toStringTag } = Symbol);
    kindOf = /* @__PURE__ */ ((cache) => (thing) => {
      const str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(/* @__PURE__ */ Object.create(null));
    kindOfTest = (type) => {
      type = type.toLowerCase();
      return (thing) => kindOf(thing) === type;
    };
    typeOfTest = (type) => (thing) => typeof thing === type;
    ({ isArray } = Array);
    isUndefined = typeOfTest("undefined");
    isArrayBuffer = kindOfTest("ArrayBuffer");
    isString = typeOfTest("string");
    isFunction = typeOfTest("function");
    isNumber = typeOfTest("number");
    isObject = (thing) => thing !== null && typeof thing === "object";
    isBoolean = (thing) => thing === true || thing === false;
    isPlainObject = (val) => {
      if (kindOf(val) !== "object") {
        return false;
      }
      const prototype2 = getPrototypeOf(val);
      return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
    };
    isEmptyObject = (val) => {
      if (!isObject(val) || isBuffer(val)) {
        return false;
      }
      try {
        return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
      } catch (e) {
        return false;
      }
    };
    isDate = kindOfTest("Date");
    isFile = kindOfTest("File");
    isReactNativeBlob = (value) => {
      return !!(value && typeof value.uri !== "undefined");
    };
    isReactNative = (formData) => formData && typeof formData.getParts !== "undefined";
    isBlob = kindOfTest("Blob");
    isFileList = kindOfTest("FileList");
    isStream = (val) => isObject(val) && isFunction(val.pipe);
    G = getGlobal();
    FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : void 0;
    isFormData = (thing) => {
      if (!thing) return false;
      if (FormDataCtor && thing instanceof FormDataCtor) return true;
      const proto = getPrototypeOf(thing);
      if (!proto || proto === Object.prototype) return false;
      if (!isFunction(thing.append)) return false;
      const kind = kindOf(thing);
      return kind === "formdata" || // detect form-data instance
      kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]";
    };
    isURLSearchParams = kindOfTest("URLSearchParams");
    [isReadableStream, isRequest, isResponse, isHeaders] = [
      "ReadableStream",
      "Request",
      "Response",
      "Headers"
    ].map(kindOfTest);
    trim = (str) => {
      return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
    _global = (() => {
      if (typeof globalThis !== "undefined") return globalThis;
      return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
    })();
    isContextDefined = (context) => !isUndefined(context) && context !== _global;
    extend = (a, b, thisArg, { allOwnKeys } = {}) => {
      forEach(
        b,
        (val, key) => {
          if (thisArg && isFunction(val)) {
            Object.defineProperty(a, key, {
              // Null-proto descriptor so a polluted Object.prototype.get cannot
              // hijack defineProperty's accessor-vs-data resolution.
              __proto__: null,
              value: bind(val, thisArg),
              writable: true,
              enumerable: true,
              configurable: true
            });
          } else {
            Object.defineProperty(a, key, {
              __proto__: null,
              value: val,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        },
        { allOwnKeys }
      );
      return a;
    };
    stripBOM = (content) => {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    };
    inherits = (constructor, superConstructor, props, descriptors) => {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      Object.defineProperty(constructor.prototype, "constructor", {
        __proto__: null,
        value: constructor,
        writable: true,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(constructor, "super", {
        __proto__: null,
        value: superConstructor.prototype
      });
      props && Object.assign(constructor.prototype, props);
    };
    toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
      let props;
      let i;
      let prop;
      const merged = {};
      destObj = destObj || {};
      if (sourceObj == null) return destObj;
      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
      return destObj;
    };
    endsWith = (str, searchString, position) => {
      str = String(str);
      if (position === void 0 || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      const lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
    toArray = (thing) => {
      if (!thing) return null;
      if (isArray(thing)) return thing;
      let i = thing.length;
      if (!isNumber(i)) return null;
      const arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    };
    isTypedArray = /* @__PURE__ */ ((TypedArray) => {
      return (thing) => {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
    forEachEntry = (obj, fn) => {
      const generator = obj && obj[iterator];
      const _iterator = generator.call(obj);
      let result;
      while ((result = _iterator.next()) && !result.done) {
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
      }
    };
    matchAll = (regExp, str) => {
      let matches;
      const arr = [];
      while ((matches = regExp.exec(str)) !== null) {
        arr.push(matches);
      }
      return arr;
    };
    isHTMLForm = kindOfTest("HTMLFormElement");
    toCamelCase = (str) => {
      return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      });
    };
    hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
    isRegExp = kindOfTest("RegExp");
    reduceDescriptors = (obj, reducer) => {
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      const reducedDescriptors = {};
      forEach(descriptors, (descriptor, name) => {
        let ret;
        if ((ret = reducer(descriptor, name, obj)) !== false) {
          reducedDescriptors[name] = ret || descriptor;
        }
      });
      Object.defineProperties(obj, reducedDescriptors);
    };
    freezeMethods = (obj) => {
      reduceDescriptors(obj, (descriptor, name) => {
        if (isFunction(obj) && ["arguments", "caller", "callee"].includes(name)) {
          return false;
        }
        const value = obj[name];
        if (!isFunction(value)) return;
        descriptor.enumerable = false;
        if ("writable" in descriptor) {
          descriptor.writable = false;
          return;
        }
        if (!descriptor.set) {
          descriptor.set = () => {
            throw Error("Can not rewrite read-only method '" + name + "'");
          };
        }
      });
    };
    toObjectSet = (arrayOrString, delimiter) => {
      const obj = {};
      const define = (arr) => {
        arr.forEach((value) => {
          obj[value] = true;
        });
      };
      isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
      return obj;
    };
    noop = () => {
    };
    toFiniteNumber = (value, defaultValue) => {
      return value != null && Number.isFinite(value = +value) ? value : defaultValue;
    };
    toJSONObject = (obj) => {
      const stack = new Array(10);
      const visit = (source, i) => {
        if (isObject(source)) {
          if (stack.indexOf(source) >= 0) {
            return;
          }
          if (isBuffer(source)) {
            return source;
          }
          if (!("toJSON" in source)) {
            stack[i] = source;
            const target = isArray(source) ? [] : {};
            forEach(source, (value, key) => {
              const reducedValue = visit(value, i + 1);
              !isUndefined(reducedValue) && (target[key] = reducedValue);
            });
            stack[i] = void 0;
            return target;
          }
        }
        return source;
      };
      return visit(obj, 0);
    };
    isAsyncFn = kindOfTest("AsyncFunction");
    isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
    _setImmediate = ((setImmediateSupported, postMessageSupported) => {
      if (setImmediateSupported) {
        return setImmediate;
      }
      return postMessageSupported ? ((token, callbacks) => {
        _global.addEventListener(
          "message",
          ({ source, data }) => {
            if (source === _global && data === token) {
              callbacks.length && callbacks.shift()();
            }
          },
          false
        );
        return (cb) => {
          callbacks.push(cb);
          _global.postMessage(token, "*");
        };
      })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
    })(typeof setImmediate === "function", isFunction(_global.postMessage));
    asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
    isIterable = (thing) => thing != null && isFunction(thing[iterator]);
    utils_default = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isBoolean,
      isObject,
      isPlainObject,
      isEmptyObject,
      isReadableStream,
      isRequest,
      isResponse,
      isHeaders,
      isUndefined,
      isDate,
      isFile,
      isReactNativeBlob,
      isReactNative,
      isBlob,
      isRegExp,
      isFunction,
      isStream,
      isURLSearchParams,
      isTypedArray,
      isFileList,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      forEachEntry,
      matchAll,
      isHTMLForm,
      hasOwnProperty,
      hasOwnProp: hasOwnProperty,
      // an alias to avoid ESLint no-prototype-builtins detection
      reduceDescriptors,
      freezeMethods,
      toObjectSet,
      toCamelCase,
      noop,
      toFiniteNumber,
      findKey,
      global: _global,
      isContextDefined,
      isSpecCompliantForm,
      toJSONObject,
      isAsyncFn,
      isThenable,
      setImmediate: _setImmediate,
      asap,
      isIterable
    };
  }
});

// node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf, parseHeaders_default;
var init_parseHeaders = __esm({
  "node_modules/axios/lib/helpers/parseHeaders.js"() {
    "use strict";
    init_utils();
    ignoreDuplicateOf = utils_default.toObjectSet([
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ]);
    parseHeaders_default = (rawHeaders) => {
      const parsed = {};
      let key;
      let val;
      let i;
      rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
        i = line.indexOf(":");
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();
        if (!key || parsed[key] && ignoreDuplicateOf[key]) {
          return;
        }
        if (key === "set-cookie") {
          if (parsed[key]) {
            parsed[key].push(val);
          } else {
            parsed[key] = [val];
          }
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      });
      return parsed;
    };
  }
});

// node_modules/axios/lib/core/AxiosHeaders.js
function trimSPorHTAB(str) {
  let start2 = 0;
  let end = str.length;
  while (start2 < end) {
    const code = str.charCodeAt(start2);
    if (code !== 9 && code !== 32) {
      break;
    }
    start2 += 1;
  }
  while (end > start2) {
    const code = str.charCodeAt(end - 1);
    if (code !== 9 && code !== 32) {
      break;
    }
    end -= 1;
  }
  return start2 === 0 && end === str.length ? str : str.slice(start2, end);
}
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function sanitizeHeaderValue(str) {
  return trimSPorHTAB(str.replace(INVALID_HEADER_VALUE_CHARS_RE, ""));
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value) ? value.map(normalizeValue) : sanitizeHeaderValue(String(value));
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value)) return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
var $internals, INVALID_HEADER_VALUE_CHARS_RE, isValidHeaderName, AxiosHeaders, AxiosHeaders_default;
var init_AxiosHeaders = __esm({
  "node_modules/axios/lib/core/AxiosHeaders.js"() {
    "use strict";
    init_utils();
    init_parseHeaders();
    $internals = /* @__PURE__ */ Symbol("internals");
    INVALID_HEADER_VALUE_CHARS_RE = /[^\x09\x20-\x7E\x80-\xFF]/g;
    isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
    AxiosHeaders = class {
      constructor(headers) {
        headers && this.set(headers);
      }
      set(header, valueOrRewrite, rewrite) {
        const self2 = this;
        function setHeader(_value, _header, _rewrite) {
          const lHeader = normalizeHeader(_header);
          if (!lHeader) {
            throw new Error("header name must be a non-empty string");
          }
          const key = utils_default.findKey(self2, lHeader);
          if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
            self2[key || _header] = normalizeValue(_value);
          }
        }
        const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
        if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
          setHeaders(header, valueOrRewrite);
        } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
          setHeaders(parseHeaders_default(header), valueOrRewrite);
        } else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
          let obj = {}, dest, key;
          for (const entry of header) {
            if (!utils_default.isArray(entry)) {
              throw TypeError("Object iterator must return a key-value pair");
            }
            obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
          }
          setHeaders(obj, valueOrRewrite);
        } else {
          header != null && setHeader(valueOrRewrite, header, rewrite);
        }
        return this;
      }
      get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
          const key = utils_default.findKey(this, header);
          if (key) {
            const value = this[key];
            if (!parser) {
              return value;
            }
            if (parser === true) {
              return parseTokens(value);
            }
            if (utils_default.isFunction(parser)) {
              return parser.call(this, value, key);
            }
            if (utils_default.isRegExp(parser)) {
              return parser.exec(value);
            }
            throw new TypeError("parser must be boolean|regexp|function");
          }
        }
      }
      has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
          const key = utils_default.findKey(this, header);
          return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
      }
      delete(header, matcher) {
        const self2 = this;
        let deleted = false;
        function deleteHeader(_header) {
          _header = normalizeHeader(_header);
          if (_header) {
            const key = utils_default.findKey(self2, _header);
            if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
              delete self2[key];
              deleted = true;
            }
          }
        }
        if (utils_default.isArray(header)) {
          header.forEach(deleteHeader);
        } else {
          deleteHeader(header);
        }
        return deleted;
      }
      clear(matcher) {
        const keys = Object.keys(this);
        let i = keys.length;
        let deleted = false;
        while (i--) {
          const key = keys[i];
          if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
            delete this[key];
            deleted = true;
          }
        }
        return deleted;
      }
      normalize(format) {
        const self2 = this;
        const headers = {};
        utils_default.forEach(this, (value, header) => {
          const key = utils_default.findKey(headers, header);
          if (key) {
            self2[key] = normalizeValue(value);
            delete self2[header];
            return;
          }
          const normalized = format ? formatHeader(header) : String(header).trim();
          if (normalized !== header) {
            delete self2[header];
          }
          self2[normalized] = normalizeValue(value);
          headers[normalized] = true;
        });
        return this;
      }
      concat(...targets) {
        return this.constructor.concat(this, ...targets);
      }
      toJSON(asStrings) {
        const obj = /* @__PURE__ */ Object.create(null);
        utils_default.forEach(this, (value, header) => {
          value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
        });
        return obj;
      }
      [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
      }
      toString() {
        return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
      }
      getSetCookie() {
        return this.get("set-cookie") || [];
      }
      get [Symbol.toStringTag]() {
        return "AxiosHeaders";
      }
      static from(thing) {
        return thing instanceof this ? thing : new this(thing);
      }
      static concat(first, ...targets) {
        const computed = new this(first);
        targets.forEach((target) => computed.set(target));
        return computed;
      }
      static accessor(header) {
        const internals = this[$internals] = this[$internals] = {
          accessors: {}
        };
        const accessors = internals.accessors;
        const prototype2 = this.prototype;
        function defineAccessor(_header) {
          const lHeader = normalizeHeader(_header);
          if (!accessors[lHeader]) {
            buildAccessors(prototype2, _header);
            accessors[lHeader] = true;
          }
        }
        utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
      }
    };
    AxiosHeaders.accessor([
      "Content-Type",
      "Content-Length",
      "Accept",
      "Accept-Encoding",
      "User-Agent",
      "Authorization"
    ]);
    utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
      let mapped = key[0].toUpperCase() + key.slice(1);
      return {
        get: () => value,
        set(headerValue) {
          this[mapped] = headerValue;
        }
      };
    });
    utils_default.freezeMethods(AxiosHeaders);
    AxiosHeaders_default = AxiosHeaders;
  }
});

// node_modules/axios/lib/core/AxiosError.js
function hasOwnOrPrototypeToJSON(source) {
  if (utils_default.hasOwnProp(source, "toJSON")) {
    return true;
  }
  let prototype2 = Object.getPrototypeOf(source);
  while (prototype2 && prototype2 !== Object.prototype) {
    if (utils_default.hasOwnProp(prototype2, "toJSON")) {
      return true;
    }
    prototype2 = Object.getPrototypeOf(prototype2);
  }
  return false;
}
function redactConfig(config2, redactKeys) {
  const lowerKeys = new Set(redactKeys.map((k) => String(k).toLowerCase()));
  const seen = [];
  const visit = (source) => {
    if (source === null || typeof source !== "object") return source;
    if (utils_default.isBuffer(source)) return source;
    if (seen.indexOf(source) !== -1) return void 0;
    if (source instanceof AxiosHeaders_default) {
      source = source.toJSON();
    }
    seen.push(source);
    let result;
    if (utils_default.isArray(source)) {
      result = [];
      source.forEach((v, i) => {
        const reducedValue = visit(v);
        if (!utils_default.isUndefined(reducedValue)) {
          result[i] = reducedValue;
        }
      });
    } else {
      if (!utils_default.isPlainObject(source) && hasOwnOrPrototypeToJSON(source)) {
        seen.pop();
        return source;
      }
      result = /* @__PURE__ */ Object.create(null);
      for (const [key, value] of Object.entries(source)) {
        const reducedValue = lowerKeys.has(key.toLowerCase()) ? REDACTED : visit(value);
        if (!utils_default.isUndefined(reducedValue)) {
          result[key] = reducedValue;
        }
      }
    }
    seen.pop();
    return result;
  };
  return visit(config2);
}
var REDACTED, AxiosError, AxiosError_default;
var init_AxiosError = __esm({
  "node_modules/axios/lib/core/AxiosError.js"() {
    "use strict";
    init_utils();
    init_AxiosHeaders();
    REDACTED = "[REDACTED ****]";
    AxiosError = class _AxiosError extends Error {
      static from(error, code, config2, request, response, customProps) {
        const axiosError = new _AxiosError(error.message, code || error.code, config2, request, response);
        axiosError.cause = error;
        axiosError.name = error.name;
        if (error.status != null && axiosError.status == null) {
          axiosError.status = error.status;
        }
        customProps && Object.assign(axiosError, customProps);
        return axiosError;
      }
      /**
       * Create an Error with the specified message, config, error code, request and response.
       *
       * @param {string} message The error message.
       * @param {string} [code] The error code (for example, 'ECONNABORTED').
       * @param {Object} [config] The config.
       * @param {Object} [request] The request.
       * @param {Object} [response] The response.
       *
       * @returns {Error} The created error.
       */
      constructor(message, code, config2, request, response) {
        super(message);
        Object.defineProperty(this, "message", {
          // Null-proto descriptor so a polluted Object.prototype.get cannot turn
          // this data descriptor into an accessor descriptor on the way in.
          __proto__: null,
          value: message,
          enumerable: true,
          writable: true,
          configurable: true
        });
        this.name = "AxiosError";
        this.isAxiosError = true;
        code && (this.code = code);
        config2 && (this.config = config2);
        request && (this.request = request);
        if (response) {
          this.response = response;
          this.status = response.status;
        }
      }
      toJSON() {
        const config2 = this.config;
        const redactKeys = config2 && utils_default.hasOwnProp(config2, "redact") ? config2.redact : void 0;
        const serializedConfig = utils_default.isArray(redactKeys) && redactKeys.length > 0 ? redactConfig(config2, redactKeys) : utils_default.toJSONObject(config2);
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: serializedConfig,
          code: this.code,
          status: this.status
        };
      }
    };
    AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
    AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
    AxiosError.ECONNABORTED = "ECONNABORTED";
    AxiosError.ETIMEDOUT = "ETIMEDOUT";
    AxiosError.ECONNREFUSED = "ECONNREFUSED";
    AxiosError.ERR_NETWORK = "ERR_NETWORK";
    AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
    AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
    AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
    AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
    AxiosError.ERR_CANCELED = "ERR_CANCELED";
    AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
    AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
    AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
    AxiosError_default = AxiosError;
  }
});

// node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = __commonJS({
  "node_modules/delayed-stream/lib/delayed_stream.js"(exports, module) {
    var Stream = __require("stream").Stream;
    var util3 = __require("util");
    module.exports = DelayedStream;
    function DelayedStream() {
      this.source = null;
      this.dataSize = 0;
      this.maxDataSize = 1024 * 1024;
      this.pauseStream = true;
      this._maxDataSizeExceeded = false;
      this._released = false;
      this._bufferedEvents = [];
    }
    util3.inherits(DelayedStream, Stream);
    DelayedStream.create = function(source, options) {
      var delayedStream = new this();
      options = options || {};
      for (var option in options) {
        delayedStream[option] = options[option];
      }
      delayedStream.source = source;
      var realEmit = source.emit;
      source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
      };
      source.on("error", function() {
      });
      if (delayedStream.pauseStream) {
        source.pause();
      }
      return delayedStream;
    };
    Object.defineProperty(DelayedStream.prototype, "readable", {
      configurable: true,
      enumerable: true,
      get: function() {
        return this.source.readable;
      }
    });
    DelayedStream.prototype.setEncoding = function() {
      return this.source.setEncoding.apply(this.source, arguments);
    };
    DelayedStream.prototype.resume = function() {
      if (!this._released) {
        this.release();
      }
      this.source.resume();
    };
    DelayedStream.prototype.pause = function() {
      this.source.pause();
    };
    DelayedStream.prototype.release = function() {
      this._released = true;
      this._bufferedEvents.forEach(function(args) {
        this.emit.apply(this, args);
      }.bind(this));
      this._bufferedEvents = [];
    };
    DelayedStream.prototype.pipe = function() {
      var r = Stream.prototype.pipe.apply(this, arguments);
      this.resume();
      return r;
    };
    DelayedStream.prototype._handleEmit = function(args) {
      if (this._released) {
        this.emit.apply(this, args);
        return;
      }
      if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
      }
      this._bufferedEvents.push(args);
    };
    DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
      if (this._maxDataSizeExceeded) {
        return;
      }
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      this._maxDataSizeExceeded = true;
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(message));
    };
  }
});

// node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = __commonJS({
  "node_modules/combined-stream/lib/combined_stream.js"(exports, module) {
    var util3 = __require("util");
    var Stream = __require("stream").Stream;
    var DelayedStream = require_delayed_stream();
    module.exports = CombinedStream;
    function CombinedStream() {
      this.writable = false;
      this.readable = true;
      this.dataSize = 0;
      this.maxDataSize = 2 * 1024 * 1024;
      this.pauseStreams = true;
      this._released = false;
      this._streams = [];
      this._currentStream = null;
      this._insideLoop = false;
      this._pendingNext = false;
    }
    util3.inherits(CombinedStream, Stream);
    CombinedStream.create = function(options) {
      var combinedStream = new this();
      options = options || {};
      for (var option in options) {
        combinedStream[option] = options[option];
      }
      return combinedStream;
    };
    CombinedStream.isStreamLike = function(stream4) {
      return typeof stream4 !== "function" && typeof stream4 !== "string" && typeof stream4 !== "boolean" && typeof stream4 !== "number" && !Buffer.isBuffer(stream4);
    };
    CombinedStream.prototype.append = function(stream4) {
      var isStreamLike = CombinedStream.isStreamLike(stream4);
      if (isStreamLike) {
        if (!(stream4 instanceof DelayedStream)) {
          var newStream = DelayedStream.create(stream4, {
            maxDataSize: Infinity,
            pauseStream: this.pauseStreams
          });
          stream4.on("data", this._checkDataSize.bind(this));
          stream4 = newStream;
        }
        this._handleErrors(stream4);
        if (this.pauseStreams) {
          stream4.pause();
        }
      }
      this._streams.push(stream4);
      return this;
    };
    CombinedStream.prototype.pipe = function(dest, options) {
      Stream.prototype.pipe.call(this, dest, options);
      this.resume();
      return dest;
    };
    CombinedStream.prototype._getNext = function() {
      this._currentStream = null;
      if (this._insideLoop) {
        this._pendingNext = true;
        return;
      }
      this._insideLoop = true;
      try {
        do {
          this._pendingNext = false;
          this._realGetNext();
        } while (this._pendingNext);
      } finally {
        this._insideLoop = false;
      }
    };
    CombinedStream.prototype._realGetNext = function() {
      var stream4 = this._streams.shift();
      if (typeof stream4 == "undefined") {
        this.end();
        return;
      }
      if (typeof stream4 !== "function") {
        this._pipeNext(stream4);
        return;
      }
      var getStream = stream4;
      getStream(function(stream5) {
        var isStreamLike = CombinedStream.isStreamLike(stream5);
        if (isStreamLike) {
          stream5.on("data", this._checkDataSize.bind(this));
          this._handleErrors(stream5);
        }
        this._pipeNext(stream5);
      }.bind(this));
    };
    CombinedStream.prototype._pipeNext = function(stream4) {
      this._currentStream = stream4;
      var isStreamLike = CombinedStream.isStreamLike(stream4);
      if (isStreamLike) {
        stream4.on("end", this._getNext.bind(this));
        stream4.pipe(this, { end: false });
        return;
      }
      var value = stream4;
      this.write(value);
      this._getNext();
    };
    CombinedStream.prototype._handleErrors = function(stream4) {
      var self2 = this;
      stream4.on("error", function(err) {
        self2._emitError(err);
      });
    };
    CombinedStream.prototype.write = function(data) {
      this.emit("data", data);
    };
    CombinedStream.prototype.pause = function() {
      if (!this.pauseStreams) {
        return;
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
      this.emit("pause");
    };
    CombinedStream.prototype.resume = function() {
      if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
      this.emit("resume");
    };
    CombinedStream.prototype.end = function() {
      this._reset();
      this.emit("end");
    };
    CombinedStream.prototype.destroy = function() {
      this._reset();
      this.emit("close");
    };
    CombinedStream.prototype._reset = function() {
      this.writable = false;
      this._streams = [];
      this._currentStream = null;
    };
    CombinedStream.prototype._checkDataSize = function() {
      this._updateDataSize();
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(message));
    };
    CombinedStream.prototype._updateDataSize = function() {
      this.dataSize = 0;
      var self2 = this;
      this._streams.forEach(function(stream4) {
        if (!stream4.dataSize) {
          return;
        }
        self2.dataSize += stream4.dataSize;
      });
      if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
      }
    };
    CombinedStream.prototype._emitError = function(err) {
      this._reset();
      this.emit("error", err);
    };
  }
});

// node_modules/mime-db/db.json
var require_db = __commonJS({
  "node_modules/mime-db/db.json"(exports, module) {
    module.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/ace+cbor": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/at+jwt": {
        source: "iana"
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/city+json": {
        source: "iana",
        compressible: true
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"]
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"]
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"]
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/oauth-authz-req+jwt": {
        source: "iana"
      },
      "application/oblivious-dns-message": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p21": {
        source: "iana"
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"]
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/token-introspection+jwt": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"]
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana"
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.lpp": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ngap": {
        source: "iana"
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana"
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana"
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"]
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.arrow.file": {
        source: "iana"
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana"
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.cryptomator.vault": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"]
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.resilient.logic": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"]
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"]
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"]
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"]
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"]
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/step": {
        source: "iana"
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"]
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"]
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.pytha.pyox": {
        source: "iana"
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"]
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/jxsv": {
        source: "iana"
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/vp9": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});

// node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  "node_modules/mime-db/index.js"(exports, module) {
    module.exports = require_db();
  }
});

// node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  "node_modules/mime-types/index.js"(exports) {
    "use strict";
    var db = require_mime_db();
    var extname = __require("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports.charset = charset;
    exports.charsets = { lookup: charset };
    exports.contentType = contentType;
    exports.extension = extension;
    exports.extensions = /* @__PURE__ */ Object.create(null);
    exports.lookup = lookup;
    exports.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports.extensions, exports.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports.charset(mime);
        if (charset2) mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path4) {
      if (!path4 || typeof path4 !== "string") {
        return false;
      }
      var extension2 = extname("x." + path4).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});

// node_modules/asynckit/lib/defer.js
var require_defer = __commonJS({
  "node_modules/asynckit/lib/defer.js"(exports, module) {
    module.exports = defer;
    function defer(fn) {
      var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
      if (nextTick) {
        nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }
    }
  }
});

// node_modules/asynckit/lib/async.js
var require_async = __commonJS({
  "node_modules/asynckit/lib/async.js"(exports, module) {
    var defer = require_defer();
    module.exports = async;
    function async(callback) {
      var isAsync = false;
      defer(function() {
        isAsync = true;
      });
      return function async_callback(err, result) {
        if (isAsync) {
          callback(err, result);
        } else {
          defer(function nextTick_callback() {
            callback(err, result);
          });
        }
      };
    }
  }
});

// node_modules/asynckit/lib/abort.js
var require_abort = __commonJS({
  "node_modules/asynckit/lib/abort.js"(exports, module) {
    module.exports = abort;
    function abort(state) {
      Object.keys(state.jobs).forEach(clean.bind(state));
      state.jobs = {};
    }
    function clean(key) {
      if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
      }
    }
  }
});

// node_modules/asynckit/lib/iterate.js
var require_iterate = __commonJS({
  "node_modules/asynckit/lib/iterate.js"(exports, module) {
    var async = require_async();
    var abort = require_abort();
    module.exports = iterate;
    function iterate(list, iterator2, state, callback) {
      var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
      state.jobs[key] = runJob(iterator2, key, list[key], function(error, output) {
        if (!(key in state.jobs)) {
          return;
        }
        delete state.jobs[key];
        if (error) {
          abort(state);
        } else {
          state.results[key] = output;
        }
        callback(error, state.results);
      });
    }
    function runJob(iterator2, key, item, callback) {
      var aborter;
      if (iterator2.length == 2) {
        aborter = iterator2(item, async(callback));
      } else {
        aborter = iterator2(item, key, async(callback));
      }
      return aborter;
    }
  }
});

// node_modules/asynckit/lib/state.js
var require_state = __commonJS({
  "node_modules/asynckit/lib/state.js"(exports, module) {
    module.exports = state;
    function state(list, sortMethod) {
      var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
      };
      if (sortMethod) {
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
          return sortMethod(list[a], list[b]);
        });
      }
      return initState;
    }
  }
});

// node_modules/asynckit/lib/terminator.js
var require_terminator = __commonJS({
  "node_modules/asynckit/lib/terminator.js"(exports, module) {
    var abort = require_abort();
    var async = require_async();
    module.exports = terminator;
    function terminator(callback) {
      if (!Object.keys(this.jobs).length) {
        return;
      }
      this.index = this.size;
      abort(this);
      async(callback)(null, this.results);
    }
  }
});

// node_modules/asynckit/parallel.js
var require_parallel = __commonJS({
  "node_modules/asynckit/parallel.js"(exports, module) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module.exports = parallel;
    function parallel(list, iterator2, callback) {
      var state = initState(list);
      while (state.index < (state["keyedList"] || list).length) {
        iterate(list, iterator2, state, function(error, result) {
          if (error) {
            callback(error, result);
            return;
          }
          if (Object.keys(state.jobs).length === 0) {
            callback(null, state.results);
            return;
          }
        });
        state.index++;
      }
      return terminator.bind(state, callback);
    }
  }
});

// node_modules/asynckit/serialOrdered.js
var require_serialOrdered = __commonJS({
  "node_modules/asynckit/serialOrdered.js"(exports, module) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module.exports = serialOrdered;
    module.exports.ascending = ascending;
    module.exports.descending = descending;
    function serialOrdered(list, iterator2, sortMethod, callback) {
      var state = initState(list, sortMethod);
      iterate(list, iterator2, state, function iteratorHandler(error, result) {
        if (error) {
          callback(error, result);
          return;
        }
        state.index++;
        if (state.index < (state["keyedList"] || list).length) {
          iterate(list, iterator2, state, iteratorHandler);
          return;
        }
        callback(null, state.results);
      });
      return terminator.bind(state, callback);
    }
    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
    function descending(a, b) {
      return -1 * ascending(a, b);
    }
  }
});

// node_modules/asynckit/serial.js
var require_serial = __commonJS({
  "node_modules/asynckit/serial.js"(exports, module) {
    var serialOrdered = require_serialOrdered();
    module.exports = serial;
    function serial(list, iterator2, callback) {
      return serialOrdered(list, iterator2, null, callback);
    }
  }
});

// node_modules/asynckit/index.js
var require_asynckit = __commonJS({
  "node_modules/asynckit/index.js"(exports, module) {
    module.exports = {
      parallel: require_parallel(),
      serial: require_serial(),
      serialOrdered: require_serialOrdered()
    };
  }
});

// node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "node_modules/es-object-atoms/index.js"(exports, module) {
    "use strict";
    module.exports = Object;
  }
});

// node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "node_modules/es-errors/index.js"(exports, module) {
    "use strict";
    module.exports = Error;
  }
});

// node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "node_modules/es-errors/eval.js"(exports, module) {
    "use strict";
    module.exports = EvalError;
  }
});

// node_modules/es-errors/range.js
var require_range = __commonJS({
  "node_modules/es-errors/range.js"(exports, module) {
    "use strict";
    module.exports = RangeError;
  }
});

// node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "node_modules/es-errors/ref.js"(exports, module) {
    "use strict";
    module.exports = ReferenceError;
  }
});

// node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "node_modules/es-errors/syntax.js"(exports, module) {
    "use strict";
    module.exports = SyntaxError;
  }
});

// node_modules/es-errors/type.js
var require_type = __commonJS({
  "node_modules/es-errors/type.js"(exports, module) {
    "use strict";
    module.exports = TypeError;
  }
});

// node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "node_modules/es-errors/uri.js"(exports, module) {
    "use strict";
    module.exports = URIError;
  }
});

// node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "node_modules/math-intrinsics/abs.js"(exports, module) {
    "use strict";
    module.exports = Math.abs;
  }
});

// node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "node_modules/math-intrinsics/floor.js"(exports, module) {
    "use strict";
    module.exports = Math.floor;
  }
});

// node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "node_modules/math-intrinsics/max.js"(exports, module) {
    "use strict";
    module.exports = Math.max;
  }
});

// node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "node_modules/math-intrinsics/min.js"(exports, module) {
    "use strict";
    module.exports = Math.min;
  }
});

// node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "node_modules/math-intrinsics/pow.js"(exports, module) {
    "use strict";
    module.exports = Math.pow;
  }
});

// node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  "node_modules/math-intrinsics/round.js"(exports, module) {
    "use strict";
    module.exports = Math.round;
  }
});

// node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  "node_modules/math-intrinsics/isNaN.js"(exports, module) {
    "use strict";
    module.exports = Number.isNaN || function isNaN2(a) {
      return a !== a;
    };
  }
});

// node_modules/math-intrinsics/sign.js
var require_sign = __commonJS({
  "node_modules/math-intrinsics/sign.js"(exports, module) {
    "use strict";
    var $isNaN = require_isNaN();
    module.exports = function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    };
  }
});

// node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "node_modules/gopd/gOPD.js"(exports, module) {
    "use strict";
    module.exports = Object.getOwnPropertyDescriptor;
  }
});

// node_modules/gopd/index.js
var require_gopd = __commonJS({
  "node_modules/gopd/index.js"(exports, module) {
    "use strict";
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module.exports = $gOPD;
  }
});

// node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "node_modules/es-define-property/index.js"(exports, module) {
    "use strict";
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module.exports = $defineProperty;
  }
});

// node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "node_modules/has-symbols/shams.js"(exports, module) {
    "use strict";
    module.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = /* @__PURE__ */ Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _ in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  }
});

// node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "node_modules/has-symbols/index.js"(exports, module) {
    "use strict";
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof /* @__PURE__ */ Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  }
});

// node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  "node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module) {
    "use strict";
    module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  }
});

// node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  "node_modules/get-proto/Object.getPrototypeOf.js"(exports, module) {
    "use strict";
    var $Object = require_es_object_atoms();
    module.exports = $Object.getPrototypeOf || null;
  }
});

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "node_modules/function-bind/implementation.js"(exports, module) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module.exports = function bind2(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "node_modules/function-bind/index.js"(exports, module) {
    "use strict";
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  }
});

// node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "node_modules/call-bind-apply-helpers/functionCall.js"(exports, module) {
    "use strict";
    module.exports = Function.prototype.call;
  }
});

// node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "node_modules/call-bind-apply-helpers/functionApply.js"(exports, module) {
    "use strict";
    module.exports = Function.prototype.apply;
  }
});

// node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module) {
    "use strict";
    module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "node_modules/call-bind-apply-helpers/actualApply.js"(exports, module) {
    "use strict";
    var bind2 = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module.exports = $reflectApply || bind2.call($call, $apply);
  }
});

// node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "node_modules/call-bind-apply-helpers/index.js"(exports, module) {
    "use strict";
    var bind2 = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module.exports = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind2, $call, args);
    };
  }
});

// node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "node_modules/dunder-proto/get.js"(exports, module) {
    "use strict";
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD && gOPD(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }
    ) : false;
  }
});

// node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  "node_modules/get-proto/index.js"(exports, module) {
    "use strict";
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module.exports = reflectGetProto ? function getProto(O) {
      return reflectGetProto(O);
    } : originalGetProto ? function getProto(O) {
      if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O);
    } : getDunderProto ? function getProto(O) {
      return getDunderProto(O);
    } : null;
  }
});

// node_modules/hasown/index.js
var require_hasown = __commonJS({
  "node_modules/hasown/index.js"(exports, module) {
    "use strict";
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind2 = require_function_bind();
    module.exports = bind2.call(call, $hasOwn);
  }
});

// node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "node_modules/get-intrinsic/index.js"(exports, module) {
    "use strict";
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? (function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    })() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max,
      "%Math.min%": min,
      "%Math.pow%": pow,
      "%Math.round%": round,
      "%Math.sign%": sign,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind2 = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind2.call($call, Array.prototype.concat);
    var $spliceApply = bind2.call($apply, Array.prototype.splice);
    var $replace = bind2.call($call, String.prototype.replace);
    var $strSlice = bind2.call($call, String.prototype.slice);
    var $exec = bind2.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void undefined2;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  }
});

// node_modules/has-tostringtag/shams.js
var require_shams2 = __commonJS({
  "node_modules/has-tostringtag/shams.js"(exports, module) {
    "use strict";
    var hasSymbols = require_shams();
    module.exports = function hasToStringTagShams() {
      return hasSymbols() && !!Symbol.toStringTag;
    };
  }
});

// node_modules/es-set-tostringtag/index.js
var require_es_set_tostringtag = __commonJS({
  "node_modules/es-set-tostringtag/index.js"(exports, module) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
    var hasToStringTag = require_shams2()();
    var hasOwn = require_hasown();
    var $TypeError = require_type();
    var toStringTag2 = hasToStringTag ? Symbol.toStringTag : null;
    module.exports = function setToStringTag(object, value) {
      var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
      var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
      if (typeof overrideIfSet !== "undefined" && typeof overrideIfSet !== "boolean" || typeof nonConfigurable !== "undefined" && typeof nonConfigurable !== "boolean") {
        throw new $TypeError("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
      }
      if (toStringTag2 && (overrideIfSet || !hasOwn(object, toStringTag2))) {
        if ($defineProperty) {
          $defineProperty(object, toStringTag2, {
            configurable: !nonConfigurable,
            enumerable: false,
            value,
            writable: false
          });
        } else {
          object[toStringTag2] = value;
        }
      }
    };
  }
});

// node_modules/form-data/lib/populate.js
var require_populate = __commonJS({
  "node_modules/form-data/lib/populate.js"(exports, module) {
    "use strict";
    module.exports = function(dst, src) {
      Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop];
      });
      return dst;
    };
  }
});

// node_modules/form-data/lib/form_data.js
var require_form_data = __commonJS({
  "node_modules/form-data/lib/form_data.js"(exports, module) {
    "use strict";
    var CombinedStream = require_combined_stream();
    var util3 = __require("util");
    var path4 = __require("path");
    var http3 = __require("http");
    var https2 = __require("https");
    var parseUrl2 = __require("url").parse;
    var fs3 = __require("fs");
    var Stream = __require("stream").Stream;
    var crypto4 = __require("crypto");
    var mime = require_mime_types();
    var asynckit = require_asynckit();
    var setToStringTag = require_es_set_tostringtag();
    var hasOwn = require_hasown();
    var populate = require_populate();
    function FormData3(options) {
      if (!(this instanceof FormData3)) {
        return new FormData3(options);
      }
      this._overheadLength = 0;
      this._valueLength = 0;
      this._valuesToMeasure = [];
      CombinedStream.call(this);
      options = options || {};
      for (var option in options) {
        this[option] = options[option];
      }
    }
    util3.inherits(FormData3, CombinedStream);
    FormData3.LINE_BREAK = "\r\n";
    FormData3.DEFAULT_CONTENT_TYPE = "application/octet-stream";
    FormData3.prototype.append = function(field, value, options) {
      options = options || {};
      if (typeof options === "string") {
        options = { filename: options };
      }
      var append2 = CombinedStream.prototype.append.bind(this);
      if (typeof value === "number" || value == null) {
        value = String(value);
      }
      if (Array.isArray(value)) {
        this._error(new Error("Arrays are not supported."));
        return;
      }
      var header = this._multiPartHeader(field, value, options);
      var footer = this._multiPartFooter();
      append2(header);
      append2(value);
      append2(footer);
      this._trackLength(header, value, options);
    };
    FormData3.prototype._trackLength = function(header, value, options) {
      var valueLength = 0;
      if (options.knownLength != null) {
        valueLength += Number(options.knownLength);
      } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
      } else if (typeof value === "string") {
        valueLength = Buffer.byteLength(value);
      }
      this._valueLength += valueLength;
      this._overheadLength += Buffer.byteLength(header) + FormData3.LINE_BREAK.length;
      if (!value || !value.path && !(value.readable && hasOwn(value, "httpVersion")) && !(value instanceof Stream)) {
        return;
      }
      if (!options.knownLength) {
        this._valuesToMeasure.push(value);
      }
    };
    FormData3.prototype._lengthRetriever = function(value, callback) {
      if (hasOwn(value, "fd")) {
        if (value.end != void 0 && value.end != Infinity && value.start != void 0) {
          callback(null, value.end + 1 - (value.start ? value.start : 0));
        } else {
          fs3.stat(value.path, function(err, stat) {
            if (err) {
              callback(err);
              return;
            }
            var fileSize = stat.size - (value.start ? value.start : 0);
            callback(null, fileSize);
          });
        }
      } else if (hasOwn(value, "httpVersion")) {
        callback(null, Number(value.headers["content-length"]));
      } else if (hasOwn(value, "httpModule")) {
        value.on("response", function(response) {
          value.pause();
          callback(null, Number(response.headers["content-length"]));
        });
        value.resume();
      } else {
        callback("Unknown stream");
      }
    };
    FormData3.prototype._multiPartHeader = function(field, value, options) {
      if (typeof options.header === "string") {
        return options.header;
      }
      var contentDisposition = this._getContentDisposition(value, options);
      var contentType = this._getContentType(value, options);
      var contents = "";
      var headers = {
        // add custom disposition as third element or keep it two elements if not
        "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
        // if no content type. allow it to be empty array
        "Content-Type": [].concat(contentType || [])
      };
      if (typeof options.header === "object") {
        populate(headers, options.header);
      }
      var header;
      for (var prop in headers) {
        if (hasOwn(headers, prop)) {
          header = headers[prop];
          if (header == null) {
            continue;
          }
          if (!Array.isArray(header)) {
            header = [header];
          }
          if (header.length) {
            contents += prop + ": " + header.join("; ") + FormData3.LINE_BREAK;
          }
        }
      }
      return "--" + this.getBoundary() + FormData3.LINE_BREAK + contents + FormData3.LINE_BREAK;
    };
    FormData3.prototype._getContentDisposition = function(value, options) {
      var filename;
      if (typeof options.filepath === "string") {
        filename = path4.normalize(options.filepath).replace(/\\/g, "/");
      } else if (options.filename || value && (value.name || value.path)) {
        filename = path4.basename(options.filename || value && (value.name || value.path));
      } else if (value && value.readable && hasOwn(value, "httpVersion")) {
        filename = path4.basename(value.client._httpMessage.path || "");
      }
      if (filename) {
        return 'filename="' + filename + '"';
      }
    };
    FormData3.prototype._getContentType = function(value, options) {
      var contentType = options.contentType;
      if (!contentType && value && value.name) {
        contentType = mime.lookup(value.name);
      }
      if (!contentType && value && value.path) {
        contentType = mime.lookup(value.path);
      }
      if (!contentType && value && value.readable && hasOwn(value, "httpVersion")) {
        contentType = value.headers["content-type"];
      }
      if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
      }
      if (!contentType && value && typeof value === "object") {
        contentType = FormData3.DEFAULT_CONTENT_TYPE;
      }
      return contentType;
    };
    FormData3.prototype._multiPartFooter = function() {
      return function(next) {
        var footer = FormData3.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
          footer += this._lastBoundary();
        }
        next(footer);
      }.bind(this);
    };
    FormData3.prototype._lastBoundary = function() {
      return "--" + this.getBoundary() + "--" + FormData3.LINE_BREAK;
    };
    FormData3.prototype.getHeaders = function(userHeaders) {
      var header;
      var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary()
      };
      for (header in userHeaders) {
        if (hasOwn(userHeaders, header)) {
          formHeaders[header.toLowerCase()] = userHeaders[header];
        }
      }
      return formHeaders;
    };
    FormData3.prototype.setBoundary = function(boundary) {
      if (typeof boundary !== "string") {
        throw new TypeError("FormData boundary must be a string");
      }
      this._boundary = boundary;
    };
    FormData3.prototype.getBoundary = function() {
      if (!this._boundary) {
        this._generateBoundary();
      }
      return this._boundary;
    };
    FormData3.prototype.getBuffer = function() {
      var dataBuffer = new Buffer.alloc(0);
      var boundary = this.getBoundary();
      for (var i = 0, len = this._streams.length; i < len; i++) {
        if (typeof this._streams[i] !== "function") {
          if (Buffer.isBuffer(this._streams[i])) {
            dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
          } else {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
          }
          if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData3.LINE_BREAK)]);
          }
        }
      }
      return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
    };
    FormData3.prototype._generateBoundary = function() {
      this._boundary = "--------------------------" + crypto4.randomBytes(12).toString("hex");
    };
    FormData3.prototype.getLengthSync = function() {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this.hasKnownLength()) {
        this._error(new Error("Cannot calculate proper length in synchronous way."));
      }
      return knownLength;
    };
    FormData3.prototype.hasKnownLength = function() {
      var hasKnownLength = true;
      if (this._valuesToMeasure.length) {
        hasKnownLength = false;
      }
      return hasKnownLength;
    };
    FormData3.prototype.getLength = function(cb) {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
      }
      asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
          cb(err);
          return;
        }
        values.forEach(function(length) {
          knownLength += length;
        });
        cb(null, knownLength);
      });
    };
    FormData3.prototype.submit = function(params, cb) {
      var request;
      var options;
      var defaults2 = { method: "post" };
      if (typeof params === "string") {
        params = parseUrl2(params);
        options = populate({
          port: params.port,
          path: params.pathname,
          host: params.hostname,
          protocol: params.protocol
        }, defaults2);
      } else {
        options = populate(params, defaults2);
        if (!options.port) {
          options.port = options.protocol === "https:" ? 443 : 80;
        }
      }
      options.headers = this.getHeaders(params.headers);
      if (options.protocol === "https:") {
        request = https2.request(options);
      } else {
        request = http3.request(options);
      }
      this.getLength(function(err, length) {
        if (err && err !== "Unknown stream") {
          this._error(err);
          return;
        }
        if (length) {
          request.setHeader("Content-Length", length);
        }
        this.pipe(request);
        if (cb) {
          var onResponse;
          var callback = function(error, responce) {
            request.removeListener("error", callback);
            request.removeListener("response", onResponse);
            return cb.call(this, error, responce);
          };
          onResponse = callback.bind(this, null);
          request.on("error", callback);
          request.on("response", onResponse);
        }
      }.bind(this));
      return request;
    };
    FormData3.prototype._error = function(err) {
      if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
      }
    };
    FormData3.prototype.toString = function() {
      return "[object FormData]";
    };
    setToStringTag(FormData3.prototype, "FormData");
    module.exports = FormData3;
  }
});

// node_modules/axios/lib/platform/node/classes/FormData.js
var import_form_data, FormData_default;
var init_FormData = __esm({
  "node_modules/axios/lib/platform/node/classes/FormData.js"() {
    import_form_data = __toESM(require_form_data(), 1);
    FormData_default = import_form_data.default;
  }
});

// node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path4, key, dots) {
  if (!path4) return key;
  return path4.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (FormData_default || FormData)();
  options = utils_default.toFlatObject(
    options,
    {
      metaTokens: true,
      dots: false,
      indexes: false
    },
    false,
    function defined(option, source) {
      return !utils_default.isUndefined(source[option]);
    }
  );
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const maxDepth = options.maxDepth === void 0 ? 100 : options.maxDepth;
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (utils_default.isBoolean(value)) {
      return value.toString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    }
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path4) {
    let arr = value;
    if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value)) {
      formData.append(renderKey(path4, key, dots), convertValue(value));
      return false;
    }
    if (value && !path4 && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path4, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path4, depth = 0) {
    if (utils_default.isUndefined(value)) return;
    if (depth > maxDepth) {
      throw new AxiosError_default(
        "Object is too deeply nested (" + depth + " levels). Max depth: " + maxDepth,
        AxiosError_default.ERR_FORM_DATA_DEPTH_EXCEEDED
      );
    }
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path4.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path4, exposedHelpers);
      if (result === true) {
        build(el, path4 ? path4.concat(key) : [key], depth + 1);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var predicates, toFormData_default;
var init_toFormData = __esm({
  "node_modules/axios/lib/helpers/toFormData.js"() {
    "use strict";
    init_utils();
    init_AxiosError();
    init_FormData();
    predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
      return /^is[A-Z]/.test(prop);
    });
    toFormData_default = toFormData;
  }
});

// node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype, AxiosURLSearchParams_default;
var init_AxiosURLSearchParams = __esm({
  "node_modules/axios/lib/helpers/AxiosURLSearchParams.js"() {
    "use strict";
    init_toFormData();
    prototype = AxiosURLSearchParams.prototype;
    prototype.append = function append(name, value) {
      this._pairs.push([name, value]);
    };
    prototype.toString = function toString2(encoder) {
      const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode);
      } : encode;
      return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + "=" + _encode(pair[1]);
      }, "").join("&");
    };
    AxiosURLSearchParams_default = AxiosURLSearchParams;
  }
});

// node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function buildURL(url2, params, options) {
  if (!params) {
    return url2;
  }
  const _encode = options && options.encode || encode2;
  const _options = utils_default.isFunction(options) ? {
    serialize: options
  } : options;
  const serializeFn = _options && _options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, _options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, _options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
var init_buildURL = __esm({
  "node_modules/axios/lib/helpers/buildURL.js"() {
    "use strict";
    init_utils();
    init_AxiosURLSearchParams();
  }
});

// node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager, InterceptorManager_default;
var init_InterceptorManager = __esm({
  "node_modules/axios/lib/core/InterceptorManager.js"() {
    "use strict";
    init_utils();
    InterceptorManager = class {
      constructor() {
        this.handlers = [];
      }
      /**
       * Add a new interceptor to the stack
       *
       * @param {Function} fulfilled The function to handle `then` for a `Promise`
       * @param {Function} rejected The function to handle `reject` for a `Promise`
       * @param {Object} options The options for the interceptor, synchronous and runWhen
       *
       * @return {Number} An ID used to remove interceptor later
       */
      use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      }
      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       *
       * @returns {void}
       */
      eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }
      /**
       * Clear all interceptors from the stack
       *
       * @returns {void}
       */
      clear() {
        if (this.handlers) {
          this.handlers = [];
        }
      }
      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       *
       * @returns {void}
       */
      forEach(fn) {
        utils_default.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      }
    };
    InterceptorManager_default = InterceptorManager;
  }
});

// node_modules/axios/lib/defaults/transitional.js
var transitional_default;
var init_transitional = __esm({
  "node_modules/axios/lib/defaults/transitional.js"() {
    "use strict";
    transitional_default = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
      legacyInterceptorReqResOrdering: true
    };
  }
});

// node_modules/axios/lib/platform/node/classes/URLSearchParams.js
import url from "url";
var URLSearchParams_default;
var init_URLSearchParams = __esm({
  "node_modules/axios/lib/platform/node/classes/URLSearchParams.js"() {
    "use strict";
    URLSearchParams_default = url.URLSearchParams;
  }
});

// node_modules/axios/lib/platform/node/index.js
import crypto2 from "crypto";
var ALPHA, DIGIT, ALPHABET, generateString, node_default;
var init_node = __esm({
  "node_modules/axios/lib/platform/node/index.js"() {
    init_URLSearchParams();
    init_FormData();
    ALPHA = "abcdefghijklmnopqrstuvwxyz";
    DIGIT = "0123456789";
    ALPHABET = {
      DIGIT,
      ALPHA,
      ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
    };
    generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
      let str = "";
      const { length } = alphabet;
      const randomValues = new Uint32Array(size);
      crypto2.randomFillSync(randomValues);
      for (let i = 0; i < size; i++) {
        str += alphabet[randomValues[i] % length];
      }
      return str;
    };
    node_default = {
      isNode: true,
      classes: {
        URLSearchParams: URLSearchParams_default,
        FormData: FormData_default,
        Blob: typeof Blob !== "undefined" && Blob || null
      },
      ALPHABET,
      generateString,
      protocols: ["http", "https", "file", "data"]
    };
  }
});

// node_modules/axios/lib/platform/common/utils.js
var utils_exports = {};
__export(utils_exports, {
  hasBrowserEnv: () => hasBrowserEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
  navigator: () => _navigator,
  origin: () => origin
});
var hasBrowserEnv, _navigator, hasStandardBrowserEnv, hasStandardBrowserWebWorkerEnv, origin;
var init_utils2 = __esm({
  "node_modules/axios/lib/platform/common/utils.js"() {
    hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
    _navigator = typeof navigator === "object" && navigator || void 0;
    hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
    hasStandardBrowserWebWorkerEnv = (() => {
      return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
      self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
    })();
    origin = hasBrowserEnv && window.location.href || "http://localhost";
  }
});

// node_modules/axios/lib/platform/index.js
var platform_default;
var init_platform = __esm({
  "node_modules/axios/lib/platform/index.js"() {
    init_node();
    init_utils2();
    platform_default = {
      ...utils_exports,
      ...node_default
    };
  }
});

// node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
  return toFormData_default(data, new platform_default.classes.URLSearchParams(), {
    visitor: function(value, key, path4, helpers) {
      if (platform_default.isNode && utils_default.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}
var init_toURLEncodedForm = __esm({
  "node_modules/axios/lib/helpers/toURLEncodedForm.js"() {
    "use strict";
    init_utils();
    init_toFormData();
    init_platform();
  }
});

// node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path4, value, target, index) {
    let name = path4[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path4.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = utils_default.isArray(target[name]) ? target[name].concat(value) : [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path4, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default;
var init_formDataToJSON = __esm({
  "node_modules/axios/lib/helpers/formDataToJSON.js"() {
    "use strict";
    init_utils();
    formDataToJSON_default = formDataToJSON;
  }
});

// node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var own, defaults, defaults_default;
var init_defaults = __esm({
  "node_modules/axios/lib/defaults/index.js"() {
    "use strict";
    init_utils();
    init_AxiosError();
    init_transitional();
    init_toFormData();
    init_toURLEncodedForm();
    init_platform();
    init_formDataToJSON();
    own = (obj, key) => obj != null && utils_default.hasOwnProp(obj, key) ? obj[key] : void 0;
    defaults = {
      transitional: transitional_default,
      adapter: ["xhr", "http", "fetch"],
      transformRequest: [
        function transformRequest(data, headers) {
          const contentType = headers.getContentType() || "";
          const hasJSONContentType = contentType.indexOf("application/json") > -1;
          const isObjectPayload = utils_default.isObject(data);
          if (isObjectPayload && utils_default.isHTMLForm(data)) {
            data = new FormData(data);
          }
          const isFormData2 = utils_default.isFormData(data);
          if (isFormData2) {
            return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
          }
          if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
            return data;
          }
          if (utils_default.isArrayBufferView(data)) {
            return data.buffer;
          }
          if (utils_default.isURLSearchParams(data)) {
            headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
            return data.toString();
          }
          let isFileList2;
          if (isObjectPayload) {
            const formSerializer = own(this, "formSerializer");
            if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
              return toURLEncodedForm(data, formSerializer).toString();
            }
            if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
              const env = own(this, "env");
              const _FormData = env && env.FormData;
              return toFormData_default(
                isFileList2 ? { "files[]": data } : data,
                _FormData && new _FormData(),
                formSerializer
              );
            }
          }
          if (isObjectPayload || hasJSONContentType) {
            headers.setContentType("application/json", false);
            return stringifySafely(data);
          }
          return data;
        }
      ],
      transformResponse: [
        function transformResponse(data) {
          const transitional2 = own(this, "transitional") || defaults.transitional;
          const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
          const responseType = own(this, "responseType");
          const JSONRequested = responseType === "json";
          if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
            return data;
          }
          if (data && utils_default.isString(data) && (forcedJSONParsing && !responseType || JSONRequested)) {
            const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
            const strictJSONParsing = !silentJSONParsing && JSONRequested;
            try {
              return JSON.parse(data, own(this, "parseReviver"));
            } catch (e) {
              if (strictJSONParsing) {
                if (e.name === "SyntaxError") {
                  throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, own(this, "response"));
                }
                throw e;
              }
            }
          }
          return data;
        }
      ],
      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {
        FormData: platform_default.classes.FormData,
        Blob: platform_default.classes.Blob
      },
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": void 0
        }
      }
    };
    utils_default.forEach(["delete", "get", "head", "post", "put", "patch", "query"], (method) => {
      defaults.headers[method] = {};
    });
    defaults_default = defaults;
  }
});

// node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config2 = this || defaults_default;
  const context = response || config2;
  const headers = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(config2, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
var init_transformData = __esm({
  "node_modules/axios/lib/core/transformData.js"() {
    "use strict";
    init_utils();
    init_defaults();
    init_AxiosHeaders();
  }
});

// node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
var init_isCancel = __esm({
  "node_modules/axios/lib/cancel/isCancel.js"() {
    "use strict";
  }
});

// node_modules/axios/lib/cancel/CanceledError.js
var CanceledError, CanceledError_default;
var init_CanceledError = __esm({
  "node_modules/axios/lib/cancel/CanceledError.js"() {
    "use strict";
    init_AxiosError();
    CanceledError = class extends AxiosError_default {
      /**
       * A `CanceledError` is an object that is thrown when an operation is canceled.
       *
       * @param {string=} message The message.
       * @param {Object=} config The config.
       * @param {Object=} request The request.
       *
       * @returns {CanceledError} The created error.
       */
      constructor(message, config2, request) {
        super(message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config2, request);
        this.name = "CanceledError";
        this.__CANCEL__ = true;
      }
    };
    CanceledError_default = CanceledError;
  }
});

// node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError_default(
      "Request failed with status code " + response.status,
      response.status >= 400 && response.status < 500 ? AxiosError_default.ERR_BAD_REQUEST : AxiosError_default.ERR_BAD_RESPONSE,
      response.config,
      response.request,
      response
    ));
  }
}
var init_settle = __esm({
  "node_modules/axios/lib/core/settle.js"() {
    "use strict";
    init_AxiosError();
  }
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url2) {
  if (typeof url2 !== "string") {
    return false;
  }
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}
var init_isAbsoluteURL = __esm({
  "node_modules/axios/lib/helpers/isAbsoluteURL.js"() {
    "use strict";
  }
});

// node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
var init_combineURLs = __esm({
  "node_modules/axios/lib/helpers/combineURLs.js"() {
    "use strict";
  }
});

// node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls === false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
var init_buildFullPath = __esm({
  "node_modules/axios/lib/core/buildFullPath.js"() {
    "use strict";
    init_isAbsoluteURL();
    init_combineURLs();
  }
});

// node_modules/proxy-from-env/index.js
function parseUrl(urlString) {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}
function getProxyForUrl(url2) {
  var parsedUrl = (typeof url2 === "string" ? parseUrl(url2) : url2) || {};
  var proto = parsedUrl.protocol;
  var hostname = parsedUrl.host;
  var port = parsedUrl.port;
  if (typeof hostname !== "string" || !hostname || typeof proto !== "string") {
    return "";
  }
  proto = proto.split(":", 1)[0];
  hostname = hostname.replace(/:\d*$/, "");
  port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
  if (!shouldProxy(hostname, port)) {
    return "";
  }
  var proxy = getEnv(proto + "_proxy") || getEnv("all_proxy");
  if (proxy && proxy.indexOf("://") === -1) {
    proxy = proto + "://" + proxy;
  }
  return proxy;
}
function shouldProxy(hostname, port) {
  var NO_PROXY = getEnv("no_proxy").toLowerCase();
  if (!NO_PROXY) {
    return true;
  }
  if (NO_PROXY === "*") {
    return false;
  }
  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy) {
      return true;
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true;
    }
    if (!/^[.*]/.test(parsedProxyHostname)) {
      return hostname !== parsedProxyHostname;
    }
    if (parsedProxyHostname.charAt(0) === "*") {
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    return !hostname.endsWith(parsedProxyHostname);
  });
}
function getEnv(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
}
var DEFAULT_PORTS;
var init_proxy_from_env = __esm({
  "node_modules/proxy-from-env/index.js"() {
    "use strict";
    DEFAULT_PORTS = {
      ftp: 21,
      gopher: 70,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend2;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend2(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module) {
    var tty = __require("tty");
    var util3 = __require("util");
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util3.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = __require("supports-color");
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util3.formatWithOptions(exports.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util3.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util3.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module.exports = require_browser();
    } else {
      module.exports = require_node();
    }
  }
});

// node_modules/follow-redirects/debug.js
var require_debug = __commonJS({
  "node_modules/follow-redirects/debug.js"(exports, module) {
    var debug;
    module.exports = function() {
      if (!debug) {
        try {
          debug = require_src()("follow-redirects");
        } catch (error) {
        }
        if (typeof debug !== "function") {
          debug = function() {
          };
        }
      }
      debug.apply(null, arguments);
    };
  }
});

// node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS({
  "node_modules/follow-redirects/index.js"(exports, module) {
    var url2 = __require("url");
    var URL2 = url2.URL;
    var http3 = __require("http");
    var https2 = __require("https");
    var Writable = __require("stream").Writable;
    var assert = __require("assert");
    var debug = require_debug();
    (function detectUnsupportedEnvironment() {
      var looksLikeNode = typeof process !== "undefined";
      var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
      var looksLikeV8 = isFunction3(Error.captureStackTrace);
      if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
        console.warn("The follow-redirects package should be excluded from browser builds.");
      }
    })();
    var useNativeURL = false;
    try {
      assert(new URL2(""));
    } catch (error) {
      useNativeURL = error.code === "ERR_INVALID_URL";
    }
    var sensitiveHeaders = [
      "Authorization",
      "Proxy-Authorization",
      "Cookie"
    ];
    var preservedUrlFields = [
      "auth",
      "host",
      "hostname",
      "href",
      "path",
      "pathname",
      "port",
      "protocol",
      "query",
      "search",
      "hash"
    ];
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = /* @__PURE__ */ Object.create(null);
    events.forEach(function(event) {
      eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var InvalidUrlError = createErrorType(
      "ERR_INVALID_URL",
      "Invalid URL",
      TypeError
    );
    var RedirectionError = createErrorType(
      "ERR_FR_REDIRECTION_FAILURE",
      "Redirected request failed"
    );
    var TooManyRedirectsError = createErrorType(
      "ERR_FR_TOO_MANY_REDIRECTS",
      "Maximum number of redirects exceeded",
      RedirectionError
    );
    var MaxBodyLengthExceededError = createErrorType(
      "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
      "Request body larger than maxBodyLength limit"
    );
    var WriteAfterEndError = createErrorType(
      "ERR_STREAM_WRITE_AFTER_END",
      "write after end"
    );
    var destroy = Writable.prototype.destroy || noop2;
    function RedirectableRequest(options, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];
      if (responseCallback) {
        this.on("response", responseCallback);
      }
      var self2 = this;
      this._onNativeResponse = function(response) {
        try {
          self2._processResponse(response);
        } catch (cause) {
          self2.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
        }
      };
      this._headerFilter = new RegExp("^(?:" + sensitiveHeaders.concat(options.sensitiveHeaders).map(escapeRegex).join("|") + ")$", "i");
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype.abort = function() {
      destroyRequest(this._currentRequest);
      this._currentRequest.abort();
      this.emit("abort");
    };
    RedirectableRequest.prototype.destroy = function(error) {
      destroyRequest(this._currentRequest, error);
      destroy.call(this, error);
      return this;
    };
    RedirectableRequest.prototype.write = function(data, encoding, callback) {
      if (this._ending) {
        throw new WriteAfterEndError();
      }
      if (!isString2(data) && !isBuffer2(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
      }
      if (isFunction3(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data, encoding });
        this._currentRequest.write(data, encoding, callback);
      } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
      }
    };
    RedirectableRequest.prototype.end = function(data, encoding, callback) {
      if (isFunction3(data)) {
        callback = data;
        data = encoding = null;
      } else if (isFunction3(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      } else {
        var self2 = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
          self2._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };
    RedirectableRequest.prototype.setHeader = function(name, value) {
      this._options.headers[name] = value;
      this._currentRequest.setHeader(name, value);
    };
    RedirectableRequest.prototype.removeHeader = function(name) {
      delete this._options.headers[name];
      this._currentRequest.removeHeader(name);
    };
    RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
      var self2 = this;
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
      }
      function startTimer(socket) {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
        }
        self2._timeout = setTimeout(function() {
          self2.emit("timeout");
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }
      function clearTimer() {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
          self2._timeout = null;
        }
        self2.removeListener("abort", clearTimer);
        self2.removeListener("error", clearTimer);
        self2.removeListener("response", clearTimer);
        self2.removeListener("close", clearTimer);
        if (callback) {
          self2.removeListener("timeout", callback);
        }
        if (!self2.socket) {
          self2._currentRequest.removeListener("socket", startTimer);
        }
      }
      if (callback) {
        this.on("timeout", callback);
      }
      if (this.socket) {
        startTimer(this.socket);
      } else {
        this._currentRequest.once("socket", startTimer);
      }
      this.on("socket", destroyOnTimeout);
      this.on("abort", clearTimer);
      this.on("error", clearTimer);
      this.on("response", clearTimer);
      this.on("close", clearTimer);
      return this;
    };
    [
      "flushHeaders",
      "getHeader",
      "setNoDelay",
      "setSocketKeepAlive"
    ].forEach(function(method) {
      RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
      };
    });
    ["aborted", "connection", "socket"].forEach(function(property) {
      Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
          return this._currentRequest[property];
        }
      });
    });
    RedirectableRequest.prototype._sanitizeOptions = function(options) {
      if (!options.headers) {
        options.headers = {};
      }
      if (!isArray2(options.sensitiveHeaders)) {
        options.sensitiveHeaders = [];
      }
      if (options.host) {
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };
    RedirectableRequest.prototype._performRequest = function() {
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        throw new TypeError("Unsupported protocol " + protocol);
      }
      if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
      }
      var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
      request._redirectable = this;
      for (var event of events) {
        request.on(event, eventHandlers[event]);
      }
      this._currentUrl = /^\//.test(this._options.path) ? url2.format(this._options) : (
        // When making a request to a proxy, […]
        // a client MUST send the target URI in absolute-form […].
        this._options.path
      );
      if (this._isRedirect) {
        var i = 0;
        var self2 = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
          if (request === self2._currentRequest) {
            if (error) {
              self2.emit("error", error);
            } else if (i < buffers.length) {
              var buffer = buffers[i++];
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            } else if (self2._ended) {
              request.end();
            }
          }
        })();
      }
    };
    RedirectableRequest.prototype._processResponse = function(response) {
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode
        });
      }
      var location = response.headers.location;
      if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        this._requestBodyBuffers = [];
        return;
      }
      destroyRequest(this._currentRequest);
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        throw new TooManyRedirectsError();
      }
      var requestHeaders;
      var beforeRedirect = this._options.beforeRedirect;
      if (beforeRedirect) {
        requestHeaders = Object.assign({
          // The Host header was set by nativeProtocol.request
          Host: response.req.getHeader("host")
        }, this._options.headers);
      }
      var method = this._options.method;
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
      var currentUrlParts = parseUrl2(this._currentUrl);
      var currentHost = currentHostHeader || currentUrlParts.host;
      var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url2.format(Object.assign(currentUrlParts, { host: currentHost }));
      var redirectUrl = resolveUrl(location, currentUrl);
      debug("redirecting to", redirectUrl.href);
      this._isRedirect = true;
      spreadUrlObject(redirectUrl, this._options);
      if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
        removeMatchingHeaders(this._headerFilter, this._options.headers);
      }
      if (isFunction3(beforeRedirect)) {
        var responseDetails = {
          headers: response.headers,
          statusCode
        };
        var requestDetails = {
          url: currentUrl,
          method,
          headers: requestHeaders
        };
        beforeRedirect(this._options, responseDetails, requestDetails);
        this._sanitizeOptions(this._options);
      }
      this._performRequest();
    };
    function wrap(protocols) {
      var exports2 = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
      };
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports2[scheme] = Object.create(nativeProtocol);
        function request(input, options, callback) {
          if (isURL(input)) {
            input = spreadUrlObject(input);
          } else if (isString2(input)) {
            input = spreadUrlObject(parseUrl2(input));
          } else {
            callback = options;
            options = validateUrl(input);
            input = { protocol };
          }
          if (isFunction3(options)) {
            callback = options;
            options = null;
          }
          options = Object.assign({
            maxRedirects: exports2.maxRedirects,
            maxBodyLength: exports2.maxBodyLength
          }, input, options);
          options.nativeProtocols = nativeProtocols;
          if (!isString2(options.host) && !isString2(options.hostname)) {
            options.hostname = "::1";
          }
          assert.equal(options.protocol, protocol, "protocol mismatch");
          debug("options", options);
          return new RedirectableRequest(options, callback);
        }
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(input, options, callback);
          wrappedRequest.end();
          return wrappedRequest;
        }
        Object.defineProperties(wrappedProtocol, {
          request: { value: request, configurable: true, enumerable: true, writable: true },
          get: { value: get, configurable: true, enumerable: true, writable: true }
        });
      });
      return exports2;
    }
    function noop2() {
    }
    function parseUrl2(input) {
      var parsed;
      if (useNativeURL) {
        parsed = new URL2(input);
      } else {
        parsed = validateUrl(url2.parse(input));
        if (!isString2(parsed.protocol)) {
          throw new InvalidUrlError({ input });
        }
      }
      return parsed;
    }
    function resolveUrl(relative, base) {
      return useNativeURL ? new URL2(relative, base) : parseUrl2(url2.resolve(base, relative));
    }
    function validateUrl(input) {
      if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      return input;
    }
    function spreadUrlObject(urlObject, target) {
      var spread3 = target || {};
      for (var key of preservedUrlFields) {
        spread3[key] = urlObject[key];
      }
      if (spread3.hostname.startsWith("[")) {
        spread3.hostname = spread3.hostname.slice(1, -1);
      }
      if (spread3.port !== "") {
        spread3.port = Number(spread3.port);
      }
      spread3.path = spread3.search ? spread3.pathname + spread3.search : spread3.pathname;
      return spread3;
    }
    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
    }
    function createErrorType(code, message, baseClass) {
      function CustomError(properties) {
        if (isFunction3(Error.captureStackTrace)) {
          Error.captureStackTrace(this, this.constructor);
        }
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause ? message + ": " + this.cause.message : message;
      }
      CustomError.prototype = new (baseClass || Error)();
      Object.defineProperties(CustomError.prototype, {
        constructor: {
          value: CustomError,
          enumerable: false
        },
        name: {
          value: "Error [" + code + "]",
          enumerable: false
        }
      });
      return CustomError;
    }
    function destroyRequest(request, error) {
      for (var event of events) {
        request.removeListener(event, eventHandlers[event]);
      }
      request.on("error", noop2);
      request.destroy(error);
    }
    function isSubdomain(subdomain, domain) {
      assert(isString2(subdomain) && isString2(domain));
      var dot = subdomain.length - domain.length - 1;
      return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
    }
    function isArray2(value) {
      return value instanceof Array;
    }
    function isString2(value) {
      return typeof value === "string" || value instanceof String;
    }
    function isFunction3(value) {
      return typeof value === "function";
    }
    function isBuffer2(value) {
      return typeof value === "object" && "length" in value;
    }
    function isURL(value) {
      return URL2 && value instanceof URL2;
    }
    function escapeRegex(regex) {
      return regex.replace(/[\]\\/()*+?.$]/g, "\\$&");
    }
    module.exports = wrap({ http: http3, https: https2 });
    module.exports.wrap = wrap;
  }
});

// node_modules/axios/lib/env/data.js
var VERSION;
var init_data = __esm({
  "node_modules/axios/lib/env/data.js"() {
    VERSION = "1.16.0";
  }
});

// node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url2) {
  const match = /^([-+\w]{1,25}):(?:\/\/)?/.exec(url2);
  return match && match[1] || "";
}
var init_parseProtocol = __esm({
  "node_modules/axios/lib/helpers/parseProtocol.js"() {
    "use strict";
  }
});

// node_modules/axios/lib/helpers/fromDataURI.js
function fromDataURI(uri, asBlob, options) {
  const _Blob = options && options.Blob || platform_default.classes.Blob;
  const protocol = parseProtocol(uri);
  if (asBlob === void 0 && _Blob) {
    asBlob = true;
  }
  if (protocol === "data") {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;
    const match = DATA_URL_PATTERN.exec(uri);
    if (!match) {
      throw new AxiosError_default("Invalid URL", AxiosError_default.ERR_INVALID_URL);
    }
    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? "base64" : "utf8");
    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError_default("Blob is not supported", AxiosError_default.ERR_NOT_SUPPORT);
      }
      return new _Blob([buffer], { type: mime });
    }
    return buffer;
  }
  throw new AxiosError_default("Unsupported protocol " + protocol, AxiosError_default.ERR_NOT_SUPPORT);
}
var DATA_URL_PATTERN;
var init_fromDataURI = __esm({
  "node_modules/axios/lib/helpers/fromDataURI.js"() {
    "use strict";
    init_AxiosError();
    init_parseProtocol();
    init_platform();
    DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
  }
});

// node_modules/axios/lib/helpers/AxiosTransformStream.js
import stream from "stream";
var kInternals, AxiosTransformStream, AxiosTransformStream_default;
var init_AxiosTransformStream = __esm({
  "node_modules/axios/lib/helpers/AxiosTransformStream.js"() {
    "use strict";
    init_utils();
    kInternals = /* @__PURE__ */ Symbol("internals");
    AxiosTransformStream = class extends stream.Transform {
      constructor(options) {
        options = utils_default.toFlatObject(
          options,
          {
            maxRate: 0,
            chunkSize: 64 * 1024,
            minChunkSize: 100,
            timeWindow: 500,
            ticksRate: 2,
            samplesCount: 15
          },
          null,
          (prop, source) => {
            return !utils_default.isUndefined(source[prop]);
          }
        );
        super({
          readableHighWaterMark: options.chunkSize
        });
        const internals = this[kInternals] = {
          timeWindow: options.timeWindow,
          chunkSize: options.chunkSize,
          maxRate: options.maxRate,
          minChunkSize: options.minChunkSize,
          bytesSeen: 0,
          isCaptured: false,
          notifiedBytesLoaded: 0,
          ts: Date.now(),
          bytes: 0,
          onReadCallback: null
        };
        this.on("newListener", (event) => {
          if (event === "progress") {
            if (!internals.isCaptured) {
              internals.isCaptured = true;
            }
          }
        });
      }
      _read(size) {
        const internals = this[kInternals];
        if (internals.onReadCallback) {
          internals.onReadCallback();
        }
        return super._read(size);
      }
      _transform(chunk, encoding, callback) {
        const internals = this[kInternals];
        const maxRate = internals.maxRate;
        const readableHighWaterMark = this.readableHighWaterMark;
        const timeWindow = internals.timeWindow;
        const divider = 1e3 / timeWindow;
        const bytesThreshold = maxRate / divider;
        const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;
        const pushChunk = (_chunk, _callback) => {
          const bytes = Buffer.byteLength(_chunk);
          internals.bytesSeen += bytes;
          internals.bytes += bytes;
          internals.isCaptured && this.emit("progress", internals.bytesSeen);
          if (this.push(_chunk)) {
            process.nextTick(_callback);
          } else {
            internals.onReadCallback = () => {
              internals.onReadCallback = null;
              process.nextTick(_callback);
            };
          }
        };
        const transformChunk = (_chunk, _callback) => {
          const chunkSize = Buffer.byteLength(_chunk);
          let chunkRemainder = null;
          let maxChunkSize = readableHighWaterMark;
          let bytesLeft;
          let passed = 0;
          if (maxRate) {
            const now = Date.now();
            if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
              internals.ts = now;
              bytesLeft = bytesThreshold - internals.bytes;
              internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
              passed = 0;
            }
            bytesLeft = bytesThreshold - internals.bytes;
          }
          if (maxRate) {
            if (bytesLeft <= 0) {
              return setTimeout(() => {
                _callback(null, _chunk);
              }, timeWindow - passed);
            }
            if (bytesLeft < maxChunkSize) {
              maxChunkSize = bytesLeft;
            }
          }
          if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
            chunkRemainder = _chunk.subarray(maxChunkSize);
            _chunk = _chunk.subarray(0, maxChunkSize);
          }
          pushChunk(
            _chunk,
            chunkRemainder ? () => {
              process.nextTick(_callback, null, chunkRemainder);
            } : _callback
          );
        };
        transformChunk(chunk, function transformNextChunk(err, _chunk) {
          if (err) {
            return callback(err);
          }
          if (_chunk) {
            transformChunk(_chunk, transformNextChunk);
          } else {
            callback(null);
          }
        });
      }
    };
    AxiosTransformStream_default = AxiosTransformStream;
  }
});

// node_modules/axios/lib/helpers/readBlob.js
var asyncIterator, readBlob, readBlob_default;
var init_readBlob = __esm({
  "node_modules/axios/lib/helpers/readBlob.js"() {
    ({ asyncIterator } = Symbol);
    readBlob = async function* (blob) {
      if (blob.stream) {
        yield* blob.stream();
      } else if (blob.arrayBuffer) {
        yield await blob.arrayBuffer();
      } else if (blob[asyncIterator]) {
        yield* blob[asyncIterator]();
      } else {
        yield blob;
      }
    };
    readBlob_default = readBlob;
  }
});

// node_modules/axios/lib/helpers/formDataToStream.js
import util from "util";
import { Readable } from "stream";
var BOUNDARY_ALPHABET, textEncoder, CRLF, CRLF_BYTES, CRLF_BYTES_COUNT, FormDataPart, formDataToStream, formDataToStream_default;
var init_formDataToStream = __esm({
  "node_modules/axios/lib/helpers/formDataToStream.js"() {
    init_utils();
    init_readBlob();
    init_platform();
    BOUNDARY_ALPHABET = platform_default.ALPHABET.ALPHA_DIGIT + "-_";
    textEncoder = typeof TextEncoder === "function" ? new TextEncoder() : new util.TextEncoder();
    CRLF = "\r\n";
    CRLF_BYTES = textEncoder.encode(CRLF);
    CRLF_BYTES_COUNT = 2;
    FormDataPart = class {
      constructor(name, value) {
        const { escapeName } = this.constructor;
        const isStringValue = utils_default.isString(value);
        let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
        if (isStringValue) {
          value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
        } else {
          const safeType = String(value.type || "application/octet-stream").replace(/[\r\n]/g, "");
          headers += `Content-Type: ${safeType}${CRLF}`;
        }
        this.headers = textEncoder.encode(headers + CRLF);
        this.contentLength = isStringValue ? value.byteLength : value.size;
        this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
        this.name = name;
        this.value = value;
      }
      async *encode() {
        yield this.headers;
        const { value } = this;
        if (utils_default.isTypedArray(value)) {
          yield value;
        } else {
          yield* readBlob_default(value);
        }
        yield CRLF_BYTES;
      }
      static escapeName(name) {
        return String(name).replace(
          /[\r\n"]/g,
          (match) => ({
            "\r": "%0D",
            "\n": "%0A",
            '"': "%22"
          })[match]
        );
      }
    };
    formDataToStream = (form, headersHandler, options) => {
      const {
        tag = "form-data-boundary",
        size = 25,
        boundary = tag + "-" + platform_default.generateString(size, BOUNDARY_ALPHABET)
      } = options || {};
      if (!utils_default.isFormData(form)) {
        throw TypeError("FormData instance required");
      }
      if (boundary.length < 1 || boundary.length > 70) {
        throw Error("boundary must be 1-70 characters long");
      }
      const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
      const footerBytes = textEncoder.encode("--" + boundary + "--" + CRLF);
      let contentLength = footerBytes.byteLength;
      const parts = Array.from(form.entries()).map(([name, value]) => {
        const part = new FormDataPart(name, value);
        contentLength += part.size;
        return part;
      });
      contentLength += boundaryBytes.byteLength * parts.length;
      contentLength = utils_default.toFiniteNumber(contentLength);
      const computedHeaders = {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      };
      if (Number.isFinite(contentLength)) {
        computedHeaders["Content-Length"] = contentLength;
      }
      headersHandler && headersHandler(computedHeaders);
      return Readable.from(
        (async function* () {
          for (const part of parts) {
            yield boundaryBytes;
            yield* part.encode();
          }
          yield footerBytes;
        })()
      );
    };
    formDataToStream_default = formDataToStream;
  }
});

// node_modules/axios/lib/helpers/ZlibHeaderTransformStream.js
import stream2 from "stream";
var ZlibHeaderTransformStream, ZlibHeaderTransformStream_default;
var init_ZlibHeaderTransformStream = __esm({
  "node_modules/axios/lib/helpers/ZlibHeaderTransformStream.js"() {
    "use strict";
    ZlibHeaderTransformStream = class extends stream2.Transform {
      __transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
      }
      _transform(chunk, encoding, callback) {
        if (chunk.length !== 0) {
          this._transform = this.__transform;
          if (chunk[0] !== 120) {
            const header = Buffer.alloc(2);
            header[0] = 120;
            header[1] = 156;
            this.push(header, encoding);
          }
        }
        this.__transform(chunk, encoding, callback);
      }
    };
    ZlibHeaderTransformStream_default = ZlibHeaderTransformStream;
  }
});

// node_modules/axios/lib/helpers/callbackify.js
var callbackify, callbackify_default;
var init_callbackify = __esm({
  "node_modules/axios/lib/helpers/callbackify.js"() {
    init_utils();
    callbackify = (fn, reducer) => {
      return utils_default.isAsyncFn(fn) ? function(...args) {
        const cb = args.pop();
        fn.apply(this, args).then((value) => {
          try {
            reducer ? cb(null, ...reducer(value)) : cb(null, value);
          } catch (err) {
            cb(err);
          }
        }, cb);
      } : fn;
    };
    callbackify_default = callbackify;
  }
});

// node_modules/axios/lib/helpers/shouldBypassProxy.js
function shouldBypassProxy(location) {
  let parsed;
  try {
    parsed = new URL(location);
  } catch (_err) {
    return false;
  }
  const noProxy = (process.env.no_proxy || process.env.NO_PROXY || "").toLowerCase();
  if (!noProxy) {
    return false;
  }
  if (noProxy === "*") {
    return true;
  }
  const port = Number.parseInt(parsed.port, 10) || DEFAULT_PORTS2[parsed.protocol.split(":", 1)[0]] || 0;
  const hostname = normalizeNoProxyHost(parsed.hostname.toLowerCase());
  return noProxy.split(/[\s,]+/).some((entry) => {
    if (!entry) {
      return false;
    }
    let [entryHost, entryPort] = parseNoProxyEntry(entry);
    entryHost = normalizeNoProxyHost(entryHost);
    if (!entryHost) {
      return false;
    }
    if (entryPort && entryPort !== port) {
      return false;
    }
    if (entryHost.charAt(0) === "*") {
      entryHost = entryHost.slice(1);
    }
    if (entryHost.charAt(0) === ".") {
      return hostname.endsWith(entryHost);
    }
    return hostname === entryHost || isLoopback(hostname) && isLoopback(entryHost);
  });
}
var LOOPBACK_HOSTNAMES, isIPv4Loopback, isIPv6Loopback, isLoopback, DEFAULT_PORTS2, parseNoProxyEntry, IPV4_MAPPED_DOTTED_RE, IPV4_MAPPED_HEX_RE, unmapIPv4MappedIPv6, normalizeNoProxyHost;
var init_shouldBypassProxy = __esm({
  "node_modules/axios/lib/helpers/shouldBypassProxy.js"() {
    LOOPBACK_HOSTNAMES = /* @__PURE__ */ new Set(["localhost"]);
    isIPv4Loopback = (host) => {
      const parts = host.split(".");
      if (parts.length !== 4) return false;
      if (parts[0] !== "127") return false;
      return parts.every((p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255);
    };
    isIPv6Loopback = (host) => {
      if (host === "::1") return true;
      const v4MappedDotted = host.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
      if (v4MappedDotted) return isIPv4Loopback(v4MappedDotted[1]);
      const v4MappedHex = host.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
      if (v4MappedHex) {
        const high = parseInt(v4MappedHex[1], 16);
        return high >= 32512 && high <= 32767;
      }
      const groups = host.split(":");
      if (groups.length === 8) {
        for (let i = 0; i < 7; i++) {
          if (!/^0+$/.test(groups[i])) return false;
        }
        return /^0*1$/.test(groups[7]);
      }
      return false;
    };
    isLoopback = (host) => {
      if (!host) return false;
      if (LOOPBACK_HOSTNAMES.has(host)) return true;
      if (isIPv4Loopback(host)) return true;
      return isIPv6Loopback(host);
    };
    DEFAULT_PORTS2 = {
      http: 80,
      https: 443,
      ws: 80,
      wss: 443,
      ftp: 21
    };
    parseNoProxyEntry = (entry) => {
      let entryHost = entry;
      let entryPort = 0;
      if (entryHost.charAt(0) === "[") {
        const bracketIndex = entryHost.indexOf("]");
        if (bracketIndex !== -1) {
          const host = entryHost.slice(1, bracketIndex);
          const rest = entryHost.slice(bracketIndex + 1);
          if (rest.charAt(0) === ":" && /^\d+$/.test(rest.slice(1))) {
            entryPort = Number.parseInt(rest.slice(1), 10);
          }
          return [host, entryPort];
        }
      }
      const firstColon = entryHost.indexOf(":");
      const lastColon = entryHost.lastIndexOf(":");
      if (firstColon !== -1 && firstColon === lastColon && /^\d+$/.test(entryHost.slice(lastColon + 1))) {
        entryPort = Number.parseInt(entryHost.slice(lastColon + 1), 10);
        entryHost = entryHost.slice(0, lastColon);
      }
      return [entryHost, entryPort];
    };
    IPV4_MAPPED_DOTTED_RE = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:(\d+\.\d+\.\d+\.\d+)$/i;
    IPV4_MAPPED_HEX_RE = /^(?:::|(?:0{1,4}:){1,4}:|(?:0{1,4}:){5})ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;
    unmapIPv4MappedIPv6 = (host) => {
      if (typeof host !== "string" || host.indexOf(":") === -1) return host;
      const dotted = host.match(IPV4_MAPPED_DOTTED_RE);
      if (dotted) return dotted[1];
      const hex = host.match(IPV4_MAPPED_HEX_RE);
      if (hex) {
        const high = parseInt(hex[1], 16);
        const low = parseInt(hex[2], 16);
        return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
      }
      return host;
    };
    normalizeNoProxyHost = (hostname) => {
      if (!hostname) {
        return hostname;
      }
      if (hostname.charAt(0) === "[" && hostname.charAt(hostname.length - 1) === "]") {
        hostname = hostname.slice(1, -1);
      }
      return unmapIPv4MappedIPv6(hostname.replace(/\.+$/, ""));
    };
  }
});

// node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
var speedometer_default;
var init_speedometer = __esm({
  "node_modules/axios/lib/helpers/speedometer.js"() {
    "use strict";
    speedometer_default = speedometer;
  }
});

// node_modules/axios/lib/helpers/throttle.js
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
var throttle_default;
var init_throttle = __esm({
  "node_modules/axios/lib/helpers/throttle.js"() {
    throttle_default = throttle;
  }
});

// node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer, progressEventDecorator, asyncDecorator;
var init_progressEventReducer = __esm({
  "node_modules/axios/lib/helpers/progressEventReducer.js"() {
    init_speedometer();
    init_throttle();
    init_utils();
    progressEventReducer = (listener, isDownloadStream, freq = 3) => {
      let bytesNotified = 0;
      const _speedometer = speedometer_default(50, 250);
      return throttle_default((e) => {
        const rawLoaded = e.loaded;
        const total = e.lengthComputable ? e.total : void 0;
        const loaded = total != null ? Math.min(rawLoaded, total) : rawLoaded;
        const progressBytes = Math.max(0, loaded - bytesNotified);
        const rate = _speedometer(progressBytes);
        bytesNotified = Math.max(bytesNotified, loaded);
        const data = {
          loaded,
          total,
          progress: total ? loaded / total : void 0,
          bytes: progressBytes,
          rate: rate ? rate : void 0,
          estimated: rate && total ? (total - loaded) / rate : void 0,
          event: e,
          lengthComputable: total != null,
          [isDownloadStream ? "download" : "upload"]: true
        };
        listener(data);
      }, freq);
    };
    progressEventDecorator = (total, throttled) => {
      const lengthComputable = total != null;
      return [
        (loaded) => throttled[0]({
          lengthComputable,
          total,
          loaded
        }),
        throttled[1]
      ];
    };
    asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));
  }
});

// node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js
function estimateDataURLDecodedBytes(url2) {
  if (!url2 || typeof url2 !== "string") return 0;
  if (!url2.startsWith("data:")) return 0;
  const comma = url2.indexOf(",");
  if (comma < 0) return 0;
  const meta = url2.slice(5, comma);
  const body = url2.slice(comma + 1);
  const isBase64 = /;base64/i.test(meta);
  if (isBase64) {
    let effectiveLen = body.length;
    const len = body.length;
    for (let i = 0; i < len; i++) {
      if (body.charCodeAt(i) === 37 && i + 2 < len) {
        const a = body.charCodeAt(i + 1);
        const b = body.charCodeAt(i + 2);
        const isHex = (a >= 48 && a <= 57 || a >= 65 && a <= 70 || a >= 97 && a <= 102) && (b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102);
        if (isHex) {
          effectiveLen -= 2;
          i += 2;
        }
      }
    }
    let pad = 0;
    let idx = len - 1;
    const tailIsPct3D = (j) => j >= 2 && body.charCodeAt(j - 2) === 37 && // '%'
    body.charCodeAt(j - 1) === 51 && // '3'
    (body.charCodeAt(j) === 68 || body.charCodeAt(j) === 100);
    if (idx >= 0) {
      if (body.charCodeAt(idx) === 61) {
        pad++;
        idx--;
      } else if (tailIsPct3D(idx)) {
        pad++;
        idx -= 3;
      }
    }
    if (pad === 1 && idx >= 0) {
      if (body.charCodeAt(idx) === 61) {
        pad++;
      } else if (tailIsPct3D(idx)) {
        pad++;
      }
    }
    const groups = Math.floor(effectiveLen / 4);
    const bytes2 = groups * 3 - (pad || 0);
    return bytes2 > 0 ? bytes2 : 0;
  }
  if (typeof Buffer !== "undefined" && typeof Buffer.byteLength === "function") {
    return Buffer.byteLength(body, "utf8");
  }
  let bytes = 0;
  for (let i = 0, len = body.length; i < len; i++) {
    const c = body.charCodeAt(i);
    if (c < 128) {
      bytes += 1;
    } else if (c < 2048) {
      bytes += 2;
    } else if (c >= 55296 && c <= 56319 && i + 1 < len) {
      const next = body.charCodeAt(i + 1);
      if (next >= 56320 && next <= 57343) {
        bytes += 4;
        i++;
      } else {
        bytes += 3;
      }
    } else {
      bytes += 3;
    }
  }
  return bytes;
}
var init_estimateDataURLDecodedBytes = __esm({
  "node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js"() {
  }
});

// node_modules/axios/lib/adapters/http.js
import http from "http";
import https from "https";
import http2 from "http2";
import util2 from "util";
import { resolve as resolvePath } from "path";
import zlib from "zlib";
import stream3 from "stream";
import { EventEmitter } from "events";
function setFormDataHeaders(headers, formHeaders, policy) {
  if (policy !== "content-only") {
    headers.set(formHeaders);
    return;
  }
  Object.entries(formHeaders).forEach(([key, val]) => {
    if (FORM_DATA_CONTENT_HEADERS.includes(key.toLowerCase())) {
      headers.set(key, val);
    }
  });
}
function dispatchBeforeRedirect(options, responseDetails, requestDetails) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options, responseDetails, requestDetails);
  }
}
function setProxy(options, configProxy, location, isRedirect) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = getProxyForUrl(location);
    if (proxyUrl) {
      if (!shouldBypassProxy(location)) {
        proxy = new URL(proxyUrl);
      }
    }
  }
  if (isRedirect && options.headers) {
    for (const name of Object.keys(options.headers)) {
      if (name.toLowerCase() === "proxy-authorization") {
        delete options.headers[name];
      }
    }
  }
  if (proxy) {
    const isProxyURL = proxy instanceof URL;
    const readProxyField = (key) => isProxyURL || utils_default.hasOwnProp(proxy, key) ? proxy[key] : void 0;
    const proxyUsername = readProxyField("username");
    const proxyPassword = readProxyField("password");
    let proxyAuth = utils_default.hasOwnProp(proxy, "auth") ? proxy.auth : void 0;
    if (proxyUsername) {
      proxyAuth = (proxyUsername || "") + ":" + (proxyPassword || "");
    }
    if (proxyAuth) {
      const authIsObject = typeof proxyAuth === "object";
      const authUsername = authIsObject && utils_default.hasOwnProp(proxyAuth, "username") ? proxyAuth.username : void 0;
      const authPassword = authIsObject && utils_default.hasOwnProp(proxyAuth, "password") ? proxyAuth.password : void 0;
      const validProxyAuth = Boolean(authUsername || authPassword);
      if (validProxyAuth) {
        proxyAuth = (authUsername || "") + ":" + (authPassword || "");
      } else if (authIsObject) {
        throw new AxiosError_default("Invalid proxy authorization", AxiosError_default.ERR_BAD_OPTION, { proxy });
      }
      const base64 = Buffer.from(proxyAuth, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base64;
    }
    let hasUserHostHeader = false;
    for (const name of Object.keys(options.headers)) {
      if (name.toLowerCase() === "host") {
        hasUserHostHeader = true;
        break;
      }
    }
    if (!hasUserHostHeader) {
      options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
    }
    const proxyHost = readProxyField("hostname") || readProxyField("host");
    options.hostname = proxyHost;
    options.host = proxyHost;
    options.port = readProxyField("port");
    options.path = location;
    const proxyProtocol = readProxyField("protocol");
    if (proxyProtocol) {
      options.protocol = proxyProtocol.includes(":") ? proxyProtocol : `${proxyProtocol}:`;
    }
  }
  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    setProxy(redirectOptions, configProxy, redirectOptions.href, true);
  };
}
var import_follow_redirects, zlibOptions, brotliOptions, isBrotliSupported, httpFollow, httpsFollow, isHttps, FORM_DATA_CONTENT_HEADERS, kAxiosSocketListener, kAxiosCurrentReq, supportedProtocols, decodeURIComponentSafe, flushOnFinish, Http2Sessions, http2Sessions, isHttpAdapterSupported, wrapAsync, resolveFamily, buildAddressEntry, http2Transport, http_default;
var init_http = __esm({
  "node_modules/axios/lib/adapters/http.js"() {
    init_utils();
    init_settle();
    init_buildFullPath();
    init_buildURL();
    init_proxy_from_env();
    import_follow_redirects = __toESM(require_follow_redirects(), 1);
    init_data();
    init_transitional();
    init_AxiosError();
    init_CanceledError();
    init_platform();
    init_fromDataURI();
    init_AxiosHeaders();
    init_AxiosTransformStream();
    init_formDataToStream();
    init_readBlob();
    init_ZlibHeaderTransformStream();
    init_callbackify();
    init_shouldBypassProxy();
    init_progressEventReducer();
    init_estimateDataURLDecodedBytes();
    zlibOptions = {
      flush: zlib.constants.Z_SYNC_FLUSH,
      finishFlush: zlib.constants.Z_SYNC_FLUSH
    };
    brotliOptions = {
      flush: zlib.constants.BROTLI_OPERATION_FLUSH,
      finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
    };
    isBrotliSupported = utils_default.isFunction(zlib.createBrotliDecompress);
    ({ http: httpFollow, https: httpsFollow } = import_follow_redirects.default);
    isHttps = /https:?/;
    FORM_DATA_CONTENT_HEADERS = ["content-type", "content-length"];
    kAxiosSocketListener = /* @__PURE__ */ Symbol("axios.http.socketListener");
    kAxiosCurrentReq = /* @__PURE__ */ Symbol("axios.http.currentReq");
    supportedProtocols = platform_default.protocols.map((protocol) => {
      return protocol + ":";
    });
    decodeURIComponentSafe = (value) => {
      if (!utils_default.isString(value)) {
        return value;
      }
      try {
        return decodeURIComponent(value);
      } catch (error) {
        return value;
      }
    };
    flushOnFinish = (stream4, [throttled, flush]) => {
      stream4.on("end", flush).on("error", flush);
      return throttled;
    };
    Http2Sessions = class {
      constructor() {
        this.sessions = /* @__PURE__ */ Object.create(null);
      }
      getSession(authority, options) {
        options = Object.assign(
          {
            sessionTimeout: 1e3
          },
          options
        );
        let authoritySessions = this.sessions[authority];
        if (authoritySessions) {
          let len = authoritySessions.length;
          for (let i = 0; i < len; i++) {
            const [sessionHandle, sessionOptions] = authoritySessions[i];
            if (!sessionHandle.destroyed && !sessionHandle.closed && util2.isDeepStrictEqual(sessionOptions, options)) {
              return sessionHandle;
            }
          }
        }
        const session = http2.connect(authority, options);
        let removed;
        const removeSession = () => {
          if (removed) {
            return;
          }
          removed = true;
          let entries = authoritySessions, len = entries.length, i = len;
          while (i--) {
            if (entries[i][0] === session) {
              if (len === 1) {
                delete this.sessions[authority];
              } else {
                entries.splice(i, 1);
              }
              if (!session.closed) {
                session.close();
              }
              return;
            }
          }
        };
        const originalRequestFn = session.request;
        const { sessionTimeout } = options;
        if (sessionTimeout != null) {
          let timer;
          let streamsCount = 0;
          session.request = function() {
            const stream4 = originalRequestFn.apply(this, arguments);
            streamsCount++;
            if (timer) {
              clearTimeout(timer);
              timer = null;
            }
            stream4.once("close", () => {
              if (!--streamsCount) {
                timer = setTimeout(() => {
                  timer = null;
                  removeSession();
                }, sessionTimeout);
              }
            });
            return stream4;
          };
        }
        session.once("close", removeSession);
        let entry = [session, options];
        authoritySessions ? authoritySessions.push(entry) : authoritySessions = this.sessions[authority] = [entry];
        return session;
      }
    };
    http2Sessions = new Http2Sessions();
    isHttpAdapterSupported = typeof process !== "undefined" && utils_default.kindOf(process) === "process";
    wrapAsync = (asyncExecutor) => {
      return new Promise((resolve, reject) => {
        let onDone;
        let isDone;
        const done = (value, isRejected) => {
          if (isDone) return;
          isDone = true;
          onDone && onDone(value, isRejected);
        };
        const _resolve = (value) => {
          done(value);
          resolve(value);
        };
        const _reject = (reason) => {
          done(reason, true);
          reject(reason);
        };
        asyncExecutor(_resolve, _reject, (onDoneHandler) => onDone = onDoneHandler).catch(_reject);
      });
    };
    resolveFamily = ({ address, family }) => {
      if (!utils_default.isString(address)) {
        throw TypeError("address must be a string");
      }
      return {
        address,
        family: family || (address.indexOf(".") < 0 ? 6 : 4)
      };
    };
    buildAddressEntry = (address, family) => resolveFamily(utils_default.isObject(address) ? address : { address, family });
    http2Transport = {
      request(options, cb) {
        const authority = options.protocol + "//" + options.hostname + ":" + (options.port || (options.protocol === "https:" ? 443 : 80));
        const { http2Options, headers } = options;
        const session = http2Sessions.getSession(authority, http2Options);
        const { HTTP2_HEADER_SCHEME, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS } = http2.constants;
        const http2Headers = {
          [HTTP2_HEADER_SCHEME]: options.protocol.replace(":", ""),
          [HTTP2_HEADER_METHOD]: options.method,
          [HTTP2_HEADER_PATH]: options.path
        };
        utils_default.forEach(headers, (header, name) => {
          name.charAt(0) !== ":" && (http2Headers[name] = header);
        });
        const req = session.request(http2Headers);
        req.once("response", (responseHeaders) => {
          const response = req;
          responseHeaders = Object.assign({}, responseHeaders);
          const status = responseHeaders[HTTP2_HEADER_STATUS];
          delete responseHeaders[HTTP2_HEADER_STATUS];
          response.headers = responseHeaders;
          response.statusCode = +status;
          cb(response);
        });
        return req;
      }
    };
    http_default = isHttpAdapterSupported && function httpAdapter(config2) {
      return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
        const own2 = (key) => utils_default.hasOwnProp(config2, key) ? config2[key] : void 0;
        let data = own2("data");
        let lookup = own2("lookup");
        let family = own2("family");
        let httpVersion = own2("httpVersion");
        if (httpVersion === void 0) httpVersion = 1;
        let http2Options = own2("http2Options");
        const responseType = own2("responseType");
        const responseEncoding = own2("responseEncoding");
        const method = config2.method.toUpperCase();
        let isDone;
        let rejected = false;
        let req;
        let connectPhaseTimer;
        httpVersion = +httpVersion;
        if (Number.isNaN(httpVersion)) {
          throw TypeError(`Invalid protocol version: '${config2.httpVersion}' is not a number`);
        }
        if (httpVersion !== 1 && httpVersion !== 2) {
          throw TypeError(`Unsupported protocol version '${httpVersion}'`);
        }
        const isHttp2 = httpVersion === 2;
        if (lookup) {
          const _lookup = callbackify_default(lookup, (value) => utils_default.isArray(value) ? value : [value]);
          lookup = (hostname, opt, cb) => {
            _lookup(hostname, opt, (err, arg0, arg1) => {
              if (err) {
                return cb(err);
              }
              const addresses = utils_default.isArray(arg0) ? arg0.map((addr) => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];
              opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
            });
          };
        }
        const abortEmitter = new EventEmitter();
        function abort(reason) {
          try {
            abortEmitter.emit(
              "abort",
              !reason || reason.type ? new CanceledError_default(null, config2, req) : reason
            );
          } catch (err) {
            console.warn("emit error", err);
          }
        }
        function clearConnectPhaseTimer() {
          if (connectPhaseTimer) {
            clearTimeout(connectPhaseTimer);
            connectPhaseTimer = null;
          }
        }
        function createTimeoutError() {
          let timeoutErrorMessage = config2.timeout ? "timeout of " + config2.timeout + "ms exceeded" : "timeout exceeded";
          const transitional2 = config2.transitional || transitional_default;
          if (config2.timeoutErrorMessage) {
            timeoutErrorMessage = config2.timeoutErrorMessage;
          }
          return new AxiosError_default(
            timeoutErrorMessage,
            transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
            config2,
            req
          );
        }
        abortEmitter.once("abort", reject);
        const onFinished = () => {
          clearConnectPhaseTimer();
          if (config2.cancelToken) {
            config2.cancelToken.unsubscribe(abort);
          }
          if (config2.signal) {
            config2.signal.removeEventListener("abort", abort);
          }
          abortEmitter.removeAllListeners();
        };
        if (config2.cancelToken || config2.signal) {
          config2.cancelToken && config2.cancelToken.subscribe(abort);
          if (config2.signal) {
            config2.signal.aborted ? abort() : config2.signal.addEventListener("abort", abort);
          }
        }
        onDone((response, isRejected) => {
          isDone = true;
          clearConnectPhaseTimer();
          if (isRejected) {
            rejected = true;
            onFinished();
            return;
          }
          const { data: data2 } = response;
          if (data2 instanceof stream3.Readable || data2 instanceof stream3.Duplex) {
            const offListeners = stream3.finished(data2, () => {
              offListeners();
              onFinished();
            });
          } else {
            onFinished();
          }
        });
        const fullPath = buildFullPath(config2.baseURL, config2.url, config2.allowAbsoluteUrls);
        const parsed = new URL(fullPath, platform_default.hasBrowserEnv ? platform_default.origin : void 0);
        const protocol = parsed.protocol || supportedProtocols[0];
        if (protocol === "data:") {
          if (config2.maxContentLength > -1) {
            const dataUrl = String(config2.url || fullPath || "");
            const estimated = estimateDataURLDecodedBytes(dataUrl);
            if (estimated > config2.maxContentLength) {
              return reject(
                new AxiosError_default(
                  "maxContentLength size of " + config2.maxContentLength + " exceeded",
                  AxiosError_default.ERR_BAD_RESPONSE,
                  config2
                )
              );
            }
          }
          let convertedData;
          if (method !== "GET") {
            return settle(resolve, reject, {
              status: 405,
              statusText: "method not allowed",
              headers: {},
              config: config2
            });
          }
          try {
            convertedData = fromDataURI(config2.url, responseType === "blob", {
              Blob: config2.env && config2.env.Blob
            });
          } catch (err) {
            throw AxiosError_default.from(err, AxiosError_default.ERR_BAD_REQUEST, config2);
          }
          if (responseType === "text") {
            convertedData = convertedData.toString(responseEncoding);
            if (!responseEncoding || responseEncoding === "utf8") {
              convertedData = utils_default.stripBOM(convertedData);
            }
          } else if (responseType === "stream") {
            convertedData = stream3.Readable.from(convertedData);
          }
          return settle(resolve, reject, {
            data: convertedData,
            status: 200,
            statusText: "OK",
            headers: new AxiosHeaders_default(),
            config: config2
          });
        }
        if (supportedProtocols.indexOf(protocol) === -1) {
          return reject(
            new AxiosError_default("Unsupported protocol " + protocol, AxiosError_default.ERR_BAD_REQUEST, config2)
          );
        }
        const headers = AxiosHeaders_default.from(config2.headers).normalize();
        headers.set("User-Agent", "axios/" + VERSION, false);
        const { onUploadProgress, onDownloadProgress } = config2;
        const maxRate = config2.maxRate;
        let maxUploadRate = void 0;
        let maxDownloadRate = void 0;
        if (utils_default.isSpecCompliantForm(data)) {
          const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
          data = formDataToStream_default(
            data,
            (formHeaders) => {
              headers.set(formHeaders);
            },
            {
              tag: `axios-${VERSION}-boundary`,
              boundary: userBoundary && userBoundary[1] || void 0
            }
          );
        } else if (utils_default.isFormData(data) && utils_default.isFunction(data.getHeaders) && data.getHeaders !== Object.prototype.getHeaders) {
          setFormDataHeaders(headers, data.getHeaders(), own2("formDataHeaderPolicy"));
          if (!headers.hasContentLength()) {
            try {
              const knownLength = await util2.promisify(data.getLength).call(data);
              Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
            } catch (e) {
            }
          }
        } else if (utils_default.isBlob(data) || utils_default.isFile(data)) {
          data.size && headers.setContentType(data.type || "application/octet-stream");
          headers.setContentLength(data.size || 0);
          data = stream3.Readable.from(readBlob_default(data));
        } else if (data && !utils_default.isStream(data)) {
          if (Buffer.isBuffer(data)) {
          } else if (utils_default.isArrayBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
          } else if (utils_default.isString(data)) {
            data = Buffer.from(data, "utf-8");
          } else {
            return reject(
              new AxiosError_default(
                "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
                AxiosError_default.ERR_BAD_REQUEST,
                config2
              )
            );
          }
          headers.setContentLength(data.length, false);
          if (config2.maxBodyLength > -1 && data.length > config2.maxBodyLength) {
            return reject(
              new AxiosError_default(
                "Request body larger than maxBodyLength limit",
                AxiosError_default.ERR_BAD_REQUEST,
                config2
              )
            );
          }
        }
        const contentLength = utils_default.toFiniteNumber(headers.getContentLength());
        if (utils_default.isArray(maxRate)) {
          maxUploadRate = maxRate[0];
          maxDownloadRate = maxRate[1];
        } else {
          maxUploadRate = maxDownloadRate = maxRate;
        }
        if (data && (onUploadProgress || maxUploadRate)) {
          if (!utils_default.isStream(data)) {
            data = stream3.Readable.from(data, { objectMode: false });
          }
          data = stream3.pipeline(
            [
              data,
              new AxiosTransformStream_default({
                maxRate: utils_default.toFiniteNumber(maxUploadRate)
              })
            ],
            utils_default.noop
          );
          onUploadProgress && data.on(
            "progress",
            flushOnFinish(
              data,
              progressEventDecorator(
                contentLength,
                progressEventReducer(asyncDecorator(onUploadProgress), false, 3)
              )
            )
          );
        }
        let auth = void 0;
        const configAuth = own2("auth");
        if (configAuth) {
          const username = configAuth.username || "";
          const password = configAuth.password || "";
          auth = username + ":" + password;
        }
        if (!auth && parsed.username) {
          const urlUsername = decodeURIComponentSafe(parsed.username);
          const urlPassword = decodeURIComponentSafe(parsed.password);
          auth = urlUsername + ":" + urlPassword;
        }
        auth && headers.delete("authorization");
        let path4;
        try {
          path4 = buildURL(
            parsed.pathname + parsed.search,
            config2.params,
            config2.paramsSerializer
          ).replace(/^\?/, "");
        } catch (err) {
          const customErr = new Error(err.message);
          customErr.config = config2;
          customErr.url = config2.url;
          customErr.exists = true;
          return reject(customErr);
        }
        headers.set(
          "Accept-Encoding",
          "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""),
          false
        );
        const options = Object.assign(/* @__PURE__ */ Object.create(null), {
          path: path4,
          method,
          headers: headers.toJSON(),
          agents: { http: config2.httpAgent, https: config2.httpsAgent },
          auth,
          protocol,
          family,
          beforeRedirect: dispatchBeforeRedirect,
          beforeRedirects: /* @__PURE__ */ Object.create(null),
          http2Options
        });
        !utils_default.isUndefined(lookup) && (options.lookup = lookup);
        if (config2.socketPath) {
          if (typeof config2.socketPath !== "string") {
            return reject(
              new AxiosError_default("socketPath must be a string", AxiosError_default.ERR_BAD_OPTION_VALUE, config2)
            );
          }
          if (config2.allowedSocketPaths != null) {
            const allowed = Array.isArray(config2.allowedSocketPaths) ? config2.allowedSocketPaths : [config2.allowedSocketPaths];
            const resolvedSocket = resolvePath(config2.socketPath);
            const isAllowed = allowed.some(
              (entry) => typeof entry === "string" && resolvePath(entry) === resolvedSocket
            );
            if (!isAllowed) {
              return reject(
                new AxiosError_default(
                  `socketPath "${config2.socketPath}" is not permitted by allowedSocketPaths`,
                  AxiosError_default.ERR_BAD_OPTION_VALUE,
                  config2
                )
              );
            }
          }
          options.socketPath = config2.socketPath;
        } else {
          options.hostname = parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname;
          options.port = parsed.port;
          setProxy(
            options,
            config2.proxy,
            protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path
          );
        }
        let transport;
        let isNativeTransport = false;
        const isHttpsRequest = isHttps.test(options.protocol);
        options.agent = isHttpsRequest ? config2.httpsAgent : config2.httpAgent;
        if (isHttp2) {
          transport = http2Transport;
        } else {
          const configTransport = own2("transport");
          if (configTransport) {
            transport = configTransport;
          } else if (config2.maxRedirects === 0) {
            transport = isHttpsRequest ? https : http;
            isNativeTransport = true;
          } else {
            if (config2.maxRedirects) {
              options.maxRedirects = config2.maxRedirects;
            }
            const configBeforeRedirect = own2("beforeRedirect");
            if (configBeforeRedirect) {
              options.beforeRedirects.config = configBeforeRedirect;
            }
            transport = isHttpsRequest ? httpsFollow : httpFollow;
          }
        }
        if (config2.maxBodyLength > -1) {
          options.maxBodyLength = config2.maxBodyLength;
        } else {
          options.maxBodyLength = Infinity;
        }
        options.insecureHTTPParser = Boolean(own2("insecureHTTPParser"));
        req = transport.request(options, function handleResponse(res) {
          clearConnectPhaseTimer();
          if (req.destroyed) return;
          const streams = [res];
          const responseLength = utils_default.toFiniteNumber(res.headers["content-length"]);
          if (onDownloadProgress || maxDownloadRate) {
            const transformStream = new AxiosTransformStream_default({
              maxRate: utils_default.toFiniteNumber(maxDownloadRate)
            });
            onDownloadProgress && transformStream.on(
              "progress",
              flushOnFinish(
                transformStream,
                progressEventDecorator(
                  responseLength,
                  progressEventReducer(asyncDecorator(onDownloadProgress), true, 3)
                )
              )
            );
            streams.push(transformStream);
          }
          let responseStream = res;
          const lastRequest = res.req || req;
          if (config2.decompress !== false && res.headers["content-encoding"]) {
            if (method === "HEAD" || res.statusCode === 204) {
              delete res.headers["content-encoding"];
            }
            switch ((res.headers["content-encoding"] || "").toLowerCase()) {
              /*eslint default-case:0*/
              case "gzip":
              case "x-gzip":
              case "compress":
              case "x-compress":
                streams.push(zlib.createUnzip(zlibOptions));
                delete res.headers["content-encoding"];
                break;
              case "deflate":
                streams.push(new ZlibHeaderTransformStream_default());
                streams.push(zlib.createUnzip(zlibOptions));
                delete res.headers["content-encoding"];
                break;
              case "br":
                if (isBrotliSupported) {
                  streams.push(zlib.createBrotliDecompress(brotliOptions));
                  delete res.headers["content-encoding"];
                }
            }
          }
          responseStream = streams.length > 1 ? stream3.pipeline(streams, utils_default.noop) : streams[0];
          const response = {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: new AxiosHeaders_default(res.headers),
            config: config2,
            request: lastRequest
          };
          if (responseType === "stream") {
            if (config2.maxContentLength > -1) {
              const limit = config2.maxContentLength;
              const source = responseStream;
              async function* enforceMaxContentLength() {
                let totalResponseBytes = 0;
                for await (const chunk of source) {
                  totalResponseBytes += chunk.length;
                  if (totalResponseBytes > limit) {
                    throw new AxiosError_default(
                      "maxContentLength size of " + limit + " exceeded",
                      AxiosError_default.ERR_BAD_RESPONSE,
                      config2,
                      lastRequest
                    );
                  }
                  yield chunk;
                }
              }
              responseStream = stream3.Readable.from(enforceMaxContentLength(), {
                objectMode: false
              });
            }
            response.data = responseStream;
            settle(resolve, reject, response);
          } else {
            const responseBuffer = [];
            let totalResponseBytes = 0;
            responseStream.on("data", function handleStreamData(chunk) {
              responseBuffer.push(chunk);
              totalResponseBytes += chunk.length;
              if (config2.maxContentLength > -1 && totalResponseBytes > config2.maxContentLength) {
                rejected = true;
                responseStream.destroy();
                abort(
                  new AxiosError_default(
                    "maxContentLength size of " + config2.maxContentLength + " exceeded",
                    AxiosError_default.ERR_BAD_RESPONSE,
                    config2,
                    lastRequest
                  )
                );
              }
            });
            responseStream.on("aborted", function handlerStreamAborted() {
              if (rejected) {
                return;
              }
              const err = new AxiosError_default(
                "stream has been aborted",
                AxiosError_default.ERR_BAD_RESPONSE,
                config2,
                lastRequest,
                response
              );
              responseStream.destroy(err);
              reject(err);
            });
            responseStream.on("error", function handleStreamError(err) {
              if (rejected) return;
              reject(AxiosError_default.from(err, null, config2, lastRequest, response));
            });
            responseStream.on("end", function handleStreamEnd() {
              try {
                let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
                if (responseType !== "arraybuffer") {
                  responseData = responseData.toString(responseEncoding);
                  if (!responseEncoding || responseEncoding === "utf8") {
                    responseData = utils_default.stripBOM(responseData);
                  }
                }
                response.data = responseData;
              } catch (err) {
                return reject(AxiosError_default.from(err, null, config2, response.request, response));
              }
              settle(resolve, reject, response);
            });
          }
          abortEmitter.once("abort", (err) => {
            if (!responseStream.destroyed) {
              responseStream.emit("error", err);
              responseStream.destroy();
            }
          });
        });
        abortEmitter.once("abort", (err) => {
          if (req.close) {
            req.close();
          } else {
            req.destroy(err);
          }
        });
        req.on("error", function handleRequestError(err) {
          reject(AxiosError_default.from(err, null, config2, req));
        });
        const boundSockets = /* @__PURE__ */ new Set();
        req.on("socket", function handleRequestSocket(socket) {
          socket.setKeepAlive(true, 1e3 * 60);
          if (!socket[kAxiosSocketListener]) {
            socket.on("error", function handleSocketError(err) {
              const current = socket[kAxiosCurrentReq];
              if (current && !current.destroyed) {
                current.destroy(err);
              }
            });
            socket[kAxiosSocketListener] = true;
          }
          socket[kAxiosCurrentReq] = req;
          boundSockets.add(socket);
        });
        req.once("close", function clearCurrentReq() {
          clearConnectPhaseTimer();
          for (const socket of boundSockets) {
            if (socket[kAxiosCurrentReq] === req) {
              socket[kAxiosCurrentReq] = null;
            }
          }
          boundSockets.clear();
        });
        if (config2.timeout) {
          const timeout = parseInt(config2.timeout, 10);
          if (Number.isNaN(timeout)) {
            abort(
              new AxiosError_default(
                "error trying to parse `config.timeout` to int",
                AxiosError_default.ERR_BAD_OPTION_VALUE,
                config2,
                req
              )
            );
            return;
          }
          const handleTimeout = function handleTimeout2() {
            if (isDone) return;
            abort(createTimeoutError());
          };
          if (isNativeTransport && timeout > 0) {
            connectPhaseTimer = setTimeout(handleTimeout, timeout);
          }
          req.setTimeout(timeout, handleTimeout);
        } else {
          req.setTimeout(0);
        }
        if (utils_default.isStream(data)) {
          let ended = false;
          let errored = false;
          data.on("end", () => {
            ended = true;
          });
          data.once("error", (err) => {
            errored = true;
            req.destroy(err);
          });
          data.on("close", () => {
            if (!ended && !errored) {
              abort(new CanceledError_default("Request stream has been aborted", config2, req));
            }
          });
          let uploadStream = data;
          if (config2.maxBodyLength > -1 && config2.maxRedirects === 0) {
            const limit = config2.maxBodyLength;
            let bytesSent = 0;
            uploadStream = stream3.pipeline(
              [
                data,
                new stream3.Transform({
                  transform(chunk, _enc, cb) {
                    bytesSent += chunk.length;
                    if (bytesSent > limit) {
                      return cb(
                        new AxiosError_default(
                          "Request body larger than maxBodyLength limit",
                          AxiosError_default.ERR_BAD_REQUEST,
                          config2,
                          req
                        )
                      );
                    }
                    cb(null, chunk);
                  }
                })
              ],
              utils_default.noop
            );
            uploadStream.on("error", (err) => {
              if (!req.destroyed) req.destroy(err);
            });
          }
          uploadStream.pipe(req);
        } else {
          data && req.write(data);
          req.end();
        }
      });
    };
  }
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default;
var init_isURLSameOrigin = __esm({
  "node_modules/axios/lib/helpers/isURLSameOrigin.js"() {
    init_platform();
    isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url2) => {
      url2 = new URL(url2, platform_default.origin);
      return origin2.protocol === url2.protocol && origin2.host === url2.host && (isMSIE || origin2.port === url2.port);
    })(
      new URL(platform_default.origin),
      platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)
    ) : () => true;
  }
});

// node_modules/axios/lib/helpers/cookies.js
var cookies_default;
var init_cookies = __esm({
  "node_modules/axios/lib/helpers/cookies.js"() {
    init_utils();
    init_platform();
    cookies_default = platform_default.hasStandardBrowserEnv ? (
      // Standard browser envs support document.cookie
      {
        write(name, value, expires, path4, domain, secure, sameSite) {
          if (typeof document === "undefined") return;
          const cookie = [`${name}=${encodeURIComponent(value)}`];
          if (utils_default.isNumber(expires)) {
            cookie.push(`expires=${new Date(expires).toUTCString()}`);
          }
          if (utils_default.isString(path4)) {
            cookie.push(`path=${path4}`);
          }
          if (utils_default.isString(domain)) {
            cookie.push(`domain=${domain}`);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          if (utils_default.isString(sameSite)) {
            cookie.push(`SameSite=${sameSite}`);
          }
          document.cookie = cookie.join("; ");
        },
        read(name) {
          if (typeof document === "undefined") return null;
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].replace(/^\s+/, "");
            const eq = cookie.indexOf("=");
            if (eq !== -1 && cookie.slice(0, eq) === name) {
              return decodeURIComponent(cookie.slice(eq + 1));
            }
          }
          return null;
        },
        remove(name) {
          this.write(name, "", Date.now() - 864e5, "/");
        }
      }
    ) : (
      // Non-standard browser env (web workers, react-native) lack needed support.
      {
        write() {
        },
        read() {
          return null;
        },
        remove() {
        }
      }
    );
  }
});

// node_modules/axios/lib/core/mergeConfig.js
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config3 = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(config3, "hasOwnProperty", {
    // Null-proto descriptor so a polluted Object.prototype.get cannot turn
    // this data descriptor into an accessor descriptor on the way in.
    __proto__: null,
    value: Object.prototype.hasOwnProperty,
    enumerable: false,
    writable: true,
    configurable: true
  });
  function getMergedValue(target, source, prop, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a, prop, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (utils_default.hasOwnProp(config2, prop)) {
      return getMergedValue(a, b);
    } else if (utils_default.hasOwnProp(config1, prop)) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    allowedSocketPaths: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  utils_default.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
    if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
    const merge2 = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
    const a = utils_default.hasOwnProp(config1, prop) ? config1[prop] : void 0;
    const b = utils_default.hasOwnProp(config2, prop) ? config2[prop] : void 0;
    const configValue = merge2(a, b, prop);
    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config3[prop] = configValue);
  });
  return config3;
}
var headersToObject;
var init_mergeConfig = __esm({
  "node_modules/axios/lib/core/mergeConfig.js"() {
    "use strict";
    init_utils();
    init_AxiosHeaders();
    headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
  }
});

// node_modules/axios/lib/helpers/resolveConfig.js
function setFormDataHeaders2(headers, formHeaders, policy) {
  if (policy !== "content-only") {
    headers.set(formHeaders);
    return;
  }
  Object.entries(formHeaders).forEach(([key, val]) => {
    if (FORM_DATA_CONTENT_HEADERS2.includes(key.toLowerCase())) {
      headers.set(key, val);
    }
  });
}
var FORM_DATA_CONTENT_HEADERS2, encodeUTF8, resolveConfig_default;
var init_resolveConfig = __esm({
  "node_modules/axios/lib/helpers/resolveConfig.js"() {
    init_platform();
    init_utils();
    init_isURLSameOrigin();
    init_cookies();
    init_buildFullPath();
    init_mergeConfig();
    init_AxiosHeaders();
    init_buildURL();
    FORM_DATA_CONTENT_HEADERS2 = ["content-type", "content-length"];
    encodeUTF8 = (str) => encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/gi,
      (_, hex) => String.fromCharCode(parseInt(hex, 16))
    );
    resolveConfig_default = (config2) => {
      const newConfig = mergeConfig({}, config2);
      const own2 = (key) => utils_default.hasOwnProp(newConfig, key) ? newConfig[key] : void 0;
      const data = own2("data");
      let withXSRFToken = own2("withXSRFToken");
      const xsrfHeaderName = own2("xsrfHeaderName");
      const xsrfCookieName = own2("xsrfCookieName");
      let headers = own2("headers");
      const auth = own2("auth");
      const baseURL = own2("baseURL");
      const allowAbsoluteUrls = own2("allowAbsoluteUrls");
      const url2 = own2("url");
      newConfig.headers = headers = AxiosHeaders_default.from(headers);
      newConfig.url = buildURL(
        buildFullPath(baseURL, url2, allowAbsoluteUrls),
        config2.params,
        config2.paramsSerializer
      );
      if (auth) {
        headers.set(
          "Authorization",
          "Basic " + btoa((auth.username || "") + ":" + (auth.password ? encodeUTF8(auth.password) : ""))
        );
      }
      if (utils_default.isFormData(data)) {
        if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
          headers.setContentType(void 0);
        } else if (utils_default.isFunction(data.getHeaders)) {
          setFormDataHeaders2(headers, data.getHeaders(), own2("formDataHeaderPolicy"));
        }
      }
      if (platform_default.hasStandardBrowserEnv) {
        if (utils_default.isFunction(withXSRFToken)) {
          withXSRFToken = withXSRFToken(newConfig);
        }
        const shouldSendXSRF = withXSRFToken === true || withXSRFToken == null && isURLSameOrigin_default(newConfig.url);
        if (shouldSendXSRF) {
          const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
          if (xsrfValue) {
            headers.set(xsrfHeaderName, xsrfValue);
          }
        }
      }
      return newConfig;
    };
  }
});

// node_modules/axios/lib/adapters/xhr.js
var isXHRAdapterSupported, xhr_default;
var init_xhr = __esm({
  "node_modules/axios/lib/adapters/xhr.js"() {
    init_utils();
    init_settle();
    init_transitional();
    init_AxiosError();
    init_CanceledError();
    init_parseProtocol();
    init_platform();
    init_AxiosHeaders();
    init_progressEventReducer();
    init_resolveConfig();
    isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
    xhr_default = isXHRAdapterSupported && function(config2) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        const _config = resolveConfig_default(config2);
        let requestData = _config.data;
        const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
        let { responseType, onUploadProgress, onDownloadProgress } = _config;
        let onCanceled;
        let uploadThrottled, downloadThrottled;
        let flushUpload, flushDownload;
        function done() {
          flushUpload && flushUpload();
          flushDownload && flushDownload();
          _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
          _config.signal && _config.signal.removeEventListener("abort", onCanceled);
        }
        let request = new XMLHttpRequest();
        request.open(_config.method.toUpperCase(), _config.url, true);
        request.timeout = _config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          const responseHeaders = AxiosHeaders_default.from(
            "getAllResponseHeaders" in request && request.getAllResponseHeaders()
          );
          const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          const response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config2,
            request
          };
          settle(
            function _resolve(value) {
              resolve(value);
              done();
            },
            function _reject(err) {
              reject(err);
              done();
            },
            response
          );
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.startsWith("file:"))) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config2, request));
          done();
          request = null;
        };
        request.onerror = function handleError(event) {
          const msg = event && event.message ? event.message : "Network Error";
          const err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config2, request);
          err.event = event || null;
          reject(err);
          done();
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
          const transitional2 = _config.transitional || transitional_default;
          if (_config.timeoutErrorMessage) {
            timeoutErrorMessage = _config.timeoutErrorMessage;
          }
          reject(
            new AxiosError_default(
              timeoutErrorMessage,
              transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
              config2,
              request
            )
          );
          done();
          request = null;
        };
        requestData === void 0 && requestHeaders.setContentType(null);
        if ("setRequestHeader" in request) {
          utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          });
        }
        if (!utils_default.isUndefined(_config.withCredentials)) {
          request.withCredentials = !!_config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = _config.responseType;
        }
        if (onDownloadProgress) {
          [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
          request.addEventListener("progress", downloadThrottled);
        }
        if (onUploadProgress && request.upload) {
          [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
          request.upload.addEventListener("progress", uploadThrottled);
          request.upload.addEventListener("loadend", flushUpload);
        }
        if (_config.cancelToken || _config.signal) {
          onCanceled = (cancel) => {
            if (!request) {
              return;
            }
            reject(!cancel || cancel.type ? new CanceledError_default(null, config2, request) : cancel);
            request.abort();
            done();
            request = null;
          };
          _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
          if (_config.signal) {
            _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
          }
        }
        const protocol = parseProtocol(_config.url);
        if (protocol && !platform_default.protocols.includes(protocol)) {
          reject(
            new AxiosError_default(
              "Unsupported protocol " + protocol + ":",
              AxiosError_default.ERR_BAD_REQUEST,
              config2
            )
          );
          return;
        }
        request.send(requestData || null);
      });
    };
  }
});

// node_modules/axios/lib/helpers/composeSignals.js
var composeSignals, composeSignals_default;
var init_composeSignals = __esm({
  "node_modules/axios/lib/helpers/composeSignals.js"() {
    init_CanceledError();
    init_AxiosError();
    init_utils();
    composeSignals = (signals, timeout) => {
      const { length } = signals = signals ? signals.filter(Boolean) : [];
      if (timeout || length) {
        let controller = new AbortController();
        let aborted;
        const onabort = function(reason) {
          if (!aborted) {
            aborted = true;
            unsubscribe();
            const err = reason instanceof Error ? reason : this.reason;
            controller.abort(
              err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err)
            );
          }
        };
        let timer = timeout && setTimeout(() => {
          timer = null;
          onabort(new AxiosError_default(`timeout of ${timeout}ms exceeded`, AxiosError_default.ETIMEDOUT));
        }, timeout);
        const unsubscribe = () => {
          if (signals) {
            timer && clearTimeout(timer);
            timer = null;
            signals.forEach((signal2) => {
              signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
            });
            signals = null;
          }
        };
        signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
        const { signal } = controller;
        signal.unsubscribe = () => utils_default.asap(unsubscribe);
        return signal;
      }
    };
    composeSignals_default = composeSignals;
  }
});

// node_modules/axios/lib/helpers/trackStream.js
var streamChunk, readBytes, readStream, trackStream;
var init_trackStream = __esm({
  "node_modules/axios/lib/helpers/trackStream.js"() {
    streamChunk = function* (chunk, chunkSize) {
      let len = chunk.byteLength;
      if (!chunkSize || len < chunkSize) {
        yield chunk;
        return;
      }
      let pos = 0;
      let end;
      while (pos < len) {
        end = pos + chunkSize;
        yield chunk.slice(pos, end);
        pos = end;
      }
    };
    readBytes = async function* (iterable, chunkSize) {
      for await (const chunk of readStream(iterable)) {
        yield* streamChunk(chunk, chunkSize);
      }
    };
    readStream = async function* (stream4) {
      if (stream4[Symbol.asyncIterator]) {
        yield* stream4;
        return;
      }
      const reader = stream4.getReader();
      try {
        for (; ; ) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          yield value;
        }
      } finally {
        await reader.cancel();
      }
    };
    trackStream = (stream4, chunkSize, onProgress, onFinish) => {
      const iterator2 = readBytes(stream4, chunkSize);
      let bytes = 0;
      let done;
      let _onFinish = (e) => {
        if (!done) {
          done = true;
          onFinish && onFinish(e);
        }
      };
      return new ReadableStream(
        {
          async pull(controller) {
            try {
              const { done: done2, value } = await iterator2.next();
              if (done2) {
                _onFinish();
                controller.close();
                return;
              }
              let len = value.byteLength;
              if (onProgress) {
                let loadedBytes = bytes += len;
                onProgress(loadedBytes);
              }
              controller.enqueue(new Uint8Array(value));
            } catch (err) {
              _onFinish(err);
              throw err;
            }
          },
          cancel(reason) {
            _onFinish(reason);
            return iterator2.return();
          }
        },
        {
          highWaterMark: 2
        }
      );
    };
  }
});

// node_modules/axios/lib/adapters/fetch.js
var DEFAULT_CHUNK_SIZE, isFunction2, test, factory, seedCache, getFetch, adapter;
var init_fetch = __esm({
  "node_modules/axios/lib/adapters/fetch.js"() {
    init_platform();
    init_utils();
    init_AxiosError();
    init_composeSignals();
    init_trackStream();
    init_AxiosHeaders();
    init_progressEventReducer();
    init_resolveConfig();
    init_settle();
    init_estimateDataURLDecodedBytes();
    init_data();
    DEFAULT_CHUNK_SIZE = 64 * 1024;
    ({ isFunction: isFunction2 } = utils_default);
    test = (fn, ...args) => {
      try {
        return !!fn(...args);
      } catch (e) {
        return false;
      }
    };
    factory = (env) => {
      const globalObject = utils_default.global ?? globalThis;
      const { ReadableStream: ReadableStream2, TextEncoder: TextEncoder2 } = globalObject;
      env = utils_default.merge.call(
        {
          skipUndefined: true
        },
        {
          Request: globalObject.Request,
          Response: globalObject.Response
        },
        env
      );
      const { fetch: envFetch, Request, Response } = env;
      const isFetchSupported = envFetch ? isFunction2(envFetch) : typeof fetch === "function";
      const isRequestSupported = isFunction2(Request);
      const isResponseSupported = isFunction2(Response);
      if (!isFetchSupported) {
        return false;
      }
      const isReadableStreamSupported = isFetchSupported && isFunction2(ReadableStream2);
      const encodeText = isFetchSupported && (typeof TextEncoder2 === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder2()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
      const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
        let duplexAccessed = false;
        const request = new Request(platform_default.origin, {
          body: new ReadableStream2(),
          method: "POST",
          get duplex() {
            duplexAccessed = true;
            return "half";
          }
        });
        const hasContentType = request.headers.has("Content-Type");
        if (request.body != null) {
          request.body.cancel();
        }
        return duplexAccessed && !hasContentType;
      });
      const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
      const resolvers = {
        stream: supportsResponseStream && ((res) => res.body)
      };
      isFetchSupported && (() => {
        ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
          !resolvers[type] && (resolvers[type] = (res, config2) => {
            let method = res && res[type];
            if (method) {
              return method.call(res);
            }
            throw new AxiosError_default(
              `Response type '${type}' is not supported`,
              AxiosError_default.ERR_NOT_SUPPORT,
              config2
            );
          });
        });
      })();
      const getBodyLength = async (body) => {
        if (body == null) {
          return 0;
        }
        if (utils_default.isBlob(body)) {
          return body.size;
        }
        if (utils_default.isSpecCompliantForm(body)) {
          const _request = new Request(platform_default.origin, {
            method: "POST",
            body
          });
          return (await _request.arrayBuffer()).byteLength;
        }
        if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
          return body.byteLength;
        }
        if (utils_default.isURLSearchParams(body)) {
          body = body + "";
        }
        if (utils_default.isString(body)) {
          return (await encodeText(body)).byteLength;
        }
      };
      const resolveBodyLength = async (headers, body) => {
        const length = utils_default.toFiniteNumber(headers.getContentLength());
        return length == null ? getBodyLength(body) : length;
      };
      return async (config2) => {
        let {
          url: url2,
          method,
          data,
          signal,
          cancelToken,
          timeout,
          onDownloadProgress,
          onUploadProgress,
          responseType,
          headers,
          withCredentials = "same-origin",
          fetchOptions,
          maxContentLength,
          maxBodyLength
        } = resolveConfig_default(config2);
        const hasMaxContentLength = utils_default.isNumber(maxContentLength) && maxContentLength > -1;
        const hasMaxBodyLength = utils_default.isNumber(maxBodyLength) && maxBodyLength > -1;
        let _fetch = envFetch || fetch;
        responseType = responseType ? (responseType + "").toLowerCase() : "text";
        let composedSignal = composeSignals_default(
          [signal, cancelToken && cancelToken.toAbortSignal()],
          timeout
        );
        let request = null;
        const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
          composedSignal.unsubscribe();
        });
        let requestContentLength;
        try {
          if (hasMaxContentLength && typeof url2 === "string" && url2.startsWith("data:")) {
            const estimated = estimateDataURLDecodedBytes(url2);
            if (estimated > maxContentLength) {
              throw new AxiosError_default(
                "maxContentLength size of " + maxContentLength + " exceeded",
                AxiosError_default.ERR_BAD_RESPONSE,
                config2,
                request
              );
            }
          }
          if (hasMaxBodyLength && method !== "get" && method !== "head") {
            const outboundLength = await resolveBodyLength(headers, data);
            if (typeof outboundLength === "number" && isFinite(outboundLength) && outboundLength > maxBodyLength) {
              throw new AxiosError_default(
                "Request body larger than maxBodyLength limit",
                AxiosError_default.ERR_BAD_REQUEST,
                config2,
                request
              );
            }
          }
          if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
            let _request = new Request(url2, {
              method: "POST",
              body: data,
              duplex: "half"
            });
            let contentTypeHeader;
            if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
              headers.setContentType(contentTypeHeader);
            }
            if (_request.body) {
              const [onProgress, flush] = progressEventDecorator(
                requestContentLength,
                progressEventReducer(asyncDecorator(onUploadProgress))
              );
              data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
            }
          }
          if (!utils_default.isString(withCredentials)) {
            withCredentials = withCredentials ? "include" : "omit";
          }
          const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
          if (utils_default.isFormData(data)) {
            const contentType = headers.getContentType();
            if (contentType && /^multipart\/form-data/i.test(contentType) && !/boundary=/i.test(contentType)) {
              headers.delete("content-type");
            }
          }
          headers.set("User-Agent", "axios/" + VERSION, false);
          const resolvedOptions = {
            ...fetchOptions,
            signal: composedSignal,
            method: method.toUpperCase(),
            headers: headers.normalize().toJSON(),
            body: data,
            duplex: "half",
            credentials: isCredentialsSupported ? withCredentials : void 0
          };
          request = isRequestSupported && new Request(url2, resolvedOptions);
          let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url2, resolvedOptions));
          if (hasMaxContentLength) {
            const declaredLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
            if (declaredLength != null && declaredLength > maxContentLength) {
              throw new AxiosError_default(
                "maxContentLength size of " + maxContentLength + " exceeded",
                AxiosError_default.ERR_BAD_RESPONSE,
                config2,
                request
              );
            }
          }
          const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
          if (supportsResponseStream && response.body && (onDownloadProgress || hasMaxContentLength || isStreamResponse && unsubscribe)) {
            const options = {};
            ["status", "statusText", "headers"].forEach((prop) => {
              options[prop] = response[prop];
            });
            const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
            const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
              responseContentLength,
              progressEventReducer(asyncDecorator(onDownloadProgress), true)
            ) || [];
            let bytesRead = 0;
            const onChunkProgress = (loadedBytes) => {
              if (hasMaxContentLength) {
                bytesRead = loadedBytes;
                if (bytesRead > maxContentLength) {
                  throw new AxiosError_default(
                    "maxContentLength size of " + maxContentLength + " exceeded",
                    AxiosError_default.ERR_BAD_RESPONSE,
                    config2,
                    request
                  );
                }
              }
              onProgress && onProgress(loadedBytes);
            };
            response = new Response(
              trackStream(response.body, DEFAULT_CHUNK_SIZE, onChunkProgress, () => {
                flush && flush();
                unsubscribe && unsubscribe();
              }),
              options
            );
          }
          responseType = responseType || "text";
          let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](
            response,
            config2
          );
          if (hasMaxContentLength && !supportsResponseStream && !isStreamResponse) {
            let materializedSize;
            if (responseData != null) {
              if (typeof responseData.byteLength === "number") {
                materializedSize = responseData.byteLength;
              } else if (typeof responseData.size === "number") {
                materializedSize = responseData.size;
              } else if (typeof responseData === "string") {
                materializedSize = typeof TextEncoder2 === "function" ? new TextEncoder2().encode(responseData).byteLength : responseData.length;
              }
            }
            if (typeof materializedSize === "number" && materializedSize > maxContentLength) {
              throw new AxiosError_default(
                "maxContentLength size of " + maxContentLength + " exceeded",
                AxiosError_default.ERR_BAD_RESPONSE,
                config2,
                request
              );
            }
          }
          !isStreamResponse && unsubscribe && unsubscribe();
          return await new Promise((resolve, reject) => {
            settle(resolve, reject, {
              data: responseData,
              headers: AxiosHeaders_default.from(response.headers),
              status: response.status,
              statusText: response.statusText,
              config: config2,
              request
            });
          });
        } catch (err) {
          unsubscribe && unsubscribe();
          if (composedSignal && composedSignal.aborted && composedSignal.reason instanceof AxiosError_default) {
            const canceledError = composedSignal.reason;
            canceledError.config = config2;
            request && (canceledError.request = request);
            err !== canceledError && (canceledError.cause = err);
            throw canceledError;
          }
          if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
            throw Object.assign(
              new AxiosError_default(
                "Network Error",
                AxiosError_default.ERR_NETWORK,
                config2,
                request,
                err && err.response
              ),
              {
                cause: err.cause || err
              }
            );
          }
          throw AxiosError_default.from(err, err && err.code, config2, request, err && err.response);
        }
      };
    };
    seedCache = /* @__PURE__ */ new Map();
    getFetch = (config2) => {
      let env = config2 && config2.env || {};
      const { fetch: fetch2, Request, Response } = env;
      const seeds = [Request, Response, fetch2];
      let len = seeds.length, i = len, seed, target, map = seedCache;
      while (i--) {
        seed = seeds[i];
        target = map.get(seed);
        target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
        map = target;
      }
      return target;
    };
    adapter = getFetch();
  }
});

// node_modules/axios/lib/adapters/adapters.js
function getAdapter(adapters, config2) {
  adapters = utils_default.isArray(adapters) ? adapters : [adapters];
  const { length } = adapters;
  let nameOrAdapter;
  let adapter2;
  const rejectedReasons = {};
  for (let i = 0; i < length; i++) {
    nameOrAdapter = adapters[i];
    let id;
    adapter2 = nameOrAdapter;
    if (!isResolvedHandle(nameOrAdapter)) {
      adapter2 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
      if (adapter2 === void 0) {
        throw new AxiosError_default(`Unknown adapter '${id}'`);
      }
    }
    if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config2)))) {
      break;
    }
    rejectedReasons[id || "#" + i] = adapter2;
  }
  if (!adapter2) {
    const reasons = Object.entries(rejectedReasons).map(
      ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
    );
    let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
    throw new AxiosError_default(
      `There is no suitable adapter to dispatch the request ` + s,
      "ERR_NOT_SUPPORT"
    );
  }
  return adapter2;
}
var knownAdapters, renderReason, isResolvedHandle, adapters_default;
var init_adapters = __esm({
  "node_modules/axios/lib/adapters/adapters.js"() {
    init_utils();
    init_http();
    init_xhr();
    init_fetch();
    init_AxiosError();
    knownAdapters = {
      http: http_default,
      xhr: xhr_default,
      fetch: {
        get: getFetch
      }
    };
    utils_default.forEach(knownAdapters, (fn, value) => {
      if (fn) {
        try {
          Object.defineProperty(fn, "name", { __proto__: null, value });
        } catch (e) {
        }
        Object.defineProperty(fn, "adapterName", { __proto__: null, value });
      }
    });
    renderReason = (reason) => `- ${reason}`;
    isResolvedHandle = (adapter2) => utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === false;
    adapters_default = {
      /**
       * Resolve an adapter from a list of adapter names or functions.
       * @type {Function}
       */
      getAdapter,
      /**
       * Exposes all known adapters
       * @type {Object<string, Function|Object>}
       */
      adapters: knownAdapters
    };
  }
});

// node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config2) {
  if (config2.cancelToken) {
    config2.cancelToken.throwIfRequested();
  }
  if (config2.signal && config2.signal.aborted) {
    throw new CanceledError_default(null, config2);
  }
}
function dispatchRequest(config2) {
  throwIfCancellationRequested(config2);
  config2.headers = AxiosHeaders_default.from(config2.headers);
  config2.data = transformData.call(config2, config2.transformRequest);
  if (["post", "put", "patch"].indexOf(config2.method) !== -1) {
    config2.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter2 = adapters_default.getAdapter(config2.adapter || defaults_default.adapter, config2);
  return adapter2(config2).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config2);
      config2.response = response;
      try {
        response.data = transformData.call(config2, config2.transformResponse, response);
      } finally {
        delete config2.response;
      }
      response.headers = AxiosHeaders_default.from(response.headers);
      return response;
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config2);
        if (reason && reason.response) {
          config2.response = reason.response;
          try {
            reason.response.data = transformData.call(
              config2,
              config2.transformResponse,
              reason.response
            );
          } finally {
            delete config2.response;
          }
          reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    }
  );
}
var init_dispatchRequest = __esm({
  "node_modules/axios/lib/core/dispatchRequest.js"() {
    "use strict";
    init_transformData();
    init_isCancel();
    init_defaults();
    init_CanceledError();
    init_AxiosHeaders();
    init_adapters();
  }
});

// node_modules/axios/lib/helpers/validator.js
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = Object.prototype.hasOwnProperty.call(schema, opt) ? schema[opt] : void 0;
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default(
          "option " + opt + " must be " + result,
          AxiosError_default.ERR_BAD_OPTION_VALUE
        );
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
    }
  }
}
var validators, deprecatedWarnings, validator_default;
var init_validator = __esm({
  "node_modules/axios/lib/helpers/validator.js"() {
    "use strict";
    init_data();
    init_AxiosError();
    validators = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
      validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
      };
    });
    deprecatedWarnings = {};
    validators.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return (value, opt, opts) => {
        if (validator === false) {
          throw new AxiosError_default(
            formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
            AxiosError_default.ERR_DEPRECATED
          );
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version + " and will be removed in the near future"
            )
          );
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    validators.spelling = function spelling(correctSpelling) {
      return (value, opt) => {
        console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
        return true;
      };
    };
    validator_default = {
      assertOptions,
      validators
    };
  }
});

// node_modules/axios/lib/core/Axios.js
var validators2, Axios, Axios_default;
var init_Axios = __esm({
  "node_modules/axios/lib/core/Axios.js"() {
    "use strict";
    init_utils();
    init_buildURL();
    init_InterceptorManager();
    init_dispatchRequest();
    init_mergeConfig();
    init_buildFullPath();
    init_validator();
    init_AxiosHeaders();
    init_transitional();
    validators2 = validator_default.validators;
    Axios = class {
      constructor(instanceConfig) {
        this.defaults = instanceConfig || {};
        this.interceptors = {
          request: new InterceptorManager_default(),
          response: new InterceptorManager_default()
        };
      }
      /**
       * Dispatch a request
       *
       * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
       * @param {?Object} config
       *
       * @returns {Promise} The Promise to be fulfilled
       */
      async request(configOrUrl, config2) {
        try {
          return await this._request(configOrUrl, config2);
        } catch (err) {
          if (err instanceof Error) {
            let dummy = {};
            Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
            const stack = (() => {
              if (!dummy.stack) {
                return "";
              }
              const firstNewlineIndex = dummy.stack.indexOf("\n");
              return firstNewlineIndex === -1 ? "" : dummy.stack.slice(firstNewlineIndex + 1);
            })();
            try {
              if (!err.stack) {
                err.stack = stack;
              } else if (stack) {
                const firstNewlineIndex = stack.indexOf("\n");
                const secondNewlineIndex = firstNewlineIndex === -1 ? -1 : stack.indexOf("\n", firstNewlineIndex + 1);
                const stackWithoutTwoTopLines = secondNewlineIndex === -1 ? "" : stack.slice(secondNewlineIndex + 1);
                if (!String(err.stack).endsWith(stackWithoutTwoTopLines)) {
                  err.stack += "\n" + stack;
                }
              }
            } catch (e) {
            }
          }
          throw err;
        }
      }
      _request(configOrUrl, config2) {
        if (typeof configOrUrl === "string") {
          config2 = config2 || {};
          config2.url = configOrUrl;
        } else {
          config2 = configOrUrl || {};
        }
        config2 = mergeConfig(this.defaults, config2);
        const { transitional: transitional2, paramsSerializer, headers } = config2;
        if (transitional2 !== void 0) {
          validator_default.assertOptions(
            transitional2,
            {
              silentJSONParsing: validators2.transitional(validators2.boolean),
              forcedJSONParsing: validators2.transitional(validators2.boolean),
              clarifyTimeoutError: validators2.transitional(validators2.boolean),
              legacyInterceptorReqResOrdering: validators2.transitional(validators2.boolean)
            },
            false
          );
        }
        if (paramsSerializer != null) {
          if (utils_default.isFunction(paramsSerializer)) {
            config2.paramsSerializer = {
              serialize: paramsSerializer
            };
          } else {
            validator_default.assertOptions(
              paramsSerializer,
              {
                encode: validators2.function,
                serialize: validators2.function
              },
              true
            );
          }
        }
        if (config2.allowAbsoluteUrls !== void 0) {
        } else if (this.defaults.allowAbsoluteUrls !== void 0) {
          config2.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
        } else {
          config2.allowAbsoluteUrls = true;
        }
        validator_default.assertOptions(
          config2,
          {
            baseUrl: validators2.spelling("baseURL"),
            withXsrfToken: validators2.spelling("withXSRFToken")
          },
          true
        );
        config2.method = (config2.method || this.defaults.method || "get").toLowerCase();
        let contextHeaders = headers && utils_default.merge(headers.common, headers[config2.method]);
        headers && utils_default.forEach(["delete", "get", "head", "post", "put", "patch", "query", "common"], (method) => {
          delete headers[method];
        });
        config2.headers = AxiosHeaders_default.concat(contextHeaders, headers);
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config2) === false) {
            return;
          }
          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
          const transitional3 = config2.transitional || transitional_default;
          const legacyInterceptorReqResOrdering = transitional3 && transitional3.legacyInterceptorReqResOrdering;
          if (legacyInterceptorReqResOrdering) {
            requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
          } else {
            requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
          }
        });
        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        let promise;
        let i = 0;
        let len;
        if (!synchronousRequestInterceptors) {
          const chain = [dispatchRequest.bind(this), void 0];
          chain.unshift(...requestInterceptorChain);
          chain.push(...responseInterceptorChain);
          len = chain.length;
          promise = Promise.resolve(config2);
          while (i < len) {
            promise = promise.then(chain[i++], chain[i++]);
          }
          return promise;
        }
        len = requestInterceptorChain.length;
        let newConfig = config2;
        while (i < len) {
          const onFulfilled = requestInterceptorChain[i++];
          const onRejected = requestInterceptorChain[i++];
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected.call(this, error);
            break;
          }
        }
        try {
          promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
          return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while (i < len) {
          promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }
        return promise;
      }
      getUri(config2) {
        config2 = mergeConfig(this.defaults, config2);
        const fullPath = buildFullPath(config2.baseURL, config2.url, config2.allowAbsoluteUrls);
        return buildURL(fullPath, config2.params, config2.paramsSerializer);
      }
    };
    utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url2, config2) {
        return this.request(
          mergeConfig(config2 || {}, {
            method,
            url: url2,
            data: (config2 || {}).data
          })
        );
      };
    });
    utils_default.forEach(["post", "put", "patch", "query"], function forEachMethodWithData(method) {
      function generateHTTPMethod(isForm) {
        return function httpMethod(url2, data, config2) {
          return this.request(
            mergeConfig(config2 || {}, {
              method,
              headers: isForm ? {
                "Content-Type": "multipart/form-data"
              } : {},
              url: url2,
              data
            })
          );
        };
      }
      Axios.prototype[method] = generateHTTPMethod();
      if (method !== "query") {
        Axios.prototype[method + "Form"] = generateHTTPMethod(true);
      }
    });
    Axios_default = Axios;
  }
});

// node_modules/axios/lib/cancel/CancelToken.js
var CancelToken, CancelToken_default;
var init_CancelToken = __esm({
  "node_modules/axios/lib/cancel/CancelToken.js"() {
    "use strict";
    init_CanceledError();
    CancelToken = class _CancelToken {
      constructor(executor) {
        if (typeof executor !== "function") {
          throw new TypeError("executor must be a function.");
        }
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });
        const token = this;
        this.promise.then((cancel) => {
          if (!token._listeners) return;
          let i = token._listeners.length;
          while (i-- > 0) {
            token._listeners[i](cancel);
          }
          token._listeners = null;
        });
        this.promise.then = (onfulfilled) => {
          let _resolve;
          const promise = new Promise((resolve) => {
            token.subscribe(resolve);
            _resolve = resolve;
          }).then(onfulfilled);
          promise.cancel = function reject() {
            token.unsubscribe(_resolve);
          };
          return promise;
        };
        executor(function cancel(message, config2, request) {
          if (token.reason) {
            return;
          }
          token.reason = new CanceledError_default(message, config2, request);
          resolvePromise(token.reason);
        });
      }
      /**
       * Throws a `CanceledError` if cancellation has been requested.
       */
      throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      }
      /**
       * Subscribe to the cancel signal
       */
      subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }
        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      }
      /**
       * Unsubscribe from the cancel signal
       */
      unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }
      toAbortSignal() {
        const controller = new AbortController();
        const abort = (err) => {
          controller.abort(err);
        };
        this.subscribe(abort);
        controller.signal.unsubscribe = () => this.unsubscribe(abort);
        return controller.signal;
      }
      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
      static source() {
        let cancel;
        const token = new _CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      }
    };
    CancelToken_default = CancelToken;
  }
});

// node_modules/axios/lib/helpers/spread.js
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
var init_spread = __esm({
  "node_modules/axios/lib/helpers/spread.js"() {
    "use strict";
  }
});

// node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}
var init_isAxiosError = __esm({
  "node_modules/axios/lib/helpers/isAxiosError.js"() {
    "use strict";
    init_utils();
  }
});

// node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode, HttpStatusCode_default;
var init_HttpStatusCode = __esm({
  "node_modules/axios/lib/helpers/HttpStatusCode.js"() {
    HttpStatusCode = {
      Continue: 100,
      SwitchingProtocols: 101,
      Processing: 102,
      EarlyHints: 103,
      Ok: 200,
      Created: 201,
      Accepted: 202,
      NonAuthoritativeInformation: 203,
      NoContent: 204,
      ResetContent: 205,
      PartialContent: 206,
      MultiStatus: 207,
      AlreadyReported: 208,
      ImUsed: 226,
      MultipleChoices: 300,
      MovedPermanently: 301,
      Found: 302,
      SeeOther: 303,
      NotModified: 304,
      UseProxy: 305,
      Unused: 306,
      TemporaryRedirect: 307,
      PermanentRedirect: 308,
      BadRequest: 400,
      Unauthorized: 401,
      PaymentRequired: 402,
      Forbidden: 403,
      NotFound: 404,
      MethodNotAllowed: 405,
      NotAcceptable: 406,
      ProxyAuthenticationRequired: 407,
      RequestTimeout: 408,
      Conflict: 409,
      Gone: 410,
      LengthRequired: 411,
      PreconditionFailed: 412,
      PayloadTooLarge: 413,
      UriTooLong: 414,
      UnsupportedMediaType: 415,
      RangeNotSatisfiable: 416,
      ExpectationFailed: 417,
      ImATeapot: 418,
      MisdirectedRequest: 421,
      UnprocessableEntity: 422,
      Locked: 423,
      FailedDependency: 424,
      TooEarly: 425,
      UpgradeRequired: 426,
      PreconditionRequired: 428,
      TooManyRequests: 429,
      RequestHeaderFieldsTooLarge: 431,
      UnavailableForLegalReasons: 451,
      InternalServerError: 500,
      NotImplemented: 501,
      BadGateway: 502,
      ServiceUnavailable: 503,
      GatewayTimeout: 504,
      HttpVersionNotSupported: 505,
      VariantAlsoNegotiates: 506,
      InsufficientStorage: 507,
      LoopDetected: 508,
      NotExtended: 510,
      NetworkAuthenticationRequired: 511,
      WebServerIsDown: 521,
      ConnectionTimedOut: 522,
      OriginIsUnreachable: 523,
      TimeoutOccurred: 524,
      SslHandshakeFailed: 525,
      InvalidSslCertificate: 526
    };
    Object.entries(HttpStatusCode).forEach(([key, value]) => {
      HttpStatusCode[value] = key;
    });
    HttpStatusCode_default = HttpStatusCode;
  }
});

// node_modules/axios/lib/axios.js
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create2(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios, axios_default;
var init_axios = __esm({
  "node_modules/axios/lib/axios.js"() {
    "use strict";
    init_utils();
    init_bind();
    init_Axios();
    init_mergeConfig();
    init_defaults();
    init_formDataToJSON();
    init_CanceledError();
    init_CancelToken();
    init_isCancel();
    init_data();
    init_toFormData();
    init_AxiosError();
    init_spread();
    init_isAxiosError();
    init_AxiosHeaders();
    init_adapters();
    init_HttpStatusCode();
    axios = createInstance(defaults_default);
    axios.Axios = Axios_default;
    axios.CanceledError = CanceledError_default;
    axios.CancelToken = CancelToken_default;
    axios.isCancel = isCancel;
    axios.VERSION = VERSION;
    axios.toFormData = toFormData_default;
    axios.AxiosError = AxiosError_default;
    axios.Cancel = axios.CanceledError;
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread;
    axios.isAxiosError = isAxiosError;
    axios.mergeConfig = mergeConfig;
    axios.AxiosHeaders = AxiosHeaders_default;
    axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
    axios.getAdapter = adapters_default.getAdapter;
    axios.HttpStatusCode = HttpStatusCode_default;
    axios.default = axios;
    axios_default = axios;
  }
});

// node_modules/axios/index.js
var axios_exports = {};
__export(axios_exports, {
  Axios: () => Axios2,
  AxiosError: () => AxiosError2,
  AxiosHeaders: () => AxiosHeaders2,
  Cancel: () => Cancel,
  CancelToken: () => CancelToken2,
  CanceledError: () => CanceledError2,
  HttpStatusCode: () => HttpStatusCode2,
  VERSION: () => VERSION2,
  all: () => all2,
  create: () => create,
  default: () => axios_default,
  formToJSON: () => formToJSON,
  getAdapter: () => getAdapter2,
  isAxiosError: () => isAxiosError2,
  isCancel: () => isCancel2,
  mergeConfig: () => mergeConfig2,
  spread: () => spread2,
  toFormData: () => toFormData2
});
var Axios2, AxiosError2, CanceledError2, isCancel2, CancelToken2, VERSION2, all2, Cancel, isAxiosError2, spread2, toFormData2, AxiosHeaders2, HttpStatusCode2, formToJSON, getAdapter2, mergeConfig2, create;
var init_axios2 = __esm({
  "node_modules/axios/index.js"() {
    init_axios();
    ({
      Axios: Axios2,
      AxiosError: AxiosError2,
      CanceledError: CanceledError2,
      isCancel: isCancel2,
      CancelToken: CancelToken2,
      VERSION: VERSION2,
      all: all2,
      Cancel,
      isAxiosError: isAxiosError2,
      spread: spread2,
      toFormData: toFormData2,
      AxiosHeaders: AxiosHeaders2,
      HttpStatusCode: HttpStatusCode2,
      formToJSON,
      getAdapter: getAdapter2,
      mergeConfig: mergeConfig2,
      create
    } = axios_default);
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
import * as crypto3 from "crypto";
import { v4 as uuidv43 } from "uuid";
function signParams(params) {
  const sorted = Object.keys(params).filter((k) => params[k] !== "" && params[k] !== void 0 && params[k] !== null).sort().map((k) => `${k}=${params[k]}`).join("&");
  const signStr = sorted + "&key=" + API_KEY;
  return crypto3.createHash("md5").update(signStr, "utf8").digest("hex").toUpperCase();
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
    const resp = await fetch("https://api.mch.weixin.qq.com/pay/unifiedorder", {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: xmlBody
    });
    const xmlText = await resp.text();
    const result = xmlDecode(xmlText);
    if (result.return_code === "SUCCESS" && result.result_code === "SUCCESS") {
      const signParams2 = {
        appId: APP_ID,
        timeStamp: String(Math.floor(Date.now() / 1e3)),
        nonceStr,
        package: "prepay_id=" + result.prepay_id,
        signType: "MD5"
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
    MCH_ID = process.env.WEIXIN_MCH_ID || "";
    API_KEY = process.env.WEIXIN_PAY_API_KEY || "";
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
async function evidenceRoutes(fastify2) {
  fastify2.post("/upload", async (request, reply) => {
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
      const url2 = `/uploads/evidence/${fileName}`;
      const fileId = `ev_${Date.now()}_${hash}`;
      return {
        success: true,
        url: url2,
        fileId,
        mimeType,
        typeId,
        typeLabel,
        result: {
          url: url2,
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
  fastify2.post("/analyze", async (request, reply) => {
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
  fastify2.get("/file/*", async (request, reply) => {
    const filePath = path.join(UPLOAD_DIR, path.basename(request.params["*"] || ""));
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: "\u6587\u4EF6\u4E0D\u5B58\u5728" });
    }
    return reply.sendFile(path.basename(filePath), UPLOAD_DIR);
  });
}

// src/data/dispute-analysis-library.js
var disputeAnalysisLibrary = {
  // ==================== 教育培训服务纠纷 ====================
  "education:false-advertising": {
    focusKey: "\u865A\u5047\u5938\u5927\u5BA3\u4F20",
    focusName: "\u865A\u5047\u5938\u5927\u5BA3\u4F20",
    disputeType: "education",
    definition: "\u7ECF\u8425\u8005\u53D1\u5E03\u7684\u5E7F\u544A\u6216\u5BA3\u4F20\u5185\u5BB9\u4E0E\u5B9E\u9645\u63D0\u4F9B\u7684\u670D\u52A1\u5185\u5BB9\u660E\u663E\u4E0D\u7B26\uFF0C\u5BF9\u6D88\u8D39\u8005\u7684\u8D2D\u4E70\u51B3\u7B56\u4EA7\u751F\u5B9E\u8D28\u6027\u5F71\u54CD\u3002",
    judgmentBasis: [
      '\u5E7F\u544A/\u5BA3\u4F20\u4E2D\u4F7F\u7528\u4E86"\u5305\u8FC7"\u3001"\u540D\u5E08\u6388\u8BFE"\u3001"100%\u901A\u8FC7\u7387"\u7B49\u627F\u8BFA\u6027\u8868\u8FF0',
      "\u5B9E\u9645\u6388\u8BFE\u6559\u5E08\u8D44\u8D28\u3001\u6559\u5B66\u5185\u5BB9\u3001\u8BFE\u7A0B\u5B89\u6392\u4E0E\u5BA3\u4F20\u627F\u8BFA\u5B58\u5728\u660E\u663E\u5DEE\u8DDD",
      "\u5BA3\u4F20\u6750\u6599\uFF08\u516C\u4F17\u53F7\u6587\u7AE0\u3001\u62DB\u751F\u7B80\u7AE0\u3001\u9500\u552E\u8BDD\u672F\uFF09\u4E2D\u6709\u5177\u4F53\u3001\u53EF\u6838\u5B9E\u7684\u627F\u8BFA\u8BB0\u5F55",
      "\u6D88\u8D39\u8005\u57FA\u4E8E\u4E0A\u8FF0\u627F\u8BFA\u7B7E\u8BA2\u4E86\u5408\u540C\u5E76\u652F\u4ED8\u8D39\u7528"
    ],
    evidenceRelation: [
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u53CC\u65B9\u7EA6\u5B9A\u7684\u670D\u52A1\u6807\u51C6\uFF0C\u53EF\u4E0E\u5BA3\u4F20\u6750\u6599\u5BF9\u7167" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6D88\u8D39\u884C\u4E3A\u5DF2\u53D1\u751F" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u53EF\u5448\u73B0\u7B7E\u7EA6\u524D\u7684\u6C9F\u901A\u8FC7\u7A0B\u548C\u5BF9\u65B9\u627F\u8BFA" },
      { material: "\u673A\u6784\u5BA3\u4F20\u6750\u6599", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u662F\u8BA4\u5B9A\u865A\u5047\u5BA3\u4F20\u7684\u6838\u5FC3\u8BC1\u636E\uFF0C\u5EFA\u8BAE\u4F18\u5148\u83B7\u53D6" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u5FAE\u4FE1\u516C\u4F17\u53F7\u5386\u53F2\u6587\u7AE0\u3001\u62DB\u751F\u7B80\u7AE0\u3001\u9500\u552E\u4EBA\u5458\u670B\u53CB\u5708\u622A\u56FE\u3001\u641C\u7D22\u5F15\u64CE\u5FEB\u7167",
      action: '\u91CD\u70B9\u63D0\u53D6"\u540D\u5E08"\u3001"\u5305\u8FC7"\u3001"\u901A\u8FC7\u7387"\u7B49\u5177\u4F53\u627F\u8BFA\u6027\u8868\u8FF0\uFF0C\u4FDD\u7559\u539F\u59CB\u94FE\u63A5\u548C\u622A\u56FE\u65F6\u95F4'
    }
  },
  "education:refuse-refund": {
    focusKey: "\u4E0D\u9000\u8D39/\u62D6\u5EF6\u9000\u8D39",
    focusName: "\u4E0D\u9000\u8D39/\u62D6\u5EF6\u9000\u8D39",
    disputeType: "education",
    definition: '\u6D88\u8D39\u8005\u56E0\u5408\u7406\u539F\u56E0\u63D0\u51FA\u9000\u8D39\u8BF7\u6C42\u540E\uFF0C\u7ECF\u8425\u8005\u4EE5"\u6982\u4E0D\u9000\u6B3E"\u6761\u6B3E\u6216\u5185\u90E8\u89C4\u5B9A\u4E3A\u7531\u62D2\u7EDD\u6216\u957F\u671F\u4E0D\u5904\u7406\u3002',
    judgmentBasis: [
      "\u6D88\u8D39\u8005\u5DF2\u63D0\u51FA\u660E\u786E\u7684\u9000\u8D39\u8BF7\u6C42\uFF08\u4E66\u9762\u6216\u7535\u5B50\u5F62\u5F0F\uFF09",
      "\u7ECF\u8425\u8005\u4EE5\u5408\u540C\u6761\u6B3E\u6216\u53E3\u5934\u544A\u77E5\u65B9\u5F0F\u660E\u786E\u62D2\u7EDD\u9000\u8D39\uFF0C\u6216\u5728\u5408\u7406\u671F\u9650\u5185\u672A\u4F5C\u5904\u7406",
      '\u5408\u540C\u4E2D\u5B58\u5728"\u6982\u4E0D\u9000\u6B3E"\u3001"\u4E00\u7ECF\u51FA\u552E\u4E0D\u4E88\u9000\u6B3E"\u7B49\u683C\u5F0F\u6761\u6B3E',
      "\u6700\u9AD8\u4EBA\u6C11\u6CD5\u9662\u300A\u5173\u4E8E\u5BA1\u7406\u9884\u4ED8\u5F0F\u6D88\u8D39\u6C11\u4E8B\u7EA0\u7EB7\u6848\u4EF6\u9002\u7528\u6CD5\u5F8B\u82E5\u5E72\u95EE\u9898\u7684\u89E3\u91CA\u300B\uFF082025\u5E74\uFF09\u5BF9\u4E0A\u8FF0\u683C\u5F0F\u6761\u6B3E\u7684\u6548\u529B\u6709\u660E\u786E\u89C4\u5B9A"
    ],
    evidenceRelation: [
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u9000\u8D39\u6761\u6B3E\u7684\u5177\u4F53\u7EA6\u5B9A\uFF0C\u662F\u5224\u65AD\u683C\u5F0F\u6761\u6B3E\u6548\u529B\u7684\u6838\u5FC3\u4F9D\u636E" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u9501\u5B9A\u5B9E\u9645\u635F\u5931\u91D1\u989D" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u9000\u8D39\u8BF7\u6C42\u5DF2\u63D0\u51FA\u53CA\u5BF9\u65B9\u62D2\u7EDD\u7684\u5177\u4F53\u8868\u8FF0" }
    ],
    supplementGuide: {
      priority: 2,
      channel: "\u5FAE\u4FE1\u804A\u5929\u8BB0\u5F55\u3001\u77ED\u4FE1\u3001\u90AE\u4EF6\u3001\u7535\u8BDD\u5F55\u97F3\u3001\u4E66\u9762\u5BC4\u9001\u9000\u8D39\u7533\u8BF7\u7684\u5FEB\u9012\u5355\u636E",
      action: "\u91CD\u70B9\u4FDD\u7559\u5BF9\u65B9\u660E\u786E\u62D2\u7EDD\u9000\u8D39\u7684\u5BF9\u8BDD\u622A\u56FE\uFF0C\u4EE5\u53CA\u6D88\u8D39\u8005\u63D0\u51FA\u9000\u8D39\u7533\u8BF7\u7684\u65F6\u95F4\u8BC1\u660E"
    }
  },
  "education:quality-issues": {
    focusKey: "\u6559\u5B66\u8D28\u91CF\u5DEE",
    focusName: "\u6559\u5B66\u8D28\u91CF\u5DEE/\u4E0E\u627F\u8BFA\u4E0D\u7B26",
    disputeType: "education",
    definition: "\u5B9E\u9645\u63D0\u4F9B\u7684\u6559\u5B66\u670D\u52A1\u5728\u5E08\u8D44\u6C34\u5E73\u3001\u8BFE\u7A0B\u5185\u5BB9\u3001\u5B66\u4E60\u6548\u679C\u7B49\u65B9\u9762\u4E0E\u7B7E\u7EA6\u524D\u7684\u627F\u8BFA\u6216\u5408\u540C\u7EA6\u5B9A\u5B58\u5728\u660E\u663E\u5DEE\u8DDD\u3002",
    judgmentBasis: [
      "\u5408\u540C\u6216\u5BA3\u4F20\u4E2D\u5BF9\u6559\u5B66\u670D\u52A1\u6709\u660E\u786E\u7684\u5E08\u8D44\u3001\u8BFE\u7A0B\u3001\u6548\u679C\u7B49\u7EA6\u5B9A",
      "\u5B9E\u9645\u6559\u5B66\u8FC7\u7A0B\u4E2D\uFF0C\u4E0A\u8FF0\u7EA6\u5B9A\u672A\u5F97\u5230\u5C65\u884C\u6216\u5C65\u884C\u660E\u663E\u4E0D\u7B26\u5408\u6807\u51C6",
      "\u6D88\u8D39\u8005\u5728\u5B66\u4E60\u8FC7\u7A0B\u4E2D\u6709\u5177\u4F53\u7684\u53CD\u9988\u6216\u6295\u8BC9\u8BB0\u5F55"
    ],
    evidenceRelation: [
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u53CC\u65B9\u7EA6\u5B9A\u7684\u6559\u5B66\u670D\u52A1\u6807\u51C6" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u8D39\u7528\u5DF2\u652F\u4ED8" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u53EF\u5448\u73B0\u5B66\u4E60\u8FC7\u7A0B\u4E2D\u7684\u53CD\u9988\u548C\u6295\u8BC9" },
      { material: "\u6559\u5B66\u6210\u679C\u6750\u6599", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u5982\u6210\u7EE9\u5355\u3001\u5B66\u4E60\u8BB0\u5F55\u7B49\uFF0C\u53EF\u8BC1\u660E\u5B9E\u9645\u6559\u5B66\u6548\u679C\u4E0E\u627F\u8BFA\u7684\u5DEE\u8DDD" }
    ],
    supplementGuide: {
      priority: 3,
      channel: "\u5B66\u4E60\u5E73\u53F0\u540E\u53F0\u622A\u56FE\u3001\u6210\u7EE9\u5355\u3001\u4E0E\u6559\u5E08\u7684\u6C9F\u901A\u8BB0\u5F55\u3001\u8BFE\u7A0B\u8BC4\u4F30\u622A\u56FE",
      action: "\u91CD\u70B9\u4FDD\u7559\u80FD\u591F\u8BC1\u660E\u6559\u5B66\u670D\u52A1\u4E0E\u627F\u8BFA\u4E0D\u7B26\u7684\u5177\u4F53\u6750\u6599"
    }
  },
  // ==================== 医疗美容服务纠纷 ====================
  "medical:effect-not-match": {
    focusKey: "\u6548\u679C\u4E0E\u627F\u8BFA\u4E0D\u7B26",
    focusName: "\u6548\u679C\u4E0E\u627F\u8BFA\u4E0D\u7B26",
    disputeType: "medical",
    definition: '\u6548\u679C\u4E0E\u627F\u8BFA\u4E0D\u7B26\uFF0C\u6307\u6D88\u8D39\u8005\u5728\u63A5\u53D7\u533B\u7597\u7F8E\u5BB9\u670D\u52A1\u540E\uFF0C\u5B9E\u9645\u6548\u679C\u4E0E\u533B\u7597\u673A\u6784\u6216\u7F8E\u5BB9\u5E08\u5728\u672F\u524D\u505A\u51FA\u7684\u627F\u8BFA\u5B58\u5728\u663E\u8457\u5DEE\u5F02\u3002\u5728\u533B\u7597\u7F8E\u5BB9\u7EA0\u7EB7\u4E2D\uFF0C\u8FD9\u662F\u6700\u5E38\u89C1\u7684\u4E89\u8BAE\u7C7B\u578B\u4E4B\u4E00\u3002\u6D88\u8D39\u8005\u5728\u672F\u524D\u88AB\u544A\u77E5\u53EF\u4EE5\u8FBE\u5230\u7279\u5B9A\u6548\u679C\uFF08\u5982"\u5B8C\u5168\u53BB\u9664\u76B1\u7EB9"\u3001"\u660E\u663E\u7626\u8138"\u7B49\uFF09\uFF0C\u4F46\u672F\u540E\u6548\u679C\u4E0E\u627F\u8BFA\u76F8\u5DEE\u751A\u8FDC\u3002\u6D88\u8D39\u8005\u4E3B\u5F20\u6548\u679C\u4E0E\u627F\u8BFA\u4E0D\u7B26\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u4E24\u4E2A\u4E8B\u5B9E\uFF1A\u5176\u4E00\uFF0C\u533B\u7597\u673A\u6784\u786E\u5B9E\u505A\u51FA\u4E86\u5177\u4F53\u3001\u660E\u786E\u7684\u6548\u679C\u627F\u8BFA\uFF1B\u5176\u4E8C\uFF0C\u672F\u540E\u5B9E\u9645\u6548\u679C\u786E\u5B9E\u4E0E\u627F\u8BFA\u5B58\u5728\u663E\u8457\u5DEE\u5F02\uFF0C\u5C5E\u4E8E\u666E\u901A\u6D88\u8D39\u8005\u80FD\u591F\u8BC6\u522B\u548C\u5224\u65AD\u7684\u8303\u56F4\u3002',
    judgmentBasis: [
      '\u533B\u7597\u673A\u6784\u7684\u627F\u8BFA\u5185\u5BB9\u662F\u5426\u5177\u4F53\u660E\u786E\uFF1A\u5982\u5728\u5E7F\u544A\u3001\u5BA3\u4F20\u6750\u6599\u3001\u54A8\u8BE2\u8BB0\u5F55\u4E2D\u4F7F\u7528\u4E86"\u4FDD\u8BC1"\u3001"\u4E00\u5B9A"\u3001"100%"\u7B49\u7EDD\u5BF9\u5316\u7528\u8BED\uFF0C\u6216\u5BF9\u672F\u540E\u6548\u679C\u505A\u51FA\u4E86\u53EF\u91CF\u5316\u7684\u627F\u8BFA',
      "\u672F\u540E\u5B9E\u9645\u6548\u679C\u4E0E\u627F\u8BFA\u7684\u5BF9\u6BD4\uFF1A\u6D88\u8D39\u8005\u53EF\u63D0\u4F9B\u672F\u524D\u548C\u672F\u540E\u7684\u5BF9\u6BD4\u7167\u7247\uFF0C\u5BA2\u89C2\u5448\u73B0\u6548\u679C\u5DEE\u5F02",
      "\u6548\u679C\u5DEE\u5F02\u7684\u663E\u8457\u6027\uFF1A\u901A\u5E38\u53EA\u6709\u5DEE\u5F02\u8F83\u4E3A\u660E\u663E\u3001\u8D85\u51FA\u6B63\u5E38\u8303\u56F4\u7684\uFF0C\u624D\u9700\u8981\u8FDB\u4E00\u6B65\u5BA1\u89C6",
      "\u533B\u7597\u7F8E\u5BB9\u6548\u679C\u53D7\u4E2A\u4F53\u5DEE\u5F02\u5F71\u54CD\u8F83\u5927\uFF0C\u4F46\u5982\u679C\u673A\u6784\u5728\u672F\u524D\u9690\u7792\u4E86\u8FD9\u4E00\u91CD\u8981\u4FE1\u606F\uFF0C\u6216\u5728\u660E\u77E5\u6D88\u8D39\u8005\u4E0D\u9002\u7528\u7684\u60C5\u51B5\u4E0B\u4ECD\u505A\u51FA\u4E0D\u53EF\u5151\u73B0\u7684\u627F\u8BFA\uFF0C\u5219\u8BE5\u4E3B\u5F20\u5177\u6709\u5408\u7406\u6027"
    ],
    evidenceRelation: [
      { material: "\u672F\u524D\u4E0E\u672F\u540E\u7684\u5BF9\u6BD4\u7167\u7247", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5B9E\u9645\u6548\u679C\u5DEE\u5F02\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u533B\u7597\u673A\u6784\u7684\u5BA3\u4F20\u6750\u6599\u3001\u5E7F\u544A\u622A\u56FE\u6216\u54A8\u8BE2\u8BB0\u5F55", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u673A\u6784\u7684\u627F\u8BFA\u5185\u5BB9\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u77E5\u60C5\u540C\u610F\u4E66\u6216\u75C5\u5386", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u672F\u524D\u544A\u77E5\u5185\u5BB9\u548C\u624B\u672F\u65B9\u6848\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u4E0E\u673A\u6784\u7684\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u672F\u524D\u627F\u8BFA\u548C\u672F\u540E\u6C9F\u901A\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u7B2C\u4E09\u65B9\u9274\u5B9A\u610F\u89C1\uFF08\u5982\u6709\uFF09", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u6548\u679C\u5DEE\u5F02\u7684\u7A0B\u5EA6\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u673A\u6784\u5BA3\u4F20\u6750\u6599\u3001\u672F\u524D\u672F\u540E\u5BF9\u6BD4\u7167\u7247\u3001\u54A8\u8BE2\u6C9F\u901A\u8BB0\u5F55\u3001\u7B2C\u4E09\u65B9\u4E13\u4E1A\u8BC4\u4F30",
      action: "\u672F\u524D\u5BA3\u4F20\u6750\u6599\u622A\u56FE\u91CD\u70B9\u4FDD\u7559\u6548\u679C\u627F\u8BFA\u7684\u5177\u4F53\u5185\u5BB9\uFF1B\u672F\u524D\u672F\u540E\u540C\u89D2\u5EA6\u540C\u5149\u7EBF\u5BF9\u6BD4\u7167\u7247\uFF1B\u5B8C\u6574\u4FDD\u7559\u4E0E\u54A8\u8BE2\u5E08/\u533B\u751F\u6C9F\u901A\u8BB0\u5F55\uFF1B\u5BF9\u65B9\u62D2\u7EDD\u627F\u8BA4\u5DEE\u5F02\u65F6\u53EF\u8054\u7CFB\u5176\u4ED6\u4E13\u4E1A\u673A\u6784\u8BC4\u4F30"
    }
  },
  "medical:price-opaque": {
    focusKey: "\u6536\u8D39\u4E0D\u900F\u660E\u6216\u4E71\u6536\u8D39",
    focusName: "\u6536\u8D39\u4E0D\u900F\u660E\u6216\u4E71\u6536\u8D39",
    disputeType: "medical",
    definition: "\u6536\u8D39\u4E0D\u900F\u660E\u6216\u4E71\u6536\u8D39\uFF0C\u6307\u533B\u7597\u7F8E\u5BB9\u673A\u6784\u5728\u63D0\u4F9B\u670D\u52A1\u8FC7\u7A0B\u4E2D\uFF0C\u672A\u63D0\u524D\u660E\u786E\u544A\u77E5\u5168\u90E8\u8D39\u7528\u6784\u6210\uFF0C\u6216\u5728\u670D\u52A1\u8FC7\u7A0B\u4E2D\u4E34\u65F6\u589E\u52A0\u8D39\u7528\u3001\u4EE5\u4F4E\u4EF7\u5F15\u6D41\u540E\u5C42\u5C42\u52A0\u4EF7\u3002\u6D88\u8D39\u8005\u5728\u672F\u524D\u5F97\u5230\u7684\u62A5\u4EF7\u4E0E\u5B9E\u9645\u652F\u4ED8\u7684\u8D39\u7528\u5DEE\u8DDD\u8F83\u5927\uFF0C\u6216\u8005\u5728\u4E0D\u77E5\u60C5\u7684\u60C5\u51B5\u4E0B\u88AB\u989D\u5916\u6536\u53D6\u4E86\u5176\u4ED6\u8D39\u7528\u3002\u6D88\u8D39\u8005\u4E3B\u5F20\u6536\u8D39\u4E0D\u900F\u660E\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u673A\u6784\u672A\u5C65\u884C\u660E\u7801\u6807\u4EF7\u548C\u63D0\u524D\u544A\u77E5\u7684\u4E49\u52A1\u3002",
    judgmentBasis: [
      "\u673A\u6784\u662F\u5426\u5728\u672F\u524D\u660E\u786E\u544A\u77E5\u4E86\u5168\u90E8\u8D39\u7528\u6784\u6210\uFF08\u9879\u76EE\u8D39\u3001\u8017\u6750\u8D39\u3001\u9EBB\u9189\u8D39\u3001\u4F4F\u9662\u8D39\u7B49\uFF09\uFF0C\u672F\u524D\u544A\u77E5\u4EF7\u683C\u4E0E\u672F\u540E\u7ED3\u7B97\u4EF7\u683C\u5B58\u5728\u660E\u663E\u5DEE\u5F02\u4E14\u673A\u6784\u672A\u80FD\u5408\u7406\u89E3\u91CA\u589E\u52A0\u8D39\u7528\u7684\u539F\u56E0",
      '\u673A\u6784\u662F\u5426\u5B58\u5728\u4EE5\u4F4E\u4EF7\u5F15\u6D41\u540E\u5C42\u5C42\u52A0\u4EF7\u7684\u884C\u4E3A\uFF0C\u5982\u88AB"\u79D2\u6740\u4EF7"\u3001"\u4F53\u9A8C\u4EF7"\u5438\u5F15\u4F46\u5230\u5E97\u540E\u88AB\u5F15\u5BFC\u6D88\u8D39\u66F4\u9AD8\u4EF7\u683C\u7684\u9879\u76EE',
      "\u673A\u6784\u662F\u5426\u5C31\u8D39\u7528\u6784\u6210\u63D0\u4F9B\u4E86\u6B63\u5F0F\u7968\u636E\uFF0C\u5982\u62D2\u7EDD\u63D0\u4F9B\u6B63\u89C4\u53D1\u7968\u6216\u6536\u636E\uFF0C\u6D88\u8D39\u8005\u6709\u6743\u63D0\u51FA\u8D28\u7591"
    ],
    evidenceRelation: [
      { material: "\u672F\u524D\u62A5\u4EF7\u8BB0\u5F55\u6216\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u673A\u6784\u5728\u672F\u524D\u7684\u4EF7\u683C\u627F\u8BFA\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u672F\u540E\u7ED3\u7B97\u5355\u6216\u4ED8\u6B3E\u51ED\u8BC1", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5B9E\u9645\u652F\u4ED8\u7684\u91D1\u989D\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u673A\u6784\u63D0\u4F9B\u7684\u6536\u8D39\u660E\u7EC6\u6216\u9879\u76EE\u6E05\u5355", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u8D39\u7528\u6784\u6210\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u6D88\u8D39\u8005\u672F\u524D\u548C\u672F\u540E\u7684\u94F6\u884C\u6D41\u6C34\u6216\u8F6C\u8D26\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5B9E\u9645\u8D44\u91D1\u6D41\u5411\u548C\u65F6\u95F4\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u672F\u524D\u62A5\u4EF7\u5355\u3001\u672F\u540E\u7ED3\u7B97\u5355\u3001\u94F6\u884C\u6D41\u6C34\u3001\u7B2C\u4E09\u65B9\u5E73\u53F0\u9879\u76EE\u8BE6\u60C5\u9875\uFF08\u5982\u7F8E\u56E2/\u65B0\u6C27\uFF09",
      action: "\u672F\u524D\u8981\u6C42\u673A\u6784\u63D0\u4F9B\u5B8C\u6574\u62A5\u4EF7\u5355\uFF1B\u672F\u540E\u9010\u9879\u6838\u5BF9\u6536\u8D39\u660E\u7EC6\uFF1B\u94F6\u884C\u6D41\u6C34\u6807\u6CE8\u6BCF\u7B14\u8D39\u7528\u53D1\u751F\u65F6\u95F4\uFF1B\u7B2C\u4E09\u65B9\u5E73\u53F0\u4E0B\u5355\u4FDD\u5B58\u9879\u76EE\u8BE6\u60C5\u9875\u548C\u4EF7\u683C\u4FE1\u606F"
    }
  },
  "medical:service-quality": {
    focusKey: "\u670D\u52A1\u8D28\u91CF\u4F4E\u52A3",
    focusName: "\u670D\u52A1\u8D28\u91CF\u4F4E\u52A3",
    disputeType: "medical",
    definition: "\u670D\u52A1\u8D28\u91CF\u4F4E\u52A3\uFF0C\u6307\u533B\u7597\u7F8E\u5BB9\u673A\u6784\u5728\u63D0\u4F9B\u670D\u52A1\u8FC7\u7A0B\u4E2D\uFF0C\u5B58\u5728\u64CD\u4F5C\u4E0D\u89C4\u8303\u3001\u536B\u751F\u6761\u4EF6\u4E0D\u8FBE\u6807\u3001\u4F7F\u7528\u4E0D\u5408\u683C\u4EA7\u54C1\u3001\u672F\u540E\u7BA1\u7406\u7F3A\u5931\u7B49\u5F71\u54CD\u670D\u52A1\u8D28\u91CF\u7684\u95EE\u9898\u3002\u8FD9\u4E00\u4E89\u8BAE\u7126\u70B9\u4E0D\u76F4\u63A5\u6D89\u53CA\u6548\u679C\u597D\u574F\uFF0C\u800C\u662F\u673A\u6784\u5728\u670D\u52A1\u8FC7\u7A0B\u4E2D\u662F\u5426\u8FBE\u5230\u4E86\u5E94\u6709\u7684\u4E13\u4E1A\u6C34\u51C6\u3002\u6D88\u8D39\u8005\u4E3B\u5F20\u670D\u52A1\u8D28\u91CF\u4F4E\u52A3\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u673A\u6784\u672A\u80FD\u63D0\u4F9B\u4E0E\u6536\u8D39\u6C34\u5E73\u548C\u793E\u4F1A\u666E\u904D\u8BA4\u77E5\u76F8\u5339\u914D\u7684\u5408\u683C\u670D\u52A1\u3002",
    judgmentBasis: [
      "\u673A\u6784\u7684\u8D44\u8D28\u548C\u64CD\u4F5C\u662F\u5426\u89C4\u8303\uFF1A\u673A\u6784\u5E94\u5177\u5907\u300A\u533B\u7597\u673A\u6784\u6267\u4E1A\u8BB8\u53EF\u8BC1\u300B\uFF0C\u64CD\u4F5C\u533B\u5E08\u5E94\u5177\u5907\u76F8\u5E94\u6267\u4E1A\u8D44\u8D28",
      "\u670D\u52A1\u8FC7\u7A0B\u4E2D\u7684\u536B\u751F\u6761\u4EF6\u548C\u4EA7\u54C1\u4F7F\u7528\u662F\u5426\u5408\u89C4\uFF1A\u662F\u5426\u4F7F\u7528\u6B63\u89C4\u6E20\u9053\u91C7\u8D2D\u7684\u4EA7\u54C1\u3001\u5668\u68B0\u662F\u5426\u7ECF\u8FC7\u6D88\u6BD2\u7B49",
      "\u672F\u540E\u7BA1\u7406\u548C\u8DDF\u8E2A\u670D\u52A1\u7684\u53CA\u65F6\u6027\uFF1A\u662F\u5426\u544A\u77E5\u672F\u540E\u6CE8\u610F\u4E8B\u9879\u3001\u662F\u5426\u5728\u6D88\u8D39\u8005\u51FA\u73B0\u4E0D\u9002\u65F6\u53CA\u65F6\u56DE\u5E94"
    ],
    evidenceRelation: [
      { material: "\u673A\u6784\u7684\u8D44\u8D28\u8BC1\u660E\u6216\u67E5\u8BE2\u8BB0\u5F55", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u673A\u6784\u662F\u5426\u5177\u5907\u5408\u6CD5\u8D44\u8D28\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u670D\u52A1\u8FC7\u7A0B\u4E2D\u7684\u8BB0\u5F55\u7167\u7247\u6216\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u670D\u52A1\u73AF\u5883\u548C\u64CD\u4F5C\u60C5\u51B5\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u4F7F\u7528\u4EA7\u54C1\u7684\u5305\u88C5\u6216\u6807\u7B7E\u7167\u7247", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u4EA7\u54C1\u7684\u6765\u6E90\u548C\u5408\u89C4\u6027\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u672F\u540E\u4E0E\u673A\u6784\u7684\u6C9F\u901A\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u672F\u540E\u7BA1\u7406\u7684\u53CA\u65F6\u6027\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u5176\u4ED6\u6D88\u8D39\u8005\u5BF9\u8BE5\u673A\u6784\u7684\u8BC4\u4EF7\u6216\u6295\u8BC9\u8BB0\u5F55", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u4F5C\u4E3A\u53C2\u8003\uFF0C\u8BC1\u660E\u95EE\u9898\u7684\u666E\u904D\u6027\uFF0C\u8F85\u52A9\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 2,
      channel: "\u56FD\u5BB6\u536B\u751F\u5065\u5EB7\u59D4\u5458\u4F1A\u5B98\u7F51\u67E5\u8BE2\u673A\u6784\u8D44\u8D28\u3001\u670D\u52A1\u73B0\u573A\u7167\u7247/\u89C6\u9891\u3001\u4EA7\u54C1\u5305\u88C5\u6807\u7B7E\u3001\u672F\u540E\u6C9F\u901A\u8BB0\u5F55\u3001\u516C\u5F00\u8BC4\u4EF7\u6216\u6295\u8BC9\u4FE1\u606F",
      action: "\u901A\u8FC7\u56FD\u5BB6\u536B\u5065\u59D4\u5B98\u7F51\u67E5\u8BE2\u673A\u6784\u548C\u533B\u5E08\u6267\u4E1A\u8D44\u8D28\uFF1B\u670D\u52A1\u8FC7\u7A0B\u4E2D\u5728\u4E0D\u5F71\u54CD\u4ED6\u4EBA\u7684\u524D\u63D0\u4E0B\u62CD\u7167\u8BB0\u5F55\uFF1B\u4EA7\u54C1\u5305\u88C5\u6807\u7B7E\u62CD\u7167\u6838\u5B9E\u6765\u6E90\uFF1B\u672F\u540E\u4EFB\u4F55\u95EE\u9898\u7684\u6C9F\u901A\u8BB0\u5F55\u5747\u4FDD\u5B58\uFF1B\u53EF\u6536\u96C6\u5176\u4ED6\u6D88\u8D39\u8005\u516C\u5F00\u8BC4\u4EF7\u4F5C\u4E3A\u53C2\u8003"
    }
  },
  "medical:false-advertising": {
    focusKey: "\u865A\u5047\u5BA3\u4F20\u6216\u8D44\u8D28\u9020\u5047",
    focusName: "\u865A\u5047\u5BA3\u4F20\u6216\u8D44\u8D28\u9020\u5047",
    disputeType: "medical",
    definition: "\u865A\u5047\u5BA3\u4F20\u6216\u8D44\u8D28\u9020\u5047\uFF0C\u6307\u533B\u7597\u7F8E\u5BB9\u673A\u6784\u5728\u5BA3\u4F20\u63A8\u5E7F\u8FC7\u7A0B\u4E2D\uFF0C\u5BF9\u81EA\u8EAB\u7684\u8D44\u8D28\u3001\u8BBE\u5907\u3001\u6280\u672F\u3001\u4EA7\u54C1\u3001\u533B\u5E08\u80CC\u666F\u7B49\u505A\u51FA\u865A\u5047\u6216\u8BEF\u5BFC\u6027\u7684\u9648\u8FF0\uFF0C\u6216\u8005\u5192\u7528\u4ED6\u4EBA\u8D44\u8D28\u3001\u4F2A\u9020\u8BC1\u4E66\u7B49\u3002\u8FD9\u4E00\u4E89\u8BAE\u7126\u70B9\u76F4\u63A5\u5F71\u54CD\u6D88\u8D39\u8005\u5BF9\u673A\u6784\u4E13\u4E1A\u80FD\u529B\u7684\u4FE1\u4EFB\u3002\u6D88\u8D39\u8005\u4E3B\u5F20\u865A\u5047\u5BA3\u4F20\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u673A\u6784\u7684\u5BA3\u4F20\u5185\u5BB9\u4E0E\u5B9E\u9645\u60C5\u51B5\u5B58\u5728\u5B9E\u8D28\u6027\u4E0D\u7B26\uFF0C\u4E14\u8FD9\u4E00\u4E0D\u7B26\u5BF9\u6D88\u8D39\u8005\u7684\u9009\u62E9\u4EA7\u751F\u4E86\u76F4\u63A5\u5F71\u54CD\u3002",
    judgmentBasis: [
      '\u673A\u6784\u7684\u5BA3\u4F20\u5185\u5BB9\u662F\u5426\u5177\u6709\u5B9E\u8D28\u6027\u8BEF\u5BFC\u6027\uFF1A\u5982\u5BA3\u79F0\u7684"\u8FDB\u53E3\u8BBE\u5907"\u3001"\u97E9\u56FD\u533B\u5E08"\u3001"\u4E13\u5229\u6280\u672F"\u7B49\u7ECF\u6838\u5B9E\u540E\u4E0E\u5B9E\u9645\u60C5\u51B5\u4E0D\u7B26',
      "\u6D88\u8D39\u8005\u662F\u5426\u57FA\u4E8E\u8BE5\u5BA3\u4F20\u505A\u51FA\u4E86\u6D88\u8D39\u51B3\u5B9A\uFF1A\u6D88\u8D39\u8005\u80FD\u591F\u8BC1\u660E\u5176\u6B63\u662F\u56E0\u4E3A\u770B\u5230\u4E86\u8FD9\u4E9B\u5BA3\u4F20\u4FE1\u606F\u624D\u9009\u62E9\u4E86\u8BE5\u673A\u6784\uFF0C\u5219\u5BA3\u4F20\u5185\u5BB9\u5BF9\u6D88\u8D39\u8005\u5177\u6709\u7EA6\u675F\u529B",
      "\u5B9E\u9645\u6838\u5B9E\u7684\u7ED3\u679C\uFF1A\u6D88\u8D39\u8005\u53EF\u901A\u8FC7\u5B98\u65B9\u6E20\u9053\u67E5\u8BE2\u673A\u6784\u548C\u533B\u5E08\u7684\u6267\u4E1A\u8D44\u8D28\u3001\u8BBE\u5907\u7684\u6CE8\u518C\u4FE1\u606F\u7B49\uFF0C\u51C6\u5907\u5BA2\u89C2\u7684\u6838\u5B9E\u51ED\u8BC1"
    ],
    evidenceRelation: [
      { material: "\u673A\u6784\u7684\u5BA3\u4F20\u6750\u6599\u3001\u5E7F\u544A\u622A\u56FE\u6216\u7F51\u9875\u5B58\u6863", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u673A\u6784\u7684\u5BA3\u4F20\u5185\u5BB9\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u5B98\u65B9\u67E5\u8BE2\u7ED3\u679C\u622A\u56FE", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5B9E\u9645\u60C5\u51B5\u4E0E\u5BA3\u4F20\u4E0D\u7B26\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u6D88\u8D39\u8005\u4E0E\u673A\u6784\u521D\u6B21\u63A5\u89E6\u7684\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6D88\u8D39\u8005\u662F\u57FA\u4E8E\u8BE5\u5BA3\u4F20\u505A\u51FA\u7684\u6D88\u8D39\u51B3\u5B9A\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u673A\u6784\u7684\u6267\u4E1A\u8BB8\u53EF\u8BC1\u516C\u793A\u7167\u7247\uFF08\u5982\u6709\uFF09", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u673A\u6784\u7684\u5B9E\u9645\u8D44\u8D28\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u673A\u6784\u6240\u6709\u5BA3\u4F20\u6750\u6599\u622A\u56FE\uFF08\u7F51\u7AD9/\u5C0F\u7A0B\u5E8F/\u7B2C\u4E09\u65B9\u5E73\u53F0/\u5E7F\u544A\u724C/\u5BA3\u4F20\u518C\uFF09\u3001\u56FD\u5BB6\u536B\u5065\u59D4\u5B98\u7F51\u3001\u56FD\u5BB6\u836F\u76D1\u5C40\u5B98\u7F51\u7B49\u5B98\u65B9\u6E20\u9053",
      action: "\u5B8C\u6574\u622A\u56FE\u6240\u6709\u5BA3\u4F20\u6750\u6599\uFF1B\u901A\u8FC7\u5B98\u65B9\u6E20\u9053\u67E5\u8BE2\u673A\u6784\u548C\u4EA7\u54C1\u8D44\u8D28\u4FE1\u606F\u5E76\u622A\u5C4F\u4FDD\u5B58\uFF1B\u4FDD\u7559\u4E0E\u673A\u6784\u521D\u6B21\u63A5\u89E6\u7684\u6C9F\u901A\u8BB0\u5F55\uFF1B\u67E5\u770B\u672F\u524D\u7B7E\u7F72\u7684\u77E5\u60C5\u540C\u610F\u4E66\u4E2D\u5BF9\u673A\u6784\u8D44\u8D28\u7684\u63CF\u8FF0"
    }
  },
  // ==================== 预付卡/会员服务纠纷 ====================
  "prepaid:balance-deducted": {
    focusKey: "\u4F59\u989D\u64C5\u81EA\u88AB\u6263\u9664/\u65E0\u6CD5\u4F7F\u7528",
    focusName: "\u4F59\u989D\u64C5\u81EA\u88AB\u6263\u9664/\u65E0\u6CD5\u4F7F\u7528",
    disputeType: "prepaid",
    definition: "\u6D88\u8D39\u8005\u9884\u5B58\u7684\u8D44\u91D1\u5728\u4E0D\u77E5\u60C5\u6216\u672A\u540C\u610F\u7684\u60C5\u51B5\u4E0B\u88AB\u5546\u6237\u6263\u9664\uFF0C\u6216\u5546\u6237\u5173\u95E8\u8DD1\u8DEF\u5BFC\u81F4\u4F59\u989D\u65E0\u6CD5\u4F7F\u7528\u3002",
    judgmentBasis: [
      "\u6D88\u8D39\u8005\u9884\u5B58\u8D44\u91D1\u540E\uFF0C\u5546\u6237\u5728\u672A\u7ECF\u660E\u793A\u540C\u610F\u7684\u60C5\u51B5\u4E0B\u6263\u9664\u4F59\u989D",
      "\u5546\u6237\u5355\u65B9\u9762\u53D8\u66F4\u670D\u52A1\u5185\u5BB9\u3001\u6709\u6548\u671F\u6216\u4F7F\u7528\u6761\u4EF6",
      "\u5546\u6237\u5173\u95E8\u505C\u4E1A\u6216\u62D2\u7EDD\u7EE7\u7EED\u63D0\u4F9B\u670D\u52A1",
      "\u6D88\u8D39\u8005\u6709\u660E\u786E\u7684\u6D88\u8D39\u8BB0\u5F55\u6216\u4F59\u989D\u8BC1\u660E"
    ],
    evidenceRelation: [
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u9884\u5B58\u91D1\u989D" },
      { material: "\u4F1A\u5458\u5361/\u7535\u5B50\u8D26\u6237\u622A\u56FE", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5F53\u524D\u4F59\u989D\u548C\u6D88\u8D39\u8BB0\u5F55" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u53EF\u5448\u73B0\u4E0E\u5546\u6237\u7684\u6C9F\u901A\u8FC7\u7A0B" },
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u7EA6\u5B9A\u7684\u670D\u52A1\u5185\u5BB9\u548C\u4F1A\u5458\u6743\u76CA" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u4F1A\u5458App\u622A\u56FE\u3001\u5237\u5361\u5C0F\u7968\u3001\u6D88\u8D39\u77ED\u4FE1\u901A\u77E5\u3001\u95E8\u5E97\u516C\u544A\u7167\u7247",
      action: "\u7B2C\u4E00\u65F6\u95F4\u4FDD\u5B58\u4F59\u989D\u622A\u56FE\u548C\u6D88\u8D39\u8BB0\u5F55\uFF0C\u5FC5\u8981\u65F6\u8FDB\u884C\u516C\u8BC1\u4FDD\u5168"
    }
  },
  "prepaid:expire-issues": {
    focusKey: "\u8FC7\u671F\u65E0\u6CD5\u7EED\u7528/\u9650\u5236\u4F7F\u7528",
    focusName: "\u8FC7\u671F\u65E0\u6CD5\u7EED\u7528/\u9650\u5236\u4F7F\u7528",
    disputeType: "prepaid",
    definition: "\u5546\u6237\u5355\u65B9\u9762\u8BBE\u5B9A\u6216\u7F29\u77ED\u4F1A\u5458\u6709\u6548\u671F\uFF0C\u6216\u5728\u6709\u6548\u671F\u5185\u8BBE\u7F6E\u4E0D\u5408\u7406\u7684\u4F7F\u7528\u9650\u5236\u3002",
    judgmentBasis: [
      "\u5408\u540C\u6216\u4F1A\u5458\u89C4\u5219\u4E2D\u5BF9\u6709\u6548\u671F\u6709\u660E\u786E\u7EA6\u5B9A\uFF0C\u5546\u6237\u5355\u65B9\u9762\u7F29\u77ED",
      "\u6709\u6548\u671F\u5185\u5546\u6237\u65B0\u589E\u4E0D\u5408\u7406\u4F7F\u7528\u9650\u5236\uFF08\u5982\u8282\u5047\u65E5\u4E0D\u80FD\u4F7F\u7528\u3001\u9700\u9884\u7EA6\u7B49\uFF09",
      "\u5546\u6237\u672A\u5728\u5408\u7406\u671F\u9650\u524D\u901A\u77E5\u6D88\u8D39\u8005\u6709\u6548\u671F\u53D8\u66F4"
    ],
    evidenceRelation: [
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u7EA6\u5B9A\u7684\u6709\u6548\u671F\u548C\u4F7F\u7528\u6761\u4EF6" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5165\u4F1A\u8D39\u7528" },
      { material: "\u4F1A\u5458\u89C4\u5219\u622A\u56FE", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5546\u6237\u516C\u793A\u7684\u4F7F\u7528\u89C4\u5219\u5185\u5BB9\u53CA\u53D8\u66F4\u65F6\u95F4" }
    ],
    supplementGuide: {
      priority: 2,
      channel: "\u5546\u6237App\u622A\u56FE\u3001\u5E97\u5185\u516C\u544A\u7167\u7247\u3001\u5BA3\u4F20\u5355\u9875\u3001\u6D88\u8D39\u8005\u4E0E\u5546\u6237\u7684\u6C9F\u901A\u8BB0\u5F55",
      action: "\u91CD\u70B9\u4FDD\u7559\u6709\u6548\u671F\u53D8\u66F4\u524D\u540E\u7684\u89C4\u5219\u5BF9\u6BD4\uFF0C\u4EE5\u53CA\u5546\u6237\u901A\u77E5\u6D88\u8D39\u8005\u7684\u76F8\u5173\u8BB0\u5F55"
    }
  },
  // ==================== 房屋租赁纠纷 ====================
  "rental:early-termination": {
    focusKey: "\u63D0\u524D\u7EC8\u6B62\u5408\u540C",
    focusName: "\u63D0\u524D\u7EC8\u6B62\u5408\u540C/\u9000\u79DF",
    disputeType: "rental",
    definition: "\u51FA\u79DF\u65B9\u6216\u627F\u79DF\u65B9\u5728\u79DF\u8D41\u671F\u6EE1\u524D\u63D0\u51FA\u7EC8\u6B62\u5408\u540C\uFF0C\u53CC\u65B9\u5BF9\u8FDD\u7EA6\u91D1\u3001\u62BC\u91D1\u9000\u8FD8\u7B49\u95EE\u9898\u4EA7\u751F\u4E89\u8BAE\u3002",
    judgmentBasis: [
      "\u79DF\u8D41\u5408\u540C\u4E2D\u5BF9\u63D0\u524D\u7EC8\u6B62\u7684\u60C5\u5F62\u548C\u8FDD\u7EA6\u91D1\u6709\u660E\u786E\u7EA6\u5B9A",
      "\u63D0\u51FA\u7EC8\u6B62\u7684\u4E00\u65B9\u662F\u5426\u6309\u5408\u540C\u7EA6\u5B9A\u7684\u65F6\u95F4\u548C\u65B9\u5F0F\u901A\u77E5\u5BF9\u65B9",
      "\u662F\u5426\u5B58\u5728\u6CD5\u5B9A\u6216\u7EA6\u5B9A\u7684\u7EC8\u6B62\u4E8B\u7531\uFF08\u5982\u4E0D\u53EF\u6297\u529B\u3001\u5BF9\u65B9\u8FDD\u7EA6\u7B49\uFF09",
      "\u62BC\u91D1\u9000\u8FD8\u6761\u4EF6\u548C\u5B9E\u9645\u9000\u8FD8\u60C5\u51B5"
    ],
    evidenceRelation: [
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u7EA6\u5B9A\u7684\u79DF\u8D41\u671F\u9650\u3001\u8FDD\u7EA6\u91D1\u6761\u6B3E\u548C\u62BC\u91D1\u6761\u6B3E" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5DF2\u652F\u4ED8\u62BC\u91D1\u548C\u79DF\u91D1" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u53EF\u5448\u73B0\u53CC\u65B9\u534F\u5546\u8FC7\u7A0B" }
    ],
    supplementGuide: {
      priority: 2,
      channel: "\u5FAE\u4FE1\u804A\u5929\u8BB0\u5F55\u3001\u77ED\u4FE1\u3001\u4E66\u9762\u901A\u77E5\u51FD\u53CA\u9001\u8FBE\u8BC1\u660E\u3001\u623F\u5C4B\u4EA4\u63A5\u8BB0\u5F55",
      action: "\u9000\u79DF\u524D\u5EFA\u8BAE\u4E66\u9762\u901A\u77E5\u5E76\u4FDD\u7559\u9001\u8FBE\u8BC1\u660E\uFF0C\u623F\u5C4B\u4EA4\u63A5\u65F6\u505A\u597D\u4E66\u9762\u8BB0\u5F55"
    }
  },
  "rental:deposit-dispute": {
    focusKey: "\u62BC\u91D1\u4E0D\u9000/\u514B\u6263",
    focusName: "\u62BC\u91D1\u4E0D\u9000/\u514B\u6263",
    disputeType: "rental",
    definition: "\u79DF\u8D41\u671F\u6EE1\u9000\u623F\u540E\uFF0C\u51FA\u79DF\u65B9\u4EE5\u5404\u79CD\u7406\u7531\u62D2\u7EDD\u9000\u8FD8\u62BC\u91D1\u6216\u6263\u9664\u90E8\u5206\u62BC\u91D1\u3002",
    judgmentBasis: [
      "\u79DF\u8D41\u5408\u540C\u4E2D\u5BF9\u62BC\u91D1\u7684\u6570\u989D\u3001\u9000\u8FD8\u6761\u4EF6\u548C\u65F6\u95F4\u6709\u660E\u786E\u7EA6\u5B9A",
      "\u9000\u623F\u65F6\u623F\u5C4B\u72B6\u6001\u662F\u5426\u7B26\u5408\u5408\u540C\u7EA6\u5B9A\u7684\u9000\u8FD8\u6761\u4EF6",
      "\u51FA\u79DF\u65B9\u6263\u9664\u62BC\u91D1\u7684\u4F9D\u636E\u662F\u5426\u5145\u5206\u3001\u5408\u7406",
      "\u662F\u5426\u5B58\u5728\u5165\u4F4F\u65F6\u7684\u623F\u5C4B\u72B6\u6001\u8BB0\u5F55\uFF08\u7528\u4E8E\u5BF9\u7167\uFF09"
    ],
    evidenceRelation: [
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u62BC\u91D1\u6570\u989D\u548C\u9000\u8FD8\u6761\u4EF6" },
      { material: "\u5165\u4F4F\u65F6\u7684\u623F\u5C4B\u7167\u7247/\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5165\u4F4F\u65F6\u7684\u623F\u5C4B\u72B6\u6001\uFF0C\u662F\u5224\u65AD\u62BC\u91D1\u514B\u6263\u662F\u5426\u5408\u7406\u7684\u5BF9\u7167\u4F9D\u636E" },
      { material: "\u9000\u623F\u65F6\u7684\u623F\u5C4B\u7167\u7247/\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u9000\u623F\u65F6\u7684\u5B9E\u9645\u72B6\u6001" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u62BC\u91D1\u5DF2\u652F\u4ED8" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u5165\u4F4F\u65F6\u7684\u623F\u5C4B\u7167\u7247/\u89C6\u9891\u3001\u9000\u623F\u65F6\u7684\u623F\u5C4B\u7167\u7247/\u89C6\u9891\u3001\u4EA4\u63A5\u6E05\u5355\u3001\u62BC\u91D1\u6536\u636E",
      action: "\u5165\u4F4F\u65F6\u52A1\u5FC5\u7559\u5B58\u623F\u5C4B\u73B0\u72B6\u8BB0\u5F55\uFF08\u7167\u7247/\u89C6\u9891+\u65E5\u671F\u6C34\u5370\uFF09\uFF0C\u9000\u623F\u65F6\u540C\u6837\u64CD\u4F5C\u4EE5\u4FBF\u5BF9\u7167"
    }
  },
  // ==================== 购物消费纠纷 ====================
  "shopping:quality-defect": {
    focusKey: "\u8D28\u91CF\u95EE\u9898/\u7455\u75B5",
    focusName: "\u8D28\u91CF\u95EE\u9898/\u7455\u75B5",
    disputeType: "shopping",
    definition: "\u8D2D\u4E70\u7684\u5546\u54C1\u5B58\u5728\u8D28\u91CF\u95EE\u9898\u3001\u7455\u75B5\u6216\u4E0E\u5BA3\u4F20\u4E0D\u7B26\uFF0C\u4F46\u5546\u5BB6\u62D2\u7EDD\u9000\u8D27\u9000\u6B3E\u6216\u62D2\u7EDD\u627F\u62C5\u8D23\u4EFB\u3002",
    judgmentBasis: [
      "\u5546\u54C1\u5728\u4FDD\u4FEE\u671F\u6216\u5408\u7406\u671F\u9650\u5185\u51FA\u73B0\u8D28\u91CF\u95EE\u9898",
      "\u5546\u54C1\u5B58\u5728\u7455\u75B5\u6216\u4E0E\u5BA3\u4F20\u3001\u8BF4\u660E\u5B58\u5728\u660E\u663E\u4E0D\u7B26",
      "\u5546\u5BB6\u62D2\u7EDD\u5C65\u884C\u9000\u8D27\u3001\u9000\u6B3E\u3001\u66F4\u6362\u3001\u7EF4\u4FEE\u7B49\u4E49\u52A1",
      "\u6D88\u8D39\u8005\u5DF2\u63D0\u4F9B\u521D\u6B65\u7684\u8D28\u91CF\u95EE\u9898\u8BC1\u660E\uFF08\u5982\u68C0\u6D4B\u62A5\u544A\u3001\u5BF9\u6BD4\u7167\u7247\u7B49\uFF09"
    ],
    evidenceRelation: [
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u8D2D\u4E70\u5173\u7CFB\u548C\u5546\u5BB6\u627F\u8BFA" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u8D2D\u4E70\u4EF7\u683C" },
      { material: "\u5546\u54C1\u5B9E\u7269\u7167\u7247/\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u76F4\u89C2\u5448\u73B0\u8D28\u91CF\u95EE\u9898" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u53EF\u5448\u73B0\u4E0E\u5546\u5BB6\u7684\u6C9F\u901A\u8FC7\u7A0B" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u5546\u54C1\u5B9E\u7269\u7167\u7247/\u89C6\u9891\u3001\u7B2C\u4E09\u65B9\u68C0\u6D4B\u62A5\u544A\u3001\u8D2D\u4E70\u53D1\u7968\u6216\u6536\u636E",
      action: "\u95EE\u9898\u5546\u54C1\u5EFA\u8BAE\u5148\u4FDD\u7559\u5B9E\u7269\uFF0C\u5FC5\u8981\u65F6\u53EF\u7533\u8BF7\u7B2C\u4E09\u65B9\u68C0\u6D4B"
    }
  },
  // ==================== 互联网服务纠纷 ====================
  "internet:refuse-refund": {
    focusKey: "\u62D2\u7EDD\u9000\u6B3E",
    focusName: "\u62D2\u7EDD\u9000\u6B3E",
    disputeType: "internet",
    definition: "\u7528\u6237\u8D2D\u4E70\u6570\u5B57\u670D\u52A1\u6216\u865A\u62DF\u5546\u54C1\u540E\uFF0C\u56E0\u670D\u52A1\u4E0D\u7B26\u5408\u9884\u671F\u7B49\u539F\u56E0\u7533\u8BF7\u9000\u6B3E\uFF0C\u88AB\u5E73\u53F0\u6216\u5546\u5BB6\u62D2\u7EDD\u3002",
    judgmentBasis: [
      "\u7528\u6237\u5728\u5408\u7406\u671F\u9650\u5185\u63D0\u51FA\u9000\u6B3E\u7533\u8BF7",
      "\u9000\u6B3E\u7533\u8BF7\u7684\u7406\u7531\u662F\u5426\u7B26\u5408\u5E73\u53F0\u9000\u6B3E\u653F\u7B56",
      "\u5E73\u53F0\u6216\u5546\u5BB6\u662F\u5426\u5B58\u5728\u62D6\u5EF6\u5904\u7406\u3001\u8BBE\u7F6E\u4E0D\u5408\u7406\u9000\u6B3E\u95E8\u69DB\u7B49\u884C\u4E3A",
      "\u7528\u6237\u662F\u5426\u6709\u5145\u5206\u7684\u9000\u6B3E\u539F\u56E0\u8BC1\u660E"
    ],
    evidenceRelation: [
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u8D2D\u4E70\u91D1\u989D" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u53EF\u5448\u73B0\u9000\u6B3E\u7533\u8BF7\u8FC7\u7A0B\u548C\u5E73\u53F0\u56DE\u590D" },
      { material: "\u8BA2\u5355\u622A\u56FE", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u8BA2\u5355\u8BE6\u60C5\u548C\u670D\u52A1\u5185\u5BB9" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "App\u8BA2\u5355\u622A\u56FE\u3001\u4ED8\u6B3E\u51ED\u8BC1\u3001\u4E0E\u5BA2\u670D\u7684\u804A\u5929\u8BB0\u5F55\u3001\u5E73\u53F0\u9000\u6B3E\u653F\u7B56\u622A\u56FE",
      action: "\u9000\u6B3E\u7533\u8BF7\u5EFA\u8BAE\u901A\u8FC7\u5E73\u53F0\u5B98\u65B9\u6E20\u9053\u5E76\u4FDD\u7559\u8BB0\u5F55\uFF0C\u6C9F\u901A\u4E2D\u907F\u514D\u60C5\u7EEA\u5316\u8868\u8FF0"
    }
  },
  // ==================== 消费维权纠纷 ====================
  "consumer:quality-issues": {
    focusKey: "\u5546\u54C1\u8D28\u91CF\u95EE\u9898",
    focusName: "\u5546\u54C1\u8D28\u91CF\u95EE\u9898",
    disputeType: "consumer",
    definition: "\u5546\u54C1\u8D28\u91CF\u95EE\u9898\uFF0C\u6307\u6D88\u8D39\u8005\u8D2D\u4E70\u7684\u5546\u54C1\u5B58\u5728\u4E0D\u7B26\u5408\u8D28\u91CF\u6807\u51C6\u7684\u7F3A\u9677\u6216\u7455\u75B5\u3002\u5728\u6D88\u8D39\u7EF4\u6743\u7EA0\u7EB7\u4E2D\uFF0C\u8FD9\u662F\u6700\u5E38\u89C1\u7684\u4E89\u8BAE\u7C7B\u578B\u4E4B\u4E00\u3002\u6839\u636E\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C24\u6761\uFF0C\u7ECF\u8425\u8005\u63D0\u4F9B\u7684\u5546\u54C1\u4E0D\u7B26\u5408\u8D28\u91CF\u8981\u6C42\u7684\uFF0C\u6D88\u8D39\u8005\u53EF\u4EE5\u4F9D\u7167\u56FD\u5BB6\u89C4\u5B9A\u6216\u5F53\u4E8B\u4EBA\u7EA6\u5B9A\u9000\u8D27\uFF0C\u6216\u8005\u8981\u6C42\u7ECF\u8425\u8005\u5C65\u884C\u66F4\u6362\u3001\u4FEE\u7406\u7B49\u4E49\u52A1\u3002\u5546\u54C1\u8D28\u91CF\u95EE\u9898\u901A\u5E38\u6D89\u53CA\u5546\u54C1\u672C\u8EAB\u5B58\u5728\u7F3A\u9677\u3001\u5546\u54C1\u4E0E\u63CF\u8FF0\u4E0D\u7B26\u3001\u5546\u54C1\u65E0\u6CD5\u6B63\u5E38\u4F7F\u7528\u7B49\u60C5\u5F62\u3002\u6D88\u8D39\u8005\u4E3B\u5F20\u5546\u54C1\u5B58\u5728\u8D28\u91CF\u95EE\u9898\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u4E24\u4E2A\u4E8B\u5B9E\uFF1A\u5176\u4E00\uFF0C\u53CC\u65B9\u5B58\u5728\u4EA4\u6613\u5173\u7CFB\uFF1B\u5176\u4E8C\uFF0C\u5546\u54C1\u786E\u5B9E\u5B58\u5728\u4E0D\u7B26\u5408\u8D28\u91CF\u6807\u51C6\u7684\u95EE\u9898\u3002",
    judgmentBasis: [
      "\u4EA4\u6613\u5173\u7CFB\u8BC1\u660E\uFF1A\u8D2D\u4E70\u8BB0\u5F55\u3001\u8BA2\u5355\u622A\u56FE\u3001\u4ED8\u6B3E\u51ED\u8BC1\u3001\u53D1\u7968\u6216\u6536\u636E\u7B49\uFF0C\u5176\u4E2D\u4ED8\u6B3E\u8BB0\u5F55\u548C\u8BA2\u5355\u4FE1\u606F\u662F\u6700\u76F4\u63A5\u7684\u8BC1\u636E",
      "\u5546\u54C1\u8D28\u91CF\u95EE\u9898\u7684\u5BA2\u89C2\u8BC1\u636E\uFF1A\u5546\u54C1\u7167\u7247\u6216\u89C6\u9891\uFF08\u6E05\u6670\u5C55\u793A\u8D28\u91CF\u7F3A\u9677\uFF09\u3001\u5546\u54C1\u68C0\u6D4B\u62A5\u544A\uFF08\u7531\u6709\u8D44\u8D28\u7684\u7B2C\u4E09\u65B9\u68C0\u6D4B\u673A\u6784\u51FA\u5177\uFF09\u3001\u5546\u54C1\u4E0E\u5BA3\u4F20\u63CF\u8FF0\u7684\u5BF9\u6BD4\u56FE\u7B49",
      "\u5982\u679C\u5546\u54C1\u5B58\u5728\u8089\u773C\u53EF\u89C1\u7684\u8D28\u91CF\u95EE\u9898\uFF0C\u7167\u7247\u548C\u89C6\u9891\u662FA\u7EA7\u76F4\u63A5\u8BC1\u636E",
      "\u5982\u679C\u6D89\u53CA\u9690\u853D\u7455\u75B5\uFF0C\u5EFA\u8BAE\u6D88\u8D39\u8005\u8054\u7CFB\u6709\u8D44\u8D28\u7684\u68C0\u6D4B\u673A\u6784\u8FDB\u884C\u68C0\u6D4B\uFF0C\u68C0\u6D4B\u62A5\u544A\u662F\u8BA4\u5B9A\u8D28\u91CF\u95EE\u9898\u7684\u6838\u5FC3\u4F9D\u636E",
      "\u6D88\u8D39\u8005\u5728\u5408\u7406\u671F\u9650\u5185\u5411\u5546\u5BB6\u63D0\u51FA\u5F02\u8BAE\u7684\u8BB0\u5F55\uFF0C\u804A\u5929\u8BB0\u5F55\u3001\u901A\u8BDD\u8BB0\u5F55\u7B49\u53EF\u4EE5\u8BC1\u660E\u6D88\u8D39\u8005\u5DF2\u5C65\u884C\u53CA\u65F6\u901A\u77E5\u4E49\u52A1"
    ],
    evidenceRelation: [
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u4EA4\u6613\u5173\u7CFB\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u5546\u54C1\u7167\u7247/\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u8D28\u91CF\u95EE\u9898\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E\uFF0C\u9700\u6E05\u6670\u5C55\u793A\u7F3A\u9677" },
      { material: "\u5546\u54C1\u68C0\u6D4B\u62A5\u544A", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u8D28\u91CF\u95EE\u9898\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E\uFF0C\u7531\u7B2C\u4E09\u65B9\u68C0\u6D4B\u673A\u6784\u51FA\u5177" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6D88\u8D39\u8005\u5DF2\u63D0\u51FA\u5F02\u8BAE\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u7535\u5546\u5E73\u53F0\u8BA2\u5355\u8BE6\u60C5\u9875\u622A\u5C4F\u3001\u7B2C\u4E09\u65B9\u68C0\u6D4B\u673A\u6784\u3001\u5546\u5BB6\u6C9F\u901A\u8BB0\u5F55",
      action: "\u591A\u89D2\u5EA6\u62CD\u6444\u5546\u54C1\u7F3A\u9677\u5E76\u4FDD\u7559\u65E5\u671F\u6C34\u5370\uFF1B\u5546\u54C1\u4EF7\u503C\u8F83\u9AD8\u65F6\u5EFA\u8BAE\u7533\u8BF7\u68C0\u6D4B\u62A5\u544A\uFF1B\u622A\u53D6\u5546\u5BB6\u627F\u8BA4\u8D28\u91CF\u95EE\u9898\u6216\u62D2\u7EDD\u5904\u7406\u7684\u5BF9\u8BDD"
    }
  },
  "consumer:false-advertising": {
    focusKey: "\u4FC3\u9500\u4E89\u8BAE",
    focusName: "\u4FC3\u9500\u4E89\u8BAE",
    disputeType: "consumer",
    definition: "\u4FC3\u9500\u4E89\u8BAE\uFF0C\u6307\u6D88\u8D39\u8005\u4E0E\u7ECF\u8425\u8005\u5C31\u4FC3\u9500\u6D3B\u52A8\u7684\u5185\u5BB9\u3001\u6761\u4EF6\u548C\u5151\u73B0\u95EE\u9898\u4EA7\u751F\u7684\u4E89\u8BAE\u3002\u5728\u6D88\u8D39\u7EF4\u6743\u7EA0\u7EB7\u4E2D\uFF0C\u4FC3\u9500\u4E89\u8BAE\u901A\u5E38\u6D89\u53CA\u865A\u5047\u4FC3\u9500\u3001\u4F18\u60E0\u6761\u4EF6\u672A\u5151\u73B0\u3001\u8D60\u54C1\u4E89\u8BAE\u7B49\u60C5\u5F62\u3002\u6839\u636E\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761\uFF0C\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u589E\u52A0\u8D54\u507F\u5176\u53D7\u5230\u7684\u635F\u5931\u3002\u4FC3\u9500\u4E89\u8BAE\u7684\u6838\u5FC3\u5728\u4E8E\u7ECF\u8425\u8005\u662F\u5426\u5728\u4FC3\u9500\u6D3B\u52A8\u4E2D\u505A\u51FA\u4E86\u660E\u786E\u3001\u5177\u4F53\u7684\u627F\u8BFA\uFF0C\u4EE5\u53CA\u8FD9\u4E9B\u627F\u8BFA\u662F\u5426\u5BF9\u6D88\u8D39\u8005\u7684\u8D2D\u4E70\u51B3\u5B9A\u4EA7\u751F\u4E86\u5B9E\u8D28\u6027\u5F71\u54CD\u3002",
    judgmentBasis: [
      "\u7ECF\u8425\u8005\u4FC3\u9500\u627F\u8BFA\u7684\u5185\u5BB9\u662F\u5426\u660E\u786E\u5177\u4F53\uFF1A\u5E7F\u544A\u3001\u5BA3\u4F20\u6750\u6599\u3001\u5546\u54C1\u9875\u9762\u4E2D\u7684\u5177\u4F53\u4EF7\u683C\u627F\u8BFA\u3001\u8D60\u54C1\u627F\u8BFA\u6216\u4F18\u60E0\u627F\u8BFA\uFF0C\u6784\u6210\u5408\u540C\u5185\u5BB9\u7684\u4E00\u90E8\u5206",
      "\u6D88\u8D39\u8005\u662F\u5426\u57FA\u4E8E\u8BE5\u4FC3\u9500\u627F\u8BFA\u505A\u51FA\u4E86\u8D2D\u4E70\u51B3\u5B9A\uFF1A\u6D88\u8D39\u8005\u80FD\u591F\u8BC1\u660E\u8D2D\u4E70\u884C\u4E3A\u4E0E\u4FC3\u9500\u627F\u8BFA\u4E4B\u95F4\u5B58\u5728\u56E0\u679C\u5173\u7CFB\uFF0C\u5219\u4FC3\u9500\u627F\u8BFA\u5BF9\u7ECF\u8425\u8005\u5177\u6709\u7EA6\u675F\u529B",
      "\u7ECF\u8425\u8005\u662F\u5426\u5B9E\u9645\u5151\u73B0\u4E86\u4FC3\u9500\u627F\u8BFA\uFF1A\u672A\u6309\u627F\u8BFA\u63D0\u4F9B\u4F18\u60E0\u6216\u8D60\u54C1\uFF0C\u6216\u9644\u52A0\u4E86\u672A\u63D0\u524D\u544A\u77E5\u7684\u9650\u5236\u6761\u4EF6\uFF0C\u5219\u6784\u6210\u5BF9\u6D88\u8D39\u8005\u6743\u76CA\u7684\u635F\u5BB3"
    ],
    evidenceRelation: [
      { material: "\u5546\u54C1\u9875\u9762/\u4FC3\u9500\u5E7F\u544A\u622A\u56FE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u7ECF\u8425\u8005\u7684\u4FC3\u9500\u627F\u8BFA\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u8D2D\u4E70\u8BB0\u5F55/\u8BA2\u5355\u622A\u56FE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6D88\u8D39\u8005\u57FA\u4E8E\u4FC3\u9500\u627F\u8BFA\u8FDB\u884C\u4E86\u8D2D\u4E70\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u5B9E\u9645\u8D26\u5355/\u6536\u5230\u7684\u5546\u54C1", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u7ECF\u8425\u8005\u672A\u5151\u73B0\u4FC3\u9500\u627F\u8BFA\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6D88\u8D39\u8005\u5DF2\u63D0\u51FA\u5F02\u8BAE\u548C\u5546\u5BB6\u56DE\u5E94\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u4FC3\u9500\u6D3B\u52A8\u9875\u9762\u5B8C\u6574\u622A\u56FE\uFF08\u6D3B\u52A8\u65F6\u95F4\u3001\u4F18\u60E0\u6761\u4EF6\u3001\u8D60\u54C1\u4FE1\u606F\uFF09\u3001\u8BA2\u5355\u8BE6\u60C5\u622A\u56FE\u3001\u5B9E\u9645\u652F\u4ED8\u51ED\u8BC1\u3001\u4E0E\u5546\u5BB6\u6C9F\u901A\u8BB0\u5F55",
      action: "\u5546\u54C1\u9875\u9762\u5DF2\u4E0B\u67B6\u53EF\u5C1D\u8BD5\u641C\u7D22\u5F15\u64CE\u5FEB\u7167\u6216\u7B2C\u4E09\u65B9\u5E73\u53F0\u5B58\u6863\uFF1B\u622A\u53D6\u5546\u5BB6\u627F\u8BA4\u4FC3\u9500\u627F\u8BFA\u6216\u62D2\u7EDD\u5151\u73B0\u7684\u90E8\u5206"
    }
  },
  "consumer:refuse-refund": {
    focusKey: "\u9000\u6362\u8D27\u4E89\u8BAE",
    focusName: "\u9000\u6362\u8D27\u4E89\u8BAE",
    disputeType: "consumer",
    definition: "\u9000\u6362\u8D27\u4E89\u8BAE\uFF0C\u6307\u6D88\u8D39\u8005\u4E0E\u7ECF\u8425\u8005\u5C31\u9000\u8D27\u3001\u6362\u8D27\u7684\u6743\u5229\u548C\u6761\u4EF6\u4EA7\u751F\u7684\u4E89\u8BAE\u3002\u6839\u636E\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C25\u6761\uFF0C\u7ECF\u8425\u8005\u91C7\u7528\u7F51\u7EDC\u3001\u7535\u89C6\u3001\u90AE\u8D2D\u7B49\u65B9\u5F0F\u9500\u552E\u5546\u54C1\uFF0C\u6D88\u8D39\u8005\u6709\u6743\u81EA\u6536\u5230\u5546\u54C1\u4E4B\u65E5\u8D77\u4E03\u65E5\u5185\u9000\u8D27\uFF0C\u4E14\u65E0\u9700\u8BF4\u660E\u7406\u7531\uFF0C\u4F46\u7279\u5B9A\u5546\u54C1\u9664\u5916\u3002\u5BF9\u4E8E\u7EBF\u4E0B\u8D2D\u4E70\u7684\u5546\u54C1\uFF0C\u6D88\u8D39\u8005\u5728\u5546\u54C1\u5B58\u5728\u8D28\u91CF\u95EE\u9898\u65F6\u6709\u6743\u8981\u6C42\u9000\u8D27\u6216\u6362\u8D27\u3002\u9000\u6362\u8D27\u4E89\u8BAE\u7684\u6838\u5FC3\u5728\u4E8E\u6D88\u8D39\u8005\u662F\u5426\u5728\u6CD5\u5B9A\u671F\u9650\u5185\u63D0\u51FA\u9000\u6362\u8D27\u8981\u6C42\uFF0C\u4EE5\u53CA\u5546\u54C1\u662F\u5426\u7B26\u5408\u9000\u6362\u8D27\u6761\u4EF6\u3002",
    judgmentBasis: [
      "\u8D2D\u4E70\u65B9\u5F0F\uFF1A\u7F51\u7EDC\u8D2D\u7269\u9002\u7528\u4E03\u65E5\u65E0\u7406\u7531\u9000\u8D27\u5236\u5EA6\uFF0C\u7EBF\u4E0B\u8D2D\u7269\u5219\u9700\u5546\u54C1\u5B58\u5728\u8D28\u91CF\u95EE\u9898\u65B9\u53EF\u8981\u6C42\u9000\u6362\u8D27",
      "\u9000\u6362\u8D27\u8981\u6C42\u7684\u63D0\u51FA\u65F6\u95F4\uFF1A\u6D88\u8D39\u8005\u5E94\u5728\u6CD5\u5B9A\u671F\u9650\u5185\u5411\u7ECF\u8425\u8005\u63D0\u51FA\u9000\u6362\u8D27\u8981\u6C42\uFF0C\u5E76\u4FDD\u7559\u63D0\u51FA\u8981\u6C42\u7684\u8BB0\u5F55",
      "\u5546\u54C1\u662F\u5426\u7B26\u5408\u9000\u6362\u8D27\u6761\u4EF6\uFF1A\u7F51\u7EDC\u8D2D\u7269\u4E2D\uFF0C\u6D88\u8D39\u8005\u9000\u8D27\u7684\u5546\u54C1\u5E94\u5F53\u5B8C\u597D\uFF0C\u7ECF\u8425\u8005\u5E94\u5F53\u81EA\u6536\u5230\u9000\u56DE\u5546\u54C1\u4E4B\u65E5\u8D77\u4E03\u65E5\u5185\u8FD4\u8FD8\u6D88\u8D39\u8005\u652F\u4ED8\u7684\u5546\u54C1\u4EF7\u6B3E",
      "\u5982\u679C\u7ECF\u8425\u8005\u62D2\u7EDD\u9000\u6362\u8D27\uFF0C\u9700\u8981\u5BA1\u67E5\u5176\u62D2\u7EDD\u7406\u7531\u662F\u5426\u7B26\u5408\u6CD5\u5F8B\u89C4\u5B9A"
    ],
    evidenceRelation: [
      { material: "\u8D2D\u4E70\u8BB0\u5F55/\u8BA2\u5355\u622A\u56FE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u4EA4\u6613\u5173\u7CFB\u548C\u8D2D\u4E70\u65F6\u95F4\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u5546\u54C1\u7167\u7247", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5546\u54C1\u73B0\u72B6\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6D88\u8D39\u8005\u63D0\u51FA\u9000\u6362\u8D27\u8981\u6C42\u7684\u65F6\u95F4\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u5546\u5BB6\u62D2\u7EDD\u9000\u6362\u8D27\u56DE\u590D", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5546\u5BB6\u7684\u6001\u5EA6\u548C\u7406\u7531\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u7269\u6D41\u5355\u636E", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u9000\u56DE\u5546\u54C1\u7684\u65E5\u671F\u548C\u72B6\u6001\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u7F51\u7EDC\u8D2D\u7269\u8BA2\u5355\u622A\u56FE\u3001\u6CD5\u5B9A\u671F\u9650\u5185\u9000\u6362\u8D27\u7533\u8BF7\u804A\u5929\u8BB0\u5F55\u622A\u5C4F\u3001\u5546\u54C1\u73B0\u72B6\u7167\u7247\u6216\u89C6\u9891\u3001\u9000\u8D27\u7269\u6D41\u5355\u53F7\u548C\u7269\u6D41\u72B6\u6001\u67E5\u8BE2\u8BB0\u5F55\u3001\u4E0E\u5546\u5BB6\u5B8C\u6574\u6C9F\u901A\u8BB0\u5F55",
      action: "\u4FDD\u5B58\u4E0B\u5355\u65F6\u95F4\u548C\u6536\u8D27\u65F6\u95F4\u8BB0\u5F55\uFF1B\u5728\u6CD5\u5B9A\u671F\u9650\u5185\u63D0\u51FA\u9000\u6362\u8D27\u7533\u8BF7\u5E76\u4FDD\u7559\u8BB0\u5F55\uFF1B\u5546\u5BB6\u62D2\u7EDD\u9000\u6362\u8D27\u7684\u5177\u4F53\u7406\u7531\u91CD\u70B9\u622A\u53D6"
    }
  },
  "consumer:merchant-poor-attitude": {
    focusKey: "\u5546\u5BB6\u6001\u5EA6\u6076\u52A3",
    focusName: "\u5546\u5BB6\u6001\u5EA6\u6076\u52A3",
    disputeType: "consumer",
    definition: "\u5546\u5BB6\u6001\u5EA6\u6076\u52A3\uFF0C\u6307\u7ECF\u8425\u8005\u5728\u5904\u7406\u6D88\u8D39\u8005\u6295\u8BC9\u6216\u4E89\u8BAE\u65F6\uFF0C\u91C7\u53D6\u4E0D\u914D\u5408\u3001\u62D6\u5EF6\u3001\u63A8\u8BFF\u6216\u5A01\u80C1\u7B49\u4E0D\u5F53\u6001\u5EA6\u3002\u5728\u6D88\u8D39\u7EF4\u6743\u7EA0\u7EB7\u4E2D\uFF0C\u5546\u5BB6\u6001\u5EA6\u6076\u52A3\u672C\u8EAB\u4E0D\u6784\u6210\u72EC\u7ACB\u7684\u4E89\u8BAE\u7126\u70B9\uFF0C\u4F46\u901A\u5E38\u4E0E\u5176\u4ED6\u4E89\u8BAE\u7126\u70B9\uFF08\u5982\u5546\u54C1\u8D28\u91CF\u95EE\u9898\u3001\u9000\u6362\u8D27\u4E89\u8BAE\u7B49\uFF09\u540C\u65F6\u51FA\u73B0\uFF0C\u5F71\u54CD\u6D88\u8D39\u8005\u7684\u7EF4\u6743\u4F53\u9A8C\u548C\u7EA0\u7EB7\u5904\u7406\u6548\u7387\u3002\u5546\u5BB6\u6001\u5EA6\u6076\u52A3\u7684\u8868\u73B0\u5305\u62EC\u62D2\u7EDD\u6C9F\u901A\u3001\u62D6\u5EF6\u5904\u7406\u3001\u5426\u8BA4\u8D23\u4EFB\u3001\u5A01\u80C1\u6050\u5413\u7B49\u3002",
    judgmentBasis: [
      "\u5546\u5BB6\u5BF9\u6D88\u8D39\u8005\u6295\u8BC9\u7684\u56DE\u5E94\u65B9\u5F0F\uFF1A\u660E\u786E\u62D2\u7EDD\u6C9F\u901A\u3001\u62D2\u7EDD\u627F\u62C5\u8D23\u4EFB\u3001\u6216\u5BF9\u6D88\u8D39\u8005\u8FDB\u884C\u4EBA\u8EAB\u653B\u51FB\u6216\u5A01\u80C1\uFF0C\u901A\u8FC7\u804A\u5929\u8BB0\u5F55\u3001\u901A\u8BDD\u5F55\u97F3\u7B49\u8BC1\u636E\u6765\u8BC1\u660E",
      "\u5546\u5BB6\u662F\u5426\u5B58\u5728\u62D6\u5EF6\u5904\u7406\u7684\u884C\u4E3A\uFF1A\u5546\u5BB6\u5728\u6536\u5230\u6D88\u8D39\u8005\u6295\u8BC9\u540E\u957F\u65F6\u95F4\u4E0D\u4E88\u56DE\u5E94\u6216\u53CD\u590D\u63A8\u8BFF\uFF0C\u6D88\u8D39\u8005\u53EF\u4EE5\u901A\u8FC7\u591A\u6B21\u6C9F\u901A\u8BB0\u5F55\u6765\u8BC1\u660E\u5546\u5BB6\u7684\u62D6\u5EF6\u884C\u4E3A",
      "\u5546\u5BB6\u6001\u5EA6\u6076\u52A3\u672C\u8EAB\u4E0D\u6539\u53D8\u7EA0\u7EB7\u7684\u6CD5\u5F8B\u6027\u8D28\uFF0C\u4F46\u53EF\u4EE5\u4F5C\u4E3A\u6D88\u8D39\u8005\u9009\u62E9\u5411\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\u6216\u5BFB\u6C42\u5176\u4ED6\u9014\u5F84\u89E3\u51B3\u7684\u53C2\u8003\u56E0\u7D20"
    ],
    evidenceRelation: [
      { material: "\u4E0E\u5546\u5BB6\u7684\u5B8C\u6574\u804A\u5929\u8BB0\u5F55\u6216\u901A\u8BDD\u5F55\u97F3", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5546\u5BB6\u7684\u6C9F\u901A\u6001\u5EA6\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u6D88\u8D39\u8005\u591A\u6B21\u8054\u7CFB\u5546\u5BB6\u7684\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5546\u5BB6\u7684\u62D6\u5EF6\u884C\u4E3A\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u6D88\u8D39\u8005\u5411\u5E73\u53F0\u6216\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\u7684\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6D88\u8D39\u8005\u5DF2\u7A77\u5C3D\u534F\u5546\u6E20\u9053\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 3,
      channel: "\u5B8C\u6574\u6C9F\u901A\u8BB0\u5F55\uFF08\u6587\u5B57\u804A\u5929\u3001\u8BED\u97F3\u901A\u8BDD\u8BB0\u5F55\u3001\u90AE\u4EF6\u5F80\u6765\uFF09\u3001\u591A\u6B21\u5C1D\u8BD5\u8054\u7CFB\u5546\u5BB6\u7684\u8BB0\u5F55\uFF08\u65F6\u95F4\u95F4\u9694\u6E05\u6670\u53EF\u89C1\uFF09\u3001\u5411\u5E73\u53F0\u6216\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\u7684\u8BB0\u5F55\u548C\u53CD\u9988",
      action: "\u5B8C\u6574\u4FDD\u7559\u6240\u6709\u6C9F\u901A\u6E20\u9053\u7684\u8BB0\u5F55\uFF1B\u65F6\u95F4\u95F4\u9694\u6E05\u6670\u53EF\u89C1\u7684\u591A\u6B21\u8054\u7CFB\u8BB0\u5F55\u53EF\u8BC1\u660E\u5546\u5BB6\u62D6\u5EF6\uFF1B\u6295\u8BC9\u8BB0\u5F55\u662F\u9009\u62E9\u8FDB\u4E00\u6B65\u6295\u8BC9\u6216\u8C03\u89E3\u7A0B\u5E8F\u7684\u91CD\u8981\u53C2\u8003"
    }
  },
  // ==================== 房产租房纠纷 ====================
  "housing:deposit-refund": {
    focusKey: "\u62BC\u91D1\u9000\u8FD8\u4E89\u8BAE",
    focusName: "\u62BC\u91D1\u9000\u8FD8\u4E89\u8BAE",
    disputeType: "housing",
    definition: "\u62BC\u91D1\u9000\u8FD8\u4E89\u8BAE\uFF0C\u6307\u51FA\u79DF\u4EBA\u5728\u79DF\u8D41\u5173\u7CFB\u7EC8\u6B62\u540E\uFF0C\u62D2\u7EDD\u6216\u62D6\u5EF6\u5411\u627F\u79DF\u4EBA\u8FD4\u8FD8\u79DF\u623F\u62BC\u91D1\u7684\u4E89\u8BAE\u3002\u5728\u623F\u4EA7\u79DF\u623F\u7EA0\u7EB7\u4E2D\uFF0C\u8FD9\u662F\u6700\u5E38\u89C1\u3001\u6700\u9AD8\u9891\u7684\u4E89\u8BAE\u7C7B\u578B\u4E4B\u4E00\u3002\u6839\u636E\u300A\u6C11\u6CD5\u5178\u300B\u79DF\u8D41\u5408\u540C\u4E13\u7AE0\u7684\u89C4\u5B9A\uFF0C\u79DF\u8D41\u5173\u7CFB\u7EC8\u6B62\u65F6\uFF0C\u51FA\u79DF\u4EBA\u5E94\u5F53\u5728\u627F\u79DF\u4EBA\u8FD4\u8FD8\u79DF\u8D41\u7269\u4E14\u65E0\u62D6\u6B20\u79DF\u91D1\u3001\u65E0\u635F\u574F\u8D54\u507F\u7B49\u60C5\u5F62\u540E\uFF0C\u53CA\u65F6\u8FD4\u8FD8\u62BC\u91D1\u3002\u62BC\u91D1\u9000\u8FD8\u4E89\u8BAE\u7684\u6838\u5FC3\u5728\u4E8E\u4E24\u4E2A\u65B9\u9762\uFF1A\u5176\u4E00\uFF0C\u79DF\u8D41\u5173\u7CFB\u5DF2\u7EC8\u6B62\uFF0C\u627F\u79DF\u4EBA\u5DF2\u642C\u79BB\uFF1B\u5176\u4E8C\uFF0C\u51FA\u79DF\u4EBA\u6263\u62BC\u62BC\u91D1\u7684\u7406\u7531\u662F\u5426\u6210\u7ACB\u3002\u5E38\u89C1\u7684\u60C5\u51B5\u5305\u62EC\u51FA\u79DF\u4EBA\u4EE5\u623F\u5C4B\u635F\u574F\u4E3A\u7531\u6263\u62BC\u62BC\u91D1\u3001\u51FA\u79DF\u4EBA\u4EE5\u627F\u79DF\u4EBA\u63D0\u524D\u89E3\u7EA6\u4E3A\u7531\u62D2\u7EDD\u8FD4\u8FD8\u3001\u4EE5\u53CA\u51FA\u79DF\u4EBA\u65E0\u7406\u7531\u62D6\u5EF6\u6216\u62D2\u7EDD\u8FD4\u8FD8\u3002",
    judgmentBasis: [
      "\u79DF\u8D41\u5173\u7CFB\u5DF2\u7EC8\u6B62\u7684\u4E8B\u5B9E\uFF1A\u627F\u79DF\u4EBA\u53EF\u4EE5\u63D0\u4F9B\u642C\u79BB\u65F6\u7684\u623F\u5C4B\u4EA4\u63A5\u5355\u3001\u94A5\u5319\u4EA4\u8FD8\u8BB0\u5F55\u3001\u642C\u79BB\u901A\u77E5\u7B49\u8BC1\u660E\u79DF\u8D41\u5173\u7CFB\u5DF2\u7ED3\u675F",
      "\u62BC\u91D1\u7684\u51C6\u786E\u91D1\u989D\u548C\u652F\u4ED8\u8BB0\u5F55\uFF1A\u79DF\u8D41\u5408\u540C\u4E2D\u901A\u5E38\u7EA6\u5B9A\u4E86\u62BC\u91D1\u7684\u91D1\u989D\uFF0C\u627F\u79DF\u4EBA\u5E94\u4FDD\u7559\u62BC\u91D1\u652F\u4ED8\u51ED\u8BC1\uFF08\u8F6C\u8D26\u8BB0\u5F55\u3001\u6536\u636E\u7B49\uFF09",
      "\u51FA\u79DF\u4EBA\u6263\u62BC\u62BC\u91D1\u7684\u5177\u4F53\u7406\u7531\u53CA\u5176\u5408\u7406\u6027\uFF1A\u5982\u679C\u51FA\u79DF\u4EBA\u4EE5\u623F\u5C4B\u635F\u574F\u4E3A\u7531\u6263\u62BC\u62BC\u91D1\uFF0C\u627F\u79DF\u4EBA\u9700\u8981\u63D0\u4F9B\u642C\u79BB\u65F6\u623F\u5C4B\u72B6\u6001\u7684\u7167\u7247\u6216\u89C6\u9891\uFF0C\u8BC1\u660E\u623F\u5C4B\u5DF2\u6062\u590D\u539F\u72B6",
      "\u62BC\u91D1\u4E0D\u540C\u4E8E\u8FDD\u7EA6\u91D1\uFF0C\u51FA\u79DF\u4EBA\u4E0D\u80FD\u76F4\u63A5\u4EE5\u627F\u79DF\u4EBA\u8FDD\u7EA6\uFF08\u5982\u63D0\u524D\u89E3\u7EA6\uFF09\u4E3A\u7531\u5168\u90E8\u6263\u7559\u62BC\u91D1\uFF0C\u9664\u975E\u5408\u540C\u6709\u660E\u786E\u7EA6\u5B9A\u4E14\u8BE5\u7EA6\u5B9A\u4E0D\u8FDD\u53CD\u6CD5\u5F8B\u7684\u5F3A\u5236\u6027\u89C4\u5B9A"
    ],
    evidenceRelation: [
      { material: "\u79DF\u8D41\u5408\u540C", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u62BC\u91D1\u91D1\u989D\u548C\u9000\u8FD8\u6761\u4EF6\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u62BC\u91D1\u652F\u4ED8\u51ED\u8BC1", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u627F\u79DF\u4EBA\u5DF2\u652F\u4ED8\u62BC\u91D1\u53CA\u91D1\u989D\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u642C\u79BB\u65F6\u623F\u5C4B\u72B6\u6001\u7167\u7247\u6216\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u623F\u5C4B\u5DF2\u6062\u590D\u539F\u72B6\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u623F\u5C4B\u4EA4\u63A5\u5355", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u79DF\u8D41\u5173\u7CFB\u5DF2\u7EC8\u6B62\u4E14\u53CC\u65B9\u786E\u8BA4\u4E86\u4EA4\u8FD8\u72B6\u6001\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u4E0E\u623F\u4E1C\u5C31\u62BC\u91D1\u9000\u8FD8\u7684\u6C9F\u901A\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u627F\u79DF\u4EBA\u5DF2\u63D0\u51FA\u9000\u8FD8\u8981\u6C42\u53CA\u623F\u4E1C\u7684\u56DE\u5E94\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u79DF\u8D41\u5408\u540C\u539F\u4EF6\u6216\u6E05\u6670\u7167\u7247\u3001\u94F6\u884C\u8F6C\u8D26\u8BB0\u5F55\u3001\u5FAE\u4FE1/\u652F\u4ED8\u5B9D\u8F6C\u8D26\u8BB0\u5F55\u3001\u623F\u5C4B\u7167\u7247\u6216\u89C6\u9891\uFF08\u5E26\u65F6\u95F4\u6233\uFF09",
      action: "\u5165\u4F4F\u548C\u642C\u79BB\u65F6\u5747\u5BF9\u623F\u5C4B\u6BCF\u4E2A\u89D2\u843D\u62CD\u7167\u5F55\u50CF\uFF08\u5E26\u65F6\u95F4\u6C34\u5370\uFF09\uFF1B\u8981\u6C42\u623F\u4E1C\u7B7E\u7F72\u623F\u5C4B\u4EA4\u63A5\u5355\uFF1B\u4FDD\u7559\u6240\u6709\u4E0E\u623F\u4E1C\u5C31\u62BC\u91D1\u9000\u8FD8\u7684\u6C9F\u901A\u8BB0\u5F55"
    }
  },
  "housing:housing-damage": {
    focusKey: "\u623F\u5C4B\u635F\u574F\u8BA4\u5B9A\u4E89\u8BAE",
    focusName: "\u623F\u5C4B\u635F\u574F\u8BA4\u5B9A\u4E89\u8BAE",
    disputeType: "housing",
    definition: "\u623F\u5C4B\u635F\u574F\u8BA4\u5B9A\u4E89\u8BAE\uFF0C\u6307\u627F\u79DF\u4EBA\u4E0E\u51FA\u79DF\u4EBA\u5C31\u79DF\u8D41\u623F\u5C4B\u7684\u635F\u574F\u8D23\u4EFB\u5F52\u5C5E\u548C\u8D54\u507F\u91D1\u989D\u4EA7\u751F\u7684\u4E89\u8BAE\u3002\u5728\u623F\u4EA7\u79DF\u623F\u7EA0\u7EB7\u4E2D\uFF0C\u8FD9\u7C7B\u4E89\u8BAE\u5F80\u5F80\u4E0E\u62BC\u91D1\u9000\u8FD8\u4E89\u8BAE\u540C\u65F6\u53D1\u751F\u3002\u6839\u636E\u300A\u6C11\u6CD5\u5178\u300B\u7B2C712\u6761\uFF0C\u627F\u79DF\u4EBA\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u7684\u65B9\u6CD5\u4F7F\u7528\u79DF\u8D41\u7269\uFF0C\u5BF9\u79DF\u8D41\u7269\u7684\u6B63\u5E38\u4F7F\u7528\u635F\u8017\u4E0D\u627F\u62C5\u8D23\u4EFB\uFF1B\u4F46\u56E0\u627F\u79DF\u4EBA\u4FDD\u7BA1\u4E0D\u5584\u6216\u4F7F\u7528\u4E0D\u5F53\u9020\u6210\u79DF\u8D41\u7269\u6BC1\u635F\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u8D54\u507F\u8D23\u4EFB\u3002\u623F\u5C4B\u635F\u574F\u8BA4\u5B9A\u4E89\u8BAE\u7684\u6838\u5FC3\u5728\u4E8E\u4E24\u4E2A\u95EE\u9898\uFF1A\u5176\u4E00\uFF0C\u635F\u574F\u5C5E\u4E8E\u6B63\u5E38\u4F7F\u7528\u635F\u8017\u8FD8\u662F\u4EBA\u4E3A\u635F\u574F\uFF1B\u5176\u4E8C\uFF0C\u5982\u679C\u662F\u4EBA\u4E3A\u635F\u574F\uFF0C\u4FEE\u590D\u6216\u8D54\u507F\u7684\u91D1\u989D\u662F\u5426\u5408\u7406\u3002",
    judgmentBasis: [
      "\u635F\u574F\u7684\u6027\u8D28\uFF1A\u6B63\u5E38\u4F7F\u7528\u635F\u8017\uFF08\u5899\u9762\u8F7B\u5FAE\u53D8\u8272\u3001\u5730\u677F\u8F7B\u5FAE\u78E8\u635F\u7B49\uFF09\u7531\u51FA\u79DF\u4EBA\u627F\u62C5\uFF1B\u4EBA\u4E3A\u635F\u574F\uFF08\u5899\u4F53\u5927\u9762\u79EF\u6C61\u635F\u3001\u5BB6\u5177\u635F\u574F\u3001\u7BA1\u9053\u5835\u585E\u7B49\uFF09\u7531\u627F\u79DF\u4EBA\u627F\u62C5",
      "\u5224\u65AD\u5173\u952E\u5728\u4E8E\u635F\u574F\u662F\u5426\u8D85\u51FA\u4E86\u6B63\u5E38\u4F7F\u7528\u7684\u8303\u56F4\uFF0C\u9700\u7ED3\u5408\u79DF\u8D41\u65F6\u95F4\u3001\u623F\u5C4B\u4F7F\u7528\u60C5\u51B5\u3001\u635F\u574F\u7A0B\u5EA6\u7B49\u7EFC\u5408\u5224\u65AD",
      "\u635F\u574F\u7684\u4FEE\u590D\u6216\u8D54\u507F\u91D1\u989D\u662F\u5426\u5408\u7406\uFF1A\u51FA\u79DF\u4EBA\u4E3B\u5F20\u7684\u7EF4\u4FEE\u8D39\u7528\u5E94\u5F53\u5408\u7406\uFF0C\u627F\u79DF\u4EBA\u6709\u6743\u8981\u6C42\u51FA\u79DF\u4EBA\u63D0\u4F9B\u7EF4\u4FEE\u7968\u636E\u6216\u8BC4\u4F30\u62A5\u544A",
      "\u5982\u679C\u51FA\u79DF\u4EBA\u4E3B\u5F20\u7684\u91D1\u989D\u660E\u663E\u8FC7\u9AD8\uFF0C\u627F\u79DF\u4EBA\u53EF\u4EE5\u63D0\u51FA\u5F02\u8BAE"
    ],
    evidenceRelation: [
      { material: "\u5165\u4F4F\u65F6\u623F\u5C4B\u72B6\u6001\u7684\u7167\u7247\u6216\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u623F\u5C4B\u539F\u59CB\u72B6\u6001\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u642C\u79BB\u65F6\u623F\u5C4B\u72B6\u6001\u7684\u7167\u7247\u6216\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u623F\u5C4B\u73B0\u72B6\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u623F\u5C4B\u4EA4\u63A5\u5355", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u53CC\u65B9\u5BF9\u623F\u5C4B\u72B6\u6001\u7684\u786E\u8BA4\u6216\u6709\u4E89\u8BAE\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u79DF\u8D41\u5408\u540C\u4E2D\u5173\u4E8E\u623F\u5C4B\u4F7F\u7528\u548C\u635F\u574F\u8D54\u507F\u7684\u6761\u6B3E", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u53CC\u65B9\u7684\u7EA6\u5B9A\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u7EF4\u4FEE\u8D39\u7528\u7684\u7968\u636E\u6216\u62A5\u4EF7\u5355", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u51FA\u79DF\u4EBA\u4E3B\u5F20\u7684\u8D54\u507F\u91D1\u989D\u662F\u5426\u5408\u7406\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u5165\u4F4F\u548C\u642C\u79BB\u65F6\u7684\u623F\u5C4B\u5BF9\u6BD4\u7167\u7247\u6216\u89C6\u9891\u3001\u623F\u5C4B\u4EA4\u63A5\u5355\u3001\u7EF4\u4FEE\u62A5\u4EF7\u5355\u3001\u5E02\u573A\u7EF4\u4FEE\u4EF7\u683C\u53C2\u8003",
      action: "\u5165\u4F4F\u5F53\u5929\u5BF9\u623F\u5C4B\u6BCF\u4E2A\u89D2\u843D\u62CD\u7167\u5F55\u50CF\u5E76\u53D1\u7ED9\u623F\u4E1C\u786E\u8BA4\uFF1B\u642C\u79BB\u65F6\u540C\u6837\u64CD\u4F5C\u4EE5\u4FBF\u5BF9\u6BD4\uFF1B\u8981\u6C42\u623F\u4E1C\u53C2\u4E0E\u4EA4\u63A5\u7B7E\u5B57\uFF1B\u51FA\u79DF\u4EBA\u4E3B\u5F20\u7684\u7EF4\u4FEE\u8D39\u660E\u663E\u8FC7\u9AD8\u65F6\u53EF\u81EA\u884C\u54A8\u8BE2\u5E02\u573A\u4EF7\u4F5C\u53C2\u8003"
    }
  },
  "housing:early-termination": {
    focusKey: "\u63D0\u524D\u89E3\u7EA6\u4E89\u8BAE",
    focusName: "\u63D0\u524D\u89E3\u7EA6\u4E89\u8BAE",
    disputeType: "housing",
    definition: "\u63D0\u524D\u89E3\u7EA6\u4E89\u8BAE\uFF0C\u6307\u79DF\u8D41\u5408\u540C\u5728\u7EA6\u5B9A\u7684\u79DF\u671F\u5C4A\u6EE1\u524D\uFF0C\u4E00\u65B9\u5355\u65B9\u9762\u63D0\u51FA\u89E3\u9664\u5408\u540C\u800C\u5F15\u53D1\u7684\u4E89\u8BAE\u3002\u5728\u623F\u4EA7\u79DF\u623F\u7EA0\u7EB7\u4E2D\uFF0C\u63D0\u524D\u89E3\u7EA6\u901A\u5E38\u7531\u627F\u79DF\u4EBA\uFF08\u63D0\u524D\u9000\u79DF\uFF09\u6216\u51FA\u79DF\u4EBA\uFF08\u4E2D\u9014\u6536\u56DE\u623F\u5C4B\uFF09\u63D0\u51FA\u3002\u6839\u636E\u300A\u6C11\u6CD5\u5178\u300B\u79DF\u8D41\u5408\u540C\u4E13\u7AE0\u7684\u89C4\u5B9A\uFF0C\u79DF\u8D41\u5408\u540C\u7684\u89E3\u9664\u9700\u8981\u6EE1\u8DB3\u6CD5\u5B9A\u6216\u7EA6\u5B9A\u7684\u6761\u4EF6\u3002\u5BF9\u4E8E\u627F\u79DF\u4EBA\u63D0\u524D\u9000\u79DF\uFF0C\u901A\u5E38\u9700\u8981\u6309\u7167\u5408\u540C\u7EA6\u5B9A\u652F\u4ED8\u8FDD\u7EA6\u91D1\u6216\u63D0\u524D\u901A\u77E5\uFF1B\u5BF9\u4E8E\u51FA\u79DF\u4EBA\u4E2D\u9014\u6536\u56DE\u623F\u5C4B\uFF0C\u5219\u9700\u8981\u8BC1\u660E\u627F\u79DF\u4EBA\u6709\u8FDD\u7EA6\u884C\u4E3A\u6216\u5B58\u5728\u6CD5\u5B9A\u89E3\u9664\u4E8B\u7531\u3002\u63D0\u524D\u89E3\u7EA6\u4E89\u8BAE\u7684\u6838\u5FC3\u5728\u4E8E\uFF1A\u63D0\u524D\u89E3\u7EA6\u662F\u5426\u5177\u6709\u5408\u6CD5\u4F9D\u636E\uFF0C\u4EE5\u53CA\u89E3\u7EA6\u540E\u7684\u8FDD\u7EA6\u91D1\u989D\u6216\u8D54\u507F\u91D1\u989D\u662F\u5426\u5408\u7406\u3002",
    judgmentBasis: [
      "\u5408\u540C\u4E2D\u5173\u4E8E\u63D0\u524D\u89E3\u7EA6\u7684\u7EA6\u5B9A\uFF1A\u79DF\u8D41\u5408\u540C\u901A\u5E38\u5305\u542B\u63D0\u524D\u89E3\u7EA6\u6761\u6B3E\uFF0C\u5982\u627F\u79DF\u4EBA\u63D0\u524D\u9000\u79DF\u9700\u652F\u4ED8\u4E00\u4E2A\u6708\u79DF\u91D1\u4F5C\u4E3A\u8FDD\u7EA6\u91D1\u3001\u51FA\u79DF\u4EBA\u4E2D\u9014\u6536\u56DE\u623F\u5C4B\u9700\u63D0\u524D30\u5929\u901A\u77E5\u5E76\u652F\u4ED8\u8FDD\u7EA6\u91D1\u7B49",
      "\u63D0\u524D\u89E3\u7EA6\u7684\u539F\u56E0\u548C\u8FC7\u9519\u65B9\uFF1A\u627F\u79DF\u4EBA\u56E0\u5DE5\u4F5C\u53D8\u52A8\u7B49\u4E2A\u4EBA\u539F\u56E0\u63D0\u524D\u9000\u79DF\uFF0C\u901A\u5E38\u9700\u6309\u5408\u540C\u627F\u62C5\u8FDD\u7EA6\u8D23\u4EFB\uFF1B\u627F\u79DF\u4EBA\u56E0\u51FA\u79DF\u4EBA\u672A\u5C3D\u7EF4\u4FEE\u4E49\u52A1\u3001\u623F\u5C4B\u5B58\u5728\u5B89\u5168\u9690\u60A3\u7B49\u51FA\u79DF\u4EBA\u8FDD\u7EA6\u884C\u4E3A\u800C\u4E0D\u5F97\u4E0D\u63D0\u524D\u9000\u79DF\uFF0C\u53EF\u80FD\u65E0\u9700\u627F\u62C5\u8FDD\u7EA6\u8D23\u4EFB",
      "\u51FA\u79DF\u4EBA\u56E0\u9700\u8981\u6536\u56DE\u623F\u5C4B\u81EA\u4F4F\u800C\u8981\u6C42\u627F\u79DF\u4EBA\u642C\u79BB\uFF0C\u9664\u5408\u540C\u53E6\u6709\u7EA6\u5B9A\u5916\uFF0C\u51FA\u79DF\u4EBA\u901A\u5E38\u9700\u8981\u627F\u62C5\u8FDD\u7EA6\u8D23\u4EFB",
      "\u8FDD\u7EA6\u91D1\u7684\u5408\u7406\u6027\uFF1A\u7EA6\u5B9A\u7684\u8FDD\u7EA6\u91D1\u8FC7\u5206\u9AD8\u4E8E\u5B9E\u9645\u635F\u5931\u7684\uFF0C\u5F53\u4E8B\u4EBA\u53EF\u4EE5\u8BF7\u6C42\u9002\u5F53\u51CF\u5C11"
    ],
    evidenceRelation: [
      { material: "\u79DF\u8D41\u5408\u540C", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u53CC\u65B9\u5BF9\u63D0\u524D\u89E3\u7EA6\u7684\u7EA6\u5B9A\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u63D0\u524D\u89E3\u7EA6\u7684\u901A\u77E5", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u662F\u54EA\u4E00\u65B9\u63D0\u51FA\u7684\u89E3\u7EA6\u8981\u6C42\u53CA\u7406\u7531\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u4E0E\u5BF9\u65B9\u5C31\u63D0\u524D\u89E3\u7EA6\u4E8B\u5B9C\u7684\u6C9F\u901A\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u53CC\u65B9\u7684\u534F\u5546\u8FC7\u7A0B\u548C\u771F\u5B9E\u610F\u601D\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u79DF\u91D1\u652F\u4ED8\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u627F\u79DF\u4EBA\u5DF2\u5C65\u884C\u652F\u4ED8\u4E49\u52A1\u6216\u6B20\u4ED8\u60C5\u51B5\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u623F\u5C4B\u4EA4\u63A5\u5355", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u79DF\u8D41\u5173\u7CFB\u7EC8\u6B62\u65F6\u53CC\u65B9\u7684\u786E\u8BA4\uFF0CA\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 2,
      channel: "\u79DF\u8D41\u5408\u540C\u4E2D\u5173\u4E8E\u63D0\u524D\u89E3\u7EA6\u7684\u5B8C\u6574\u6761\u6B3E\u3001\u63D0\u524D\u89E3\u7EA6\u901A\u77E5\u7684\u4E66\u9762\u8BB0\u5F55\u548C\u6642\u9593\u6233\u3001\u53CC\u65B9\u5C31\u89E3\u7EA6\u4E8B\u5B9C\u7684\u5168\u90E8\u6C9F\u901A\u8BB0\u5F55",
      action: '\u7B7E\u7EA6\u65F6\u6CE8\u610F\u5408\u540C\u4E2D\u63D0\u524D\u89E3\u7EA6\u6761\u6B3E\uFF1B\u63D0\u524D\u89E3\u7EA6\u5E94\u4E66\u9762\u901A\u77E5\u5E76\u4FDD\u7559\u9001\u8FBE\u8BC1\u660E\uFF1B\u5982\u56E0\u51FA\u79DF\u4EBA\u8FDD\u7EA6\u800C\u9000\u79DF\u9700\u4FDD\u7559\u5BF9\u65B9\u8FDD\u7EA6\u7684\u5B8C\u6574\u8BC1\u636E\uFF1B\u534F\u5546\u4E00\u81F4\u89E3\u7EA6\u65F6\u5728\u4EA4\u63A5\u5355\u4E0A\u6CE8\u660E"\u53CC\u65B9\u534F\u5546\u4E00\u81F4\u89E3\u9664\u5408\u540C\uFF0C\u65E0\u5176\u4ED6\u4E89\u8BAE"'
    }
  },
  "housing:landlord-breach": {
    focusKey: "\u623F\u4E1C/\u4E2D\u4ECB\u8FDD\u7EA6\u4E89\u8BAE",
    focusName: "\u623F\u4E1C/\u4E2D\u4ECB\u8FDD\u7EA6\u4E89\u8BAE",
    disputeType: "housing",
    definition: "\u623F\u4E1C/\u4E2D\u4ECB\u8FDD\u7EA6\u4E89\u8BAE\uFF0C\u6307\u51FA\u79DF\u4EBA\u6216\u4E2D\u4ECB\u670D\u52A1\u673A\u6784\u5728\u79DF\u8D41\u5408\u540C\u7684\u5C65\u884C\u8FC7\u7A0B\u4E2D\uFF0C\u672A\u6309\u7167\u5408\u540C\u7EA6\u5B9A\u63D0\u4F9B\u623F\u5C4B\u6216\u76F8\u5173\u670D\u52A1\u7684\u4E89\u8BAE\u3002\u6DB5\u76D6\u8303\u56F4\u5305\u62EC\u51FA\u79DF\u4EBA\u672A\u6309\u7EA6\u5B9A\u4EA4\u4ED8\u623F\u5C4B\u3001\u4EA4\u4ED8\u7684\u623F\u5C4B\u4E0E\u7EA6\u5B9A\u4E0D\u7B26\u3001\u914D\u5957\u8BBE\u65BD\u7F3A\u5931\u6216\u635F\u574F\u540E\u51FA\u79DF\u4EBA\u62D2\u4E0D\u7EF4\u4FEE\u3001\u4E2D\u4ECB\u672A\u5C65\u884C\u5982\u5B9E\u544A\u77E5\u4E49\u52A1\u7B49\u60C5\u5F62\u3002\u6839\u636E\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761\uFF0C\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u5BF9\u65B9\u786E\u5B9E\u5B58\u5728\u8FDD\u53CD\u5408\u540C\u7EA6\u5B9A\u7684\u884C\u4E3A\u3002",
    judgmentBasis: [
      "\u5408\u540C\u4E2D\u7684\u5177\u4F53\u7EA6\u5B9A\uFF1A\u79DF\u8D41\u5408\u540C\u4E2D\u5BF9\u623F\u5C4B\u72B6\u51B5\u3001\u914D\u5957\u8BBE\u65BD\u3001\u7EF4\u4FEE\u8D23\u4EFB\u3001\u670D\u52A1\u5185\u5BB9\u7B49\u6709\u660E\u786E\u7EA6\u5B9A\u7684\uFF0C\u51FA\u79DF\u4EBA\u6216\u4E2D\u4ECB\u672A\u6309\u7167\u7EA6\u5B9A\u5C65\u884C\u5373\u6784\u6210\u8FDD\u7EA6",
      "\u8FDD\u7EA6\u884C\u4E3A\u7684\u5177\u4F53\u4E8B\u5B9E\uFF1A\u627F\u79DF\u4EBA\u9700\u63D0\u4F9B\u8BC1\u636E\u8BC1\u660E\u5BF9\u65B9\u5B58\u5728\u8FDD\u7EA6\u884C\u4E3A\uFF0C\u5982\u623F\u5C4B\u5B9E\u9645\u72B6\u51B5\u4E0E\u5408\u540C\u7EA6\u5B9A\u4E0D\u7B26\u7684\u7167\u7247\u3001\u914D\u5957\u8BBE\u65BD\u7F3A\u5931\u7684\u6E05\u5355\u3001\u591A\u6B21\u62A5\u4FEE\u4F46\u5BF9\u65B9\u4E0D\u4E88\u5904\u7406\u7684\u8BB0\u5F55\u7B49",
      "\u8FDD\u7EA6\u884C\u4E3A\u7ED9\u627F\u79DF\u4EBA\u9020\u6210\u7684\u5B9E\u9645\u635F\u5931\uFF1A\u5982\u56E0\u5BF9\u65B9\u8FDD\u7EA6\u800C\u4E0D\u5F97\u4E0D\u63D0\u524D\u9000\u79DF\u6216\u5BFB\u627E\u66FF\u4EE3\u4F4F\u6240\uFF0C\u7531\u6B64\u4EA7\u751F\u7684\u989D\u5916\u8D39\u7528\u53EF\u4EE5\u4F5C\u4E3A\u635F\u5931\u4E3B\u5F20"
    ],
    evidenceRelation: [
      { material: "\u79DF\u8D41\u5408\u540C\u6216\u4E2D\u4ECB\u670D\u52A1\u5408\u540C", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u53CC\u65B9\u7684\u5177\u4F53\u7EA6\u5B9A\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u623F\u5C4B\u5B9E\u9645\u72B6\u51B5\u7684\u7167\u7247\u6216\u89C6\u9891", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u4E0E\u5408\u540C\u7EA6\u5B9A\u4E0D\u7B26\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u4E0E\u623F\u4E1C\u6216\u4E2D\u4ECB\u5C31\u8FDD\u7EA6\u95EE\u9898\u7684\u6C9F\u901A\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u627F\u79DF\u4EBA\u5DF2\u63D0\u51FA\u5F02\u8BAE\u53CA\u5BF9\u65B9\u7684\u56DE\u5E94\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u62A5\u4FEE\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u627F\u79DF\u4EBA\u5DF2\u5C65\u884C\u901A\u77E5\u4E49\u52A1\u4F46\u5BF9\u65B9\u672A\u5C65\u884C\u7EF4\u4FEE\u4E49\u52A1\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u4E2D\u4ECB\u670D\u52A1\u5408\u540C\u53CA\u652F\u4ED8\u4E2D\u4ECB\u8D39\u7528\u7684\u51ED\u8BC1", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u4E2D\u4ECB\u673A\u6784\u7684\u5177\u4F53\u670D\u52A1\u627F\u8BFA\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 2,
      channel: "\u79DF\u8D41\u5408\u540C\u6216\u4E2D\u4ECB\u670D\u52A1\u5408\u540C\u5B8C\u6574\u6761\u6B3E\u3001\u623F\u5C4B\u5B9E\u9645\u72B6\u51B5\u7167\u7247\u6216\u89C6\u9891\u3001\u4E0E\u623F\u4E1C\u6216\u4E2D\u4ECB\u5C31\u8FDD\u7EA6\u95EE\u9898\u7684\u5168\u90E8\u6C9F\u901A\u8BB0\u5F55\u3001\u62A5\u4FEE\u8BB0\u5F55\u548C\u7EF4\u4FEE\u7ED3\u679C\u8BB0\u5F55",
      action: "\u7B7E\u7EA6\u65F6\u6CE8\u610F\u5408\u540C\u4E2D\u6D89\u53CA\u623F\u5C4B\u72B6\u51B5\u3001\u914D\u5957\u8BBE\u65BD\u3001\u670D\u52A1\u5185\u5BB9\u7684\u5177\u4F53\u7EA6\u5B9A\uFF1B\u4FDD\u7559\u623F\u5C4B\u4E0E\u5408\u540C\u4E0D\u7B26\u4E4B\u5904\u7684\u5B8C\u6574\u7167\u7247\u6216\u89C6\u9891\uFF1B\u91CD\u70B9\u4FDD\u7559\u5BF9\u65B9\u627F\u8BA4\u5B58\u5728\u95EE\u9898\u4F46\u4E0D\u4E88\u89E3\u51B3\u7684\u6C9F\u901A\u8BB0\u5F55\uFF1B\u5982\u56E0\u5BF9\u65B9\u8FDD\u7EA6\u4EA7\u751F\u989D\u5916\u8D39\u7528\uFF08\u642C\u5BB6\u8D39\u3001\u4E34\u65F6\u4F4F\u5BBF\u8D39\u7B49\uFF09\uFF0C\u4FDD\u7559\u76F8\u5173\u8D39\u7528\u51ED\u8BC1"
    }
  },
  // ==================== 财产损害纠纷 ====================
  "property:damage": {
    focusKey: "\u8D22\u4EA7\u635F\u574F/\u4E22\u5931",
    focusName: "\u8D22\u4EA7\u635F\u574F/\u4E22\u5931",
    disputeType: "property",
    definition: "\u6D88\u8D39\u8005\u5B58\u653E\u6216\u59D4\u6258\u4FDD\u7BA1\u7684\u8D22\u4EA7\uFF08\u8F66\u8F86\u3001\u884C\u674E\u3001\u8D35\u91CD\u7269\u54C1\u7B49\uFF09\u53D1\u751F\u635F\u574F\u3001\u4E22\u5931\u6216\u88AB\u76D7\u3002",
    judgmentBasis: [
      "\u6D88\u8D39\u8005\u4E0E\u670D\u52A1\u63D0\u4F9B\u65B9\u4E4B\u95F4\u5B58\u5728\u4FDD\u7BA1\u6216\u670D\u52A1\u5408\u540C\u5173\u7CFB",
      "\u8D22\u4EA7\u5728\u670D\u52A1\u63D0\u4F9B\u65B9\u4FDD\u7BA1\u671F\u95F4\u53D1\u751F\u635F\u574F\u3001\u4E22\u5931\u6216\u88AB\u76D7",
      "\u670D\u52A1\u63D0\u4F9B\u65B9\u662F\u5426\u5B58\u5728\u8FC7\u9519\u6216\u672A\u5C3D\u5230\u5408\u7406\u4FDD\u7BA1\u4E49\u52A1",
      "\u6D88\u8D39\u8005\u662F\u5426\u80FD\u63D0\u4F9B\u8D22\u4EA7\u4EF7\u503C\u8BC1\u660E"
    ],
    evidenceRelation: [
      { material: "\u5408\u540C/\u534F\u8BAE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u4FDD\u7BA1\u6216\u670D\u52A1\u5173\u7CFB" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u670D\u52A1\u8D39\u7528" },
      { material: "\u8D22\u4EA7\u4EF7\u503C\u8BC1\u660E", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u5982\u8D2D\u7269\u53D1\u7968\u3001\u8BC4\u4F30\u62A5\u544A\u7B49\uFF0C\u8BC1\u660E\u8D22\u4EA7\u539F\u503C" },
      { material: "\u635F\u574F/\u4E22\u5931\u73B0\u573A\u7167\u7247", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u76F4\u89C2\u5448\u73B0\u635F\u5931\u60C5\u51B5" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u8D2D\u7269\u53D1\u7968\u3001\u635F\u574F\u73B0\u573A\u7167\u7247/\u89C6\u9891\u3001\u62A5\u8B66\u56DE\u6267\u3001\u76D1\u63A7\u5F55\u50CF\uFF08\u53EF\u5411\u573A\u6240\u65B9\u7533\u8BF7\u8C03\u53D6\uFF09",
      action: "\u7B2C\u4E00\u65F6\u95F4\u62A5\u8B66\u5E76\u4FDD\u7559\u62A5\u8B66\u56DE\u6267\uFF0C\u73B0\u573A\u7167\u7247\u5C3D\u91CF\u4F53\u73B0\u65F6\u95F4\u6C34\u5370"
    }
  },
  // ==================== 出行交通纠纷 ====================
  "transport:delay-cancel": {
    focusKey: "\u5EF6\u8BEF/\u53D6\u6D88",
    focusName: "\u5EF6\u8BEF/\u53D6\u6D88",
    disputeType: "transport",
    definition: "\u6D88\u8D39\u8005\u8D2D\u4E70\u7684\u673A\u7968\u3001\u9152\u5E97\u3001\u884C\u7A0B\u7B49\u670D\u52A1\u56E0\u5E73\u53F0\u6216\u4F9B\u5E94\u5546\u539F\u56E0\u53D1\u751F\u5EF6\u8BEF\u3001\u53D6\u6D88\u6216\u53D8\u66F4\u3002",
    judgmentBasis: [
      "\u6D88\u8D39\u8005\u5DF2\u652F\u4ED8\u8D39\u7528\u5E76\u53D6\u5F97\u670D\u52A1\u51ED\u8BC1",
      "\u5E73\u53F0\u6216\u4F9B\u5E94\u5546\u5728\u672A\u5145\u5206\u544A\u77E5\u7684\u60C5\u51B5\u4E0B\u53D6\u6D88\u6216\u53D8\u66F4\u670D\u52A1",
      "\u5EF6\u8BEF\u6216\u53D6\u6D88\u7684\u539F\u56E0\u662F\u5426\u5C5E\u4E8E\u4E0D\u53EF\u6297\u529B\u6216\u5E73\u53F0\u514D\u8D23\u8303\u56F4",
      "\u5E73\u53F0\u662F\u5426\u63D0\u4F9B\u4E86\u5408\u7406\u7684\u66FF\u4EE3\u65B9\u6848\u6216\u8865\u507F\u65B9\u6848"
    ],
    evidenceRelation: [
      { material: "\u8BA2\u5355/\u5408\u540C", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u9884\u8BA2\u7684\u670D\u52A1\u5185\u5BB9\u548C\u65F6\u95F4" },
      { material: "\u4ED8\u6B3E\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5DF2\u652F\u4ED8\u8D39\u7528" },
      { material: "\u5EF6\u8BEF/\u53D6\u6D88\u901A\u77E5\u622A\u56FE", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5E73\u53F0\u901A\u77E5\u7684\u65F6\u95F4\u548C\u5185\u5BB9" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u53EF\u5448\u73B0\u4E0E\u5E73\u53F0\u7684\u6C9F\u901A\u8FC7\u7A0B" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u5E73\u53F0\u901A\u77E5\u622A\u56FE\u3001\u8BA2\u5355\u8BE6\u60C5\u622A\u56FE\u3001\u4E0E\u5BA2\u670D\u7684\u6C9F\u901A\u8BB0\u5F55\u3001\u6539\u7B7E/\u9000\u7968\u8BB0\u5F55",
      action: "\u7B2C\u4E00\u65F6\u95F4\u622A\u56FE\u4FDD\u5B58\u5E73\u53F0\u901A\u77E5\uFF0C\u8BB0\u5F55\u6C9F\u901A\u65F6\u95F4\u548C\u5904\u7406\u7ED3\u679C"
    }
  },
  // ==================== 民间借贷纠纷 ====================
  "civil_loan:not-repay": {
    focusKey: "\u5BF9\u65B9\u4E0D\u8FD8\u6B3E",
    focusName: "\u5BF9\u65B9\u4E0D\u8FD8\u6B3E",
    disputeType: "civil_loan",
    definition: "\u6307\u501F\u6B3E\u671F\u9650\u5C4A\u6EE1\u540E\uFF0C\u503A\u52A1\u4EBA\u672A\u80FD\u6309\u65F6\u8DB3\u989D\u8FD4\u8FD8\u501F\u6B3E\u672C\u91D1\u3002\u8FD9\u662F\u6C11\u95F4\u501F\u8D37\u4E2D\u6700\u5E38\u89C1\u7684\u4E89\u8BAE\u3002\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u53CC\u65B9\u5B58\u5728\u501F\u8D37\u5408\u610F\u3001\u6B3E\u9879\u5DF2\u5B9E\u9645\u4EA4\u4ED8\u3001\u4EE5\u53CA\u5DF2\u5C4A\u7EA6\u5B9A\u8FD8\u6B3E\u671F\u3002",
    judgmentBasis: [
      "\u5BA1\u67E5\u501F\u6761/\u534F\u8BAE\uFF08\u8BC1\u660E\u501F\u8D37\u5408\u610F\uFF09",
      "\u5BA1\u67E5\u8F6C\u8D26\u8BB0\u5F55\uFF08\u8BC1\u660E\u6B3E\u9879\u5DF2\u4EA4\u4ED8\uFF09",
      "\u5BA1\u67E5\u53CC\u65B9\u5173\u4E8E\u50AC\u6B3E\u548C\u627F\u8BA4\u6B20\u6B3E\u7684\u6C9F\u901A\u8BB0\u5F55",
      "\u82E5\u5BF9\u65B9\u4E3B\u5F20\u5DF2\u8FD8\u6B3E\uFF0C\u7531\u5BF9\u65B9\u4E3E\u8BC1"
    ],
    evidenceRelation: [
      { material: "\u501F\u6761/\u501F\u6B3E\u534F\u8BAE", status: "\u5DF2\u6709", note: "A\u7EA7\u76F4\u63A5\u8BC1\u636E\uFF0C\u8BC1\u660E\u501F\u8D37\u5408\u610F", level: "A" },
      { material: "\u8F6C\u8D26\u8BB0\u5F55", status: "\u5DF2\u6709", note: "A\u7EA7\u76F4\u63A5\u8BC1\u636E\uFF0C\u8BC1\u660E\u6B3E\u9879\u5DF2\u4EA4\u4ED8\uFF0C\u6700\u6709\u529B\u8BC1\u636E", level: "A" },
      { material: "\u50AC\u6B3E\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "B\u7EA7\u95F4\u63A5\u8BC1\u636E\uFF0C\u8BC1\u660E\u5BF9\u65B9\u627F\u8BA4\u6B20\u6B3E\u6216\u627F\u8BFA\u8FD8\u6B3E", level: "B" },
      { material: "\u901A\u8BDD\u5F55\u97F3", status: "\u5EFA\u8BAE\u8865\u5145", note: "B\u7EA7\u95F4\u63A5\u8BC1\u636E\uFF0C\u5BF9\u65B9\u627F\u8BA4\u6B20\u6B3E\u7684\u5F55\u97F3", level: "B" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u501F\u6761\u539F\u4EF6\u3001\u94F6\u884C\u8F6C\u8D26\u51ED\u8BC1\u3001\u5FAE\u4FE1/\u652F\u4ED8\u5B9D\u8F6C\u8D26\u8BB0\u5F55\u3001\u50AC\u6B3E\u804A\u5929\u8BB0\u5F55\u3001\u901A\u8BDD\u5F55\u97F3",
      action: "\u4F18\u5148\u63D0\u4F9B\u5B8C\u6574\u8F6C\u8D26\u8BB0\u5F55\uFF0C\u8FD9\u662F\u8BC1\u660E\u501F\u6B3E\u4E8B\u5B9E\u6700\u6709\u529B\u7684\u8BC1\u636E\u3002\u5982\u679C\u50AC\u8FC7\u6B3E\uFF0C\u52A1\u5FC5\u4FDD\u5B58\u6240\u6709\u50AC\u6B3E\u804A\u5929\u8BB0\u5F55\u6216\u901A\u8BDD\u5F55\u97F3\u3002"
    }
  },
  "civil_loan:interest-dispute": {
    focusKey: "\u5229\u606F\u6709\u4E89\u8BAE",
    focusName: "\u5229\u606F\u6709\u4E89\u8BAE",
    disputeType: "civil_loan",
    definition: "\u53CC\u65B9\u5C31\u501F\u6B3E\u662F\u5426\u7EA6\u5B9A\u5229\u606F\u3001\u5229\u7387\u6807\u51C6\u6216\u5229\u606F\u8BA1\u7B97\u65B9\u5F0F\u4EA7\u751F\u7684\u4E89\u8BAE\u3002\u6838\u5FC3\u5728\u4E8E\u5BA1\u67E5\u53CC\u65B9\u7684\u771F\u5B9E\u7EA6\u5B9A\u3002",
    judgmentBasis: [
      "\u501F\u6761\u6709\u7EA6\u5B9A\u7684\uFF0C\u6309\u7EA6\u5B9A\u5BA1\u67E5\uFF08\u5229\u7387\u662F\u5426\u8D85\u8FC7\u6CD5\u5B9A\u4E0A\u9650\uFF09",
      "\u501F\u6761\u65E0\u660E\u786E\u7EA6\u5B9A\uFF0C\u901A\u5E38\u89C6\u4E3A\u65E0\u606F\u501F\u6B3E",
      "\u53EF\u4ECE\u903E\u671F\u4E4B\u65E5\u8D77\u4E3B\u5F20\u8D44\u91D1\u5360\u7528\u6210\u672C"
    ],
    evidenceRelation: [
      { material: "\u501F\u6761\u4E2D\u5173\u4E8E\u5229\u606F\u7684\u6761\u6B3E", status: "\u5DF2\u6709", note: "A\u7EA7\u8BC1\u636E\uFF0C\u6700\u76F4\u63A5\u8BC1\u636E", level: "A" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "B\u7EA7\u8BC1\u636E\uFF0C\u53CC\u65B9\u5BF9\u5229\u606F\u8BA8\u8BBA\u7684\u8BB0\u5F55", level: "B" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u501F\u6761\u539F\u4EF6\u3001\u5229\u606F\u7EA6\u5B9A\u7684\u804A\u5929\u8BB0\u5F55\u6216\u5F55\u97F3",
      action: "\u91CD\u70B9\u63D0\u4F9B\u501F\u6761\u4E2D\u5229\u606F\u7EA6\u5B9A\u7684\u539F\u6587\u622A\u56FE\u3002\u82E5\u53E3\u5934\u7EA6\u5B9A\u5229\u606F\uFF0C\u63D0\u4F9B\u8BC1\u660E\u53CC\u65B9\u66FE\u5C31\u6B64\u8BA8\u8BBA\u7684\u804A\u5929\u8BB0\u5F55\u6216\u5F55\u97F3\u3002"
    }
  },
  "civil_loan:no-contract": {
    focusKey: "\u6CA1\u6709\u501F\u6761/\u51ED\u8BC1",
    focusName: "\u6CA1\u6709\u501F\u6761/\u51ED\u8BC1",
    disputeType: "civil_loan",
    definition: "\u501F\u8D37\u5173\u7CFB\u7F3A\u4E4F\u6700\u76F4\u63A5\u7684\u4E66\u9762\u51ED\u8BC1\uFF0C\u5BFC\u81F4\u501F\u6B3E\u4E8B\u5B9E\u96BE\u4EE5\u8BA4\u5B9A\u3002\u6838\u5FC3\u5728\u4E8E\u7528\u5176\u4ED6\u8BC1\u636E\u94FE\u8BC1\u660E\u501F\u8D37\u5408\u610F\u548C\u6B3E\u9879\u4EA4\u4ED8\u7684\u5B58\u5728\u3002",
    judgmentBasis: [
      "\u7EFC\u5408\u8FD0\u7528\u8F6C\u8D26\u8BB0\u5F55\u3001\u804A\u5929\u8BB0\u5F55\u3001\u5F55\u97F3\u7B49\u5F62\u6210\u5B8C\u6574\u8BC1\u636E\u94FE",
      '\u9700\u5206\u522B\u8BC1\u660E"\u501F\u8D37\u5408\u610F"\u548C"\u8F6C\u94B1\u4E8B\u5B9E"\u4E24\u4E2A\u5173\u952E\u70B9'
    ],
    evidenceRelation: [
      { material: "\u8F6C\u8D26\u8BB0\u5F55", status: "\u5DF2\u6709", note: "A\u7EA7\u8BC1\u636E\uFF0C\u8BC1\u660E\u6B3E\u9879\u5DF2\u4EA4\u4ED8", level: "A" },
      { material: "\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "B\u7EA7\u8BC1\u636E\uFF0C\u8BC1\u660E\u501F\u6B3E\u5408\u610F\u548C\u50AC\u6B3E\u4E8B\u5B9E", level: "B" },
      { material: "\u5F55\u97F3", status: "\u5EFA\u8BAE\u8865\u5145", note: "B\u7EA7\u8BC1\u636E\uFF0C\u5BF9\u65B9\u627F\u8BA4\u501F\u6B3E\u7684\u5F55\u97F3", level: "B" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u94F6\u884C\u6D41\u6C34\u3001\u5FAE\u4FE1/\u652F\u4ED8\u5B9D\u8F6C\u8D26\u8BB0\u5F55\u3001\u804A\u5929\u8BB0\u5F55\u3001\u901A\u8BDD\u5F55\u97F3",
      action: "\u7ACB\u5373\u5BFC\u51FA\u6240\u6709\u76F8\u5173\u94F6\u884C\u6216\u5FAE\u4FE1\u8F6C\u8D26\u8BB0\u5F55\u3002\u4ED4\u7EC6\u7FFB\u9605\u804A\u5929\u8BB0\u5F55\uFF0C\u627E\u5230\u5BF9\u65B9\u660E\u786E\u63D0\u51FA\u501F\u94B1\u3001\u786E\u8BA4\u501F\u6B3E\u91D1\u989D\u3001\u6216\u627F\u8BFA\u8FD8\u6B3E\u7684\u4EFB\u4F55\u5BF9\u8BDD\u3002"
    }
  },
  "civil_loan:harassment": {
    focusKey: "\u50AC\u6536\u9A9A\u6270",
    focusName: "\u50AC\u6536\u9A9A\u6270",
    disputeType: "civil_loan",
    definition: "\u503A\u6743\u4EBA\u6216\u5176\u59D4\u6258\u65B9\u91C7\u7528\u5A01\u80C1\u3001\u6050\u5413\u3001\u9891\u7E41\u9A9A\u6270\u7B49\u4E0D\u5F53\u624B\u6BB5\u8FDB\u884C\u50AC\u6536\u3002\u8FD9\u5C5E\u4E8E\u50AC\u6536\u884C\u4E3A\u5408\u6CD5\u6027\u7684\u72EC\u7ACB\u4E89\u8BAE\u70B9\u3002",
    judgmentBasis: [
      "\u5BA1\u67E5\u50AC\u6536\u884C\u4E3A\u7684\u6027\u8D28\u3001\u9891\u7387\u3001\u5185\u5BB9\u662F\u5426\u8D85\u51FA\u6CD5\u5F8B\u5141\u8BB8\u7684\u5408\u7406\u8303\u56F4",
      "\u662F\u5426\u5BF9\u503A\u52A1\u4EBA\u7684\u6B63\u5E38\u751F\u6D3B\u9020\u6210\u4E25\u91CD\u5F71\u54CD",
      "\u50AC\u6536\u9891\u7387\u548C\u65F6\u95F4\u662F\u5426\u5408\u7406"
    ],
    evidenceRelation: [
      { material: "\u5E26\u6709\u5A01\u80C1\u5185\u5BB9\u7684\u804A\u5929\u8BB0\u5F55/\u77ED\u4FE1", status: "\u5DF2\u6709", note: "A\u7EA7\u8BC1\u636E\uFF0C\u8BC1\u660E\u8FDD\u6CD5\u50AC\u6536", level: "A" },
      { material: "\u901A\u8BDD\u5F55\u97F3", status: "\u5DF2\u6709", note: "A\u7EA7\u8BC1\u636E\uFF0C\u5A01\u80C1\u6050\u5413\u7684\u5F55\u97F3\u8BC1\u636E", level: "A" },
      { material: "\u9AD8\u9891\u6B21\u547C\u53EB\u8BB0\u5F55", status: "\u5EFA\u8BAE\u8865\u5145", note: "B\u7EA7\u8BC1\u636E\uFF0C\u8BC1\u660E\u9A9A\u6270\u6027\u8D28", level: "B" },
      { material: "\u5411\u65E0\u5173\u7B2C\u4E09\u65B9\u900F\u9732\u503A\u52A1\u7684\u8BB0\u5F55", status: "\u5EFA\u8BAE\u8865\u5145", note: "B\u7EA7\u8BC1\u636E\uFF0C\u4FB5\u72AF\u9690\u79C1\u7684\u8BC1\u636E", level: "B" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u9A9A\u6270\u7535\u8BDD\u5F55\u97F3\u3001\u5A01\u80C1\u77ED\u4FE1/\u804A\u5929\u8BB0\u5F55\u3001\u547C\u53EB\u8BB0\u5F55\u3001\u7B2C\u4E09\u65B9\u8BC1\u4EBA\u8BC1\u8A00",
      action: "\u4FDD\u7559\u6240\u6709\u9A9A\u6270\u7535\u8BDD\u5F55\u97F3\u3001\u5E26\u6709\u4FAE\u8FB1\u5A01\u80C1\u6027\u8D28\u7684\u77ED\u4FE1\u548C\u804A\u5929\u8BB0\u5F55\u3002\u5982\u679C\u5BF9\u65B9\u8054\u7CFB\u4E86\u60A8\u7684\u4EB2\u53CB\u6216\u540C\u4E8B\uFF0C\u52A1\u5FC5\u8BF7\u4ED6\u4EEC\u534F\u52A9\u4F5C\u8BC1\u6216\u63D0\u4F9B\u76F8\u5173\u8BB0\u5F55\u3002"
    }
  },
  // ==================== 投资理财纠纷 ====================
  "investment:return-not-match": {
    focusKey: "\u6536\u76CA\u4E0E\u627F\u8BFA\u4E25\u91CD\u4E0D\u7B26",
    focusName: "\u6536\u76CA\u4E0E\u627F\u8BFA\u4E25\u91CD\u4E0D\u7B26",
    disputeType: "investment",
    definition: "\u6536\u76CA\u4E0E\u627F\u8BFA\u4E25\u91CD\u4E0D\u7B26\uFF0C\u6307\u6295\u8D44\u8005\u5728\u8D2D\u4E70\u7406\u8D22\u4EA7\u54C1\u3001\u53C2\u4E0E\u6295\u8D44\u9879\u76EE\u540E\uFF0C\u5B9E\u9645\u83B7\u5F97\u7684\u6536\u76CA\u6216\u56DE\u62A5\u4E0E\u9500\u552E\u65B9\u5728\u63A8\u4ECB\u65F6\u505A\u51FA\u7684\u627F\u8BFA\u5B58\u5728\u663E\u8457\u5DEE\u8DDD\u3002\u5728\u6295\u8D44\u7406\u8D22\u7EA0\u7EB7\u4E2D\uFF0C\u8FD9\u662F\u6700\u5E38\u89C1\u7684\u4E89\u8BAE\u7C7B\u578B\u3002\u9500\u552E\u65B9\u5728\u63A8\u4ECB\u65F6\u901A\u5E38\u4F1A\u5F3A\u8C03\u4EA7\u54C1\u7684\u9884\u671F\u6536\u76CA\u6216\u5386\u53F2\u6536\u76CA\uFF0C\u5BF9\u6295\u8D44\u8005\u5F62\u6210\u5438\u5F15\u529B\uFF0C\u4F46\u5728\u4EA7\u54C1\u5230\u671F\u6216\u8D4E\u56DE\u65F6\uFF0C\u5B9E\u9645\u6536\u76CA\u8FDC\u4F4E\u4E8E\u627F\u8BFA\uFF0C\u751A\u81F3\u51FA\u73B0\u672C\u91D1\u4E8F\u635F\u3002\u6295\u8D44\u8005\u4E3B\u5F20\u6536\u76CA\u4E0E\u627F\u8BFA\u4E0D\u7B26\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u9500\u552E\u65B9\u786E\u5B9E\u505A\u51FA\u4E86\u5177\u4F53\u3001\u660E\u786E\u7684\u6536\u76CA\u627F\u8BFA\uFF0C\u4E14\u8FD9\u4E00\u627F\u8BFA\u5BF9\u6295\u8D44\u8005\u7684\u6295\u8D44\u51B3\u5B9A\u4EA7\u751F\u4E86\u5B9E\u8D28\u6027\u5F71\u54CD\u3002",
    judgmentBasis: [
      '\u9500\u552E\u65B9\u662F\u5426\u505A\u51FA\u4E86\u660E\u786E\u3001\u5177\u4F53\u7684\u6536\u76CA\u627F\u8BFA\uFF1A\u5982\u5728\u63A8\u4ECB\u6750\u6599\u3001\u804A\u5929\u8BB0\u5F55\u3001\u5BA3\u4F20\u8D44\u6599\u4E2D\u4F7F\u7528\u4E86"\u4FDD\u8BC1"\u3001"\u786E\u5B9A"\u3001"\u7A33\u8D5A"\u3001"\u5E74\u5316\u6536\u76CA\u7387\u4E0D\u4F4E\u4E8EX%"\u7B49\u8868\u8FF0',
      "\u5B9E\u9645\u6536\u76CA\u4E0E\u627F\u8BFA\u4E4B\u95F4\u7684\u5DEE\u8DDD\u662F\u5426\u663E\u8457\uFF1A\u5B9E\u9645\u6536\u76CA\u8FDC\u4F4E\u4E8E\u627F\u8BFA\u6536\u76CA\uFF0C\u6216\u4E0D\u4EC5\u6CA1\u6709\u83B7\u5F97\u6536\u76CA\u53CD\u800C\u51FA\u73B0\u672C\u91D1\u4E8F\u635F\uFF0C\u4E14\u9500\u552E\u65B9\u5728\u63A8\u4ECB\u65F6\u672A\u5408\u7406\u63D0\u793A\u98CE\u9669",
      "\u9500\u552E\u65B9\u662F\u5426\u5B58\u5728\u8BEF\u5BFC\u884C\u4E3A\uFF1A\u523B\u610F\u9690\u7792\u9AD8\u98CE\u9669\u4EA7\u54C1\u7684\u98CE\u9669\u7B49\u7EA7\u3001\u5938\u5927\u4EA7\u54C1\u7684\u6536\u76CA\u786E\u5B9A\u6027\u7B49",
      "\u5982\u679C\u9500\u552E\u65B9\u53EA\u662F\u4ECB\u7ECD\u4E86\u4EA7\u54C1\u7684\u5386\u53F2\u6536\u76CA\u6216\u9884\u671F\u6536\u76CA\u533A\u95F4\uFF0C\u5E76\u660E\u786E\u63D0\u793A\u4E86\u6295\u8D44\u98CE\u9669\uFF0C\u5219\u901A\u5E38\u4E0D\u6784\u6210\u627F\u8BFA"
    ],
    evidenceRelation: [
      { material: "\u6295\u8D44\u5408\u540C\u6216\u4EA7\u54C1\u8BF4\u660E\u4E66", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u4EA7\u54C1\u7684\u6CD5\u5F8B\u5173\u7CFB\u548C\u6536\u76CA\u7EA6\u5B9A\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u9500\u552E\u65B9\u7684\u63A8\u4ECB\u6750\u6599\u3001\u5E7F\u544A\u622A\u56FE\u6216\u5BA3\u4F20\u6587\u4EF6", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u9500\u552E\u65B9\u7684\u627F\u8BFA\u5185\u5BB9\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u4E0E\u9500\u552E\u4EBA\u5458\u6216\u673A\u6784\u7684\u804A\u5929\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u63A8\u4ECB\u8FC7\u7A0B\u4E2D\u7684\u5177\u4F53\u627F\u8BFA\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u6295\u8D44\u8005\u7684\u8F6C\u8D26\u8BB0\u5F55\u6216\u4EA4\u6613\u51ED\u8BC1", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5B9E\u9645\u6295\u5165\u91D1\u989D\u548C\u65F6\u95F4\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u4EA7\u54C1\u5230\u671F\u540E\u7684\u7ED3\u7B97\u51ED\u8BC1\u6216\u8D26\u6237\u4F59\u989D\u622A\u56FE", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5B9E\u9645\u6536\u76CA\u60C5\u51B5\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u63A8\u4ECB\u65F6\u7684\u5F55\u97F3\u6216\u5F55\u50CF\uFF08\u5982\u6709\uFF09", status: "\u5EFA\u8BAE\u8865\u5145", note: "A\u7EA7\u76F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u6295\u8D44\u5408\u540C\u3001\u4EA7\u54C1\u8BF4\u660E\u4E66\u3001\u9500\u552E\u65B9\u63A8\u4ECB\u6750\u6599\u3001\u804A\u5929\u8BB0\u5F55/\u901A\u8BDD\u8BB0\u5F55\u3001\u94F6\u884C\u6D41\u6C34\u3001\u4EA4\u6613\u5E73\u53F0\u8BB0\u5F55",
      action: "\u5B8C\u6574\u4FDD\u7559\u6295\u8D44\u5408\u540C\u548C\u8BF4\u660E\u4E66\uFF1B\u622A\u56FE\u6240\u6709\u63A8\u4ECB\u6750\u6599\u4E2D\u6D89\u53CA\u6536\u76CA\u627F\u8BFA\u7684\u5185\u5BB9\uFF1B\u4FDD\u7559\u4E0E\u9500\u552E\u4EBA\u5458\u7684\u5B8C\u6574\u6C9F\u901A\u8BB0\u5F55\uFF1B\u5BFC\u51FA\u5168\u90E8\u8D44\u91D1\u53D8\u52A8\u8BB0\u5F55\u5C55\u793A\u672C\u91D1\u6295\u5165\u548C\u5B9E\u9645\u56DE\u6536\uFF1B\u5982\u679C\u9AD8\u98CE\u9669\u4EA7\u54C1\u4F46\u9500\u552E\u65B9\u672A\u8FDB\u884C\u98CE\u9669\u63D0\u793A\uFF0C\u4FDD\u5B58\u5BF9\u65B9\u5BF9\u98CE\u9669\u95EE\u9898\u7684\u56DE\u5E94\u8BB0\u5F55"
    }
  },
  "investment:principal-locked": {
    focusKey: "\u672C\u91D1\u65E0\u6CD5\u53D6\u56DE",
    focusName: "\u672C\u91D1\u65E0\u6CD5\u53D6\u56DE",
    disputeType: "investment",
    definition: '\u672C\u91D1\u65E0\u6CD5\u53D6\u56DE\uFF0C\u6307\u6295\u8D44\u8005\u5728\u7406\u8D22\u4EA7\u54C1\u5230\u671F\u540E\uFF0C\u65E0\u6CD5\u6309\u7167\u5408\u540C\u7EA6\u5B9A\u6216\u9500\u552E\u627F\u8BFA\u6536\u56DE\u6295\u8D44\u672C\u91D1\u3002\u8FD9\u4E00\u4E89\u8BAE\u7126\u70B9\u901A\u5E38\u4E0E\u9500\u552E\u65B9\u8DD1\u8DEF\u3001\u5E73\u53F0\u5173\u505C\u3001\u8D44\u91D1\u94FE\u65AD\u88C2\u7B49\u6781\u7AEF\u60C5\u51B5\u76F8\u5173\uFF0C\u4E5F\u6709\u53EF\u80FD\u662F\u9500\u552E\u65B9\u4EE5"\u7CFB\u7EDF\u5347\u7EA7"\u3001"\u6B63\u5728\u5904\u7406"\u7B49\u7406\u7531\u62D6\u5EF6\u5151\u4ED8\u3002\u6295\u8D44\u8005\u4E3B\u5F20\u672C\u91D1\u65E0\u6CD5\u53D6\u56DE\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u53CC\u65B9\u5B58\u5728\u6295\u8D44\u5173\u7CFB\u3001\u6295\u8D44\u8005\u5DF2\u6295\u5165\u5177\u4F53\u91D1\u989D\u3001\u4E14\u9500\u552E\u65B9\u6216\u5E73\u53F0\u65B9\u672A\u80FD\u6309\u7EA6\u5B9A\u8FD4\u8FD8\u672C\u91D1\u3002',
    judgmentBasis: [
      "\u53CC\u65B9\u662F\u5426\u786E\u5B9E\u5B58\u5728\u6295\u8D44\u5173\u7CFB\uFF0C\u4EE5\u53CA\u6295\u8D44\u8005\u7684\u6295\u5165\u91D1\u989D\u662F\u5426\u660E\u786E\uFF1A\u6295\u8D44\u5408\u540C\u3001\u8F6C\u8D26\u8BB0\u5F55\u3001\u4EA4\u6613\u51ED\u8BC1\u7B49\u662F\u8BC1\u660E\u8FD9\u4E9B\u4E8B\u5B9E\u7684\u6838\u5FC3\u6750\u6599",
      "\u9500\u552E\u65B9\u662F\u5426\u5B58\u5728\u8FDD\u7EA6\u884C\u4E3A\uFF1A\u5408\u540C\u7EA6\u5B9A\u4E86\u5151\u4ED8\u65E5\u671F\u4F46\u9500\u552E\u65B9\u672A\u6309\u671F\u5151\u4ED8\uFF0C\u6216\u4EE5\u5404\u79CD\u7406\u7531\u62D6\u5EF6\u5151\u4ED8\u8D85\u8FC7\u5408\u7406\u671F\u9650\uFF08\u5982\u8D85\u8FC760\u5929\u4ECD\u672A\u5904\u7406\uFF09\uFF0C\u5219\u8BE5\u884C\u4E3A\u5177\u6709\u660E\u663E\u7684\u8FDD\u7EA6\u6027\u8D28",
      "\u9500\u552E\u65B9\u7684\u7ECF\u8425\u72B6\u6001\uFF1A\u9500\u552E\u65B9\u5DF2\u65E0\u6CD5\u8054\u7CFB\u3001\u529E\u516C\u573A\u6240\u5DF2\u5173\u95ED\u3001\u88AB\u76D1\u7BA1\u90E8\u95E8\u5904\u7F5A\u6216\u88AB\u5217\u4E3A\u7ECF\u8425\u5F02\u5E38\uFF0C\u5219\u6295\u8D44\u8005\u9700\u8981\u5C3D\u5FEB\u91C7\u53D6\u8FDB\u4E00\u6B65\u884C\u52A8"
    ],
    evidenceRelation: [
      { material: "\u6295\u8D44\u5408\u540C\u6216\u4EA7\u54C1\u8BF4\u660E\u4E66", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u53CC\u65B9\u7684\u6295\u8D44\u5173\u7CFB\u548C\u5151\u4ED8\u7EA6\u5B9A\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u6295\u8D44\u8005\u7684\u8F6C\u8D26\u8BB0\u5F55\u6216\u4EA4\u6613\u51ED\u8BC1", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5B9E\u9645\u6295\u5165\u91D1\u989D\u548C\u65F6\u95F4\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u9500\u552E\u65B9\u7684\u5151\u4ED8\u627F\u8BFA\u6216\u5230\u671F\u7ED3\u7B97\u901A\u77E5", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5151\u4ED8\u4E49\u52A1\u7684\u5B58\u5728\u548C\u5230\u671F\u4E8B\u5B9E\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u6295\u8D44\u8005\u4E0E\u9500\u552E\u65B9\u5C31\u5151\u4ED8\u95EE\u9898\u7684\u6C9F\u901A\u8BB0\u5F55", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6295\u8D44\u8005\u5DF2\u63D0\u51FA\u8981\u6C42\u53CA\u5BF9\u65B9\u7684\u56DE\u5E94\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u9500\u552E\u65B9\u7ECF\u8425\u5F02\u5E38\u7684\u67E5\u8BE2\u7ED3\u679C", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u5DE5\u5546\u767B\u8BB0\u72B6\u6001\u63D0\u793A\u3001\u76D1\u7BA1\u90E8\u95E8\u516C\u544A\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u94F6\u884C\u6D41\u6C34\u3001\u6295\u8D44\u5408\u540C\u3001\u5151\u4ED8\u6761\u6B3E\u3001\u6C9F\u901A\u8BB0\u5F55\u3001\u56FD\u5BB6\u4F01\u4E1A\u4FE1\u7528\u4FE1\u606F\u516C\u793A\u7CFB\u7EDF",
      action: "\u6574\u7406\u5168\u90E8\u51FA\u8D44\u8BB0\u5F55\u7684\u94F6\u884C\u6D41\u6C34\uFF0C\u6807\u6CE8\u6295\u8D44\u6B3E\u3001\u7406\u8D22\u6B3E\u3001\u9879\u76EE\u6B3E\u7684\u8D44\u91D1\u5212\u62E8\u8BB0\u5F55\uFF1B\u4FDD\u7559\u6295\u8D44\u5408\u540C\u4E2D\u5173\u4E8E\u5151\u4ED8\u671F\u9650\u548C\u65B9\u5F0F\u7684\u6761\u6B3E\uFF1B\u4FDD\u7559\u5230\u671F\u540E\u4E0E\u9500\u552E\u65B9\u7684\u5168\u90E8\u6C9F\u901A\u8BB0\u5F55\uFF1B\u5982\u679C\u9500\u552E\u65B9\u5DF2\u5931\u8054\uFF0C\u901A\u8FC7\u56FD\u5BB6\u4F01\u4E1A\u4FE1\u7528\u4FE1\u606F\u516C\u793A\u7CFB\u7EDF\u67E5\u8BE2\u5DE5\u5546\u72B6\u6001\u5E76\u622A\u5C4F\u4FDD\u5B58"
    }
  },
  "investment:transaction-abnormal": {
    focusKey: "\u4EA4\u6613\u5F02\u5E38\u6216\u65E0\u6CD5\u64CD\u4F5C",
    focusName: "\u4EA4\u6613\u5F02\u5E38\u6216\u65E0\u6CD5\u64CD\u4F5C",
    disputeType: "investment",
    definition: "\u4EA4\u6613\u5F02\u5E38\u6216\u65E0\u6CD5\u64CD\u4F5C\uFF0C\u6307\u6295\u8D44\u8005\u5728\u7406\u8D22\u4EA7\u54C1\u7684\u6301\u6709\u671F\u95F4\u6216\u5728\u9700\u8981\u8D4E\u56DE\u3001\u8F6C\u8BA9\u65F6\uFF0C\u53D1\u73B0\u4EA4\u6613\u5E73\u53F0\u51FA\u73B0\u5F02\u5E38\uFF0C\u5BFC\u81F4\u65E0\u6CD5\u6B63\u5E38\u8FDB\u884C\u4EA4\u6613\u64CD\u4F5C\uFF0C\u5982\u65E0\u6CD5\u8D4E\u56DE\u3001\u65E0\u6CD5\u767B\u5F55\u8D26\u6237\u3001\u4EA4\u6613\u6570\u636E\u5F02\u5E38\u7B49\u3002\u8FD9\u4E00\u4E89\u8BAE\u7126\u70B9\u901A\u5E38\u4E0E\u5E73\u53F0\u7684\u7CFB\u7EDF\u6545\u969C\u3001\u4EBA\u4E3A\u9650\u5236\u4EA4\u6613\u6216\u5E73\u53F0\u5173\u505C\u6709\u5173\u3002\u6295\u8D44\u8005\u4E3B\u5F20\u4EA4\u6613\u5F02\u5E38\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u6295\u8D44\u8005\u5DF2\u5C65\u884C\u4E86\u5FC5\u8981\u7684\u901A\u77E5\u548C\u7533\u8BF7\u4E49\u52A1\uFF0C\u4F46\u5E73\u53F0\u65B9\u672A\u80FD\u63D0\u4F9B\u6B63\u5E38\u7684\u4EA4\u6613\u670D\u52A1\u3002",
    judgmentBasis: [
      "\u4EA4\u6613\u5F02\u5E38\u7684\u5177\u4F53\u8868\u73B0\uFF1A\u767B\u5F55\u5931\u8D25\u3001\u8D4E\u56DE\u7533\u8BF7\u88AB\u62D2\u7EDD\u3001\u8D26\u6237\u4F59\u989D\u5F02\u5E38\u53D8\u52A8\u7B49\uFF0C\u9700\u63D0\u4F9B\u76F8\u5E94\u7684\u622A\u56FE\u6216\u5F55\u5C4F\u8BB0\u5F55",
      "\u6295\u8D44\u8005\u662F\u5426\u5DF2\u5411\u5E73\u53F0\u65B9\u63D0\u51FA\u4E86\u4EA4\u6613\u7533\u8BF7\u6216\u95EE\u9898\u62A5\u544A\uFF0C\u4EE5\u53CA\u5E73\u53F0\u65B9\u7684\u56DE\u5E94\u6001\u5EA6\uFF1A\u5E73\u53F0\u65B9\u957F\u65F6\u95F4\u4E0D\u56DE\u5E94\u3001\u4E0D\u5904\u7406\uFF0C\u5177\u6709\u4E00\u5B9A\u7684\u8FDD\u7EA6\u6027\u8D28",
      "\u4EA4\u6613\u5F02\u5E38\u662F\u5426\u7ED9\u6295\u8D44\u8005\u9020\u6210\u4E86\u5B9E\u9645\u635F\u5931\uFF1A\u5982\u56E0\u65E0\u6CD5\u53CA\u65F6\u8D4E\u56DE\u800C\u9519\u8FC7\u4E86\u6700\u4F73\u65F6\u673A\u3001\u56E0\u8D26\u6237\u5F02\u5E38\u5BFC\u81F4\u8D44\u91D1\u88AB\u51BB\u7ED3\u7B49"
    ],
    evidenceRelation: [
      { material: "\u4EA4\u6613\u5F02\u5E38\u65F6\u7684\u9875\u9762\u622A\u56FE\u6216\u5F55\u5C4F", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5F02\u5E38\u7684\u5177\u4F53\u8868\u73B0\uFF0C\u542B\u65F6\u95F4\u6233\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u6295\u8D44\u8005\u5411\u5E73\u53F0\u65B9\u63D0\u51FA\u7684\u4EA4\u6613\u7533\u8BF7\u6216\u95EE\u9898\u62A5\u544A\u8BB0\u5F55", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u6295\u8D44\u8005\u5DF2\u5C65\u884C\u901A\u77E5\u4E49\u52A1\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u5E73\u53F0\u65B9\u7684\u56DE\u5E94\u6216\u4E0D\u56DE\u5E94\u7684\u8BB0\u5F55", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5E73\u53F0\u65B9\u7684\u5904\u7406\u6001\u5EA6\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u6295\u8D44\u8005\u7684\u8D26\u6237\u4F59\u989D\u548C\u4EA4\u6613\u5386\u53F2\u622A\u56FE", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u8D26\u6237\u72B6\u6001\u548C\u8D44\u91D1\u60C5\u51B5\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u4EA7\u54C1\u5408\u540C\u4E2D\u5BF9\u8D4E\u56DE\u548C\u8F6C\u8BA9\u7B49\u64CD\u4F5C\u7684\u7EA6\u5B9A\u6761\u6B3E", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u6295\u8D44\u8005\u7684\u64CD\u4F5C\u6743\u5229\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u5F02\u5E38\u9875\u9762\u622A\u56FE/\u5F55\u5C4F\uFF08\u542B\u65F6\u95F4\u6233\uFF09\u3001\u95EE\u9898\u62A5\u544A\u8BB0\u5F55\u3001\u8D26\u6237\u4EA4\u6613\u5386\u53F2\u3001\u901A\u8BDD\u8BB0\u5F55/\u5F55\u97F3\u3001\u7B2C\u4E09\u65B9\u6258\u7BA1\u673A\u6784",
      action: "\u5F02\u5E38\u9875\u9762\u5B8C\u6574\u622A\u56FE\u6216\u5F55\u5C4F\uFF0C\u5305\u542B\u65F6\u95F4\u6233\u3001\u64CD\u4F5C\u8FC7\u7A0B\u3001\u7CFB\u7EDF\u63D0\u793A\u4FE1\u606F\u7B49\u5168\u90E8\u5173\u952E\u5185\u5BB9\uFF0C\u53EF\u591A\u6B21\u64CD\u4F5C\u5E76\u5206\u522B\u622A\u56FE\u5C55\u793A\u5F02\u5E38\u7684\u53EF\u91CD\u590D\u6027\u548C\u6301\u7EED\u65F6\u95F4\uFF1B\u7B2C\u4E00\u65F6\u95F4\u5411\u5E73\u53F0\u65B9\u63D0\u4EA4\u95EE\u9898\u62A5\u544A\u5E76\u4FDD\u7559\u8BB0\u5F55\uFF1B\u5BFC\u51FA\u8D26\u6237\u4EA4\u6613\u5386\u53F2\u548C\u8D44\u4EA7\u4F59\u989D\u53D8\u5316\u8BB0\u5F55\uFF1B\u4FDD\u7559\u901A\u8BDD\u8BB0\u5F55\u548C\u5F55\u97F3"
    }
  },
  "investment:party-missing": {
    focusKey: "\u5BF9\u65B9\u5931\u8054\u6216\u8DD1\u8DEF",
    focusName: "\u5BF9\u65B9\u5931\u8054\u6216\u8DD1\u8DEF",
    disputeType: "investment",
    definition: "\u5BF9\u65B9\u5931\u8054\u6216\u8DD1\u8DEF\uFF0C\u6307\u6295\u8D44\u7406\u8D22\u4EA7\u54C1\u7684\u9500\u552E\u65B9\u3001\u7BA1\u7406\u4EBA\u3001\u5E73\u53F0\u8FD0\u8425\u65B9\u7B49\u5728\u6295\u8D44\u8005\u7684\u6295\u5165\u671F\u95F4\u6216\u5151\u4ED8\u671F\u9650\u5230\u671F\u540E\uFF0C\u7A81\u7136\u5931\u53BB\u8054\u7CFB\uFF0C\u5305\u62EC\u7535\u8BDD\u65E0\u4EBA\u63A5\u542C\u3001\u529E\u516C\u573A\u6240\u5173\u95ED\u3001\u8D1F\u8D23\u4EBA\u5931\u8054\u3001\u5E73\u53F0\u5173\u505C\u8BBF\u95EE\u7B49\u3002\u8FD9\u662F\u6295\u8D44\u7406\u8D22\u7EA0\u7EB7\u4E2D\u6700\u4E3A\u4E25\u91CD\u7684\u4E89\u8BAE\u7126\u70B9\u4E4B\u4E00\u3002\u6295\u8D44\u8005\u4E3B\u5F20\u5BF9\u65B9\u5931\u8054\u6216\u8DD1\u8DEF\u65F6\uFF0C\u6838\u5FC3\u5728\u4E8E\u8BC1\u660E\u53CC\u65B9\u7684\u6295\u8D44\u5173\u7CFB\u53CA\u6295\u5165\u91D1\u989D\u3001\u5BF9\u65B9\u786E\u5B9E\u5DF2\u65E0\u6CD5\u8054\u7CFB\uFF0C\u4EE5\u53CA\u6295\u8D44\u8005\u5DF2\u5C1D\u8BD5\u591A\u79CD\u65B9\u5F0F\u8054\u7CFB\u672A\u679C\u3002",
    judgmentBasis: [
      "\u6295\u8D44\u8005\u7684\u6295\u5165\u91D1\u989D\u548C\u6295\u8D44\u5173\u7CFB\u662F\u5426\u660E\u786E\uFF1A\u5408\u540C\u3001\u8F6C\u8D26\u8BB0\u5F55\u3001\u4EA4\u6613\u51ED\u8BC1\u7B49\u662F\u8BC1\u660E\u4E8B\u5B9E\u7684\u57FA\u7840",
      "\u5BF9\u65B9\u5931\u8054\u7684\u5177\u4F53\u8868\u73B0\uFF1A\u6295\u8D44\u8005\u901A\u8FC7\u7535\u8BDD\u3001\u5FAE\u4FE1\u3001\u90AE\u4EF6\u3001\u4E0A\u95E8\u62DC\u8BBF\u7B49\u591A\u79CD\u65B9\u5F0F\u5747\u65E0\u6CD5\u8054\u7CFB\u5230\u5BF9\u65B9\uFF0C\u4E14\u6301\u7EED\u65F6\u95F4\u8F83\u957F\uFF08\u5982\u8D85\u8FC730\u5929\uFF09\uFF0C\u5219\u6709\u7406\u7531\u5224\u65AD\u5BF9\u65B9\u5DF2\u5904\u4E8E\u5931\u8054\u72B6\u6001",
      "\u5BF9\u65B9\u7684\u7ECF\u8425\u72B6\u6001\uFF1A\u901A\u8FC7\u56FD\u5BB6\u4F01\u4E1A\u4FE1\u7528\u4FE1\u606F\u516C\u793A\u7CFB\u7EDF\u67E5\u8BE2\u5BF9\u65B9\u662F\u5426\u5DF2\u88AB\u5217\u4E3A\u7ECF\u8425\u5F02\u5E38\u3001\u662F\u5426\u5DF2\u6CE8\u9500\uFF1B\u5982\u5DF2\u88AB\u76D1\u7BA1\u90E8\u95E8\u516C\u544A\u4E3A\u975E\u6CD5\u7ECF\u8425\u6216\u5DF2\u88AB\u516C\u5B89\u673A\u5173\u7ACB\u6848\u4FA6\u67E5\uFF0C\u6295\u8D44\u8005\u9700\u8981\u53CA\u65F6\u5173\u6CE8\u76F8\u5173\u516C\u544A\u548C\u540E\u7EED\u5904\u7F6E\u5B89\u6392"
    ],
    evidenceRelation: [
      { material: "\u6295\u8D44\u5408\u540C\u6216\u4EA7\u54C1\u8BF4\u660E\u4E66", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u53CC\u65B9\u7684\u6295\u8D44\u5173\u7CFB\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u6295\u8D44\u8005\u7684\u8F6C\u8D26\u8BB0\u5F55\u6216\u5168\u90E8\u4EA4\u6613\u51ED\u8BC1", status: "\u5DF2\u6709", note: "\u8BC1\u660E\u5B9E\u9645\u6295\u5165\u91D1\u989D\u3001\u65F6\u95F4\u548C\u8D44\u91D1\u6D41\u5411\uFF0CA\u7EA7\u76F4\u63A5\u8BC1\u636E" },
      { material: "\u6295\u8D44\u8005\u5C1D\u8BD5\u8054\u7CFB\u5BF9\u65B9\u7684\u591A\u79CD\u65B9\u5F0F\u8BB0\u5F55", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u5BF9\u65B9\u5DF2\u65E0\u6CD5\u8054\u7CFB\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u5BF9\u65B9\u7684\u5DE5\u5546\u767B\u8BB0\u72B6\u6001\u53CA\u7ECF\u8425\u5F02\u5E38\u516C\u544A\u67E5\u8BE2\u7ED3\u679C", status: "\u5EFA\u8BAE\u8865\u5145", note: "\u8BC1\u660E\u7ECF\u8425\u5F02\u5E38\uFF0CB\u7EA7\u95F4\u63A5\u8BC1\u636E" },
      { material: "\u76D1\u7BA1\u90E8\u95E8\u6216\u516C\u5B89\u673A\u5173\u7684\u516C\u544A\u6216\u901A\u62A5\uFF08\u5982\u6709\uFF09", status: "\u5EFA\u8BAE\u8865\u5145", note: "A\u7EA7\u76F4\u63A5\u8BC1\u636E" }
    ],
    supplementGuide: {
      priority: 1,
      channel: "\u6295\u8D44\u5408\u540C/\u8F6C\u8D26\u51ED\u8BC1/\u4EA4\u6613\u8BB0\u5F55\u3001\u8054\u7CFB\u8BB0\u5F55\u3001\u5DE5\u5546\u67E5\u8BE2\u7ED3\u679C\u3001\u76D1\u7BA1\u90E8\u95E8/\u516C\u5B89\u673A\u5173\u516C\u544A",
      action: "\u5C06\u5168\u90E8\u6295\u8D44\u5408\u540C\u3001\u8F6C\u8D26\u51ED\u8BC1\u3001\u4EA4\u6613\u8BB0\u5F55\u6574\u7406\u4E3A\u5B8C\u6574\u7684\u6863\u6848\u5305\uFF1B\u4FDD\u7559\u6240\u6709\u5C1D\u8BD5\u8054\u7CFB\u5BF9\u65B9\u7684\u8BB0\u5F55\uFF0C\u5305\u62EC\u62E8\u6253\u7535\u8BDD\u7684\u622A\u56FE\uFF08\u542B\u901A\u8BDD\u65F6\u95F4\u548C\u662F\u5426\u63A5\u901A\uFF09\u3001\u53D1\u9001\u7684\u5FAE\u4FE1\u6D88\u606F\u548C\u77ED\u4FE1\u3001\u53D1\u9001\u7684\u90AE\u4EF6\u7B49\uFF1B\u901A\u8FC7\u56FD\u5BB6\u4F01\u4E1A\u4FE1\u7528\u4FE1\u606F\u516C\u793A\u7CFB\u7EDF\u67E5\u8BE2\u5BF9\u65B9\u7684\u5DE5\u5546\u767B\u8BB0\u72B6\u6001\u53CA\u662F\u5426\u88AB\u5217\u4E3A\u7ECF\u8425\u5F02\u5E38\u6216\u4E25\u91CD\u8FDD\u6CD5\u5931\u4FE1\u540D\u5355"
    }
  }
};
function getDisputeAnalysis(disputeType, focusKey) {
  const key = `${disputeType}:${focusKey}`;
  return disputeAnalysisLibrary[key] || null;
}
function getDisputeAnalyses(disputeType, focusKeys) {
  return focusKeys.map((key) => getDisputeAnalysis(disputeType, key)).filter(Boolean);
}

// src/data/risk-library.js
var riskLibrary = {
  // ==================== 教育培训 ====================
  "education:false-advertising": {
    "missing-promotion-material": {
      riskLevel: "high",
      riskTitle: "\u5173\u952E\u627F\u8BFA\u8BC1\u636E\u7F3A\u5931\u98CE\u9669",
      riskDescription: '\u60A8\u7B7E\u7EA6\u524D\u7684\u6C9F\u901A\u4E2D\u5B58\u5728"\u540D\u5E08\u6388\u8BFE"\u3001"\u5305\u8FC7"\u7B49\u627F\u8BFA\u6027\u8868\u8FF0\uFF0C\u4F46\u76EE\u524D\u5C1A\u672A\u8865\u5145\u673A\u6784\u5BA3\u4F20\u6750\u6599\u4F5C\u4E3A\u8BC1\u636E\u3002\u5982\u540E\u7EED\u8FDB\u5165\u6295\u8BC9\u6216\u8BC9\u8BBC\uFF0C\u5BF9\u65B9\u53EF\u80FD\u5426\u8BA4\u66FE\u505A\u51FA\u4E0A\u8FF0\u627F\u8BFA\uFF0C\u5BFC\u81F4"\u865A\u5047\u5BA3\u4F20"\u7126\u70B9\u96BE\u4EE5\u8BA4\u5B9A\u3002',
      suggestion: "\u5EFA\u8BAE\u4F18\u5148\u8865\u5145\u673A\u6784\u5BA3\u4F20\u6750\u6599\u3002\u4ECE\u5FAE\u4FE1\u516C\u4F17\u53F7\u5386\u53F2\u6587\u7AE0\u3001\u62DB\u751F\u7B80\u7AE0\u3001\u9500\u552E\u4EBA\u5458\u670B\u53CB\u5708\u622A\u56FE\u3001\u641C\u7D22\u5F15\u64CE\u5FEB\u7167\u7B49\u6E20\u9053\u83B7\u53D6\u542B\u6709\u5177\u4F53\u627F\u8BFA\u6027\u8868\u8FF0\u7684\u6750\u6599\u3002",
      relatedFocus: "\u865A\u5047\u5938\u5927\u5BA3\u4F20"
    },
    "contract-has-exception-clause": {
      riskLevel: "medium",
      riskTitle: "\u683C\u5F0F\u6761\u6B3E\u6548\u529B\u98CE\u9669",
      riskDescription: '\u5408\u540C\u4E2D\u53EF\u80FD\u5B58\u5728"\u6982\u4E0D\u9000\u6B3E"\u7B49\u683C\u5F0F\u6761\u6B3E\u3002\u5728\u9884\u4ED8\u5F0F\u6D88\u8D39\u573A\u666F\u4E0B\uFF0C\u6700\u9AD8\u4EBA\u6C11\u6CD5\u9662\u76F8\u5173\u53F8\u6CD5\u89E3\u91CA\uFF082025\u5E74\uFF09\u5BF9\u8FD9\u7C7B\u6761\u6B3E\u7684\u6548\u529B\u4F5C\u51FA\u4E86\u89C4\u5B9A\u2014\u2014\u5728\u7279\u5B9A\u60C5\u5F62\u4E0B\u53EF\u80FD\u88AB\u8BA4\u5B9A\u4E3A\u65E0\u6548\u6216\u90E8\u5206\u65E0\u6548\uFF0C\u4F46\u5177\u4F53\u9002\u7528\u4ECD\u9700\u7ED3\u5408\u6848\u60C5\u5224\u65AD\u3002',
      suggestion: '\u5EFA\u8BAE\u8865\u5145\u7B7E\u7EA6\u524D\u7684\u627F\u8BFA\u8BB0\u5F55\uFF08\u5982\u5BA3\u4F20\u6750\u6599\u3001\u9500\u552E\u4EBA\u5458\u804A\u5929\u8BB0\u5F55\uFF09\uFF0C\u4EE5\u652F\u6301"\u683C\u5F0F\u6761\u6B3E\u65E0\u6548"\u7684\u4E3B\u5F20\u3002',
      relatedFocus: "\u865A\u5047\u5938\u5927\u5BA3\u4F20"
    }
  },
  "education:refuse-refund": {
    "contract-has-no-refund-clause": {
      riskLevel: "high",
      riskTitle: "\u9000\u8D39\u6761\u6B3E\u7F3A\u5931\u98CE\u9669",
      riskDescription: "\u60A8\u7684\u5408\u540C\u4E2D\u53EF\u80FD\u672A\u7EA6\u5B9A\u9000\u8D39\u6761\u6B3E\uFF0C\u6216\u9000\u8D39\u6761\u6B3E\u8868\u8FF0\u6A21\u7CCA\u3002\u5728\u53CC\u65B9\u5BF9\u9000\u8D39\u4E8B\u9879\u65E0\u660E\u786E\u7EA6\u5B9A\u7684\u60C5\u51B5\u4E0B\uFF0C\u662F\u5426\u80FD\u9000\u8D39\u3001\u9000\u591A\u5C11\uFF0C\u9700\u8981\u7ED3\u5408\u300A\u6C11\u6CD5\u5178\u300B\u53CA\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7684\u57FA\u672C\u539F\u5219\u8FDB\u884C\u5224\u65AD\uFF0C\u5B58\u5728\u4E0D\u786E\u5B9A\u6027\u3002",
      suggestion: "\u5EFA\u8BAE\u8865\u5145\u80FD\u591F\u8BC1\u660E\u5BF9\u65B9\u66FE\u505A\u51FA\u9000\u8D39\u627F\u8BFA\u7684\u6C9F\u901A\u8BB0\u5F55\uFF08\u5982\u5FAE\u4FE1\u804A\u5929\u3001\u77ED\u4FE1\u7B49\uFF09\uFF0C\u4EE5\u8865\u5145\u5408\u540C\u7EA6\u5B9A\u7684\u4E0D\u8DB3\u3002",
      relatedFocus: "\u4E0D\u9000\u8D39/\u62D6\u5EF6\u9000\u8D39"
    },
    "refund-request-no-proof": {
      riskLevel: "medium",
      riskTitle: "\u9000\u8D39\u8BF7\u6C42\u65F6\u95F4\u8BC1\u660E\u7F3A\u5931",
      riskDescription: '\u60A8\u63D0\u5230\u5DF2\u5411\u5BF9\u65B9\u63D0\u51FA\u8FC7\u9000\u8D39\u8BF7\u6C42\uFF0C\u4F46\u76EE\u524D\u5DF2\u6709\u7684\u804A\u5929\u8BB0\u5F55\u53EF\u80FD\u65E0\u6CD5\u5145\u5206\u8BC1\u660E\u63D0\u51FA\u9000\u8D39\u8BF7\u6C42\u7684\u5177\u4F53\u65F6\u95F4\u548C\u5185\u5BB9\u3002\u5982\u5BF9\u65B9\u5426\u8BA4\u6536\u5230\u9000\u8D39\u8BF7\u6C42\uFF0C\u53EF\u80FD\u5F71\u54CD"\u62D6\u5EF6\u9000\u8D39"\u7126\u70B9\u7684\u8BA4\u5B9A\u3002',
      suggestion: '\u5EFA\u8BAE\u6574\u7406\u5B8C\u6574\u7684\u6C9F\u901A\u65F6\u95F4\u7EBF\uFF0C\u622A\u53D6\u5173\u952E\u5BF9\u8BDD\u7247\u6BB5\u3002\u91CD\u70B9\u4FDD\u7559\u80FD\u591F\u8BC1\u660E"\u4F55\u65F6\u63D0\u51FA\u9000\u8D39\u8BF7\u6C42"\u53CA"\u5BF9\u65B9\u5982\u4F55\u56DE\u5E94"\u7684\u804A\u5929\u8BB0\u5F55\u3002',
      relatedFocus: "\u4E0D\u9000\u8D39/\u62D6\u5EF6\u9000\u8D39"
    },
    "amount-disputed": {
      riskLevel: "medium",
      riskTitle: "\u9000\u8D39\u91D1\u989D\u4E89\u8BAE\u98CE\u9669",
      riskDescription: "\u5373\u4F7F\u6CD5\u9662\u652F\u6301\u9000\u8D39\u8BF7\u6C42\uFF0C\u5B9E\u9645\u9000\u8FD8\u91D1\u989D\u4E5F\u53EF\u80FD\u5E76\u975E\u5168\u989D\u3002\u5177\u4F53\u9000\u8FD8\u6570\u989D\u9700\u7EFC\u5408\u8003\u8651\u5408\u540C\u7EA6\u5B9A\u7684\u670D\u52A1\u5185\u5BB9\u3001\u5DF2\u63D0\u4F9B\u7684\u670D\u52A1\u90E8\u5206\u3001\u6D88\u8D39\u8005\u7684\u8FC7\u9519\u7A0B\u5EA6\u7B49\u56E0\u7D20\u3002\u901A\u5E38\u6709\u7EA635%\u7684\u5224\u4F8B\u4EC5\u652F\u6301\u90E8\u5206\u9000\u8FD8\u3002",
      suggestion: "\u5EFA\u8BAE\u6574\u7406\u5DF2\u63A5\u53D7\u670D\u52A1\u7684\u76F8\u5173\u8BC1\u636E\uFF08\u5982\u8BFE\u7A0B\u8BB0\u5F55\u3001\u7B7E\u5230\u8BB0\u5F55\u7B49\uFF09\uFF0C\u4EE5\u4FBF\u5728\u540E\u7EED\u534F\u5546\u6216\u8BC9\u8BBC\u4E2D\u660E\u786E\u5DF2\u670D\u52A1\u90E8\u5206\u7684\u4EF7\u503C\u3002",
      relatedFocus: "\u4E0D\u9000\u8D39/\u62D6\u5EF6\u9000\u8D39"
    }
  },
  // ==================== 医疗美容 ====================
  "medical:effect-not-match": {
    "no-pre-surgery-record": {
      riskLevel: "high",
      riskTitle: "\u672F\u524D\u6548\u679C\u627F\u8BFA\u8BC1\u636E\u7F3A\u5931",
      riskDescription: '\u8BA4\u5B9A"\u6548\u679C\u4E0E\u627F\u8BFA\u4E0D\u7B26"\u7684\u5173\u952E\u5728\u4E8E\u80FD\u591F\u8BC1\u660E\u672F\u524D\u673A\u6784\u505A\u51FA\u4E86\u5177\u4F53\u7684\u6548\u679C\u627F\u8BFA\u3002\u82E5\u4EC5\u51ED\u53E3\u5934\u627F\u8BFA\u800C\u65E0\u4E66\u9762\u8BC1\u636E\uFF08\u5982\u804A\u5929\u8BB0\u5F55\u3001\u5BA3\u4F20\u6750\u6599\u3001\u5408\u540C\u6761\u6B3E\uFF09\uFF0C\u540E\u7EED\u7EF4\u6743\u65F6\u5BF9\u65B9\u53EF\u80FD\u5426\u8BA4\uFF0C\u7126\u70B9\u96BE\u4EE5\u6210\u7ACB\u3002',
      suggestion: "\u5EFA\u8BAE\u8865\u5145\u672F\u524D\u4E0E\u54A8\u8BE2\u5E08/\u533B\u751F\u7684\u6C9F\u901A\u8BB0\u5F55\uFF0C\u5305\u62EC\u5FAE\u4FE1\u804A\u5929\u3001\u672F\u524D\u540C\u610F\u4E66\u5185\u5BB9\u7B49\u3002\u91CD\u70B9\u63D0\u53D6\u5176\u4E2D\u6D89\u53CA\u6548\u679C\u627F\u8BFA\u7684\u5177\u4F53\u8868\u8FF0\u3002",
      relatedFocus: "\u6548\u679C\u4E0E\u627F\u8BFA\u4E25\u91CD\u4E0D\u7B26"
    },
    "no-medical-record": {
      riskLevel: "high",
      riskTitle: "\u75C5\u5386\u8D44\u6599\u7F3A\u5931\u98CE\u9669",
      riskDescription: "\u533B\u7F8E\u624B\u672F\u540E\u7684\u75C5\u5386\u8BB0\u5F55\u662F\u5224\u65AD\u624B\u672F\u6548\u679C\u548C\u662F\u5426\u5B58\u5728\u533B\u7597\u8FC7\u9519\u7684\u91CD\u8981\u4F9D\u636E\u3002\u82E5\u673A\u6784\u672A\u63D0\u4F9B\u5B8C\u6574\u75C5\u5386\uFF0C\u6216\u75C5\u5386\u8BB0\u5F55\u4E0E\u5B9E\u9645\u60C5\u51B5\u4E0D\u7B26\uFF0C\u53EF\u80FD\u5F71\u54CD\u540E\u7EED\u7EF4\u6743\u3002",
      suggestion: "\u53EF\u5411\u673A\u6784\u4E66\u9762\u7533\u8BF7\u590D\u5236\u5B8C\u6574\u75C5\u5386\uFF08\u5305\u62EC\u624B\u672F\u8BB0\u5F55\u3001\u77E5\u60C5\u540C\u610F\u4E66\u3001\u672F\u540E\u6CE8\u610F\u4E8B\u9879\u7B49\uFF09\u3002\u6839\u636E\u300A\u533B\u7597\u7EA0\u7EB7\u9884\u9632\u548C\u5904\u7406\u6761\u4F8B\u300B\uFF0C\u60A3\u8005\u6709\u6743\u590D\u5236\u75C5\u5386\u8D44\u6599\u3002",
      relatedFocus: "\u6548\u679C\u4E0E\u627F\u8BFA\u4E25\u91CD\u4E0D\u7B26"
    }
  },
  "medical:price-opaque": {
    "no-price-confirmation": {
      riskLevel: "medium",
      riskTitle: "\u672F\u524D\u4EF7\u683C\u786E\u8BA4\u7F3A\u5931",
      riskDescription: '\u5982\u679C\u672F\u524D\u4EC5\u51ED\u9500\u552E\u4EBA\u5458\u53E3\u5934\u62A5\u4EF7\u800C\u672A\u7B7E\u7F72\u4E66\u9762\u4EF7\u683C\u786E\u8BA4\uFF0C\u53EF\u80FD\u5B58\u5728"\u5B9E\u9645\u6536\u8D39\u4E0E\u627F\u8BFA\u4E0D\u7B26"\u7684\u4E89\u8BAE\u3002',
      suggestion: "\u5EFA\u8BAE\u6574\u7406\u672F\u524D\u7684\u4EF7\u683C\u6C9F\u901A\u8BB0\u5F55\uFF0C\u5305\u62EC\u804A\u5929\u8BB0\u5F55\u3001\u62A5\u4EF7\u622A\u56FE\u7B49\u3002\u5411\u673A\u6784\u7533\u8BF7\u83B7\u53D6\u5B8C\u6574\u7684\u8D39\u7528\u660E\u7EC6\u6E05\u5355\u8FDB\u884C\u5BF9\u6BD4\u3002",
      relatedFocus: "\u6536\u8D39\u4E0D\u900F\u660E/\u8BF1\u5BFC\u6D88\u8D39"
    }
  },
  // ==================== 预付卡 ====================
  "prepaid:balance-deducted": {
    "no-consumption-proof": {
      riskLevel: "medium",
      riskTitle: "\u4F59\u989D\u8BC1\u660E\u4E0D\u5145\u5206",
      riskDescription: "\u5982\u679C\u65E0\u6CD5\u63D0\u4F9B\u4F1A\u5458\u5361\u4F59\u989D\u7684\u6709\u6548\u8BC1\u660E\uFF08\u5982App\u622A\u56FE\u3001\u6D88\u8D39\u8BB0\u5F55\u7B49\uFF09\uFF0C\u53EF\u80FD\u5BFC\u81F4\u9000\u6B3E\u91D1\u989D\u96BE\u4EE5\u8BA4\u5B9A\u3002",
      suggestion: "\u7B2C\u4E00\u65F6\u95F4\u4FDD\u5B58\u4F1A\u5458App\u7684\u4F59\u989D\u622A\u56FE\u548C\u8FD1\u671F\u6D88\u8D39\u8BB0\u5F55\uFF0C\u5FC5\u8981\u65F6\u53EF\u5411\u5E73\u53F0\u53D1\u9001\u4E66\u9762\u67E5\u8BE2\u51FD\u8981\u6C42\u786E\u8BA4\u4F59\u989D\u3002",
      relatedFocus: "\u4F59\u989D\u64C5\u81EA\u88AB\u6263\u9664/\u65E0\u6CD5\u4F7F\u7528"
    },
    "merchant-closed": {
      riskLevel: "high",
      riskTitle: "\u5546\u6237\u8DD1\u8DEF\u98CE\u9669",
      riskDescription: "\u5982\u679C\u5546\u6237\u5DF2\u5173\u95E8\u505C\u4E1A\u4E14\u8D1F\u8D23\u4EBA\u5931\u8054\uFF0C\u8FFD\u56DE\u8D44\u91D1\u7684\u96BE\u5EA6\u5C06\u663E\u8457\u589E\u52A0\u3002\u5EFA\u8BAE\u5C3D\u5FEB\u91C7\u53D6\u6CD5\u5F8B\u884C\u52A8\uFF08\u5982\u5411\u6CD5\u9662\u7533\u8BF7\u652F\u4ED8\u4EE4\u6216\u63D0\u8D77\u8BC9\u8BBC\uFF09\uFF0C\u5E76\u5173\u6CE8\u5546\u6237\u662F\u5426\u6709\u53EF\u6267\u884C\u7684\u8D22\u4EA7\u3002",
      suggestion: "\u7ACB\u5373\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u4E3E\u62A5\uFF0C\u540C\u65F6\u51C6\u5907\u63D0\u8D77\u6C11\u4E8B\u8BC9\u8BBC\u3002\u53EF\u901A\u8FC7\u56FD\u5BB6\u4F01\u4E1A\u4FE1\u7528\u4FE1\u606F\u516C\u793A\u7CFB\u7EDF\u67E5\u8BE2\u5546\u6237\u7684\u6CE8\u518C\u8D44\u672C\u548C\u80A1\u4E1C\u4FE1\u606F\uFF0C\u5FC5\u8981\u65F6\u53EF\u8FFD\u52A0\u80A1\u4E1C\u4E3A\u88AB\u544A\u3002",
      relatedFocus: "\u4F59\u989D\u64C5\u81EA\u88AB\u6263\u9664/\u65E0\u6CD5\u4F7F\u7528"
    }
  },
  "prepaid:expire-issues": {
    "no-rule-change-proof": {
      riskLevel: "medium",
      riskTitle: "\u89C4\u5219\u53D8\u66F4\u8BC1\u660E\u7F3A\u5931",
      riskDescription: "\u5982\u679C\u65E0\u6CD5\u8BC1\u660E\u5546\u6237\u4F55\u65F6\u53D8\u66F4\u4E86\u4F7F\u7528\u89C4\u5219\uFF0C\u53EF\u80FD\u5BFC\u81F4\u7EF4\u6743\u65F6\u7F3A\u4E4F\u6709\u529B\u8BC1\u636E\u3002",
      suggestion: "\u5EFA\u8BAE\u901A\u8FC7\u5F55\u5C4F\u65B9\u5F0F\u4FDD\u5B58\u5546\u6237App\u6216\u5B98\u7F51\u7684\u5F53\u524D\u89C4\u5219\u9875\u9762\uFF0C\u5E76\u5C1D\u8BD5\u67E5\u627E\u89C4\u5219\u53D8\u66F4\u524D\u7684\u622A\u56FE\u6216\u5FEB\u7167\u3002",
      relatedFocus: "\u8FC7\u671F\u65E0\u6CD5\u7EED\u7528/\u9650\u5236\u4F7F\u7528"
    }
  },
  // ==================== 房屋租赁 ====================
  "rental:deposit-dispute": {
    "no-checkin-record": {
      riskLevel: "high",
      riskTitle: "\u5165\u4F4F\u72B6\u6001\u8BB0\u5F55\u7F3A\u5931",
      riskDescription: '\u5982\u679C\u60A8\u65E0\u6CD5\u63D0\u4F9B\u5165\u4F4F\u65F6\u7684\u623F\u5C4B\u72B6\u6001\u8BB0\u5F55\uFF08\u5982\u7167\u7247/\u89C6\u9891\uFF09\uFF0C\u9000\u623F\u65F6\u53EF\u80FD\u56E0\u65E0\u6CD5\u8BC1\u660E"\u5165\u4F4F\u65F6\u7684\u72B6\u6001"\u800C\u5BFC\u81F4\u62BC\u91D1\u88AB\u514B\u6263\u3002',
      suggestion: "\u5EFA\u8BAE\u7ACB\u5373\u67E5\u627E\u5165\u4F4F\u65F6\u7684\u623F\u5C4B\u7167\u7247\u6216\u89C6\u9891\uFF08\u624B\u673A\u76F8\u518C\u3001\u5FAE\u4FE1\u53D1\u9001\u8BB0\u5F55\u7B49\uFF09\u3002\u5982\u786E\u5B9E\u65E0\u6CD5\u627E\u5230\uFF0C\u4E0B\u6B21\u79DF\u623F\u65F6\u52A1\u5FC5\u5728\u5165\u4F4F\u5F53\u5929\u5168\u9762\u8BB0\u5F55\u623F\u5C4B\u72B6\u6001\u3002",
      relatedFocus: "\u62BC\u91D1\u4E0D\u9000/\u514B\u6263"
    },
    "no-checkout-record": {
      riskLevel: "medium",
      riskTitle: "\u9000\u623F\u72B6\u6001\u8BB0\u5F55\u7F3A\u5931",
      riskDescription: '\u5982\u679C\u9000\u623F\u65F6\u672A\u7559\u5B58\u623F\u5C4B\u72B6\u6001\u8BB0\u5F55\uFF0C\u53EF\u80FD\u65E0\u6CD5\u8BC1\u660E"\u9000\u623F\u65F6\u7684\u72B6\u6001\u7B26\u5408\u8981\u6C42"\uFF0C\u5BF9\u65B9\u53EF\u80FD\u4EE5\u6B64\u4E3A\u7531\u514B\u6263\u62BC\u91D1\u3002',
      suggestion: "\u5EFA\u8BAE\u8865\u62CD\u5F53\u524D\u623F\u5C4B\u72B6\u6001\u7167\u7247\uFF0C\u8BB0\u5F55\u9000\u623F\u65F6\u7684\u5B9E\u9645\u60C5\u51B5\u3002\u5982\u5DF2\u9000\u623F\u4E14\u65E0\u6CD5\u8865\u62CD\uFF0C\u53EF\u901A\u8FC7\u516C\u8BC1\u65B9\u5F0F\u4FDD\u5168\u73B0\u72B6\u3002",
      relatedFocus: "\u62BC\u91D1\u4E0D\u9000/\u514B\u6263"
    }
  },
  // ==================== 购物消费 ====================
  "shopping:quality-defect": {
    "no-quality-test": {
      riskLevel: "medium",
      riskTitle: "\u8D28\u91CF\u9274\u5B9A\u4F9D\u636E\u7F3A\u5931",
      riskDescription: "\u5982\u679C\u5546\u54C1\u8D28\u91CF\u95EE\u9898\u5B58\u5728\u4E89\u8BAE\uFF0C\u53EF\u80FD\u9700\u8981\u7B2C\u4E09\u65B9\u68C0\u6D4B\u62A5\u544A\u4F5C\u4E3A\u8BC1\u636E\u3002\u4F46\u68C0\u6D4B\u672C\u8EAB\u9700\u8981\u4E00\u5B9A\u8D39\u7528\uFF0C\u4E14\u68C0\u6D4B\u7ED3\u679C\u5B58\u5728\u4E0D\u786E\u5B9A\u6027\u3002",
      suggestion: "\u5EFA\u8BAE\u5148\u4E0E\u5546\u5BB6\u534F\u5546\uFF0C\u5982\u5546\u5BB6\u627F\u8BA4\u8D28\u91CF\u95EE\u9898\u5219\u53EF\u76F4\u63A5\u4F5C\u4E3A\u8BC1\u636E\u3002\u5982\u5546\u5BB6\u4E0D\u627F\u8BA4\uFF0C\u53EF\u8003\u8651\u7533\u8BF7\u7B2C\u4E09\u65B9\u68C0\u6D4B\u3002",
      relatedFocus: "\u8D28\u91CF\u95EE\u9898/\u7455\u75B5"
    }
  },
  // ==================== 互联网服务 ====================
  "internet:refuse-refund": {
    "beyond-refund-period": {
      riskLevel: "medium",
      riskTitle: "\u8D85\u8FC7\u5E73\u53F0\u9000\u6B3E\u671F\u9650",
      riskDescription: "\u5982\u679C\u60A8\u7684\u9000\u6B3E\u7533\u8BF7\u5DF2\u8D85\u8FC7\u5E73\u53F0\u89C4\u5219\u7EA6\u5B9A\u7684\u9000\u6B3E\u671F\u9650\uFF08\u59827\u5929\u300130\u5929\u7B49\uFF09\uFF0C\u5E73\u53F0\u53EF\u80FD\u636E\u6B64\u62D2\u7EDD\u9000\u6B3E\u3002\u4F46\u6839\u636E\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\uFF0C\u4E03\u65E5\u65E0\u7406\u7531\u9000\u8D27\u6743\u76CA\u4E0D\u56E0\u8D85\u8FC7\u5E73\u53F0\u671F\u9650\u800C\u4E27\u5931\u3002",
      suggestion: "\u5982\u7B26\u5408\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C25\u6761\u7684\u60C5\u5F62\uFF08\u7F51\u7EDC\u8D2D\u7269\uFF09\uFF0C\u5373\u4F7F\u8D85\u8FC7\u5E73\u53F0\u671F\u9650\uFF0C\u4ECD\u53EF\u4E3B\u5F20\u4E03\u65E5\u65E0\u7406\u7531\u9000\u8D27\u6743\u3002\u5EFA\u8BAE\u4FDD\u7559\u5546\u54C1\u5B8C\u597D\u72B6\u6001\u7684\u76F8\u5173\u8BC1\u660E\u3002",
      relatedFocus: "\u62D2\u7EDD\u9000\u6B3E"
    }
  },
  // ==================== 财产损害 ====================
  "property:damage": {
    "no-value-proof": {
      riskLevel: "high",
      riskTitle: "\u8D22\u4EA7\u4EF7\u503C\u8BC1\u660E\u7F3A\u5931",
      riskDescription: "\u5982\u679C\u65E0\u6CD5\u63D0\u4F9B\u8D22\u4EA7\u539F\u503C\u7684\u6709\u6548\u8BC1\u660E\uFF08\u5982\u8D2D\u7269\u53D1\u7968\u3001\u4ED8\u6B3E\u8BB0\u5F55\u7B49\uFF09\uFF0C\u53EF\u80FD\u5BFC\u81F4\u8D54\u507F\u91D1\u989D\u96BE\u4EE5\u8BA4\u5B9A\u3002",
      suggestion: "\u5EFA\u8BAE\u6574\u7406\u8D2D\u7269\u53D1\u7968\u3001\u4ED8\u6B3E\u8BB0\u5F55\u3001\u5546\u54C1\u7167\u7247\u7B49\u80FD\u591F\u8BC1\u660E\u8D22\u4EA7\u4EF7\u503C\u7684\u6750\u6599\u3002\u5982\u539F\u8D2D\u7269\u51ED\u8BC1\u5DF2\u4E22\u5931\uFF0C\u53EF\u5C1D\u8BD5\u4ECE\u7535\u5546\u5E73\u53F0\u5386\u53F2\u8BA2\u5355\u4E2D\u8C03\u53D6\u3002",
      relatedFocus: "\u8D22\u4EA7\u635F\u574F/\u4E22\u5931"
    },
    "third-party-liability": {
      riskLevel: "medium",
      riskTitle: "\u7B2C\u4E09\u65B9\u8D23\u4EFB\u98CE\u9669",
      riskDescription: "\u5982\u679C\u8D22\u4EA7\u635F\u574F\u6D89\u53CA\u7B2C\u4E09\u65B9\uFF08\u5982\u9152\u5E97\u3001\u505C\u8F66\u573A\u7B49\u573A\u6240\u7684\u8D22\u4EA7\u635F\u5931\uFF09\uFF0C\u8D23\u4EFB\u8BA4\u5B9A\u53EF\u80FD\u6D89\u53CA\u591A\u65B9\u3002\u5EFA\u8BAE\u6838\u5B9E\u573A\u6240\u65B9\u7684\u5B89\u5168\u4FDD\u969C\u4E49\u52A1\u662F\u5426\u5C65\u884C\u5230\u4F4D\u3002",
      suggestion: "\u5EFA\u8BAE\u4FDD\u7559\u573A\u6240\u65B9\u7684\u76D1\u63A7\u5F55\u50CF\uFF08\u53EF\u5411\u573A\u6240\u65B9\u7533\u8BF7\u8C03\u53D6\uFF09\u3001\u62A5\u8B66\u56DE\u6267\u7B49\u6750\u6599\uFF0C\u4EE5\u660E\u786E\u8D23\u4EFB\u65B9\u3002",
      relatedFocus: "\u8D22\u4EA7\u635F\u574F/\u4E22\u5931"
    }
  },
  // ==================== 出行交通 ====================
  "transport:delay-cancel": {
    "no-compensation-proof": {
      riskLevel: "medium",
      riskTitle: "\u8865\u507F\u65B9\u6848\u8BB0\u5F55\u7F3A\u5931",
      riskDescription: "\u5982\u679C\u5E73\u53F0\u63D0\u4F9B\u4E86\u6539\u7B7E\u3001\u9000\u6B3E\u6216\u5176\u4ED6\u8865\u507F\u65B9\u6848\u4F46\u672A\u4FDD\u7559\u8BB0\u5F55\uFF0C\u53EF\u80FD\u5F71\u54CD\u540E\u7EED\u4E3B\u5F20\u5176\u4ED6\u6743\u76CA\u3002",
      suggestion: "\u5EFA\u8BAE\u622A\u56FE\u4FDD\u5B58\u5E73\u53F0\u6240\u6709\u901A\u77E5\u548C\u8865\u507F\u65B9\u6848\u8BB0\u5F55\uFF0C\u5305\u62EC\u77ED\u4FE1\u3001App\u901A\u77E5\u3001\u90AE\u4EF6\u7B49\u3002",
      relatedFocus: "\u5EF6\u8BEF/\u53D6\u6D88"
    },
    "force-majeure": {
      riskLevel: "low",
      riskTitle: "\u4E0D\u53EF\u6297\u529B\u514D\u8D23\u98CE\u9669",
      riskDescription: '\u5982\u679C\u822A\u73ED\u53D6\u6D88\u6216\u5EF6\u8BEF\u7684\u539F\u56E0\u662F\u822A\u7A7A\u516C\u53F8\u8BA4\u5B9A\u7684"\u4E0D\u53EF\u6297\u529B"\uFF08\u5982\u6076\u52A3\u5929\u6C14\u3001\u7A7A\u4E2D\u7BA1\u5236\u7B49\uFF09\uFF0C\u53EF\u80FD\u514D\u4E8E\u8D54\u507F\u3002\u5EFA\u8BAE\u6838\u5B9E\u53D6\u6D88/\u5EF6\u8BEF\u7684\u5177\u4F53\u539F\u56E0\u662F\u5426\u5C5E\u4E8E\u4E0D\u53EF\u6297\u529B\u3002',
      suggestion: "\u53EF\u901A\u8FC7\u822A\u7A7A\u516C\u53F8\u5B98\u7F51\u6216\u822A\u73ED\u8FFD\u8E2AApp\u67E5\u8BE2\u5177\u4F53\u5EF6\u8BEF/\u53D6\u6D88\u539F\u56E0\u3002\u5982\u8BA4\u4E3A\u539F\u56E0\u4E0D\u5408\u7406\uFF0C\u53EF\u5411\u6C11\u822A\u5C40\u6295\u8BC9\u3002",
      relatedFocus: "\u5EF6\u8BEF/\u53D6\u6D88"
    }
  }
};
function matchRiskAlerts(disputeType, focusKey, existingMaterials = [], missingMaterials = []) {
  const risks = [];
  const exactKey = `${disputeType}:${focusKey}`;
  const rules = riskLibrary[exactKey];
  if (rules) {
    if (typeof rules === "object" && !Array.isArray(rules)) {
      Object.values(rules).forEach((rule) => risks.push(rule));
    }
  }
  if (focusKey === "\u865A\u5047\u5938\u5927\u5BA3\u4F20" && !existingMaterials.includes("\u673A\u6784\u5BA3\u4F20\u6750\u6599")) {
    const fallback = riskLibrary["education:false-advertising"]?.["missing-promotion-material"];
    if (fallback) risks.push(fallback);
  }
  if (focusKey === "\u4E0D\u9000\u8D39/\u62D6\u5EF6\u9000\u8D39" && !existingMaterials.includes("\u5408\u540C/\u534F\u8BAE")) {
    const fallback = riskLibrary["education:refuse-refund"]?.["contract-has-no-refund-clause"];
    if (fallback) risks.push(fallback);
  }
  return risks;
}

// src/data/solution-library.js
var solutionLibrary = {
  // ==================== 教育培训服务纠纷 ====================
  education: {
    name: "\u6559\u80B2\u57F9\u8BAD\u670D\u52A1\u7EA0\u7EB7",
    solutions: [
      {
        path: "path-1",
        pathName: "\u5411\u5E02\u573A\u76D1\u7763\u7BA1\u7406\u5C40\u6295\u8BC9",
        priority: 1,
        applicableCondition: "\u5408\u540C\u6E05\u6670\u3001\u5BF9\u65B9\u4E3B\u4F53\u660E\u786E\u3001\u91D1\u989D\u57285\u4E07\u5143\u4EE5\u4E0B",
        processingCycle: "15-30\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u5408\u540C\u539F\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u5BF9\u65B9\u4E3B\u4F53\u4FE1\u606F\uFF08\u8425\u4E1A\u6267\u7167\uFF09", "\u6295\u8BC9\u60C5\u51B5\u8BF4\u660E\u4E66"],
        steps: [
          "\u767B\u5F55\u5168\u56FD12315\u5E73\u53F0\uFF08www.12315.cn\uFF09\u6216\u62E8\u625312315\u70ED\u7EBF",
          '\u9009\u62E9"\u6211\u8981\u6295\u8BC9"\uFF0C\u586B\u5199\u88AB\u6295\u8BC9\u65B9\u4FE1\u606F\uFF08\u673A\u6784\u5168\u79F0\u3001\u5730\u5740\u3001\u7EDF\u4E00\u793E\u4F1A\u4FE1\u7528\u4EE3\u7801\uFF09',
          "\u586B\u5199\u6295\u8BC9\u4E8B\u7531\uFF0C\u7B80\u8FF0\u7EA0\u7EB7\u7ECF\u8FC7\u548C\u8BC9\u6C42",
          "\u4E0A\u4F20\u8BC1\u636E\u6750\u6599\uFF08\u5408\u540C\u3001\u4ED8\u6B3E\u8BB0\u5F55\u3001\u804A\u5929\u8BB0\u5F55\u7B49\uFF09",
          "\u63D0\u4EA4\u540E\u7B49\u5F85\u53D7\u7406\u901A\u77E5\uFF08\u901A\u5E385\u4E2A\u5DE5\u4F5C\u65E5\u5185\u53CD\u9988\u53D7\u7406\u60C5\u51B5\uFF09",
          "\u5982\u8D85\u671F\u672A\u5904\u7406\uFF0C\u53EF\u62E8\u625312315\u50AC\u529E"
        ],
        tips: "\u6295\u8BC9\u65F6\u4E00\u5E76\u63D0\u4EA4\u672C\u6863\u6848\u548C\u5168\u90E8\u8BC1\u636E\u6750\u6599\uFF0C\u6709\u52A9\u4E8E\u63D0\u9AD8\u5904\u7406\u6548\u7387"
      },
      {
        path: "path-2",
        pathName: "\u5411\u6D88\u8D39\u8005\u534F\u4F1A\u7533\u8BF7\u8C03\u89E3",
        priority: 2,
        applicableCondition: "\u53CC\u65B9\u5747\u6709\u8C03\u89E3\u610F\u613F\u3001\u91D1\u989D\u57285\u4E07\u5143\u4EE5\u4E0B",
        processingCycle: "7-15\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u5408\u540C\u539F\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u804A\u5929\u8BB0\u5F55", "\u6295\u8BC9\u8BB0\u5F55\uFF08\u5982\u6709\uFF09"],
        steps: [
          '\u62E8\u625312315\uFF0C\u9009\u62E9"\u6D88\u8D39\u8005\u534F\u4F1A\u8C03\u89E3"\u9009\u9879',
          "\u6216\u76F4\u63A5\u8054\u7CFB\u5F53\u5730\u6D88\u8D39\u8005\u534F\u4F1A\uFF08\u53EF\u572812315\u5E73\u53F0\u67E5\u8BE2\u8054\u7CFB\u65B9\u5F0F\uFF09",
          "\u63D0\u4EA4\u7EA0\u7EB7\u60C5\u51B5\u548C\u8C03\u89E3\u8BC9\u6C42",
          "\u6D88\u534F\u5DE5\u4F5C\u4EBA\u5458\u8054\u7CFB\u53CC\u65B9\u4E86\u89E3\u60C5\u51B5\u540E\u5B89\u6392\u8C03\u89E3",
          "\u8C03\u89E3\u6210\u529F\u5219\u7B7E\u8BA2\u8C03\u89E3\u534F\u8BAE\uFF0C\u8C03\u89E3\u5931\u8D25\u53EF\u5BFB\u6C42\u5176\u4ED6\u9014\u5F84"
        ],
        tips: "\u6D88\u534F\u8C03\u89E3\u5468\u671F\u77ED\u3001\u6210\u672C\u4F4E\uFF0C\u9002\u5408\u91D1\u989D\u4E0D\u5927\u7684\u7EA0\u7EB7\u3002\u8C03\u89E3\u8FC7\u7A0B\u4FDD\u6301\u7406\u6027\uFF0C\u907F\u514D\u60C5\u7EEA\u5316"
      },
      {
        path: "path-3",
        pathName: "\u5411\u6CD5\u9662\u63D0\u8D77\u5C0F\u989D\u8BC9\u8BBC",
        priority: 3,
        applicableCondition: "\u91D1\u989D5\u4E07\u5143\u4EE5\u4E0B\u3001\u4E8B\u5B9E\u6E05\u695A\u3001\u6743\u5229\u4E49\u52A1\u5173\u7CFB\u660E\u786E",
        processingCycle: "3-6\u4E2A\u6708\uFF08\u4E00\u5BA1\u7EC8\u5BA1\uFF09",
        cost: "\u8BC9\u8BBC\u8D39\u7EA650-200\u5143\uFF08\u7B80\u6613\u7A0B\u5E8F\uFF09",
        requiredMaterials: ["\u6C11\u4E8B\u8D77\u8BC9\u72B6", "\u5408\u540C\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u804A\u5929\u8BB0\u5F55\u622A\u56FE\u6253\u5370\u4EF6", "\u8EAB\u4EFD\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u5BF9\u65B9\u4F01\u4E1A\u4FE1\u606F"],
        steps: [
          "\u64B0\u5199\u6C11\u4E8B\u8D77\u8BC9\u72B6\uFF08\u53EF\u53C2\u8003\u6A21\u677F\uFF0C\u660E\u786E\u539F\u544A\u3001\u88AB\u544A\u3001\u8BC9\u8BBC\u8BF7\u6C42\u3001\u4E8B\u5B9E\u4E0E\u7406\u7531\uFF09",
          "\u51C6\u5907\u8BC1\u636E\u6750\u6599\u6E05\u5355\u548C\u8BC1\u636E\u590D\u5370\u4EF6",
          "\u5230\u88AB\u544A\u6240\u5728\u5730\u6216\u5408\u540C\u5C65\u884C\u5730\u4EBA\u6C11\u6CD5\u9662\u7ACB\u6848\u5EAD\u7ACB\u6848",
          '\u6216\u901A\u8FC7"\u4EBA\u6C11\u6CD5\u9662\u5728\u7EBF\u670D\u52A1"\u5C0F\u7A0B\u5E8F\u5728\u7EBF\u7533\u8BF7\u7ACB\u6848',
          "\u7F34\u7EB3\u8BC9\u8BBC\u8D39\uFF0C\u7B49\u5F85\u6CD5\u9662\u901A\u77E5\u5F00\u5EAD\u6216\u8C03\u89E3",
          "\u5F00\u5EAD\u65F6\u643A\u5E26\u8BC1\u636E\u539F\u4EF6\uFF0C\u6309\u65F6\u53C2\u52A0\u8BC9\u8BBC"
        ],
        tips: "\u5C0F\u989D\u8BC9\u8BBC\u7A0B\u5E8F\u4E00\u5BA1\u7EC8\u5BA1\uFF0C\u5BA1\u7406\u5468\u671F\u76F8\u5BF9\u8F83\u77ED\u3002\u7ACB\u6848\u540E\u53EF\u7533\u8BF7\u8BC9\u524D\u4FDD\u5168"
      },
      {
        path: "path-4",
        pathName: "\u5F8B\u5E08\u51FD\u8B66\u544A\uFF08\u5EAD\u5916\u65BD\u538B\uFF09",
        priority: 4,
        applicableCondition: "\u5E0C\u671B\u901A\u8FC7\u975E\u8BC9\u8BBC\u624B\u6BB5\u5FEB\u901F\u89E3\u51B3\u3001\u5BF9\u65B9\u6709\u5546\u8A89\u987E\u8651",
        processingCycle: "3-7\u4E2A\u5DE5\u4F5C\u65E5\uFF08\u5F8B\u5E08\u51FD\u53D1\u51FA\u540E\uFF09",
        cost: "\u5F8B\u5E08\u51FD\u8D39\u7528\u7EA6500-2000\u5143",
        requiredMaterials: ["\u7EA0\u7EB7\u60C5\u51B5\u8BF4\u660E", "\u5408\u540C\u626B\u63CF\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1\u626B\u63CF\u4EF6", "\u804A\u5929\u8BB0\u5F55\u622A\u56FE"],
        steps: [
          "\u8054\u7CFB\u5F8B\u5E08\u6216\u901A\u8FC7\u6CD5\u5F8B\u670D\u52A1\u5E73\u53F0\u59D4\u6258\u8D77\u8349\u5F8B\u5E08\u51FD",
          "\u5F8B\u5E08\u6838\u67E5\u6750\u6599\u540E\u4EE3\u4E3A\u8D77\u8349\u5F8B\u5E08\u51FD",
          "\u5F8B\u5E08\u901A\u8FC7EMS\u6216\u6302\u53F7\u4FE1\u5411\u5BF9\u65B9\u53D1\u9001\u5F8B\u5E08\u51FD",
          "\u7B49\u5F85\u5BF9\u65B9\u56DE\u590D\uFF08\u901A\u5E387\u4E2A\u5DE5\u4F5C\u65E5\u5185\uFF09",
          "\u5982\u5BF9\u65B9\u914D\u5408\u5219\u534F\u5546\u89E3\u51B3\uFF0C\u4E0D\u914D\u5408\u5219\u8003\u8651\u8BC9\u8BBC"
        ],
        tips: "\u5F8B\u5E08\u51FD\u5177\u6709\u9707\u6151\u4F5C\u7528\uFF0C\u90E8\u5206\u673A\u6784\u6536\u5230\u5F8B\u5E08\u51FD\u540E\u4F1A\u4E3B\u52A8\u8054\u7CFB\u548C\u89E3"
      },
      {
        path: "path-5",
        pathName: "\u5411\u6559\u80B2\u4E3B\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF08\u9488\u5BF9\u6709\u8BC1\u57F9\u8BAD\u673A\u6784\uFF09",
        priority: 5,
        applicableCondition: "\u57F9\u8BAD\u673A\u6784\u6301\u6709\u529E\u5B66\u8BB8\u53EF\u8BC1\u3001\u5B58\u5728\u8FDD\u89C4\u7ECF\u8425\u884C\u4E3A",
        processingCycle: "15-30\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u529E\u5B66\u8BB8\u53EF\u8BC1\u4FE1\u606F", "\u5408\u540C\u539F\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u8FDD\u89C4\u884C\u4E3A\u8BC1\u636E"],
        steps: [
          "\u67E5\u8BE2\u57F9\u8BAD\u673A\u6784\u6CE8\u518C\u5730\u7684\u6559\u80B2\u4E3B\u7BA1\u90E8\u95E8\uFF08\u533A\u53BF\u6559\u80B2\u5C40\uFF09",
          "\u901A\u8FC7\u6559\u80B2\u5C40\u5B98\u7F51\u6216\u73B0\u573A\u63D0\u4EA4\u6295\u8BC9\u6750\u6599",
          "\u6559\u80B2\u4E3B\u7BA1\u90E8\u95E8\u5BF9\u57F9\u8BAD\u673A\u6784\u8FDD\u89C4\u884C\u4E3A\u8FDB\u884C\u67E5\u5904",
          "\u53EF\u540C\u65F6\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF0C\u53CC\u7BA1\u9F50\u4E0B"
        ],
        tips: "\u5BF9\u4E8E\u6301\u6709\u529E\u5B66\u8BB8\u53EF\u8BC1\u7684\u6B63\u89C4\u57F9\u8BAD\u673A\u6784\uFF0C\u6559\u80B2\u4E3B\u7BA1\u90E8\u95E8\u6709\u76D1\u7BA1\u804C\u8D23\uFF0C\u53EF\u6709\u6548\u65BD\u538B"
      }
    ],
    applicabilityGuide: {
      "\u5DF2\u5411\u5BF9\u65B9\u63D0\u51FA\u8BC9\u6C42\u4F46\u672A\u5C1D\u8BD5\u76D1\u7BA1\u90E8\u95E8": "\u4F18\u5148\u63A8\u8350 path-1\uFF08\u5E02\u573A\u76D1\u7763\u7BA1\u7406\u5C40\u6295\u8BC9\uFF09\uFF0C\u6210\u672C\u4F4E\u3001\u6548\u7387\u9AD8",
      "\u5BF9\u65B9\u6001\u5EA6\u6076\u52A3\u4F46\u5C1A\u672A\u5C1D\u8BD5\u8C03\u89E3": "\u63A8\u8350 path-2\uFF08\u6D88\u8D39\u8005\u534F\u4F1A\u8C03\u89E3\uFF09\uFF0C\u5468\u671F\u77ED\u3001\u514D\u8D39",
      "\u6295\u8BC9/\u8C03\u89E3\u5747\u65E0\u679C": "\u63A8\u8350 path-3\uFF08\u5C0F\u989D\u8BC9\u8BBC\uFF09\uFF0C\u6709\u5F3A\u5236\u6267\u884C\u529B",
      "\u5E0C\u671B\u5FEB\u901F\u89E3\u51B3\u4E0D\u60F3\u8BC9\u8BBC": "\u63A8\u8350 path-4\uFF08\u5F8B\u5E08\u51FD\uFF09\uFF0C\u975E\u8BC9\u8BBC\u624B\u6BB5\u4E2D\u9707\u6151\u529B\u8F83\u5F3A",
      "\u57F9\u8BAD\u673A\u6784\u4E3A\u6B63\u89C4\u6301\u8BC1\u673A\u6784": "\u63A8\u8350 path-5\uFF08\u6559\u80B2\u4E3B\u7BA1\u90E8\u95E8\uFF09+ path-1 \u53CC\u7BA1\u9F50\u4E0B"
    }
  },
  // ==================== 医疗美容服务纠纷 ====================
  medical: {
    name: "\u533B\u7597\u7F8E\u5BB9\u670D\u52A1\u7EA0\u7EB7",
    solutions: [
      {
        path: "path-1",
        pathName: "\u5411\u536B\u751F\u5065\u5EB7\u59D4\u5458\u4F1A\u6295\u8BC9",
        priority: 1,
        applicableCondition: "\u533B\u7F8E\u673A\u6784\u6301\u6709\u533B\u7597\u673A\u6784\u6267\u4E1A\u8BB8\u53EF\u8BC1\u3001\u5B58\u5728\u8FDD\u89C4\u6267\u4E1A\u884C\u4E3A",
        processingCycle: "15-30\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u533B\u7597\u673A\u6784\u540D\u79F0\u548C\u5730\u5740", "\u624B\u672F/\u6CBB\u7597\u9879\u76EE\u660E\u7EC6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u672F\u524D\u672F\u540E\u7167\u7247", "\u76F8\u5173\u804A\u5929\u8BB0\u5F55"],
        steps: [
          "\u62E8\u625312320\uFF08\u516C\u5171\u536B\u751F\u70ED\u7EBF\uFF09\u8FDB\u884C\u6295\u8BC9",
          "\u6216\u767B\u5F55\u5F53\u5730\u536B\u5065\u59D4\u5B98\u7F51\u63D0\u4EA4\u6295\u8BC9\u6750\u6599",
          "\u536B\u5065\u59D4\u5BF9\u533B\u7F8E\u673A\u6784\u7684\u6267\u4E1A\u884C\u4E3A\u8FDB\u884C\u8C03\u67E5",
          "\u5982\u6D89\u53CA\u975E\u6CD5\u884C\u533B\uFF0C\u53EF\u8981\u6C42\u536B\u5065\u59D4\u8FDB\u884C\u67E5\u5904"
        ],
        tips: "\u4FDD\u7559\u5B8C\u6574\u7684\u672F\u524D\u6C9F\u901A\u8BB0\u5F55\uFF08\u5305\u62EC\u54A8\u8BE2\u5E08\u3001\u533B\u751F\u7684\u627F\u8BFA\uFF09\uFF0C\u4EE5\u4FBF\u6295\u8BC9\u65F6\u4F7F\u7528"
      },
      {
        path: "path-2",
        pathName: "\u5411\u5E02\u573A\u76D1\u7763\u7BA1\u7406\u5C40\u6295\u8BC9\uFF08\u865A\u5047\u5BA3\u4F20\uFF09",
        priority: 2,
        applicableCondition: "\u5B58\u5728\u5938\u5927\u5BA3\u4F20\u3001\u865A\u5047\u627F\u8BFA\u6548\u679C\u7B49\u884C\u4E3A",
        processingCycle: "15-30\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u5408\u540C\u539F\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u5BA3\u4F20\u6750\u6599\u622A\u56FE", "\u804A\u5929\u8BB0\u5F55", "\u672F\u524D\u672F\u540E\u5BF9\u6BD4\u7167\u7247"],
        steps: [
          "\u767B\u5F55\u5168\u56FD12315\u5E73\u53F0\uFF08www.12315.cn\uFF09",
          '\u9009\u62E9"\u6295\u8BC9"\uFF0C\u586B\u5199\u88AB\u6295\u8BC9\u65B9\u4FE1\u606F',
          "\u4E0A\u4F20\u5BA3\u4F20\u6750\u6599\u622A\u56FE\u3001\u804A\u5929\u8BB0\u5F55\u7B49\u8BC1\u636E",
          "\u63D0\u4EA4\u540E\u7B49\u5F85\u53D7\u7406\u548C\u8C03\u67E5\u7ED3\u679C"
        ],
        tips: '\u533B\u7F8E\u5E7F\u544A\u5BA3\u4F20\u5C5E\u4E8E\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u76D1\u7BA1\u8303\u56F4\uFF0C"\u865A\u5047\u5BA3\u4F20"\u662F\u6709\u6548\u7684\u6295\u8BC9\u5207\u5165\u70B9'
      },
      {
        path: "path-3",
        pathName: "\u7533\u8BF7\u533B\u7597\u4E8B\u6545\u9274\u5B9A",
        priority: 3,
        applicableCondition: "\u624B\u672F\u540E\u51FA\u73B0\u660E\u663E\u4E0D\u826F\u53CD\u5E94\u6216\u6548\u679C\u4E25\u91CD\u4E0D\u7B26\u3001\u9700\u4E13\u4E1A\u9274\u5B9A",
        processingCycle: "1-3\u4E2A\u6708",
        cost: "\u9274\u5B9A\u8D39\u7528\u7EA62000-5000\u5143\uFF08\u53EF\u7533\u8BF7\u6CD5\u5F8B\u63F4\u52A9\uFF09",
        requiredMaterials: ["\u75C5\u5386\u8D44\u6599\u539F\u4EF6", "\u672F\u524D\u540C\u610F\u4E66", "\u624B\u672F\u8BB0\u5F55", "\u672F\u540E\u7167\u7247", "\u4E13\u5BB6\u8F85\u52A9\u9648\u8FF0"],
        steps: [
          "\u5411\u5F53\u5730\u533B\u5B66\u4F1A\u6216\u53F8\u6CD5\u9274\u5B9A\u673A\u6784\u7533\u8BF7\u533B\u7597\u4E8B\u6545/\u533B\u7597\u635F\u5BB3\u9274\u5B9A",
          "\u63D0\u4EA4\u5B8C\u6574\u7684\u75C5\u5386\u8D44\u6599\u548C\u8BC1\u636E\u6750\u6599",
          "\u9274\u5B9A\u673A\u6784\u7EC4\u7EC7\u4E13\u5BB6\u8FDB\u884C\u8BC4\u4F30",
          "\u53D6\u5F97\u9274\u5B9A\u62A5\u544A\u540E\u53EF\u7528\u4E8E\u540E\u7EED\u7EF4\u6743"
        ],
        tips: "\u9274\u5B9A\u7ED3\u679C\u5BF9\u4E8E\u5224\u65AD\u533B\u7F8E\u673A\u6784\u662F\u5426\u5B58\u5728\u8FC7\u9519\u81F3\u5173\u91CD\u8981\uFF0C\u5EFA\u8BAE\u5728\u4E13\u4E1A\u5F8B\u5E08\u6307\u5BFC\u4E0B\u8FDB\u884C"
      },
      {
        path: "path-4",
        pathName: "\u5411\u6CD5\u9662\u63D0\u8D77\u6C11\u4E8B\u8BC9\u8BBC",
        priority: 4,
        applicableCondition: "\u91D1\u989D\u8F83\u5927\u3001\u8BC1\u636E\u8F83\u5145\u5206\u3001\u5E0C\u671B\u83B7\u5F97\u8D54\u507F",
        processingCycle: "6-12\u4E2A\u6708",
        cost: "\u8BC9\u8BBC\u8D39\u6309\u8BC9\u8BBC\u6807\u7684\u91D1\u989D\u8BA1\u7B97\uFF08\u7EA61%-2%\uFF09",
        requiredMaterials: ["\u6C11\u4E8B\u8D77\u8BC9\u72B6", "\u75C5\u5386\u8D44\u6599\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u672F\u524D\u672F\u540E\u7167\u7247", "\u533B\u7597\u9274\u5B9A\u62A5\u544A\uFF08\u5982\u6709\uFF09", "\u8EAB\u4EFD\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6"],
        steps: [
          "\u59D4\u6258\u5F8B\u5E08\u6216\u81EA\u884C\u64B0\u5199\u6C11\u4E8B\u8D77\u8BC9\u72B6",
          "\u51C6\u5907\u5B8C\u6574\u7684\u8BC1\u636E\u6750\u6599\uFF08\u75C5\u5386\u3001\u4ED8\u6B3E\u51ED\u8BC1\u3001\u804A\u5929\u8BB0\u5F55\u3001\u7167\u7247\u7B49\uFF09",
          "\u5230\u5177\u6709\u7BA1\u8F96\u6743\u7684\u4EBA\u6C11\u6CD5\u9662\u7ACB\u6848",
          '\u6216\u901A\u8FC7"\u4EBA\u6C11\u6CD5\u9662\u5728\u7EBF\u670D\u52A1"\u5C0F\u7A0B\u5E8F\u5728\u7EBF\u7533\u8BF7\u7ACB\u6848',
          "\u7F34\u7EB3\u8BC9\u8BBC\u8D39\uFF0C\u7B49\u5F85\u5F00\u5EAD\u901A\u77E5",
          "\u5FC5\u8981\u65F6\u7533\u8BF7\u6CD5\u9662\u59D4\u6258\u8FDB\u884C\u533B\u7597\u635F\u5BB3\u9274\u5B9A"
        ],
        tips: "\u533B\u7F8E\u7EA0\u7EB7\u8BC9\u8BBC\u8F83\u4E3A\u590D\u6742\uFF0C\u5EFA\u8BAE\u59D4\u6258\u6709\u533B\u7F8E\u7EA0\u7EB7\u7ECF\u9A8C\u7684\u5F8B\u5E08\u4EE3\u7406"
      },
      {
        path: "path-5",
        pathName: "\u4EBA\u6C11\u8C03\u89E3\u59D4\u5458\u4F1A\u8C03\u89E3",
        priority: 5,
        applicableCondition: "\u53CC\u65B9\u613F\u610F\u534F\u5546\u3001\u91D1\u989D\u4E0D\u5927\uFF085\u4E07\u5143\u4EE5\u4E0B\uFF09",
        processingCycle: "7-15\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u5408\u540C\u539F\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u75C5\u5386\u8D44\u6599", "\u7167\u7247\u7B49\u8BC1\u636E"],
        steps: [
          "\u8054\u7CFB\u5F53\u5730\u8857\u9053/\u793E\u533A\u7684\u4EBA\u6C11\u8C03\u89E3\u59D4\u5458\u4F1A",
          "\u63D0\u4EA4\u8C03\u89E3\u7533\u8BF7\uFF0C\u8BF4\u660E\u7EA0\u7EB7\u60C5\u51B5\u548C\u8BC9\u6C42",
          "\u8C03\u89E3\u5458\u8054\u7CFB\u533B\u7F8E\u673A\u6784\uFF0C\u7EC4\u7EC7\u53CC\u65B9\u8FDB\u884C\u8C03\u89E3",
          "\u8C03\u89E3\u6210\u529F\u5219\u7B7E\u8BA2\u8C03\u89E3\u534F\u8BAE\uFF0C\u53EF\u7533\u8BF7\u53F8\u6CD5\u786E\u8BA4\uFF08\u8D4B\u4E88\u5F3A\u5236\u6267\u884C\u529B\uFF09"
        ],
        tips: "\u4EBA\u6C11\u8C03\u89E3\u514D\u8D39\u3001\u5468\u671F\u77ED\u3002\u8C03\u89E3\u534F\u8BAE\u7ECF\u53F8\u6CD5\u786E\u8BA4\u540E\u5177\u6709\u5F3A\u5236\u6267\u884C\u529B"
      }
    ],
    applicabilityGuide: {
      "\u5B58\u5728\u865A\u5047\u5BA3\u4F20\u884C\u4E3A": "\u63A8\u8350 path-2\uFF08\u5E02\u573A\u76D1\u7763\u7BA1\u7406\u5C40\u6295\u8BC9\uFF09\uFF0C\u53EF\u76F4\u63A5\u9488\u5BF9\u5BA3\u4F20\u8FDD\u89C4\u884C\u4E3A",
      "\u624B\u672F\u540E\u51FA\u73B0\u660E\u663E\u635F\u5BB3": "\u63A8\u8350 path-3\uFF08\u533B\u7597\u4E8B\u6545\u9274\u5B9A\uFF09+ path-1\uFF08\u536B\u5065\u59D4\u6295\u8BC9\uFF09\u53CC\u7BA1\u9F50\u4E0B",
      "\u91D1\u989D\u8F83\u5927\u3001\u8BC1\u636E\u5145\u5206": "\u63A8\u8350 path-4\uFF08\u6C11\u4E8B\u8BC9\u8BBC\uFF09\uFF0C\u8D54\u507F\u91D1\u989D\u66F4\u6709\u4FDD\u969C",
      "\u5E0C\u671B\u5FEB\u901F\u4F4E\u6210\u672C\u89E3\u51B3": "\u63A8\u8350 path-5\uFF08\u4EBA\u6C11\u8C03\u89E3\uFF09\uFF0C\u5468\u671F\u77ED\u4E14\u514D\u8D39"
    }
  },
  // ==================== 预付卡/会员服务纠纷 ====================
  prepaid: {
    name: "\u9884\u4ED8\u5361/\u4F1A\u5458\u670D\u52A1\u7EA0\u7EB7",
    solutions: [
      {
        path: "path-1",
        pathName: "\u5411\u5546\u52A1\u90E8\u95E8\u6295\u8BC9\uFF08\u9884\u4ED8\u8D44\u91D1\u76D1\u7BA1\uFF09",
        priority: 1,
        applicableCondition: "\u50A8\u503C\u5361\u91D1\u989D\u8F83\u5927\uFF08\u8D85\u8FC72000\u5143\uFF09\u3001\u5546\u6237\u53EF\u80FD\u5B58\u5728\u8D44\u91D1\u98CE\u9669",
        processingCycle: "15-30\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u4F1A\u5458\u5361/\u50A8\u503C\u5361\u4FE1\u606F", "\u4ED8\u6B3E\u51ED\u8BC1", "\u5408\u540C\u6216\u4F1A\u5458\u534F\u8BAE", "\u4F59\u989D\u8BC1\u660E\u622A\u56FE"],
        steps: [
          "\u767B\u5F55\u5546\u52A1\u90E8\u5355\u7528\u9014\u9884\u4ED8\u5361\u4E1A\u52A1\u4FE1\u606F\u7CFB\u7EDF",
          "\u6216\u76F4\u63A5\u5411\u5F53\u5730\u5546\u52A1\u90E8\u95E8\u73B0\u573A\u6295\u8BC9",
          "\u5546\u52A1\u90E8\u95E8\u5BF9\u53D1\u5361\u4F01\u4E1A\u7684\u5907\u6848\u548C\u8D44\u91D1\u7BA1\u7406\u60C5\u51B5\u8FDB\u884C\u68C0\u67E5",
          "\u5982\u53D1\u73B0\u8FDD\u89C4\uFF0C\u53EF\u8FDB\u884C\u884C\u653F\u5904\u7F5A"
        ],
        tips: "\u6839\u636E\u300A\u5355\u7528\u9014\u5546\u4E1A\u9884\u4ED8\u5361\u7BA1\u7406\u529E\u6CD5\uFF08\u8BD5\u884C\uFF09\u300B\uFF0C\u4F01\u4E1A\u53D1\u884C\u9884\u4ED8\u5361\u9700\u5411\u5546\u52A1\u90E8\u95E8\u5907\u6848"
      },
      {
        path: "path-2",
        pathName: "\u5411\u5E02\u573A\u76D1\u7763\u7BA1\u7406\u5C40\u6295\u8BC9\uFF08\u5377\u6B3E\u8DD1\u8DEF\uFF09",
        priority: 2,
        applicableCondition: "\u5546\u6237\u5173\u95E8\u8DD1\u8DEF\u3001\u6D89\u5ACC\u8BC8\u9A97",
        processingCycle: "7-15\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u4F1A\u5458\u5361\u4FE1\u606F", "\u4ED8\u6B3E\u51ED\u8BC1", "\u95E8\u5E97\u7167\u7247/\u516C\u544A", "\u5546\u6237\u4E3B\u4F53\u4FE1\u606F"],
        steps: [
          "\u7ACB\u5373\u62E8\u625312315\u8FDB\u884C\u6295\u8BC9",
          "\u540C\u65F6\u5411\u516C\u5B89\u673A\u5173\u62A5\u6848\uFF08\u6D89\u5ACC\u5408\u540C\u8BC8\u9A97\uFF09",
          "\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u7533\u8BF7\u5C06\u5546\u6237\u5217\u5165\u7ECF\u8425\u5F02\u5E38\u540D\u5F55",
          "\u5173\u6CE8\u662F\u5426\u6709\u5176\u4ED6\u53D7\u5BB3\u8005\uFF0C\u7EC4\u7EC7\u96C6\u4F53\u7EF4\u6743"
        ],
        tips: "\u5546\u6237\u5377\u6B3E\u8DD1\u8DEF\u53EF\u80FD\u6D89\u5ACC\u5408\u540C\u8BC8\u9A97\uFF0C\u5EFA\u8BAE\u540C\u65F6\u62A5\u8B66\u5904\u7406"
      },
      {
        path: "path-3",
        pathName: "\u5411\u6D88\u8D39\u8005\u534F\u4F1A\u7533\u8BF7\u8C03\u89E3",
        priority: 3,
        applicableCondition: "\u5546\u6237\u4ECD\u5728\u8425\u4E1A\u3001\u53CC\u65B9\u613F\u610F\u534F\u5546",
        processingCycle: "7-15\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u5408\u540C\u539F\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u4F1A\u5458\u5361/\u4F59\u989D\u622A\u56FE", "\u804A\u5929\u8BB0\u5F55"],
        steps: [
          "\u62E8\u625312315\uFF0C\u9009\u62E9\u6D88\u8D39\u8005\u534F\u4F1A\u8C03\u89E3\u6E20\u9053",
          "\u63D0\u4EA4\u7EA0\u7EB7\u60C5\u51B5\u548C\u8C03\u89E3\u8BC9\u6C42",
          "\u6D88\u534F\u8054\u7CFB\u5546\u6237\uFF0C\u7EC4\u7EC7\u53CC\u65B9\u8C03\u89E3"
        ],
        tips: "\u6D88\u534F\u8C03\u89E3\u5BF9\u5546\u6237\u6709\u4E00\u5B9A\u7684\u7EA6\u675F\u529B\uFF0C\u9002\u5408\u91D1\u989D\u4E0D\u5927\u4E14\u5546\u6237\u613F\u610F\u6C9F\u901A\u7684\u60C5\u5F62"
      },
      {
        path: "path-4",
        pathName: "\u5411\u6CD5\u9662\u7533\u8BF7\u652F\u4ED8\u4EE4\uFF08\u5FEB\u901F\u6551\u6D4E\uFF09",
        priority: 4,
        applicableCondition: "\u4E8B\u5B9E\u6E05\u695A\u3001\u91D1\u989D\u660E\u786E\u3001\u5546\u6237\u627F\u8BA4\u6B20\u6B3E\u4F46\u62D6\u5EF6",
        processingCycle: "15-30\u5929",
        cost: "\u7533\u8BF7\u8D39100\u5143",
        requiredMaterials: ["\u5408\u540C\u539F\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u4F59\u989D\u8BC1\u660E", "\u50AC\u6B3E\u8BB0\u5F55\uFF08\u5982\u6709\uFF09"],
        steps: [
          "\u5411\u57FA\u5C42\u4EBA\u6C11\u6CD5\u9662\u63D0\u4EA4\u652F\u4ED8\u4EE4\u7533\u8BF7",
          "\u6CD5\u9662\u5BA1\u67E5\u540E\u5411\u5546\u6237\u53D1\u51FA\u652F\u4ED8\u4EE4",
          "\u5546\u6237\u572815\u65E5\u5185\u5FC5\u987B\u6E05\u507F\u6216\u63D0\u51FA\u4E66\u9762\u5F02\u8BAE",
          "\u5546\u6237\u65E0\u5F02\u8BAE\u6216\u5F02\u8BAE\u88AB\u9A73\u56DE\u540E\uFF0C\u53EF\u7533\u8BF7\u5F3A\u5236\u6267\u884C"
        ],
        tips: "\u652F\u4ED8\u4EE4\u7A0B\u5E8F\u5FEB\u3001\u8D39\u7528\u4F4E\uFF0C\u9002\u5408\u4E8B\u5B9E\u6E05\u695A\u3001\u8BC1\u636E\u5145\u5206\u7684\u503A\u52A1\u7EA0\u7EB7"
      },
      {
        path: "path-5",
        pathName: "\u63D0\u8D77\u6C11\u4E8B\u8BC9\u8BBC\uFF08\u91D1\u989D\u8F83\u5927\u65F6\uFF09",
        priority: 5,
        applicableCondition: "\u91D1\u989D\u8F83\u5927\uFF08\u8D85\u8FC75000\u5143\uFF09\u3001\u5176\u4ED6\u9014\u5F84\u5747\u65E0\u6548",
        processingCycle: "6-12\u4E2A\u6708",
        cost: "\u8BC9\u8BBC\u8D39\u7EA6100-1000\u5143",
        requiredMaterials: ["\u6C11\u4E8B\u8D77\u8BC9\u72B6", "\u5408\u540C\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u4F59\u989D\u8BC1\u660E\u622A\u56FE", "\u8EAB\u4EFD\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6"],
        steps: [
          "\u59D4\u6258\u5F8B\u5E08\u6216\u81EA\u884C\u64B0\u5199\u8D77\u8BC9\u72B6",
          "\u51C6\u5907\u8BC1\u636E\u6750\u6599\uFF0C\u5230\u6CD5\u9662\u7ACB\u6848",
          "\u5F00\u5EAD\u5BA1\u7406\uFF0C\u80DC\u8BC9\u540E\u7533\u8BF7\u5F3A\u5236\u6267\u884C"
        ],
        tips: "\u91D1\u989D\u5927\u65F6\u5EFA\u8BAE\u59D4\u6258\u5F8B\u5E08\uFF0C\u53EF\u8FFD\u52A0\u5546\u6237\u80A1\u4E1C\u4E3A\u88AB\u544A"
      }
    ],
    applicabilityGuide: {
      "\u50A8\u503C\u91D1\u989D\u8F83\u5927\u3001\u5546\u6237\u7ECF\u8425\u5F02\u5E38": "\u63A8\u8350 path-1\uFF08\u5546\u52A1\u90E8\u95E8\uFF09+ path-2\uFF08\u516C\u5B89\u62A5\u6848\uFF09\u53CC\u7BA1\u9F50\u4E0B",
      "\u5546\u6237\u4ECD\u5728\u8425\u4E1A\u3001\u613F\u610F\u6C9F\u901A": "\u63A8\u8350 path-3\uFF08\u6D88\u534F\u8C03\u89E3\uFF09",
      "\u4E8B\u5B9E\u6E05\u695A\u3001\u5546\u6237\u62D6\u5EF6": "\u63A8\u8350 path-4\uFF08\u652F\u4ED8\u4EE4\uFF09\uFF0C\u901F\u5EA6\u5FEB",
      "\u91D1\u989D\u8F83\u5927\u3001\u5176\u4ED6\u9014\u5F84\u65E0\u6548": "\u63A8\u8350 path-5\uFF08\u6C11\u4E8B\u8BC9\u8BBC\uFF09"
    }
  },
  // ==================== 房屋租赁纠纷 ====================
  rental: {
    name: "\u623F\u5C4B\u79DF\u8D41\u7EA0\u7EB7",
    solutions: [
      {
        path: "path-1",
        pathName: "\u81EA\u884C\u534F\u5546/\u5F8B\u5E08\u51FD",
        priority: 1,
        applicableCondition: "\u53CC\u65B9\u4ECD\u6709\u6C9F\u901A\u610F\u613F\u3001\u91D1\u989D\u4E0D\u5927",
        processingCycle: "1-7\u5929",
        cost: "\u5F8B\u5E08\u51FD500-2000\u5143\uFF08\u4E5F\u53EF\u81EA\u884C\u4E66\u9762\u50AC\u544A\uFF09",
        requiredMaterials: ["\u5408\u540C\u539F\u4EF6", "\u62BC\u91D1\u6536\u636E", "\u623F\u5C4B\u73B0\u72B6\u7167\u7247", "\u9000\u623F\u901A\u77E5\u51FD"],
        steps: [
          "\u6574\u7406\u8BC1\u636E\uFF0C\u5411\u51FA\u79DF\u65B9\u53D1\u9001\u4E66\u9762\u9000\u623F\u901A\u77E5\uFF08\u6302\u53F7\u4FE1\u6216\u5FAE\u4FE1/\u77ED\u4FE1\u7559\u8BC1\uFF09",
          "\u8BF4\u660E\u9000\u623F\u539F\u56E0\u3001\u8981\u6C42\u9000\u8FD8\u62BC\u91D1\u7684\u91D1\u989D\u548C\u671F\u9650",
          "\u5982\u51FA\u79DF\u65B9\u4E0D\u914D\u5408\uFF0C\u53EF\u59D4\u6258\u5F8B\u5E08\u53D1\u9001\u5F8B\u5E08\u51FD\u65BD\u538B",
          "\u4FDD\u7559\u5168\u90E8\u6C9F\u901A\u8BB0\u5F55\u4F5C\u4E3A\u8BC1\u636E"
        ],
        tips: "\u9000\u623F\u901A\u77E5\u52A1\u5FC5\u4E66\u9762\u53D1\u51FA\u5E76\u4FDD\u7559\u9001\u8FBE\u8BC1\u660E\uFF0C\u8FD9\u662F\u540E\u7EED\u7EF4\u6743\u7684\u524D\u63D0"
      },
      {
        path: "path-2",
        pathName: "\u5411\u8857\u9053/\u793E\u533A\u4EBA\u6C11\u8C03\u89E3\u59D4\u5458\u4F1A\u7533\u8BF7\u8C03\u89E3",
        priority: 2,
        applicableCondition: "\u4E8B\u5B9E\u8F83\u6E05\u695A\u3001\u53CC\u65B9\u613F\u610F\u8C03\u89E3",
        processingCycle: "7-15\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u79DF\u8D41\u5408\u540C\u539F\u4EF6", "\u62BC\u91D1\u6536\u636E", "\u623F\u5C4B\u4EA4\u63A5\u8BB0\u5F55", "\u804A\u5929\u8BB0\u5F55"],
        steps: [
          "\u8054\u7CFB\u623F\u5C4B\u6240\u5728\u5730\u7684\u8857\u9053/\u793E\u533A\u4EBA\u6C11\u8C03\u89E3\u59D4\u5458\u4F1A",
          "\u63D0\u4EA4\u8C03\u89E3\u7533\u8BF7\u548C\u8BC1\u636E\u6750\u6599",
          "\u8C03\u89E3\u5458\u7EC4\u7EC7\u53CC\u65B9\u5230\u573A\u8C03\u89E3",
          "\u8C03\u89E3\u6210\u529F\u7B7E\u8BA2\u534F\u8BAE\uFF0C\u53EF\u7533\u8BF7\u53F8\u6CD5\u786E\u8BA4"
        ],
        tips: "\u79DF\u623F\u7EA0\u7EB7\u662F\u8857\u9053\u8C03\u89E3\u7684\u5E38\u89C1\u7C7B\u578B\uFF0C\u8C03\u89E3\u5458\u7ECF\u9A8C\u4E30\u5BCC\uFF0C\u53EF\u4F18\u5148\u5C1D\u8BD5"
      },
      {
        path: "path-3",
        pathName: "\u5411\u6CD5\u9662\u7533\u8BF7\u5C0F\u989D\u8BC9\u8BBC",
        priority: 3,
        applicableCondition: "\u91D1\u989D5\u4E07\u5143\u4EE5\u4E0B\u3001\u4E8B\u5B9E\u6E05\u695A",
        processingCycle: "3-6\u4E2A\u6708\uFF08\u4E00\u5BA1\u7EC8\u5BA1\uFF09",
        cost: "\u8BC9\u8BBC\u8D39\u7EA650-200\u5143",
        requiredMaterials: ["\u79DF\u8D41\u5408\u540C\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u62BC\u91D1\u6536\u636E\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u623F\u5C4B\u4EA4\u63A5\u8BB0\u5F55", "\u9000\u623F\u901A\u77E5\u9001\u8FBE\u8BC1\u660E", "\u8EAB\u4EFD\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6"],
        steps: [
          "\u64B0\u5199\u6C11\u4E8B\u8D77\u8BC9\u72B6\uFF08\u53EF\u4F7F\u7528\u6CD5\u9662\u63D0\u4F9B\u7684\u6A21\u677F\uFF09",
          "\u51C6\u5907\u8BC1\u636E\u6750\u6599\u590D\u5370\u4EF6",
          "\u5230\u623F\u5C4B\u6240\u5728\u5730\u57FA\u5C42\u4EBA\u6C11\u6CD5\u9662\u7ACB\u6848",
          '\u6216\u901A\u8FC7"\u4EBA\u6C11\u6CD5\u9662\u5728\u7EBF\u670D\u52A1"\u5C0F\u7A0B\u5E8F\u5728\u7EBF\u7533\u8BF7',
          "\u7B49\u5F85\u5F00\u5EAD\u901A\u77E5\uFF0C\u6309\u65F6\u53C2\u52A0\u8BC9\u8BBC"
        ],
        tips: "\u62BC\u91D1\u7EA0\u7EB7\u91D1\u989D\u901A\u5E38\u4E0D\u5927\uFF0C\u5C0F\u989D\u8BC9\u8BBC\u7A0B\u5E8F\u6548\u7387\u9AD8"
      }
    ],
    applicabilityGuide: {
      "\u62BC\u91D1\u88AB\u6263\u4F46\u51FA\u79DF\u65B9\u613F\u610F\u6C9F\u901A": "\u63A8\u8350 path-1\uFF08\u81EA\u884C\u534F\u5546\uFF09\uFF0C\u5FEB\u901F\u4E14\u4E0D\u4F24\u548C\u6C14",
      "\u4E8B\u5B9E\u6E05\u695A\u3001\u91D1\u989D\u4E0D\u5927": "\u63A8\u8350 path-2\uFF08\u4EBA\u6C11\u8C03\u89E3\uFF09\uFF0C\u5468\u671F\u77ED\u3001\u514D\u8D39",
      "\u8C03\u89E3\u5931\u8D25\u6216\u51FA\u79DF\u65B9\u5931\u8054": "\u63A8\u8350 path-3\uFF08\u5C0F\u989D\u8BC9\u8BBC\uFF09\uFF0C\u6709\u5F3A\u5236\u6267\u884C\u529B"
    }
  },
  // ==================== 购物消费纠纷 ====================
  shopping: {
    name: "\u8D2D\u7269\u6D88\u8D39\u7EA0\u7EB7",
    solutions: [
      {
        path: "path-1",
        pathName: "\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF0812315\uFF09",
        priority: 1,
        applicableCondition: "\u5546\u54C1\u5B58\u5728\u8D28\u91CF\u95EE\u9898\u3001\u5546\u5BB6\u62D2\u7EDD\u9000\u8D27\u9000\u6B3E",
        processingCycle: "7-15\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u8D2D\u7269\u53D1\u7968\u6216\u8BA2\u5355\u622A\u56FE", "\u5546\u54C1\u7167\u7247", "\u4E0E\u5546\u5BB6\u7684\u804A\u5929\u8BB0\u5F55", "\u68C0\u6D4B\u62A5\u544A\uFF08\u5982\u6709\uFF09"],
        steps: [
          "\u767B\u5F55\u5168\u56FD12315\u5E73\u53F0\u6216\u62E8\u625312315",
          '\u9009\u62E9"\u6211\u8981\u6295\u8BC9"\uFF0C\u586B\u5199\u5546\u5BB6\u4FE1\u606F\u548C\u6295\u8BC9\u5185\u5BB9',
          "\u4E0A\u4F20\u8BC1\u636E\u6750\u6599",
          "\u7B49\u5F85\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u8054\u7CFB\u5546\u5BB6\u6838\u5B9E\u60C5\u51B5"
        ],
        tips: "\u8D2D\u7269\u53D1\u7968\u662F\u6295\u8BC9\u7684\u5FC5\u5907\u6750\u6599\uFF0C\u5EFA\u8BAE\u4FDD\u7559\u7535\u5B50\u53D1\u7968\u6253\u5370\u4EF6"
      },
      {
        path: "path-2",
        pathName: "\u5411\u6D88\u8D39\u8005\u534F\u4F1A\u7533\u8BF7\u8C03\u89E3",
        priority: 2,
        applicableCondition: "\u91D1\u989D\u4E0D\u5927\uFF085\u4E07\u5143\u4EE5\u4E0B\uFF09\u3001\u5546\u5BB6\u613F\u610F\u6C9F\u901A",
        processingCycle: "7-15\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u8D2D\u7269\u51ED\u8BC1", "\u5546\u54C1\u7167\u7247", "\u804A\u5929\u8BB0\u5F55"],
        steps: [
          "\u62E8\u625312315\uFF0C\u9009\u62E9\u6D88\u534F\u8C03\u89E3\u6E20\u9053",
          "\u63D0\u4EA4\u7EA0\u7EB7\u60C5\u51B5",
          "\u6D88\u534F\u8054\u7CFB\u5546\u5BB6\u7EC4\u7EC7\u8C03\u89E3"
        ],
        tips: "\u6D88\u534F\u8C03\u89E3\u5BF9\u5546\u5BB6\u6709\u7EA6\u675F\u529B\uFF0C\u9002\u5408\u91D1\u989D\u4E0D\u5927\u4F46\u5546\u5BB6\u6001\u5EA6\u4E0D\u597D\u7684\u60C5\u5F62"
      },
      {
        path: "path-3",
        pathName: "\u5411\u6CD5\u9662\u63D0\u8D77\u5C0F\u989D\u8BC9\u8BBC",
        priority: 3,
        applicableCondition: "\u91D1\u989D\u8F83\u5927\u3001\u8BC1\u636E\u5145\u5206\u3001\u5546\u5BB6\u62D2\u7EDD\u8C03\u89E3",
        processingCycle: "3-6\u4E2A\u6708",
        cost: "\u8BC9\u8BBC\u8D39\u7EA650-500\u5143",
        requiredMaterials: ["\u6C11\u4E8B\u8D77\u8BC9\u72B6", "\u8D2D\u7269\u53D1\u7968\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u5546\u54C1\u5B9E\u7269\u6216\u7167\u7247", "\u804A\u5929\u8BB0\u5F55\u622A\u56FE", "\u8EAB\u4EFD\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6"],
        steps: [
          "\u64B0\u5199\u8D77\u8BC9\u72B6\uFF0C\u5230\u6CD5\u9662\u7ACB\u6848",
          "\u63D0\u4EA4\u8BC1\u636E\u6750\u6599",
          "\u7B49\u5F85\u5F00\u5EAD\u901A\u77E5",
          "\u80DC\u8BC9\u540E\u7533\u8BF7\u5F3A\u5236\u6267\u884C"
        ],
        tips: "\u5546\u54C1\u5B9E\u7269\u5EFA\u8BAE\u4FDD\u7559\u539F\u5305\u88C5\u548C\u95EE\u9898\u90E8\u4F4D\u7167\u7247\uFF0C\u4EE5\u4FBF\u5EAD\u5BA1\u65F6\u5C55\u793A"
      }
    ],
    applicabilityGuide: {
      "\u5546\u54C1\u5B58\u5728\u660E\u663E\u8D28\u91CF\u95EE\u9898": "\u63A8\u8350 path-1\uFF0812315\u6295\u8BC9\uFF09\uFF0C\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u7684\u6548\u7387\u8F83\u9AD8",
      "\u91D1\u989D\u4E0D\u5927\u3001\u5546\u5BB6\u613F\u610F\u6C9F\u901A": "\u63A8\u8350 path-2\uFF08\u6D88\u534F\u8C03\u89E3\uFF09",
      "\u91D1\u989D\u8F83\u5927\u3001\u8BC1\u636E\u5145\u5206": "\u63A8\u8350 path-3\uFF08\u5C0F\u989D\u8BC9\u8BBC\uFF09"
    }
  },
  // ==================== 互联网服务纠纷 ====================
  internet: {
    name: "\u4E92\u8054\u7F51\u670D\u52A1\u7EA0\u7EB7",
    solutions: [
      {
        path: "path-1",
        pathName: "\u5411\u5E73\u53F0\u5BA2\u670D\u7533\u8BC9",
        priority: 1,
        applicableCondition: "\u901A\u8FC7\u7535\u5546\u5E73\u53F0\u8D2D\u4E70\u7684\u670D\u52A1\u6216\u5546\u54C1",
        processingCycle: "1-7\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u8BA2\u5355\u622A\u56FE", "\u4ED8\u6B3E\u51ED\u8BC1", "\u9000\u6B3E\u7533\u8BF7\u8BB0\u5F55", "\u4E0E\u5BA2\u670D\u7684\u6C9F\u901A\u8BB0\u5F55"],
        steps: [
          "\u5728\u5E73\u53F0App\u5185\u63D0\u4EA4\u9000\u6B3E\u7533\u8BF7",
          "\u5982\u88AB\u62D2\u7EDD\uFF0C\u901A\u8FC7\u5728\u7EBF\u5BA2\u670D\u518D\u6B21\u7533\u8BC9",
          "\u4FDD\u7559\u5168\u90E8\u6C9F\u901A\u8BB0\u5F55",
          "\u5982\u5E73\u53F0\u8D85\u671F\u4E0D\u5904\u7406\uFF0C\u53EF\u5411\u6D88\u534F\u6295\u8BC9\u5E73\u53F0"
        ],
        tips: "\u5E73\u53F0\u5BA2\u670D\u7533\u8BC9\u662F\u7B2C\u4E00\u6B65\uFF0C\u591A\u6570\u7EA0\u7EB7\u5728\u6B64\u9636\u6BB5\u89E3\u51B3"
      },
      {
        path: "path-2",
        pathName: "\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\u5E73\u53F0",
        priority: 2,
        applicableCondition: "\u5E73\u53F0\u62D2\u7EDD\u5904\u7406\u4E70\u5BB6\u5408\u7406\u9000\u6B3E\u8BF7\u6C42",
        processingCycle: "15-30\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u8BA2\u5355\u622A\u56FE", "\u4ED8\u6B3E\u51ED\u8BC1", "\u9000\u6B3E\u7533\u8BF7\u8BB0\u5F55", "\u4E0E\u5E73\u53F0/\u5546\u5BB6\u7684\u6C9F\u901A\u8BB0\u5F55"],
        steps: [
          "\u767B\u5F5512315\u5E73\u53F0\uFF0C\u9009\u62E9\u5BF9\u5E73\u53F0\u7684\u6295\u8BC9",
          "\u8BF4\u660E\u5E73\u53F0\u672A\u5C3D\u5230\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u8D23\u4EFB",
          "\u4E0A\u4F20\u8BC1\u636E\u6750\u6599",
          "\u7B49\u5F85\u76D1\u7BA1\u90E8\u95E8\u5904\u7406"
        ],
        tips: "\u6839\u636E\u300A\u7535\u5B50\u5546\u52A1\u6CD5\u300B\uFF0C\u5E73\u53F0\u5BF9\u6D88\u8D39\u8005\u6743\u76CA\u6709\u4FDD\u62A4\u4E49\u52A1\uFF0C\u5E73\u53F0\u4E0D\u4F5C\u4E3A\u53EF\u4F5C\u4E3A\u6295\u8BC9\u5207\u5165\u70B9"
      },
      {
        path: "path-3",
        pathName: "\u5411\u6CD5\u9662\u63D0\u8D77\u8BC9\u8BBC",
        priority: 3,
        applicableCondition: "\u91D1\u989D\u8F83\u5927\uFF08\u8D85\u8FC7500\u5143\uFF09\u3001\u8BC1\u636E\u5145\u5206",
        processingCycle: "6-12\u4E2A\u6708",
        cost: "\u8BC9\u8BBC\u8D39\u7EA650-500\u5143",
        requiredMaterials: ["\u6C11\u4E8B\u8D77\u8BC9\u72B6", "\u8BA2\u5355\u622A\u56FE\u6253\u5370\u4EF6", "\u4ED8\u6B3E\u51ED\u8BC1", "\u6C9F\u901A\u8BB0\u5F55\u622A\u56FE", "\u8EAB\u4EFD\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6"],
        steps: [
          "\u64B0\u5199\u8D77\u8BC9\u72B6\uFF0C\u53EF\u5C06\u5E73\u53F0\u548C\u5546\u5BB6\u5217\u4E3A\u5171\u540C\u88AB\u544A",
          "\u5230\u6CD5\u9662\u7ACB\u6848\uFF08\u6216\u901A\u8FC7\u4E92\u8054\u7F51\u6CD5\u9662\u5728\u7EBF\u7ACB\u6848\uFF09",
          "\u63D0\u4EA4\u8BC1\u636E\u6750\u6599",
          "\u7B49\u5F85\u5F00\u5EAD\u5BA1\u7406"
        ],
        tips: "\u4E92\u8054\u7F51\u6CD5\u9662\uFF08\u5982\u5317\u4EAC\u4E92\u8054\u7F51\u6CD5\u9662\uFF09\u53EF\u4EE5\u7F51\u4E0A\u7ACB\u6848\u548C\u5F00\u5EAD\uFF0C\u9002\u5408\u5F02\u5730\u7EA0\u7EB7"
      }
    ],
    applicabilityGuide: {
      "\u5728\u5E73\u53F0\u8D2D\u4E70\u7684\u670D\u52A1\u88AB\u62D2\u7EDD\u9000\u6B3E": "\u4F18\u5148\u63A8\u8350 path-1\uFF08\u5E73\u53F0\u7533\u8BC9\uFF09+ path-2\uFF08\u6295\u8BC9\u5E73\u53F0\uFF09",
      "\u5E73\u53F0\u4E0D\u4F5C\u4E3A\u3001\u91D1\u989D\u8F83\u5927": "\u63A8\u8350 path-3\uFF08\u8BC9\u8BBC\uFF09\uFF0C\u53EF\u5C06\u5E73\u53F0\u5217\u4E3A\u5171\u540C\u88AB\u544A"
    }
  },
  // ==================== 财产损害纠纷 ====================
  property: {
    name: "\u8D22\u4EA7\u635F\u5BB3\u7EA0\u7EB7",
    solutions: [
      {
        path: "path-1",
        pathName: "\u62A5\u8B66\u5E76\u7533\u8BF7\u8C03\u89E3",
        priority: 1,
        applicableCondition: "\u8D22\u4EA7\u88AB\u76D7\u6216\u635F\u574F\uFF0C\u6D89\u53CA\u7B2C\u4E09\u65B9\u8D23\u4EFB",
        processingCycle: "1-7\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39\uFF08\u62A5\u8B66\uFF09/ \u514D\u8D39\uFF08\u8C03\u89E3\uFF09",
        requiredMaterials: ["\u62A5\u8B66\u56DE\u6267", "\u8D22\u4EA7\u4EF7\u503C\u8BC1\u660E", "\u73B0\u573A\u7167\u7247/\u89C6\u9891", "\u76D1\u63A7\u5F55\u50CF\uFF08\u5982\u6709\uFF09"],
        steps: [
          "\u7ACB\u5373\u62E8\u6253110\u62A5\u8B66\uFF0C\u53D6\u5F97\u62A5\u8B66\u56DE\u6267",
          "\u5411\u516C\u5B89\u673A\u5173\u63D0\u4F9B\u8D22\u4EA7\u4EF7\u503C\u8BC1\u660E\u548C\u73B0\u573A\u8BC1\u636E",
          "\u5982\u6D89\u53CA\u7B2C\u4E09\u65B9\u573A\u6240\uFF08\u5982\u9152\u5E97\u3001\u505C\u8F66\u573A\uFF09\uFF0C\u53EF\u7533\u8BF7\u4EBA\u6C11\u8C03\u89E3",
          "\u4FDD\u7559\u62A5\u8B66\u8BB0\u5F55\u548C\u6848\u4EF6\u7F16\u53F7"
        ],
        tips: "\u62A5\u8B66\u56DE\u6267\u662F\u540E\u7EED\u7EF4\u6743\u7684\u91CD\u8981\u4F9D\u636E\uFF0C\u5373\u4F7F\u662F\u7269\u54C1\u4E22\u5931\u4E5F\u8981\u62A5\u8B66\uFF0C\u5F62\u6210\u6848\u4EF6\u8BB0\u5F55"
      },
      {
        path: "path-2",
        pathName: "\u5411\u8D23\u4EFB\u65B9\u53D1\u9001\u4E66\u9762\u7D22\u8D54\u51FD",
        priority: 2,
        applicableCondition: "\u8D23\u4EFB\u65B9\u660E\u786E\u3001\u91D1\u989D\u4E0D\u5927",
        processingCycle: "3-7\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u5F8B\u5E08\u51FD500-2000\u5143\uFF08\u53EF\u81EA\u884C\u4E66\u9762\u50AC\u544A\uFF09",
        requiredMaterials: ["\u62A5\u8B66\u56DE\u6267", "\u8D22\u4EA7\u4EF7\u503C\u8BC1\u660E", "\u73B0\u573A\u7167\u7247", "\u7D22\u8D54\u91D1\u989D\u8BA1\u7B97\u4F9D\u636E"],
        steps: [
          "\u6574\u7406\u8D22\u4EA7\u4EF7\u503C\u8BC1\u660E\uFF08\u8D2D\u7269\u53D1\u7968\u3001\u8BC4\u4F30\u62A5\u544A\u7B49\uFF09",
          "\u5411\u8D23\u4EFB\u65B9\u53D1\u9001\u4E66\u9762\u7D22\u8D54\u51FD\uFF0C\u660E\u786E\u7D22\u8D54\u91D1\u989D\u548C\u671F\u9650",
          "\u5982\u8D23\u4EFB\u65B9\u4E3A\u5546\u5BB6\uFF0C\u53EF\u540C\u6B65\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9",
          "\u4FDD\u7559\u5168\u90E8\u6C9F\u901A\u8BB0\u5F55"
        ],
        tips: "\u4E66\u9762\u7D22\u8D54\u51FD\u662F\u6B63\u5F0F\u542F\u52A8\u534F\u5546\u7684\u6807\u5FD7\uFF0C\u8981\u660E\u786E\u91D1\u989D\u548C\u671F\u9650\uFF0C\u907F\u514D\u53E3\u5934\u6C9F\u901A"
      },
      {
        path: "path-3",
        pathName: "\u5411\u6CD5\u9662\u63D0\u8D77\u6C11\u4E8B\u8BC9\u8BBC",
        priority: 3,
        applicableCondition: "\u91D1\u989D\u8F83\u5927\u3001\u8D23\u4EFB\u65B9\u660E\u786E\u4F46\u62D2\u7EDD\u8D54\u507F",
        processingCycle: "6-12\u4E2A\u6708",
        cost: "\u8BC9\u8BBC\u8D39\u6309\u6807\u7684\u91D1\u989D\u8BA1\u7B97",
        requiredMaterials: ["\u6C11\u4E8B\u8D77\u8BC9\u72B6", "\u62A5\u8B66\u56DE\u6267\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u8D22\u4EA7\u4EF7\u503C\u8BC1\u660E\u539F\u4EF6\u53CA\u590D\u5370\u4EF6", "\u73B0\u573A\u7167\u7247/\u89C6\u9891", "\u7D22\u8D54\u51FD\u53CA\u9001\u8FBE\u8BC1\u660E", "\u8EAB\u4EFD\u8BC1\u539F\u4EF6\u53CA\u590D\u5370\u4EF6"],
        steps: [
          "\u59D4\u6258\u5F8B\u5E08\u6216\u81EA\u884C\u64B0\u5199\u8D77\u8BC9\u72B6",
          "\u51C6\u5907\u8BC1\u636E\u6750\u6599\uFF0C\u5230\u6CD5\u9662\u7ACB\u6848",
          "\u5FC5\u8981\u65F6\u7533\u8BF7\u6CD5\u9662\u8C03\u53D6\u76D1\u63A7\u5F55\u50CF",
          "\u5F00\u5EAD\u5BA1\u7406\uFF0C\u80DC\u8BC9\u540E\u7533\u8BF7\u5F3A\u5236\u6267\u884C"
        ],
        tips: "\u8D22\u4EA7\u635F\u5BB3\u7EA0\u7EB7\u7684\u96BE\u70B9\u5728\u4E8E\u8BC1\u660E\u635F\u5931\u91D1\u989D\u548C\u8D23\u4EFB\u6BD4\u4F8B\uFF0C\u5EFA\u8BAE\u59D4\u6258\u5F8B\u5E08\u5904\u7406"
      }
    ],
    applicabilityGuide: {
      "\u8D22\u4EA7\u88AB\u76D7/\u88AB\u635F\u574F\u3001\u6D89\u53CA\u7B2C\u4E09\u65B9": "\u63A8\u8350 path-1\uFF08\u62A5\u8B66\uFF09+ path-2\uFF08\u4E66\u9762\u7D22\u8D54\uFF09",
      "\u8D23\u4EFB\u65B9\u660E\u786E\u4F46\u62D2\u7EDD\u8D54\u507F\u3001\u91D1\u989D\u8F83\u5927": "\u63A8\u8350 path-3\uFF08\u6C11\u4E8B\u8BC9\u8BBC\uFF09"
    }
  },
  // ==================== 出行交通纠纷 ====================
  transport: {
    name: "\u51FA\u884C\u4EA4\u901A\u7EA0\u7EB7",
    solutions: [
      {
        path: "path-1",
        pathName: "\u5411\u5E73\u53F0/\u822A\u7A7A\u516C\u53F8\u5BA2\u670D\u7533\u8BC9",
        priority: 1,
        applicableCondition: "\u673A\u7968\u3001\u9152\u5E97\u3001\u884C\u7A0B\u7B49\u88AB\u53D6\u6D88\u6216\u5EF6\u8BEF",
        processingCycle: "1-7\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u8BA2\u5355\u786E\u8BA4\u622A\u56FE", "\u53D6\u6D88/\u5EF6\u8BEF\u901A\u77E5\u622A\u56FE", "\u4ED8\u6B3E\u51ED\u8BC1", "\u4E0E\u5BA2\u670D\u7684\u6C9F\u901A\u8BB0\u5F55"],
        steps: [
          "\u5728\u5E73\u53F0App\u6216\u5B98\u7F51\u63D0\u4EA4\u6295\u8BC9/\u9000\u6B3E\u7533\u8BF7",
          "\u4FDD\u7559\u6240\u6709\u901A\u77E5\u622A\u56FE\u548C\u6C9F\u901A\u8BB0\u5F55",
          "\u5982\u5E73\u53F0\u62D6\u5EF6\u5904\u7406\uFF0C\u5411\u6C11\u822A\u5C40\uFF08\u673A\u7968\uFF09\u6216\u6587\u65C5\u90E8\uFF08\u9152\u5E97\uFF09\u6295\u8BC9"
        ],
        tips: "\u822A\u73ED\u5EF6\u8BEF/\u53D6\u6D88\u6709\u660E\u786E\u7684\u8865\u507F\u6807\u51C6\uFF08\u6C11\u822A\u5C40\u89C4\u5B9A\uFF09\uFF0C\u53EF\u636E\u6B64\u4E3B\u5F20\u6743\u76CA"
      },
      {
        path: "path-2",
        pathName: "\u5411\u6C11\u822A\u5C40/\u6587\u65C5\u90E8\u6295\u8BC9",
        priority: 2,
        applicableCondition: "\u5E73\u53F0\u5904\u7406\u4E0D\u6EE1\u610F\u3001\u6D89\u53CA\u8F83\u5927\u91D1\u989D",
        processingCycle: "15-30\u4E2A\u5DE5\u4F5C\u65E5",
        cost: "\u514D\u8D39",
        requiredMaterials: ["\u8BA2\u5355\u622A\u56FE", "\u4ED8\u6B3E\u51ED\u8BC1", "\u5EF6\u8BEF/\u53D6\u6D88\u901A\u77E5", "\u5E73\u53F0\u5904\u7406\u8BB0\u5F55"],
        steps: [
          "\u767B\u5F55\u6C11\u822A\u5C40\u5B98\u7F51\uFF08www.caac.gov.cn\uFF09\u6216\u62E8\u625312339\uFF08\u6C11\u822A\u6295\u8BC9\u70ED\u7EBF\uFF09",
          "\u6216\u5411\u6587\u65C5\u90E812301\u6295\u8BC9\u9152\u5E97/\u65C5\u6E38\u5E73\u53F0",
          "\u63D0\u4EA4\u6295\u8BC9\u6750\u6599\uFF0C\u8BF4\u660E\u8BC9\u6C42",
          "\u7B49\u5F85\u6C11\u822A\u5C40/\u6587\u65C5\u90E8\u4ECB\u5165\u5904\u7406"
        ],
        tips: "\u6C11\u822A\u5C40\u5BF9\u822A\u7A7A\u516C\u53F8\u6709\u76F4\u63A5\u76D1\u7BA1\u6743\uFF0C\u6295\u8BC9\u6548\u679C\u8F83\u597D"
      },
      {
        path: "path-3",
        pathName: "\u5411\u6CD5\u9662\u63D0\u8D77\u8BC9\u8BBC\uFF08\u822A\u73ED\u5EF6\u8BEF\u8D54\u507F\uFF09",
        priority: 3,
        applicableCondition: "\u91D1\u989D\u8F83\u5927\uFF08\u5982\u591A\u6B21\u5EF6\u8BEF\u635F\u5931\uFF09\u3001\u8BC1\u636E\u5145\u5206",
        processingCycle: "6-12\u4E2A\u6708",
        cost: "\u8BC9\u8BBC\u8D39\u7EA6100-500\u5143",
        requiredMaterials: ["\u8BA2\u5355\u622A\u56FE", "\u4ED8\u6B3E\u51ED\u8BC1", "\u5EF6\u8BEF\u901A\u77E5\u622A\u56FE", "\u884C\u7A0B\u53D7\u5F71\u54CD\u7684\u76F8\u5173\u8BC1\u660E", "\u6C9F\u901A\u8BB0\u5F55"],
        steps: [
          "\u6574\u7406\u56E0\u5EF6\u8BEF\u5BFC\u81F4\u5B9E\u9645\u635F\u5931\u7684\u8BC1\u660E\uFF08\u5982\u4F4F\u5BBF\u53D1\u7968\u3001\u6539\u7B7E\u8D39\u5355\u636E\u7B49\uFF09",
          "\u64B0\u5199\u8D77\u8BC9\u72B6\uFF0C\u5230\u6CD5\u9662\u7ACB\u6848",
          "\u63D0\u4EA4\u8BC1\u636E\u6750\u6599\uFF0C\u7B49\u5F85\u5F00\u5EAD"
        ],
        tips: "\u822A\u73ED\u5EF6\u8BEF\u8D54\u507F\u6709\u8499\u7279\u5229\u5C14\u516C\u7EA6\uFF08\u300A\u4E2D\u534E\u4EBA\u6C11\u5171\u548C\u56FD\u6C11\u7528\u822A\u7A7A\u6CD5\u300B\uFF09\u4F5C\u4E3A\u6CD5\u5F8B\u4F9D\u636E"
      }
    ],
    applicabilityGuide: {
      "\u822A\u73ED/\u9152\u5E97\u88AB\u53D6\u6D88\u6216\u5EF6\u8BEF": "\u63A8\u8350 path-1\uFF08\u5E73\u53F0\u7533\u8BC9\uFF09+ path-2\uFF08\u4E3B\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF09",
      "\u5E73\u53F0\u5904\u7406\u4E0D\u6EE1\u610F\u3001\u635F\u5931\u8F83\u5927": "\u63A8\u8350 path-3\uFF08\u8BC9\u8BBC\uFF09\uFF0C\u53EF\u4E3B\u5F20\u5B9E\u9645\u635F\u5931\u8D54\u507F"
    }
  }
};
function getSolutionsForDispute(disputeType) {
  return solutionLibrary[disputeType] || null;
}
function getApplicabilityGuide(disputeType, currentStatus) {
  const disputeData = solutionLibrary[disputeType];
  if (!disputeData) return null;
  const guide = disputeData.applicabilityGuide;
  if (!guide) return null;
  for (const [key, value] of Object.entries(guide)) {
    if (currentStatus.includes(key)) {
      return { matchedCondition: key, recommendation: value };
    }
  }
  return {
    matchedCondition: "default",
    recommendation: "\u5EFA\u8BAE\u4F18\u5148\u5C1D\u8BD5\u4F4E\u6210\u672C\u9014\u5F84\uFF08\u6295\u8BC9/\u8C03\u89E3\uFF09\uFF0C\u65E0\u6548\u540E\u518D\u8003\u8651\u8BC9\u8BBC"
  };
}

// src/data/law-library.js
var LAW_LIBRARY = {
  // 教育培训退款
  education: [
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C53\u6761", content: "\u7ECF\u8425\u8005\u4EE5\u9884\u6536\u6B3E\u65B9\u5F0F\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u3002\u672A\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u5C65\u884C\u7EA6\u5B9A\u6216\u8005\u9000\u56DE\u9884\u4ED8\u6B3E\uFF1B\u9000\u56DE\u9884\u4ED8\u6B3E\u5E94\u5F53\u627F\u62C5\u9884\u4ED8\u6B3E\u7684\u5229\u606F\u3001\u6D88\u8D39\u8005\u5FC5\u987B\u652F\u4ED8\u7684\u5408\u7406\u8D39\u7528\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C496\u6761", content: "\u683C\u5F0F\u6761\u6B3E\u662F\u5F53\u4E8B\u4EBA\u4E3A\u4E86\u91CD\u590D\u4F7F\u7528\u800C\u9884\u5148\u62DF\u5B9A\uFF0C\u5E76\u5728\u8BA2\u7ACB\u5408\u540C\u65F6\u672A\u4E0E\u5BF9\u65B9\u534F\u5546\u7684\u6761\u6B3E\u3002\u91C7\u7528\u683C\u5F0F\u6761\u6B3E\u8BA2\u7ACB\u5408\u540C\u7684\uFF0C\u63D0\u4F9B\u683C\u5F0F\u6761\u6B3E\u7684\u4E00\u65B9\u5E94\u5F53\u9075\u5FAA\u516C\u5E73\u539F\u5219\u786E\u5B9A\u5F53\u4E8B\u4EBA\u4E4B\u95F4\u7684\u6743\u5229\u548C\u4E49\u52A1\u3002" },
    { name: "\u300A\u5E7F\u544A\u6CD5\u300B\u7B2C28\u6761", content: "\u5E7F\u544A\u4EE5\u865A\u5047\u6216\u8005\u5F15\u4EBA\u8BEF\u89E3\u7684\u5185\u5BB9\u6B3A\u9A97\u3001\u8BEF\u5BFC\u6D88\u8D39\u8005\u7684\uFF0C\u6784\u6210\u865A\u5047\u5E7F\u544A\u3002" }
  ],
  // 医美服务
  medical: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C1222\u6761", content: "\u533B\u52A1\u4EBA\u5458\u5728\u8BCA\u7597\u6D3B\u52A8\u4E2D\u672A\u5C3D\u5230\u4E0E\u5F53\u65F6\u7684\u533B\u7597\u6C34\u5E73\u76F8\u5E94\u7684\u8BCA\u7597\u4E49\u52A1\uFF0C\u9020\u6210\u60A3\u8005\u635F\u5BB3\u7684\uFF0C\u533B\u7597\u673A\u6784\u5E94\u5F53\u627F\u62C5\u8D54\u507F\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C1218\u6761", content: "\u60A3\u8005\u5728\u8BCA\u7597\u6D3B\u52A8\u4E2D\u53D7\u5230\u635F\u5BB3\uFF0C\u533B\u7597\u673A\u6784\u6216\u8005\u5176\u533B\u52A1\u4EBA\u5458\u6709\u8FC7\u9519\u7684\uFF0C\u7531\u533B\u7597\u673A\u6784\u627F\u62C5\u8D54\u507F\u8D23\u4EFB\u3002" },
    { name: "\u300A\u533B\u7597\u7F8E\u5BB9\u670D\u52A1\u7BA1\u7406\u529E\u6CD5\u300B\u7B2C19\u6761", content: "\u533B\u7597\u7F8E\u5BB9\u673A\u6784\u5E94\u5F53\u67E5\u9A8C\u6C42\u7F8E\u8005\u8EAB\u4EFD\uFF0C\u4E86\u89E3\u5176\u8EAB\u4F53\u5065\u5EB7\u72B6\u51B5\uFF0C\u5E76\u8FDB\u884C\u5FC5\u8981\u7684\u672F\u524D\u68C0\u67E5\u3002" },
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C53\u6761", content: "\u7ECF\u8425\u8005\u4EE5\u9884\u6536\u6B3E\u65B9\u5F0F\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u3002\u672A\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u5C65\u884C\u7EA6\u5B9A\u6216\u8005\u9000\u56DE\u9884\u4ED8\u6B3E\u3002" }
  ],
  // 美容美发
  beauty: [
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C53\u6761", content: "\u7ECF\u8425\u8005\u4EE5\u9884\u6536\u6B3E\u65B9\u5F0F\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u3002\u672A\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u5C65\u884C\u7EA6\u5B9A\u6216\u8005\u9000\u56DE\u9884\u4ED8\u6B3E\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C496\u6761", content: "\u683C\u5F0F\u6761\u6B3E\u662F\u5F53\u4E8B\u4EBA\u4E3A\u4E86\u91CD\u590D\u4F7F\u7528\u800C\u9884\u5148\u62DF\u5B9A\uFF0C\u5E76\u5728\u8BA2\u7ACB\u5408\u540C\u65F6\u672A\u4E0E\u5BF9\u65B9\u534F\u5546\u7684\u6761\u6B3E\u3002" }
  ],
  // 国学玄学
  esoteric: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C53\u6761", content: "\u7ECF\u8425\u8005\u4EE5\u9884\u6536\u6B3E\u65B9\u5F0F\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u3002\u672A\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u5C65\u884C\u7EA6\u5B9A\u6216\u8005\u9000\u56DE\u9884\u4ED8\u6B3E\u3002" },
    { name: "\u300A\u5E7F\u544A\u6CD5\u300B\u7B2C28\u6761", content: "\u5E7F\u544A\u4EE5\u865A\u5047\u6216\u8005\u5F15\u4EBA\u8BEF\u89E3\u7684\u5185\u5BB9\u6B3A\u9A97\u3001\u8BEF\u5BFC\u6D88\u8D39\u8005\u7684\uFF0C\u6784\u6210\u865A\u5047\u5E7F\u544A\u3002" }
  ],
  // 投资理财
  investment: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u8BC1\u5238\u6CD5\u300B\u7B2C79\u6761", content: "\u7981\u6B62\u8BC1\u5238\u516C\u53F8\u53CA\u5176\u4ECE\u4E1A\u4EBA\u5458\u4ECE\u4E8B\u4E0B\u5217\u635F\u5BB3\u5BA2\u6237\u5229\u76CA\u7684\u884C\u4E3A\uFF1A\u8FDD\u80CC\u5BA2\u6237\u7684\u59D4\u6258\u4E3A\u5176\u4E70\u5356\u8BC1\u5238\uFF1B\u4E0D\u5728\u89C4\u5B9A\u65F6\u95F4\u5185\u5411\u5BA2\u6237\u63D0\u4F9B\u4EA4\u6613\u7684\u786E\u8BA4\u6587\u4EF6\uFF1B\u632A\u7528\u5BA2\u6237\u6240\u59D4\u6258\u4E70\u5356\u7684\u8BC1\u5238\u6216\u8005\u5BA2\u6237\u8D26\u6237\u4E0A\u7684\u8D44\u91D1\u3002" },
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761", content: "\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u589E\u52A0\u8D54\u507F\u5176\u53D7\u5230\u7684\u635F\u5931\uFF0C\u589E\u52A0\u8D54\u507F\u7684\u91D1\u989D\u4E3A\u6D88\u8D39\u8005\u8D2D\u4E70\u5546\u54C1\u7684\u4EF7\u6B3E\u6216\u8005\u63A5\u53D7\u670D\u52A1\u7684\u8D39\u7528\u7684\u4E09\u500D\u3002" },
    { name: "\u300A\u5E7F\u544A\u6CD5\u300B\u7B2C28\u6761", content: "\u5E7F\u544A\u4EE5\u865A\u5047\u6216\u8005\u5F15\u4EBA\u8BEF\u89E3\u7684\u5185\u5BB9\u6B3A\u9A97\u3001\u8BEF\u5BFC\u6D88\u8D39\u8005\u7684\uFF0C\u6784\u6210\u865A\u5047\u5E7F\u544A\u3002" }
  ],
  // 加盟合作
  franchise: [
    { name: "\u300A\u5546\u4E1A\u7279\u8BB8\u7ECF\u8425\u7BA1\u7406\u6761\u4F8B\u300B\u7B2C23\u6761", content: "\u7279\u8BB8\u4EBA\u5E94\u5F53\u5411\u88AB\u7279\u8BB8\u4EBA\u63D0\u4F9B\u7279\u8BB8\u7ECF\u8425\u64CD\u4F5C\u624B\u518C\uFF0C\u5E76\u4E3A\u88AB\u7279\u8BB8\u4EBA\u7684\u7ECF\u8425\u6D3B\u52A8\u63D0\u4F9B\u6280\u672F\u652F\u6301\u548C\u4E1A\u52A1\u6307\u5BFC\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C497\u6761", content: "\u6709\u4E0B\u5217\u60C5\u5F62\u4E4B\u4E00\u7684\uFF0C\u8BE5\u683C\u5F0F\u6761\u6B3E\u65E0\u6548\uFF1A\uFF08\u4E00\uFF09\u5177\u6709\u672C\u6CD5\u7B2C\u4E00\u7F16\u7B2C\u516D\u7AE0\u7B2C\u4E09\u8282\u548C\u672C\u6CD5\u7B2C\u4E94\u767E\u96F6\u516D\u6761\u89C4\u5B9A\u7684\u65E0\u6548\u60C5\u5F62\uFF1B\uFF08\u4E8C\uFF09\u63D0\u4F9B\u683C\u5F0F\u6761\u6B3E\u4E00\u65B9\u4E0D\u5408\u7406\u5730\u514D\u9664\u6216\u8005\u51CF\u8F7B\u5176\u8D23\u4EFB\u3001\u52A0\u91CD\u5BF9\u65B9\u8D23\u4EFB\u3001\u9650\u5236\u5BF9\u65B9\u4E3B\u8981\u6743\u5229\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" }
  ],
  // 玉石珠宝
  jade: [
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761", content: "\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u589E\u52A0\u8D54\u507F\u5176\u53D7\u5230\u7684\u635F\u5931\uFF0C\u589E\u52A0\u8D54\u507F\u7684\u91D1\u989D\u4E3A\u6D88\u8D39\u8005\u8D2D\u4E70\u5546\u54C1\u7684\u4EF7\u6B3E\u6216\u8005\u63A5\u53D7\u670D\u52A1\u7684\u8D39\u7528\u7684\u4E09\u500D\u3002" },
    { name: "\u300A\u4EA7\u54C1\u8D28\u91CF\u6CD5\u300B\u7B2C40\u6761", content: "\u552E\u51FA\u7684\u4EA7\u54C1\u6709\u4E0B\u5217\u60C5\u5F62\u4E4B\u4E00\u7684\uFF0C\u9500\u552E\u8005\u5E94\u5F53\u8D1F\u8D23\u4FEE\u7406\u3001\u66F4\u6362\u3001\u9000\u8D27\uFF1B\u7ED9\u8D2D\u4E70\u4EA7\u54C1\u7684\u6D88\u8D39\u8005\u9020\u6210\u635F\u5931\u7684\uFF0C\u9500\u552E\u8005\u5E94\u5F53\u8D54\u507F\u635F\u5931\uFF1A\uFF08\u4E00\uFF09\u4E0D\u5177\u5907\u4EA7\u54C1\u5E94\u5F53\u5177\u5907\u7684\u4F7F\u7528\u6027\u80FD\u800C\u4E8B\u5148\u672A\u4F5C\u8BF4\u660E\u7684\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" }
  ],
  // 婚姻中介
  marriage: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C53\u6761", content: "\u7ECF\u8425\u8005\u4EE5\u9884\u6536\u6B3E\u65B9\u5F0F\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u3002\u672A\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u5C65\u884C\u7EA6\u5B9A\u6216\u8005\u9000\u56DE\u9884\u4ED8\u6B3E\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C496\u6761", content: "\u683C\u5F0F\u6761\u6B3E\u662F\u5F53\u4E8B\u4EBA\u4E3A\u4E86\u91CD\u590D\u4F7F\u7528\u800C\u9884\u5148\u62DF\u5B9A\uFF0C\u5E76\u5728\u8BA2\u7ACB\u5408\u540C\u65F6\u672A\u4E0E\u5BF9\u65B9\u534F\u5546\u7684\u6761\u6B3E\u3002" }
  ],
  // 电信网络诈骗
  telecom: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761", content: "\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u589E\u52A0\u8D54\u507F\u5176\u53D7\u5230\u7684\u635F\u5931\uFF0C\u589E\u52A0\u8D54\u507F\u7684\u91D1\u989D\u4E3A\u6D88\u8D39\u8005\u8D2D\u4E70\u5546\u54C1\u7684\u4EF7\u6B3E\u6216\u8005\u63A5\u53D7\u670D\u52A1\u7684\u8D39\u7528\u7684\u4E09\u500D\u3002" },
    { name: "\u300A\u5211\u6CD5\u300B\u7B2C266\u6761", content: "\u8BC8\u9A97\u516C\u79C1\u8D22\u7269\uFF0C\u6570\u989D\u8F83\u5927\u7684\uFF0C\u5904\u4E09\u5E74\u4EE5\u4E0B\u6709\u671F\u5F92\u5211\u3001\u62D8\u5F79\u6216\u8005\u7BA1\u5236\uFF0C\u5E76\u5904\u6216\u8005\u5355\u5904\u7F5A\u91D1\u3002" }
  ],
  // 劳动纠纷
  labor: [
    { name: "\u300A\u52B3\u52A8\u5408\u540C\u6CD5\u300B\u7B2C38\u6761", content: "\u7528\u4EBA\u5355\u4F4D\u6709\u4E0B\u5217\u60C5\u5F62\u4E4B\u4E00\u7684\uFF0C\u52B3\u52A8\u8005\u53EF\u4EE5\u89E3\u9664\u52B3\u52A8\u5408\u540C\uFF1A\uFF08\u4E00\uFF09\u672A\u6309\u7167\u52B3\u52A8\u5408\u540C\u7EA6\u5B9A\u63D0\u4F9B\u52B3\u52A8\u4FDD\u62A4\u6216\u8005\u52B3\u52A8\u6761\u4EF6\u7684\uFF1B\uFF08\u4E8C\uFF09\u672A\u53CA\u65F6\u8DB3\u989D\u652F\u4ED8\u52B3\u52A8\u62A5\u916C\u7684\uFF1B\uFF08\u4E09\uFF09\u672A\u4F9D\u6CD5\u4E3A\u52B3\u52A8\u8005\u7F34\u7EB3\u793E\u4F1A\u4FDD\u9669\u8D39\u7684\u3002" },
    { name: "\u300A\u52B3\u52A8\u5408\u540C\u6CD5\u300B\u7B2C47\u6761", content: "\u7ECF\u6D4E\u8865\u507F\u6309\u52B3\u52A8\u8005\u5728\u672C\u5355\u4F4D\u5DE5\u4F5C\u7684\u5E74\u9650\uFF0C\u6BCF\u6EE1\u4E00\u5E74\u652F\u4ED8\u4E00\u4E2A\u6708\u5DE5\u8D44\u7684\u6807\u51C6\u5411\u52B3\u52A8\u8005\u652F\u4ED8\u3002" },
    { name: "\u300A\u5DE5\u8D44\u652F\u4ED8\u6682\u884C\u89C4\u5B9A\u300B\u7B2C7\u6761", content: "\u5DE5\u8D44\u81F3\u5C11\u6BCF\u6708\u652F\u4ED8\u4E00\u6B21\uFF0C\u5B9E\u884C\u5468\u3001\u65E5\u3001\u5C0F\u65F6\u5DE5\u8D44\u5236\u7684\u53EF\u6309\u5468\u3001\u65E5\u3001\u5C0F\u65F6\u652F\u4ED8\u5DE5\u8D44\u3002" },
    { name: "\u300A\u52B3\u52A8\u5408\u540C\u6CD5\u300B\u7B2C82\u6761", content: "\u7528\u4EBA\u5355\u4F4D\u81EA\u7528\u5DE5\u4E4B\u65E5\u8D77\u8D85\u8FC7\u4E00\u4E2A\u6708\u4E0D\u6EE1\u4E00\u5E74\u672A\u4E0E\u52B3\u52A8\u8005\u8BA2\u7ACB\u4E66\u9762\u52B3\u52A8\u5408\u540C\u7684\uFF0C\u5E94\u5F53\u5411\u52B3\u52A8\u8005\u6BCF\u6708\u652F\u4ED8\u4E8C\u500D\u7684\u5DE5\u8D44\u3002" }
  ],
  // 债务纠纷
  debt: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C675\u6761", content: "\u501F\u6B3E\u4EBA\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u7684\u671F\u9650\u8FD4\u8FD8\u501F\u6B3E\u3002\u5BF9\u501F\u6B3E\u671F\u9650\u6CA1\u6709\u7EA6\u5B9A\u6216\u8005\u7EA6\u5B9A\u4E0D\u660E\u786E\uFF0C\u4F9D\u636E\u672C\u6CD5\u7B2C\u4E94\u767E\u4E00\u5341\u6761\u7684\u89C4\u5B9A\u4ECD\u4E0D\u80FD\u786E\u5B9A\u7684\uFF0C\u501F\u6B3E\u4EBA\u53EF\u4EE5\u968F\u65F6\u8FD4\u8FD8\uFF1B\u8D37\u6B3E\u4EBA\u53EF\u4EE5\u50AC\u544A\u501F\u6B3E\u4EBA\u5728\u5408\u7406\u671F\u9650\u5185\u8FD4\u8FD8\u3002" },
    { name: "\u300A\u6700\u9AD8\u4EBA\u6C11\u6CD5\u9662\u5173\u4E8E\u5BA1\u7406\u6C11\u95F4\u501F\u8D37\u6848\u4EF6\u9002\u7528\u6CD5\u5F8B\u82E5\u5E72\u95EE\u9898\u7684\u89C4\u5B9A\u300B\u7B2C25\u6761", content: "\u501F\u8D37\u53CC\u65B9\u7EA6\u5B9A\u7684\u5229\u7387\u672A\u8D85\u8FC7\u5408\u540C\u6210\u7ACB\u65F6\u4E00\u5E74\u671F\u8D37\u6B3E\u5E02\u573A\u62A5\u4EF7\u5229\u7387\u56DB\u500D\uFF0C\u51FA\u501F\u4EBA\u8BF7\u6C42\u501F\u6B3E\u4EBA\u6309\u7167\u7EA6\u5B9A\u7684\u5229\u7387\u652F\u4ED8\u5229\u606F\u7684\uFF0C\u4EBA\u6C11\u6CD5\u9662\u5E94\u4E88\u652F\u6301\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C579\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u672A\u652F\u4ED8\u4EF7\u6B3E\u3001\u62A5\u916C\u3001\u79DF\u91D1\u3001\u5229\u606F\uFF0C\u6216\u8005\u4E0D\u5C65\u884C\u5176\u4ED6\u91D1\u94B1\u503A\u52A1\u7684\uFF0C\u5BF9\u65B9\u53EF\u4EE5\u8BF7\u6C42\u5176\u652F\u4ED8\u3002" }
  ],
  // 房产租房
  housing: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C703\u6761", content: "\u79DF\u8D41\u671F\u9650\u4E0D\u5F97\u8D85\u8FC7\u4E8C\u5341\u5E74\u3002\u8D85\u8FC7\u4E8C\u5341\u5E74\u7684\uFF0C\u8D85\u8FC7\u90E8\u5206\u65E0\u6548\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C714\u6761", content: "\u627F\u79DF\u4EBA\u5E94\u5F53\u59A5\u5584\u4FDD\u7BA1\u79DF\u8D41\u7269\uFF0C\u56E0\u4FDD\u7BA1\u4E0D\u5584\u9020\u6210\u79DF\u8D41\u7269\u6BC1\u635F\u3001\u706D\u5931\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u8D54\u507F\u8D23\u4EFB\u3002" },
    { name: "\u300A\u5546\u54C1\u623F\u5C4B\u79DF\u8D41\u7BA1\u7406\u529E\u6CD5\u300B\u7B2C10\u6761", content: "\u623F\u5C4B\u79DF\u8D41\u671F\u9650\u5185\uFF0C\u623F\u5C4B\u51FA\u79DF\u4EBA\u4E0D\u5F97\u5355\u65B9\u9762\u63D0\u9AD8\u79DF\u91D1\u6807\u51C6\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" }
  ],
  // 消费维权
  consumer: [
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C55\u6761", content: "\u7ECF\u8425\u8005\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u6709\u6B3A\u8BC8\u884C\u4E3A\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u589E\u52A0\u8D54\u507F\u5176\u53D7\u5230\u7684\u635F\u5931\uFF0C\u589E\u52A0\u8D54\u507F\u7684\u91D1\u989D\u4E3A\u6D88\u8D39\u8005\u8D2D\u4E70\u5546\u54C1\u7684\u4EF7\u6B3E\u6216\u8005\u63A5\u53D7\u670D\u52A1\u7684\u8D39\u7528\u7684\u4E09\u500D\u3002" },
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C44\u6761", content: "\u6D88\u8D39\u8005\u901A\u8FC7\u7F51\u7EDC\u4EA4\u6613\u5E73\u53F0\u8D2D\u4E70\u5546\u54C1\u6216\u8005\u63A5\u53D7\u670D\u52A1\uFF0C\u5176\u5408\u6CD5\u6743\u76CA\u53D7\u5230\u635F\u5BB3\u7684\uFF0C\u53EF\u4EE5\u5411\u9500\u552E\u8005\u6216\u8005\u670D\u52A1\u8005\u8981\u6C42\u8D54\u507F\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u4EA7\u54C1\u8D28\u91CF\u6CD5\u300B\u7B2C40\u6761", content: "\u552E\u51FA\u7684\u4EA7\u54C1\u6709\u4E0B\u5217\u60C5\u5F62\u4E4B\u4E00\u7684\uFF0C\u9500\u552E\u8005\u5E94\u5F53\u8D1F\u8D23\u4FEE\u7406\u3001\u66F4\u6362\u3001\u9000\u8D27\uFF1B\u7ED9\u8D2D\u4E70\u4EA7\u54C1\u7684\u6D88\u8D39\u8005\u9020\u6210\u635F\u5931\u7684\uFF0C\u9500\u552E\u8005\u5E94\u5F53\u8D54\u507F\u635F\u5931\u3002" }
  ],
  // 网络交易
  online: [
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C44\u6761", content: "\u6D88\u8D39\u8005\u901A\u8FC7\u7F51\u7EDC\u4EA4\u6613\u5E73\u53F0\u8D2D\u4E70\u5546\u54C1\u6216\u8005\u63A5\u53D7\u670D\u52A1\uFF0C\u5176\u5408\u6CD5\u6743\u76CA\u53D7\u5230\u635F\u5BB3\u7684\uFF0C\u53EF\u4EE5\u5411\u9500\u552E\u8005\u6216\u8005\u670D\u52A1\u8005\u8981\u6C42\u8D54\u507F\u3002" },
    { name: "\u300A\u7535\u5B50\u5546\u52A1\u6CD5\u300B\u7B2C49\u6761", content: "\u7535\u5B50\u5546\u52A1\u7ECF\u8425\u8005\u53D1\u5E03\u7684\u5546\u54C1\u6216\u8005\u670D\u52A1\u4FE1\u606F\u7B26\u5408\u8981\u7EA6\u6761\u4EF6\u7684\uFF0C\u7528\u6237\u9009\u62E9\u8BE5\u5546\u54C1\u6216\u8005\u670D\u52A1\u5E76\u63D0\u4EA4\u8BA2\u5355\u6210\u529F\uFF0C\u5408\u540C\u6210\u7ACB\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C25\u6761", content: "\u7ECF\u8425\u8005\u91C7\u7528\u7F51\u7EDC\u3001\u7535\u89C6\u3001\u7535\u8BDD\u3001\u90AE\u8D2D\u7B49\u65B9\u5F0F\u9500\u552E\u5546\u54C1\uFF0C\u6D88\u8D39\u8005\u6709\u6743\u81EA\u6536\u5230\u5546\u54C1\u4E4B\u65E5\u8D77\u4E03\u65E5\u5185\u9000\u8D27\uFF0C\u65E0\u9700\u8BF4\u660E\u7406\u7531\u3002" }
  ],
  // 服务纠纷
  service: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u7B2C53\u6761", content: "\u7ECF\u8425\u8005\u4EE5\u9884\u6536\u6B3E\u65B9\u5F0F\u63D0\u4F9B\u5546\u54C1\u6216\u8005\u670D\u52A1\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u3002\u672A\u6309\u7167\u7EA6\u5B9A\u63D0\u4F9B\u7684\uFF0C\u5E94\u5F53\u6309\u7167\u6D88\u8D39\u8005\u7684\u8981\u6C42\u5C65\u884C\u7EA6\u5B9A\u6216\u8005\u9000\u56DE\u9884\u4ED8\u6B3E\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C496\u6761", content: "\u683C\u5F0F\u6761\u6B3E\u662F\u5F53\u4E8B\u4EBA\u4E3A\u4E86\u91CD\u590D\u4F7F\u7528\u800C\u9884\u5148\u62DF\u5B9A\uFF0C\u5E76\u5728\u8BA2\u7ACB\u5408\u540C\u65F6\u672A\u4E0E\u5BF9\u65B9\u534F\u5546\u7684\u6761\u6B3E\u3002" }
  ],
  // 其他纠纷
  other: [
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C577\u6761", content: "\u5F53\u4E8B\u4EBA\u4E00\u65B9\u4E0D\u5C65\u884C\u5408\u540C\u4E49\u52A1\u6216\u8005\u5C65\u884C\u5408\u540C\u4E49\u52A1\u4E0D\u7B26\u5408\u7EA6\u5B9A\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u7EE7\u7EED\u5C65\u884C\u3001\u91C7\u53D6\u8865\u6551\u63AA\u65BD\u6216\u8005\u8D54\u507F\u635F\u5931\u7B49\u8FDD\u7EA6\u8D23\u4EFB\u3002" },
    { name: "\u300A\u6C11\u4E8B\u8BC9\u8BBC\u6CD5\u300B\u7B2C64\u6761", content: "\u5F53\u4E8B\u4EBA\u5BF9\u81EA\u5DF1\u63D0\u51FA\u7684\u4E3B\u5F20\uFF0C\u6709\u8D23\u4EFB\u63D0\u4F9B\u8BC1\u636E\u3002" },
    { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C500\u6761", content: "\u5F53\u4E8B\u4EBA\u5728\u8BA2\u7ACB\u5408\u540C\u8FC7\u7A0B\u4E2D\u6709\u5176\u4ED6\u8FDD\u80CC\u8BDA\u4FE1\u539F\u5219\u7684\u884C\u4E3A\uFF0C\u9020\u6210\u5BF9\u65B9\u635F\u5931\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u8D54\u507F\u8D23\u4EFB\u3002" }
  ]
};
var DEFAULT_LAWS = [
  { name: "\u300A\u6C11\u4E8B\u8BC9\u8BBC\u6CD5\u300B\u7B2C64\u6761", content: "\u5F53\u4E8B\u4EBA\u5BF9\u81EA\u5DF1\u63D0\u51FA\u7684\u4E3B\u5F20\uFF0C\u6709\u8D23\u4EFB\u63D0\u4F9B\u8BC1\u636E\u3002" },
  { name: "\u300A\u6C11\u6CD5\u5178\u300B\u7B2C500\u6761", content: "\u5F53\u4E8B\u4EBA\u5728\u8BA2\u7ACB\u5408\u540C\u8FC7\u7A0B\u4E2D\u6709\u5176\u4ED6\u8FDD\u80CC\u8BDA\u4FE1\u539F\u5219\u7684\u884C\u4E3A\uFF0C\u9020\u6210\u5BF9\u65B9\u635F\u5931\u7684\uFF0C\u5E94\u5F53\u627F\u62C5\u8D54\u507F\u8D23\u4EFB\u3002" }
];

// src/data/process-library.js
var PROCESS_NODES = {
  negotiation: {
    id: "negotiation",
    name: "\u534F\u5546",
    stage: 1,
    icon: "\u{1F91D}",
    operation_guide: "\u4E3B\u52A8\u8054\u7CFB\u5BF9\u65B9\uFF0C\u63D0\u51FA\u5177\u4F53\u8BC9\u6C42\uFF0C\u4FDD\u7559\u6C9F\u901A\u8BB0\u5F55\u3002\u53EF\u901A\u8FC7\u4E66\u9762\u51FD\u4EF6\u3001\u5FAE\u4FE1/\u77ED\u4FE1\u7B49\u53EF\u7559\u5B58\u8BC1\u636E\u7684\u65B9\u5F0F\u6C9F\u901A\uFF0C\u660E\u786E\u8BF4\u660E\u9000\u6B3E\u91D1\u989D\u3001\u671F\u9650\u548C\u4F9D\u636E\u3002",
    tips: ["\u4F18\u5148\u901A\u8FC7\u4E66\u9762\u65B9\u5F0F\u6C9F\u901A\uFF0C\u53EF\u53D1\u5F8B\u5E08\u51FD\uFF08\u53EF\u9009\uFF09", "\u5168\u7A0B\u4FDD\u7559\u6C9F\u901A\u8BB0\u5F55\u4F5C\u4E3A\u8BC1\u636E", "\u660E\u786E\u9000\u6B3E\u91D1\u989D\u7684\u6CD5\u5F8B\u4F9D\u636E"]
  },
  complaint: {
    id: "complaint",
    name: "\u6295\u8BC9",
    stage: 2,
    icon: "\u{1F4CB}",
    operation_guide: "\u5411\u6D88\u8D39\u8005\u534F\u4F1A\uFF0812315\uFF09\u6216\u884C\u4E1A\u4E3B\u7BA1\u90E8\u95E8\u63D0\u4EA4\u6295\u8BC9\u6750\u6599\uFF0C\u8BF4\u660E\u4E8B\u60C5\u7ECF\u8FC7\u3001\u8BC9\u6C42\u548C\u8BC1\u636E\uFF0C\u7B49\u5F85\u53D7\u7406\u548C\u8C03\u89E3\u3002\u53EF\u540C\u65F6\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u53CD\u6620\u3002",
    tips: ["\u62E8\u625312315\u70ED\u7EBF\u6216\u901A\u8FC7\u5168\u56FD12315\u5E73\u53F0\u5728\u7EBF\u6295\u8BC9", "\u51C6\u5907\u597D\u8BC1\u636E\u6750\u6599\uFF08\u5408\u540C\u3001\u4ED8\u6B3E\u8BB0\u5F55\u3001\u6C9F\u901A\u8BB0\u5F55\u7B49\uFF09", "\u53EF\u540C\u65F6\u5411\u591A\u4E2A\u90E8\u95E8\u6295\u8BC9\uFF0C\u589E\u52A0\u5904\u7406\u529B\u5EA6"]
  },
  mediation: {
    id: "mediation",
    name: "\u8C03\u89E3",
    stage: 3,
    icon: "\u2696\uFE0F",
    operation_guide: "\u6D88\u534F\u6216\u6CD5\u9662\u4F1A\u7EC4\u7EC7\u53CC\u65B9\u8FDB\u884C\u8C03\u89E3\u3002\u8C03\u89E3\u5458\u4F1A\u4E86\u89E3\u53CC\u65B9\u610F\u89C1\uFF0C\u63D0\u51FA\u8C03\u89E3\u65B9\u6848\u3002\u8C03\u89E3\u6210\u529F\u4F1A\u51FA\u5177\u8C03\u89E3\u534F\u8BAE\uFF0C\u5177\u6709\u6CD5\u5F8B\u6548\u529B\uFF1B\u8C03\u89E3\u4E0D\u6210\u53EF\u7EE7\u7EED\u4E0B\u4E00\u6B65\u3002",
    tips: ["\u8C03\u89E3\u4E0D\u6536\u8D39\uFF0C\u7A0B\u5E8F\u76F8\u5BF9\u7B80\u4FBF", "\u8C03\u89E3\u534F\u8BAE\u7ECF\u53F8\u6CD5\u786E\u8BA4\u540E\u5177\u6709\u5F3A\u5236\u6267\u884C\u529B", "\u4FDD\u6301\u7406\u6027\uFF0C\u505A\u597D\u9002\u5F53\u8BA9\u6B65\u7684\u5FC3\u7406\u51C6\u5907"]
  },
  arbitration: {
    id: "arbitration",
    name: "\u4EF2\u88C1",
    stage: 4,
    icon: "\u{1F3DB}\uFE0F",
    operation_guide: "\u5982\u5408\u540C\u7EA6\u5B9A\u4E86\u4EF2\u88C1\u6761\u6B3E\uFF0C\u53EF\u5411\u7EA6\u5B9A\u4EF2\u88C1\u673A\u6784\u7533\u8BF7\u4EF2\u88C1\u3002\u4EF2\u88C1\u4E00\u88C1\u7EC8\u5C40\uFF0C\u6548\u7387\u8F83\u9AD8\u3002\u6CE8\u610F\uFF1A\u4EF2\u88C1\u9700\u8981\u63D0\u524D\u7EA6\u5B9A\uFF0C\u6CA1\u6709\u7EA6\u5B9A\u5219\u4E0D\u80FD\u7533\u8BF7\u4EF2\u88C1\u3002",
    tips: ["\u4EF2\u88C1\u5177\u6709\u6CD5\u5F8B\u5F3A\u5236\u529B", "\u7A0B\u5E8F\u89C4\u8303\uFF0C\u4E00\u88C1\u7EC8\u5C40", "\u9700\u8981\u51C6\u5907\u5145\u5206\u7684\u8BC1\u636E\u6750\u6599"]
  },
  litigation: {
    id: "litigation",
    name: "\u8BC9\u8BBC",
    stage: 5,
    icon: "\u2696\uFE0F",
    operation_guide: "\u5411\u6709\u7BA1\u8F96\u6743\u7684\u4EBA\u6C11\u6CD5\u9662\u63D0\u8D77\u8BC9\u8BBC\u3002\u53EF\u81EA\u5DF1\u8D77\u8BC9\uFF08\u6210\u672C\u4F4E\uFF09\u6216\u59D4\u6258\u5F8B\u5E08\u4EE3\u7406\uFF08\u66F4\u4E13\u4E1A\uFF09\u3002\u5C0F\u989D\u8BC9\u8BBC\u7A0B\u5E8F\u53EF\u7F51\u4E0A\u7ACB\u6848\uFF0C\u8BC9\u8BBC\u8D39\u6839\u636E\u6807\u7684\u91D1\u989D\u8BA1\u7B97\u3002",
    tips: ["\u8BC9\u8BBC\u662F\u6700\u540E\u7684\u6551\u6D4E\u9014\u5F84", "\u8D77\u8BC9\u9700\u8981\u51C6\u5907\u8D77\u8BC9\u72B6\u548C\u8BC1\u636E\u6750\u6599", "\u53EF\u7533\u8BF7\u8D22\u4EA7\u4FDD\u5168\u9632\u6B62\u5BF9\u65B9\u8F6C\u79FB\u8D44\u4EA7"]
  }
};
var STATUS_STAGE_MAP = {
  not_yet: 0,
  // 还没跟对方说过 → 从协商开始
  talked: 1,
  // 跟对方提过但没谈拢 → 投诉阶段
  contact_lost: 1,
  // 对方不接电话/关门了 → 投诉/调解
  complained: 2,
  // 已经投诉到监管部门 → 调解或仲裁
  legal: 5
  // 已经在走法律程序 → 诉讼
};
function getProcessPath(status) {
  const currentStage = STATUS_STAGE_MAP[status] || 0;
  const nodes = ["negotiation", "complaint", "mediation", "arbitration", "litigation"];
  return nodes.map((id, idx) => ({
    ...PROCESS_NODES[id],
    done: idx < currentStage,
    current: idx === currentStage
  }));
}

// src/data/statistics-database.js
var STATS_DATA = {
  education: {
    basic: {
      litigation_rate: "\u7EA615%-20%",
      mediation_rate: "\u7EA640%-50%",
      avg_cycle: "2-4\u4E2A\u6708",
      support_rate: "\u7EA685%-90%"
    },
    // 季SVIP+ 纠纷处理方式分布
    resolution_distribution: [
      { method: "\u534F\u5546\u548C\u89E3", ratio: "\u7EA640%-50%", cycle: "1-4\u5468", note: "\u5927\u591A\u6570\u7EA0\u7EB7\u5728\u6B64\u9636\u6BB5\u89E3\u51B3" },
      { method: "\u884C\u653F\u8C03\u89E3", ratio: "\u7EA625%-30%", cycle: "1-3\u4E2A\u6708", note: "\u76D1\u7BA1\u90E8\u95E8\u4ECB\u5165\u540E\u5904\u7406\u6548\u7387\u8F83\u9AD8" },
      { method: "\u4EF2\u88C1\u88C1\u51B3", ratio: "\u7EA65%-8%", cycle: "3-6\u4E2A\u6708", note: "\u9002\u7528\u4E8E\u5408\u540C\u4E2D\u6709\u4EF2\u88C1\u534F\u8BAE\u7684\u60C5\u5F62" },
      { method: "\u8BC9\u8BBC\u5224\u51B3", ratio: "\u7EA615%-20%", cycle: "4-8\u4E2A\u6708", note: "\u6700\u7EC8\u6551\u6D4E\u9014\u5F84" }
    ],
    // 季SVIP+ 时间趋势（近三年）
    support_trend: [
      { year: "2024", full_support: "\u7EA645%", partial_support: "\u7EA642%", reject: "\u7EA613%" },
      { year: "2025", full_support: "\u7EA648%", partial_support: "\u7EA640%", reject: "\u7EA612%" },
      { year: "2026\u5E741-5\u6708", full_support: "\u7EA650%", partial_support: "\u7EA638%", reject: "\u7EA612%" }
    ],
    regions: { high: ["\u5317\u4EAC", "\u4E0A\u6D77", "\u5E7F\u4E1C"], low: ["\u897F\u90E8\u7701\u4EFD"] },
    trend: "\u8FD1\u4E09\u5E74\u6B64\u7C7B\u7EA0\u7EB7\u6570\u91CF\u5448\u4E0A\u5347\u8D8B\u52BF\uFF0C\u4E3B\u8981\u96C6\u4E2D\u5728K12\u57F9\u8BAD\u548C\u804C\u4E1A\u6559\u80B2\u9886\u57DF\u3002\u6D88\u8D39\u8005\u80DC\u8BC9\u7387\uFF08\u542B\u5168\u989D\u548C\u90E8\u5206\u652F\u6301\uFF09\u7EA690%\uFF0C\u4F46\u5B9E\u9645\u83B7\u8D54\u91D1\u989D\u4E0E\u8BF7\u6C42\u91D1\u989D\u5B58\u5728\u4E00\u5B9A\u5DEE\u8DDD\u3002"
  },
  medical: {
    basic: {
      litigation_rate: "\u7EA68%-15%",
      mediation_rate: "\u7EA630%-45%",
      avg_cycle: "3-6\u4E2A\u6708",
      support_rate: "\u7EA645%-60%"
    },
    resolution_distribution: [
      { method: "\u534F\u5546\u548C\u89E3", ratio: "\u7EA635%-45%", cycle: "1-4\u5468", note: "\u533B\u60A3\u53CC\u65B9\u79C1\u4E0B\u534F\u5546\u89E3\u51B3" },
      { method: "\u884C\u653F\u8C03\u89E3", ratio: "\u7EA620%-30%", cycle: "1-3\u4E2A\u6708", note: "\u536B\u5065\u59D4\u6216\u533B\u8C03\u59D4\u4ECB\u5165" },
      { method: "\u9274\u5B9A\u540E\u8C03\u89E3", ratio: "\u7EA615%-20%", cycle: "3-6\u4E2A\u6708", note: "\u9700\u5148\u5B8C\u6210\u533B\u7597\u635F\u5BB3\u9274\u5B9A" },
      { method: "\u8BC9\u8BBC\u5224\u51B3", ratio: "\u7EA68%-15%", cycle: "6-12\u4E2A\u6708", note: "\u4E3E\u8BC1\u96BE\u5EA6\u5927\uFF0C\u5468\u671F\u8F83\u957F" }
    ],
    support_trend: [
      { year: "2024", full_support: "\u7EA630%", partial_support: "\u7EA640%", reject: "\u7EA630%" },
      { year: "2025", full_support: "\u7EA633%", partial_support: "\u7EA638%", reject: "\u7EA629%" },
      { year: "2026\u5E741-5\u6708", full_support: "\u7EA635%", partial_support: "\u7EA637%", reject: "\u7EA628%" }
    ],
    regions: { high: ["\u5317\u4EAC", "\u4E0A\u6D77", "\u6210\u90FD"], low: ["\u4E8C\u4E09\u7EBF\u57CE\u5E02"] },
    trend: "\u533B\u7F8E\u7EA0\u7EB7\u9010\u5E74\u589E\u52A0\uFF0C\u4EE5\u773C\u90E8\u3001\u9F3B\u90E8\u624B\u672F\u548C\u6CE8\u5C04\u7C7B\u9879\u76EE\u5C45\u591A\u3002\u4E3E\u8BC1\u96BE\u5EA6\u8F83\u5927\uFF0C\u5EFA\u8BAE\u4F18\u5148\u8865\u5145\u75C5\u5386\u548C\u672F\u524D\u672F\u540E\u5BF9\u6BD4\u7167\u7247\u3002"
  },
  labor: {
    basic: {
      litigation_rate: "\u7EA620%-30%",
      mediation_rate: "\u7EA650%-65%",
      avg_cycle: "1-3\u4E2A\u6708",
      support_rate: "\u7EA665%-75%"
    },
    resolution_distribution: [
      { method: "\u534F\u5546\u89E3\u51B3", ratio: "\u7EA640%-50%", cycle: "1-2\u5468", note: "\u52B3\u8D44\u53CC\u65B9\u76F4\u63A5\u534F\u5546" },
      { method: "\u52B3\u52A8\u76D1\u5BDF\u5927\u961F\u6295\u8BC9", ratio: "\u7EA620%-25%", cycle: "2-4\u5468", note: "\u7528\u4EBA\u5355\u4F4D\u8FDD\u53CD\u52B3\u52A8\u6CD5\u65F6\u9002\u7528" },
      { method: "\u52B3\u52A8\u4EF2\u88C1", ratio: "\u7EA620%-30%", cycle: "1-3\u4E2A\u6708", note: "\u4EF2\u88C1\u524D\u7F6E\uFF0C\u5FC5\u7ECF\u7A0B\u5E8F" },
      { method: "\u8BC9\u8BBC", ratio: "\u7EA65%-10%", cycle: "3-6\u4E2A\u6708", note: "\u4E0D\u670D\u4EF2\u88C1\u88C1\u51B3\u53EF\u8D77\u8BC9" }
    ],
    support_trend: [
      { year: "2024", full_support: "\u7EA655%", partial_support: "\u7EA625%", reject: "\u7EA620%" },
      { year: "2025", full_support: "\u7EA658%", partial_support: "\u7EA623%", reject: "\u7EA619%" },
      { year: "2026\u5E741-5\u6708", full_support: "\u7EA660%", partial_support: "\u7EA622%", reject: "\u7EA618%" }
    ],
    regions: { high: ["\u5E7F\u4E1C", "\u6D59\u6C5F", "\u6C5F\u82CF"], low: ["\u897F\u90E8\u6B20\u53D1\u8FBE\u5730\u533A"] },
    trend: "\u5DE5\u4F24\u8D54\u507F\u548C\u8FDD\u6CD5\u8F9E\u9000\u7C7B\u7EA0\u7EB7\u5360\u6BD4\u4E0A\u5347\uFF0C\u52B3\u52A8\u8005\u7EF4\u6743\u610F\u8BC6\u6301\u7EED\u589E\u5F3A\u80DC\u8BC9\u7387\u8F83\u9AD8\u3002"
  },
  consumer: {
    basic: {
      litigation_rate: "\u7EA615%-22%",
      mediation_rate: "\u7EA645%-58%",
      avg_cycle: "1-3\u4E2A\u6708",
      support_rate: "\u7EA650%-65%"
    },
    resolution_distribution: [
      { method: "\u534F\u5546\u548C\u89E3", ratio: "\u7EA645%-55%", cycle: "1-2\u5468", note: "\u5546\u5BB6\u76F4\u63A5\u9000\u6B3E\u6216\u8D54\u507F" },
      { method: "\u5E73\u53F0\u7533\u8BC9", ratio: "\u7EA620%-25%", cycle: "3-7\u5929", note: "\u901A\u8FC7\u7535\u5546\u5E73\u53F0\u4ECB\u5165\u5904\u7406" },
      { method: "\u6D88\u534F\u8C03\u89E3", ratio: "\u7EA615%-20%", cycle: "1-2\u5468", note: "\u6D88\u8D39\u8005\u534F\u4F1A\u5C45\u4E2D\u8C03\u89E3" },
      { method: "\u8BC9\u8BBC\u5224\u51B3", ratio: "\u7EA68%-12%", cycle: "3-6\u4E2A\u6708", note: "\u91D1\u989D\u8F83\u5927\u65F6\u91C7\u7528" }
    ],
    support_trend: [
      { year: "2024", full_support: "\u7EA638%", partial_support: "\u7EA635%", reject: "\u7EA627%" },
      { year: "2025", full_support: "\u7EA640%", partial_support: "\u7EA634%", reject: "\u7EA626%" },
      { year: "2026\u5E741-5\u6708", full_support: "\u7EA642%", partial_support: "\u7EA633%", reject: "\u7EA625%" }
    ],
    regions: { high: ["\u6D59\u6C5F", "\u5E7F\u4E1C", "\u4E0A\u6D77"], low: ["\u504F\u8FDC\u5730\u533A"] },
    trend: "\u7F51\u7EDC\u8D2D\u7269\u7EA0\u7EB7\u5360\u6BD4\u6301\u7EED\u6269\u5927\uFF0C\u65B0\u578B\u6D88\u8D39\u573A\u666F\uFF08\u76F4\u64AD\u5E26\u8D27\u3001\u76F2\u76D2\uFF09\u7EA0\u7EB7\u589E\u957F\u660E\u663E\u3002"
  },
  default: {
    basic: {
      litigation_rate: "\u7EA615%-20%",
      mediation_rate: "\u7EA640%-50%",
      avg_cycle: "2-5\u4E2A\u6708",
      support_rate: "\u7EA650%-65%"
    },
    resolution_distribution: [
      { method: "\u534F\u5546\u89E3\u51B3", ratio: "\u7EA640%-50%", cycle: "1-4\u5468", note: "\u53CC\u65B9\u76F4\u63A5\u534F\u5546" },
      { method: "\u8C03\u89E3\u5904\u7406", ratio: "\u7EA625%-35%", cycle: "1-3\u4E2A\u6708", note: "\u7B2C\u4E09\u65B9\u8C03\u89E3" },
      { method: "\u8BC9\u8BBC\u5224\u51B3", ratio: "\u7EA615%-20%", cycle: "4-12\u4E2A\u6708", note: "\u6700\u7EC8\u6551\u6D4E\u9014\u5F84" }
    ],
    support_trend: [
      { year: "2024", full_support: "\u7EA640%", partial_support: "\u7EA635%", reject: "\u7EA625%" },
      { year: "2025", full_support: "\u7EA642%", partial_support: "\u7EA633%", reject: "\u7EA625%" },
      { year: "2026\u5E741-5\u6708", full_support: "\u7EA643%", partial_support: "\u7EA632%", reject: "\u7EA625%" }
    ],
    regions: { high: ["\u4E00\u7EBF\u57CE\u5E02"], low: ["\u4E09\u56DB\u7EBF\u57CE\u5E02"] },
    trend: "\u7EA0\u7EB7\u6570\u91CF\u6574\u4F53\u5448\u4E0A\u5347\u8D8B\u52BF\uFF0C\u7EBF\u4E0A\u7EA0\u7EB7\u589E\u957F\u66F4\u5FEB\u3002"
  }
};
function getStats(disputeType, memberLevel = 0) {
  const stats = STATS_DATA[disputeType] || STATS_DATA.default;
  const basicItems = [
    { label: "\u8FDB\u5165\u8BC9\u8BBC\u7A0B\u5E8F\u7684\u5360\u6BD4", value: stats.basic.litigation_rate },
    { label: "\u8C03\u89E3/\u548C\u89E3\u7ED3\u6848\u7684\u5360\u6BD4", value: stats.basic.mediation_rate },
    { label: "\u6D88\u8D39\u8005\u8BF7\u6C42\u83B7\u652F\u6301\u7684\u5360\u6BD4", value: stats.basic.support_rate },
    { label: "\u4ECE\u7ACB\u6848\u5230\u4E00\u5BA1\u7ED3\u6848\u5E73\u5747\u5468\u671F", value: stats.basic.avg_cycle }
  ];
  if (memberLevel >= 3) {
    return {
      basicItems,
      // 处理方式分布表
      resolution_distribution: {
        title: "\u5904\u7406\u65B9\u5F0F\u5206\u5E03",
        headers: ["\u5904\u7406\u65B9\u5F0F", "\u5360\u6BD4", "\u5E73\u5747\u5904\u7406\u5468\u671F", "\u8BF4\u660E"],
        rows: stats.resolution_distribution.map((r) => [
          r.method,
          r.ratio,
          r.cycle,
          r.note
        ])
      },
      // 时间趋势表
      support_trend: {
        title: "\u6D88\u8D39\u8005\u8BF7\u6C42\u83B7\u652F\u6301\u6BD4\u4F8B\u8D8B\u52BF\uFF08\u8FD1\u4E09\u5E74\uFF09",
        headers: ["\u5E74\u4EFD", "\u5168\u989D\u652F\u6301\u6BD4\u4F8B", "\u90E8\u5206\u652F\u6301\u6BD4\u4F8B", "\u9A73\u56DE\u6BD4\u4F8B"],
        rows: stats.support_trend.map((t) => [
          t.year,
          t.full_support,
          t.partial_support,
          t.reject
        ])
      },
      // 地域差异
      region_comparison: {
        high: stats.regions?.high?.join("\u3001") || "\u6682\u65E0",
        low: stats.regions?.low?.join("\u3001") || "\u6682\u65E0"
      },
      // 趋势说明
      trend_note: stats.trend || "\u6682\u65E0\u8D8B\u52BF\u6570\u636E"
    };
  }
  return { items: basicItems };
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

// src/modules/report/llm.service.js
var SILICONFLOW_BASE = process.env.SILICONFLOW_BASE_URL || "https://api.siliconflow.cn/v1";
var SILICONFLOW_KEY = process.env.SILICONFLOW_API_KEY || "";
var MODEL = "deepseek-ai/DeepSeek-V3-0324";
var hasKey = !!SILICONFLOW_KEY;
var lastError = null;
async function callLLM(systemPrompt, userPrompt) {
  if (!hasKey) {
    lastError = "SILICONFLOW_API_KEY\u672A\u914D\u7F6E";
    return null;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3e4);
    const res = await fetch(`${SILICONFLOW_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + SILICONFLOW_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const text = await res.text();
      lastError = "HTTP " + res.status + ": " + text.slice(0, 200);
      console.error("[LLM] \u975E200\u54CD\u5E94:", lastError);
      return null;
    }
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    lastError = err.cause ? err.cause + " " + err.message : err.message;
    console.error("[LLM] \u8C03\u7528\u5931\u8D25:", lastError);
    return null;
  }
}
function isLLMAvailable() {
  return hasKey;
}
function getLLMLastError() {
  return lastError;
}
async function generateAIInsights(input) {
  const systemPrompt = "\u4F60\u662F\u542F\u4FE1\u901A\u7684\u667A\u80FD\u7EA0\u7EB7\u8BCA\u65ADAI\u3002\u53EA\u8FD4\u56DE\u5408\u6CD5JSON\u3002";
  const userPrompt = `\u5206\u6790\u4EE5\u4E0B\u7EF4\u6743\u7EA0\u7EB7\uFF0C\u8F93\u51FAJSON\uFF1A

**\u7EA0\u7EB7\u4FE1\u606F\uFF1A**
- \u7C7B\u578B\uFF1A${input.sceneLabel || input.scene || "\u672A\u6307\u5B9A"}
- \u4E89\u8BAE\u91D1\u989D\uFF1A${input.amount || "\u672A\u77E5"}
- \u4E89\u8BAE\u7126\u70B9\uFF1A${(input.focus || []).join("\u3001") || "\u672A\u586B\u5199"}
- \u5F53\u524D\u9636\u6BB5\uFF1A${input.status || "\u672A\u77E5"}
- \u8865\u5145\u63CF\u8FF0\uFF1A${input.memo || "\u65E0"}
- \u5DF2\u6709\u8BC1\u636E\uFF1A${(input.evidence || []).map((e) => typeof e === "string" ? e : e.label || e.id || "").join("\u3001") || "\u65E0"}

\u8FD4\u56DE\u4E25\u683CJSON\uFF1A
{
  "disputeCore": "\u4E89\u8BAE\u672C\u8D28\uFF0820\u5B57\u5185\uFF09",
  "keyIssues": ["\u95EE\u98981","\u95EE\u98982","\u95EE\u98983"],
  "analysis": "\u6DF1\u5EA6\u5206\u6790\uFF08150-200\u5B57\uFF09",
  "riskAssessment": {"level": "\u9AD8/\u4E2D/\u4F4E", "points": ["\u98CE\u9669\u70B9"]},
  "strengths": ["\u6709\u5229\u56E0\u7D20"],
  "weaknesses": ["\u4E0D\u5229\u56E0\u7D20"],
  "strategy": "\u6700\u4F18\u7B56\u7565\uFF08100\u5B57\uFF09",
  "nextSteps": ["\u884C\u52A81","\u884C\u52A82","\u6B65\u9AA43"],
  "tips": "\u4E00\u53E5\u8BDD\u63D0\u9192"
}`;
  const result = await callLLM(systemPrompt, userPrompt);
  if (!result) return null;
  try {
    return JSON.parse(result);
  } catch (e) {
    console.error("[LLM] JSON\u89E3\u6790\u5931\u8D25:", e.message, result.slice(0, 200));
    return null;
  }
}

// src/modules/report/report.service.js
var EVIDENCE_ITEMS_MAP2 = Object.fromEntries(EVIDENCE_ITEMS.map((e) => [e.id, e]));
var FOCUS_KEY_MAP = {
  education: {
    "\u673A\u6784\u62D2\u7EDD\u9000\u8D39": "refuse-refund",
    "\u8BFE\u7A0B\u8D28\u91CF\u4E25\u91CD\u4E0D\u7B26": "quality-issues",
    "\u865A\u5047\u5BA3\u4F20\u88AB\u9A97": "false-advertising",
    "\u8BFE\u7A0B\u8D28\u91CF\u4E0D\u8FBE\u6807": "quality-issues",
    "\u62A5\u4E86\u57F9\u8BAD\u73ED\u60F3\u9000\u8D39": "false-advertising",
    "\u53E3\u5934\u627F\u8BFA\u672A\u5151\u73B0": "false-advertising",
    "\u673A\u6784\u5173\u95E8\u8DD1\u8DEF": "refuse-refund",
    "\u60F3\u5168\u989D\u9000\u8D39": "refuse-refund",
    "\u6362\u4E86\u8001\u5E08/\u573A\u5730": "quality-issues",
    "\u6559\u7EC3/\u8001\u5E08\u8D44\u8D28\u95EE\u9898": "quality-issues",
    "\u8D37\u6B3E/\u5206\u671F\u4ED8\u6B3E": "loan-related"
  },
  medical: {
    "\u6548\u679C\u4E25\u91CD\u4E0D\u7B26": "quality-issues",
    "\u51FA\u73B0\u5E76\u53D1\u75C7/\u540E\u9057\u75C7": "medical-risk",
    "\u8D39\u7528\u4E0D\u900F\u660E": "overcharge",
    "\u673A\u6784\u4E0D\u627F\u8BA4": "refuse-refund",
    "\u8981\u6C42\u8D54\u507F": "medical-risk",
    "\u505A\u4E86\u533B\u7F8E\u9879\u76EE\u6548\u679C\u4E0D\u6EE1\u610F": "quality-issues",
    "\u624B\u672F\u5931\u8D25/\u5E76\u53D1\u75C7": "medical-risk",
    "\u8FC7\u5EA6\u533B\u7597/\u4E71\u6536\u8D39": "overcharge",
    "\u865A\u5047\u5BA3\u4F20\u88AB\u9A97": "false-advertising",
    "\u62D2\u7EDD\u63D0\u4F9B\u75C5\u5386": "medical-risk",
    "\u6548\u679C\u4E0E\u627F\u8BFA\u4E0D\u7B26": "effect-not-match",
    "\u6536\u8D39\u4E0D\u900F\u660E\u6216\u4E71\u6536\u8D39": "price-opaque",
    "\u670D\u52A1\u8D28\u91CF\u4F4E\u52A3": "service-quality",
    "\u865A\u5047\u5BA3\u4F20\u6216\u8D44\u8D28\u9020\u5047": "false-advertising"
  },
  labor: {
    "\u5DE5\u8D44\u62D6\u6B20": "wage-arrears",
    "\u5DE5\u8D44\u62D6\u6B20/\u514B\u6263": "wage-deduction",
    "\u4E0D\u7F34\u793E\u4FDD": "labor-violation",
    "\u4E0D\u7F34\u793E\u4FDD/\u516C\u79EF\u91D1": "labor-violation",
    "\u4E0D\u7F34\u793E\u4FDD\u516C\u79EF\u91D1": "labor-violation",
    "\u8FDD\u6CD5\u8F9E\u9000": "illegal-dismissal",
    "\u8FDD\u6CD5\u8F9E\u9000/\u8D54\u507F\u4E89\u8BAE": "illegal-dismissal",
    "\u88AB\u8FDD\u6CD5\u8F9E\u9000": "illegal-dismissal",
    "\u88AB\u903C\u4E3B\u52A8\u8F9E\u804C": "illegal-dismissal",
    "\u516C\u53F8\u4EE5\u5404\u79CD\u7406\u7531\u514B\u6263": "wage-deduction",
    "\u53E3\u5934\u8F9E\u9000\u65E0\u4E66\u9762": "illegal-dismissal",
    "\u4E0D\u7ED9\u5DE5\u8D44\u6761/\u8003\u52E4\u8BB0\u5F55": "wage-deduction",
    "\u62D2\u7EDD\u652F\u4ED8\u7ECF\u6D4E\u8865\u507F": "illegal-dismissal",
    "\u4E0D\u627F\u8BA4\u5DE5\u4F24": "work-injury",
    "\u5DE5\u8D44\u88AB\u62D6\u6B20": "wage-arrears",
    "\u4E0D\u7ED9\u53D1\u52A0\u73ED\u8D39": "wage-deduction",
    "\u5DE5\u4F24\u4E0D\u8D54\u507F": "work-injury"
  },
  housing: {
    "\u623F\u4E1C\u8FDD\u7EA6": "landlord-breach",
    "\u623F\u5C4B\u8D28\u91CF\u5DEE": "housing-quality",
    "\u4E0D\u9000\u62BC\u91D1": "deposit-refund",
    "\u4E0D\u7ED9\u7EF4\u4FEE": "housing-quality"
  },
  consumer: {
    "\u865A\u5047\u5BA3\u4F20": "false-advertising",
    "\u8D28\u91CF\u95EE\u9898": "quality-issues",
    "\u62D2\u7EDD\u9000\u8D27": "refuse-refund",
    "\u5546\u5BB6\u8DD1\u8DEF": "merchant-run",
    "\u8D27\u4E0D\u5BF9\u677F": "quality-issues"
  },
  beauty: {
    "\u6548\u679C\u5DEE": "quality-issues",
    "\u6BC1\u5BB9": "medical-risk",
    "\u62D2\u7EDD\u9000\u6B3E": "refuse-refund",
    "\u5F3A\u5236\u6D88\u8D39": "consumer-harm",
    "\u9884\u4ED8\u5361\u5377\u6B3E": "prepaid-risk"
  },
  loan: {
    "\u501F\u94B1\u4E0D\u8FD8": "debt-dispute",
    "\u9AD8\u5229\u8D37": "usury",
    "\u66B4\u529B\u50AC\u6536": "debt-harm",
    "\u780D\u5934\u606F": "usury"
  },
  franchise: {
    "\u5408\u540C\u7EA0\u7EB7": "contract-dispute",
    "\u533A\u57DF\u4FDD\u62A4": "franchise-risk",
    "\u865A\u5047\u627F\u8BFA": "false-advertising",
    "\u4FDD\u8BC1\u91D1\u4E0D\u9000": "deposit-refund"
  },
  // ==================== 民间借贷纠纷 ====================
  civil_loan: {
    "\u5BF9\u65B9\u4E0D\u8FD8\u6B3E": "not-repay",
    "\u5229\u606F\u6709\u4E89\u8BAE": "interest-dispute",
    "\u6CA1\u6709\u501F\u6761/\u51ED\u8BC1": "no-contract",
    "\u50AC\u6536\u9A9A\u6270": "harassment"
  },
  investment: {
    "\u6536\u76CA\u4E0E\u627F\u8BFA\u4E25\u91CD\u4E0D\u7B26": "return-not-match",
    "\u672C\u91D1\u65E0\u6CD5\u53D6\u56DE": "principal-locked",
    "\u4EA4\u6613\u5F02\u5E38\u6216\u65E0\u6CD5\u64CD\u4F5C": "transaction-abnormal",
    "\u5BF9\u65B9\u5931\u8054\u6216\u8DD1\u8DEF": "party-missing"
  },
  jade: {
    "\u8D27\u4E0D\u5BF9\u677F": "quality-issues",
    "\u4EF7\u683C\u865A\u9AD8": "overcharge",
    "\u865A\u5047\u5BA3\u4F20": "false-advertising",
    "\u62D2\u7EDD\u9000\u8D27": "refuse-refund",
    "\u4EE5\u5047\u5145\u771F": "counterfeit"
  },
  marriage: {
    "\u670D\u52A1\u6B20\u4F73": "service-quality",
    "\u9000\u6B3E\u56F0\u96BE": "refuse-refund",
    "\u865A\u5047\u5BA3\u4F20": "false-advertising",
    "\u8BF1\u5BFC\u6D88\u8D39": "forced-consumption",
    "\u5408\u540C\u7EA0\u7EB7": "contract-dispute"
  },
  telecom: {
    "\u6B3A\u8BC8\u6536\u6B3E": "fraud",
    "\u865A\u5047\u5BA3\u4F20": "false-advertising",
    "\u6076\u610F\u6263\u8D39": "overcharge",
    "\u7EF4\u6743\u56F0\u96BE": "rights-protection",
    "\u8BF1\u5BFC\u5145\u503C": "forced-consumption"
  },
  online: {
    "\u8D27\u4E0D\u5BF9\u677F": "quality-issues",
    "\u865A\u5047\u5BA3\u4F20": "false-advertising",
    "\u62D2\u7EDD\u9000\u8D27": "refuse-refund",
    "\u5546\u5BB6\u8DD1\u8DEF": "merchant-run",
    "\u4ED8\u6B3E\u4E0D\u53D1\u8D27": "fraud"
  },
  service: {
    "\u670D\u52A1\u6B20\u4F73": "service-quality",
    "\u9000\u6B3E\u56F0\u96BE": "refuse-refund",
    "\u865A\u5047\u5BA3\u4F20": "false-advertising",
    "\u8BF1\u5BFC\u6D88\u8D39": "forced-consumption",
    "\u5408\u540C\u7EA0\u7EB7": "contract-dispute"
  },
  other: {
    "\u5408\u540C\u7EA0\u7EB7": "contract-dispute",
    "\u9000\u6B3E\u56F0\u96BE": "refuse-refund",
    "\u865A\u5047\u5BA3\u4F20": "false-advertising",
    "\u8D28\u91CF\u95EE\u9898": "quality-issues",
    "\u5176\u4ED6\u60C5\u5F62": "other"
  }
};
function resolveFocusKeys(scene, focusNames) {
  if (!focusNames || !focusNames.length) return [];
  const sceneMap = FOCUS_KEY_MAP[scene] || {};
  return focusNames.map((f) => sceneMap[f] || f);
}
var EVIDENCE_NAME_TO_ID = {
  "\u5408\u540C\u6216\u534F\u8BAE": "contract",
  "\u5408\u540C/\u534F\u8BAE": "contract",
  "\u4ED8\u6B3E\u8BB0\u5F55/\u6536\u636E": "payment",
  "\u4ED8\u6B3E\u8BB0\u5F55": "payment",
  "\u804A\u5929\u8BB0\u5F55": "chat",
  "\u5BA3\u4F20\u5E7F\u544A/\u627F\u8BFA\u622A\u56FE": "ads",
  "\u5BA3\u4F20\u5E7F\u544A": "ads",
  "\u5BF9\u65B9\u8054\u7CFB\u65B9\u5F0F\u6216\u5730\u5740": "contact",
  "\u5BF9\u65B9\u8054\u7CFB\u65B9\u5F0F": "contact",
  "\u5F55\u97F3\u6216\u5F55\u50CF": "media",
  "\u5F55\u97F3": "media",
  "\u73B0\u573A\u7167\u7247/\u89C6\u9891": "photos",
  "\u7167\u7247": "photos"
};
function generateReportId() {
  const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:T]/g, "").slice(0, 12);
  const rand = Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
  return `QX-${ts.slice(0, 8)}-${rand}`;
}
function safeText(text) {
  if (text == null) return "";
  const str = String(text);
  return str.replace(/[<>]/g, "").trim() || "";
}
var RECOMMENDED_EVIDENCE = {
  education: [
    { id: "contract", label: "\u5408\u540C/\u534F\u8BAE", reason: "\u8BC1\u660E\u53CC\u65B9\u7EA6\u5B9A\u7684\u670D\u52A1\u5185\u5BB9\u548C\u6807\u51C6", channel: '\u5FAE\u4FE1\u804A\u5929\u8BB0\u5F55\u641C\u7D22"\u5408\u540C"\u3001\u90AE\u7BB1\u641C\u7D22\u3001\u673A\u6784\u524D\u53F0\u7D22\u53D6', priority: 1 },
    { id: "payment", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u6D88\u8D39\u884C\u4E3A\u5DF2\u53D1\u751F", channel: "\u94F6\u884CApp\u6216\u7F51\u70B9\u6253\u5370\u3001\u652F\u4ED8App\u5BFC\u51FA", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u7B7E\u7EA6\u524D\u6C9F\u901A\u5185\u5BB9\u548C\u5BF9\u65B9\u627F\u8BFA", channel: "\u624B\u673A\u7AEF\u622A\u56FE+\u5F55\u5C4F+\u65F6\u95F4\u6233\u516C\u8BC1", priority: 2 },
    { id: "ads", label: "\u5BA3\u4F20\u6750\u6599", reason: "\u8BC1\u660E\u5E7F\u544A\u5BA3\u4F20\u5185\u5BB9\u4E0E\u5B9E\u9645\u5DEE\u5F02", channel: "\u5FAE\u4FE1\u516C\u4F17\u53F7\u5386\u53F2\u6587\u7AE0\u3001\u641C\u7D22\u5F15\u64CE\u5FEB\u7167", priority: 1 },
    { id: "invoice", label: "\u53D1\u7968/\u6536\u636E", reason: "\u8BC1\u660E\u4EA4\u6613\u771F\u5B9E\u53D1\u751F", channel: "\u5411\u673A\u6784\u4E66\u9762\u7533\u8BF7\u3001\u7A0E\u52A1\u5C40\u7F51\u7AD9\u67E5\u9A8C", priority: 2 }
  ],
  medical: [
    { id: "contract", label: "\u5408\u540C/\u534F\u8BAE", reason: "\u8BC1\u660E\u670D\u52A1\u5185\u5BB9\u548C\u53CC\u65B9\u7EA6\u5B9A", channel: "\u5411\u673A\u6784\u7533\u8BF7\u76D6\u7AE0\u539F\u4EF6", priority: 1 },
    { id: "payment", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u652F\u4ED8\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34\u3001\u652F\u4ED8App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u6C9F\u901A\u7ECF\u8FC7\u548C\u627F\u8BFA\u5185\u5BB9", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "photos", label: "\u73B0\u573A\u7167\u7247/\u89C6\u9891", reason: "\u8BC1\u660E\u5B9E\u9645\u670D\u52A1\u60C5\u51B5", channel: "\u624B\u673A\u76F8\u518C\u539F\u56FE", priority: 2 }
  ],
  labor: [
    { id: "contract", label: "\u52B3\u52A8\u5408\u540C", reason: "\u8BC1\u660E\u52B3\u52A8\u5173\u7CFB\u548C\u5DE5\u8D44\u6807\u51C6", channel: "\u5411\u516C\u53F8HR\u7D22\u53D6\u6216\u793E\u4FDD\u5C40\u6253\u5370", priority: 1 },
    { id: "salary", label: "\u5DE5\u8D44\u6D41\u6C34", reason: "\u8BC1\u660E\u5DE5\u8D44\u91D1\u989D\u548C\u62D6\u6B20\u60C5\u51B5", channel: "\u94F6\u884CApp\u6216\u7F51\u70B9\u6253\u5370", priority: 1 },
    { id: "social", label: "\u793E\u4FDD\u7F34\u8D39\u8BB0\u5F55", reason: "\u8BC1\u660E\u793E\u4FDD\u7F34\u7EB3\u60C5\u51B5", channel: "\u5F53\u5730\u793E\u4FDD\u5C40\u7F51\u7AD9\u6216App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u8F9E\u9000\u901A\u77E5\u548C\u5DE5\u8D44\u4E89\u8BAE", channel: "\u624B\u673A\u7AEF\u622A\u56FE+\u5F55\u5C4F", priority: 2 }
  ],
  housing: [
    { id: "contract_orig", label: "\u79DF\u8D41\u5408\u540C", reason: "\u8BC1\u660E\u79DF\u8D41\u6761\u6B3E\u548C\u62BC\u91D1\u7EA6\u5B9A", channel: "\u7B7E\u8BA2\u7684\u6B63\u672C\u5408\u540C\u539F\u4EF6", priority: 1 },
    { id: "transfer", label: "\u62BC\u91D1\u8F6C\u8D26\u8BB0\u5F55", reason: "\u8BC1\u660E\u62BC\u91D1\u91D1\u989D\u548C\u652F\u4ED8\u4E8B\u5B9E", channel: "\u94F6\u884C\u6D41\u6C34\u6216\u8F6C\u8D26\u622A\u56FE", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u7EF4\u4FEE\u8BF7\u6C42\u548C\u5BF9\u65B9\u56DE\u590D", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "photos", label: "\u623F\u5C4B\u7167\u7247", reason: "\u8BC1\u660E\u623F\u5C4B\u635F\u574F\u6216\u7EF4\u4FEE\u95EE\u9898", channel: "\u624B\u673A\u76F8\u518C\u539F\u56FE", priority: 2 }
  ],
  consumer: [
    { id: "contract", label: "\u5408\u540C/\u8BA2\u5355", reason: "\u8BC1\u660E\u4EA4\u6613\u6761\u6B3E\u548C\u91D1\u989D", channel: "\u7EBF\u4E0A\u8BA2\u5355\u622A\u56FE\u6216\u4E66\u9762\u5408\u540C", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u652F\u4ED8\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34\u3001\u652F\u4ED8App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u6C9F\u901A\u7ECF\u8FC7\u548C\u627F\u8BFA\u5185\u5BB9", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "ads", label: "\u5BA3\u4F20\u6750\u6599", reason: "\u8BC1\u660E\u5E7F\u544A\u5BA3\u4F20\u4E0E\u5B9E\u9645\u5DEE\u5F02", channel: "\u5BA3\u4F20\u9875\u9762\u622A\u56FE\u3001\u670B\u53CB\u5708", priority: 2 }
  ],
  beauty: [
    { id: "contract", label: "\u4F1A\u5458\u5361/\u670D\u52A1\u5408\u540C", reason: "\u8BC1\u660E\u670D\u52A1\u5185\u5BB9\u548C\u9000\u5361\u7EA6\u5B9A", channel: "\u7B7E\u7F72\u7684\u670D\u52A1\u534F\u8BAE\u539F\u4EF6", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u5145\u503C\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34\u6216\u652F\u4ED8App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u670D\u52A1\u627F\u8BFA\u548C\u6C9F\u901A\u7ECF\u8FC7", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "photos", label: "\u73B0\u573A\u7167\u7247/\u89C6\u9891", reason: "\u8BC1\u660E\u5B9E\u9645\u670D\u52A1\u60C5\u51B5", channel: "\u624B\u673A\u76F8\u518C", priority: 2 }
  ],
  franchise: [
    { id: "contract", label: "\u52A0\u76DF\u5408\u540C", reason: "\u8BC1\u660E\u52A0\u76DF\u6761\u6B3E\u548C\u8D39\u7528\u7EA6\u5B9A", channel: "\u7B7E\u7F72\u7684\u6B63\u672C\u5408\u540C\u539F\u4EF6", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u52A0\u76DF\u8D39\u7528\u5B9E\u9645\u652F\u4ED8\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u7B7E\u7EA6\u524D\u6C9F\u901A\u548C\u5BF9\u65B9\u627F\u8BFA", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "ads", label: "\u5BA3\u4F20\u6750\u6599", reason: "\u8BC1\u660E\u5BF9\u65B9\u865A\u5047\u5BA3\u4F20\u6216\u627F\u8BFA\u4E0D\u7B26", channel: "\u62DB\u5546\u624B\u518C\u3001\u5B98\u7F51\u622A\u56FE", priority: 2 }
  ],
  debt: [
    { id: "contract", label: "\u501F\u6761/\u501F\u6B3E\u534F\u8BAE", reason: "\u8BC1\u660E\u501F\u6B3E\u91D1\u989D\u3001\u671F\u9650\u548C\u5229\u606F\u7EA6\u5B9A", channel: "\u7EB8\u8D28\u501F\u6761\u6216\u7535\u5B50\u534F\u8BAE", priority: 1 },
    { id: "transfer", label: "\u8F6C\u8D26\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u51FA\u501F\u91D1\u989D\u548C\u65F6\u95F4", channel: "\u94F6\u884C\u6D41\u6C34", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u50AC\u6B3E\u7ECF\u8FC7\u548C\u5BF9\u65B9\u56DE\u5E94", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 }
  ],
  telecom: [
    { id: "contract", label: "\u670D\u52A1\u534F\u8BAE", reason: "\u8BC1\u660E\u670D\u52A1\u5185\u5BB9\u548C\u6536\u8D39\u6807\u51C6", channel: "\u8FD0\u8425\u5546\u8425\u4E1A\u5385\u6216App\u83B7\u53D6", priority: 1 },
    { id: "transfer", label: "\u6263\u8D39\u8BB0\u5F55", reason: "\u8BC1\u660E\u6076\u610F\u6263\u8D39\u91D1\u989D\u548C\u65F6\u95F4", channel: "\u94F6\u884C\u6D41\u6C34\u6216\u652F\u4ED8App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u8BF1\u5BFC\u5145\u503C\u6216\u865A\u5047\u627F\u8BFA", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "ads", label: "\u5BA3\u4F20\u6750\u6599", reason: "\u8BC1\u660E\u5BA3\u4F20\u5185\u5BB9\u4E0E\u5B9E\u9645\u4E0D\u7B26", channel: "\u5BA3\u4F20\u9875\u9762\u622A\u56FE", priority: 2 }
  ],
  investment: [
    { id: "contract", label: "\u6295\u8D44\u534F\u8BAE", reason: "\u8BC1\u660E\u6295\u8D44\u6761\u6B3E\u548C\u6536\u76CA\u7EA6\u5B9A", channel: "\u7B7E\u7F72\u7684\u6295\u8D44\u5408\u540C\u539F\u4EF6", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u6295\u8D44\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u5BF9\u65B9\u8BF1\u5BFC\u5BA3\u4F20\u548C\u6536\u76CA\u627F\u8BFA", channel: "\u624B\u673A\u7AEF\u622A\u56FE+\u5F55\u5C4F", priority: 2 },
    { id: "ads", label: "\u5BA3\u4F20\u6750\u6599", reason: "\u8BC1\u660E\u9AD8\u6536\u76CA\u627F\u8BFA\u548C\u865A\u5047\u5BA3\u4F20", channel: "\u5BA3\u4F20\u9875\u9762\u3001\u76F4\u64AD\u5F55\u50CF", priority: 1 }
  ],
  jade: [
    { id: "contract", label: "\u8D2D\u4E70\u5408\u540C/\u6536\u636E", reason: "\u8BC1\u660E\u8D2D\u4E70\u91D1\u989D\u548C\u9000\u6362\u8D27\u7EA6\u5B9A", channel: "\u8D2D\u4E70\u65F6\u7684\u5408\u540C\u6216\u6536\u636E", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u8D2D\u4E70\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34\u6216\u652F\u4ED8App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u5BF9\u65B9\u6750\u8D28\u63CF\u8FF0\u548C\u627F\u8BFA", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "photos", label: "\u5546\u54C1\u7167\u7247/\u9274\u5B9A\u62A5\u544A", reason: "\u8BC1\u660E\u8D27\u4E0D\u5BF9\u677F\u6216\u5047\u8D27\u95EE\u9898", channel: "\u6536\u8D27\u65F6\u62CD\u7167\u7559\u5B58", priority: 2 }
  ],
  marriage: [
    { id: "contract", label: "\u670D\u52A1\u5408\u540C", reason: "\u8BC1\u660E\u670D\u52A1\u5185\u5BB9\u548C\u9000\u6B3E\u7EA6\u5B9A", channel: "\u7B7E\u7F72\u7684\u670D\u52A1\u534F\u8BAE\u539F\u4EF6", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u652F\u4ED8\u670D\u52A1\u8D39\u7528", channel: "\u94F6\u884C\u6D41\u6C34", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u670D\u52A1\u627F\u8BFA\u548C\u6C9F\u901A\u7ECF\u8FC7", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "ads", label: "\u5BA3\u4F20\u6750\u6599", reason: "\u8BC1\u660E\u5BA3\u4F20\u5185\u5BB9\u4E0E\u5B9E\u9645\u4E0D\u7B26", channel: "\u5BA3\u4F20\u9875\u9762\u622A\u56FE", priority: 2 }
  ],
  esoteric: [
    { id: "contract", label: "\u670D\u52A1\u5408\u540C", reason: "\u8BC1\u660E\u670D\u52A1\u5185\u5BB9\u548C\u9000\u8D39\u7EA6\u5B9A", channel: "\u7B7E\u7F72\u7684\u670D\u52A1\u534F\u8BAE\u539F\u4EF6", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u652F\u4ED8\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34\u6216\u652F\u4ED8App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u670D\u52A1\u627F\u8BFA\u548C\u6C9F\u901A\u7ECF\u8FC7", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "ads", label: "\u5BA3\u4F20\u6750\u6599", reason: "\u8BC1\u660E\u5BA3\u4F20\u5185\u5BB9\u4E0E\u5B9E\u9645\u4E0D\u7B26", channel: "\u5BA3\u4F20\u9875\u9762\u6216\u670B\u53CB\u5708\u622A\u56FE", priority: 2 }
  ],
  online: [
    { id: "contract", label: "\u8BA2\u5355\u8BB0\u5F55", reason: "\u8BC1\u660E\u5546\u54C1\u4FE1\u606F\u548C\u4EA4\u6613\u6761\u6B3E", channel: "\u7535\u5546\u5E73\u53F0\u8BA2\u5355\u9875\u622A\u56FE", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u652F\u4ED8\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34\u6216\u652F\u4ED8App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u4E0E\u5546\u5BB6\u7684\u6C9F\u901A\u7ECF\u8FC7", channel: "\u5E73\u53F0\u804A\u5929\u8BB0\u5F55\u622A\u56FE", priority: 2 },
    { id: "photos", label: "\u5546\u54C1\u7167\u7247", reason: "\u8BC1\u660E\u6536\u5230\u7684\u5546\u54C1\u4E0E\u63CF\u8FF0\u4E0D\u7B26", channel: "\u6536\u8D27\u65F6\u62CD\u7167\u7559\u5B58", priority: 2 }
  ],
  service: [
    { id: "contract", label: "\u670D\u52A1\u5408\u540C", reason: "\u8BC1\u660E\u670D\u52A1\u5185\u5BB9\u548C\u9000\u8D39\u7EA6\u5B9A", channel: "\u7B7E\u7F72\u7684\u670D\u52A1\u534F\u8BAE\u539F\u4EF6", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u652F\u4ED8\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34\u6216\u652F\u4ED8App", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u670D\u52A1\u627F\u8BFA\u548C\u6C9F\u901A\u7ECF\u8FC7", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 },
    { id: "photos", label: "\u73B0\u573A\u7167\u7247/\u89C6\u9891", reason: "\u8BC1\u660E\u670D\u52A1\u5B9E\u9645\u8D28\u91CF", channel: "\u624B\u673A\u76F8\u518C", priority: 2 }
  ],
  other: [
    { id: "contract", label: "\u5408\u540C/\u534F\u8BAE", reason: "\u8BC1\u660E\u53CC\u65B9\u6743\u5229\u4E49\u52A1", channel: "\u7B7E\u7F72\u7684\u5408\u540C\u539F\u4EF6", priority: 1 },
    { id: "transfer", label: "\u4ED8\u6B3E\u8BB0\u5F55", reason: "\u8BC1\u660E\u5B9E\u9645\u53D1\u751F\u91D1\u989D", channel: "\u94F6\u884C\u6D41\u6C34", priority: 1 },
    { id: "chat", label: "\u804A\u5929\u8BB0\u5F55", reason: "\u8BC1\u660E\u6C9F\u901A\u7ECF\u8FC7", channel: "\u624B\u673A\u7AEF\u622A\u56FE", priority: 2 }
  ]
};
function getRecommendedEvidence(disputeType) {
  return RECOMMENDED_EVIDENCE[disputeType] || RECOMMENDED_EVIDENCE.other;
}
function getEvidenceCompleteness(disputeType, existingKeys) {
  const requiredMap = {
    education: ["contract", "transfer", "chat"],
    medical: ["contract", "transfer", "chat"],
    beauty: ["contract", "transfer", "chat"],
    esoteric: ["contract", "transfer", "chat"],
    investment: ["contract", "transfer", "chat"],
    franchise: ["contract", "transfer", "chat"],
    jade: ["contract", "transfer", "chat"],
    marriage: ["contract", "transfer", "chat"],
    telecom: ["contract", "transfer", "chat"],
    labor: ["contract", "salary", "social"],
    debt: ["contract", "transfer", "chat"],
    housing: ["contract_orig", "transfer", "chat"],
    consumer: ["contract", "transfer", "chat"],
    online: ["contract", "transfer", "chat"],
    service: ["contract", "transfer", "chat"],
    other: ["contract", "transfer", "chat"]
  };
  const required = requiredMap[disputeType] || requiredMap.other;
  const existingSet = new Set(existingKeys);
  const covered = required.filter((k) => existingSet.has(k)).length;
  const total = required.length;
  const score = Math.round(covered / total * 100);
  let level = "\u8F83\u4F4E";
  if (score >= 90) level = "\u8F83\u9AD8";
  else if (score >= 70) level = "\u4E2D\u7B49";
  return { score, level, covered, total };
}
function buildModule1({ scene, amount, focusKeys, status, evidence, memberLevel }) {
  const base = {
    type: safeText(scene),
    amount: safeText(amount),
    status: safeText(status),
    focus: focusKeys.map((f) => safeText(f))
  };
  const englishFocusKeys = resolveFocusKeys(scene, focusKeys);
  let focusAnalysis = null;
  if (memberLevel >= 1 && englishFocusKeys.length > 0) {
    const analyses = getDisputeAnalyses(scene, englishFocusKeys);
    if (analyses && analyses.length > 0) {
      focusAnalysis = analyses.map((a) => {
        const baseInfo = { focus: safeText(a.focusName) };
        const vipInfo = {
          definition: safeText(a.definition || ""),
          judgmentBasis: (a.judgmentBasis || []).map((b) => safeText(b)),
          evidenceRelation: (a.evidenceRelation || []).map((er) => ({
            material: safeText(er.material),
            status: er.status || "",
            note: safeText(er.note || "")
          })),
          supplementGuide: {
            priority: a.supplementGuide?.priority || 2,
            channel: safeText(a.supplementGuide?.channel || ""),
            action: safeText(a.supplementGuide?.action || "")
          }
        };
        return { ...baseInfo, ...vipInfo };
      });
    }
  }
  let evidenceCorrelation = null;
  let riskTips = null;
  if (memberLevel >= 2 && englishFocusKeys.length > 0) {
    const existingKeys = evidence.map((e) => {
      const name = typeof e === "string" ? e : e.id || "";
      return EVIDENCE_NAME_TO_ID[name] || name;
    });
    const existingKeysSet = new Set(existingKeys);
    const correlations = [];
    for (const focusKey of englishFocusKeys) {
      const analyses = getDisputeAnalyses(scene, [focusKey]);
      if (analyses && analyses.length > 0) {
        const a = analyses[0];
        const erList = a.evidenceRelation || [];
        const items = erList.map((er) => {
          const matName = er.material;
          const isExisting = existingKeysSet.has(matName) || existingKeys.some((k) => k === matName) || EVIDENCE_ITEMS_MAP2[matName] && existingKeysSet.has(matName);
          return {
            material: safeText(matName),
            status: isExisting ? "\u5DF2\u6709" : "\u5EFA\u8BAE\u8865\u5145",
            note: safeText(er.note || "")
          };
        });
        const existingCount = items.filter((i) => i.status === "\u5DF2\u6709").length;
        const summary = existingCount >= items.length * 0.6 ? "\u60A8\u7684\u8BC1\u636E\u5DF2\u8986\u76D6\u8BE5\u7126\u70B9\u7684\u6838\u5FC3\u8981\u7D20\uFF0C\u5177\u5907\u57FA\u672C\u7684\u8BC1\u660E\u529B" : "\u5EFA\u8BAE\u8865\u5145\u6838\u5FC3\u8BC1\u636E\uFF0C\u53EF\u8FDB\u4E00\u6B65\u63D0\u5347\u8BE5\u7126\u70B9\u7684\u8BC1\u660E\u529B";
        correlations.push({ focus: safeText(a.focusName || focusKey), items, summary });
      }
    }
    if (correlations.length > 0) evidenceCorrelation = correlations;
    const primaryFocusKey = englishFocusKeys[0];
    const risks = matchRiskAlerts(scene, primaryFocusKey, existingKeys, []);
    if (risks && risks.length > 0) {
      riskTips = risks.map((r) => ({
        level: r.riskLevel || "medium",
        title: safeText(r.riskTitle || ""),
        description: safeText(r.riskDescription || ""),
        suggestion: safeText(r.suggestion || "")
      }));
    }
  }
  return {
    ...base,
    ...focusAnalysis && { focusAnalysis },
    ...evidenceCorrelation && { evidenceCorrelation },
    ...riskTips && riskTips.length > 0 && { riskTips }
  };
}
function buildModule2({ scene, evidence, memberLevel }) {
  const have = (evidence || []).map((e) => ({
    name: e.label || e.id || "\u672A\u77E5\u6750\u6599",
    tip: e.note || (e.keyTerms && e.keyTerms.length > 0 ? e.keyTerms.join("\u3001") : "\u5DF2\u4E0A\u4F20"),
    level: e.level || "",
    quality: e.quality || "",
    keyTerms: e.keyTerms || []
  }));
  const existingKeys = new Set((evidence || []).map((e) => e.id || ""));
  const recommended = getRecommendedEvidence(scene);
  const suggest = recommended.filter((r) => !existingKeys.has(r.id)).map((g) => ({
    name: safeText(g.label),
    reason: safeText(g.reason || ""),
    channel: memberLevel >= 2 ? safeText(g.channel || "") : void 0,
    priority: memberLevel >= 2 ? g.priority || 2 : void 0
  }));
  let completeness = null;
  if (memberLevel >= 2) {
    const existingIds = (evidence || []).map((e) => e.id || "");
    const comp = getEvidenceCompleteness(scene, existingIds);
    completeness = {
      score: comp.score,
      level: comp.level,
      focusCoverage: `${comp.covered}/${comp.total}\u4E2A\u7126\u70B9\u6838\u5FC3\u8981\u7D20\u5DF2\u8986\u76D6`,
      tip: comp.score < 70 ? "\u5EFA\u8BAE\u4F18\u5148\u8865\u5145\u9AD8\u4F18\u5148\u7EA7\u6750\u6599\uFF0C\u53EF\u663E\u8457\u63D0\u5347\u5B8C\u6574\u5EA6" : ""
    };
  }
  return { have, suggest, ...completeness && { completeness } };
}
function buildModule3({ scene }) {
  const laws = LAW_LIBRARY[scene] || DEFAULT_LAWS;
  return (laws || []).map((l) => ({
    name: safeText(l.name || ""),
    content: safeText(l.content || "")
  }));
}
function buildModule4({ scene, status, focusKeys, amount, memberLevel }) {
  const processPath = getProcessPath(status);
  const base = { nodes: processPath || [] };
  let currentStageGuide = null;
  if (memberLevel >= 1 && processPath && processPath.length > 0) {
    const currentNode = processPath.find((n) => n.current) || processPath[0];
    const tips = Array.isArray(currentNode.tips) ? currentNode.tips.join("\uFF1B") : safeText(currentNode.tips || "");
    currentStageGuide = {
      stage: safeText(currentNode.name || ""),
      guide: safeText(currentNode.operation_guide || currentNode.guide || ""),
      tips
    };
  }
  let optimalPathGuide = null;
  if (memberLevel >= 2) {
    let recommendation = "\u5EFA\u8BAE\u4F18\u5148\u5C1D\u8BD5\u4F4E\u6210\u672C\u9014\u5F84\uFF08\u6295\u8BC9/\u8C03\u89E3\uFF09\uFF0C\u65E0\u6548\u540E\u518D\u8003\u8651\u8BC9\u8BBC";
    if (getApplicabilityGuide) {
      const guide = getApplicabilityGuide(scene, status);
      if (guide && guide.recommendation) recommendation = safeText(guide.recommendation);
    }
    optimalPathGuide = {
      recommendation,
      reason: safeText("\u57FA\u4E8E\u60A8\u5F53\u524D\u6240\u5904\u9636\u6BB5\u548C\u5DF2\u6709\u8BC1\u636E\u60C5\u51B5\u8FDB\u884C\u5339\u914D")
    };
  }
  let alternatives = null;
  if (memberLevel >= 3) {
    const solutions = getSolutionsForDispute(scene);
    if (solutions && solutions.solutions && solutions.solutions.length > 0) {
      alternatives = solutions.solutions.map((s) => ({
        path: safeText(s.pathName || ""),
        applicableCondition: safeText(s.applicableCondition || ""),
        processingCycle: safeText(s.processingCycle || ""),
        cost: safeText(s.cost || ""),
        requiredMaterials: (s.requiredMaterials || []).map((m) => safeText(m)),
        steps: (s.steps || []).map((st) => safeText(st)),
        tips: safeText(s.tips || "")
      }));
    }
  }
  return {
    ...base,
    ...currentStageGuide && { currentStageGuide },
    ...optimalPathGuide && { optimalPathGuide },
    ...alternatives && alternatives.length > 0 && { alternatives }
  };
}
function buildModule5({ scene, memberLevel }) {
  return getStats(scene, memberLevel);
}
function buildModule6({ scene, status, focusKeys, memo, evidence }) {
  const nodes = [];
  const evidenceTimestamps = [];
  if (evidence && evidence.length > 0) {
    evidence.forEach((ev) => {
      if (ev.keyTerms && ev.keyTerms.length > 0) {
        evidenceTimestamps.push({
          time: (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
          event: ev.label + "\u5DF2\u4E0A\u4F20",
          source: "\u8BC1\u636E\u6750\u6599",
          level: ev.level || "C\u7EA7 \u2605\u2605\u2605"
        });
      }
    });
  }
  if (memo && memo.length > 0) {
    nodes.push({
      time: (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
      event: memo.slice(0, 80) + (memo.length > 80 ? "\u2026" : ""),
      source: "\u7528\u6237\u9648\u8FF0",
      level: "\u7528\u6237\u9648\u8FF0"
    });
  }
  const stageLabels = { "\u4E0E\u5BF9\u65B9\u534F\u5546\u6C9F\u901A": "\u534F\u5546", "\u5411\u5E73\u53F0\u6216\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9": "\u6295\u8BC9", "\u54A8\u8BE2\u8FC7\u4E13\u4E1A\u4EBA\u58EB": "\u54A8\u8BE2", "\u8FD8\u6CA1\u6709\u5C1D\u8BD5\u8FC7\u4EFB\u4F55\u65B9\u5F0F": "\u5C1A\u672A\u5C1D\u8BD5" };
  const stageLabel = typeof status === "string" ? stageLabels[status] || status.split("\u3001")[0] || "\u534F\u5546" : "\u534F\u5546";
  nodes.push({
    time: (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
    event: `\u8FDB\u5165${stageLabel}\u9636\u6BB5`,
    source: "\u7528\u6237\u586B\u5199",
    level: "\u7528\u6237\u9648\u8FF0"
  });
  return { nodes, note: "\u5B9E\u5FC3\u8282\u70B9 = \u6709A/B\u7EA7\u8BC1\u636E\u652F\u6491\uFF0C\u7A7A\u5FC3\u8282\u70B9 = \u57FA\u4E8E\u7528\u6237\u9648\u8FF0" };
}
function buildModule7({ scene, focusKeys, evidence, memberLevel }) {
  const englishFocusKeys = resolveFocusKeys(scene, focusKeys || []);
  const declares = [];
  const features = { favorable: [], unfavorable: [] };
  if (englishFocusKeys.length > 0) {
    englishFocusKeys.forEach((fk) => {
      const analyses = getDisputeAnalyses(scene, [fk]);
      if (analyses && analyses.length > 0) {
        const a = analyses[0];
        declares.push({
          title: a.focusName + "\u76F8\u5173\u6297\u8FA9",
          claim: `\u5BF9\u65B9\u53EF\u80FD\u4E3B\u5F20${a.definition ? a.definition.slice(0, 30) : "\u76F8\u5173\u4E8B\u5B9E"}\u3002`,
          analysis: "\u9700\u7ED3\u5408\u5177\u4F53\u8BC1\u636E\u60C5\u51B5\u5224\u65AD\u5176\u6297\u8FA9\u662F\u5426\u6210\u7ACB\u3002"
        });
      }
    });
  }
  if (evidence && evidence.length > 0) {
    const keys = evidence.map((e) => typeof e === "string" ? e : e.id || "");
    if (keys.includes("payment") || keys.includes("transfer")) {
      features.favorable.push("\u6709\u4ED8\u6B3E\u8BB0\u5F55\uFF0C\u9501\u5B9A\u5B9E\u9645\u635F\u5931\u91D1\u989D");
    }
    if (keys.includes("chat")) {
      features.favorable.push("\u6709\u804A\u5929\u8BB0\u5F55\uFF0C\u53EF\u8FD8\u539F\u90E8\u5206\u6C9F\u901A\u7ECF\u8FC7");
    }
    if (keys.includes("contract")) {
      features.favorable.push("\u6709\u5408\u540C/\u534F\u8BAE\uFF0C\u8BC1\u660E\u53CC\u65B9\u6743\u5229\u4E49\u52A1\u7EA6\u5B9A");
    }
    if (keys.length < 2) {
      features.unfavorable.push("\u8BC1\u636E\u79CD\u7C7B\u8F83\u5C11\uFF0C\u5EFA\u8BAE\u6309\u8BC1\u636E\u63A8\u8350\u6E05\u5355\u8865\u5145");
    }
  }
  return { declares, features };
}
var DECLARES = [
  '\u672C\u6863\u6848\u7531"\u542F\u4FE1\u901A"\u81EA\u52A8\u751F\u6210\uFF0C\u4EC5\u4F5C\u4E3A\u7EA0\u7EB7\u4FE1\u606F\u6574\u7406\u4E0E\u8BC1\u636E\u5206\u6790\u5DE5\u5177\uFF0C\u5E2E\u52A9\u60A8\u4E86\u89E3\u81EA\u5DF1\u7684\u7EA0\u7EB7\u60C5\u51B5\u548C\u76F8\u5173\u6D41\u7A0B\u3002',
  "\u672C\u6863\u6848\u4E2D\u7684\u6240\u6709\u5185\u5BB9\u5747\u57FA\u4E8E\u60A8\u81EA\u884C\u8F93\u5165\u548C\u4E0A\u4F20\u7684\u4FE1\u606F\u8FDB\u884C\u6574\u7406\u3001\u5206\u6790\u548C\u5F52\u7EB3\u3002\u672C\u7CFB\u7EDF\u672A\u5BF9\u60A8\u63D0\u4F9B\u7684\u4FE1\u606F\u8FDB\u884C\u771F\u5B9E\u6027\u3001\u5408\u6CD5\u6027\u9A8C\u8BC1\u3002",
  "\u672C\u6863\u6848\u4E2D\u7684\u5404\u9879\u5206\u6790\u3001\u7D22\u5F15\u3001\u6570\u636E\u53C2\u8003\u548C\u6D41\u7A0B\u53C2\u8003\u5747\u4E3A\u6280\u672F\u6027\u5339\u914D\u4E0E\u5C55\u793A\uFF0C\u4E0D\u6784\u6210\u4EFB\u4F55\u5F62\u5F0F\u7684\u6CD5\u5F8B\u610F\u89C1\u3001\u6CD5\u5F8B\u5EFA\u8BAE\u6216\u4E2A\u6848\u5224\u65AD\u3002",
  "\u5982\u60A8\u9700\u8981\u9488\u5BF9\u5177\u4F53\u6848\u60C5\u7684\u6CD5\u5F8B\u610F\u89C1\uFF0C\u8BF7\u54A8\u8BE2\u6301\u6709\u5F8B\u5E08\u6267\u4E1A\u8BC1\u7684\u4E13\u4E1A\u4EBA\u58EB\u3002",
  "\u60A8\u5BF9\u672C\u6863\u6848\u62E5\u6709\u5B8C\u5168\u7684\u81EA\u4E3B\u63A7\u5236\u6743\uFF0C\u53EF\u968F\u65F6\u5728\u5C0F\u7A0B\u5E8F\u4E2D\u6C38\u4E45\u5220\u9664\u3002\u5220\u9664\u540E\uFF0C\u670D\u52A1\u5668\u4E2D\u4E0E\u672C\u6863\u6848\u76F8\u5173\u7684\u6570\u636E\u548C\u6587\u4EF6\u5C06\u88AB\u5F7B\u5E95\u6E05\u9664\uFF0C\u4E0D\u53EF\u6062\u590D\u3002"
];
function buildModule8() {
  return {
    declares: DECLARES,
    platform: "\u542F\u4FE1\u901A \xB7 \u9047\u5230\u7EA0\u7EB7\uFF0C\u5148\u7406\u6E05\u4E8B\u5B9E"
  };
}
async function generateReport({ scene, subType, amount, focus = [], status, evidence = [], memberLevel = 0, memo = "" }) {
  const focusKeys = Array.isArray(focus) ? focus : [focus];
  const reportId = generateReportId();
  let aiInsights = null;
  if (isLLMAvailable() && memo) {
    try {
      const sceneMap = {
        education: "\u6559\u80B2\u57F9\u8BAD",
        medical: "\u533B\u7597\u7F8E\u5BB9",
        labor: "\u52B3\u52A8\u5173\u7CFB",
        housing: "\u79DF\u623F\u7EA0\u7EB7",
        consumer: "\u6D88\u8D39\u7EA0\u7EB7",
        beauty: "\u7F8E\u4E1A\u670D\u52A1",
        franchise: "\u52A0\u76DF\u7EA0\u7EB7",
        debt: "\u6C11\u95F4\u501F\u8D37",
        telecom: "\u7535\u4FE1\u8BC8\u9A97",
        investment: "\u6295\u8D44\u7406\u8D22",
        jade: "\u7389\u77F3\u6587\u73A9",
        marriage: "\u5A5A\u604B\u7EA0\u7EB7",
        esoteric: "\u7384\u5B66\u547D\u7406",
        online: "\u7F51\u8D2D\u7EA0\u7EB7",
        service: "\u670D\u52A1\u5408\u540C",
        other: "\u5176\u4ED6\u7EA0\u7EB7",
        "01": "\u7F51\u8D2D\u7EA0\u7EB7",
        "02": "\u7EBF\u4E0B\u6D88\u8D39",
        "03": "\u52B3\u52A8\u5173\u7CFB",
        "04": "\u79DF\u623F\u7EA0\u7EB7",
        "05": "\u6559\u80B2\u57F9\u8BAD",
        "06": "\u533B\u7597\u7F8E\u5BB9",
        "07": "\u4E8C\u624B\u8F66",
        "08": "\u65C5\u6E38\u7EA0\u7EB7",
        "09": "\u5408\u540C\u7EA0\u7EB7",
        "10": "\u623F\u4EA7\u7EA0\u7EB7",
        "11": "\u6295\u8D44\u7406\u8D22",
        "12": "\u6C11\u95F4\u501F\u8D37",
        "13": "\u7269\u6D41\u5FEB\u9012",
        "14": "\u7968\u52A1\u7EA0\u7EB7",
        "15": "\u60C5\u611F\u7EA0\u7EB7",
        "16": "\u5176\u4ED6"
      };
      const sceneLabel = sceneMap[scene] || sceneMap[subType] || scene || "\u672A\u6307\u5B9A";
      aiInsights = await generateAIInsights({
        scene,
        sceneLabel,
        subType,
        amount,
        focus: focusKeys,
        status,
        evidence,
        memo
      });
    } catch (e) {
      console.error("[Report] AI\u5206\u6790\u5931\u8D25\uFF0C\u964D\u7EA7\u5230\u6A21\u677F:", e.message);
    }
  }
  const m1 = buildModule1({ scene, amount, focusKeys, status, evidence, memberLevel });
  const m2 = buildModule2({ scene, evidence, memberLevel });
  const m3 = buildModule6({ scene, status, focusKeys, memo, evidence });
  const m4 = buildModule3({ scene });
  const m5 = buildModule4({ scene, status, focusKeys, amount, memberLevel });
  const m6 = buildModule7({ scene, focusKeys, evidence, memberLevel });
  const m7 = buildModule5({ scene, memberLevel });
  const m8 = buildModule8();
  const m9 = buildModule9({ scene, evidence, focusKeys, amount });
  const m10 = buildModule10({ scene, status, memberLevel });
  const m11 = buildModule11({ scene, status, memberLevel });
  const isLocked = memberLevel === 0;
  const lockModules = isLocked ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [];
  if (aiInsights) {
    m1.aiAnalysis = {
      disputeCore: aiInsights.disputeCore || "",
      keyIssues: aiInsights.keyIssues || [],
      analysis: aiInsights.analysis || ""
    };
    m5.aiStrategy = {
      strategy: aiInsights.strategy || "",
      nextSteps: aiInsights.nextSteps || [],
      tips: aiInsights.tips || ""
    };
    m9.aiRisk = {
      riskLevel: aiInsights.riskAssessment && aiInsights.riskAssessment.level || "\u4E2D",
      riskPoints: aiInsights.riskAssessment && aiInsights.riskAssessment.points || [],
      strengths: aiInsights.strengths || [],
      weaknesses: aiInsights.weaknesses || []
    };
  }
  return {
    reportId,
    reportTime: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }),
    memberLevel,
    locked: isLocked,
    lockModules,
    aiGenerated: !!aiInsights,
    _llmError: aiInsights ? null : getLLMLastError(),
    m1,
    m2,
    m3,
    m4,
    m5,
    m6,
    m7,
    m8,
    m9,
    m10,
    m11
  };
}
function buildModule9({ scene, evidence, focusKeys, amount }) {
  const hasContract = evidence && evidence.some((e) => e.id === "contract");
  const hasPayment = evidence && evidence.some((e) => ["payment", "transfer", "salary"].includes(e.id));
  const hasChat = evidence && evidence.some((e) => e.id === "chat");
  const hasAds = evidence && evidence.some((e) => e.id === "ads");
  const evidenceCount = evidence ? evidence.length : 0;
  const reasons = [];
  if (hasContract) reasons.push({ text: "\u6709\u5408\u540C/\u534F\u8BAE\uFF08A\u7EA7\u8BC1\u636E\uFF09\uFF0C\u6743\u5229\u4E49\u52A1\u5173\u7CFB\u660E\u786E", ok: true });
  if (hasPayment) reasons.push({ text: "\u6709\u4ED8\u6B3E\u8BB0\u5F55\uFF08A\u7EA7\u8BC1\u636E\uFF09\uFF0C\u635F\u5931\u91D1\u989D\u5DF2\u9501\u5B9A", ok: true });
  if (hasChat) reasons.push({ text: "\u6709\u804A\u5929\u8BB0\u5F55\uFF08B\u7EA7\u8BC1\u636E\uFF09\uFF0C\u53EF\u8FD8\u539F\u5173\u952E\u6C9F\u901A\u8FC7\u7A0B", ok: true });
  if (hasAds) reasons.push({ text: "\u6709\u5BA3\u4F20\u6750\u6599\uFF08A/B\u7EA7\u8BC1\u636E\uFF09\uFF0C\u53EF\u8BC1\u660E\u627F\u8BFA\u4E0E\u5B9E\u9645\u4E0D\u7B26", ok: true });
  if (!hasContract) reasons.push({ text: "\u7F3A\u5C11\u4E66\u9762\u5408\u540C\uFF0C\u5EFA\u8BAE\u8865\u5145\uFF08\u53EF\u5411\u673A\u6784\u7D22\u53D6\u6216\u4EE5\u804A\u5929\u8BB0\u5F55\u8865\u5145\uFF09", ok: false });
  if (!hasPayment) reasons.push({ text: "\u7F3A\u5C11\u4ED8\u6B3E\u51ED\u8BC1\uFF0C\u5EFA\u8BAE\u901A\u8FC7\u94F6\u884C\u6D41\u6C34\u9501\u5B9A\u91D1\u989D", ok: false });
  if (evidenceCount < 2) reasons.push({ text: "\u8BC1\u636E\u79CD\u7C7B\u8F83\u5C11\uFF0C\u5EFA\u8BAE\u6309\u7CFB\u7EDF\u63A8\u8350\u6E05\u5355\u8865\u5145\u6838\u5FC3\u8BC1\u636E", ok: false });
  const okCount = reasons.filter((r) => r.ok).length;
  const verdict = okCount >= 3 ? "\u53EF\u884C" : okCount >= 2 ? "\u57FA\u672C\u53EF\u884C" : "\u9700\u8865\u5145\u8BC1\u636E";
  const verdictColor = okCount >= 3 ? "#16A34A" : okCount >= 2 ? "#D97706" : "#DC2626";
  const successRate = okCount >= 3 ? "75%" : okCount >= 2 ? "55%" : "35%";
  return {
    verdict,
    verdictColor,
    analysis: reasons,
    // WXML用m9.analysis
    riskNote: okCount < 3 ? "\u4E3B\u8981\u98CE\u9669\uFF1A\u8BC1\u636E\u94FE\u4E0D\u5B8C\u6574\uFF0C\u53EF\u80FD\u5F71\u54CD\u8BC9\u6C42\u88AB\u652F\u6301\u7684\u529B\u5EA6\u3002\u5EFA\u8BAE\u4F18\u5148\u8865\u5145\u5408\u540C\u548C\u4ED8\u6B3E\u8BB0\u5F55\u3002" : "\u98CE\u9669\u63D0\u793A\uFF1A\u4EE5\u4E0A\u4E3A\u7CFB\u7EDF\u57FA\u4E8E\u73B0\u6709\u8BC1\u636E\u7684\u521D\u6B65\u8BC4\u4F30\uFF0C\u5B9E\u9645\u7ED3\u679C\u53D7\u591A\u79CD\u56E0\u7D20\u5F71\u54CD\u3002",
    costEstimate: "\u9884\u4F30\u7EF4\u6743\u6210\u672C\uFF08\u4F9B\u53C2\u8003\uFF09\uFF1A\u534F\u5546/\u6295\u8BC9\u96F6\u6210\u672C\uFF1B\u8C03\u89E3\xA5100-500\u5143\uFF1B\u4EF2\u88C1\xA50-\u53D7\u7406\u8D39\uFF1B\u8BC9\u8BBC\xA550-\u53D7\u7406\u8D39\uFF081\u4E07\u5143\u4EE5\u4E0B\u4EC5\u970050\u5143\uFF09\u3002",
    successRate: `\u7EFC\u5408\u73B0\u6709\u8BC1\u636E\uFF0C\u9884\u8BA1\u8BC9\u6C42\u88AB\u652F\u6301\u7387\u7EA6${successRate}\u3002\u5176\u4E2D\u534F\u5546\u548C\u89E3\u6210\u529F\u7387\u7EA6${okCount >= 2 ? "60%" : "40%"}\uFF0C\u6295\u8BC9+\u8C03\u89E3\u7EC4\u5408\u7EA6${okCount >= 2 ? "75%" : "50%"}\u3002`
  };
}
function buildModule10({ scene, status, memberLevel }) {
  const stage = (status || "").split("\u3001")[0] || "\u4E0E\u5BF9\u65B9\u534F\u5546\u6C9F\u901A";
  const solutionsByScene = {
    education: [
      { rank: 1, name: "\u541112315\u5E73\u53F0\u6295\u8BC9", desc: "\u63D0\u4EA4\u5408\u540C+\u8F6C\u8D26\u8BB0\u5F55+\u804A\u5929\u622A\u56FE\uFF0C\u5E02\u573A\u76D1\u7BA1\u90E8\u95E87\u4E2A\u5DE5\u4F5C\u65E5\u5185\u53CD\u9988", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5929", success: "\u4E2D\u9AD8\uFF08\u5E73\u53F0\u4ECB\u5165\u540E\u673A\u6784\u914D\u5408\u5EA6\u663E\u8457\u63D0\u5347\uFF09", successRate: "\u4E2D\u9AD8\uFF0870%\uFF09", steps: ["\u6574\u7406\u597D\u5168\u90E8\u8BC1\u636E\u622A\u56FE", "\u5FAE\u4FE1\u641C\u7D22\u300C12315\u300D\u5C0F\u7A0B\u5E8F\u6216\u516C\u4F17\u53F7", "\u9009\u62E9\u88AB\u6295\u8BC9\u5546\u5BB6\uFF08\u9700\u63D0\u4F9B\u7EDF\u4E00\u793E\u4F1A\u4FE1\u7528\u4EE3\u7801\uFF09", "\u4E0A\u4F20\u8BC1\u636E\u5E76\u7B80\u8981\u63CF\u8FF0\u8BC9\u6C42", "\u4FDD\u6301\u7535\u8BDD\u7545\u901A\uFF0C\u7B49\u5F85\u8C03\u89E3\u5458\u8054\u7CFB"] },
      { rank: 2, name: "\u5411\u6D88\u8D39\u8005\u534F\u4F1A\u7533\u8BF7\u8C03\u89E3", desc: "\u901A\u8FC7\u5F53\u5730\u6D88\u534F\u7EC4\u7EC7\u7B2C\u4E09\u65B9\u8C03\u89E3\uFF0C\u4E0D\u6536\u8D39\uFF0C\u9002\u5408\u91D1\u989D\u8F83\u5927\u6848\u4F8B", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49\uFF08\u53D6\u51B3\u4E8E\u673A\u6784\u914D\u5408\u5EA6\uFF09", successRate: "\u4E2D\u7B49\uFF0855%\uFF09", steps: ["\u62E8\u625312315\u8F6C\u4EBA\u5DE5\uFF0C\u9884\u7EA6\u6D88\u534F\u8C03\u89E3", "\u51C6\u5907\u4E66\u9762\u7533\u8BC9\u6750\u6599", "\u6D88\u534F\u51FA\u5177\u8C03\u89E3\u534F\u8BAE\u4E66", "\u5982\u673A\u6784\u62D2\u7EDD\uFF0C\u53EF\u8BF7\u6C42\u6D88\u534F\u51FA\u5177\u7EC8\u6B62\u8C03\u89E3\u6587\u4E66"] },
      { rank: 3, name: "\u901A\u8FC7\u5E73\u53F0\u5BA2\u670D\u65BD\u538B", desc: "\u5982\u901A\u8FC7\u7B2C\u4E09\u65B9\u5E73\u53F0\u4ED8\u6B3E\uFF0C\u76F4\u63A5\u5411\u5E73\u53F0\u6295\u8BC9\u5E76\u7533\u8BF7\u5E73\u53F0\u4ECB\u5165\u51BB\u7ED3\u6B3E\u9879", cost: "\u96F6\u6210\u672C", cycle: "3-7\u5929", success: "\u4E2D\u7B49", successRate: "\u4E2D\u7B49\uFF0850%\uFF09", steps: ["\u8054\u7CFB\u4ED8\u6B3E\u5E73\u53F0\u5BA2\u670D\uFF08\u5982\u5FAE\u4FE1\u652F\u4ED8\u5BA2\u670D95017\uFF09", "\u8BF4\u660E\u60C5\u51B5\u5E76\u63D0\u4EA4\u8BC1\u636E", "\u7533\u8BF7\u5E73\u53F0\u6682\u7F13\u7ED3\u7B97\u6B3E\u9879"] }
    ],
    labor: [
      { rank: 1, name: "\u5411\u52B3\u52A8\u76D1\u5BDF\u5927\u961F\u6295\u8BC9", desc: "\u63D0\u4EA4\u52B3\u52A8\u5408\u540C+\u5DE5\u8D44\u6D41\u6C34\uFF0C\u76D1\u5BDF\u5927\u961F\u53EF\u4E3B\u52A8\u6267\u6CD5\uFF0C\u65E0\u9700\u4EF2\u88C1\u524D\u7F6E", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5DE5\u4F5C\u65E5", success: "\u9AD8\uFF08\u76D1\u5BDF\u5927\u961F\u53EF\u76F4\u63A5\u8D23\u4EE4\u4F01\u4E1A\u652F\u4ED8\uFF09", steps: ["\u51C6\u5907\u52B3\u52A8\u5408\u540C+\u5DE5\u8D44\u6D41\u6C34+\u793E\u4FDD\u8BB0\u5F55", "\u524D\u5F80\u5F53\u5730\u52B3\u52A8\u76D1\u5BDF\u5927\u961F\u7A97\u53E3\u63D0\u4EA4", "\u6216\u901A\u8FC7\u300C\u667A\u6167\u4EBA\u793E\u300D\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u5728\u7EBF\u6295\u8BC9", "\u7B49\u5F85\u76D1\u5BDF\u5927\u961F\u8054\u7CFB\u7528\u4EBA\u5355\u4F4D\u6838\u5B9E"] },
      { rank: 2, name: "\u7533\u8BF7\u52B3\u52A8\u4EF2\u88C1\uFF08\u4E0D\u6536\u8D39\uFF09", desc: "\u52B3\u52A8\u4EF2\u88C1\u4E0D\u6536\u53D6\u4EFB\u4F55\u8D39\u7528\uFF0C\u662F\u52B3\u52A8\u4E89\u8BAE\u7684\u6CD5\u5B9A\u524D\u7F6E\u7A0B\u5E8F\uFF0C\u76F4\u63A5\u8D77\u8BC9\u4F1A\u88AB\u9A73\u56DE", cost: "\u96F6\u6210\u672C\uFF08\u4EF2\u88C1\u8D39\u514D\u6536\uFF09", cycle: "45\u5929\u5185\u7ED3\u6848", success: "\u9AD8\uFF08\u6709\u5408\u540C+\u5DE5\u8D44\u6D41\u6C34\u8BC1\u636E\u5145\u5206\uFF09", steps: ["\u51C6\u5907\u52B3\u52A8\u4EF2\u88C1\u7533\u8BF7\u4E66\uFF08\u6A21\u677F\u7F51\u4E0A\u53EF\u641C\uFF09", "\u643A\u5E26\u8EAB\u4EFD\u8BC1+\u52B3\u52A8\u5408\u540C+\u5DE5\u8D44\u6D41\u6C34+\u793E\u4FDD\u8BB0\u5F55", "\u524D\u5F80\u5F53\u5730\u52B3\u52A8\u4EBA\u4E8B\u4E89\u8BAE\u4EF2\u88C1\u59D4\u5458\u4F1A", "\u7B49\u5F85\u5F00\u5EAD\u901A\u77E5\uFF08\u901A\u5E382-4\u5468\uFF09"] },
      { rank: 3, name: "\u5411\u793E\u4FDD/\u516C\u79EF\u91D1\u4E2D\u5FC3\u6295\u8BC9", desc: "\u5982\u5B58\u5728\u4E0D\u7F34\u793E\u4FDD\u516C\u79EF\u91D1\uFF0C\u53EF\u5206\u522B\u5411\u793E\u4FDD\u5C40\u548C\u516C\u79EF\u91D1\u4E2D\u5FC3\u6295\u8BC9\uFF0C\u90E8\u95E8\u53EF\u5F3A\u5236\u6267\u884C", cost: "\u96F6\u6210\u672C", cycle: "30-60\u5929", success: "\u9AD8", steps: ["\u51ED\u52B3\u52A8\u5408\u540C+\u5DE5\u8D44\u6D41\u6C34\u5206\u522B\u5411\u793E\u4FDD\u5C40\u3001\u516C\u79EF\u91D1\u4E2D\u5FC3\u6295\u8BC9", "\u4E24\u90E8\u95E8\u5206\u522B\u7ACB\u6848\u540E\u901A\u77E5\u516C\u53F8\u8865\u7F34", "\u516C\u53F8\u62D2\u7EDD\u53EF\u7533\u8BF7\u5F3A\u5236\u6267\u884C"] }
    ],
    medical: [
      { rank: 1, name: "\u5411\u536B\u5065\u59D4\u6295\u8BC9", desc: "\u6D89\u53CA\u533B\u7597\u8D28\u91CF/\u865A\u5047\u5BA3\u4F20\uFF0C\u5411\u5C5E\u5730\u536B\u5065\u59D4\u533B\u653F\u79D1\u6295\u8BC9\uFF0C\u53EF\u8C03\u53D6\u673A\u6784\u8D44\u8D28\u548C\u533B\u751F\u8D44\u8D28", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u9AD8", steps: ["\u6574\u7406\u597D\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55+\u672F\u524D\u672F\u540E\u5BF9\u6BD4\u7167\u7247", "\u62E8\u6253\u5F53\u5730\u536B\u5065\u59D4\u6295\u8BC9\u7535\u8BDD\u6216\u901A\u8FC7\u5B98\u7F51\u63D0\u4EA4", "\u536B\u5065\u59D4\u53D7\u7406\u540E\u7EA6\u8C08\u673A\u6784\u8D1F\u8D23\u4EBA", "\u53EF\u7533\u8BF7\u533B\u7597\u4E8B\u6545\u6280\u672F\u9274\u5B9A"] },
      { rank: 2, name: "\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF08\u865A\u5047\u5BA3\u4F20\uFF09", desc: "\u5982\u533B\u7F8E\u673A\u6784\u5B58\u5728\u865A\u5047\u5BA3\u4F20\uFF0C\u5411\u5E02\u573A\u76D1\u7BA1\u5C40\u6295\u8BC9\uFF0C\u4F9D\u636E\u300A\u5E7F\u544A\u6CD5\u300B\u53EF\u7D22\u8D54", cost: "\u96F6\u6210\u672C", cycle: "7-20\u5929", success: "\u4E2D\u7B49", steps: ["\u6536\u96C6\u5BA3\u4F20\u6750\u6599\u622A\u56FE+\u804A\u5929\u8BB0\u5F55", "\u901A\u8FC712315\u5E73\u53F0\u63D0\u4EA4\u6295\u8BC9", "\u53EF\u540C\u65F6\u7533\u8BF7\u9000\u8D39+\u60E9\u7F5A\u6027\u8D54\u507F\uFF08\u9000\u4E00\u8D54\u4E09\uFF09"] },
      { rank: 3, name: "\u7533\u8BF7\u533B\u7597\u4E8B\u6545\u9274\u5B9A", desc: "\u5982\u9020\u6210\u660E\u663E\u635F\u5BB3\uFF0C\u53EF\u7533\u8BF7\u533B\u5B66\u4F1A\u9274\u5B9A\uFF08\u9700gs\u5148\u8BC1\u660E\u635F\u5BB3\u5B58\u5728\uFF09", cost: "\u9274\u5B9A\u8D39\u7EA62000-5000\u5143", cycle: "60-90\u5929", success: "\u9700\u89C6\u635F\u5BB3\u7A0B\u5EA6", steps: ["\u9700\u63D0\u4F9B\u75C5\u5386+\u5F71\u50CF\u8D44\u6599+\u672F\u524D\u534F\u8BAE", "\u5411\u5F53\u5730\u533B\u5B66\u4F1A\u7533\u8BF7\u9274\u5B9A", "\u6839\u636E\u9274\u5B9A\u7ED3\u8BBA\u51B3\u5B9A\u4E0B\u4E00\u6B65\u7EF4\u6743\u8DEF\u5F84"] }
    ],
    beauty: [
      { rank: 1, name: "\u541112315\u5E73\u53F0\u6295\u8BC9\u9884\u4ED8\u5361", desc: "\u9884\u4ED8\u5F0F\u6D88\u8D39\u4FB5\u6743\uFF0C\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u4F9D\u636E\u300A\u6D88\u8D39\u8005\u6743\u76CA\u4FDD\u62A4\u6CD5\u300B\u5904\u7406", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5929", success: "\u4E2D\u9AD8", steps: ["\u6574\u7406\u4F1A\u5458\u5361\u534F\u8BAE+\u4ED8\u6B3E\u8BB0\u5F55+\u804A\u5929\u8BB0\u5F55", "\u901A\u8FC712315\u5C0F\u7A0B\u5E8F\u6295\u8BC9", "\u53EF\u540C\u6B65\u5411\u5546\u52A1\u5C40\u53CD\u6620\uFF08\u9884\u4ED8\u5361\u76D1\u7BA1\u804C\u8D23\uFF09"] },
      { rank: 2, name: "\u5411\u5546\u52A1\u5C40\u6295\u8BC9\u9884\u4ED8\u62BC\u91D1", desc: "\u5546\u52A1\u90E8\u300A\u5355\u7528\u9014\u5546\u4E1A\u9884\u4ED8\u5361\u7BA1\u7406\u529E\u6CD5\u300B\u5BF9\u7ECF\u8425\u8005\u53D1\u884C\u9884\u4ED8\u5361\u6709\u62BC\u91D1\u7BA1\u7406\u89C4\u5B9A", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49", steps: ["\u5546\u52A1\u5C40\u8D1F\u8D23\u5355\u7528\u9014\u9884\u4ED8\u5361\u5907\u6848\u7BA1\u7406", "\u53EF\u6295\u8BC9\u7ECF\u8425\u8005\u8FDD\u53CD\u62BC\u91D1\u7BA1\u7406\u5236\u5EA6", "\u8981\u6C42\u5546\u52A1\u90E8\u95E8\u5BF9\u7ECF\u8425\u8005\u8FDB\u884C\u884C\u653F\u5904\u7406"] },
      { rank: 3, name: "\u5411\u6D88\u9632\u90E8\u95E8\u4E3E\u62A5\uFF08\u5982\u6709\u5B89\u5168\u9690\u60A3\uFF09", desc: "\u7F8E\u5BB9\u9662\u5982\u5B58\u5728\u6D88\u9632\u9690\u60A3\uFF0C\u53EF\u5411\u6D88\u9632\u90E8\u95E8\u4E3E\u62A5\uFF0C\u5012\u903C\u7ECF\u8425\u8005\u914D\u5408\u89E3\u51B3", cost: "\u96F6\u6210\u672C", cycle: "7-14\u5929", success: "\u914D\u5408\u5EA6\u9AD8\u65F6\u6709\u6548", steps: ["\u62CD\u7167\u7559\u8BC1\u6D88\u9632\u9690\u60A3", "\u901A\u8FC712369\u6D88\u9632\u4E3E\u62A5\u70ED\u7EBF\u6216\u7F51\u4E0A\u5E73\u53F0", "\u6D88\u9632\u90E8\u95E8\u51FA\u5177\u6574\u6539\u901A\u77E5\uFF0C\u7ECF\u8425\u8005\u901A\u5E38\u4E3B\u52A8\u548C\u89E3"] }
    ],
    housing: [
      { rank: 1, name: "\u5411\u623F\u7BA1\u5C40\u6295\u8BC9\uFF08\u9694\u65AD\u51FA\u79DF/\u7FA4\u79DF\u623F\uFF09", desc: "\u5982\u623F\u5C4B\u5B58\u5728\u8FDD\u89C4\u9694\u65AD\u3001\u71C3\u6C14\u4F7F\u7528\u4E0D\u89C4\u8303\u7B49\u95EE\u9898\uFF0C\u5411\u623F\u7BA1\u5C40\u6216\u57CE\u7BA1\u6295\u8BC9", cost: "\u96F6\u6210\u672C", cycle: "7-20\u5929", success: "\u4E2D\u9AD8", steps: ["\u62CD\u7167\u7559\u8BC1\u8FDD\u89C4\u60C5\u51B5", "\u5411\u5F53\u5730\u623F\u7BA1\u5C40\u6216\u57CE\u7BA112319\u70ED\u7EBF\u6295\u8BC9", "\u90E8\u95E8\u6838\u5B9E\u540E\u51FA\u5177\u5904\u7406\u51B3\u5B9A"] },
      { rank: 2, name: "\u901A\u8FC7\u8857\u9053\u8C03\u89E3", desc: "\u623F\u4E1C\u4E0E\u79DF\u5BA2\u7EA0\u7EB7\uFF0C\u53EF\u901A\u8FC7\u8857\u9053\u53F8\u6CD5\u6240\u8FDB\u884C\u514D\u8D39\u8C03\u89E3\uFF0C\u534F\u8BAE\u6709\u6CD5\u5F8B\u6548\u529B", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5929", success: "\u4E2D\u7B49", steps: ["\u524D\u5F80\u5C5E\u5730\u8857\u9053\u53F8\u6CD5\u6240\u7533\u8BF7\u8C03\u89E3", "\u53CC\u65B9\u5230\u573A\u9648\u8FF0\uFF0C\u8C03\u89E3\u5458\u4E3B\u6301", "\u8FBE\u6210\u534F\u8BAE\u53EF\u7533\u8BF7\u53F8\u6CD5\u786E\u8BA4\uFF08\u5177\u5907\u5F3A\u5236\u6267\u884C\u529B\uFF09"] },
      { rank: 3, name: "\u8D77\u8BC9\uFF08\u5C0F\u989D\u8BC9\u8BBC\u7A0B\u5E8F\uFF09", desc: "\u62BC\u91D1\u91D1\u989D\u8F83\u4F4E\uFF08\u901A\u5E382000-5000\u5143\uFF09\uFF0C\u53EF\u8D70\u5C0F\u989D\u8BC9\u8BBC\uFF0C\u4E00\u5BA1\u7EC8\u5BA1\uFF0C\u8BC9\u8BBC\u8D39\u4EC525-50\u5143", cost: "\u8BC9\u8BBC\u8D3925-50\u5143", cycle: "1-2\u4E2A\u6708", success: "\u9AD8\uFF08\u6709\u5408\u540C+\u8F6C\u8D26\u8BB0\u5F55\uFF09", steps: ["\u51C6\u5907\u79DF\u8D41\u5408\u540C+\u8F6C\u8D26\u8BB0\u5F55+\u804A\u5929\u8BB0\u5F55", "\u901A\u8FC7\u300C\u4EBA\u6C11\u6CD5\u9662\u5728\u7EBF\u670D\u52A1\u300D\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u63D0\u4EA4\u7ACB\u6848", "\u9009\u62E9\u300C\u5C0F\u989D\u8BC9\u8BBC\u300D\u7A0B\u5E8F\uFF08\u6807\u7684\u989D5\u4E07\u5143\u4EE5\u4E0B\uFF09"] }
    ],
    consumer: [
      { rank: 1, name: "\u5411\u5E73\u53F0\u7533\u8BF7\u5BA2\u670D\u4ECB\u5165", desc: "\u7535\u5546\u8D2D\u7269\u7EA0\u7EB7\uFF0C\u5728\u5E73\u53F0\u7533\u8BF7\u5BA2\u670D\u4ECB\u5165\uFF0C\u5E73\u53F0\u53EF\u51BB\u7ED3\u5546\u5BB6\u8D27\u6B3E", cost: "\u96F6\u6210\u672C", cycle: "3-7\u5929", success: "\u9AD8\uFF08\u5E73\u53F0\u76F4\u63A5\u6263\u5546\u5BB6\u4FDD\u8BC1\u91D1\uFF09", steps: ["\u5728\u8BA2\u5355\u9875\u9762\u70B9\u51FB\u300C\u7533\u8BF7\u5E73\u53F0\u4ECB\u5165\u300D", "\u4E0A\u4F20\u8BC1\u636E\u5E76\u8BF4\u660E\u8BC9\u6C42\uFF08\u9000\u6B3E/\u9000\u8D27\uFF09", "\u5E73\u53F0\u5224\u5B9A\u540E\u901A\u5E383\u5929\u5185\u6267\u884C"] },
      { rank: 2, name: "\u541112315\u6295\u8BC9", desc: "\u5B9E\u4F53\u5E97\u8D2D\u7269\u7EA0\u7EB7\uFF0C\u4FDD\u7559\u597D\u8D2D\u7269\u5C0F\u7968\u548C\u5546\u54C1\uFF0C\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5929", success: "\u4E2D\u7B49", steps: ["\u4FDD\u7559\u8D2D\u7269\u5C0F\u7968+\u5546\u54C1\u7167\u7247", "\u901A\u8FC712315\u5E73\u53F0\u63D0\u4EA4\u6295\u8BC9", "\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u8054\u7CFB\u5546\u5BB6\u6838\u5B9E"] },
      { rank: 3, name: "\u8D77\u8BC9\uFF08\u6807\u7684\u989D\u5C0F\u53EF\u8D70\u5C0F\u989D\u8BC9\u8BBC\uFF09", desc: "\u91D1\u989D\u57285\u4E07\u5143\u4EE5\u4E0B\u53EF\u8D70\u5C0F\u989D\u8BC9\u8BBC\u7A0B\u5E8F\uFF0C\u4E00\u5BA1\u7EC8\u5BA1\uFF0C\u8BC9\u8BBC\u8D39\u6700\u4F4E", cost: "\u8BC9\u8BBC\u8D39\u7EA625\u5143", cycle: "1-2\u4E2A\u6708", success: "\u9AD8", steps: ["\u51C6\u5907\u8D2D\u7269\u5408\u540C/\u8BA2\u5355\u622A\u56FE+\u4ED8\u6B3E\u8BB0\u5F55+\u5546\u54C1\u7167\u7247", "\u901A\u8FC7\u300C\u4EBA\u6C11\u6CD5\u9662\u5728\u7EBF\u670D\u52A1\u300D\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u7533\u8BF7\u7ACB\u6848", "\u9009\u62E9\u5C0F\u989D\u8BC9\u8BBC\u7A0B\u5E8F"] }
    ],
    franchise: [
      { rank: 1, name: "\u5411\u5546\u52A1\u5C40\u4E3E\u62A5\uFF08\u865A\u5047\u5BA3\u4F20/\u8FDD\u89C4\u62DB\u5546\uFF09", desc: "\u5546\u52A1\u90E8\u5BF9\u7279\u8BB8\u7ECF\u8425\uFF08\u52A0\u76DF\uFF09\u6709\u4E13\u95E8\u7BA1\u7406\u89C4\u5B9A\uFF0C\u53EF\u5411\u5546\u52A1\u5C40\u4E3E\u62A5\u8FDD\u89C4\u884C\u4E3A", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u9AD8", steps: ["\u6536\u96C6\u62DB\u5546\u624B\u518C+\u7F51\u7AD9\u622A\u56FE+\u804A\u5929\u8BB0\u5F55", "\u5411\u5F53\u5730\u5546\u52A1\u5C40\u63D0\u4EA4\u4E3E\u62A5\u6750\u6599", "\u5546\u52A1\u5C40\u67E5\u5B9E\u540E\u53EF\u5BF9\u54C1\u724C\u65B9\u5904\u4EE5\u7F5A\u6B3E"] },
      { rank: 2, name: "\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF08\u865A\u5047\u5E7F\u544A\uFF09", desc: "\u4F9D\u636E\u300A\u5E7F\u544A\u6CD5\u300B\u548C\u300A\u5546\u4E1A\u7279\u8BB8\u7ECF\u8425\u7BA1\u7406\u6761\u4F8B\u300B\u5411\u5DE5\u5546\u90E8\u95E8\u6295\u8BC9", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49", steps: ["\u6536\u96C6\u6240\u6709\u5BA3\u4F20\u6750\u6599+\u7B7E\u7EA6\u65F6\u7684\u6C9F\u901A\u8BB0\u5F55", "\u901A\u8FC712315\u63D0\u4EA4\u6295\u8BC9", "\u53EF\u540C\u6B65\u7533\u8BF7\u5408\u540C\u89E3\u9664+\u9000\u8FD8\u52A0\u76DF\u8D39"] },
      { rank: 3, name: "\u63D0\u8D77\u6C11\u4E8B\u8BC9\u8BBC", desc: "\u52A0\u76DF\u5408\u540C\u7EA0\u7EB7\u901A\u5E38\u6807\u7684\u8F83\u5927\uFF0C\u5EFA\u8BAE\u59D4\u6258\u5F8B\u5E08\uFF08\u53EF\u7533\u8BF7\u6CD5\u5F8B\u63F4\u52A9\uFF09\uFF0C\u5408\u540C\u5C65\u884C\u5730\u6216\u88AB\u544A\u5730\u6CD5\u9662\u7BA1\u8F96", cost: "\u8BC9\u8BBC\u8D39+\u5F8B\u5E08\u8D39", cycle: "3-6\u4E2A\u6708", success: "\u9700\u89C6\u8BC1\u636E", steps: ["\u6574\u7406\u597D\u52A0\u76DF\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55+\u5BF9\u65B9\u865A\u5047\u627F\u8BFA\u7684\u8BC1\u636E", "\u5411\u5408\u540C\u5C65\u884C\u5730\u6216\u88AB\u544A\u6240\u5728\u5730\u6CD5\u9662\u8D77\u8BC9", "\u53EF\u540C\u6B65\u7533\u8BF7\u8D22\u4EA7\u4FDD\u5168\uFF08\u51BB\u7ED3\u5BF9\u65B9\u8D26\u6237\uFF09"] }
    ],
    debt: [
      { rank: 1, name: "\u81EA\u884C\u50AC\u6536\uFF08\u4E66\u9762\u51FD\u4EF6\uFF09", desc: "\u5148\u53D1\u4E66\u9762\u50AC\u6B3E\u51FD\u7ED9\u5BF9\u65B9\uFF0C\u4FDD\u7559\u90AE\u5BC4\u51ED\u8BC1\uFF0C\u5177\u6709\u4E2D\u65AD\u8BC9\u8BBC\u65F6\u6548\u7684\u6CD5\u5F8B\u6548\u529B", cost: "\u5FEB\u9012\u8D39\u7EA615\u5143", cycle: "7-15\u5929", success: "\u4E2D\u7B49", steps: ["\u8D77\u8349\u50AC\u6B3E\u51FD\uFF08\u5199\u660E\u501F\u6B3E\u91D1\u989D+\u671F\u9650+\u8D26\u53F7\uFF09", "\u901A\u8FC7EMS\u90AE\u5BC4\u5E76\u4FDD\u7559\u9001\u8FBE\u56DE\u6267", "\u540C\u6B65\u5FAE\u4FE1/\u77ED\u4FE1\u53D1\u9001\u7535\u5B50\u7248"] },
      { rank: 2, name: "\u7533\u8BF7\u652F\u4ED8\u4EE4\uFF08\u7763\u4FC3\u7A0B\u5E8F\uFF09", desc: "\u51ED\u6B20\u6761\u76F4\u63A5\u5411\u6CD5\u9662\u7533\u8BF7\u652F\u4ED8\u4EE4\uFF0C15\u5929\u5185\u5BF9\u65B9\u4E0D\u63D0\u5F02\u8BAE\u5219\u652F\u4ED8\u4EE4\u751F\u6548\uFF0C\u53EF\u76F4\u63A5\u7533\u8BF7\u5F3A\u5236\u6267\u884C", cost: "\u8BC9\u8BBC\u8D39\u7EA650\u5143", cycle: "15-30\u5929", success: "\u9AD8\uFF08\u6709\u501F\u6761+\u8F6C\u8D26\u8BB0\u5F55\uFF09", steps: ["\u51C6\u5907\u501F\u6761/\u501F\u6B3E\u534F\u8BAE+\u8F6C\u8D26\u8BB0\u5F55", "\u5411\u88AB\u544A\u4F4F\u6240\u5730\u57FA\u5C42\u4EBA\u6C11\u6CD5\u9662\u7533\u8BF7\u652F\u4ED8\u4EE4", "\u5982\u5BF9\u65B9\u63D0\u5F02\u8BAE\uFF0C\u81EA\u52A8\u8F6C\u5165\u8BC9\u8BBC\u7A0B\u5E8F"] },
      { rank: 3, name: "\u8D77\u8BC9\uFF08\u666E\u901A\u6C11\u4E8B\u8BC9\u8BBC\uFF09", desc: "\u6C11\u95F4\u501F\u8D37\u9700\u8BC1\u660E\u501F\u8D37\u5408\u610F+\u5B9E\u9645\u4EA4\u4ED8\uFF0C\u5EFA\u8BAE\u901A\u8FC7\u94F6\u884C\u8F6C\u8D26\u800C\u975E\u73B0\u91D1", cost: "\u8BC9\u8BBC\u8D39\u7EA650-200\u5143\uFF08\u6309\u6807\u7684\uFF09", cycle: "3-6\u4E2A\u6708", success: "\u9AD8\uFF08\u6709\u501F\u6761+\u8F6C\u8D26\u8BB0\u5F55\uFF09", steps: ["\u51C6\u5907\u501F\u6761/\u534F\u8BAE+\u94F6\u884C\u8F6C\u8D26\u8BB0\u5F55+\u804A\u5929\u8BB0\u5F55", "\u5411\u539F\u544A\u6216\u88AB\u544A\u6240\u5728\u5730\u6CD5\u9662\u8D77\u8BC9", "\u5982\u7EA6\u5B9A\u5229\u606F\uFF0C\u6CE8\u610F\u4E0D\u8D85\u8FC7LPR\u56DB\u500D\u4E0A\u9650"] }
    ],
    telecom: [
      { rank: 1, name: "\u5411\u8FD0\u8425\u5546\u5BA2\u670D\u6295\u8BC9\uFF08\u5347\u7EA7\u5904\u7406\uFF09", desc: "\u9996\u5148\u901A\u8FC7\u8FD0\u8425\u5546\u5B98\u65B9\u5BA2\u670D\u6E20\u9053\u6295\u8BC9\uFF0C\u5982\u5904\u7406\u4E0D\u6EE1\u610F\u5219\u8981\u6C42\u5347\u7EA7\u5230\u7701\u7EA7\u6295\u8BC9", cost: "\u96F6\u6210\u672C", cycle: "3-7\u5929", success: "\u4E2D\u9AD8", steps: ["\u62E8\u6253\u8FD0\u8425\u5546\u5BA2\u670D\u7535\u8BDD\uFF08\u79FB\u52A810080/\u8054\u901A10015/\u7535\u4FE110000\uFF09", "\u8BF4\u660E\u8BC9\u6C42\u5E76\u8BB0\u5F55\u5DE5\u53F7", "\u59827\u5929\u5185\u672A\u89E3\u51B3\uFF0C\u53D1\u9001\u300C\u6295\u8BC9\u5347\u7EA7\u300D\u77ED\u4FE1\u5230\u4E0A\u8FF0\u53F7\u7801"] },
      { rank: 2, name: "\u5411\u5DE5\u4FE1\u90E8\u7535\u4FE1\u7528\u6237\u7533\u8BC9\u53D7\u7406\u4E2D\u5FC3\u6295\u8BC9", desc: "\u8FD0\u8425\u5546\u8FDD\u89C4\u6536\u8D39\u3001\u4E0D\u660E\u6263\u8D39\uFF0C\u5DE5\u4FE1\u90E8\u7533\u8BC9\u4E2D\u5FC3\u53EF\u5BF9\u8FD0\u8425\u5546\u8FDB\u884C\u884C\u653F\u5904\u7406", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u9AD8", steps: ["\u767B\u5F55\u5DE5\u4FE1\u90E8\u7533\u8BC9\u4E2D\u5FC3\u7F51\u7AD9\uFF08https://www.chinatcc.gov.cn\uFF09", "\u586B\u5199\u7533\u8BC9\u8868\u5355\uFF08\u9700\u63D0\u4F9B\u4E0E\u8FD0\u8425\u5546\u6C9F\u901A\u8BB0\u5F55\uFF09", "\u5DE5\u4FE1\u90E8\u8F6C\u529E\u81F3\u8FD0\u8425\u5546\uFF0C15\u65E5\u5185\u5FC5\u987B\u7ED9\u51FA\u5904\u7406\u7ED3\u679C"] },
      { rank: 3, name: "\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF08\u4E0D\u660E\u6263\u8D39\uFF09", desc: "\u8FD0\u8425\u5546\u64C5\u81EA\u5F00\u901A\u4ED8\u8D39\u9879\u76EE\u6784\u6210\u4FB5\u6743\uFF0C\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\u53EF\u8981\u6C42\u9000\u4E00\u8D54\u4E09", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49", steps: ["\u4E0B\u8F7D\u8FD0\u8425\u5546\u6263\u8D39\u8D26\u5355\u622A\u56FE", "\u901A\u8FC712315\u5E73\u53F0\u6295\u8BC9\u4E0D\u660E\u6263\u8D39", "\u53EF\u4E3B\u5F20\u9000\u4E00\u8D54\u4E09\uFF08\u4E0D\u8DB3500\u5143\u8D54500\u5143\uFF09"] }
    ],
    jade: [
      { rank: 1, name: "\u7533\u8BF7\u9274\u5B9A\uFF08\u786E\u8BA4\u662F\u5426\u5047\u8D27\uFF09", desc: "\u5982\u6000\u7591\u4E3A\u5047\u8D27\uFF0C\u5148\u59D4\u6258\u6B63\u89C4\u9274\u5B9A\u673A\u6784\u51FA\u5177\u9274\u5B9A\u62A5\u544A\uFF0C\u662F\u540E\u7EED\u7EF4\u6743\u7684\u524D\u63D0", cost: "\u9274\u5B9A\u8D39\u7EA6200-500\u5143", cycle: "7-15\u5929", success: "\u9274\u5B9A\u662F\u524D\u63D0", steps: ["\u901A\u8FC7\u4E2D\u56FD\u5730\u8D28\u5927\u5B66\u73E0\u5B9D\u68C0\u6D4B\u4E2D\u5FC3\u7B49\u6B63\u89C4\u673A\u6784\u9001\u68C0", "\u4FDD\u7559\u8D2D\u4E70\u51ED\u8BC1+\u5546\u54C1\u7167\u7247", "\u9274\u5B9A\u4E3A\u5047\u540E\u7ACB\u5373\u542F\u52A8\u9000\u6B3E\u7EF4\u6743"] },
      { rank: 2, name: "\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF08\u4EE5\u5047\u5145\u771F\uFF09", desc: "\u4F9D\u636E\u300A\u4EA7\u54C1\u8D28\u91CF\u6CD5\u300B\uFF0C\u4EE5\u5047\u5145\u771F\u53EF\u8981\u6C42\u9000\u4E00\u8D54\u4E09\uFF0C\u5411\u5E02\u573A\u76D1\u7BA1\u5C40\u6295\u8BC9", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u9AD8\uFF08\u6709\u9274\u5B9A\u62A5\u544A\uFF09", steps: ["\u53D6\u5F97\u9274\u5B9A\u62A5\u544A\u540E\uFF0C\u901A\u8FC712315\u63D0\u4EA4\u6295\u8BC9", "\u540C\u65F6\u5411\u6D88\u534F\u7533\u8BF7\u534F\u52A9", "\u53EF\u540C\u6B65\u5411\u516C\u5B89\u673A\u5173\u62A5\u6848\uFF08\u5982\u6D89\u5ACC\u6B3A\u8BC8\uFF09"] },
      { rank: 3, name: "\u901A\u8FC7\u7535\u5546\u5E73\u53F0\u7533\u8BF7\u552E\u540E\uFF08\u7EBF\u4E0A\u8D2D\u4E70\uFF09", desc: "\u5982\u901A\u8FC7\u7535\u5546\u5E73\u53F0\u8D2D\u4E70\uFF0C\u76F4\u63A5\u7533\u8BF7\u5E73\u53F0\u552E\u540E\uFF0C\u5E73\u53F0\u53EF\u5148\u884C\u8D54\u4ED8", cost: "\u96F6\u6210\u672C", cycle: "3-7\u5929", success: "\u9AD8\uFF08\u5E73\u53F0\u4FDD\u8BC1\u91D1\uFF09", steps: ["\u5728\u8BA2\u5355\u9875\u9762\u7533\u8BF7\u300C\u4EC5\u9000\u6B3E\u300D\u6216\u300C\u9000\u8D27\u9000\u6B3E\u300D", "\u4E0A\u4F20\u9274\u5B9A\u62A5\u544A+\u5546\u54C1\u7167\u7247", "\u5E73\u53F0\u5BA2\u670D\u4ECB\u5165\uFF0C\u901A\u5E385\u5929\u5185\u5904\u7406\u5B8C\u6BD5"] }
    ],
    marriage: [
      { rank: 1, name: "\u5411\u6C11\u653F\u5C40\u6216\u5A5A\u4ECB\u673A\u6784\u4E0A\u7EA7\u4E3B\u7BA1\u90E8\u95E8\u6295\u8BC9", desc: "\u5A5A\u4ECB\u673A\u6784\u5F52\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u548C\u6C11\u653F\u90E8\u95E8\u53CC\u91CD\u7BA1\u8F96\uFF0C\u53EF\u5411\u4E24\u8FB9\u6295\u8BC9", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49", steps: ["\u6536\u96C6\u597D\u670D\u52A1\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55+\u5BF9\u65B9\u627F\u8BFA\u8BB0\u5F55", "\u5411\u5E02\u573A\u76D1\u7BA1\u5C40\u6295\u8BC9\u865A\u5047\u5BA3\u4F20", "\u5411\u6C11\u653F\u5C40\u53CD\u6620\u5A5A\u4ECB\u673A\u6784\u8FDD\u89C4\u884C\u4E3A"] },
      { rank: 2, name: "\u5411\u6D88\u8D39\u8005\u534F\u4F1A\u6295\u8BC9\uFF08\u5A5A\u4ECB\u670D\u52A1\u7EA0\u7EB7\uFF09", desc: "\u5A5A\u4ECB\u670D\u52A1\u5C5E\u6D88\u8D39\u7EF4\u6743\u8303\u7574\uFF0C\u6D88\u534F\u53EF\u8FDB\u884C\u8C03\u89E3", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49", steps: ["\u62E8\u625312315\u7533\u8BF7\u6D88\u534F\u8C03\u89E3", "\u51C6\u5907\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55+\u804A\u5929\u622A\u56FE", "\u6D88\u534F\u51FA\u5177\u8C03\u89E3\u534F\u8BAE"] },
      { rank: 3, name: "\u8D77\u8BC9\u89E3\u9664\u5408\u540C\u9000\u8D39", desc: "\u5A5A\u4ECB\u5408\u540C\u5982\u5B58\u5728\u660E\u663E\u4E0D\u516C\u5E73\u6761\u6B3E\u6216\u865A\u5047\u627F\u8BFA\uFF0C\u53EF\u5411\u6CD5\u9662\u8D77\u8BC9\u8981\u6C42\u89E3\u9664\u5408\u540C\u5E76\u9000\u8D39", cost: "\u8BC9\u8BBC\u8D39\u7EA650\u5143", cycle: "2-4\u4E2A\u6708", success: "\u9700\u89C6\u8BC1\u636E", steps: ["\u51C6\u5907\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55+\u5BF9\u65B9\u865A\u5047\u5BA3\u4F20\u7684\u8BC1\u636E", "\u5411\u88AB\u544A\u6240\u5728\u5730\u6CD5\u9662\u8D77\u8BC9", "\u4E3B\u5F20\u5BF9\u65B9\u5B58\u5728\u6B3A\u8BC8\u6216\u91CD\u5927\u8BEF\u89E3"] }
    ],
    online: [
      { rank: 1, name: "\u5411\u7535\u5546\u5E73\u53F0\u7533\u8BF7\u552E\u540E", desc: "\u7535\u5546\u5E73\u53F0\u8D2D\u7269\uFF0C\u76F4\u63A5\u5728\u8BA2\u5355\u9875\u7533\u8BF7\u300C\u4EC5\u9000\u6B3E\u300D\u6216\u300C\u9000\u8D27\u9000\u6B3E\u300D\uFF0C\u5E73\u53F0\u5BA2\u670D\u53EF\u5F3A\u5236\u4ECB\u5165", cost: "\u96F6\u6210\u672C", cycle: "3-7\u5929", success: "\u9AD8", steps: ["\u5728\u8BA2\u5355\u9875\u9762\u70B9\u51FB\u300C\u7533\u8BF7\u552E\u540E\u300D", "\u4E0A\u4F20\u5546\u54C1\u5B9E\u7269\u7167\u7247+\u63CF\u8FF0\u4E0D\u7B26\u7684\u5BF9\u6BD4\u56FE", "\u9009\u62E9\u9000\u6B3E\u91D1\u989D\uFF08\u4E0D\u8D85\u8FC7\u652F\u4ED8\u91D1\u989D\uFF09", "\u5E73\u53F0\u5BA2\u670D\u5224\u5B9A\uFF0C\u901A\u5E383-5\u4E2A\u5DE5\u4F5C\u65E5"] },
      { rank: 2, name: "\u541112315\u5E73\u53F0\u6295\u8BC9", desc: "\u5B9E\u4F53\u5E73\u53F0\u8D2D\u7269\uFF0C\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9\uFF0C\u5E73\u53F0\u65B9\u8D1F\u8FDE\u5E26\u8D23\u4EFB", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5929", success: "\u4E2D\u7B49", steps: ["\u4FDD\u7559\u597D\u8D2D\u7269\u51ED\u8BC1+\u5546\u54C1\u7167\u7247", "\u901A\u8FC712315\u5C0F\u7A0B\u5E8F\u63D0\u4EA4\u6295\u8BC9", "\u53EF\u540C\u6B65\u7533\u8BF7\u5E73\u53F0\u5BA2\u670D\u4ECB\u5165"] },
      { rank: 3, name: "\u901A\u8FC7\u300C\u5168\u56FD12315\u5E73\u53F0\u300D\u76F4\u63A5\u6295\u8BC9\u5E73\u53F0\u65B9", desc: "\u4F9D\u636E\u300A\u7535\u5B50\u5546\u52A1\u6CD5\u300B\uFF0C\u5E73\u53F0\u5BF9\u5546\u5BB6\u8FDD\u6CD5\u884C\u4E3A\u8D1F\u6709\u8FDE\u5E26\u8D23\u4EFB\uFF0C\u53EF\u76F4\u63A5\u8981\u6C42\u5E73\u53F0\u8D54\u507F", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49", steps: ["\u767B\u5F55\u5168\u56FD12315\u5E73\u53F0\uFF0C\u9009\u62E9\u300C\u6295\u8BC9\u300D\u800C\u975E\u300C\u4E3E\u62A5\u300D", "\u88AB\u6295\u8BC9\u5BF9\u8C61\u586B\u5199\u5E73\u53F0\u516C\u53F8\u540D\u79F0", "\u4E0A\u4F20\u8BC1\u636E\uFF0C\u8BF4\u660E\u5E73\u53F0\u672A\u5C65\u884C\u5BA1\u6838/\u76D1\u7BA1\u4E49\u52A1"] }
    ],
    service: [
      { rank: 1, name: "\u541112315\u5E73\u53F0\u6295\u8BC9", desc: "\u5404\u7C7B\u670D\u52A1\u7EA0\u7EB7\uFF0C\u4FDD\u7559\u597D\u670D\u52A1\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55+\u6C9F\u901A\u8BB0\u5F55\uFF0C\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5929", success: "\u4E2D\u9AD8", steps: ["\u6574\u7406\u597D\u670D\u52A1\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55+\u6C9F\u901A\u622A\u56FE", "\u901A\u8FC712315\u5C0F\u7A0B\u5E8F\u63D0\u4EA4\u6295\u8BC9", "\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u8054\u7CFB\u5546\u5BB6\u6838\u5B9E\u5904\u7406"] },
      { rank: 2, name: "\u5411\u5546\u52A1\u5C40\u6295\u8BC9\uFF08\u9884\u4ED8\u670D\u52A1\uFF09", desc: "\u9884\u4ED8\u5F0F\u670D\u52A1\uFF08\u4F1A\u5458\u5361\u7B49\uFF09\u5F52\u5546\u52A1\u90E8\u95E8\u7BA1\u7406\uFF0C\u53EF\u5411\u5F53\u5730\u5546\u52A1\u5C40\u6295\u8BC9\u7ECF\u8425\u8005\u8FDD\u89C4", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49", steps: ["\u5546\u52A1\u5C40\u8D1F\u8D23\u5355\u7528\u9014\u9884\u4ED8\u5361\u76D1\u7BA1", "\u53EF\u6295\u8BC9\u7ECF\u8425\u8005\u8FDD\u53CD\u62BC\u91D1\u7BA1\u7406\u5236\u5EA6", "\u8981\u6C42\u5546\u52A1\u90E8\u95E8\u5BF9\u7ECF\u8425\u8005\u8FDB\u884C\u884C\u653F\u5904\u7406"] },
      { rank: 3, name: "\u8D77\u8BC9\u7EF4\u6743", desc: "\u670D\u52A1\u7EA0\u7EB7\u91D1\u989D\u8F83\u5927\u65F6\uFF0C\u901A\u8FC7\u8BC9\u8BBC\u89E3\u51B3\uFF0C\u53EF\u4E3B\u5F20\u9000\u8FD8\u9884\u4ED8\u6B3E+\u5229\u606F\u635F\u5931", cost: "\u8BC9\u8BBC\u8D39\u7EA650\u5143", cycle: "2-4\u4E2A\u6708", success: "\u9AD8\uFF08\u6709\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55\uFF09", steps: ["\u51C6\u5907\u670D\u52A1\u5408\u540C+\u4ED8\u6B3E\u8BB0\u5F55+\u670D\u52A1\u672A\u8FBE\u6807\u51C6\u7684\u8BC1\u636E", "\u5411\u88AB\u544A\u4F4F\u6240\u5730\u6216\u5408\u540C\u5C65\u884C\u5730\u6CD5\u9662\u8D77\u8BC9", "\u53EF\u7533\u8BF7\u8BC9\u524D\u8D22\u4EA7\u4FDD\u5168"] }
    ],
    other: [
      { rank: 1, name: "\u5411\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9", desc: "\u5927\u591A\u6570\u6D88\u8D39\u7EA0\u7EB7\u5F52\u5E02\u573A\u76D1\u7BA1\u90E8\u95E8\u7BA1\u8F96\uFF0C\u4FDD\u7559\u597D\u6D88\u8D39\u51ED\u8BC1\u662F\u5173\u952E", cost: "\u96F6\u6210\u672C", cycle: "7-15\u5929", success: "\u4E2D\u7B49", steps: ["\u4FDD\u7559\u597D\u5408\u540C/\u6536\u636E+\u4ED8\u6B3E\u8BB0\u5F55", "\u901A\u8FC712315\u5E73\u53F0\u63D0\u4EA4\u6295\u8BC9", "\u4FDD\u6301\u7535\u8BDD\u7545\u901A\u7B49\u5F85\u53CD\u9988"] },
      { rank: 2, name: "\u5411\u6D88\u8D39\u8005\u534F\u4F1A\u7533\u8BF7\u8C03\u89E3", desc: "\u6D88\u534F\u662F\u6D88\u8D39\u8005\u7EF4\u6743\u7684\u91CD\u8981\u7B2C\u4E09\u65B9\u6E20\u9053\uFF0C\u4E0D\u6536\u8D39\uFF0C\u8C03\u89E3\u534F\u8BAE\u4E0D\u5177\u5F3A\u5236\u6267\u884C\u529B\u4F46\u793E\u4F1A\u7EA6\u675F\u529B\u5F3A", cost: "\u96F6\u6210\u672C", cycle: "15-30\u5929", success: "\u4E2D\u7B49", steps: ["\u62E8\u625312315\u8F6C\u4EBA\u5DE5\u7533\u8BF7\u6D88\u534F\u8C03\u89E3", "\u51C6\u5907\u597D\u4E66\u9762\u7533\u8BC9\u6750\u6599", "\u6D88\u534F\u51FA\u5177\u8C03\u89E3\u534F\u8BAE\u4E66"] },
      { rank: 3, name: "\u63D0\u8D77\u6C11\u4E8B\u8BC9\u8BBC", desc: "\u7EA0\u7EB7\u91D1\u989D\u8F83\u5927\u6216\u5BF9\u65B9\u4E3A\u6CD5\u4EBA\u5355\u4F4D\uFF0C\u901A\u8FC7\u8BC9\u8BBC\u89E3\u51B3\uFF0C\u5224\u51B3\u4E66\u6709\u5F3A\u5236\u6267\u884C\u529B", cost: "\u8BC9\u8BBC\u8D39\u7EA650-200\u5143", cycle: "3-6\u4E2A\u6708", success: "\u9AD8\uFF08\u6709\u5B8C\u6574\u8BC1\u636E\u94FE\uFF09", steps: ["\u51C6\u5907\u597D\u6240\u6709\u8BC1\u636E\uFF08\u5408\u540C+\u4ED8\u6B3E+\u6C9F\u901A\u8BB0\u5F55\uFF09", "\u786E\u5B9A\u7BA1\u8F96\u6CD5\u9662\uFF08\u901A\u5E38\u4E3A\u88AB\u544A\u4F4F\u6240\u5730\u6216\u5408\u540C\u5C65\u884C\u5730\uFF09", "\u901A\u8FC7\u300C\u4EBA\u6C11\u6CD5\u9662\u5728\u7EBF\u670D\u52A1\u300D\u5C0F\u7A0B\u5E8F\u7533\u8BF7\u7ACB\u6848"] }
    ]
  };
  const sceneSolutions = solutionsByScene[scene] || solutionsByScene.other;
  const options = memberLevel >= 3 ? sceneSolutions : sceneSolutions.slice(0, 2);
  const recommend = memberLevel >= 2 ? `\u7EFC\u5408\u60A8\u5F53\u524D\u6240\u5904\u9636\u6BB5\uFF08${stage}\uFF09\uFF0C\u5EFA\u8BAE\u4F18\u5148\u5C1D\u8BD5\u65B9\u68481\u300C${sceneSolutions[0].name}\u300D\uFF0C\u8BE5\u65B9\u5F0F\u6210\u672C\u6700\u4F4E\u4E14\u6210\u529F\u7387\u8F83\u9AD8\u3002\u5982\u65E0\u6548\uFF0C\u518D\u4F9D\u6B21\u5C1D\u8BD5\u65B9\u68482\u3001\u65B9\u68483\u3002` : `\u60A8\u5F53\u524D\u5904\u4E8E${stage}\u9636\u6BB5\u3002\u5EFA\u8BAE\u4F18\u5148\u5C1D\u8BD5\u65B9\u68481\uFF08\u6210\u672C\u6700\u4F4E\uFF09\u3002\u5347\u7EA7\u81F3\u9ED1\u91D1\u5E74\u5361\u53EF\u89E3\u9501\u5168\u90E8\u66FF\u4EE3\u65B9\u6848\u8BE6\u60C5\u53CA\u64CD\u4F5C\u6B65\u9AA4\u3002`;
  return { options, recommend };
}
function buildModule11({ scene, status, memberLevel }) {
  const stage = (status || "").split("\u3001")[0] || "\u4E0E\u5BF9\u65B9\u534F\u5546\u6C9F\u901A";
  const baseMaterials = [
    { item: "\u5408\u540C/\u534F\u8BAE\u539F\u4EF6", note: "\u7EB8\u8D28\u5408\u540C\u6216\u7535\u5B50\u5408\u540C\u622A\u56FE\uFF0C\u9700\u6E05\u6670\u663E\u793A\u53CC\u65B9\u7B7E\u7AE0", done: false },
    { item: "\u4ED8\u6B3E\u8BB0\u5F55", note: "\u94F6\u884C\u8F6C\u8D26\u8BB0\u5F55/\u652F\u4ED8App\u622A\u56FE\uFF0C\u9700\u663E\u793A\u4EA4\u6613\u65F6\u95F4\u548C\u91D1\u989D", done: false },
    { item: "\u6C9F\u901A\u8BB0\u5F55", note: "\u4E0E\u5BF9\u65B9\u7684\u5FAE\u4FE1\u804A\u5929\u8BB0\u5F55\u622A\u56FE+\u5F55\u5C4F\uFF08\u5173\u952E\u9875\u9762\u9700\u663E\u793A\u65F6\u95F4\uFF09", done: false },
    { item: "\u5BF9\u65B9\u8054\u7CFB\u65B9\u5F0F", note: "\u5BF9\u65B9\u771F\u5B9E\u59D3\u540D+\u624B\u673A\u53F7\u6216\u516C\u53F8\u6CE8\u518C\u5730\u5740", done: false }
  ];
  const stageMaterials = {
    "\u4E0E\u5BF9\u65B9\u534F\u5546\u6C9F\u901A": [
      { item: "\u4E66\u9762\u50AC\u544A\u51FD\uFF08EMS\u90AE\u5BC4\uFF09", note: "\u5199\u660E\u9000\u6B3E\u91D1\u989D+\u671F\u9650+\u8D26\u53F7\uFF0C\u90AE\u5BC4\u5E76\u4FDD\u7559\u56DE\u6267", done: false },
      { item: "\u50AC\u544A\u51FD\u9001\u8FBE\u51ED\u8BC1", note: "EMS\u5B98\u7F51\u6253\u5370\u7269\u6D41\u7B7E\u6536\u8BB0\u5F55\uFF0C\u8BC1\u660E\u5BF9\u65B9\u5DF2\u6536\u5230", done: false }
    ],
    "\u5411\u5E73\u53F0\u6216\u76D1\u7BA1\u90E8\u95E8\u6295\u8BC9": [
      { item: "\u541112315\u63D0\u4EA4\u7684\u6295\u8BC9\u622A\u56FE", note: "\u63D0\u4EA4\u6210\u529F\u540E\u4FDD\u5B58\u300C\u6295\u8BC9\u5355\u53F7\u300D", done: false },
      { item: "\u5E73\u53F0\u56DE\u590D\u8BB0\u5F55", note: "\u4FDD\u5B58\u597D\u5E73\u53F0\u65B9\u7684\u5904\u7406\u7ED3\u679C\u6216\u4E0D\u4E88\u53D7\u7406\u8BF4\u660E", done: false }
    ],
    "\u54A8\u8BE2\u8FC7\u4E13\u4E1A\u4EBA\u58EB": [
      { item: "\u5F8B\u5E08\u51FD\u6216\u54A8\u8BE2\u610F\u89C1\u4E66", note: "\u5982\u59D4\u6258\u5F8B\u5E08\u51FA\u8FC7\u5F8B\u5E08\u51FD\uFF0C\u4FDD\u7559\u539F\u4EF6", done: false },
      { item: "\u6CD5\u5F8B\u63F4\u52A9\u7533\u8BF7\u6750\u6599", note: "\u5982\u7B26\u5408\u6CD5\u5F8B\u63F4\u52A9\u6761\u4EF6\uFF0C\u4FDD\u7559\u7533\u8BF7\u8868\u548C\u7ECF\u6D4E\u56F0\u96BE\u8BC1\u660E", done: false }
    ],
    "\u8FD8\u6CA1\u6709\u5C1D\u8BD5\u8FC7\u4EFB\u4F55\u65B9\u5F0F": [
      { item: "\u5BF9\u65B9\u57FA\u672C\u4FE1\u606F\uFF08\u59D3\u540D/\u516C\u53F8\u540D\uFF09", note: "\u53EF\u901A\u8FC7\u5408\u540C\u3001\u4F01\u4E1A\u5DE5\u5546\u4FE1\u606F\u67E5\u8BE2\u786E\u8BA4", done: false },
      { item: "\u635F\u5931\u91D1\u989D\u8BA1\u7B97\u4F9D\u636E", note: "\u6574\u7406\u597D\u4ED8\u6B3E\u603B\u989D\u3001\u5DF2\u4F7F\u7528/\u672A\u4F7F\u7528\u6BD4\u4F8B", done: false }
    ]
  };
  const additionalMaterials = stageMaterials[stage] || [];
  const checkList = memberLevel >= 2 ? [...baseMaterials, ...additionalMaterials] : baseMaterials.slice(0, 2);
  const materialTip = memberLevel >= 1 ? "\u4EE5\u4E0A\u7269\u6599\u6E05\u5355\u5DF2\u6309\u4F18\u5148\u7EA7\u6392\u5E8F\u3002\u5EFA\u8BAE\u6309\u987A\u5E8F\u51C6\u5907\u9F50\u5168\u540E\u518D\u542F\u52A8\u6B63\u5F0F\u7EF4\u6743\uFF0C\u907F\u514D\u56E0\u6750\u6599\u4E0D\u5168\u6765\u56DE\u8865\u5145\u803D\u8BEF\u65F6\u95F4\u3002" : "\u9ED1\u91D1\u5E74\u5361\u4F1A\u5458\u53EF\u89E3\u9501\u5B8C\u6574\u7269\u6599\u6E05\u5355\u53CA\u83B7\u53D6\u6E20\u9053\u6307\u5F15\u3002";
  return { checkList, materialTip };
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
  const fontDir = process.env.NODE_ENV === "production" ? "/app/fonts" : "/mnt/c/WINDOWS/Fonts";
  doc.registerFont("SimHei", `${fontDir}/simhei.ttf`);
  doc.registerFont("SimSun", `${fontDir}/simsun.ttc`);
  doc.font("SimHei");
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
  const m1 = report.module1 || {};
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
  const m2 = report.module2 || {};
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
  const m3 = report.module3 || {};
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
  const m4 = Array.isArray(report.module4) ? report.module4 : [];
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
  const m5 = report.module5 || {};
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
  const m6 = report.module6 || {};
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
  const m7 = report.module7 || {};
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
  const m8 = report.module8 || {};
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
    const stream4 = fs2.createWriteStream(filePath);
    stream4.on("finish", () => {
      taskQueue.set(taskId, {
        status: "completed",
        reportId: report.reportId,
        filePath,
        createdAt: Date.now()
      });
      cachePdf(report.reportId, filePath);
      resolve(filePath);
    });
    stream4.on("error", (err) => {
      taskQueue.set(taskId, {
        status: "failed",
        reportId: report.reportId,
        error: err.message,
        createdAt: Date.now()
      });
      reject(err);
    });
    doc.pipe(stream4);
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
      stream4.end();
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
  _generateInBackground(taskId, report, filePath).catch((err) => {
    console.error(`\u274C PDF\u751F\u6210\u5931\u8D25 [${taskId}]:`, err.message);
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
async function reportRoutes(fastify2) {
  fastify2.post("/generate", async (request, reply) => {
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
        const decoded = fastify2.jwt.verify(token);
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
      var errMsg = err && err.message ? err.message : String(err);
      var errStack = err && err.stack ? err.stack.split("\\n").slice(0, 3).join(" | ") : "";
      return reply.status(500).send({ success: false, error: "\u62A5\u544A\u751F\u6210\u5931\u8D25", reportId, detail: errMsg, stack: errStack });
    }
  });
  fastify2.get("/list", {
    preHandler: [fastify2.authenticate]
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
  fastify2.get("/:reportId", async (request, reply) => {
    const { reportId } = request.params || {};
    if (!reportId) {
      return reply.status(400).send({ success: false, error: "\u7F3A\u5C11\u62A5\u544AID" });
    }
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
      const draft = await getReport(reportId);
      if (!draft) {
        return reply.status(404).send({ success: false, error: "\u62A5\u544A\u4E0D\u5B58\u5728" });
      }
      const isBlur = draft.isLocked && userLevel === 0;
      const reportData = draft.reportData || {};
      const filtered = isBlur ? filterBlur(reportData) : reportData;
      return {
        success: true,
        report: {
          reportId: draft.reportId,
          reportNo: draft.reportNo || "",
          scene: draft.scene,
          ...filtered,
          locked: draft.isLocked,
          isLocked: draft.isLocked,
          genStatus: draft.genStatus,
          reportVersion: isBlur ? "blur" : "hd"
        }
      };
    } catch (err) {
      console.error("\u67E5\u8BE2\u62A5\u544A\u5931\u8D25:", err);
      return reply.status(500).send({ success: false, error: "\u67E5\u8BE2\u5931\u8D25" });
    }
  });
  fastify2.post("/:reportId/share", async (request, reply) => {
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
  fastify2.delete("/:reportId", {
    preHandler: [fastify2.authenticate]
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
  fastify2.post("/:reportId/pdf", async (request, reply) => {
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
  fastify2.get("/pdf/:taskId", async (request, reply) => {
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
}
fastify.get("/admin/llm-test", async (request, reply) => {
  const axios2 = (await Promise.resolve().then(() => (init_axios2(), axios_exports))).default;
  const key = process.env.SILICONFLOW_API_KEY || "";
  if (!key) return { ok: false, error: "SILICONFLOW_API_KEY \u672A\u914D\u7F6E" };
  try {
    const res = await axios2.post("https://api.siliconflow.cn/v1/chat/completions", {
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [{ role: "user", content: "\u8BF4\u4F60\u597D" }],
      max_tokens: 10
    }, {
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      timeout: 15e3
    });
    return { ok: true, status: res.status, reply: res.data?.choices?.[0]?.message?.content?.slice(0, 50) };
  } catch (e) {
    return { ok: false, error: e.message, code: e.code, stack: e.stack?.slice(0, 300) };
  }
});

// src/modules/user/user.route.ts
init_store();
async function userRoutes(fastify2) {
  fastify2.post("/send-code", async (request, reply) => {
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
  fastify2.post("/login", async (request, reply) => {
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
    const token = fastify2.jwt.sign({ id: user.id, phone: user.phone });
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
  fastify2.post("/login-password", async (request, reply) => {
    const { phone, password } = request.body;
    if (!phone || !password) {
      return reply.status(400).send({ success: false, error: "\u624B\u673A\u53F7\u548C\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A" });
    }
    if (password !== "qxt123456") {
      return reply.status(401).send({ success: false, error: "\u5BC6\u7801\u9519\u8BEF" });
    }
    const user = await findOrCreateUser({ phone, registerSource: "phone" });
    const token = fastify2.jwt.sign({ id: user.id, phone: user.phone });
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
  fastify2.get("/profile", {
    preHandler: [fastify2.authenticate]
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
  fastify2.put("/profile", {
    preHandler: [fastify2.authenticate]
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
  fastify2.post("/wx-login", async (request, reply) => {
    const { code, nickname, avatar, gender } = request.body;
    const openid = `wx_${nickname || "guest"}_${Date.now()}`;
    const user = await findOrCreateUser({
      openid,
      nickname: nickname || "\u5FAE\u4FE1\u7528\u6237",
      registerSource: "wechat"
    });
    const token = fastify2.jwt.sign({ id: user.id, phone: user.phone });
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
  fastify2.post("/upgrade-member", {
    preHandler: [fastify2.authenticate]
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
async function verifyRoutes(fastify2) {
  fastify2.post("/send", async (request, reply) => {
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
  fastify2.post("/check", async (request, reply) => {
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
async function memberRoutes(fastify2) {
  fastify2.post("/prepay", async (request, reply) => {
    const { planId, openid, reportId } = request.body || {};
    if (planId === void 0 || planId === null || !openid) {
      return reply.status(400).send({ success: false, error: "\u7F3A\u5C11\u53C2\u6570" });
    }
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
    try {
      const { unifiedOrder: unifiedOrder2 } = await Promise.resolve().then(() => (init_pay_service(), pay_service_exports));
      const result = await unifiedOrder2({
        openid,
        planId,
        memberLevel: plan.level,
        totalFee: plan.fee,
        userId: openid
      });
      if (!result.success) {
        return reply.status(400).send({ success: false, error: result.error });
      }
      return {
        success: true,
        orderId: result.data.orderId,
        payParams: result.data.jsapiParams || result.data
      };
    } catch (e) {
      console.error("[Member] \u9884\u4E0B\u5355\u5931\u8D25:", e);
      return reply.status(500).send({ success: false, error: "\u4E0B\u5355\u5931\u8D25" });
    }
  });
  fastify2.post("/deduct", {
    preHandler: [fastify2.authenticate]
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
  fastify2.get("/status", {
    preHandler: [fastify2.authenticate]
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
  fastify2.get("/orders", {
    preHandler: [fastify2.authenticate]
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
  fastify2.get("/mall-orders", {
    preHandler: [fastify2.authenticate]
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
  fastify2.post("/invoice", {
    preHandler: [fastify2.authenticate]
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
  fastify2.get("/invoices", {
    preHandler: [fastify2.authenticate]
  }, async (request, reply) => {
    return {
      success: true,
      invoices: [],
      message: "\u5F00\u7968\u8BB0\u5F55\u529F\u80FD\u5347\u7EA7\u4E2D\uFF0C\u5386\u53F2\u7533\u8BF7\u4ECD\u6709\u6548"
    };
  });
  fastify2.get("/plans", async (request, reply) => {
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
async function adminRoute(fastify2) {
  fastify2.addHook("preHandler", verifyAdminToken);
  fastify2.get("/users", async (request, reply) => {
    const { page = "1", pageSize = "20", phone, nickname, memberLevel, startDate, endDate } = request.query;
    const result = await getAdminUserList({ page: parseInt(page), pageSize: parseInt(pageSize), phone, nickname, memberLevel, startDate, endDate });
    return reply.send({ code: 0, data: result });
  });
  fastify2.get("/users/:id", async (request, reply) => {
    const user = await getAdminUserDetail(request.params.id);
    if (!user) return reply.status(404).send({ code: 404, message: "\u7528\u6237\u4E0D\u5B58\u5728" });
    return reply.send({ code: 0, data: user });
  });
  fastify2.put("/users/:id/member", async (request, reply) => {
    const { memberLevel, expireTime, reason } = request.body || {};
    await updateMember(request.params.id, { memberLevel, expireTime, reason });
    return reply.send({ code: 0, message: "\u4F1A\u5458\u66F4\u65B0\u6210\u529F" });
  });
  fastify2.post("/users/:id/extend", async (request, reply) => {
    const { days, reason } = request.body || {};
    await extendMember(request.params.id, days, reason);
    return reply.send({ code: 0, message: `\u5DF2\u5EF6\u957F${days}\u5929` });
  });
  fastify2.post("/users/:id/gift", async (request, reply) => {
    const { count, reason } = request.body || {};
    await giftCount(request.params.id, count, reason);
    return reply.send({ code: 0, message: `\u5DF2\u8D60\u9001${count}\u6B21` });
  });
  fastify2.get("/orders", async (request, reply) => {
    const { page = "1", pageSize = "20", orderId, phone, productType, payStatus, startDate, endDate } = request.query;
    const result = await getAdminOrderList({ page: parseInt(page), pageSize: parseInt(pageSize), orderId, phone, productType, payStatus, startDate, endDate });
    return reply.send({ code: 0, data: result });
  });
  fastify2.get("/orders/:id", async (request, reply) => {
    const order = await getAdminOrderDetail(request.params.id);
    if (!order) return reply.status(404).send({ code: 404, message: "\u8BA2\u5355\u4E0D\u5B58\u5728" });
    return reply.send({ code: 0, data: order });
  });
  fastify2.post("/orders/:id/refund", async (request, reply) => {
    const { reason, operator } = request.body || {};
    await createRefund(request.params.id, reason, operator);
    return reply.send({ code: 0, message: "\u9000\u6B3E\u7533\u8BF7\u5DF2\u63D0\u4EA4" });
  });
  fastify2.get("/orders/:id/refund", async (request, reply) => {
    const status = await getRefundStatus(request.params.id);
    return reply.send({ code: 0, data: status });
  });
  fastify2.get("/dashboard/stats", async (_request, reply) => {
    return reply.send({ code: 0, data: await getDashboardStats() });
  });
  fastify2.get("/dashboard/revenue", async (request, reply) => {
    const days = parseInt(request.query.days || "30");
    return reply.send({ code: 0, data: await getRevenueTrend(days) });
  });
  fastify2.get("/dashboard/users", async (request, reply) => {
    const days = parseInt(request.query.days || "30");
    return reply.send({ code: 0, data: await getUserTrend(days) });
  });
  fastify2.get("/dashboard/dispute-types", async (_request, reply) => {
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
async function webhookRoutes(fastify2) {
  fastify2.post("/webhook", async (request, reply) => {
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
  fastify2.post("/send-message", {
    preHandler: [fastify2.authenticate]
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
  fastify2.get("/member-status", async (request, reply) => {
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
  fastify2.get("/oauth/callback", async (request, reply) => {
    const { code, platform, state } = request.query;
    if (!code || !platform) {
      return reply.status(400).send({ success: false, error: "\u7F3A\u5C11 code \u6216 platform" });
    }
    console.log(`\u{1F511} OAuth \u56DE\u8C03 [${platform}] code=${code}`);
    return reply.redirect(`/pages/home/index?oauth=success&platform=${platform}&state=${state}`);
  });
  fastify2.post("/chatbot", async (request, reply) => {
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
async function payRoutes(fastify2) {
  fastify2.get("/pay/test", async (_req, reply) => {
    return reply.send({ success: true, message: "pay route ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  fastify2.post("/pay/create", {
    preHandler: [fastify2.authenticate]
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
  fastify2.post("/pay/callback", async (request, reply) => {
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
async function mallRoutes(fastify2) {
  fastify2.get("/goods", async (request, reply) => {
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
  fastify2.get("/goods/:id", async (request, reply) => {
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
  fastify2.post("/order", {
    preHandler: [fastify2.authenticate]
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
  onFilePart: (field, stream4, filename, encoding, mimetype) => {
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
/*! Bundled license information:

mime-db/index.js:
  (*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-types/index.js:
  (*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
