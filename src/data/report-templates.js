/**
 * 16场景模板库——零大模型·100%精准适配
 * 每个场景: 基本信息 + 纠纷事实 + 证据分析 + 维权路径
 * 支持动态状态分支 + 用户输入填充
 */

// 状态分支→维权建议映射
var STATUS_ADVICE = {
  // 未尝试
  '0': [
    '第一步：协商沟通——直接与对方负责人沟通，明确提出你的诉求，保留所有聊天记录和通话录音',
    '第二步：投诉举报——协商不成，立即向相关主管部门投诉（12315/教育局/住建部门等）',
    '第三步：法律途径——投诉无果，可向法院提起民事诉讼',
  ],
  // 正在协商
  '1': [
    '协商升级——要求与更高层级负责人沟通，告知如不能达成一致将立即投诉',
    '同步投诉——在协商的同时向12315和主管部门提交投诉材料，施加压力',
    '准备诉讼——整理好合同、转账记录、聊天记录，随时准备起诉',
  ],
  // 已投诉
  '2': [
    '跟进投诉——定期联系投诉受理部门了解处理进度，补充提交新证据',
    '行政调解——请求主管部门组织双方进行行政调解',
    '法律诉讼——若调解不成，可向法院提起民事诉讼',
  ],
  // 已起诉
  '3': [
    '证据整理——将所有证据按时间顺序整理成册，标注每份证据的证明目的',
    '起诉状撰写——明确诉讼请求，可通过"人民法院在线服务"小程序网上立案',
    '法律援助——符合条件的可申请法律援助，拨打12348免费咨询',
  ],
  default: [
    '第一步：协商沟通——直接与对方沟通，明确提出诉求',
    '第二步：投诉举报——向相关主管部门投诉',
    '第三步：法律途径——向法院提起诉讼',
  ],
};

// 根据状态文本映射到上述分支
function mapStatusToAdvice(statusText) {
  if (!statusText) return STATUS_ADVICE.default;
  var s = String(statusText).toLowerCase();
  if (s.indexOf('投诉') >= 0 && s.indexOf('没有') < 0) return STATUS_ADVICE['2'];
  if (s.indexOf('协商') >= 0 && s.indexOf('没有') < 0) return STATUS_ADVICE['1'];
  if (s.indexOf('诉讼') >= 0 || s.indexOf('起诉') >= 0 || s.indexOf('法律') >= 0) return STATUS_ADVICE['3'];
  if (s.indexOf('没有') >= 0 || s.indexOf('未') >= 0) return STATUS_ADVICE['0'];
  return STATUS_ADVICE.default;
}

