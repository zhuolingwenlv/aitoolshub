import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getAdminUserList, getAdminUserDetail, updateMember, extendMember, giftCount } from './admin.service.js';
import { verifyAdminToken } from '../../middleware/adminAuth.js';

export default async function adminRoute(fastify: FastifyInstance) {
  // 所有路由需要管理员Token
  fastify.addHook('preHandler', verifyAdminToken);

  // ==================== 用户管理 ====================

  // GET /api/admin/users - 用户列表
  fastify.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const { page = '1', pageSize = '20', phone, nickname, memberLevel, startDate, endDate } = request.query as any;
    const result = await getAdminUserList({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      phone, nickname, memberLevel, startDate, endDate
    });
    return reply.send({ code: 0, data: result });
  });

  // GET /api/admin/users/:id - 用户详情
  fastify.get('/users/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = await getAdminUserDetail(request.params.id);
    if (!user) return reply.status(404).send({ code: 404, message: '用户不存在' });
    return reply.send({ code: 0, data: user });
  });

  // PUT /api/admin/users/:id/member - 手动修改会员
  fastify.put('/users/:id/member', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { memberLevel, expireTime, reason } = request.body as any;
    await updateMember(request.params.id, { memberLevel, expireTime, reason });
    return reply.send({ code: 0, message: '会员更新成功' });
  });

  // POST /api/admin/users/:id/extend - 延长会员
  fastify.post('/users/:id/extend', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { days, reason } = request.body as any;
    await extendMember(request.params.id, days, reason);
    return reply.send({ code: 0, message: `已延长${days}天` });
  });

  // POST /api/admin/users/:id/gift - 赠送梳理次数
  fastify.post('/users/:id/gift', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { count, reason } = request.body as any;
    await giftCount(request.params.id, count, reason);
    return reply.send({ code: 0, message: `已赠送${count}次` });
  });

  // ==================== 订单管理 ====================

  // GET /api/admin/orders - 订单列表
  fastify.get('/orders', async (request: FastifyRequest, reply: FastifyReply) => {
    const { page = '1', pageSize = '20', orderId, phone, productType, payStatus, startDate, endDate } = request.query as any;
    const result = await getAdminOrderList({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      orderId, phone, productType, payStatus, startDate, endDate
    });
    return reply.send({ code: 0, data: result });
  });

  // GET /api/admin/orders/:id - 订单详情
  fastify.get('/orders/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const order = await getAdminOrderDetail(request.params.id);
    if (!order) return reply.status(404).send({ code: 404, message: '订单不存在' });
    return reply.send({ code: 0, data: order });
  });

  // POST /api/admin/orders/:id/refund - 发起退款
  fastify.post('/orders/:id/refund', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { reason, operator } = request.body as any;
    await createRefund(request.params.id, reason, operator);
    return reply.send({ code: 0, message: '退款申请已提交' });
  });

  // GET /api/admin/orders/:id/refund - 退款状态
  fastify.get('/orders/:id/refund', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const status = await getRefundStatus(request.params.id);
    return reply.send({ code: 0, data: status });
  });

  // ==================== 仪表盘 ====================

  // GET /api/admin/dashboard/stats - 核心指标（真实MySQL数据）
  fastify.get('/dashboard/stats', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { getRevenueStats } = await import('../../db/store.js')
      const stats = await getRevenueStats()
      return reply.send({ code: 0, data: stats })
    } catch (e: any) {
      return reply.send({ code: 0, data: getDashboardStats() }) // 降级mock
    }
  });

  // GET /api/admin/orders/all - 全量订单列表（会员+商城）
  fastify.get('/orders/all', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { listAllOrders } = await import('../../db/store.js')
      const { page = '1', pageSize = '20' } = request.query as any
      const result = await listAllOrders(parseInt(page), parseInt(pageSize))
      return reply.send({ code: 0, data: result })
    } catch (e: any) {
      const { page = '1', pageSize = '20' } = request.query as any
      return reply.send({ code: 0, data: getAdminOrderList({ page: parseInt(page), pageSize: parseInt(pageSize) }) })
    }
  });

  // GET /api/admin/dashboard/revenue - 收入趋势
  fastify.get('/dashboard/revenue', async (request: FastifyRequest, reply: FastifyReply) => {
    const { days = '30' } = request.query as any;
    const data = await getRevenueTrend(parseInt(days));
    return reply.send({ code: 0, data });
  });

  // GET /api/admin/dashboard/users - 用户趋势
  fastify.get('/dashboard/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const { days = '30' } = request.query as any;
    const data = await getUserTrend(parseInt(days));
    return reply.send({ code: 0, data });
  });

  // GET /api/admin/dashboard/dispute-types - 纠纷类型分布
  fastify.get('/dashboard/dispute-types', async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await getDisputeTypeDistribution();
    return reply.send({ code: 0, data });
  });
}

