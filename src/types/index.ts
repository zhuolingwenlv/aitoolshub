// 用户类型
export interface User {
  id: string
  phone: string
  nickname: string
  avatar?: string
  memberLevel: number  // 0=普通 1=季VIP 2=季SVIP 3=黑金年卡
  createdAt: string
}

// 报告生成请求
export interface ReportGenerateReq {
  scene: string        // edu/medical/estate/consumer/prepay/labor/loan/invest/property/traffic/other
  amount: string       // a/b/c/d/e/f/g
  dispute: string      // 各scene对应的具体争议ID
  status: string       // 1/2/3/4/5
  evidence: string     // comma-separated: contract,chat,payment,photo,receipt,certificate
  userId?: string      // 登录用户ID
  memberLevel?: number  // 会员等级（影响返回内容深度）
}

// 流程节点
export interface FlowNode {
  name: string
  status: 'done' | 'current' | 'future'
  guide?: string
}

// 证据-争议焦点关联分析
export interface EvidenceDisputePoint {
  evidence: string
  status: '已有✅' | '建议补充'
  desc: string
}

// 宏观数据
export interface MacroData {
  winRate: string        // 胜诉率
  avgCycle: string       // 平均周期
  avgCompensation: string // 平均获赔
  keyFactor: string      // 关键因素
  regionData?: {         // SVIP+ 地域差异
    tier1: { cycle: string; mediationRate: string; supportRate: string }
    newTier: { cycle: string; mediationRate: string; supportRate: string }
  }
  trendData?: {           // SVIP+ 时间趋势
    year: string
    fullSupport: string
    partialSupport: string
    reject: string
  }[]
}

// 顾问复核
export interface ConsultantReview {
  score: number         // 1-100
  summary: string
  strengths: string[]
  risks: string[]
  suggestions: string[]
  reviewerName?: string
  reviewerCode?: string
  reviewTime?: string
}

// 证据星级
export interface EvidenceStar {
  name: string
  level: number         // 1-5（0表示缺失）
  desc: string
}

// 报告生成响应
export interface ReportGenerateRes {
  success: boolean
  reportId: string

  // 争议分析（所有会员；普通用户为空字符串，前端展示表格）
  disputeAnalysis?: string

  // 法条推荐（所有会员）
  laws: LawItem[]

  // 宏观数据（所有会员；SVIP+含地域和时间维度）
  macroData: MacroData

  // 证据星级（SVIP+）
  evidenceStars?: EvidenceStar[]

  // 证据-争议焦点关联（SVIP+）
  evidenceDisputeAnalysis?: EvidenceDisputePoint[]

  // 证据链完整度百分比（SVIP+）
  evidenceCompleteness?: number

  // 流程节点（含状态标记）（SVIP+）
  flowNodes?: FlowNode[]

  // 下一步最优路径（SVIP+）
  nextPathGuide?: string

  // 替代方案对比（黑金+）
  altPaths?: AltPath[]

  // 顾问复核（黑金+）
  consultantReview?: ConsultantReview
}

// 法条项
export interface LawItem {
  name: string
  clause: string
  desc: string
}

// 宏观数据
export interface MacroData {
  winRate: string        // 胜诉率
  avgCycle: string       // 平均周期
  avgCompensation: string // 平均获赔
  keyFactor: string      // 关键因素
}

// 替代方案
export interface AltPath {
  title: string
  desc: string
  cost: string
  timeline: string
}

// 顾问复核
export interface ConsultantReview {
  score: number         // 1-100
  summary: string
  strengths: string[]
  risks: string[]
  suggestions: string[]
}

// 证据星级
export interface EvidenceStar {
  name: string
  level: number         // 1-5
  desc: string
}
