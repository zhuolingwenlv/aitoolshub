// 报告路由 — MySQL存储版（P0修复）
import { generateReport } from './report.service.js'
import { scanBannedWords } from '../../data/banned-words.js'
import { generatePdfTask, getPdfTaskStatus } from './pdf.service.js'
import { saveReport, getReport as getReportDb, deleteReport, listReportsByUser, generateReportNo } from '../../db/store.js'

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

    // 提取userId
    let userId = 'anonymous'
    try {
      const token = request.headers.authorization?.replace('Bearer ', '')
      if (token) {
        const decoded = fastify.jwt.verify(token)
        userId = decoded.phone || decoded.id || 'anonymous'
      }
    } catch (_) { /* 未登录允许生成 */ }

    const reportId = 'R' + Date.now() + Math.random().toString(36).slice(2, 10)
    // 生成标准业务编号
    const reportNo = await generateReportNo()

    // P1-1：标记【生成中】(genStatus=1)，先落库锁定
    try {
      await saveReport(reportId, {
        userId,
        reportNo,
        scene,
        subType: subType || '',
        amount: amount || '待确认',
        focus: Array.isArray(focus) ? focus : [focus].filter(Boolean),
        status,
        evidence,
        memberLevel,
        reportData: null,
        isLocked: memberLevel === 0,
        genStatus: 1,    // 生成中
        reportVersion: 'blur',
        orderId: '',
      })
    } catch (e) {
      console.error('[Report] 初始化写入失败:', e)
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

      // 标记【已完成】(genStatus=2)
      await saveReport(reportId, {
        userId,
        reportData: report,
        genStatus: 2,
        reportVersion: memberLevel > 0 ? 'hd' : 'blur',
      })

      return { success: true, reportId, report: filterByVersion(report, memberLevel === 0) }
    } catch (err) {
      // 标记【生成失败】(genStatus=3)
      try { await saveReport(reportId, { genStatus: 3 }) } catch(_) {}
      console.error('❌ 报告生成失败:', err)
      var errMsg = err && err.message ? err.message : String(err)
      var errStack = err && err.stack ? err.stack.split('\\n').slice(0,3).join(' | ') : ''
      return reply.status(500).send({ success: false, error: '报告生成失败', reportId: reportId, detail: errMsg, stack: errStack })
    }
  })

  // ── 报告列表（GET /api/v1/report/list）
  fastify.get('/list', {
    preHandler: [fastify.authenticate],
  }, async function (request, reply) {
    try {
      var userId = ((request.user && request.user.phone) || (request.user && request.user.id) || '')
      var reports = await listReportsByUser(userId)
      return {
        success: true,
        reports: reports.map(function(r) { return {
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
            m6: r.reportData.m6 || {},
          } : {},
        }; }),
      }
    } catch(e) {
      console.error('[Report] 列表查询失败:', e)
      return reply.status(500).send({ success: false, error: '查询失败' })
    }
  })

  // ── 查询报告（GET /api/v1/report/:reportId）
  fastify.get('/:reportId', async (request, reply) => {
    const { reportId } = request.params || {}

    if (!reportId) {
      return reply.status(400).send({ success: false, error: '缺少报告ID' })
    }

    // 判断用户是否已付费（token中查会员等级）
    let userLevel = 0
    try {
      const token = request.headers.authorization?.replace('Bearer ', '')
      if (token) {
        const decoded = fastify.jwt.verify(token)
        const { findUserByOpenid } = await import('../../db/store.js')
        const user = await findUserByOpenid(decoded.openid || decoded.phone || '')
        userLevel = user?.memberLevel || 0
      }
    } catch (_) {}

    try {
      const draft = await getReportDb(reportId)
      if (!draft) {
        return reply.status(404).send({ success: false, error: '报告不存在' })
      }

      const isBlur = draft.isLocked && userLevel === 0
      const reportData = draft.reportData || {}
      const filtered = isBlur ? filterBlur(reportData) : reportData

      return {
        success: true,
        report: {
          reportId: draft.reportId,
          reportNo: draft.reportNo || '',
          scene: draft.scene,
          ...filtered,
          locked: draft.isLocked,
          isLocked: draft.isLocked,
          genStatus: draft.genStatus,
          reportVersion: isBlur ? 'blur' : 'hd',
        },
      }
    } catch (err) {
      console.error('查询报告失败:', err)
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

// ============ 双版本过滤（P1-2） ============

// 生成时根据会员等级过滤返回内容
function filterByVersion(report, isBlur) {
  if (!isBlur) return report
  return filterBlur(report)
}

// 模糊版：隐藏关键金额/时间/姓名，加水印提示
function filterBlur(report) {
  if (!report) return report
  const r = JSON.parse(JSON.stringify(report)) // 深拷贝

  // 隐藏金额
  if (r.m7 && r.m7.claimAmount) r.m7.claimAmount = '***（付费解锁）'
  if (r.m2 && r.m2.evidenceList) {
    r.m2.evidenceList = r.m2.evidenceList.map(function(e) {
      return { ...e, amount: e.amount ? '***' : '', detail: e.detail ? '【付费解锁查看详情】' : '' }
    })
  }
  // 隐藏关键时间
  if (r.m8 && r.m8.timeline) {
    r.m8.timeline = r.m8.timeline.map(function(t) {
      return { ...t, date: t.date ? '****-**-**' : '', detail: '【付费解锁】' }
    })
  }
  // 加水印
  r._watermark = '【模糊预览版 · 付费解锁高清完整报告】'
  return r
}
