/**
 * OCR 服务 — 合同/转账截图文字识别
 * 目前为模拟实现，基于文字特征提取
 * 后续可接入：阿里云 OCR / 腾讯 OCR / 百度 OCR API
 */

export interface OcrResult {
  rawText: string
  confidence: number
  lines: string[]
}

/**
 * 模拟 OCR 识别（基于文本特征提取）
 * @param text - 用户填写的图片描述或图片URL（暂时支持直接传入文字）
 * @param type - 'contract' | 'transfer'
 */
export async function performOcr(text: string, type: 'contract' | 'transfer'): Promise<OcrResult> {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  // 模拟置信度（真实场景由 OCR API 返回）
  const confidence = lines.length > 5 ? 0.92 : lines.length > 2 ? 0.78 : 0.55

  return {
    rawText: text,
    confidence,
    lines,
  }
}

/**
 * 提取合同关键信息
 */
export function extractContractInfo(lines: string[]): {
  parties: string[]
  date: string
  amount: string
  clauses: { clause: string; type: string }[]
} {
  const parties: string[] = []
  const clauses: { clause: string; type: string }[] = []
  let date = ''
  let amount = ''

  // 提取签约方
  for (const line of lines) {
    const partyMatch = line.match(/(甲方|乙方|消费者|用户|学员|患者|投资者|商家|机构|平台|销售方)[：:：]\s*([^\n，,。]{2,20})/i)
    if (partyMatch && !parties.includes(partyMatch[2])) {
      parties.push(partyMatch[2])
    }
  }

  // 提取日期
  for (const line of lines) {
    const dateMatch = line.match(/(\d{4}[年\-/\.]\d{1,2}[月\-/\.]\d{1,2}[日]?)/)
    if (dateMatch) {
      date = dateMatch[1].replace(/\./g, '-')
      break
    }
  }

  // 提取金额
  for (const line of lines) {
    const amtMatch = line.match(/(￥|¥|rmb|金额|总计|总额|合同价|价款)[：:：]?\s*(\d+[\.,]?\d*(?:\.\d{1,2})?)/i)
    if (amtMatch) {
      amount = amtMatch[2].replace(/,/g, '')
      break
    }
  }

  // 条款库匹配
  const CLAUSE_KEYWORDS = {
    '退款限制': ['概不退款', '一经出售', '不予退款', '不支持退', '退款扣除', '退费扣除'],
    '违约金条款': ['违约金', '违约责任', '扣除', '赔偿', '承担违约'],
    '格式条款': ['甲方', '乙方', '本协议', '双方同意', '任何情况下'],
    '口头承诺': ['当时说', '当时承诺', '口头', '说好', '当时告知'],
    '争议解决': ['管辖', '仲裁', '起诉', '诉讼', '法院'],
    '风险自担': ['投资有风险', '风险自担', '盈亏自负', '不保证收益', '可能亏损'],
  }

  for (const line of lines) {
    for (const [clauseType, keywords] of Object.entries(CLAUSE_KEYWORDS)) {
      if (keywords.some(kw => line.includes(kw))) {
        clauses.push({ clause: line.slice(0, 100), type: clauseType })
        break
      }
    }
  }

  return { parties, date, amount, clauses }
}

/**
 * 提取转账记录关键信息
 */
export function extractTransferInfo(lines: string[]): {
  amount: string
  time: string
  counterparty: string
  channel: string
} {
  let amount = ''
  let time = ''
  let counterparty = ''
  let channel = ''

  // 提取金额
  for (const line of lines) {
    const amtMatch = line.match(/(￥|¥|实际到账|转账金额|交易金额|付款金额)[：:：]?\s*(\d+[\.,]?\d*(?:\.\d{1,2})?)/i)
      || line.match(/(^|\s)(\d+[\.,]?\d*(?:\.\d{1,2})?)\s*(元|块)/)
    if (amtMatch && !amount) {
      amount = (amtMatch[2] || amtMatch[1]).replace(/,/g, '')
      if (amount.length > 10) amount = '' // 过滤误识别
    }
  }

  // 提取时间
  for (const line of lines) {
    const timeMatch = line.match(/(\d{4}[年\-/\.]\d{1,2}[月\-/\.]\d{1,2}[日]?\s+\d{1,2}:\d{2})/)
      || line.match(/(\d{1,2}[/\-]\d{1,2}\s+\d{1,2}:\d{2})/)
    if (timeMatch && !time) {
      time = timeMatch[1].replace(/\//g, '-')
      break
    }
  }

  // 提取对方账户
  for (const line of lines) {
    const partyMatch = line.match(/(对方|收款方|转入|汇入|目标账户)[：:：]\s*([^\n，,]{2,30})/i)
      || line.match(/(商家|机构|公司|平台)[：:：]\s*([^\n，,]{2,20})/i)
    if (partyMatch && !counterparty) {
      counterparty = partyMatch[2]
      break
    }
  }

  // 识别转账渠道
  for (const line of lines) {
    if (/支付宝|微信|银行转账|转账汇款/.test(line)) {
      channel = line.match(/(支付宝|微信支付|银行转账|转账汇款)/)?.[1] || ''
      break
    }
  }

  return { amount, time, counterparty, channel }
}

/**
 * 核验转账记录与合同/主张的一致性
 */
export function verifyTransferConsistency(
  transferInfo: { amount: string; time: string; counterparty: string },
  claimAmount?: string,
  claimCounterparty?: string
): { consistent: boolean; issues: string[] } {
  const issues: string[] = []

  if (claimAmount && transferInfo.amount) {
    const tAmt = parseFloat(transferInfo.amount)
    const cAmt = parseFloat(claimAmount.replace(/,/g, ''))
    if (!isNaN(tAmt) && !isNaN(cAmt) && Math.abs(tAmt - cAmt) > 1) {
      issues.push(`转账金额(${tAmt})与主张金额(${cAmt})存在差异`)
    }
  }

  if (claimCounterparty && transferInfo.counterparty) {
    if (!transferInfo.counterparty.includes(claimCounterparty) && !claimCounterparty.includes(transferInfo.counterparty)) {
      issues.push(`收款方("${transferInfo.counterparty}")与主张方("${claimCounterparty}")不完全匹配`)
    }
  }

  if (transferInfo.amount && !transferInfo.time) {
    issues.push('未识别到转账时间，建议补充标注每笔转账的发生时间')
  }

  return {
    consistent: issues.length === 0,
    issues,
  }
}
