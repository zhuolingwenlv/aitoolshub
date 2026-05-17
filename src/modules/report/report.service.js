/**
 * 报告生成服务
 * 会员等级解锁规则：
 * - memberLevel=0 普通用户：前2模块预览，后4模块锁定
 * - memberLevel=1 季VIP+：解锁争议焦点解析(module1)、当前阶段操作指引(module4)
 * - memberLevel=2 季SVIP+：解锁证据关联/风险提示(module1)、材料来源/获取途径(module2)、
 *                   证据链完整度(module2)、最优路径指引(module4)、宏观数据(module5)
 * - memberLevel=3 黑金年卡：解锁替代性方案对比(module4)
 */

import { getDisputeAnalyses } from '../../data/dispute-analysis-library.js';
import { matchRiskAlerts } from '../../data/risk-library.js';
import { getSolutionsForDispute, getApplicabilityGuide } from '../../data/solution-library.js';
import { LAW_LIBRARY, DEFAULT_LAWS } from '../../data/law-library.js';
import { PROCESS_NODES, STATUS_STAGE_MAP, getProcessPath } from '../../data/process-library.js';
import { getStats } from '../../data/statistics-database.js';
import { EVIDENCE_ITEMS } from '../../data/evidence-definitions.js';
import { generateAIInsights, isLLMAvailable, getLLMLastError } from './llm.service.js';

// 预构建 EVIDENCE_ITEMS_MAP（避免 import 时机问题）
const EVIDENCE_ITEMS_MAP = Object.fromEntries(EVIDENCE_ITEMS.map(e => [e.id, e]));

// ==================== 中文焦点名 → 英文键映射 ====================
const FOCUS_KEY_MAP = {
  education: {
    '机构拒绝退费': 'refuse-refund',
    '课程质量严重不符': 'quality-issues',
    '虚假宣传被骗': 'false-advertising',
    '课程质量不达标': 'quality-issues',
    '报了培训班想退费': 'false-advertising',
    '口头承诺未兑现': 'false-advertising',
    '机构关门跑路': 'refuse-refund',
    '想全额退费': 'refuse-refund',
    '换了老师/场地': 'quality-issues',
    '教练/老师资质问题': 'quality-issues',
    '贷款/分期付款': 'loan-related',
  },
  medical: {
    '效果严重不符': 'quality-issues',
    '出现并发症/后遗症': 'medical-risk',
    '费用不透明': 'overcharge',
    '机构不承认': 'refuse-refund',
    '要求赔偿': 'medical-risk',
    '做了医美项目效果不满意': 'quality-issues',
    '手术失败/并发症': 'medical-risk',
    '过度医疗/乱收费': 'overcharge',
    '虚假宣传被骗': 'false-advertising',
    '拒绝提供病历': 'medical-risk',
    '效果与承诺不符': 'effect-not-match',
    '收费不透明或乱收费': 'price-opaque',
    '服务质量低劣': 'service-quality',
    '虚假宣传或资质造假': 'false-advertising',
  },
  labor: {
    '工资拖欠': 'wage-arrears',
    '工资拖欠/克扣': 'wage-deduction',
    '不缴社保': 'labor-violation',
    '不缴社保/公积金': 'labor-violation',
    '不缴社保公积金': 'labor-violation',
    '违法辞退': 'illegal-dismissal',
    '违法辞退/赔偿争议': 'illegal-dismissal',
    '被违法辞退': 'illegal-dismissal',
    '被逼主动辞职': 'illegal-dismissal',
    '公司以各种理由克扣': 'wage-deduction',
    '口头辞退无书面': 'illegal-dismissal',
    '不给工资条/考勤记录': 'wage-deduction',
    '拒绝支付经济补偿': 'illegal-dismissal',
    '不承认工伤': 'work-injury',
    '工资被拖欠': 'wage-arrears',
    '不给发加班费': 'wage-deduction',
    '工伤不赔偿': 'work-injury',
  },
  housing: {
    '房东违约': 'landlord-breach',
    '房屋质量差': 'housing-quality',
    '不退押金': 'deposit-refund',
    '不给维修': 'housing-quality',
  },
  consumer: {
    '虚假宣传': 'false-advertising',
    '质量问题': 'quality-issues',
    '拒绝退货': 'refuse-refund',
    '商家跑路': 'merchant-run',
    '货不对板': 'quality-issues',
  },
  beauty: {
    '效果差': 'quality-issues',
    '毁容': 'medical-risk',
    '拒绝退款': 'refuse-refund',
    '强制消费': 'consumer-harm',
    '预付卡卷款': 'prepaid-risk',
  },
  loan: {
    '借钱不还': 'debt-dispute',
    '高利贷': 'usury',
    '暴力催收': 'debt-harm',
    '砍头息': 'usury',
  },
  franchise: {
    '合同纠纷': 'contract-dispute',
    '区域保护': 'franchise-risk',
    '虚假承诺': 'false-advertising',
    '保证金不退': 'deposit-refund',
  },
  esoteric: {
    '服务效果严重不符': 'quality-issues',
    '退款困难': 'refuse-refund',
    '虚假宣传/夸大功效': 'false-advertising',
    '诱导消费': 'forced-consumption',
    '合同纠纷': 'contract-dispute',
  },
  // ==================== 民间借贷纠纷 ====================
  civil_loan: {
    '对方不还款': 'not-repay',
    '利息有争议': 'interest-dispute',
    '没有借条/凭证': 'no-contract',
    '催收骚扰': 'harassment',
  },
  debt: {
    '对方不还款': 'not-repay',
    '利息有争议': 'interest-dispute',
    '没有借条/凭证': 'no-contract',
    '催收骚扰': 'harassment',
  },
  investment: {
    '收益与承诺严重不符': 'return-not-match',
    '本金无法取回': 'principal-locked',
    '交易异常或无法操作': 'transaction-abnormal',
    '对方失联或跑路': 'party-missing',
  },
  jade: {
    '货不对板': 'quality-issues',
    '价格虚高': 'overcharge',
    '虚假宣传': 'false-advertising',
    '拒绝退货': 'refuse-refund',
    '以假充真': 'counterfeit',
  },
  marriage: {
    '服务欠佳': 'service-quality',
    '退款困难': 'refuse-refund',
    '虚假宣传': 'false-advertising',
    '诱导消费': 'forced-consumption',
    '合同纠纷': 'contract-dispute',
  },
  telecom: {
    '欺诈收款': 'fraud',
    '虚假宣传': 'false-advertising',
    '恶意扣费': 'overcharge',
    '维权困难': 'rights-protection',
    '诱导充值': 'forced-consumption',
  },
  online: {
    '货不对板': 'quality-issues',
    '虚假宣传': 'false-advertising',
    '拒绝退货': 'refuse-refund',
    '商家跑路': 'merchant-run',
    '付款不发货': 'fraud',
  },
  service: {
    '服务欠佳': 'service-quality',
    '退款困难': 'refuse-refund',
    '虚假宣传': 'false-advertising',
    '诱导消费': 'forced-consumption',
    '合同纠纷': 'contract-dispute',
  },
  other: {
    '合同纠纷': 'contract-dispute',
    '退款困难': 'refuse-refund',
    '虚假宣传': 'false-advertising',
    '质量问题': 'quality-issues',
    '其他情形': 'other',
  },
};