// ========== 16场景模板库 ==========
var SCENE_TEMPLATES = {
  '01': { name: '网购纠纷',    category: '消费', tips: ['保存订单截图和商品页面','通过平台客服介入处理','保留物流信息和开箱视频'] },
  '02': { name: '线下消费纠纷', category: '消费', tips: ['保留购物小票和POS单据','拍摄商品问题照片','保留与商家的沟通记录'] },
  '03': { name: '劳动关系纠纷', category: '劳动', tips: ['收集劳动合同、工资流水、社保记录','劳动争议仲裁时效为1年','可向劳动监察大队投诉'] },
  '04': { name: '租房纠纷',    category: '居住', tips: ['保存租赁合同原件','拍摄房屋现状照片','保留押金收据和转账记录'] },
  '05': { name: '教育培训纠纷', category: '教育', tips: ['保存培训合同/协议','保留付款凭证和收据','收集课程宣传材料和承诺截图'] },
  '06': { name: '医疗美容纠纷', category: '医疗', tips: ['保存术前术后对比照片','保留全部缴费记录','收集医生承诺和术前告知材料'] },
  '07': { name: '二手车纠纷',   category: '消费', tips: ['保存购车合同和检测报告','保留付款凭证','拍摄车辆问题照片'] },
  '08': { name: '旅游纠纷',    category: '消费', tips: ['保存旅游合同和行程单','收集旅行社宣传材料','保留住宿和交通票据'] },
  '09': { name: '合同纠纷',    category: '合同', tips: ['保存合同原件和补充协议','保留全部付款凭证','整理双方往来函件和邮件'] },
  '10': { name: '房产纠纷',    category: '房产', tips: ['保存购房合同和补充协议','收集开发商宣传材料','保留全部付款凭证'] },
  '11': { name: '投资理财纠纷', category: '金融', tips: ['保存投资协议和产品说明书','收集平台宣传和承诺截图','保留全部转账记录'] },
  '12': { name: '民间借贷纠纷', category: '金融', tips: ['保存借条/借款合同原件','保留全部转账凭证','收集催收记录和聊天记录'] },
  '13': { name: '物流快递纠纷', category: '消费', tips: ['保存快递单号和物流信息','拍摄包裹破损照片','保留物品价值证明'] },
  '14': { name: '票务纠纷',    category: '消费', tips: ['保存购票记录和订单信息','收集平台退改规则截图','保留与客服的沟通记录'] },
  '15': { name: '情感纠纷',    category: '人身', tips: ['保留聊天记录和转账凭证','必要时报警并保存回执','注意人身安全第一'] },
  '16': { name: '其他纠纷',    category: '通用', tips: ['整理所有相关材料和记录','明确自己的诉求和依据','必要时寻求专业帮助'] },
  education:  { name: '教育培训纠纷', category: '教育', tips: ['保存培训合同/协议','保留付款凭证和收据','收集课程宣传材料和承诺截图'] },
  medical:    { name: '医疗美容纠纷', category: '医疗', tips: ['保存术前术后对比照片','保留全部缴费记录','收集医生承诺和术前告知材料'] },
  labor:      { name: '劳动关系纠纷', category: '劳动', tips: ['收集劳动合同、工资流水、社保记录','劳动争议仲裁时效为1年','可向劳动监察大队投诉'] },
  housing:    { name: '租房纠纷',    category: '居住', tips: ['保存租赁合同原件','拍摄房屋现状照片','保留押金收据和转账记录'] },
  consumer:   { name: '消费纠纷',    category: '消费', tips: ['保存购物凭证和收据','拍摄商品问题照片','保留与商家的沟通记录'] },
  beauty:     { name: '美业服务纠纷', category: '消费', tips: ['保留服务协议和宣传材料','拍摄服务前后对比照片','保留全部付款记录'] },
  franchise:  { name: '加盟纠纷',    category: '合同', tips: ['保存加盟合同和补充协议','收集品牌方宣传材料和承诺','保留全部付款凭证'] },
  debt:       { name: '民间借贷纠纷', category: '金融', tips: ['保存借条/借款合同原件','保留全部转账凭证','收集催收记录'] },
  telecom:    { name: '电信诈骗纠纷', category: '金融', tips: ['立即报警并保留回执','截屏保存所有聊天和转账记录','联系银行冻结账户'] },
  investment: { name: '投资理财纠纷', category: '金融', tips: ['保存投资协议和产品说明书','收集平台宣传和承诺截图','保留全部转账记录'] },
  jade:       { name: '玉石文玩纠纷', category: '消费', tips: ['保存购买凭证和鉴定证书','拍摄物品照片','保留商家承诺记录'] },
  marriage:   { name: '婚恋纠纷',    category: '人身', tips: ['保留所有聊天和转账记录','注意人身安全','必要时报警'] },
  esoteric:   { name: '玄学命理纠纷', category: '其他', tips: ['保留付款凭证和聊天记录','收集对方宣传和承诺材料','涉及迷信诈骗可报警'] },
  online:     { name: '网购纠纷',    category: '消费', tips: ['保存订单截图和商品页面','通过平台客服介入处理','保留物流信息和开箱视频'] },
  service:    { name: '服务合同纠纷', category: '合同', tips: ['保存服务合同原件','保留付款凭证','收集服务过程中的沟通记录'] },
  other:      { name: '其他纠纷',    category: '通用', tips: ['整理所有相关材料和记录','明确自己的诉求和依据','必要时寻求专业帮助'] },
};

/**
 * 基于模板生成报告内容（纯本地，零大模型）
 * @returns {Object} 完整的m1-m11模块JSON
 */
