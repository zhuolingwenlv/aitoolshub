/**
 * 潜在风险提示库（季SVIP+解锁）
 * 键：disputeType + focusKey + condition，值：风险提示对象
 * 算法：第3题焦点 + 第5题已有材料 → 匹配风险规则 → 输出risks[]
 * 风险等级：high(高风险) / medium(中风险) / low(低风险)
 */

export const riskLibrary = {
  // ==================== 教育培训 ====================
  'education:false-advertising': {
    'missing-promotion-material': {
      riskLevel: 'high',
      riskTitle: '关键承诺证据缺失风险',
      riskDescription: '您签约前的沟通中存在"名师授课"、"包过"等承诺性表述，但目前尚未补充机构宣传材料作为证据。如后续进入投诉或诉讼，对方可能否认曾做出上述承诺，导致"虚假宣传"焦点难以认定。',
      suggestion: '建议优先补充机构宣传材料。从微信公众号历史文章、招生简章、销售人员朋友圈截图、搜索引擎快照等渠道获取含有具体承诺性表述的材料。',
      relatedFocus: '虚假夸大宣传',
    },
    'contract-has-exception-clause': {
      riskLevel: 'medium',
      riskTitle: '格式条款效力风险',
      riskDescription: '合同中可能存在"概不退款"等格式条款。在预付式消费场景下，最高人民法院相关司法解释（2025年）对这类条款的效力作出了规定——在特定情形下可能被认定为无效或部分无效，但具体适用仍需结合案情判断。',
      suggestion: '建议补充签约前的承诺记录（如宣传材料、销售人员聊天记录），以支持"格式条款无效"的主张。',
      relatedFocus: '虚假夸大宣传',
    },
  },
  'education:refuse-refund': {
    'contract-has-no-refund-clause': {
      riskLevel: 'high',
      riskTitle: '退费条款缺失风险',
      riskDescription: '您的合同中可能未约定退费条款，或退费条款表述模糊。在双方对退费事项无明确约定的情况下，是否能退费、退多少，需要结合《民法典》及《消费者权益保护法》的基本原则进行判断，存在不确定性。',
      suggestion: '建议补充能够证明对方曾做出退费承诺的沟通记录（如微信聊天、短信等），以补充合同约定的不足。',
      relatedFocus: '不退费/拖延退费',
    },
    'refund-request-no-proof': {
      riskLevel: 'medium',
      riskTitle: '退费请求时间证明缺失',
      riskDescription: '您提到已向对方提出过退费请求，但目前已有的聊天记录可能无法充分证明提出退费请求的具体时间和内容。如对方否认收到退费请求，可能影响"拖延退费"焦点的认定。',
      suggestion: '建议整理完整的沟通时间线，截取关键对话片段。重点保留能够证明"何时提出退费请求"及"对方如何回应"的聊天记录。',
      relatedFocus: '不退费/拖延退费',
    },
    'amount-disputed': {
      riskLevel: 'medium',
      riskTitle: '退费金额争议风险',
      riskDescription: '即使法院支持退费请求，实际退还金额也可能并非全额。具体退还数额需综合考虑合同约定的服务内容、已提供的服务部分、消费者的过错程度等因素。通常有约35%的判例仅支持部分退还。',
      suggestion: '建议整理已接受服务的相关证据（如课程记录、签到记录等），以便在后续协商或诉讼中明确已服务部分的价值。',
      relatedFocus: '不退费/拖延退费',
    },
  },

  // ==================== 医疗美容 ====================
  'medical:effect-not-match': {
    'no-pre-surgery-record': {
      riskLevel: 'high',
      riskTitle: '术前效果承诺证据缺失',
      riskDescription: '认定"效果与承诺不符"的关键在于能够证明术前机构做出了具体的效果承诺。若仅凭口头承诺而无书面证据（如聊天记录、宣传材料、合同条款），后续维权时对方可能否认，焦点难以成立。',
      suggestion: '建议补充术前与咨询师/医生的沟通记录，包括微信聊天、术前同意书内容等。重点提取其中涉及效果承诺的具体表述。',
      relatedFocus: '效果与承诺严重不符',
    },
    'no-medical-record': {
      riskLevel: 'high',
      riskTitle: '病历资料缺失风险',
      riskDescription: '医美手术后的病历记录是判断手术效果和是否存在医疗过错的重要依据。若机构未提供完整病历，或病历记录与实际情况不符，可能影响后续维权。',
      suggestion: '可向机构书面申请复制完整病历（包括手术记录、知情同意书、术后注意事项等）。根据《医疗纠纷预防和处理条例》，患者有权复制病历资料。',
      relatedFocus: '效果与承诺严重不符',
    },
  },
  'medical:price-opaque': {
    'no-price-confirmation': {
      riskLevel: 'medium',
      riskTitle: '术前价格确认缺失',
      riskDescription: '如果术前仅凭销售人员口头报价而未签署书面价格确认，可能存在"实际收费与承诺不符"的争议。',
      suggestion: '建议整理术前的价格沟通记录，包括聊天记录、报价截图等。向机构申请获取完整的费用明细清单进行对比。',
      relatedFocus: '收费不透明/诱导消费',
    },
  },

  // ==================== 预付卡 ====================
  'prepaid:balance-deducted': {
    'no-consumption-proof': {
      riskLevel: 'medium',
      riskTitle: '余额证明不充分',
      riskDescription: '如果无法提供会员卡余额的有效证明（如App截图、消费记录等），可能导致退款金额难以认定。',
      suggestion: '第一时间保存会员App的余额截图和近期消费记录，必要时可向平台发送书面查询函要求确认余额。',
      relatedFocus: '余额擅自被扣除/无法使用',
    },
    'merchant-closed': {
      riskLevel: 'high',
      riskTitle: '商户跑路风险',
      riskDescription: '如果商户已关门停业且负责人失联，追回资金的难度将显著增加。建议尽快采取法律行动（如向法院申请支付令或提起诉讼），并关注商户是否有可执行的财产。',
      suggestion: '立即向市场监管部门举报，同时准备提起民事诉讼。可通过国家企业信用信息公示系统查询商户的注册资本和股东信息，必要时可追加股东为被告。',
      relatedFocus: '余额擅自被扣除/无法使用',
    },
  },
  'prepaid:expire-issues': {
    'no-rule-change-proof': {
      riskLevel: 'medium',
      riskTitle: '规则变更证明缺失',
      riskDescription: '如果无法证明商户何时变更了使用规则，可能导致维权时缺乏有力证据。',
      suggestion: '建议通过录屏方式保存商户App或官网的当前规则页面，并尝试查找规则变更前的截图或快照。',
      relatedFocus: '过期无法续用/限制使用',
    },
  },

  // ==================== 房屋租赁 ====================
  'rental:deposit-dispute': {
    'no-checkin-record': {
      riskLevel: 'high',
      riskTitle: '入住状态记录缺失',
      riskDescription: '如果您无法提供入住时的房屋状态记录（如照片/视频），退房时可能因无法证明"入住时的状态"而导致押金被克扣。',
      suggestion: '建议立即查找入住时的房屋照片或视频（手机相册、微信发送记录等）。如确实无法找到，下次租房时务必在入住当天全面记录房屋状态。',
      relatedFocus: '押金不退/克扣',
    },
    'no-checkout-record': {
      riskLevel: 'medium',
      riskTitle: '退房状态记录缺失',
      riskDescription: '如果退房时未留存房屋状态记录，可能无法证明"退房时的状态符合要求"，对方可能以此为由克扣押金。',
      suggestion: '建议补拍当前房屋状态照片，记录退房时的实际情况。如已退房且无法补拍，可通过公证方式保全现状。',
      relatedFocus: '押金不退/克扣',
    },
  },

  // ==================== 购物消费 ====================
  'shopping:quality-defect': {
    'no-quality-test': {
      riskLevel: 'medium',
      riskTitle: '质量鉴定依据缺失',
      riskDescription: '如果商品质量问题存在争议，可能需要第三方检测报告作为证据。但检测本身需要一定费用，且检测结果存在不确定性。',
      suggestion: '建议先与商家协商，如商家承认质量问题则可直接作为证据。如商家不承认，可考虑申请第三方检测。',
      relatedFocus: '质量问题/瑕疵',
    },
  },

  // ==================== 互联网服务 ====================
  'internet:refuse-refund': {
    'beyond-refund-period': {
      riskLevel: 'medium',
      riskTitle: '超过平台退款期限',
      riskDescription: '如果您的退款申请已超过平台规则约定的退款期限（如7天、30天等），平台可能据此拒绝退款。但根据《消费者权益保护法》，七日无理由退货权益不因超过平台期限而丧失。',
      suggestion: '如符合《消费者权益保护法》第25条的情形（网络购物），即使超过平台期限，仍可主张七日无理由退货权。建议保留商品完好状态的相关证明。',
      relatedFocus: '拒绝退款',
    },
  },

  // ==================== 财产损害 ====================
  'property:damage': {
    'no-value-proof': {
      riskLevel: 'high',
      riskTitle: '财产价值证明缺失',
      riskDescription: '如果无法提供财产原值的有效证明（如购物发票、付款记录等），可能导致赔偿金额难以认定。',
      suggestion: '建议整理购物发票、付款记录、商品照片等能够证明财产价值的材料。如原购物凭证已丢失，可尝试从电商平台历史订单中调取。',
      relatedFocus: '财产损坏/丢失',
    },
    'third-party-liability': {
      riskLevel: 'medium',
      riskTitle: '第三方责任风险',
      riskDescription: '如果财产损坏涉及第三方（如酒店、停车场等场所的财产损失），责任认定可能涉及多方。建议核实场所方的安全保障义务是否履行到位。',
      suggestion: '建议保留场所方的监控录像（可向场所方申请调取）、报警回执等材料，以明确责任方。',
      relatedFocus: '财产损坏/丢失',
    },
  },

  // ==================== 出行交通 ====================
  'transport:delay-cancel': {
    'no-compensation-proof': {
      riskLevel: 'medium',
      riskTitle: '补偿方案记录缺失',
      riskDescription: '如果平台提供了改签、退款或其他补偿方案但未保留记录，可能影响后续主张其他权益。',
      suggestion: '建议截图保存平台所有通知和补偿方案记录，包括短信、App通知、邮件等。',
      relatedFocus: '延误/取消',
    },
    'force-majeure': {
      riskLevel: 'low',
      riskTitle: '不可抗力免责风险',
      riskDescription: '如果航班取消或延误的原因是航空公司认定的"不可抗力"（如恶劣天气、空中管制等），可能免于赔偿。建议核实取消/延误的具体原因是否属于不可抗力。',
      suggestion: '可通过航空公司官网或航班追踪App查询具体延误/取消原因。如认为原因不合理，可向民航局投诉。',
      relatedFocus: '延误/取消',
    },
  },
};

