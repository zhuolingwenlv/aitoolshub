/**
 * 证据分析路由
 * POST /api/v1/evidence/analyze
 * POST /api/v1/evidence/upload
 */
import { analyzeEvidence } from './evidence.service.js'
import { scanBannedWords } from '../../data/banned-words.js'

export async function evidenceRoutes(fastify) {

  // 证据文件上传
  // 支持两种格式：
  // 1. multipart/form-data（微信 wx.uploadFile）
  // 2. application/json with base64（绕过某些平台的 multipart 限制）
  fastify.post('/upload', async (request, reply) => {
    try {
      let fileId, base64Data, mimeType

      // 方式1：multipart（已注册 @fastify/multipart）
      if (request.isMultipart()) {
        const parts = request.parts()
        for await (const part of parts) {
          if (part.type === 'file') {
            const buffer = await part.toBuffer()
            base64Data = buffer.toString('base64')
            mimeType = part.mimetype || 'image/jpeg'
            fileId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
            break
          }
        }
      } else {
        // 方式2：JSON base64
        const body = request.body || {}
        base64Data = body.base64
        mimeType = body.mimeType || 'image/jpeg'
        fileId = body.fileId || `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      }

      if (!base64Data) {
        return reply.status(400).send({ success: false, error: '缺少文件数据' })
      }

      // 实际场景应存储到云存储（微信云开发/OSS/S3）
      // 这里返回模拟 URL，分析功能在 /analyze 端完成
      const url = `https://storage.example.com/evidence/${fileId}`
      return {
        success: true,
        url,
        fileId,
        mimeType,
        // 前端 showAnalysisResult 需要这些字段
        result: {
          url,
          quality: '⚠️ 待评估',
          level: 'C级 ★★★',
          note: '文件已上传，请稍后分析',
          keyTerms: [],
        },
      }
    } catch (err) {
      console.error('上传失败:', err)
      return reply.status(500).send({ success: false, error: '上传失败' })
    }
  })

  // 证据分析
  fastify.post('/analyze', async (request, reply) => {
    const body = request.body || {}

    const {
      draft_id,
      scene,
      evidence_type,
      file_url,
      text,
      claim_amount,
      claim_counterparty,
    } = body

    // 参数校验
    if (!evidence_type) {
      return reply.status(400).send({
        success: false,
        error: '缺少必填参数：evidence_type',
      })
    }

    const validTypes = ['chat_record', 'contract', 'transfer_record']
    if (!validTypes.includes(evidence_type)) {
      return reply.status(400).send({
        success: false,
        error: `不支持的证据类型：${evidence_type}，支持：${validTypes.join('、')}`,
      })
    }

    // 优先使用 text 参数（用户描述/图片描述），其次用 file_url
    const inputText = (text || file_url || '').trim()
    if (!inputText) {
      return reply.status(400).send({
        success: false,
        error: '缺少证据内容（text 或 file_url）',
      })
    }

    // 禁语扫描
    const scan = scanBannedWords(inputText)
    if (scan.blocked) {
      return reply.status(400).send({
        success: false,
        error: `内容包含敏感词汇：${scan.found.join('、')}`,
      })
    }

    try {
      const result = analyzeEvidence(inputText, evidence_type, {
        draftId: draft_id,
        claimAmount: claim_amount,
        claimCounterparty: claim_counterparty,
        scene,
      })

      // 如果传入了 draft_id，可选保存到 mockStore
      if (draft_id) {
        try {
          const { mockDb } = await import('../../db/mockStore.js')
          const existing = mockDb.evidenceAnalysis.get(draft_id) || {}
          mockDb.evidenceAnalysis.set(draft_id, {
            ...existing,
            [evidence_type]: result,
            updatedAt: new Date().toISOString(),
          })
        } catch (_) {
          // mockStore 可能没有 evidenceAnalysis Map，降级不报错
        }
      }

      return {
        success: true,
        result,
      }
    } catch (err) {
      console.error('❌ 证据分析失败:', err)
      return reply.status(500).send({
        success: false,
        error: '证据分析失败，请稍后重试',
      })
    }
  })
}
