/**
 * 证据分析服务
 * 入口：analyzeEvidence(text, type, options)
 * 返回结构化分析结果
 */
import { extractChatNodes, extractPromises, assessChatQuality } from './nlp.service.js'
import { extractContractInfo, extractTransferInfo, verifyTransferConsistency } from './ocr.service.js'

export interface AnalyzeOptions {
  draftId?: string
  claimAmount?: string
  claimCounterparty?: string
  scene?: string
}

export interface AnalysisResult {
  qualityLabel: string       // 充足/基本可用/有限可用/不足
  qualityReason: string      // 质量说明
  credibility: string        // 高/中/低
  evidenceLevel: string      // A/B/C
  // 聊天记录专属
  nodes?: Array<{
    time: string
    speaker: string
    content: string
    type: string
  }>
  promises?: string[]
  // 合同专属
  contractInfo?: {
    parties: string[]
    date: string
    amount: string
  }
  clauses?: Array<{ clause: string; type: string }>
  // 转账专属
  transferInfo?: {
    amount: string
    time: string
    counterparty: string
    channel: string
  }
  verification?: {
    consistent: boolean
    issues: string[]
  }
}

/**
 * 证据分析主函数
 */
export function analyzeEvidence(
  text: string,
  type: 'chat_record' | 'contract' | 'transfer_record',
  options: AnalyzeOptions = {}
): AnalysisResult {
  if (type === 'chat_record') {
    return analyzeChatRecord(text, options)
  } else if (type === 'contract') {
    return analyzeContract(text, options)
  } else if (type === 'transfer_record') {
    return analyzeTransferRecord(text, options)
  }

  return {
    qualityLabel: '不足',
    qualityReason: '不支持的证据类型',
    credibility: '低',
    evidenceLevel: 'C',
  }
}

/**
 * 分析聊天记录
 */
function analyzeChatRecord(text: string, options: AnalyzeOptions): AnalysisResult {
  const nodes = extractChatNodes(text)
  const promises = extractPromises(text)
  const quality = assessChatQuality(nodes, promises)

  // 风险提示检测
  const riskNodes = nodes.filter(n => n.type === '风险提示' && n.speaker === '对方')

  let qualityLabel = quality.level
  let qualityReason = quality.reason

  // 降级条件
  if (riskNodes.length > 0 && nodes.filter(n => n.speaker === '对方').length > riskNodes.length * 2) {
    // 对方有风险提示但承诺更多，整体仍有价值
    qualityReason += '（注意：对方有' + riskNodes.length + '条风险提示，请留意对主张的影响）'
  }

  return {
    qualityLabel,
    qualityReason,
    credibility: quality.credibility,
    evidenceLevel: quality.evidenceLevel,
    nodes: nodes.slice(0, 20),    // 最多20条
    promises: promises.slice(0, 10), // 最多10条
  }
}

/**
 * 分析合同文件
 */
function analyzeContract(text: string, options: AnalyzeOptions): AnalysisResult {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const { parties, date, amount, clauses } = extractContractInfo(lines)

  // 评估合同质量
  let qualityLabel: string
  let qualityReason: string
  let evidenceLevel: string
  let credibility = '中'

  if (clauses.length === 0) {
    qualityLabel = '有限可用'
    qualityReason = '未能识别到关键条款，请确保图片文字清晰可读，或尝试手动描述合同内容'
    evidenceLevel = 'C'
  } else if (clauses.length <= 2) {
    qualityLabel = '有限可用'
    qualityReason = `识别到${clauses.length}条关键条款，建议补充合同完整内容以提高证据完整性`
    evidenceLevel = 'C'
    credibility = '低'
  } else if (clauses.length <= 5) {
    qualityLabel = '基本可用'
    qualityReason = `识别到${clauses.length}条关键条款（${clauses.map(c => c.type).join('、')}），合同可用`
    evidenceLevel = 'B'
  } else {
    qualityLabel = '充足'
    qualityReason = `识别到${clauses.length}条关键条款，涵盖${Array.from(new Set(clauses.map(c => c.type))).join('、')}等，证据完整性较高`
    evidenceLevel = 'B'
    credibility = '高'
  }

  // 格式条款检测（对消费者不利但需特别标注）
  const oppressiveClauses = clauses.filter(c => c.type === '格式条款' || c.type === '退款限制')
  if (oppressiveClauses.length > 0) {
    qualityReason += `（注意：合同中存在${oppressiveClauses.length}条格式/退款限制条款，建议重点标注）`
  }

  return {
    qualityLabel,
    qualityReason,
    credibility,
    evidenceLevel,
    contractInfo: { parties, date, amount },
    clauses,
  }
}

/**
 * 分析转账记录
 */
function analyzeTransferRecord(text: string, options: AnalyzeOptions): AnalysisResult {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const transferInfo = extractTransferInfo(lines)
  const verification = verifyTransferConsistency(
    transferInfo,
    options.claimAmount,
    options.claimCounterparty
  )

  // 评估转账记录质量
  let qualityLabel: string
  let qualityReason: string
  let evidenceLevel: string
  let credibility = '中'

  if (!transferInfo.amount) {
    qualityLabel = '不足'
    qualityReason = '未能识别到有效金额信息，请确保图片中金额清晰可见'
    evidenceLevel = 'C'
    credibility = '低'
  } else if (!transferInfo.time) {
    qualityLabel = '有限可用'
    qualityReason = `识别到转账金额${transferInfo.amount}元，但未识别到转账时间，建议补充时间信息`
    evidenceLevel = 'C'
  } else if (!transferInfo.counterparty) {
    qualityLabel = '有限可用'
    qualityReason = `识别到转账${transferInfo.amount}元（${transferInfo.time}），但未识别到收款方，建议补充对方账户信息`
    evidenceLevel = 'C'
  } else {
    qualityLabel = '基本可用'
    qualityReason = `转账记录完整：${transferInfo.amount}元付给"${transferInfo.counterparty}"（${transferInfo.time}）`
    evidenceLevel = 'B'
    if (transferInfo.channel) {
      qualityReason += `，渠道：${transferInfo.channel}`
    }
  }

  // 一致性核验结果附加
  if (!verification.consistent) {
    qualityReason += `（核验提示：${verification.issues.join('；')}）`
  }

  return {
    qualityLabel,
    qualityReason,
    credibility,
    evidenceLevel,
    transferInfo,
    verification,
  }
}
