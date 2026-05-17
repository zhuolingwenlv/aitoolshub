/**
 * 管理后台 Service 层（Mock数据，待接MySQL）
 */

// ==================== 用户管理 ====================

export async function getAdminUserList({ page = 1, pageSize = 20, phone, nickname, memberLevel, startDate, endDate }) {
  // TODO: SELECT * FROM users WHERE ... LIMIT offset, pageSize
  const mockUsers = [
    { id: 'u001', phone: '150****9885', nickname: '张三', avatar: '', memberLevel: 'svip', expireTime: '2026-12-31', reportCount: 12, createdAt: '2026-01-15', lastActive: '2026-05-13' },
    { id: 'u002', phone: '138****2341', nickname: '李四', avatar: '', memberLevel: 'vip', expireTime: '2026-06-30', reportCount: 5, createdAt: '2026-03-20', lastActive: '2026-05-10' },
    { id: 'u003', phone: '159****8762', nickname: '王五', avatar: '', memberLevel: 'normal', expireTime: null, reportCount: 2, createdAt: '2026-04-01', lastActive: '2026-05-08' },
  ];
  return { list: mockUsers, total: 3, page, pageSize };
}

export async function getAdminUserDetail(id) {
  // TODO: SELECT * FROM users WHERE id = ?
  return {
    id, phone: '150****9885', nickname: '张三', city: '无锡',
    memberHistory: [{ level: 'svip', startTime: '2026-01-15', expireTime: '2026-12-31', times: 999, usedTimes: 12 }],
    reports: [
      { id: 'r001', type: '劳动纠纷', status: '已完成', createdAt: '2026-05-10' },
      { id: 'r002', type: '消费维权', status: '已完成', createdAt: '2026-04-18' },
    ],
    logs: [
      { action: '登录', time: '2026-05-13 14:22', ip: '127.0.0.1' },
      { action: '生成报告', time: '2026-05-10 10:05', ip: '127.0.0.1' },
      { action: '购买会员', time: '2026-01-15 09:00', ip: '127.0.0.1' },
    ],
  };
}

export async function updateMember(id, { memberLevel, expireTime, reason }) {
  console.log(`[Admin] 更新用户${id}会员:`, { memberLevel, expireTime, reason });
  // TODO: UPDATE users SET member_level=?, expire_time=? WHERE id=?
  // TODO: INSERT INTO admin_logs (action='update_member', target_id=?, detail=?)
}

export async function extendMember(id, days, reason) {
  console.log(`[Admin] 延长用户${id}会员${days}天, 原因: ${reason}`);
  // TODO: UPDATE users SET expire_time = DATE_ADD(expire_time, INTERVAL days DAY) WHERE id=?
}

export async function giftCount(id, count, reason) {
  console.log(`[Admin] 赠送用户${id}梳理次数${count}次, 原因: ${reason}`);
  // TODO: UPDATE users SET remaining_times = remaining_times + count WHERE id=?
}

// ==================== 订单管理 ====================

export async function getAdminOrderList({ page = 1, pageSize = 20, orderId, phone, productType, payStatus, startDate, endDate }) {
  // TODO: SELECT * FROM orders WHERE ... LIMIT offset, pageSize
  const mockOrders = [
    { id: 'o001', orderNo: 'WX202605130001', phone: '150****9885', productType: 'svip_year', productName: '黑金年卡', amount: 2666, payStatus: 'paid', payTime: '2026-05-13 10:00', transactionId: 'wx1234567890' },
    { id: 'o002', orderNo: 'WX202605120002', phone: '138****2341', productType: 'vip_quarter', productName: '季VIP', amount: 168, payStatus: 'paid', payTime: '2026-05-12 15:30', transactionId: 'wx1234567891' },
    { id: 'o003', orderNo: 'WX202605110003', phone: '159****8762', productType: 'single', productName: '单次梳理', amount: 36.8, payStatus: 'refunded', payTime: '2026-05-11 09:15', transactionId: 'wx1234567892' },
  ];
  return { list: mockOrders, total: 3, page, pageSize };
}

export async function getAdminOrderDetail(id) {
  // TODO: SELECT * FROM orders WHERE id = ?
  return { id, orderNo: 'WX202605130001', amount: 2666, transactionId: 'wx1234567890', payStatus: 'paid', userId: 'u001' };
}

export async function createRefund(orderId, reason, operator) {
  console.log(`[Admin] 订单${orderId}退款, 原因: ${reason}, 操作人: ${operator}`);
  // TODO: INSERT INTO refund_requests (order_id, reason, operator, status='pending', created_at)
}

export async function getRefundStatus(orderId) {
  // TODO: SELECT * FROM refund_requests WHERE order_id = ?
  return { status: 'pending', applyTime: '2026-05-13', reason: '用户误购' };
}

// ==================== 仪表盘 ====================

export async function getDashboardStats() {
  // TODO: 真实数据从数据库聚合查询
  return {
    todayUsers: 12, todayOrders: 5, todayReports: 8, totalMembers: 156,
    todayRevenue: 566, monthRevenue: 12450,
  };
}

export async function getRevenueTrend(days = 30) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().slice(0, 10), amount: Math.floor(Math.random() * 1000 + 200) });
  }
  return data;
}

export async function getUserTrend(days = 30) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().slice(0, 10), newUsers: Math.floor(Math.random() * 20 + 3), activeUsers: Math.floor(Math.random() * 50 + 10) });
  }
  return data;
}

export async function getDisputeTypeDistribution() {
  // TODO: SELECT dispute_type, COUNT(*) FROM reports GROUP BY dispute_type
  return [
    { name: '劳动纠纷', count: 45 },
    { name: '消费维权', count: 32 },
    { name: '合同纠纷', count: 28 },
    { name: '婚姻继承', count: 15 },
    { name: '交通事故', count: 12 },
  ];
}
