// 禁语字典——合规红线标准#5
// 出现次数必须为0，扫描/过滤全流程覆盖

const BANNED_WORDS = [
  // 结果预测
  '胜诉', '败诉', '能赢', '能要回来', '有多大把握', '成功率', '胜诉率',
  // 法律定性
  '对方违法', '构成违约', '构成侵权', '这是霸王条款', '合同无效',
  // 行动建议
  '建议您起诉', '你应该投诉', '建议请律师', '推荐方案', '最佳方案', '建议起诉', '投诉它',
  // 价值判断
  '风险高', '风险低', '证据充足', '证据不足', '你这情况很有利', '胜算大',
  // 身份暗示
  'AI律师', '智能律师', '法律诊断', '智能判案', 'AI维权', '法律AI',
  // 中介撮合
  '推荐律师', '为您匹配', '擅长领域', '胜诉率高', '找律师',
];

const REPLACEMENT = '***';

/**
 * 扫描文本，返回禁语词汇列表
 */
export function scanBannedWords(text) {
  if (!text || typeof text !== 'string') return [];
  const found = [];
  for (const word of BANNED_WORDS) {
    if (text.includes(word)) found.push(word);
  }
  return found;
}

/**
 * 过滤文本中的禁语词汇，返回过滤后文本
 */
export function filterBannedWords(text) {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  for (const word of BANNED_WORDS) {
    result = result.split(word).join(REPLACEMENT);
  }
  return result;
}

/**
 * 扫描并替换对象中所有字符串字段（递归）
 */
export function filterObject(obj) {
  if (typeof obj === 'string') return filterBannedWords(obj);
  if (Array.isArray(obj)) return obj.map(item => filterObject(item));
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = filterObject(obj[key]);
    }
    return result;
  }
  return obj;
}

export const BANNED_WORDS_LIST = BANNED_WORDS;
