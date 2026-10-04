import fs from 'fs';
import path from 'path';
import { evaluateRisk } from '../intelligence/services/riskIntelligence';

// Synthetic example matching the user's example
const sampleInput = {
  id: 'example-1',
  activityMultiplier: 4.2,
  repeatedEvents: 13,
  conflictingRecords: true,
  missingFields: [],
  requirementDeadlineDays: null,
  previousIssues: 0,
};

function badgeHtml(severity: string) {
  const colorMap: Record<string, string> = {
    NONE: '#9AA5B1',
    LOW: '#6CB4EE',
    MODERATE: '#F2C94C',
    HIGH: '#F2994A',
    CRITICAL: '#EB5757',
  };
  const color = colorMap[severity] ?? '#9AA5B1';
  return `<span style="display:inline-block;padding:4px 8px;border-radius:12px;background:${color};color:#fff;font-weight:600;font-size:12px">${severity}</span>`;
}

function ruleRow(rule: any) {
  const status = rule.triggered ? 'TRIGGERED' : 'OK';
  return `<tr>
    <td>${rule.ruleName}</td>
    <td>${rule.description}</td>
    <td>${JSON.stringify(rule.observedValue)}</td>
    <td>${JSON.stringify(rule.threshold)}</td>
    <td>${rule.points > 0 ? '+' + rule.points : 0}</td>
    <td>${status}</td>
    <td>${rule.explanation ?? ''}</td>
  </tr>`;
}

function generateHtml(result: any, input: any) {
  const rulesHtml = result.rules.map((r: any) => ruleRow(r)).join('\n');
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Investigation View - ${input.id}</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;margin:20px}
    table{width:100%;border-collapse:collapse}
    th,td{border:1px solid #e6e6e6;padding:8px;text-align:left}
    th{background:#f6f6f6}
  </style>
</head>
<body>
  <h1>Investigation: ${input.id}</h1>
  <p><strong>Risk Score:</strong> ${result.totalScore} ${badgeHtml(result.severity)}</p>
  <p><strong>Severity:</strong> ${result.severity}</p>
  <p><strong>Explanation:</strong> ${result.explanation}</p>
  <p><strong>Recommended Action:</strong> ${result.recommendedAction}</p>

  <h2>Rules Triggered</h2>
  <table>
    <thead>
      <tr>
        <th>Rule name</th>
        <th>Description</th>
        <th>Observed value</th>
        <th>Threshold</th>
        <th>Points</th>
        <th>Status</th>
        <th>Explanation</th>
      </tr>
    </thead>
    <tbody>
      ${rulesHtml}
    </tbody>
  </table>
</body>
</html>`;
}

function main() {
  const result = evaluateRisk(sampleInput as any);
  const outDir = path.resolve(process.cwd(), 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, `${sampleInput.id}-investigation.html`);
  fs.writeFileSync(outPath, generateHtml(result, sampleInput), { encoding: 'utf8' });
  console.log('Investigation generated:', outPath);
}

main();
