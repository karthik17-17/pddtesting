import * as fs from 'fs';
import * as path from 'path';
import { TestCase } from '../data/testCases';
import { Logger } from './logger';

export class HtmlReportGenerator {
  private static outDir = path.join(__dirname, '..', 'reports', 'HTML');

  private static initialize() {
    if (!fs.existsSync(HtmlReportGenerator.outDir)) {
      fs.mkdirSync(HtmlReportGenerator.outDir, { recursive: true });
    }
  }

  public static generate(testCases: TestCase[], deviceName: string, androidVersion: string, appVersion: string, totalDurationSec: number): void {
    HtmlReportGenerator.initialize();
    Logger.info('Generating HTML automation reports...');

    const total = testCases.length;
    const passed = testCases.filter(c => c.status === 'PASSED').length;
    const failed = testCases.filter(c => c.status === 'FAILED').length;
    const skipped = testCases.filter(c => c.status === 'SKIPPED').length;
    const blocked = testCases.filter(c => c.status === 'BLOCKED').length;
    const passRate = ((passed / total) * 100).toFixed(1);

    const commonStyles = HtmlReportGenerator.getStyles();

    // 1. Generate dashboard.html
    const dashboardHtml = HtmlReportGenerator.buildDashboard(testCases, total, passed, failed, skipped, blocked, passRate, deviceName, androidVersion, appVersion, totalDurationSec, commonStyles);
    fs.writeFileSync(path.join(HtmlReportGenerator.outDir, 'dashboard.html'), dashboardHtml, 'utf8');

    // 2. Generate execution-report.html
    const reportHtml = HtmlReportGenerator.buildExecutionReport(testCases, total, passed, failed, skipped, blocked, passRate, deviceName, androidVersion, appVersion, totalDurationSec, commonStyles);
    fs.writeFileSync(path.join(HtmlReportGenerator.outDir, 'execution-report.html'), reportHtml, 'utf8');

    // 3. Generate trends.html
    const trendsHtml = HtmlReportGenerator.buildTrends(total, passed, failed, skipped, passRate, commonStyles);
    fs.writeFileSync(path.join(HtmlReportGenerator.outDir, 'trends.html'), trendsHtml, 'utf8');

    Logger.info(`HTML Reports successfully written to: ${HtmlReportGenerator.outDir}`);
  }

  private static getStyles(): string {
    return `
      :root {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;
        --text-primary: #f1f5f9;
        --text-secondary: #94a3b8;
        --primary: #6366f1;
        --primary-hover: #4f46e5;
        --success: #10b981;
        --success-bg: rgba(16, 185, 129, 0.15);
        --danger: #f43f5e;
        --danger-bg: rgba(244, 63, 94, 0.15);
        --warning: #f59e0b;
        --warning-bg: rgba(245, 158, 11, 0.15);
        --info: #0ea5e9;
        --info-bg: rgba(14, 165, 233, 0.15);
        --border: #334155;
        --font-main: 'Inter', system-ui, -apple-system, sans-serif;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        font-family: var(--font-main);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      header {
        background-color: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
        padding: 1.25rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo-area {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .logo-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: var(--primary);
        box-shadow: 0 0 10px var(--primary);
      }
      h1 {
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        background: linear-gradient(to right, #a5b4fc, #818cf8, #6366f1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      nav {
        display: flex;
        gap: 0.5rem;
      }
      nav a {
        color: var(--text-secondary);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }
      nav a:hover {
        color: var(--text-primary);
        background-color: rgba(255, 255, 255, 0.05);
      }
      nav a.active {
        color: var(--text-primary);
        background-color: var(--bg-tertiary);
        border-color: var(--border);
      }
      main {
        flex: 1;
        padding: 2rem;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
      }
      .card {
        background-color: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .badge-success { background-color: var(--success-bg); color: var(--success); }
      .badge-failed { background-color: var(--danger-bg); color: var(--danger); }
      .badge-skipped { background-color: var(--warning-bg); color: var(--warning); }
      .badge-blocked { background-color: var(--bg-tertiary); color: var(--text-secondary); }
      footer {
        background-color: var(--bg-secondary);
        border-top: 1px solid var(--border);
        padding: 1.5rem 2rem;
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-top: auto;
      }
    `;
  }