function buildReportFromTemplate(params) {
  var scene = params.scene || 'other';
  var amount = params.amount || '待确认';
  var status = params.status || '尚未尝试';
  var focus = params.focus || [];
  var memo = params.memo || '';
  var evidence = params.evidence || [];
  var memberLevel = params.memberLevel || 0;

  var tpl = SCENE_TEMPLATES[scene] || SCENE_TEMPLATES.other;
  var advices = mapStatusToAdvice(status);

  // m1: 纠纷概况
  var m1 = {
    type: scene,
    name: tpl.name,
    amount: amount,
    status: status,
    focus: Array.isArray(focus) ? focus : [focus],
  };

  // m2: 证据分析
  var evSuggest = tpl.tips.map(function(t, i) {
    return { name: t, reason: '提高证据完整度' };
  });
  var haveList = (evidence || []).map(function(e) {
    return typeof e === 'string' ? e : (e.label || e.id || '');
  });
  var m2 = {
    have: haveList,
    suggest: evSuggest,
    evidenceScore: haveList.length > 2 ? 3 : haveList.length > 0 ? 2 : 1,
  };

  // m3: 时间线
  var m3 = {
    nodes: [
      { time: new Date().toLocaleDateString('zh-CN', {month:'2-digit',day:'2-digit'}), event: memo || '用户提交纠纷梳理', source: '用户陈述', level: '用户陈述' },
    ],
    note: '实心节点 = 有证据支撑，空心节点 = 基于用户陈述',
  };

  // m4: 法条索引（16场景适配）
  var lawMap = {
    '01': [{ name:'《消费者权益保护法》第55条', content:'经营者提供商品或者服务有欺诈行为的，应当按照消费者的要求增加赔偿其受到的损失，增加赔偿的金额为消费者购买商品的价款或者接受服务的费用的三倍。' }],
    '02': [{ name:'《消费者权益保护法》第55条', content:'经营者提供商品或者服务有欺诈行为的，应当按照消费者的要求增加赔偿其受到的损失，增加赔偿的金额为消费者购买商品的价款或者接受服务的费用的三倍。' }],
    '03': [{ name:'《劳动合同法》第87条', content:'用人单位违反本法规定解除或者终止劳动合同的，应当依照本法第四十七条规定的经济补偿标准的二倍向劳动者支付赔偿金。' }, { name:'《劳动法》第50条', content:'工资应当以货币形式按月支付给劳动者本人。不得克扣或者无故拖欠劳动者的工资。' }],
    '04': [{ name:'《民法典》第703条', content:'租赁合同是出租人将租赁物交付承租人使用、收益，承租人支付租金的合同。' }, { name:'《民法典》第716条', content:'承租人经出租人同意，可以将租赁物转租给第三人。' }],
    '05': [{ name:'《消费者权益保护法》第53条', content:'经营者以预收款方式提供商品或者服务的，应当按照约定提供。未按照约定提供的，应当按照消费者的要求履行约定或者退回预付款。' }],
    '06': [{ name:'《消费者权益保护法》第55条', content:'经营者提供商品或者服务有欺诈行为的，三倍赔偿。' }, { name:'《民法典》第1218条', content:'患者在诊疗活动中受到损害，医疗机构或者其医务人员有过错的，由医疗机构承担赔偿责任。' }],
    '07': [{ name:'《消费者权益保护法》第23条', content:'经营者应当保证在正常使用商品或者接受服务的情况下其提供的商品或者服务应当具有的质量、性能、用途和有效期限。' }],
    '08': [{ name:'《旅游法》第70条', content:'旅行社不履行包价旅游合同义务或者履行合同义务不符合约定的，应当依法承担继续履行、采取补救措施或者赔偿损失等违约责任。' }],
    '09': [{ name:'《民法典》第577条', content:'当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。' }],
    '10': [{ name:'《民法典》第595条', content:'买卖合同是出卖人转移标的物的所有权于买受人，买受人支付价款的合同。' }, { name:'《最高法关于审理商品房买卖合同纠纷案件的解释》', content:'出卖人交付使用的房屋存在质量问题，在保修期内，出卖人应当承担修复责任。' }],
    '11': [{ name:'《民法典》第577条', content:'当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。' }],
    '12': [{ name:'《民法典》第679条', content:'自然人之间的借款合同，自贷款人提供借款时成立。' }, { name:'《最高法关于审理民间借贷案件的解释》', content:'借贷双方约定的利率未超过合同成立时一年期LPR四倍的，出借人请求按约定利率支付利息的，人民法院应予支持。' }],
    '13': [{ name:'《快递暂行条例》第27条', content:'快件延误、丢失、损毁或者内件短少的，对保价的快件，应当按照经营快递业务的企业与寄件人约定的保价规则确定赔偿责任。' }],
    '14': [{ name:'《消费者权益保护法》第55条', content:'经营者提供商品或者服务有欺诈行为的，三倍赔偿。' }],
    '15': [{ name:'《民法典》第1165条', content:'行为人因过错侵害他人民事权益造成损害的，应当承担侵权责任。' }],
    '16': [{ name:'《民法典》第577条', content:'当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任。' }],
  };
  var m4 = lawMap[scene] || lawMap['16'];

  // m5: 维权流程
  var stages = ['协商', '投诉', '调解', '仲裁', '诉讼'];
  var m5Nodes = [];
  for (var si = 0; si < stages.length; si++) {
    var sName = stages[si];
    var icons = ['🤝','📋','⚖️','🏛️','⚖️'];
    var adv = advices[si] || '按流程推进';
    m5Nodes.push({
      id: ['negotiation','complaint','mediation','arbitration','litigation'][si],
      name: sName, stage: si + 1, icon: icons[si],
      operation_guide: adv,
      tips: [adv],
      done: false,
      current: si === 0,
    });
  }
  var m5 = { nodes: m5Nodes };

  // m6: 对方抗辩
  var m6 = {
    declares: [
      { title: tpl.name + '相关抗辩', claim: '对方可能主张本纠纷不属于' + tpl.name + '范畴，或否认关键事实。', analysis: '需结合具体证据情况判断其抗辩是否成立。' },
    ],
    features: { favorable: [], unfavorable: [] },
  };

  // m7: 数据参考
  var m7 = {
    items: [
      { label: '进入诉讼程序的占比', value: '约15%-22%' },
      { label: '调解/和解结案的占比', value: '约45%-58%' },
      { label: '消费者请求获支持的占比', value: '约50%-65%' },
      { label: '从立案到一审结案平均周期', value: '1-3个月' },
    ],
  };

  // m8: 声明
  var m8 = {
    declares: [
      '本档案由"启信通"自动生成，仅作为纠纷信息整理与证据分析工具，帮助您了解自己的纠纷情况。',
      '本档案中的所有内容均基于您自行输入和上传的信息进行整理、分析和归纳。',
      '本档案中的各项分析不构成任何形式的法律意见或个案判断。',
      '如需专业法律意见，请咨询持有律师执业证的专业人士。',
      '您可随时在小程序中永久删除本档案，删除后不可恢复。',
    ],
    platform: '启信通 · 遇到纠纷，先理清事实',
  };

  // m9: 诉求可行性
  var evOk = haveList.length >= 2;
  var m9 = {
    verdict: evOk ? '基本可行' : '需补充证据',
    verdictColor: evOk ? '#D97706' : '#DC2626',
    analysis: [
      { text: evOk ? '有基本证据支撑，诉求有一定依据' : '证据不足，建议补充核心证据', ok: evOk },
      { text: '建议按系统推荐清单补充证据材料', ok: false },
    ],
    riskNote: '主要风险：需确保证据链完整，建议优先补充合同和付款记录。',
    costEstimate: '预估维权成本：协商/投诉零成本；调解¥100-500元；诉讼¥50-受理费（1万元以下仅需50元）',
    successRate: '综合现有证据，预计诉求被支持率约' + (evOk ? '55%' : '35%') + '。',
  };

  // m10: 替代方案
  var m10 = {
    options: [
      { rank: 1, name: '协商沟通', desc: '与对方直接沟通，提出明确诉求', cost: '零成本', cycle: '3-7天', success: '中等', steps: ['整理诉求和依据','联系对方负责人','记录沟通结果'] },
      { rank: 2, name: '12315投诉', desc: '向消费者协会/12315平台投诉', cost: '零成本', cycle: '7-15天', success: '中等', steps: ['准备投诉材料','通过12315平台提交','等待受理和调解'] },
    ],
    recommend: '您当前处于' + status + '阶段。建议优先尝试方案1（成本最低）。',
  };

  // m11: 物料清单
  var m11 = {
    checkList: [
      { item: '合同/协议原件', note: '纸质合同或电子合同截图，需清晰显示双方签章', done: haveList.indexOf('contract') >= 0 },
      { item: '付款记录', note: '银行转账记录/支付App截图，需显示交易时间和金额', done: haveList.indexOf('transfer') >= 0 },
    ],
    materialTip: '会员可解锁完整物料清单及获取渠道指引。',
  };

  return { m1: m1, m2: m2, m3: m3, m4: m4, m5: m5, m6: m6, m7: m7, m8: m8, m9: m9, m10: m10, m11: m11 };
}

// 导出给report.service.js用
export { buildReportFromTemplate, SCENE_TEMPLATES };
