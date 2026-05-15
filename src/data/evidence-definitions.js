// 金额区间表
export const AMOUNT_RANGES = [
  { id: '0-1000', label: '1000元以下', min: 0, max: 1000 },
  { id: '1000-3000', label: '1000-3000元', min: 1000, max: 3000 },
  { id: '3000-5000', label: '3000-5000元', min: 3000, max: 5000 },
  { id: '5000-10000', label: '5000-10000元', min: 5000, max: 10000 },
  { id: '10000-50000', label: '10000-50000元', min: 10000, max: 50000 },
  { id: '50000-100000', label: '50000-100000元', min: 50000, max: 100000 },
  { id: '100000+', label: '100000元以上', min: 100000, max: Infinity },
];

// 状态选项
export const STATUS_OPTIONS = [
  { id: 'not_yet', label: '还没跟对方说过', stage: 0, desc: '尚未自行协商' },
  { id: 'talked', label: '跟对方提过但没谈拢', stage: 1, desc: '自行协商未果' },
  { id: 'contact_lost', label: '对方不接电话/关门了', stage: 1, desc: '对方失联' },
  { id: 'complained', label: '已经投诉到监管部门', stage: 2, desc: '行政投诉阶段' },
  { id: 'legal', label: '已经在走法律程序', stage: 4, desc: '进入司法程序' },
];

// 证据材料项定义（与前端 EVIDENCE_TYPES_CONFIG 保持一致）
export const EVIDENCE_ITEMS = [
  // 通用
  { id: 'contract', label: '合同或协议', desc: '证明双方权利义务', source: '与机构签订的服务协议、课程合同等' },
  { id: 'transfer', label: '付款记录/转账', desc: '锁定实际损失金额', source: '银行流水、支付宝/微信支付记录、收据或发票' },
  { id: 'chat', label: '聊天记录', desc: '记录关键对话和承诺', source: '与机构负责人或销售人员的微信、短信沟通记录' },
  { id: 'ads', label: '宣传材料图片', desc: '证明虚假宣传或夸大承诺', source: '机构宣传页面截图、朋友圈海报、宣传册等' },
  // 劳动纠纷专属
  { id: 'salary', label: '工资流水', desc: '证明工资金额和发放情况', source: '银行App或网点打印的工资入账记录' },
  { id: 'social', label: '社保缴费记录', desc: '证明社保缴纳情况', source: '当地社保局网站、社保卡App、社保中心打印' },
  // 租房纠纷专属
  { id: 'photos', label: '房屋照片', desc: '证明房屋交付时的状态', source: '入住时的房间照片、视频' },
  { id: 'contract_orig', label: '原始租赁合同', desc: '证明租赁条款和押金约定', source: '签订的正本租赁合同' },
];

export const EVIDENCE_ITEMS_MAP = Object.fromEntries(EVIDENCE_ITEMS.map(e => [e.id, e]));
