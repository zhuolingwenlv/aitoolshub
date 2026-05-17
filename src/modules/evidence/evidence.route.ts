/**
 * 证据分析路由 — 真实文件存储版（方案A·废弃Mock URL）
 * POST /api/v1/evidence/upload  — 接收multipart文件，存盘
 * POST /api/v1/evidence/analyze  — 分析证据文本
 */
import { analyzeEvidence } from './evidence.service.js'
import { scanBannedWords } from '../../data/banned-words.js'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = '/app/uploads/evidence'

// 确保上传目录存在
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
} catch (e) {
  console.error('[Evidence] 创建上传目录失败:', UPLOAD_DIR)
}

export async function evidenceRoutes(fastify) {

  // 证据文件上传（方案A：真实存盘）
  fastify.post('/upload', async (request, reply) => {
    try {
      let fileBuffer = null, originalName = '', mimeType = 'image/jpeg'
      let typeId = '', typeLabel = '', scene = ''

      if (request.isMultipart()) {
        const parts = request.parts()
        for await (const part of parts) {
          if (part.type === 'file') {
            fileBuffer = await part.toBuffer()
            mimeType = part.mimetype || 'image/jpeg'
            originalName = part.filename || 'upload.jpg'
          } else if (part.fieldname === 'typeId') {
            typeId = String(part.value || '')
          } else if (part.fieldname === 'typeLabel') {
            typeLabel = String(part.value || '')
          } else if (part.fieldname === 'scene') {
            scene = String(part.value || '')
          }
        }
      }

      if (!fileBuffer || fileBuffer.length === 0) {
        return reply.status(400).send({ success: false, error: '文件为空，请重新选择' })
      }

      // 安全检查：拒绝超大文件（25MB）
      if (fileBuffer.length > 25 * 1024 * 1024) {
        return reply.status(400).send({ success: false, error: '文件不能超过25MB，请压缩后上传' })
      }

      // 生成唯一文件名
      const hash = crypto.createHash('md5').update(fileBuffer).digest('hex').slice(0, 12)
      const ext = path.extname(originalName) || '.jpg'
      const fileName = `${Date.now()}_${hash}${ext}`
      const filePath = path.join(UPLOAD_DIR, fileName)

      // 写入磁盘
      fs.writeFileSync(filePath, fileBuffer)
      console.log('[Evidence] 文件已保存:', filePath, `${(fileBuffer.length / 1024).toFixed(1)}KB`)

      // 返回可访问URL（通过静态文件服务）
      const url = `/uploads/evidence/${fileName}`
      const fileId = `ev_${Date.now()}_${hash}`

      return {
        success: true,
        url,
        fileId,
        mimeType,
        typeId,
        typeLabel,
        result: {
          url,
          quality: '✅ 已上传',
          level: '待分析',
          note: '文件已成功上传至服务器，报告生成时将自动引用',
          keyTerms: [typeLabel || '证据', originalName],
        },
      }
    } catch (err) {
      console.error('[Evidence] 上传失败:', err)
      return reply.status(500).send({ success: false, error: '上传失败，请稍后重试' })
    }
  })

  // 证据分析（文本分析，不涉及图片）
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

    const inputText = (text || file_url || '').trim()
    if (!inputText) {
      return reply.status(400).send({
        success: false,
        error: '缺少证据内容（text 或 file_url）',
      })
    }

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

  // 静态文件服务：提供上传文件的访问
  fastify.get('/file/*', async (request, reply) => {
    const filePath = path.join(UPLOAD_DIR, path.basename(request.params['*'] || ''))
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: '文件不存在' })
    }
    return reply.sendFile(path.basename(filePath), UPLOAD_DIR)
  })
}
