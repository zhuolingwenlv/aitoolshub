/**
 * 管理员 Token 验证中间件
 */
export async function verifyAdminToken(request: any, reply: any) {
  const adminToken = request.headers['x-admin-token'] || request.headers['authorization']?.replace('Bearer ', '');
  const validToken = process.env.ADMIN_TOKEN || 'qxt_admin_dev_token_2026';

  if (!adminToken || adminToken !== validToken) {
    return reply.status(401).send({ code: 401, message: '管理员权限验证失败' });
  }
}
