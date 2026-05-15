/**
 * 管理后台 API 路由
 * 路径: /api/admin/*
 * 需要请求头: Admin-Token: <token>
 */

import { getAdminUserList, getAdminUserDetail, updateMember, extendMember, giftCount, getAdminOrderList, getAdminOrderDetail, createRefund, getRefundStatus, getDashboardStats, getRevenueTrend, getUserTrend, getDisputeTypeDistribution } from './admin.service.js';

export default async function adminRoute(fastify) {
  // 所有路由需要管理员Token
  fastify.addHook('preHandler', verifyAdminToken);

  // ==================== 用户管理 ====================

  fastify.get('/users', async (request, reply) => {
    const { page = '1', pageSize = '20', phone, nickname, memberLevel, startDate, endDate } = request.query;
    const result = await getAdminUserList({ page: parseInt(page), pageSize: parseInt(pageSize), phone, nickname, memberLevel, startDate, endDate });
    return reply.send({ code: 0, data: result });
  });

  fastify.get('/users/:id', async (request, reply) => {
    const user = await getAdminUserDetail(request.params.id);
    if (!user) return reply.status(404).send({ code: 404, message: '用户不存在' });
    return reply.send({ code: 0, data: user });
  });

  fastify.put('/users/:id/member', async (request, reply) => {
    const { memberLevel, expireTime, reason } = request.body || {};
    await updateMember(request.params.id, { memberLevel, expireTime, reason });
    return reply.send({ code: 0, message: '会员更新成功' });
  });

  fastify.post('/users/:id/extend', async (request, reply) => {
    const { days, reason } = request.body || {};
    await extendMember(request.params.id, days, reason);
    return reply.send({ code: 0, message: `已延长${days}天` });
  });

  fastify.post('/users/:id/gift', async (request, reply) => {
    const { count, reason } = request.body || {};
    await giftCount(request.params.id, count, reason);
    return reply.send({ code: 0, message: `已赠送${count}次` });
  });

  // ==================== 订单管理 ====================

  fastify.get('/orders', async (request, reply) => {
    const { page = '1', pageSize = '20', orderId, phone, productType, payStatus, startDate, endDate } = request.query;
    const result = await getAdminOrderList({ page: parseInt(page), pageSize: parseInt(pageSize), orderId, phone, productType, payStatus, startDate, endDate });
    return reply.send({ code: 0, data: result });
  });

  fastify.get('/orders/:id', async (request, reply) => {
    const order = await getAdminOrderDetail(request.params.id);
    if (!order) return reply.status(404).send({ code: 404, message: '订单不存在' });
    return reply.send({ code: 0, data: order });
  });

  fastify.post('/orders/:id/refund', async (request, reply) => {
    const { reason, operator } = request.body || {};
    await createRefund(request.params.id, reason, operator);
    return reply.send({ code: 0, message: '退款申请已提交' });
  });

  fastify.get('/orders/:id/refund', async (request, reply) => {
    const status = await getRefundStatus(request.params.id);
    return reply.send({ code: 0, data: status });
  });

  // ==================== 仪表盘 ====================

  fastify.get('/dashboard/stats', async (_request, reply) => {
    return reply.send({ code: 0, data: await getDashboardStats() });
  });

  fastify.get('/dashboard/revenue', async (request, reply) => {
    const days = parseInt(request.query.days || '30');
    return reply.send({ code: 0, data: await getRevenueTrend(days) });
  });

  fastify.get('/dashboard/users', async (request, reply) => {
    const days = parseInt(request.query.days || '30');
    return reply.send({ code: 0, data: await getUserTrend(days) });
  });

  fastify.get('/dashboard/dispute-types', async (_request, reply) => {
    return reply.send({ code: 0, data: await getDisputeTypeDistribution() });
  });
}

// ==================== 权限中间件 ====================

async function verifyAdminToken(request, reply) {
  const token = request.headers['admin-token'];
  // TODO: 生产环境查数据库/Redis验证Token
  if (!token) {
    return reply.status(401).send({ code: 401, message: '缺少管理员Token' });
  }
  request.admin = { id: 'admin_001', name: '管理员', role: 'super_admin' };
}