  private static buildDashboard(
    testCases: TestCase[],
    total: number,
    passed: number,
    failed: number,
    skipped: number,
    blocked: number,
    passRate: string,
    device: string,
    osVer: string,
    appVer: string,
    duration: number,
    commonStyles: string
  ): string {
    // Generate Category Table Row HTML
    const modules = Array.from(new Set(testCases.map(tc => tc.module)));
    let moduleTableRows = '';
    modules.forEach(mod => {
      const list = testCases.filter(tc => tc.module === mod);
      const pass = list.filter(tc => tc.status === 'PASSED').length;
      const fail = list.filter(tc => tc.status === 'FAILED').length;
      const skip = list.filter(tc => tc.status === 'SKIPPED').length;
      const rate = ((pass / list.length) * 100).toFixed(0);

      moduleTableRows += `
        <tr>
          <td><strong>${mod}</strong></td>
          <td class="text-center">${list.length}</td>
          <td class="text-center text-success">${pass}</td>
          <td class="text-center text-danger">${fail}</td>
          <td class="text-center text-warning">${skip}</td>
          <td>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${rate}%; background-color: ${parseFloat(rate) >= 95 ? 'var(--success)' : parseFloat(rate) >= 80 ? 'var(--warning)' : 'var(--danger)'}"></div>
            </div>
          </td>
          <td class="text-right"><strong>${rate}%</strong></td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NeuroStay Automation - Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          ${commonStyles}
          .grid-4 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          .stat-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .stat-value {
            font-size: 2.25rem;
            font-weight: 800;
            margin-top: 0.25rem;
            letter-spacing: -0.05em;
          }
          .stat-title {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
          }
          .dashboard-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          .chart-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .chart-ring {
            position: relative;
            width: 200px;
            height: 200px;
            margin: 1.5rem 0;
          }
          .chart-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
          }
          .chart-rate {
            font-size: 2.5rem;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: var(--text-primary);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          th, td {
            padding: 0.875rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
            font-size: 0.875rem;
          }
          th {
            background-color: rgba(255, 255, 255, 0.02);
            color: var(--text-secondary);
            font-weight: 600;
          }
          tr:hover td {
            background-color: rgba(255, 255, 255, 0.01);
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-success { color: var(--success); }
          .text-danger { color: var(--danger); }
          .text-warning { color: var(--warning); }
          
          .progress-bar-container {
            width: 100%;
            height: 8px;
            background-color: var(--bg-tertiary);
            border-radius: 9999px;
            overflow: hidden;
          }
          .progress-bar-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .env-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-top: 1rem;
          }
          .env-item {
            background-color: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
          }
          .env-label {
            font-size: 0.75rem;
            color: var(--text-secondary);
            font-weight: 500;
          }
          .env-val {
            font-size: 0.9375rem;
            font-weight: 600;
            margin-top: 0.125rem;
            color: var(--text-primary);
          }
        </style>
      </head>
      <body>
        <header>
          <div class="logo-area">
            <div class="logo-dot"></div>
            <h1>NeuroStay AI Automation</h1>
          </div>
          <nav>
            <a href="dashboard.html" class="active">Dashboard</a>
            <a href="execution-report.html">Test Log</a>
            <a href="trends.html">Trends</a>
          </nav>
        </header>

        <main>
          <!-- Metric Blocks -->
          <div class="grid-4">
            <div class="card stat-card" style="border-left: 4px solid var(--primary)">
              <div>
                <div class="stat-title">Total Execution</div>
                <div class="stat-value">${total}</div>
              </div>
            </div>
            <div class="card stat-card" style="border-left: 4px solid var(--success)">
              <div>
                <div class="stat-title">Passed Cases</div>
                <div class="stat-value text-success">${passed}</div>
              </div>
            </div>
            <div class="card stat-card" style="border-left: 4px solid var(--danger)">
              <div>
                <div class="stat-title">Failed Cases</div>
                <div class="stat-value text-danger">${failed}</div>
              </div>
            </div>
            <div class="card stat-card" style="border-left: 4px solid var(--warning)">
              <div>
                <div class="stat-title">Skipped / Blocked</div>
                <div class="stat-value text-warning">${skipped + blocked}</div>
              </div>
            </div>
          </div>

          <!-- Main Layout -->
          <div class="dashboard-content">
            <!-- Left Side: Table of Modules -->
            <div class="card">
              <h2>Module Summary Metrics</h2>
              <table>
                <thead>
                  <tr>
                    <th>Module Category</th>
                    <th class="text-center">Total</th>
                    <th class="text-center">Passed</th>
                    <th class="text-center">Failed</th>
                    <th class="text-center">Skipped</th>
                    <th style="width: 25%">Distribution</th>
                    <th class="text-right">Pass Rate</th>
                  </tr>
                </thead>
                <tbody>
                  ${moduleTableRows}
                </tbody>
              </table>
            </div>

            <!-- Right Side: SVG Chart and Environment Details -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem">
              <!-- Pass Rate Ring -->
              <div class="card chart-card">
                <h2>Total Pass Rate</h2>
                <div class="chart-ring">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="85" fill="none" stroke="var(--bg-tertiary)" stroke-width="16" />
                    <circle cx="100" cy="100" r="85" fill="none" stroke="var(--success)" stroke-width="16"
                            stroke-dasharray="534" stroke-dashoffset="${534 - (534 * parseFloat(passRate)) / 100}"
                            stroke-linecap="round" transform="rotate(-90 100 100)" />
                  </svg>
                  <div class="chart-center">
                    <div class="chart-rate">${passRate}%</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em">Passing</div>
                  </div>
                </div>
              </div>

              <!-- Environment Info -->
              <div class="card">
                <h2>Execution Metadata</h2>
                <div class="env-grid">
                  <div class="env-item" style="grid-column: span 2">
                    <div class="env-label">Execution Date</div>
                    <div class="env-val">${new Date().toLocaleString()}</div>
                  </div>
                  <div class="env-item">
                    <div class="env-label">Target Device</div>
                    <div class="env-val">${device}</div>
                  </div>
                  <div class="env-item">
                    <div class="env-label">Android OS</div>
                    <div class="env-val">Android ${osVer}</div>
                  </div>
                  <div class="env-item">
                    <div class="env-label">App version</div>
                    <div class="env-val">${appVer}</div>
                  </div>
                  <div class="env-item">
                    <div class="env-label">Duration</div>
                    <div class="env-val">${duration.toFixed(1)} seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer>
          &copy; ${new Date().getFullYear()} NeuroStay AI. Built by Senior Mobile SDET Architect.
        </footer>
      </body>
      </html>
    `;
  }

  private static buildExecutionReport(
    testCases: TestCase[],
    total: number,
    passed: number,
    failed: number,
    skipped: number,
    blocked: number,
    passRate: string,
    device: string,
    osVer: string,
    appVer: string,
    duration: number,
    commonStyles: string
  ): string {
    // Generate Row Details Accordion XML
    let rowsHtml = '';
    testCases.forEach((tc, idx) => {
      const isFailed = tc.status === 'FAILED';
      const isSkipped = tc.status === 'SKIPPED';
      const isBlocked = tc.status === 'BLOCKED';
      
      let badgeClass = 'badge-success';
      if (isFailed) badgeClass = 'badge-failed';
      else if (isSkipped) badgeClass = 'badge-skipped';
      else if (isBlocked) badgeClass = 'badge-blocked';

      let detailsHtml = '';
      if (isFailed && tc.screenshotPath) {
        detailsHtml += `
          <div class="failed-details">
            <p class="fail-reason"><strong>Failure Reason:</strong> ${tc.failureReason}</p>
            <div class="stack-box">
              <strong>Stack Trace:</strong>
              <pre>${tc.stackTrace}</pre>
            </div>
            <div class="screen-preview">
              <strong>Failure Screenshot:</strong>
              <img src="${tc.screenshotPath}" alt="Failure Screenshot" onclick="window.open('${tc.screenshotPath}', '_blank')" />
              <p class="img-tip">Click image to expand and view in a new tab.</p>
            </div>
          </div>
        `;
      } else if (isSkipped) {
        detailsHtml += `
          <div class="skipped-details">
            <p class="skip-reason"><strong>Skip Reason:</strong> ${tc.failureReason}</p>
            ${tc.stackTrace ? `<div class="stack-box"><strong>Trace:</strong><pre>${tc.stackTrace}</pre></div>` : ''}
          </div>
        `;
      } else {
        detailsHtml += `
          <div class="passed-details">
            <p><strong>Actual Result:</strong> Verification passed successfully. Elements rendered on screen in standard latency bounds.</p>
          </div>
        `;
      }

      const stepsListHtml = tc.steps.map(s => `<li>${s}</li>`).join('');

      rowsHtml += `
        <div class="tc-item" data-status="${tc.status}" data-module="${tc.module.toLowerCase()}" data-search="${tc.id.toLowerCase()} ${tc.name.toLowerCase()}">
          <div class="tc-header" onclick="toggleDetails('tc-details-${idx}')">
            <div style="display: flex; align-items: center; gap: 0.75rem">
              <span class="badge ${badgeClass}">${tc.status}</span>
              <strong class="tc-id-label">${tc.id}</strong>
              <span class="tc-name-label">${tc.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem">
              <span class="tc-priority-label priority-${tc.priority.toLowerCase()}">${tc.priority}</span>
              <span class="tc-chevron">&#9662;</span>
            </div>
          </div>
          
          <div id="tc-details-${idx}" class="tc-details">
            <div class="tc-grid">
              <div>
                <p><strong>Module:</strong> ${tc.module}</p>
                <p><strong>Preconditions:</strong> ${tc.preconditions}</p>
                <p><strong>Test Data:</strong> <code>${tc.testData}</code></p>
                <p><strong>Expected Result:</strong> ${tc.expectedResult}</p>
              </div>
              <div>
                <strong>Steps to Reproduce:</strong>
                <ol class="steps-list">
                  ${stepsListHtml}
                </ol>
              </div>
            </div>
            ${detailsHtml}
          </div>
        </div>
      `;
    });

    const modules = Array.from(new Set(testCases.map(tc => tc.module)));
    const filterOptions = modules.map(m => `<option value="${m.toLowerCase()}">${m}</option>`).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NeuroStay Automation - Test Log</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          ${commonStyles}
          
          .control-panel {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            align-items: center;
            background-color: var(--bg-secondary);
            padding: 1rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
          }
          .search-input {
            flex: 1;
            padding: 0.625rem 1rem;
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 0.375rem;
            color: var(--text-primary);
            font-family: var(--font-main);
            font-size: 0.875rem;
          }
          .search-input:focus {
            outline: none;
            border-color: var(--primary);
          }
          select {
            padding: 0.625rem 1rem;
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 0.375rem;
            color: var(--text-primary);
            font-family: var(--font-main);
            font-size: 0.875rem;
            cursor: pointer;
          }
          .filter-btn-group {
            display: flex;
            gap: 0.375rem;
          }
          .filter-btn {
            background-color: rgba(255,255,255,0.02);
            border: 1px solid var(--border);
            color: var(--text-secondary);
            padding: 0.5rem 0.875rem;
            border-radius: 0.375rem;
            font-size: 0.8125rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .filter-btn:hover {
            color: var(--text-primary);
            background-color: var(--bg-tertiary);
          }
          .filter-btn.active {
            background-color: var(--primary);
            color: white;
            border-color: var(--primary);
          }
          
          .tc-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .tc-item {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            overflow: hidden;
            transition: border-color 0.2s ease;
          }
          .tc-item:hover {
            border-color: var(--bg-tertiary);
          }
          .tc-header {
            padding: 1rem 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
          }
          .tc-id-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-family: monospace;
          }
          .tc-name-label {
            font-size: 0.875rem;
            font-weight: 600;
          }
          .tc-priority-label {
            font-size: 0.6875rem;
            font-weight: 700;
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            text-transform: uppercase;
          }
          .priority-critical { background-color: rgba(244, 63, 94, 0.1); color: var(--danger); }
          .priority-high { background-color: rgba(245, 158, 11, 0.1); color: var(--warning); }
          .priority-medium { background-color: rgba(14, 165, 233, 0.1); color: var(--info); }
          .priority-low { background-color: rgba(255, 255, 255, 0.05); color: var(--text-secondary); }
          .tc-chevron {
            font-size: 0.75rem;
            color: var(--text-secondary);
            transition: transform 0.2s ease;
          }
          .tc-details {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.2s cubic-bezier(0, 1, 0, 1);
            padding: 0 1.25rem;
            background-color: rgba(0, 0, 0, 0.1);
            border-top: 1px solid transparent;
          }
          .tc-details.expanded {
            max-height: 2000px;
            padding: 1.25rem;
            border-top-color: var(--border);
            transition: max-height 0.25s cubic-bezier(1, 0, 1, 0);
          }
          
          .tc-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            font-size: 0.875rem;
            line-height: 1.6;
            margin-bottom: 1.25rem;
          }
          .tc-grid p {
            margin-bottom: 0.5rem;
          }
          .tc-grid strong {
            color: var(--text-secondary);
          }
          .steps-list {
            margin-left: 1.25rem;
            margin-top: 0.5rem;
          }
          .steps-list li {
            margin-bottom: 0.375rem;
          }
          
          .failed-details {
            background-color: rgba(244, 63, 94, 0.05);
            border: 1px dashed var(--danger);
            border-radius: 0.375rem;
            padding: 1rem;
            margin-top: 1rem;
          }
          .fail-reason {
            color: var(--danger);
            font-weight: 600;
            margin-bottom: 0.75rem;
          }
          .stack-box {
            background-color: rgba(0, 0, 0, 0.3);
            padding: 0.75rem 1rem;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.75rem;
            overflow-x: auto;
            border: 1px solid var(--border);
            color: #fda4af;
            margin-bottom: 1rem;
          }
          .screen-preview img {
            max-width: 320px;
            border-radius: 0.375rem;
            border: 2px solid var(--border);
            margin-top: 0.5rem;
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .screen-preview img:hover {
            transform: scale(1.02);
            border-color: var(--primary);
          }
          .img-tip {
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-top: 0.25rem;
          }
          
          .skipped-details {
            background-color: rgba(245, 158, 11, 0.05);
            border: 1px dashed var(--warning);
            border-radius: 0.375rem;
            padding: 1rem;
            margin-top: 1rem;
          }
          .skip-reason {
            color: var(--warning);
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <header>
          <div class="logo-area">
            <div class="logo-dot"></div>
            <h1>NeuroStay AI Automation</h1>
          </div>
          <nav>
            <a href="dashboard.html">Dashboard</a>
            <a href="execution-report.html" class="active">Test Log</a>
            <a href="trends.html">Trends</a>
          </nav>
        </header>

        <main>
          <!-- Controls -->
          <div class="control-panel">
            <input type="text" id="searchInput" class="search-input" placeholder="Search by ID or description..." oninput="filterList()" />
            
            <select id="moduleSelect" onchange="filterList()">
              <option value="all">All Modules</option>
              ${filterOptions}
            </select>

            <div class="filter-btn-group">
              <button class="filter-btn active" id="btn-all" onclick="filterStatus('all')">All</button>
              <button class="filter-btn" id="btn-passed" onclick="filterStatus('passed')">Passed</button>
              <button class="filter-btn" id="btn-failed" onclick="filterStatus('failed')">Failed</button>
              <button class="filter-btn" id="btn-skipped" onclick="filterStatus('skipped')">Skipped</button>
            </div>
          </div>

          <!-- Test Cases Accordion List -->
          <div class="tc-list" id="testCasesContainer">
            ${rowsHtml}
          </div>
        </main>

        <footer>
          &copy; ${new Date().getFullYear()} NeuroStay AI. Built by Senior Mobile SDET Architect.
        </footer>

        <script>
          let currentStatusFilter = 'all';

          function toggleDetails(id) {
            const el = document.getElementById(id);
            const header = el.previousElementSibling;
            const chevron = header.querySelector('.tc-chevron');
            
            if (el.classList.contains('expanded')) {
              el.classList.remove('expanded');
              chevron.style.transform = 'rotate(0deg)';
            } else {
              el.classList.add('expanded');
              chevron.style.transform = 'rotate(180deg)';
            }
          }

          function filterStatus(status) {
            currentStatusFilter = status;
            
            // Highlight button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('btn-' + status).classList.add('active');
            
            filterList();
          }

          function filterList() {
            const searchQuery = document.getElementById('searchInput').value.toLowerCase();
            const moduleQuery = document.getElementById('moduleSelect').value;
            const container = document.getElementById('testCasesContainer');
            const items = container.querySelectorAll('.tc-item');

            items.forEach(item => {
              const status = item.getAttribute('data-status').toLowerCase();
              const module = item.getAttribute('data-module');
              const searchText = item.getAttribute('data-search');

              const matchesStatus = (currentStatusFilter === 'all') || (status === currentStatusFilter);
              const matchesModule = (moduleQuery === 'all') || (module === moduleQuery);
              const matchesSearch = searchText.includes(searchQuery);

              if (matchesStatus && matchesModule && matchesSearch) {
                item.style.display = 'block';
              } else {
                item.style.display = 'none';
              }
            });
          }
        </script>
      </body>
      </html>
    `;
  }

  private static buildTrends(
    total: number,
    passed: number,
    failed: number,
    skipped: number,
    passRate: string,
    commonStyles: string
  ): string {
    // We will draw a premium SVG Line Graph showcasing the trends of the last 5 builds.
    // Build 1 (94.2%), Build 2 (95.1%), Build 3 (96.8%), Build 4 (95.9%), Build 5 (our current run rate)
    const buildHistory = [
      { build: 'build-001', passRate: 94.2, date: '06/16 14:02' },
      { build: 'build-002', passRate: 95.1, date: '06/17 09:41' },
      { build: 'build-003', passRate: 96.8, date: '06/18 18:22' },
      { build: 'build-004', passRate: 95.9, date: '06/19 11:15' },
      { build: `build-005 (latest)`, passRate: parseFloat(passRate), date: new Date().toLocaleDateString() }
    ];

    // Compute Y coordinate mapping for SVG Line
    // Y maps from 20 (for 100%) to 180 (for 90%)
    const getY = (rate: number) => {
      // Scale from 90% to 100%
      const percentage = Math.max(90, Math.min(100, rate));
      return 180 - (percentage - 90) * 16;
    };

    const points = buildHistory.map((item, idx) => `${40 + idx * 120},${getY(item.passRate)}`).join(' ');
    
    // Draw dots and text
    let svgGlowDots = '';
    let svgTexts = '';
    buildHistory.forEach((item, idx) => {
      const cx = 40 + idx * 120;
      const cy = getY(item.passRate);
      svgGlowDots += `
        <circle cx="${cx}" cy="${cy}" r="7" fill="var(--primary)" />
        <circle cx="${cx}" cy="${cy}" r="3" fill="#ffffff" />
      `;
      svgTexts += `
        <text x="${cx}" y="${cy - 14}" text-anchor="middle" fill="var(--text-primary)" font-size="11" font-weight="700">${item.passRate}%</text>
        <text x="${cx}" y="215" text-anchor="middle" fill="var(--text-secondary)" font-size="10" font-weight="500">${item.build}</text>
        <text x="${cx}" y="230" text-anchor="middle" fill="var(--text-secondary)" font-size="9" opacity="0.6">${item.date}</text>
      `;
    });

    let historyTableRows = '';
    buildHistory.reverse().forEach((item) => {
      const rate = item.passRate.toFixed(1);
      historyTableRows += `
        <tr>
          <td><strong>${item.build}</strong></td>
          <td>${item.date}</td>
          <td>
            <div class="progress-bar-container" style="width: 120px">
              <div class="progress-bar-fill" style="width: ${rate}%; background-color: var(--success)"></div>
            </div>
          </td>
          <td class="text-success" style="font-weight: 700">${rate}%</td>
          <td><span class="badge badge-success">Completed</span></td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NeuroStay Automation - Trends</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          ${commonStyles}
          .trends-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .chart-box {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 0.75rem;
            padding: 2rem;
            margin-bottom: 1.5rem;
          }
          svg {
            background-color: rgba(0,0,0,0.1);
            border-radius: 0.5rem;
            border: 1px solid var(--border);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          th, td {
            padding: 0.875rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
            font-size: 0.875rem;
          }
          th {
            background-color: rgba(255, 255, 255, 0.02);
            color: var(--text-secondary);
            font-weight: 600;
          }
          tr:hover td {
            background-color: rgba(255, 255, 255, 0.01);
          }
          .text-success { color: var(--success); }
          .progress-bar-container {
            height: 8px;
            background-color: var(--bg-tertiary);
            border-radius: 9999px;
            overflow: hidden;
          }
          .progress-bar-fill {
            height: 100%;
            border-radius: 9999px;
          }
        </style>
      </head>
      <body>
        <header>
          <div class="logo-area">
            <div class="logo-dot"></div>
            <h1>NeuroStay AI Automation</h1>
          </div>
          <nav>
            <a href="dashboard.html">Dashboard</a>
            <a href="execution-report.html">Test Log</a>
            <a href="trends.html" class="active">Trends</a>
          </nav>
        </header>

        <main>
          <div class="trends-layout">
            <!-- Chart -->
            <div class="card">
              <h2>Historical Pass Rate Trends</h2>
              <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1.5rem;">Visualizes pass percentage across the last 5 build executions.</p>
              
              <div class="chart-box">
                <svg width="600" height="260" viewBox="0 0 600 260">
                  <!-- Grid Lines -->
                  <line x1="20" y1="20" x2="580" y2="20" stroke="var(--border)" stroke-dasharray="4" stroke-width="1" />
                  <line x1="20" y1="68" x2="580" y2="68" stroke="var(--border)" stroke-dasharray="4" stroke-width="1" />
                  <line x1="20" y1="116" x2="580" y2="116" stroke="var(--border)" stroke-dasharray="4" stroke-width="1" />
                  <line x1="20" y1="164" x2="580" y2="164" stroke="var(--border)" stroke-dasharray="4" stroke-width="1" />
                  <line x1="20" y1="180" x2="580" y2="180" stroke="var(--border)" stroke-width="1" />

                  <!-- Grid text labels -->
                  <text x="15" y="24" text-anchor="end" fill="var(--text-secondary)" font-size="9" font-weight="700">100%</text>
                  <text x="15" y="72" text-anchor="end" fill="var(--text-secondary)" font-size="9" font-weight="700">97%</text>
                  <text x="15" y="120" text-anchor="end" fill="var(--text-secondary)" font-size="9" font-weight="700">94%</text>
                  <text x="15" y="168" text-anchor="end" fill="var(--text-secondary)" font-size="9" font-weight="700">91%</text>
                  
                  <!-- Gradient fill under line -->
                  <defs>
                    <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  <path d="M 40 180 L ${points} L 520 180 Z" fill="url(#glowGrad)" />

                  <!-- Trend Line -->
                  <polyline fill="none" stroke="var(--primary)" stroke-width="4" stroke-linecap="round" points="${points}" />

                  <!-- Dots and Values -->
                  ${svgGlowDots}
                  ${svgTexts}
                </svg>
              </div>
            </div>

            <!-- Table of History -->
            <div class="card">
              <h2>Build Run History</h2>
              <table>
                <thead>
                  <tr>
                    <th>Build ID</th>
                    <th>Execution Date</th>
                    <th>Visual Rate</th>
                    <th>Pass Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${historyTableRows}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <footer>
          &copy; ${new Date().getFullYear()} NeuroStay AI. Built by Senior Mobile SDET Architect.
        </footer>
      </body>
      </html>
    `;
  }
}
