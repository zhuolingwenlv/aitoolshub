// 宏观统计数据——按纠纷类型+金额区间
// 普通用户：4项基础统计 | 季SVIP：+处理方式分布表+时间趋势表

const STATS_DATA = {
  education: {
    basic: {
      litigation_rate: '约15%-20%',
      mediation_rate: '约40%-50%',
      avg_cycle: '2-4个月',
      support_rate: '约85%-90%',
    },
    // 季SVIP+ 纠纷处理方式分布
    resolution_distribution: [
      { method: '协商和解', ratio: '约40%-50%', cycle: '1-4周', note: '大多数纠纷在此阶段解决' },
      { method: '行政调解', ratio: '约25%-30%', cycle: '1-3个月', note: '监管部门介入后处理效率较高' },
      { method: '仲裁裁决', ratio: '约5%-8%', cycle: '3-6个月', note: '适用于合同中有仲裁协议的情形' },
      { method: '诉讼判决', ratio: '约15%-20%', cycle: '4-8个月', note: '最终救济途径' },
    ],
    // 季SVIP+ 时间趋势（近三年）
    support_trend: [
      { year: '2024', full_support: '约45%', partial_support: '约42%', reject: '约13%' },
      { year: '2025', full_support: '约48%', partial_support: '约40%', reject: '约12%' },
      { year: '2026年1-5月', full_support: '约50%', partial_support: '约38%', reject: '约12%' },
    ],
    regions: { high: ['北京', '上海', '广东'], low: ['西部省份'] },
    trend: '近三年此类纠纷数量呈上升趋势，主要集中在K12培训和职业教育领域。消费者胜诉率（含全额和部分支持）约90%，但实际获赔金额与请求金额存在一定差距。',
  },
  medical: {
    basic: {
      litigation_rate: '约8%-15%',
      mediation_rate: '约30%-45%',
      avg_cycle: '3-6个月',
      support_rate: '约45%-60%',
    },
    resolution_distribution: [
      { method: '协商和解', ratio: '约35%-45%', cycle: '1-4周', note: '医患双方私下协商解决' },
      { method: '行政调解', ratio: '约20%-30%', cycle: '1-3个月', note: '卫健委或医调委介入' },
      { method: '鉴定后调解', ratio: '约15%-20%', cycle: '3-6个月', note: '需先完成医疗损害鉴定' },
      { method: '诉讼判决', ratio: '约8%-15%', cycle: '6-12个月', note: '举证难度大，周期较长' },
    ],
    support_trend: [
      { year: '2024', full_support: '约30%', partial_support: '约40%', reject: '约30%' },
      { year: '2025', full_support: '约33%', partial_support: '约38%', reject: '约29%' },
      { year: '2026年1-5月', full_support: '约35%', partial_support: '约37%', reject: '约28%' },
    ],
    regions: { high: ['北京', '上海', '成都'], low: ['二三线城市'] },
    trend: '医美纠纷逐年增加，以眼部、鼻部手术和注射类项目居多。举证难度较大，建议优先补充病历和术前术后对比照片。',
  },
  labor: {
    basic: {
      litigation_rate: '约20%-30%',
      mediation_rate: '约50%-65%',
      avg_cycle: '1-3个月',
      support_rate: '约65%-75%',
    },
    resolution_distribution: [
      { method: '协商解决', ratio: '约40%-50%', cycle: '1-2周', note: '劳资双方直接协商' },
      { method: '劳动监察大队投诉', ratio: '约20%-25%', cycle: '2-4周', note: '用人单位违反劳动法时适用' },
      { method: '劳动仲裁', ratio: '约20%-30%', cycle: '1-3个月', note: '仲裁前置，必经程序' },
      { method: '诉讼', ratio: '约5%-10%', cycle: '3-6个月', note: '不服仲裁裁决可起诉' },
    ],
    support_trend: [
      { year: '2024', full_support: '约55%', partial_support: '约25%', reject: '约20%' },
      { year: '2025', full_support: '约58%', partial_support: '约23%', reject: '约19%' },
      { year: '2026年1-5月', full_support: '约60%', partial_support: '约22%', reject: '约18%' },
    ],
    regions: { high: ['广东', '浙江', '江苏'], low: ['西部欠发达地区'] },
    trend: '工伤赔偿和违法辞退类纠纷占比上升，劳动者维权意识持续增强胜诉率较高。',
  },
  consumer: {
    basic: {
      litigation_rate: '约15%-22%',
      mediation_rate: '约45%-58%',
      avg_cycle: '1-3个月',
      support_rate: '约50%-65%',
    },
    resolution_distribution: [
      { method: '协商和解', ratio: '约45%-55%', cycle: '1-2周', note: '商家直接退款或赔偿' },
      { method: '平台申诉', ratio: '约20%-25%', cycle: '3-7天', note: '通过电商平台介入处理' },
      { method: '消协调解', ratio: '约15%-20%', cycle: '1-2周', note: '消费者协会居中调解' },
      { method: '诉讼判决', ratio: '约8%-12%', cycle: '3-6个月', note: '金额较大时采用' },
    ],
    support_trend: [
      { year: '2024', full_support: '约38%', partial_support: '约35%', reject: '约27%' },
      { year: '2025', full_support: '约40%', partial_support: '约34%', reject: '约26%' },
      { year: '2026年1-5月', full_support: '约42%', partial_support: '约33%', reject: '约25%' },
    ],
    regions: { high: ['浙江', '广东', '上海'], low: ['偏远地区'] },
    trend: '网络购物纠纷占比持续扩大，新型消费场景（直播带货、盲盒）纠纷增长明显。',
  },
  default: {
    basic: {
      litigation_rate: '约15%-20%',
      mediation_rate: '约40%-50%',
      avg_cycle: '2-5个月',
      support_rate: '约50%-65%',
    },
    resolution_distribution: [
      { method: '协商解决', ratio: '约40%-50%', cycle: '1-4周', note: '双方直接协商' },
      { method: '调解处理', ratio: '约25%-35%', cycle: '1-3个月', note: '第三方调解' },
      { method: '诉讼判决', ratio: '约15%-20%', cycle: '4-12个月', note: '最终救济途径' },
    ],
    support_trend: [
      { year: '2024', full_support: '约40%', partial_support: '约35%', reject: '约25%' },
      { year: '2025', full_support: '约42%', partial_support: '约33%', reject: '约25%' },
      { year: '2026年1-5月', full_support: '约43%', partial_support: '约32%', reject: '约25%' },
    ],
    regions: { high: ['一线城市'], low: ['三四线城市'] },
    trend: '纠纷数量整体呈上升趋势，线上纠纷增长更快。',
  },
};

