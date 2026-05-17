// 报告路由 — MySQL存储版（P0修复）
import { generateReport } from './report.service.js'
import { scanBannedWords } from '../../data/banned-words.js'
import { generatePdfTask, getPdfTaskStatus } from './pdf.service.js'
import { saveReport, getReport as getReportDb, deleteReport, listReportsByUser } from '../../db/store.js'

export async function reportRoutes(fastify) {

  // 生成报告（POST /api/v1/report/generate）
  fastify.post('/generate', async (request, reply) => {
    const body = request.body || {}

    const { scene, subType, amount, focus, status, evidence = [], memberLevel = 0, memo = '' } = body

    if (!scene || !status) {
      return reply.status(400).send({ success: false, error: '缺少必填参数：scene, status' })
    }

    // 禁语扫描
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

      // 提取userId（可选，未登录也行）
      let userId = 'anonymous'
      try {
        const token = request.headers.authorization?.replace('Bearer ', '')
        if (token) {
          const decoded = fastify.jwt.verify(token)
          userId = decoded.phone || decoded.id || 'anonymous'
        }
      } catch (_) { /* 未登录允许生成 */ }

      // 保存到MySQL
      await saveReport(report.reportId, {
        userId,
        scene,
        subType: subType || '',
        amount: amount || '待确认',
        focus: Array.isArray(focus) ? focus : [focus].filter(Boolean),
        status,
        evidence,
        memberLevel,
        reportData: report,
        isLocked: memberLevel === 0,
        orderId: '',
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

    try {
      const draft = await getReportDb(reportId)
      if (!draft) {
        return reply.status(404).send({ success: false, error: '报告不存在' })
      }

      return {
        success: true,
        report: {
          reportId: draft.reportId,
          scene: draft.scene,
          ...draft.reportData,
          locked: draft.isLocked,
          isLocked: draft.isLocked,
        },
      }
    } catch (err) {
      console.error('查询报告失败:', err)
      return reply.status(500).send({ success: false, error: '查询失败' })
    }
  })

  // 用户报告列表（GET /api/v1/report/list）
  fastify.get('/list', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = request.user?.phone || request.user?.id || ''
      const reports = await listReportsByUser(userId)
      return {
        success: true,
        reports: reports.map(r => ({
          reportId: r.reportId,
          scene: r.scene,
          subType: r.subType,
          amount: r.amount,
          status: r.status,
          isLocked: r.isLocked,
          orderId: r.orderId,
          createdAt: r.createdAt,
          // 轻量预览（不全量返回）
          preview: r.reportData ? {
            type: r.reportData.m1?.type || '',
            evidenceScore: r.reportData.m2?.evidenceScore || 0,
          } : null,
        })),
      }
    } catch (err) {
      console.error('报告列表查询失败:', err)
      return reply.status(500).send({ success: false, error: '查询失败' })
    }
  })

  // 生成分享链接（POST /api/v1/report/:reportId/share）
  fastify.post('/:reportId/share', async (request, reply) => {
    const { reportId } = request.params || {}

    try {
      const draft = await getReportDb(reportId)
      if (!draft) {
        return reply.status(404).send({ success: false, error: '报告不存在' })
      }

      const token = Buffer.from(`${reportId}:${Date.now() + 24 * 60 * 60 * 1000}`).toString('base64')
      const shareUrl = `/pages/draft/report?reportId=${reportId}&token=${encodeURIComponent(token)}`

      return { success: true, shareUrl, expiresIn: '24小时' }
    } catch (err) {
      console.error('生成分享链接失败:', err)
      return reply.status(500).send({ success: false, error: '操作失败' })
    }
  })

  // 删除报告（DELETE /api/v1/report/:reportId）
  fastify.delete('/:reportId', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { reportId } = request.params || {}

    try {
      const result = await deleteReport(reportId)
      if (!result) {
        return reply.status(404).send({ success: false, error: '报告不存在' })
      }
      return { success: true }
    } catch (err) {
      console.error('删除报告失败:', err)
      return reply.status(500).send({ success: false, error: '删除失败' })
    }
  })

  // 创建PDF任务（POST /api/v1/report/:reportId/pdf）
  fastify.post('/:reportId/pdf', async (request, reply) => {
    const { reportId } = request.params || {}

    try {
      const draft = await getReportDb(reportId)
      if (!draft) {
        return reply.status(404).send({ success: false, error: '报告不存在' })
      }

      if (draft.isLocked) {
        return reply.status(403).send({ success: false, error: '报告已锁定，请先解锁' })
      }

      const report = draft.reportData || {}
      report.reportId = draft.reportId
      const result = generatePdfTask(report)
      return { success: true, taskId: result.taskId, status: result.status }
    } catch (err) {
      console.error('创建PDF任务失败:', err)
      return reply.status(500).send({ success: false, error: '创建PDF任务失败' })
    }
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
