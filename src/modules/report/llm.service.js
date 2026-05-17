/**
 * LLM 大模型服务
 * 硅基流动 DeepSeek-V3 → 报告AI分析
 * 调用失败自动降级到模板数据
 */
import axios from 'axios'

const SILICONFLOW_BASE = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'
const SILICONFLOW_KEY = process.env.SILICONFLOW_API_KEY || ''
const MODEL = 'deepseek-ai/DeepSeek-V3-0324'

let hasKey = !!SILICONFLOW_KEY

/**
 * 调用LLM（带30秒超时+自动降级）
 */
async function callLLM(systemPrompt, userPrompt) {
  if (!hasKey) return null

  try {
    const res = await axios.post(
      `${SILICONFLOW_BASE}/chat/completions`,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': 'Bearer ' + SILICONFLOW_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )
    return res.data.choices[0].message.content
  } catch (err) {
    console.error('[LLM] 调用失败:', err.message)
    return null
  }
}

export function isLLMAvailable() {
  return hasKey
}

/**
 * AI生成报告核心分析（四模块）
 * 返回 JSON 字符串 → 解析后合并到模板报告
 */
export async function generateAIInsights(input) {
  const systemPrompt = `你是启信通的智能纠纷诊断AI。你只返回合法JSON，不输出任何其他内容。`
  
  const userPrompt = `分析以下维权纠纷，输出JSON：

**纠纷信息：**
- 类型：${input.sceneLabel || input.scene || '未指定'}
- 争议金额：${input.amount || '未知'}
- 争议焦点：${(input.focus || []).join('、') || '未填写'}
- 当前阶段：${input.status || '未知'}
- 补充描述：${input.memo || '无'}
- 已有证据：${(input.evidence || []).map(e => typeof e === 'string' ? e : (e.label || e.id || '')).join('、') || '无'}

请返回严格JSON：
{
  "disputeCore": "争议本质一句话（20字内）",
  "keyIssues": ["核心问题1", "核心问题2", "核心问题3"],
  "analysis": "争议深度分析（150-200字，从事实、证据、法律三层面分析）",
  "riskAssessment": {"level": "高/中/低", "points": ["风险点1", "风险点2"]},
  "strengths": ["有利因素1", "有利因素2"],
  "weaknesses": ["不利因素1", "不利因素2"],
  "strategy": "最优策略建议（100字）",
  "nextSteps": ["立即行动1", "立即行动2", "后续步骤3"],
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