/**
 * 根据纠纷类型、焦点、材料状态匹配风险提示
 */
export function matchRiskAlerts(disputeType, focusKey, existingMaterials = [], missingMaterials = []) {
  const risks = [];

  // 精确匹配
  const exactKey = `${disputeType}:${focusKey}`;
  const rules = riskLibrary[exactKey];
  if (rules) {
    if (typeof rules === 'object' && !Array.isArray(rules)) {
      Object.values(rules).forEach(rule => risks.push(rule));
    }
  }

  // 高优先级规则兜底
  if (focusKey === '虚假夸大宣传' && !existingMaterials.includes('机构宣传材料')) {
    const fallback = riskLibrary['education:false-advertising']?.['missing-promotion-material'];
    if (fallback) risks.push(fallback);
  }
  if (focusKey === '不退费/拖延退费' && !existingMaterials.includes('合同/协议')) {
    const fallback = riskLibrary['education:refuse-refund']?.['contract-has-no-refund-clause'];
    if (fallback) risks.push(fallback);
  }

  return risks;
}

/**
 * 获取某纠纷类型的全部风险规则
 */
export function getAllRisksForDispute(disputeType) {
  const risks = [];
  Object.keys(riskLibrary).forEach(key => {
    if (key.startsWith(`${disputeType}:`)) {
      const ruleSet = riskLibrary[key];
      if (Array.isArray(ruleSet)) {
        risks.push(...ruleSet);
      } else if (typeof ruleSet === 'object') {
        Object.values(ruleSet).forEach(r => risks.push(r));
      }
    }
  });
  return risks;
}
