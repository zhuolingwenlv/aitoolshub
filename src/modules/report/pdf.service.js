/**
 * PDF生成服务——异步任务队列 + 报告缓存
 *
 * 优化策略：
 * 1. 任务队列：generatePDF()立即返回taskId，实际PDF在后台异步生成
 * 2. 报告缓存：同一reportId在10分钟内不重复生成，直接返回缓存路径
 * 3. 超时保护：生成超时15秒自动标记失败，防止进程卡死
 *
 * 水印规格（按评估报告要求）：
 * - 文字"仅供参考" · 浅灰色 · 45度倾斜 · 整页覆盖
 * - 页眉左侧Logo+"纠纷信息结构化档案"，右侧文档编号
 * - 页脚居中"本档案由AI自动生成，仅供参考"
 * - 元数据：生成时间+服务提供者+内容编号
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PDF_DIR = process.env.NODE_ENV === 'production'
  ? '/app/public/pdfs'
  : path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../public/pdfs');

// 确保PDF目录存在
try {
  if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[PDF] 目录创建失败（可能已存在或无权限）:', String(e));
}

// ==================== 任务队列 ====================
const taskQueue = new Map(); // taskId → { status, reportId, filePath, createdAt, error }
let taskCounter = 0;

// ==================== 缓存（10分钟） ====================
const pdfCache = new Map(); // reportId → { filePath, createdAt }
const CACHE_TTL = 10 * 60 * 1000; // 10分钟

function getCachedPdf(reportId) {
  const cached = pdfCache.get(reportId);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL) {
    return cached.filePath;
  }
  return null;
}

function cachePdf(reportId, filePath) {
  // 清理过期缓存
  for (const [key, val] of pdfCache.entries()) {
    if (Date.now() - val.createdAt >= CACHE_TTL) {
      pdfCache.delete(key);
    }
  }
  pdfCache.set(reportId, { filePath, createdAt: Date.now() });
}

// ==================== PDF内容生成 ====================
function buildPdfContent(doc, report, options = {}) {
  const {
    waterMarkText = '仅供参考',
    reportTime = '',
    reportId = '',
  } = options;

  const GRAY = '#999999';
  const DARK = '#333333';
  const ORANGE = '#E85A38';
  const LIGHT_GRAY = '#F5F5F5';

  // ---- 注册中文字体（simhei.ttf 提交在 fonts/ 目录）----
  const fontPath = '/app/fonts/simhei.ttf';
  try {
    doc.registerFont('SimHei', fontPath);
    doc.font('SimHei');
  } catch (e) {
    console.error('[PDF] 中文字体加载失败:', e.message);
    // 不可恢复——没有中文字体PDF全是方块
    throw new Error('中文字体缺失，无法生成PDF');
  }

  // ---- 水印 ----
  doc.save();
  doc.fillColor('#E8E8E8');
  doc.fontSize(60);
  doc.rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] });
  doc.text(waterMarkText, 0, doc.page.height / 2 - 30, {
    width: doc.page.width,
    align: 'center',
    lineBreak: false,
  });
  doc.restore();

  // ---- 页眉 ----
  doc.save();
  doc.rect(0, 0, doc.page.width, 50).fill(ORANGE);
  doc.fillColor('white');
  doc.fontSize(11);
  doc.text('启信通 · 纠纷信息结构化档案', 20, 17, { lineBreak: false });
  doc.text(`文档编号：${reportId}`, doc.page.width - 180, 17, {
    lineBreak: false,
    align: 'right',
    width: 160,
  });
  doc.restore();

  // ---- 页脚 ----
  const footerY = doc.page.height - 35;
  doc.save();
  doc.fillColor(GRAY);
  doc.fontSize(9);
  doc.text('本档案由AI自动生成，仅供参考', 0, footerY, {
    width: doc.page.width,
    align: 'center',
    lineBreak: false,
  });
  doc.text(`第 ${options.page || 1} 页`, doc.page.width - 60, footerY, {
    lineBreak: false,
    align: 'right',
    width: 50,
  });
  doc.restore();

  // ---- 内容区（40, 70 开始） ----
  const contentTop = 70;
  const contentWidth = doc.page.width - 80;
  let y = contentTop;

  // 标题
  doc.save();
  doc.fillColor(DARK);
  doc.fontSize(16);
  doc.text('纠纷信息结构化档案', 40, y, { width: contentWidth, lineBreak: false });
  y += 28;

  // 报告时间和编号
  doc.fillColor(GRAY);
  doc.fontSize(9);
  doc.text(`生成时间：${reportTime}    文档编号：${reportId}`, 40, y, {
    width: contentWidth,
    lineBreak: false,
  });
  y += 25;

  // 分隔线
  doc.save();
  doc.strokeColor('#DDDDDD');
  doc.lineWidth(0.5);
  doc.moveTo(40, y).lineTo(doc.page.width - 40, y).stroke();
  doc.restore();
  y += 15;

  // ---- 模块一：纠纷事实梳理 ----
  const m1 = report.module1 || {};
  doc.save();
  doc.fillColor(ORANGE);
  doc.fontSize(12);
  doc.text('一、纠纷事实梳理', 40, y, { width: contentWidth, lineBreak: false });
  y += 20;

  doc.fillColor(DARK);
  doc.fontSize(10);
  const m1Rows = [
    ['纠纷类型', m1.type || '-'],
    ['涉及金额', m1.amount || '-'],
    ['当前状态', m1.status || '-'],
  ];
  if (Array.isArray(m1.focus)) {
    m1Rows.push(['争议焦点', m1.focus.join('、')]);
  } else if (m1.focus) {
    m1Rows.push(['争议焦点', m1.focus]);
  }

  m1Rows.forEach(([label, value]) => {
    doc.fillColor('#666666');
    doc.text(`${label}：`, 40, y, { lineBreak: false, width: 80 });
    doc.fillColor(DARK);
    doc.text(value, 120, y, { width: contentWidth - 80, lineBreak: false });
    y += 18;
  });

  // 季VIP+ 争议焦点解析
  if (m1.focusAnalysis && Array.isArray(m1.focusAnalysis)) {
    y += 8;
    doc.fillColor(ORANGE).fontSize(10).text('【争议焦点解析】', 40, y, { width: contentWidth });
    y += 18;
    m1.focusAnalysis.forEach((fa, idx) => {
      doc.fillColor(DARK).fontSize(10);
      doc.text(`${idx + 1}. ${fa.focus}`, 40, y, { width: contentWidth, lineBreak: false });
      y += 16;
      if (fa.definition) {
        doc.fillColor(GRAY).fontSize(9);
        doc.text(`定义：${fa.definition}`, 55, y, { width: contentWidth - 15 });
        y += 14;
      }
      if (fa.judgmentBasis && fa.judgmentBasis.length > 0) {
        doc.fillColor(GRAY).fontSize(9);
        doc.text('判断依据：', 55, y, { lineBreak: false });
        y += 14;
        fa.judgmentBasis.forEach(b => {
          doc.text(`· ${b}`, 65, y, { width: contentWidth - 25 });
          y += 13;
        });
      }
      y += 5;
    });
  }
  doc.restore();

  // ---- 模块二：证据材料清单 ----
  const m2 = report.module2 || {};
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;

  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text('二、证据材料清单', 40, y, { width: contentWidth });
  y += 20;

  // 已有材料
  if (m2.have && m2.have.length > 0) {
    doc.fillColor(DARK).fontSize(10).text('已有材料：', 40, y, { lineBreak: false });
    y += 18;
    m2.have.forEach(item => {
      doc.fillColor('#333333').fontSize(9);
      doc.text(`✅ ${item.name}`, 50, y, { lineBreak: false });
      y += 14;
      if (item.tip) {
        doc.fillColor(GRAY).fontSize(8);
        doc.text(`   说明：${item.tip}`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      // 季VIP+ 材料来源
      if (item.source) {
        doc.fillColor('#666666').fontSize(8);
        doc.text(`   来源：${item.source}`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      // 季SVIP+ 效力评估
      if (item.effectiveness) {
        doc.fillColor('#E85A38').fontSize(8);
        const effLabel = { '高': '★★★★★', '中高': '★★★★☆', '中': '★★★★' };
        doc.text(`   效力：${effLabel[item.effectiveness] || item.effectiveness} 直接证据`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      y += 3;
    });
  }

  // 建议补充
  if (m2.suggest && m2.suggest.length > 0) {
    y += 5;
    doc.fillColor(DARK).fontSize(10).text('建议补充：', 40, y, { lineBreak: false });
    y += 18;
    m2.suggest.forEach(item => {
      doc.fillColor('#FF9900').fontSize(9);
      doc.text(`⚠ ${item.name}`, 50, y, { lineBreak: false });
      y += 14;
      if (item.reason) {
        doc.fillColor(GRAY).fontSize(8);
        doc.text(`   原因：${item.reason}`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      if (item.channel) {
        doc.fillColor(GRAY).fontSize(8);
        doc.text(`   获取途径：${item.channel}`, 55, y, { width: contentWidth - 15 });
        y += 13;
      }
      y += 3;
    });
  }

  // 季SVIP+ 完整度评估
  if (m2.completeness) {
    y += 8;
    doc.save();
    doc.rect(40, y, contentWidth, 40).fill(LIGHT_GRAY);
    doc.fillColor(DARK).fontSize(10);
    doc.text(`证据链完整度：${m2.completeness.score}%（${m2.completeness.level}）`, 50, y + 10, { width: contentWidth - 20 });
    doc.fillColor(GRAY).fontSize(9);
    doc.text(m2.completeness.tip || `已覆盖${m2.completeness.focusCoverage}`, 50, y + 26, { width: contentWidth - 20 });
    y += 50;
    doc.restore();
  }
  doc.restore();

  // ============================================================
  // 以下模块编号 = 实际 API 返回的 module1~module8 结构
  // ============================================================

  // ---- 模块三：纠纷时间线 ----
  // 真实结构: module3 = { nodes: [{time, event, source, level}], note }
  const m3 = report.module3 || {};
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;

  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text('三、纠纷时间线', 40, y, { width: contentWidth });
  y += 20;

  if (m3.nodes && m3.nodes.length > 0) {
    m3.nodes.forEach((node, idx) => {
      // 节点标记
      const marker = node.level && (node.level.includes('A') || node.level.includes('B'))
        ? '●'
        : '○';
      doc.fillColor(DARK).fontSize(10);
      doc.text(`${marker} ${node.time || ''}  ${node.event || ''}`, 40, y, { width: contentWidth });
      y += 16;
      doc.fillColor(GRAY).fontSize(8);
      if (node.source) {
        doc.text(`   来源：${node.source}`, 50, y, { width: contentWidth - 10 });
        y += 13;
      }
      if (node.level) {
        doc.fillColor('#9999CC').fontSize(8);
        doc.text(`   证据等级：${node.level}`, 50, y, { width: contentWidth - 10 });
        y += 13;
      }
      y += 4;
    });
  } else {
    doc.fillColor(GRAY).fontSize(9);
    doc.text('暂无时间线数据', 40, y, { width: contentWidth });
    y += 16;
  }
  if (m3.note) {
    y += 4;
    doc.fillColor('#BBBBBB').fontSize(8);
    doc.text(m3.note, 40, y, { width: contentWidth });
  }
  doc.restore();

  // ---- 模块四：法律法规索引 ----
  // 真实结构: module4 = array of {name, content}
  const m4 = Array.isArray(report.module4) ? report.module4 : [];
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;

  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text('四、法律法规索引', 40, y, { width: contentWidth });
  y += 20;

  if (m4.length > 0) {
    m4.forEach((law, idx) => {
      doc.fillColor(DARK).fontSize(10);
      doc.text(`${idx + 1}. ${law.name || ''}`, 40, y, { width: contentWidth, lineBreak: false });
      y += 16;
      if (law.content) {
        doc.fillColor(GRAY).fontSize(9);
        doc.text(law.content, 55, y, { width: contentWidth - 15 });
        y += 14;
      }
      y += 5;
    });
  } else {
    doc.fillColor(GRAY).fontSize(9);
    doc.text('暂无法律条文数据', 40, y, { width: contentWidth });
    y += 16;
  }
  doc.restore();

  // ---- 模块五：维权流程参考 ----
  // 真实结构: module5 = { nodes: [...], currentStageGuide: {...} }
  const m5 = report.module5 || {};
  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;

  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text('五、维权流程参考', 40, y, { width: contentWidth });
  y += 20;

  if (m5.nodes && m5.nodes.length > 0) {
    const nodeLabels = m5.nodes.map(n => {
      const marker = n.current ? '●' : (n.done ? '✓' : '○');
      return `${marker}${n.name || ''}`;
    });
    doc.fillColor(DARK).fontSize(10);
    doc.text(nodeLabels.join(' → '), 40, y, { width: contentWidth });
    y += 25;

    m5.nodes.forEach(node => {
      const marker = node.current ? '●' : (node.done ? '✓' : '○');
      doc.fillColor(node.current ? ORANGE : '#666666').fontSize(9);
      doc.text(`${marker} ${node.name || ''}`, 40, y, { lineBreak: false, width: 80 });
      if (node.operation_guide) {
        doc.fillColor(GRAY).fontSize(8);
        doc.text(`：${node.operation_guide}`, 80, y, { width: contentWidth - 40 });
        y += 14;
      }
      if (node.tips && Array.isArray(node.tips)) {
        doc.fillColor('#E85A38').fontSize(8);
        node.tips.forEach(tip => {
          doc.text(`  · ${tip}`, 80, y, { width: contentWidth - 40 });
          y += 12;
        });
      }
      y += 5;
    });
  }

  // 当前阶段操作指引
  if (m5.currentStageGuide && m5.currentStageGuide.stage) {
    y += 8;
    doc.save();
    doc.fillColor(ORANGE).fontSize(10).text('【当前阶段操作指引】', 40, y, { width: contentWidth });
    y += 18;
    doc.fillColor(DARK).fontSize(9);
    doc.text(`当前阶段：${m5.currentStageGuide.stage}`, 50, y, { width: contentWidth - 10, lineBreak: false });
    y += 16;
    if (m5.currentStageGuide.guide) {
      doc.fillColor(GRAY).fontSize(8);
      doc.text(m5.currentStageGuide.guide, 50, y, { width: contentWidth - 10 });
      y += 28;
    }
    if (m5.currentStageGuide.tips) {
      doc.fillColor('#E85A38').fontSize(8);
      doc.text(`提示：${m5.currentStageGuide.tips}`, 50, y, { width: contentWidth - 10 });
      y += 16;
    }
    doc.restore();
  }
  doc.restore();

  // ---- 模块六：抗辩与有利/不利特征 ----
  // 真实结构: module6 = { declares: [], features: { favorable: [], unfavorable: [] } }
  const m6 = report.module6 || {};
  const favorable = m6.features && m6.features.favorable ? m6.features.favorable : [];
  const unfavorable = m6.features && m6.features.unfavorable ? m6.features.unfavorable : [];

  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;

  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text('六、案件特征分析', 40, y, { width: contentWidth });
  y += 20;

  if (favorable.length > 0) {
    doc.fillColor('#1A7A1A').fontSize(10).text('【有利特征】', 40, y, { width: contentWidth });
    y += 16;
    favorable.forEach(f => {
      doc.fillColor(DARK).fontSize(9);
      doc.text(`✓ ${f}`, 50, y, { width: contentWidth - 10 });
      y += 14;
    });
    y += 5;
  }

  if (unfavorable.length > 0) {
    doc.fillColor('#CC3333').fontSize(10).text('【不利特征】', 40, y, { width: contentWidth });
    y += 16;
    unfavorable.forEach(f => {
      doc.fillColor(DARK).fontSize(9);
      doc.text(`✗ ${f}`, 50, y, { width: contentWidth - 10 });
      y += 14;
    });
    y += 5;
  }

  if (favorable.length === 0 && unfavorable.length === 0) {
    doc.fillColor(GRAY).fontSize(9).text('暂无特征分析数据', 40, y, { width: contentWidth });
    y += 16;
  }
  doc.restore();

  // ---- 模块七：统计数据参考 ----
  // 真实结构: module7 = { items: [{label, value}] }
  const m7 = report.module7 || {};
  const items7 = Array.isArray(m7.items) ? m7.items : [];

  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;

  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text('七、统计数据参考', 40, y, { width: contentWidth });
  y += 20;

  if (items7.length > 0) {
    items7.forEach(item => {
      doc.fillColor('#666666').fontSize(9);
      doc.text(`${item.label || ''}：`, 40, y, { lineBreak: false, width: 160 });
      doc.fillColor(DARK).fontSize(9);
      doc.text(item.value || '-', 200, y, { width: contentWidth - 160, lineBreak: false });
      y += 16;
    });
  } else {
    doc.fillColor(GRAY).fontSize(9).text('暂无统计数据', 40, y, { width: contentWidth });
    y += 16;
  }
  doc.restore();

  // ---- 模块八：重要声明 ----
  // 真实结构: module8 = { declares: [], platform }
  const m8 = report.module8 || {};
  const declares8 = Array.isArray(m8.declares) ? m8.declares : [];

  y += 10;
  _addDivider(doc, y, GRAY);
  y += 15;

  doc.save();
  doc.fillColor(ORANGE).fontSize(12);
  doc.text('八、重要声明', 40, y, { width: contentWidth });
  y += 20;

  if (declares8.length > 0) {
    declares8.forEach((d, idx) => {
      doc.fillColor(GRAY).fontSize(8);
      doc.text(`${idx + 1}. ${d}`, 40, y, { width: contentWidth });
      y += 14;
    });
  } else {
    doc.fillColor(GRAY).fontSize(9).text('暂无声明', 40, y, { width: contentWidth });
    y += 16;
  }

  y += 10;
  doc.fillColor(ORANGE).fontSize(9);
  doc.text(m8.platform || '启信通 · 遇到纠纷，先理清事实', 40, y, { width: contentWidth, align: 'center' });
  doc.restore();
}

function _addDivider(doc, y, color) {
  doc.save();
  doc.strokeColor(color);
  doc.lineWidth(0.5);
  doc.moveTo(40, y).lineTo(doc.page.width - 40, y).stroke();
  doc.restore();
}

// ==================== 异步生成（后台） ====================
function _generateInBackground(taskId, report, filePath) {
  return new Promise((resolve, reject) => {
    console.log(`[PDF] Starting generation for report ${report.reportId}`);
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: {
        Title: '纠纷信息结构化档案',
        Author: '启信通',
        Subject: `报告编号：${report.reportId}`,
        Keywords: '启信通,纠纷档案,仅供参考',
        CreationDate: new Date(),
        ModDate: new Date(),
        Producer: '启信通PDF生成服务 v1.0',
      },
    });

    const stream = fs.createWriteStream(filePath);

    stream.on('finish', () => {
      taskQueue.set(taskId, {
        status: 'completed',
        reportId: report.reportId,
        filePath,
        createdAt: Date.now(),
      });
      cachePdf(report.reportId, filePath);
      resolve(filePath);
    });

    stream.on('error', (err) => {
      taskQueue.set(taskId, {
        status: 'failed',
        reportId: report.reportId,
        error: err.message,
        createdAt: Date.now(),
      });
      reject(err);
    });

    doc.pipe(stream);
    try {
      const pageCount = doc.pageCount || 1;
      buildPdfContent(doc, report, {
      reportTime: report.reportTime,
      reportId: report.reportId,
      page: pageCount,
    });
      doc.end();
    } catch (err) {
      console.error(`[PDF] buildPdfContent error: ${err.message}`);
      console.error(err.stack);
      stream.end(); // close stream to trigger error handler
    }

    // 超时保护（15秒）
    setTimeout(() => {
      const task = taskQueue.get(taskId);
      if (task && task.status === 'pending') {
        task.status = 'timeout';
        doc.destroy();
        reject(new Error('PDF生成超时（15秒）'));
      }
    }, 15000);
  });
}

// ==================== 公开API ====================

/**
 * 异步生成PDF（立即返回taskId）
 * @param {object} report - 完整报告对象
 * @returns {{ taskId: string, status: string, filePath: string|null }}
 */
