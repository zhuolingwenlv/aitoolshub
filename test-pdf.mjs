import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_DIR = path.join(__dirname, 'public/pdfs');

const testReport = {
  reportId: 'TEST-001',
  reportTime: '2026/05/13 01:50',
  module1: { type: 'education', amount: '8600', status: '已投诉', focus: ['虚假宣传'] },
  module2: { have: [{ name: '合同', quality: 'A' }], suggest: [] },
  module3: { nodes: [{ time: '05/13', event: '投诉', source: '用户', level: 'C' }], note: '' },
  module4: [{ name: '《消费者权益保护法》', clause: '第53条', content: '退费规定' }],
  module5: { nodes: [{ id: 'n', name: '协商', stage: 1, icon: '🤝', done: false, current: true }], currentStageGuide: {} },
  module6: { declares: [{ title: '抗辩', claim: 'claim', analysis: 'analysis' }], features: {} },
  module7: { items: [{ label: '诉讼占比', value: '15%' }] },
  module8: { declares: ['声明1', '声明2'], platform: '启信通' },
};

const filePath = path.join(PDF_DIR, 'test-mini.pdf');
const doc = new PDFDocument({ size: 'A4', margin: 0 });
const stream = fs.createWriteStream(filePath);

stream.on('finish', () => {
  const stats = fs.statSync(filePath);
  console.log('PDF created, size:', stats.size);
  process.exit(0);
});
stream.on('error', (err) => {
  console.error('Stream error:', err.message);
  process.exit(1);
});

doc.pipe(stream);
doc.fontSize(16).text('Hello PDF', 100, 100);
doc.end();

setTimeout(() => { console.error('Timeout'); process.exit(1); }, 5000);