// 将中文焦点名转为英文键
function resolveFocusKeys(scene, focusNames) {
  if (!focusNames || !focusNames.length) return [];
  const sceneMap = FOCUS_KEY_MAP[scene] || {};
  return focusNames.map(f => sceneMap[f] || f);
}

// 中文证据名 → 英文证据ID（硬编码映射，确保可靠性）
const EVIDENCE_NAME_TO_ID = {
  '合同或协议': 'contract',
  '合同/协议': 'contract',
  '付款记录/收据': 'payment',
  '付款记录': 'payment',
  '聊天记录': 'chat',
  '宣传广告/承诺截图': 'ads',
  '宣传广告': 'ads',
  '对方联系方式或地址': 'contact',
  '对方联系方式': 'contact',
  '录音或录像': 'media',
  '录音': 'media',
  '现场照片/视频': 'photos',
  '照片': 'photos',
};

// ==================== 工具函数 ====================

function generateReportId() {
  const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `QX-${ts.slice(0, 8)}-${rand}`;
}

function safeText(text) {
  if (text == null) return '';
  const str = String(text);
  return str.replace(/[<>]/g, '').trim() || '';
}

function normalizeMaterialKey(label) {
  if (!label) return '';
  return label.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ==================== 证据材料推荐清单 ====================
// 各纠纷类型推荐证据（用于 buildModule2 的 suggest 列表）
const RECOMMENDED_EVIDENCE = {
  education: [
    { id: 'contract', label: '合同/协议', reason: '证明双方约定的服务内容和标准', channel: '微信聊天记录搜索"合同"、邮箱搜索、机构前台索取', priority: 1 },
    { id: 'payment', label: '付款记录', reason: '证明消费行为已发生', channel: '银行App或网点打印、支付App导出', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明签约前沟通内容和对方承诺', channel: '手机端截图+录屏+时间戳公证', priority: 2 },
    { id: 'ads', label: '宣传材料', reason: '证明广告宣传内容与实际差异', channel: '微信公众号历史文章、搜索引擎快照', priority: 1 },
    { id: 'invoice', label: '发票/收据', reason: '证明交易真实发生', channel: '向机构书面申请、税务局网站查验', priority: 2 },
  ],
  medical: [
    { id: 'contract', label: '合同/协议', reason: '证明服务内容和双方约定', channel: '向机构申请盖章原件', priority: 1 },
    { id: 'payment', label: '付款记录', reason: '证明实际支付金额', channel: '银行流水、支付App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明沟通经过和承诺内容', channel: '手机端截图', priority: 2 },
    { id: 'photos', label: '现场照片/视频', reason: '证明实际服务情况', channel: '手机相册原图', priority: 2 },
  ],
  labor: [
    { id: 'contract', label: '劳动合同', reason: '证明劳动关系和工资标准', channel: '向公司HR索取或社保局打印', priority: 1 },
    { id: 'salary', label: '工资流水', reason: '证明工资金额和拖欠情况', channel: '银行App或网点打印', priority: 1 },
    { id: 'social', label: '社保缴费记录', reason: '证明社保缴纳情况', channel: '当地社保局网站或App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明辞退通知和工资争议', channel: '手机端截图+录屏', priority: 2 },
  ],
  housing: [
    { id: 'contract_orig', label: '租赁合同', reason: '证明租赁条款和押金约定', channel: '签订的正本合同原件', priority: 1 },
    { id: 'transfer', label: '押金转账记录', reason: '证明押金金额和支付事实', channel: '银行流水或转账截图', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明维修请求和对方回复', channel: '手机端截图', priority: 2 },
    { id: 'photos', label: '房屋照片', reason: '证明房屋损坏或维修问题', channel: '手机相册原图', priority: 2 },
  ],
  consumer: [
    { id: 'contract', label: '合同/订单', reason: '证明交易条款和金额', channel: '线上订单截图或书面合同', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际支付金额', channel: '银行流水、支付App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明沟通经过和承诺内容', channel: '手机端截图', priority: 2 },
    { id: 'ads', label: '宣传材料', reason: '证明广告宣传与实际差异', channel: '宣传页面截图、朋友圈', priority: 2 },
  ],
  beauty: [
    { id: 'contract', label: '会员卡/服务合同', reason: '证明服务内容和退卡约定', channel: '签署的服务协议原件', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际充值金额', channel: '银行流水或支付App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明服务承诺和沟通经过', channel: '手机端截图', priority: 2 },
    { id: 'photos', label: '现场照片/视频', reason: '证明实际服务情况', channel: '手机相册', priority: 2 },
  ],
  franchise: [
    { id: 'contract', label: '加盟合同', reason: '证明加盟条款和费用约定', channel: '签署的正本合同原件', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明加盟费用实际支付金额', channel: '银行流水', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明签约前沟通和对方承诺', channel: '手机端截图', priority: 2 },
    { id: 'ads', label: '宣传材料', reason: '证明对方虚假宣传或承诺不符', channel: '招商手册、官网截图', priority: 2 },
  ],
  debt: [
    { id: 'contract', label: '借条/借款协议', reason: '证明借款金额、期限和利息约定', channel: '纸质借条或电子协议', priority: 1 },
    { id: 'transfer', label: '转账记录', reason: '证明实际出借金额和时间', channel: '银行流水', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明催款经过和对方回应', channel: '手机端截图', priority: 2 },
  ],
  telecom: [
    { id: 'contract', label: '服务协议', reason: '证明服务内容和收费标准', channel: '运营商营业厅或App获取', priority: 1 },
    { id: 'transfer', label: '扣费记录', reason: '证明恶意扣费金额和时间', channel: '银行流水或支付App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明诱导充值或虚假承诺', channel: '手机端截图', priority: 2 },
    { id: 'ads', label: '宣传材料', reason: '证明宣传内容与实际不符', channel: '宣传页面截图', priority: 2 },
  ],
  investment: [
    { id: 'contract', label: '投资协议', reason: '证明投资条款和收益约定', channel: '签署的投资合同原件', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际投资金额', channel: '银行流水', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明对方诱导宣传和收益承诺', channel: '手机端截图+录屏', priority: 2 },
    { id: 'ads', label: '宣传材料', reason: '证明高收益承诺和虚假宣传', channel: '宣传页面、直播录像', priority: 1 },
  ],
  jade: [
    { id: 'contract', label: '购买合同/收据', reason: '证明购买金额和退换货约定', channel: '购买时的合同或收据', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际购买金额', channel: '银行流水或支付App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明对方材质描述和承诺', channel: '手机端截图', priority: 2 },
    { id: 'photos', label: '商品照片/鉴定报告', reason: '证明货不对板或假货问题', channel: '收货时拍照留存', priority: 2 },
  ],
  marriage: [
    { id: 'contract', label: '服务合同', reason: '证明服务内容和退款约定', channel: '签署的服务协议原件', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际支付服务费用', channel: '银行流水', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明服务承诺和沟通经过', channel: '手机端截图', priority: 2 },
    { id: 'ads', label: '宣传材料', reason: '证明宣传内容与实际不符', channel: '宣传页面截图', priority: 2 },
  ],
  esoteric: [
    { id: 'contract', label: '服务合同', reason: '证明服务内容和退费约定', channel: '签署的服务协议原件', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际支付金额', channel: '银行流水或支付App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明服务承诺和沟通经过', channel: '手机端截图', priority: 2 },
    { id: 'ads', label: '宣传材料', reason: '证明宣传内容与实际不符', channel: '宣传页面或朋友圈截图', priority: 2 },
  ],
  online: [
    { id: 'contract', label: '订单记录', reason: '证明商品信息和交易条款', channel: '电商平台订单页截图', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际支付金额', channel: '银行流水或支付App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明与商家的沟通经过', channel: '平台聊天记录截图', priority: 2 },
    { id: 'photos', label: '商品照片', reason: '证明收到的商品与描述不符', channel: '收货时拍照留存', priority: 2 },
  ],
  service: [
    { id: 'contract', label: '服务合同', reason: '证明服务内容和退费约定', channel: '签署的服务协议原件', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际支付金额', channel: '银行流水或支付App', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明服务承诺和沟通经过', channel: '手机端截图', priority: 2 },
    { id: 'photos', label: '现场照片/视频', reason: '证明服务实际质量', channel: '手机相册', priority: 2 },
  ],
  other: [
    { id: 'contract', label: '合同/协议', reason: '证明双方权利义务', channel: '签署的合同原件', priority: 1 },
    { id: 'transfer', label: '付款记录', reason: '证明实际发生金额', channel: '银行流水', priority: 1 },
    { id: 'chat', label: '聊天记录', reason: '证明沟通经过', channel: '手机端截图', priority: 2 },
  ],
};

function getRecommendedEvidence(disputeType) {
  return RECOMMENDED_EVIDENCE[disputeType] || RECOMMENDED_EVIDENCE.other;
}

// 证据完整度评分（用于 buildModule2 completeness）
function getEvidenceCompleteness(disputeType, existingKeys) {
  const requiredMap = {
    education: ['contract', 'transfer', 'chat'],
    medical:   ['contract', 'transfer', 'chat'],
    beauty:    ['contract', 'transfer', 'chat'],
    esoteric:  ['contract', 'transfer', 'chat'],
    investment:['contract', 'transfer', 'chat'],
    franchise: ['contract', 'transfer', 'chat'],
    jade:      ['contract', 'transfer', 'chat'],
    marriage:  ['contract', 'transfer', 'chat'],
    telecom:   ['contract', 'transfer', 'chat'],
    labor:     ['contract', 'salary', 'social'],
    debt:      ['contract', 'transfer', 'chat'],
    housing:   ['contract_orig', 'transfer', 'chat'],
    consumer:  ['contract', 'transfer', 'chat'],
    online:    ['contract', 'transfer', 'chat'],
    service:   ['contract', 'transfer', 'chat'],
    other:     ['contract', 'transfer', 'chat'],
  };
  const required = requiredMap[disputeType] || requiredMap.other;
  const existingSet = new Set(existingKeys);
  const covered = required.filter(k => existingSet.has(k)).length;
  const total = required.length;
  const score = Math.round((covered / total) * 100);
  let level = '较低';
  if (score >= 90) level = '较高';
  else if (score >= 70) level = '中等';
  return { score, level, covered, total };
}

// ==================== 模块一生成函数 ====================
function buildModule1({ scene, amount, focusKeys, status, evidence, memberLevel }) {
  const base = {
    type: safeText(scene),
    amount: safeText(amount),
    status: safeText(status),
    focus: focusKeys.map(f => safeText(f)),
  };

  // 中文焦点名 → 英文键
  const englishFocusKeys = resolveFocusKeys(scene, focusKeys);

  // 季VIP+（memberLevel >= 1）：争议焦点解析
  let focusAnalysis = null;
  if (memberLevel >= 1 && englishFocusKeys.length > 0) {
    const analyses = getDisputeAnalyses(scene, englishFocusKeys);
    if (analyses && analyses.length > 0) {
      focusAnalysis = analyses.map(a => {
        const baseInfo = { focus: safeText(a.focusName) };
        const vipInfo = {
          definition: safeText(a.definition || ''),
          judgmentBasis: (a.judgmentBasis || []).map(b => safeText(b)),
          evidenceRelation: (a.evidenceRelation || []).map(er => ({
            material: safeText(er.material),
            status: er.status || '',
            note: safeText(er.note || ''),
          })),
          supplementGuide: {
            priority: a.supplementGuide?.priority || 2,
            channel: safeText(a.supplementGuide?.channel || ''),
            action: safeText(a.supplementGuide?.action || ''),
          },
        };
        return { ...baseInfo, ...vipInfo };
      });
    }
  }

  // 季SVIP+（memberLevel >= 2）：证据关联分析 + 潜在风险提示
  let evidenceCorrelation = null;
  let riskTips = null;
  if (memberLevel >= 2 && englishFocusKeys.length > 0) {
    // 将中文证据名转为英文ID
    const existingKeys = evidence.map(e => {
      const name = typeof e === 'string' ? e : e.id || '';
      return EVIDENCE_NAME_TO_ID[name] || name;
    });
    const existingKeysSet = new Set(existingKeys);

    // 证据-争议关联分析（遍历每个英文焦点键）
    const correlations = [];
    for (const focusKey of englishFocusKeys) {
      const analyses = getDisputeAnalyses(scene, [focusKey]);
      if (analyses && analyses.length > 0) {
        const a = analyses[0];
        const erList = a.evidenceRelation || [];
        const items = erList.map(er => {
          const matName = er.material;
          // 检查是否已有：精确匹配英文ID 或 中文名匹配
          const isExisting = existingKeysSet.has(matName) ||
            existingKeys.some(k => k === matName) ||
            (EVIDENCE_ITEMS_MAP[matName] && existingKeysSet.has(matName));
          return {
            material: safeText(matName),
            status: isExisting ? '已有' : '建议补充',
            note: safeText(er.note || ''),
          };
        });
        const existingCount = items.filter(i => i.status === '已有').length;
        const summary = existingCount >= items.length * 0.6
          ? '您的证据已覆盖该焦点的核心要素，具备基本的证明力'
          : '建议补充核心证据，可进一步提升该焦点的证明力';
        correlations.push({ focus: safeText(a.focusName || focusKey), items, summary });
      }
    }
    if (correlations.length > 0) evidenceCorrelation = correlations;

    // 潜在风险提示（使用第一个焦点英文键）
    const primaryFocusKey = englishFocusKeys[0];
    const risks = matchRiskAlerts(scene, primaryFocusKey, existingKeys, []);
    if (risks && risks.length > 0) {
      riskTips = risks.map(r => ({
        level: r.riskLevel || 'medium',
        title: safeText(r.riskTitle || ''),
        description: safeText(r.riskDescription || ''),
        suggestion: safeText(r.suggestion || ''),
      }));
    }
  }

  return {
    ...base,
    ...(focusAnalysis && { focusAnalysis }),
    ...(evidenceCorrelation && { evidenceCorrelation }),
    ...(riskTips && riskTips.length > 0 && { riskTips }),
  };
}

// ==================== 模块二生成函数 ====================
function buildModule2({ scene, evidence, memberLevel }) {
  // 用户上传的证据（原始数据为主，不被后端字典覆盖）
  const have = (evidence || []).map(e => ({
    name: e.label || e.id || '未知材料',
    tip: e.note || (e.keyTerms && e.keyTerms.length > 0 ? e.keyTerms.join('、') : '已上传'),
    level: e.level || '',
    quality: e.quality || '',
    keyTerms: e.keyTerms || [],
  }));

  // 建议补充（基于场景推荐清单，排除已上传的）
  const existingKeys = new Set((evidence || []).map(e => e.id || ''));
  const recommended = getRecommendedEvidence(scene);
  const suggest = recommended
    .filter(r => !existingKeys.has(r.id))
    .map(g => ({
      name: safeText(g.label),
      reason: safeText(g.reason || ''),
      channel: memberLevel >= 2 ? safeText(g.channel || '') : undefined,
      priority: memberLevel >= 2 ? (g.priority || 2) : undefined,
    }));

  // 证据完整度评估（memberLevel >= 2）
  let completeness = null;
  if (memberLevel >= 2) {
    const existingIds = (evidence || []).map(e => e.id || '');
    const comp = getEvidenceCompleteness(scene, existingIds);
    completeness = {
      score: comp.score,
      level: comp.level,
      focusCoverage: `${comp.covered}/${comp.total}个焦点核心要素已覆盖`,
      tip: comp.score < 70 ? '建议优先补充高优先级材料，可显著提升完整度' : '',
    };
  }

  return { have, suggest, ...(completeness && { completeness }) };
}

// ==================== 模块三生成函数 ====================
function buildModule3({ scene }) {
  const laws = LAW_LIBRARY[scene] || DEFAULT_LAWS;
  return (laws || []).map(l => ({
    name: safeText(l.name || ''),
    content: safeText(l.content || ''),
  }));
}

// ==================== 模块四生成函数 ====================
function buildModule4({ scene, status, focusKeys, amount, memberLevel }) {
  const processPath = getProcessPath(status);
  const base = { nodes: processPath || [] };

  // 季VIP+（memberLevel >= 1）：当前阶段操作指引
  let currentStageGuide = null;
  if (memberLevel >= 1 && processPath && processPath.length > 0) {
    const currentNode = processPath.find(n => n.current) || processPath[0];
    const tips = Array.isArray(currentNode.tips)
      ? currentNode.tips.join('；')
      : safeText(currentNode.tips || '');
    currentStageGuide = {
      stage: safeText(currentNode.name || ''),
      guide: safeText(currentNode.operation_guide || currentNode.guide || ''),
      tips,
    };
  }

  // 季SVIP+（memberLevel >= 2）：最优路径指引
  let optimalPathGuide = null;
  if (memberLevel >= 2) {
    let recommendation = '建议优先尝试低成本途径（投诉/调解），无效后再考虑诉讼';
    if (getApplicabilityGuide) {
      const guide = getApplicabilityGuide(scene, status);
      if (guide && guide.recommendation) recommendation = safeText(guide.recommendation);
    }
    optimalPathGuide = {
      recommendation,
      reason: safeText('基于您当前所处阶段和已有证据情况进行匹配'),
    };
  }

  // 黑金年卡（memberLevel >= 3）：替代性方案对比
  let alternatives = null;
  if (memberLevel >= 3) {
    const solutions = getSolutionsForDispute(scene);
    if (solutions && solutions.solutions && solutions.solutions.length > 0) {
      alternatives = solutions.solutions.map(s => ({
        path: safeText(s.pathName || ''),
        applicableCondition: safeText(s.applicableCondition || ''),
        processingCycle: safeText(s.processingCycle || ''),
        cost: safeText(s.cost || ''),
        requiredMaterials: (s.requiredMaterials || []).map(m => safeText(m)),
        steps: (s.steps || []).map(st => safeText(st)),
        tips: safeText(s.tips || ''),
      }));
    }
  }

  return {
    ...base,
    ...(currentStageGuide && { currentStageGuide }),
    ...(optimalPathGuide && { optimalPathGuide }),
    ...(alternatives && alternatives.length > 0 && { alternatives }),
  };
}

// ==================== 模块五生成函数 ====================
function buildModule5({ scene, memberLevel }) {
  // getStats 根据 memberLevel 返回不同内容：
  // 普通用户(memberLevel=0/1)：返回 basicItems 摘要
  // 季SVIP+(memberLevel >= 2)：返回完整统计数据
  return getStats(scene, memberLevel);
}

// ==================== 模块六生成函数（纠纷逻辑时间线）====================
function buildModule6({ scene, status, focusKeys, memo, evidence }) {
  // 时间线节点：来源优先级 A/B级证据 > 用户陈述
  // 当前端传来 memo（用户描述）+ status（处理阶段）→ 构建基础时间轴
  const nodes = [];

  // 从证据中提取时间戳构建节点（如果有）
  const evidenceTimestamps = [];
  if (evidence && evidence.length > 0) {
    evidence.forEach(ev => {
      if (ev.keyTerms && ev.keyTerms.length > 0) {
        // 从关键信息中尝试识别时间（简化：使用当前时间作为占位）
        evidenceTimestamps.push({
          time: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
          event: ev.label + '已上传',
          source: '证据材料',
          level: ev.level || 'C级 ★★★',
        });
      }
    });
  }

  // 用户描述作为陈述节点
  if (memo && memo.length > 0) {
    nodes.push({
      time: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
      event: memo.slice(0, 80) + (memo.length > 80 ? '…' : ''),
      source: '用户陈述',
      level: '用户陈述',
    });
  }

  // 处理阶段节点
  const stageLabels = { '与对方协商沟通': '协商', '向平台或监管部门投诉': '投诉', '咨询过专业人士': '咨询', '还没有尝试过任何方式': '尚未尝试' };
  const stageLabel = typeof status === 'string' ? (stageLabels[status] || status.split('、')[0] || '协商') : '协商';
  nodes.push({
    time: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
    event: `进入${stageLabel}阶段`,
    source: '用户填写',
    level: '用户陈述',
  });

  return { nodes, note: '实心节点 = 有A/B级证据支撑，空心节点 = 基于用户陈述' };
}

// ==================== 模块七生成函数（对方抗辩与特征分析）====================
function buildModule7({ scene, focusKeys, evidence, memberLevel }) {
  const englishFocusKeys = resolveFocusKeys(scene, focusKeys || []);
  const declares = [];
  const features = { favorable: [], unfavorable: [] };

  if (englishFocusKeys.length > 0) {
    englishFocusKeys.forEach(fk => {
      const analyses = getDisputeAnalyses(scene, [fk]);
      if (analyses && analyses.length > 0) {
        const a = analyses[0];
        declares.push({
          title: a.focusName + '相关抗辩',
          claim: `对方可能主张${a.definition ? a.definition.slice(0, 30) : '相关事实'}。`,
          analysis: '需结合具体证据情况判断其抗辩是否成立。',
        });
      }
    });
  }

  // 有利/不利因素（基于证据完整度）
  if (evidence && evidence.length > 0) {
    const keys = evidence.map(e => typeof e === 'string' ? e : e.id || '');
    if (keys.includes('payment') || keys.includes('transfer')) {
      features.favorable.push('有付款记录，锁定实际损失金额');
    }
    if (keys.includes('chat')) {
      features.favorable.push('有聊天记录，可还原部分沟通经过');
    }
    if (keys.includes('contract')) {
      features.favorable.push('有合同/协议，证明双方权利义务约定');
    }
    if (keys.length < 2) {
      features.unfavorable.push('证据种类较少，建议按证据推荐清单补充');
    }
  }

  return { declares, features };
}

// ==================== 模块八生成函数（重要声明）====================
const DECLARES = [
  '本档案由"启信通"自动生成，仅作为纠纷信息整理与证据分析工具，帮助您了解自己的纠纷情况和相关流程。',
  '本档案中的所有内容均基于您自行输入和上传的信息进行整理、分析和归纳。本系统未对您提供的信息进行真实性、合法性验证。',
  '本档案中的各项分析、索引、数据参考和流程参考均为技术性匹配与展示，不构成任何形式的法律意见、法律建议或个案判断。',
  '如您需要针对具体案情的法律意见，请咨询持有律师执业证的专业人士。',
  '您对本档案拥有完全的自主控制权，可随时在小程序中永久删除。删除后，服务器中与本档案相关的数据和文件将被彻底清除，不可恢复。',
];

function buildModule8() {
  return {
    declares: DECLARES,
    platform: '启信通 · 遇到纠纷，先理清事实',
  };
}

// ==================== 主入口 ====================
export async function generateReport({ scene, subType, amount, focus = [], status, evidence = [], memberLevel = 0, memo = '' }) {
  const focusKeys = Array.isArray(focus) ? focus : [focus];
  const reportId = generateReportId();

  // ── AI增强：调用LLM获取智能分析 ──
  let aiInsights = null;
  if (isLLMAvailable() && memo) {
    try {
      const sceneMap = {
        education: '教育培训', medical: '医疗美容', labor: '劳动关系', housing: '租房纠纷',
        consumer: '消费纠纷', beauty: '美业服务', franchise: '加盟纠纷', debt: '民间借贷',
        telecom: '电信诈骗', investment: '投资理财', jade: '玉石文玩', marriage: '婚恋纠纷',
        esoteric: '玄学命理', online: '网购纠纷', service: '服务合同', other: '其他纠纷',
        '01': '网购纠纷', '02': '线下消费', '03': '劳动关系', '04': '租房纠纷',
        '05': '教育培训', '06': '医疗美容', '07': '二手车', '08': '旅游纠纷',
        '09': '合同纠纷', '10': '房产纠纷', '11': '投资理财', '12': '民间借贷',
        '13': '物流快递', '14': '票务纠纷', '15': '情感纠纷', '16': '其他'
      };
      const sceneLabel = sceneMap[scene] || sceneMap[subType] || scene || '未指定';
      aiInsights = await generateAIInsights({
        scene, sceneLabel, subType, amount,
        focus: focusKeys, status, evidence, memo
      });
    } catch (e) {
      console.error('[Report] AI分析失败，降级到模板:', e.message);
    }
  }

  // 8个模块（按产品规格顺序）
  // m1=纠纷概况 m2=证据分析 m3=时间线 m4=法条索引 m5=维权流程
  // m6=对方抗辩 m7=数据参考 m8=声明 m9=诉求可行性 m10=替代方案 m11=物料清单
  const m1 = buildModule1({ scene, amount, focusKeys, status, evidence, memberLevel });
  const m2 = buildModule2({ scene, evidence, memberLevel });
  const m3 = buildModule6({ scene, status, focusKeys, memo, evidence }); // 时间轴
  const m4 = buildModule3({ scene });                                      // 法条索引
  const m5 = buildModule4({ scene, status, focusKeys, amount, memberLevel }); // 维权流程
  const m6 = buildModule7({ scene, focusKeys, evidence, memberLevel });  // 对方抗辩
  const m7 = buildModule5({ scene, memberLevel });                        // 数据参考
  const m8 = buildModule8();                                              // 声明

  // m9=诉求可行性评估（基于已有证据完整度+焦点分析，静态判断）
  const m9 = buildModule9({ scene, evidence, focusKeys, amount });
  // m10=低成本替代方案（基于场景+处理阶段）
  const m10 = buildModule10({ scene, status, memberLevel });
  // m11=流程物料清单（基于场景+当前阶段）
  const m11 = buildModule11({ scene, status, memberLevel });

  // 普通用户（memberLevel=0）：全部11个模块锁定，支付后一次性全部解锁
  const isLocked = memberLevel === 0;
  const lockModules = isLocked ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [];

  // AI分析注入（覆盖模板中的静态内容）
  if (aiInsights) {
    // m1: 注入AI争议分析
    m1.aiAnalysis = {
      disputeCore: aiInsights.disputeCore || '',
      keyIssues: aiInsights.keyIssues || [],
      analysis: aiInsights.analysis || '',
    };
    // m5: 注入AI策略建议
    m5.aiStrategy = {
      strategy: aiInsights.strategy || '',
      nextSteps: aiInsights.nextSteps || [],
      tips: aiInsights.tips || '',
    };
    // m9: 注入AI风险评估
    m9.aiRisk = {
      riskLevel: (aiInsights.riskAssessment && aiInsights.riskAssessment.level) || '中',
      riskPoints: (aiInsights.riskAssessment && aiInsights.riskAssessment.points) || [],
      strengths: aiInsights.strengths || [],
      weaknesses: aiInsights.weaknesses || [],
    };
  }

  return {
    reportId,
    reportTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }),
    memberLevel,
    locked: isLocked,
    lockModules,
    aiGenerated: !!aiInsights,
    _llmError: aiInsights ? null : getLLMLastError(),
    m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11,
  };
}

// ==================== 模块九：诉求可行性评估 ====================
function buildModule9({ scene, evidence, focusKeys, amount }) {
  const hasContract = evidence && evidence.some(e => e.id === 'contract');
  const hasPayment = evidence && evidence.some(e => ['payment', 'transfer', 'salary'].includes(e.id));
  const hasChat = evidence && evidence.some(e => e.id === 'chat');
  const hasAds = evidence && evidence.some(e => e.id === 'ads');
  const evidenceCount = evidence ? evidence.length : 0;

  const reasons = [];
  if (hasContract) reasons.push({ text: '有合同/协议（A级证据），权利义务关系明确', ok: true });
  if (hasPayment) reasons.push({ text: '有付款记录（A级证据），损失金额已锁定', ok: true });
  if (hasChat) reasons.push({ text: '有聊天记录（B级证据），可还原关键沟通过程', ok: true });
  if (hasAds) reasons.push({ text: '有宣传材料（A/B级证据），可证明承诺与实际不符', ok: true });
  if (!hasContract) reasons.push({ text: '缺少书面合同，建议补充（可向机构索取或以聊天记录补充）', ok: false });
  if (!hasPayment) reasons.push({ text: '缺少付款凭证，建议通过银行流水锁定金额', ok: false });
  if (evidenceCount < 2) reasons.push({ text: '证据种类较少，建议按系统推荐清单补充核心证据', ok: false });

  // 可行性综合判断
  const okCount = reasons.filter(r => r.ok).length;
  const verdict = okCount >= 3 ? '可行' : okCount >= 2 ? '基本可行' : '需补充证据';
  const verdictColor = okCount >= 3 ? '#16A34A' : okCount >= 2 ? '#D97706' : '#DC2626';
  const successRate = okCount >= 3 ? '75%' : okCount >= 2 ? '55%' : '35%';

  return {
    verdict,
    verdictColor,
    analysis: reasons,   // WXML用m9.analysis
    riskNote: okCount < 3 ? '主要风险：证据链不完整，可能影响诉求被支持的力度。建议优先补充合同和付款记录。' : '风险提示：以上为系统基于现有证据的初步评估，实际结果受多种因素影响。',
    costEstimate: '预估维权成本（供参考）：协商/投诉零成本；调解¥100-500元；仲裁¥0-受理费；诉讼¥50-受理费（1万元以下仅需50元）。',
    successRate: `综合现有证据，预计诉求被支持率约${successRate}。其中协商和解成功率约${okCount >= 2 ? '60%' : '40%'}，投诉+调解组合约${okCount >= 2 ? '75%' : '50%'}。`,
  };
}

// ==================== 模块十：低成本替代方案 ====================
function buildModule10({ scene, status, memberLevel }) {
  const stage = (status || '').split('、')[0] || '与对方协商沟通';

  const solutionsByScene = {
    education: [
      { rank: 1, name: '向12315平台投诉', desc: '提交合同+转账记录+聊天截图，市场监管部门7个工作日内反馈', cost: '零成本', cycle: '7-15天', success: '中高（平台介入后机构配合度显著提升）', successRate: '中高（70%）', steps: ['整理好全部证据截图', '微信搜索「12315」小程序或公众号', '选择被投诉商家（需提供统一社会信用代码）', '上传证据并简要描述诉求', '保持电话畅通，等待调解员联系'] },
      { rank: 2, name: '向消费者协会申请调解', desc: '通过当地消协组织第三方调解，不收费，适合金额较大案例', cost: '零成本', cycle: '15-30天', success: '中等（取决于机构配合度）', successRate: '中等（55%）', steps: ['拨打12315转人工，预约消协调解', '准备书面申诉材料', '消协出具调解协议书', '如机构拒绝，可请求消协出具终止调解文书'] },
      { rank: 3, name: '通过平台客服施压', desc: '如通过第三方平台付款，直接向平台投诉并申请平台介入冻结款项', cost: '零成本', cycle: '3-7天', success: '中等', successRate: '中等（50%）', steps: ['联系付款平台客服（如微信支付客服95017）', '说明情况并提交证据', '申请平台暂缓结算款项'] },
    ],
    labor: [
      { rank: 1, name: '向劳动监察大队投诉', desc: '提交劳动合同+工资流水，监察大队可主动执法，无需仲裁前置', cost: '零成本', cycle: '7-15工作日', success: '高（监察大队可直接责令企业支付）', steps: ['准备劳动合同+工资流水+社保记录', '前往当地劳动监察大队窗口提交', '或通过「智慧人社」微信小程序在线投诉', '等待监察大队联系用人单位核实'] },
      { rank: 2, name: '申请劳动仲裁（不收费）', desc: '劳动仲裁不收取任何费用，是劳动争议的法定前置程序，直接起诉会被驳回', cost: '零成本（仲裁费免收）', cycle: '45天内结案', success: '高（有合同+工资流水证据充分）', steps: ['准备劳动仲裁申请书（模板网上可搜）', '携带身份证+劳动合同+工资流水+社保记录', '前往当地劳动人事争议仲裁委员会', '等待开庭通知（通常2-4周）'] },
      { rank: 3, name: '向社保/公积金中心投诉', desc: '如存在不缴社保公积金，可分别向社保局和公积金中心投诉，部门可强制执行', cost: '零成本', cycle: '30-60天', success: '高', steps: ['凭劳动合同+工资流水分别向社保局、公积金中心投诉', '两部门分别立案后通知公司补缴', '公司拒绝可申请强制执行'] },
    ],
    medical: [
      { rank: 1, name: '向卫健委投诉', desc: '涉及医疗质量/虚假宣传，向属地卫健委医政科投诉，可调取机构资质和医生资质', cost: '零成本', cycle: '15-30天', success: '中高', steps: ['整理好合同+付款记录+术前术后对比照片', '拨打当地卫健委投诉电话或通过官网提交', '卫健委受理后约谈机构负责人', '可申请医疗事故技术鉴定'] },
      { rank: 2, name: '向市场监管部门投诉（虚假宣传）', desc: '如医美机构存在虚假宣传，向市场监管局投诉，依据《广告法》可索赔', cost: '零成本', cycle: '7-20天', success: '中等', steps: ['收集宣传材料截图+聊天记录', '通过12315平台提交投诉', '可同时申请退费+惩罚性赔偿（退一赔三）'] },
      { rank: 3, name: '申请医疗事故鉴定', desc: '如造成明显损害，可申请医学会鉴定（需gs先证明损害存在）', cost: '鉴定费约2000-5000元', cycle: '60-90天', success: '需视损害程度', steps: ['需提供病历+影像资料+术前协议', '向当地医学会申请鉴定', '根据鉴定结论决定下一步维权路径'] },
    ],
    beauty: [
      { rank: 1, name: '向12315平台投诉预付卡', desc: '预付式消费侵权，市场监管部门依据《消费者权益保护法》处理', cost: '零成本', cycle: '7-15天', success: '中高', steps: ['整理会员卡协议+付款记录+聊天记录', '通过12315小程序投诉', '可同步向商务局反映（预付卡监管职责）'] },
      { rank: 2, name: '向商务局投诉预付押金', desc: '商务部《单用途商业预付卡管理办法》对经营者发行预付卡有押金管理规定', cost: '零成本', cycle: '15-30天', success: '中等', steps: ['商务局负责单用途预付卡备案管理', '可投诉经营者违反押金管理制度', '要求商务部门对经营者进行行政处理'] },
      { rank: 3, name: '向消防部门举报（如有安全隐患）', desc: '美容院如存在消防隐患，可向消防部门举报，倒逼经营者配合解决', cost: '零成本', cycle: '7-14天', success: '配合度高时有效', steps: ['拍照留证消防隐患', '通过12369消防举报热线或网上平台', '消防部门出具整改通知，经营者通常主动和解'] },
    ],
    housing: [
      { rank: 1, name: '向房管局投诉（隔断出租/群租房）', desc: '如房屋存在违规隔断、燃气使用不规范等问题，向房管局或城管投诉', cost: '零成本', cycle: '7-20天', success: '中高', steps: ['拍照留证违规情况', '向当地房管局或城管12319热线投诉', '部门核实后出具处理决定'] },
      { rank: 2, name: '通过街道调解', desc: '房东与租客纠纷，可通过街道司法所进行免费调解，协议有法律效力', cost: '零成本', cycle: '7-15天', success: '中等', steps: ['前往属地街道司法所申请调解', '双方到场陈述，调解员主持', '达成协议可申请司法确认（具备强制执行力）'] },
      { rank: 3, name: '起诉（小额诉讼程序）', desc: '押金金额较低（通常2000-5000元），可走小额诉讼，一审终审，诉讼费仅25-50元', cost: '诉讼费25-50元', cycle: '1-2个月', success: '高（有合同+转账记录）', steps: ['准备租赁合同+转账记录+聊天记录', '通过「人民法院在线服务」微信小程序提交立案', '选择「小额诉讼」程序（标的额5万元以下）'] },
    ],
    consumer: [
      { rank: 1, name: '向平台申请客服介入', desc: '电商购物纠纷，在平台申请客服介入，平台可冻结商家货款', cost: '零成本', cycle: '3-7天', success: '高（平台直接扣商家保证金）', steps: ['在订单页面点击「申请平台介入」', '上传证据并说明诉求（退款/退货）', '平台判定后通常3天内执行'] },
      { rank: 2, name: '向12315投诉', desc: '实体店购物纠纷，保留好购物小票和商品，向市场监管部门投诉', cost: '零成本', cycle: '7-15天', success: '中等', steps: ['保留购物小票+商品照片', '通过12315平台提交投诉', '市场监管部门联系商家核实'] },
      { rank: 3, name: '起诉（标的额小可走小额诉讼）', desc: '金额在5万元以下可走小额诉讼程序，一审终审，诉讼费最低', cost: '诉讼费约25元', cycle: '1-2个月', success: '高', steps: ['准备购物合同/订单截图+付款记录+商品照片', '通过「人民法院在线服务」微信小程序申请立案', '选择小额诉讼程序'] },
    ],
    franchise: [
      { rank: 1, name: '向商务局举报（虚假宣传/违规招商）', desc: '商务部对特许经营（加盟）有专门管理规定，可向商务局举报违规行为', cost: '零成本', cycle: '15-30天', success: '中高', steps: ['收集招商手册+网站截图+聊天记录', '向当地商务局提交举报材料', '商务局查实后可对品牌方处以罚款'] },
      { rank: 2, name: '向市场监管部门投诉（虚假广告）', desc: '依据《广告法》和《商业特许经营管理条例》向工商部门投诉', cost: '零成本', cycle: '15-30天', success: '中等', steps: ['收集所有宣传材料+签约时的沟通记录', '通过12315提交投诉', '可同步申请合同解除+退还加盟费'] },
      { rank: 3, name: '提起民事诉讼', desc: '加盟合同纠纷通常标的较大，建议委托律师（可申请法律援助），合同履行地或被告地法院管辖', cost: '诉讼费+律师费', cycle: '3-6个月', success: '需视证据', steps: ['整理好加盟合同+付款记录+对方虚假承诺的证据', '向合同履行地或被告所在地法院起诉', '可同步申请财产保全（冻结对方账户）'] },
    ],
    debt: [
      { rank: 1, name: '自行催收（书面函件）', desc: '先发书面催款函给对方，保留邮寄凭证，具有中断诉讼时效的法律效力', cost: '快递费约15元', cycle: '7-15天', success: '中等', steps: ['起草催款函（写明借款金额+期限+账号）', '通过EMS邮寄并保留送达回执', '同步微信/短信发送电子版'] },
      { rank: 2, name: '申请支付令（督促程序）', desc: '凭欠条直接向法院申请支付令，15天内对方不提异议则支付令生效，可直接申请强制执行', cost: '诉讼费约50元', cycle: '15-30天', success: '高（有借条+转账记录）', steps: ['准备借条/借款协议+转账记录', '向被告住所地基层人民法院申请支付令', '如对方提异议，自动转入诉讼程序'] },
      { rank: 3, name: '起诉（普通民事诉讼）', desc: '民间借贷需证明借贷合意+实际交付，建议通过银行转账而非现金', cost: '诉讼费约50-200元（按标的）', cycle: '3-6个月', success: '高（有借条+转账记录）', steps: ['准备借条/协议+银行转账记录+聊天记录', '向原告或被告所在地法院起诉', '如约定利息，注意不超过LPR四倍上限'] },
    ],
    telecom: [
      { rank: 1, name: '向运营商客服投诉（升级处理）', desc: '首先通过运营商官方客服渠道投诉，如处理不满意则要求升级到省级投诉', cost: '零成本', cycle: '3-7天', success: '中高', steps: ['拨打运营商客服电话（移动10080/联通10015/电信10000）', '说明诉求并记录工号', '如7天内未解决，发送「投诉升级」短信到上述号码'] },
      { rank: 2, name: '向工信部电信用户申诉受理中心投诉', desc: '运营商违规收费、不明扣费，工信部申诉中心可对运营商进行行政处理', cost: '零成本', cycle: '15-30天', success: '中高', steps: ['登录工信部申诉中心网站（https://www.chinatcc.gov.cn）', '填写申诉表单（需提供与运营商沟通记录）', '工信部转办至运营商，15日内必须给出处理结果'] },
      { rank: 3, name: '向市场监管部门投诉（不明扣费）', desc: '运营商擅自开通付费项目构成侵权，向市场监管部门投诉可要求退一赔三', cost: '零成本', cycle: '15-30天', success: '中等', steps: ['下载运营商扣费账单截图', '通过12315平台投诉不明扣费', '可主张退一赔三（不足500元赔500元）'] },
    ],
    jade: [
      { rank: 1, name: '申请鉴定（确认是否假货）', desc: '如怀疑为假货，先委托正规鉴定机构出具鉴定报告，是后续维权的前提', cost: '鉴定费约200-500元', cycle: '7-15天', success: '鉴定是前提', steps: ['通过中国地质大学珠宝检测中心等正规机构送检', '保留购买凭证+商品照片', '鉴定为假后立即启动退款维权'] },
      { rank: 2, name: '向市场监管部门投诉（以假充真）', desc: '依据《产品质量法》，以假充真可要求退一赔三，向市场监管局投诉', cost: '零成本', cycle: '15-30天', success: '中高（有鉴定报告）', steps: ['取得鉴定报告后，通过12315提交投诉', '同时向消协申请协助', '可同步向公安机关报案（如涉嫌欺诈）'] },
      { rank: 3, name: '通过电商平台申请售后（线上购买）', desc: '如通过电商平台购买，直接申请平台售后，平台可先行赔付', cost: '零成本', cycle: '3-7天', success: '高（平台保证金）', steps: ['在订单页面申请「仅退款」或「退货退款」', '上传鉴定报告+商品照片', '平台客服介入，通常5天内处理完毕'] },
    ],
    marriage: [
      { rank: 1, name: '向民政局或婚介机构上级主管部门投诉', desc: '婚介机构归市场监管部门和民政部门双重管辖，可向两边投诉', cost: '零成本', cycle: '15-30天', success: '中等', steps: ['收集好服务合同+付款记录+对方承诺记录', '向市场监管局投诉虚假宣传', '向民政局反映婚介机构违规行为'] },
      { rank: 2, name: '向消费者协会投诉（婚介服务纠纷）', desc: '婚介服务属消费维权范畴，消协可进行调解', cost: '零成本', cycle: '15-30天', success: '中等', steps: ['拨打12315申请消协调解', '准备合同+付款记录+聊天截图', '消协出具调解协议'] },
      { rank: 3, name: '起诉解除合同退费', desc: '婚介合同如存在明显不公平条款或虚假承诺，可向法院起诉要求解除合同并退费', cost: '诉讼费约50元', cycle: '2-4个月', success: '需视证据', steps: ['准备合同+付款记录+对方虚假宣传的证据', '向被告所在地法院起诉', '主张对方存在欺诈或重大误解'] },
    ],
    online: [
      { rank: 1, name: '向电商平台申请售后', desc: '电商平台购物，直接在订单页申请「仅退款」或「退货退款」，平台客服可强制介入', cost: '零成本', cycle: '3-7天', success: '高', steps: ['在订单页面点击「申请售后」', '上传商品实物照片+描述不符的对比图', '选择退款金额（不超过支付金额）', '平台客服判定，通常3-5个工作日'] },
      { rank: 2, name: '向12315平台投诉', desc: '实体平台购物，向市场监管部门投诉，平台方负连带责任', cost: '零成本', cycle: '7-15天', success: '中等', steps: ['保留好购物凭证+商品照片', '通过12315小程序提交投诉', '可同步申请平台客服介入'] },
      { rank: 3, name: '通过「全国12315平台」直接投诉平台方', desc: '依据《电子商务法》，平台对商家违法行为负有连带责任，可直接要求平台赔偿', cost: '零成本', cycle: '15-30天', success: '中等', steps: ['登录全国12315平台，选择「投诉」而非「举报」', '被投诉对象填写平台公司名称', '上传证据，说明平台未履行审核/监管义务'] },
    ],
    service: [
      { rank: 1, name: '向12315平台投诉', desc: '各类服务纠纷，保留好服务合同+付款记录+沟通记录，向市场监管部门投诉', cost: '零成本', cycle: '7-15天', success: '中高', steps: ['整理好服务合同+付款记录+沟通截图', '通过12315小程序提交投诉', '市场监管部门联系商家核实处理'] },
      { rank: 2, name: '向商务局投诉（预付服务）', desc: '预付式服务（会员卡等）归商务部门管理，可向当地商务局投诉经营者违规', cost: '零成本', cycle: '15-30天', success: '中等', steps: ['商务局负责单用途预付卡监管', '可投诉经营者违反押金管理制度', '要求商务部门对经营者进行行政处理'] },
      { rank: 3, name: '起诉维权', desc: '服务纠纷金额较大时，通过诉讼解决，可主张退还预付款+利息损失', cost: '诉讼费约50元', cycle: '2-4个月', success: '高（有合同+付款记录）', steps: ['准备服务合同+付款记录+服务未达标准的证据', '向被告住所地或合同履行地法院起诉', '可申请诉前财产保全'] },
    ],
    other: [
      { rank: 1, name: '向市场监管部门投诉', desc: '大多数消费纠纷归市场监管部门管辖，保留好消费凭证是关键', cost: '零成本', cycle: '7-15天', success: '中等', steps: ['保留好合同/收据+付款记录', '通过12315平台提交投诉', '保持电话畅通等待反馈'] },
      { rank: 2, name: '向消费者协会申请调解', desc: '消协是消费者维权的重要第三方渠道，不收费，调解协议不具强制执行力但社会约束力强', cost: '零成本', cycle: '15-30天', success: '中等', steps: ['拨打12315转人工申请消协调解', '准备好书面申诉材料', '消协出具调解协议书'] },
      { rank: 3, name: '提起民事诉讼', desc: '纠纷金额较大或对方为法人单位，通过诉讼解决，判决书有强制执行力', cost: '诉讼费约50-200元', cycle: '3-6个月', success: '高（有完整证据链）', steps: ['准备好所有证据（合同+付款+沟通记录）', '确定管辖法院（通常为被告住所地或合同履行地）', '通过「人民法院在线服务」小程序申请立案'] },
    ],
  };

  const sceneSolutions = solutionsByScene[scene] || solutionsByScene.other;

  // 黑金年卡(memberLevel=3)：看到全部方案；其他会员看到前2个
  const options = memberLevel >= 3 ? sceneSolutions : sceneSolutions.slice(0, 2);

  const recommend = memberLevel >= 2
    ? `综合您当前所处阶段（${stage}），建议优先尝试方案1「${sceneSolutions[0].name}」，该方式成本最低且成功率较高。如无效，再依次尝试方案2、方案3。`
    : `您当前处于${stage}阶段。建议优先尝试方案1（成本最低）。升级至黑金年卡可解锁全部替代方案详情及操作步骤。`;

  return { options, recommend };
}

// ==================== 模块十一：流程物料清单 ====================
function buildModule11({ scene, status, memberLevel }) {
  const stage = (status || '').split('、')[0] || '与对方协商沟通';

  const baseMaterials = [
    { item: '合同/协议原件', note: '纸质合同或电子合同截图，需清晰显示双方签章', done: false },
    { item: '付款记录', note: '银行转账记录/支付App截图，需显示交易时间和金额', done: false },
    { item: '沟通记录', note: '与对方的微信聊天记录截图+录屏（关键页面需显示时间）', done: false },
    { item: '对方联系方式', note: '对方真实姓名+手机号或公司注册地址', done: false },
  ];

  const stageMaterials = {
    '与对方协商沟通': [
      { item: '书面催告函（EMS邮寄）', note: '写明退款金额+期限+账号，邮寄并保留回执', done: false },
      { item: '催告函送达凭证', note: 'EMS官网打印物流签收记录，证明对方已收到', done: false },
    ],
    '向平台或监管部门投诉': [
      { item: '向12315提交的投诉截图', note: '提交成功后保存「投诉单号」', done: false },
      { item: '平台回复记录', note: '保存好平台方的处理结果或不予受理说明', done: false },
    ],
    '咨询过专业人士': [
      { item: '律师函或咨询意见书', note: '如委托律师出过律师函，保留原件', done: false },
      { item: '法律援助申请材料', note: '如符合法律援助条件，保留申请表和经济困难证明', done: false },
    ],
    '还没有尝试过任何方式': [
      { item: '对方基本信息（姓名/公司名）', note: '可通过合同、企业工商信息查询确认', done: false },
      { item: '损失金额计算依据', note: '整理好付款总额、已使用/未使用比例', done: false },
    ],
  };

  const additionalMaterials = stageMaterials[stage] || [];

  const checkList = memberLevel >= 2 ? [...baseMaterials, ...additionalMaterials] : baseMaterials.slice(0, 2);

  const materialTip = memberLevel >= 1
    ? '以上物料清单已按优先级排序。建议按顺序准备齐全后再启动正式维权，避免因材料不全来回补充耽误时间。'
    : '黑金年卡会员可解锁完整物料清单及获取渠道指引。';

  return { checkList, materialTip };
}
