/**
 * NLP 服务 — 聊天记录关键句提取
 * 模式：基于关键词正则匹配 + 时间戳提取
 * 后续可替换为真实的 NLP/大模型 API
 */

// 时间戳模式
const TIME_PATTERNS = [
  /(\d{1,2}[/\-]\d{1,2}\s+\d{1,2}:\d{2})/g,   // 01.10 10:23 / 01-10 10:23
  /(\d{4}[/\-]\d{1,2}[/\-]\d{1,2}\s+\d{1,2}:\d{2})/g, // 2024.01.10 10:23
  /(\d{1,2}:\d{2})/g,                            // 10:23
]

// 说话人识别关键词
const SPEAKER_PATTERNS = {
  opponent: [/对方[：:：]?/, /^对方\s*[,，]?/, /^(商家|客服|销售|机构|医生|治疗师|顾问|教练|老师)[：:：]?\s*/],
  user: [/^用户[：:：]?/, /^我[：:：]?/, /^(消费者|客户|学员|患者|投资者)[：:：]?\s*/],
}

// 承诺性表述关键词
const PROMISE_KEYWORDS = [
  '保证', '一定', '100%', '包过', '稳赚', '绝对', '肯定', '必须',
  '承诺', '答应', '保证', '说到做到', '绝无例外', '不过退款',
  '无效果退款', '不满意退款', '不满意包退', '名校', '名师',
  '985', '211', '顶级', '资深', '权威',
]

// 退款/投诉关键词
const COMPLAINT_KEYWORDS = [
  '退款', '退钱', '退货', '取消', '投诉', '举报', '要退款',
  '要求退款', '我要退款', '申请退款', '协商退款', '退课',
  '退费', '退卡', '解除', '终止', '还钱', '还我',
]

// 风险/欺诈关键词
const RISK_KEYWORDS = [
  '高风险', '亏损', '本金损失', '不保证', '投资有风险',
  '可能亏损', '不承诺', '例外', '视情况',
]

interface ChatNode {
  time: string
  speaker: string
  content: string
  type: string
}

/**
 * 从聊天文本中提取节点
 * @param text - 原始聊天文本（多行，每行一条消息）
 * @returns 提取的对话节点数组
 */
export function extractChatNodes(text: string): ChatNode[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const nodes: ChatNode[] = []

  for (const line of lines) {
    const node = parseChatLine(line)
    if (node) nodes.push(node)
  }

  return nodes
}

/**
 * 从聊天内容中提取承诺性表述
 * @param text - 原始聊天文本
 * @returns 承诺列表
 */
export function extractPromises(text: string): string[] {
  const promises: string[] = []
  const seen = new Set<string>()

  for (const kw of PROMISE_KEYWORDS) {
    const regex = new RegExp(`[^。！？.!?\\n]{5,50}${kw}[^。！？.!?\\n]{0,30}`, 'gi')
    let match
    while ((match = regex.exec(text)) !== null) {
      const sentence = match[0].trim()
      if (!seen.has(sentence) && sentence.length >= 6) {
        seen.add(sentence)
        promises.push(sentence)
      }
    }
  }

  return promises.slice(0, 10) // 最多10条
}

/**
 * 判断对话节点类型
 */
function classifyNode(content: string, speaker: string): string {
  const text = content
  if (PROMISE_KEYWORDS.some(kw => text.includes(kw))) return '承诺性表述'
  if (COMPLAINT_KEYWORDS.some(kw => text.includes(kw))) return '退款要求/投诉'
  if (speaker === '对方' && RISK_KEYWORDS.some(kw => text.includes(kw))) return '风险提示'
  if (/合同|协议|签字|签/.test(text)) return '合同相关'
  if (/退款|退费|取消|终止/.test(text)) return '退款协商'
  return '普通沟通'
}

/**
 * 解析单行聊天记录
 */
function parseChatLine(line: string): ChatNode | null {
  let time = ''
  let speaker = '对方'
  let content = line

  // 提取时间戳
  for (const pattern of TIME_PATTERNS) {
    const match = line.match(pattern)
    if (match) {
      time = match[0].replace(/\//g, '.').replace(/-/g, '.')
      break
    }
  }

  // 识别说话人
  for (const opp of SPEAKER_PATTERNS.opponent) {
    if (opp.test(line)) {
      speaker = '对方'
      content = line.replace(opp, '')
      break
    }
  }
  for (const usr of SPEAKER_PATTERNS.user) {
    if (usr.test(line)) {
      speaker = '用户'
      content = line.replace(usr, '')
      break
    }
  }

  // 去掉时间戳前缀
  for (const pattern of TIME_PATTERNS) {
    content = content.replace(pattern, '').trim()
  }

  // 去掉"对方"或"用户"残留
  content = content.replace(/^(对方|用户)[：:：]?\s*/i, '').trim()

  if (!content || content.length < 2) return null

  return {
    time: time || '时间未知',
    speaker,
    content: content.length > 200 ? content.slice(0, 200) + '…' : content,
    type: classifyNode(content, speaker),
  }
}

/**
 * 评估聊天记录质量
 */
export function assessChatQuality(nodes: ChatNode[], promises: string[]): { level: string; reason: string; credibility: string; evidenceLevel: string } {
  const total = nodes.length
  const userNodes = nodes.filter(n => n.speaker === '用户').length
  const opponentNodes = nodes.filter(n => n.speaker === '对方').length
  const promiseCount = promises.length

  // 证据等级
  let evidenceLevel = 'C'
  let credibility = '低'
  let reason = ''
  let level = '不足'

  if (total === 0) {
    reason = '未能识别到有效对话内容，请确保截图包含完整聊天文字'
    level = '严重不足'
  } else if (total < 3) {
    reason = `仅识别到${total}条消息，内容过少，建议补充完整对话截图`
    level = '不足'
    evidenceLevel = 'C'
  } else if (total < 10) {
    reason = `识别到${total}条消息，包含${promiseCount}条承诺性表述，但建议补充更多对话以呈现完整上下文`
    level = '有限可用'
    evidenceLevel = 'B'
    credibility = '中等'
  } else if (promiseCount >= 2 && opponentNodes >= 3) {
    reason = `识别到${total}条消息，包含${promiseCount}条明确承诺，对话链条完整，证据可用性较高`
    level = '较好'
    evidenceLevel = 'B'
    credibility = '较高'
  } else {
    reason = `识别到${total}条消息，上下文基本完整，包含${promiseCount}条承诺性表述，证据可用`
    level = '可用'
    evidenceLevel = 'B'
    credibility = '中等'
  }

  // 风险提示
  if (nodes.some(n => n.type === '风险提示' && n.speaker === '对方')) {
    reason += '（对方已有风险提示，对主张不利）'
  }

  return { level, reason, credibility, evidenceLevel }
}
