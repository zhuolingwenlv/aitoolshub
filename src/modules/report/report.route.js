// 报告路由
import { generateReport } from './report.service.js'
import { scanBannedWords } from '../../data/banned-words.js'
import { generatePdfTask, getPdfTaskStatus } from './pdf.service.js'

export async function reportRoutes(fastify) {

  // 生成报告（POST /api/v1/report/generate）
  fastify.post('/generate', async (request, reply) => {
    const body = request.body || {}

    const { scene, subType, amount, focus, status, evidence = [], memberLevel = 0, memo = '' } = body

    if (!scene || !status) {
      return reply.status(400).send({ success: false, error: '缺少必填参数：scene, status' })
    }

    // 禁语扫描——用户输入必须过滤
    const memoScan = scanBannedWords(memo)
    if (memoScan.blocked) {
      return reply.status(400).send({
        success: false,
        error: `内容包含敏感词汇，请修改后重试：${memoScan.found.join('、')}`,
      })
    }

    try {
      const report = generateReport({
        scene,
        subType: subType || '',
        amount: amount || '待确认',
        focus: Array.isArray(focus) ? focus : [focus].filter(Boolean),
        status,
        evidence,
        memberLevel,
        memo,
      })

      // 保存到mockStore
      const { mockDb } = await import('../../db/mockStore.js')
      mockDb.reports.set(report.reportId, {
        ...report,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      })

      return { success: true, report }
    } catch (err) {
      console.error('❌ 报告生成失败:', err)
      return reply.status(500).send({ success: false, error: '报告生成失败' })
    }
  })

  // 查询报告（GET /api/v1/report/:reportId）
  fastify.get('/:reportId', async (request, reply) => {
    const { reportId } = request.params || {}

    if (!reportId) {
      return reply.status(400).send({ success: false, error: '缺少报告ID' })
    }

    const { getReport } = await import('../../db/mockStore.js')
    const report = getReport(reportId)

    if (!report) {
      return reply.status(404).send({ success: false, error: '报告不存在或已过期' })
    }

    // 检查是否过期
    if (report.expiresAt && new Date(report.expiresAt) < new Date()) {
      return reply.status(410).send({ success: false, error: '链接已过期' })
    }

    return { success: true, report }
  })

  // 生成分享链接（POST /api/v1/report/:reportId/share）
  fastify.post('/:reportId/share', async (request, reply) => {
    const { reportId } = request.params || {}

    const { getReport } = await import('../../db/mockStore.js')
    const report = getReport(reportId)

    if (!report) {
      return reply.status(404).send({ success: false, error: '报告不存在' })
    }

    // 生成24小时有效的token
    const token = Buffer.from(`${reportId}:${Date.now() + 24 * 60 * 60 * 1000}`).toString('base64')
    const shareUrl = `/pages/draft/report?reportId=${reportId}&token=${encodeURIComponent(token)}`

    return { success: true, shareUrl, expiresIn: '24小时' }
  })

  // 删除报告（DELETE /api/v1/report/:reportId）
  fastify.delete('/:reportId', async (request, reply) => {
    const { reportId } = request.params || {}

    const { deleteReport } = await import('../../db/mockStore.js')
    const existed = deleteReport(reportId)

    if (!existed) {
      return reply.status(404).send({ success: false, error: '报告不存在' })
    }

    return { success: true }
  })

  // 创建PDF任务（POST /api/v1/report/:reportId/pdf）
  fastify.post('/:reportId/pdf', async (request, reply) => {
    const { reportId } = request.params || {}

    const { getReport } = await import('../../db/mockStore.js')
    const report = getReport(reportId)

    if (!report) {
      return reply.status(404).send({ success: false, error: '报告不存在' })
    }

    if (report.locked) {
      return reply.status(403).send({ success: false, error: '报告已锁定，请先解锁' })
    }

    const result = generatePdfTask(report)
    return { success: true, taskId: result.taskId, status: result.status }
  })

  // 查询PDF任务状态（GET /api/v1/report/pdf/:taskId）
  fastify.get('/pdf/:taskId', async (request, reply) => {
    const { taskId } = request.params || {}

    const status = getPdfTaskStatus(taskId)
    if (status.status === 'not_found') {
      return reply.status(404).send({ success: false, error: '任务不存在' })
    }

    return { success: true, ...status }
  })
}