// ==================== Mock数据层（临时，生产需接MySQL） ====================

interface UserQuery {
  page: number; pageSize: number;
  phone?: string; nickname?: string; memberLevel?: string;
  startDate?: string; endDate?: string;
}

export async function getAdminUserList(query: UserQuery) {
  // TODO: 替换为真实MySQL查询
  const mockUsers = [
    { id: 'u001', phone: '150****9885', nickname: '张三', avatar: '', memberLevel: 'svip', expireTime: '2026-12-31', reportCount: 12, createdAt: '2026-01-15', lastActive: '2026-05-13' },
    { id: 'u002', phone: '138****2341', nickname: '李四', avatar: '', memberLevel: 'vip', expireTime: '2026-06-30', reportCount: 5, createdAt: '2026-03-20', lastActive: '2026-05-10' },
    { id: 'u003', phone: '159****8762', nickname: '王五', avatar: '', memberLevel: 'normal', expireTime: null, reportCount: 2, createdAt: '2026-04-01', lastActive: '2026-05-08' },
  ];
  return { list: mockUsers, total: 3, page: query.page, pageSize: query.pageSize };
}

export async function getAdminUserDetail(id: string) {
  const reports = [
    { id: 'r001', type: '劳动纠纷', status: '已完成', createdAt: '2026-05-10' },
    { id: 'r002', type: '消费维权', status: '已完成', createdAt: '2026-04-18' },
  ];
  const logs = [
    { action: '登录', time: '2026-05-13 14:22', ip: '127.0.0.1' },
    { action: '生成报告', time: '2026-05-10 10:05', ip: '127.0.0.1' },
    { action: '购买会员', time: '2026-01-15 09:00', ip: '127.0.0.1' },
  ];
  const members = [
    { level: 'svip', startTime: '2026-01-15', expireTime: '2026-12-31', times: 999, usedTimes: 12 },
  ];
  return { id, phone: '150****9885', nickname: '张三', city: '无锡', memberHistory: members, reports, logs };
}

export async function updateMember(id: string, data: any) {
  console.log(`[Admin] 更新用户${id}会员:`, data);
}

export async function extendMember(id: string, days: number, reason: string) {
  console.log(`[Admin] 延长用户${id}会员${days}天, 原因: ${reason}`);
}

export async function giftCount(id: string, count: number, reason: string) {
  console.log(`[Admin] 赠送用户${id}梳理次数${count}次, 原因: ${reason}`);
}

interface OrderQuery {
  page: number; pageSize: number;
  orderId?: string; phone?: string; productType?: string; payStatus?: string;
  startDate?: string; endDate?: string;
}

export async function getAdminOrderList(query: OrderQuery) {
  const mockOrders = [
    { id: 'o001', orderNo: 'WX202605130001', phone: '150****9885', productType: 'svip_year', productName: '黑金年卡', amount: 2666, payStatus: 'paid', payTime: '2026-05-13 10:00', openid: 'oxxxx' },
    { id: 'o002', orderNo: 'WX202605120002', phone: '138****2341', productType: 'vip_quarter', productName: '季VIP', amount: 168, payStatus: 'paid', payTime: '2026-05-12 15:30', openid: 'oxxxx' },
    { id: 'o003', orderNo: 'WX202605110003', phone: '159****8762', productType: 'single', productName: '单次梳理', amount: 36.8, payStatus: 'refunded', payTime: '2026-05-11 09:15', openid: 'oxxxx' },
  ];
  return { list: mockOrders, total: 3, page: query.page, pageSize: query.pageSize };
}

export async function getAdminOrderDetail(id: string) {
  return { id, orderNo: 'WX202605130001', amount: 2666, transactionId: 'wx1234567890', payStatus: 'paid' };
}

export async function createRefund(orderId: string, reason: string, operator: string) {
  console.log(`[Admin] 订单${orderId}退款, 原因: ${reason}, 操作人: ${operator}`);
}

export async function getRefundStatus(orderId: string) {
  return { status: 'pending', applyTime: '2026-05-13', reason: '用户误购' };
}

export async function getDashboardStats() {
  return {
    todayUsers: 12, todayOrders: 5, todayReports: 8, totalMembers: 156,
    todayRevenue: 566, monthRevenue: 12450,
  };
}

export async function getRevenueTrend(days: number) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().slice(0,10), amount: Math.floor(Math.random() * 1000) });
  }
  return data;
}

export async function getUserTrend(days: number) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().slice(0,10), newUsers: Math.floor(Math.random() * 20), activeUsers: Math.floor(Math.random() * 50) });
  }
  return data;
}

export async function getDisputeTypeDistribution() {
  return [
    { name: '劳动纠纷', count: 45 },
    { name: '消费维权', count: 32 },
    { name: '合同纠纷', count: 28 },
    { name: '婚姻继承', count: 15 },
    { name: '交通事故', count: 12 },
  ];
}
