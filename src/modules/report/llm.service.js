/**
 * LLM 大模型服务 v2
 * Node18原生fetch调用硅基流动 DeepSeek-V3
 * 降级：失败自动回模板
 */
const SILICONFLOW_BASE = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'
const SILICONFLOW_KEY = process.env.SILICONFLOW_API_KEY || ''
const MODEL = 'deepseek-ai/DeepSeek-V3'
const hasKey = !!SILICONFLOW_KEY

// 诊断：最后一次错误
let lastError = null

async function callLLM(systemPrompt, userPrompt) {
  if (!hasKey) { lastError = 'SILICONFLOW_API_KEY未配置'; return null }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const res = await fetch(`${SILICONFLOW_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + SILICONFLOW_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text()
      lastError = 'HTTP ' + res.status + ': ' + text.slice(0, 200)
      console.error('[LLM] 非200响应:', lastError)
      return null
    }

    const data = await res.json()
    return data.choices[0].message.content
  } catch (err) {
    lastError = err.cause ? (err.cause + ' ' + err.message) : err.message
    console.error('[LLM] 调用失败:', lastError)
    return null
  }
}

export function isLLMAvailable() {
  return hasKey
}

export function getLLMLastError() {
  return lastError
}

/**
 * AI生成报告核心分析
 */
export async function generateAIInsights(input) {
  const systemPrompt = '你是启信通的智能纠纷诊断AI。只返回合法JSON。'

  const userPrompt = `分析以下维权纠纷，输出JSON：

**纠纷信息：**
- 类型：${input.sceneLabel || input.scene || '未指定'}
- 争议金额：${input.amount || '未知'}
- 争议焦点：${(input.focus || []).join('、') || '未填写'}
- 当前阶段：${input.status || '未知'}
- 补充描述：${input.memo || '无'}
- 已有证据：${(input.evidence || []).map(e => typeof e === 'string' ? e : (e.label || e.id || '')).join('、') || '无'}

返回严格JSON：
{
  "disputeCore": "争议本质（20字内）",
  "keyIssues": ["问题1","问题2","问题3"],
  "analysis": "深度分析（150-200字）",
  "riskAssessment": {"level": "高/中/低", "points": ["风险点"]},
  "strengths": ["有利因素"],
  "weaknesses": ["不利因素"],
  "strategy": "最优策略（100字）",
  "nextSteps": ["行动1","行动2","步骤3"],
  "tips": "一句话提醒"
}`

  const result = await callLLM(systemPrompt, userPrompt)
  if (!result) return null

  try {
    return JSON.parse(result)
  } catch (e) {
    console.error('[LLM] JSON解析失败:', e.message, result.slice(0, 200))
    return null
  }
}