export function generatePdfTask(report) {
  const reportId = report.reportId;

  // 检查缓存
  const cached = getCachedPdf(reportId);
  if (cached) {
    const taskId = `cached-${reportId}-${Date.now()}`;
    taskQueue.set(taskId, {
      status: 'completed',
      reportId,
      filePath: cached,
      createdAt: Date.now(),
    });
    return { taskId, status: 'completed', filePath: cached };
  }

  // 检查是否有同一报告正在生成中
  for (const [tid, task] of taskQueue.entries()) {
    if (task.reportId === reportId && task.status === 'pending') {
      return { taskId: tid, status: 'pending', filePath: null };
    }
  }

  // 创建新任务
  const taskId = `pdf-${Date.now()}-${++taskCounter}`;
  const fileName = `report-${reportId}.pdf`;
  const filePath = path.join(PDF_DIR, fileName);

  taskQueue.set(taskId, {
    status: 'pending',
    reportId,
    filePath,
    createdAt: Date.now(),
  });

  // 异步生成（不阻塞）
  _generateInBackground(taskId, report, filePath).catch(err => {
    console.error(`❌ PDF生成失败 [${taskId}]:`, err.message);
  });

  return { taskId, status: 'pending', filePath: null };
}

/**
 * 查询PDF生成任务状态
 * @param {string} taskId
 * @returns {{ status: string, filePath: string|null, error: string|null }}
 */
export function getPdfTaskStatus(taskId) {
  const task = taskQueue.get(taskId);
  if (!task) {
    return { status: 'not_found', filePath: null, error: '任务不存在' };
  }
  const downloadUrl = task.filePath
    ? `/pdfs/${path.basename(task.filePath)}`
    : null;
  return {
    status: task.status,
    filePath: task.filePath || null,
    downloadUrl,
    error: task.error || null,
    reportId: task.reportId,
  };
}

/**
 * 根据reportId获取已有PDF路径（同步）
 */
export function getPdfByReportId(reportId) {
  return getCachedPdf(reportId);
}

// 清理过期任务（定期清理）
setInterval(() => {
  const now = Date.now();
  for (const [tid, task] of taskQueue.entries()) {
    if (now - task.createdAt > 30 * 60 * 1000) { // 30分钟清理
      taskQueue.delete(tid);
    }
  }
}, 5 * 60 * 1000); // 每5分钟检查一次
