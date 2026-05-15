// 流程节点库——按状态（stage）标记当前阶段
// stage: 0=未处理, 1=协商, 2=投诉, 3=调解, 4=仲裁, 5=诉讼

export const PROCESS_NODES = {
  negotiation: {
    id: 'negotiation',
    name: '协商',
    stage: 1,
    icon: '🤝',
    operation_guide: '主动联系对方，提出具体诉求，保留沟通记录。可通过书面函件、微信/短信等可留存证据的方式沟通，明确说明退款金额、期限和依据。',
    tips: ['优先通过书面方式沟通，可发律师函（可选）', '全程保留沟通记录作为证据', '明确退款金额的法律依据'],
  },
  complaint: {
    id: 'complaint',
    name: '投诉',
    stage: 2,
    icon: '📋',
    operation_guide: '向消费者协会（12315）或行业主管部门提交投诉材料，说明事情经过、诉求和证据，等待受理和调解。可同时向市场监管部门反映。',
    tips: ['拨打12315热线或通过全国12315平台在线投诉', '准备好证据材料（合同、付款记录、沟通记录等）', '可同时向多个部门投诉，增加处理力度'],
  },
  mediation: {
    id: 'mediation',
    name: '调解',
    stage: 3,
    icon: '⚖️',
    operation_guide: '消协或法院会组织双方进行调解。调解员会了解双方意见，提出调解方案。调解成功会出具调解协议，具有法律效力；调解不成可继续下一步。',
    tips: ['调解不收费，程序相对简便', '调解协议经司法确认后具有强制执行力', '保持理性，做好适当让步的心理准备'],
  },
  arbitration: {
    id: 'arbitration',
    name: '仲裁',
    stage: 4,
    icon: '🏛️',
    operation_guide: '如合同约定了仲裁条款，可向约定仲裁机构申请仲裁。仲裁一裁终局，效率较高。注意：仲裁需要提前约定，没有约定则不能申请仲裁。',
    tips: ['仲裁具有法律强制力', '程序规范，一裁终局', '需要准备充分的证据材料'],
  },
  litigation: {
    id: 'litigation',
    name: '诉讼',
    stage: 5,
    icon: '⚖️',
    operation_guide: '向有管辖权的人民法院提起诉讼。可自己起诉（成本低）或委托律师代理（更专业）。小额诉讼程序可网上立案，诉讼费根据标的金额计算。',
    tips: ['诉讼是最后的救济途径', '起诉需要准备起诉状和证据材料', '可申请财产保全防止对方转移资产'],
  },
};

// 状态到当前阶段的映射
export const STATUS_STAGE_MAP = {
  not_yet: 0,        // 还没跟对方说过 → 从协商开始
  talked: 1,          // 跟对方提过但没谈拢 → 投诉阶段
  contact_lost: 1,   // 对方不接电话/关门了 → 投诉/调解
  complained: 2,     // 已经投诉到监管部门 → 调解或仲裁
  legal: 5,          // 已经在走法律程序 → 诉讼
};

// 获取带当前状态标记的流程图
export function getProcessPath(status) {
  const currentStage = STATUS_STAGE_MAP[status] || 0;
  const nodes = ['negotiation', 'complaint', 'mediation', 'arbitration', 'litigation'];
  return nodes.map((id, idx) => ({
    ...PROCESS_NODES[id],
    done: idx < currentStage,
    current: idx === currentStage,
  }));
}