/**
 * 获取统计数据（按会员等级差异化输出）
 * @param {string} disputeType - 纠纷类型
 * @param {number} memberLevel - 会员等级 0=普通 1=单次 2=季VIP 3=季SVIP 4=黑金年卡
 */
export function getStats(disputeType, memberLevel = 0) {
  const stats = STATS_DATA[disputeType] || STATS_DATA.default;

  // 普通/单次用户：4项基础统计
  const basicItems = [
    { label: '进入诉讼程序的占比', value: stats.basic.litigation_rate },
    { label: '调解/和解结案的占比', value: stats.basic.mediation_rate },
    { label: '消费者请求获支持的占比', value: stats.basic.support_rate },
    { label: '从立案到一审结案平均周期', value: stats.basic.avg_cycle },
  ];

  // 季SVIP（>=3）：增加处理方式分布+时间趋势+地域差异
  if (memberLevel >= 3) {
    return {
      basicItems,
      // 处理方式分布表
      resolution_distribution: {
        title: '处理方式分布',
        headers: ['处理方式', '占比', '平均处理周期', '说明'],
        rows: stats.resolution_distribution.map(r => [
          r.method, r.ratio, r.cycle, r.note,
        ]),
      },
      // 时间趋势表
      support_trend: {
        title: '消费者请求获支持比例趋势（近三年）',
        headers: ['年份', '全额支持比例', '部分支持比例', '驳回比例'],
        rows: stats.support_trend.map(t => [
          t.year, t.full_support, t.partial_support, t.reject,
        ]),
      },
      // 地域差异
      region_comparison: {
        high: stats.regions?.high?.join('、') || '暂无',
        low: stats.regions?.low?.join('、') || '暂无',
      },
      // 趋势说明
      trend_note: stats.trend || '暂无趋势数据',
    };
  }

  // 普通/单次/季VIP：仅基础统计
  return { items: basicItems };
}

export const STATS_DESCRIPTION = STATS_DATA;
