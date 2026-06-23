const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function generateReports() {
  console.log('==================================================');
  console.log('       GENERATING UNIFIED E2E TEST REPORTS       ');
  console.log('==================================================');

  const testCases = [];
  const startTime = Date.now();

  const seleniumPath = path.join(__dirname, 'selenium-test-report.xlsx');
  const functionalPath = path.join(__dirname, 'functional-test-report.xlsx');

  // Read Selenium Report
  if (fs.existsSync(seleniumPath)) {
    console.log(`Reading Selenium report: ${seleniumPath}`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(seleniumPath);
    const sheet = workbook.getWorksheet('Detailed Test Log');
    if (sheet) {
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const statusVal = row.getCell(6).value;
          const durationVal = row.getCell(7).value;
          testCases.push({
            id: row.getCell(1).value,
            category: row.getCell(2).value,
            name: row.getCell(3).value,
            type: row.getCell(4).value,
            platform: row.getCell(5).value,
            status: typeof statusVal === 'object' ? statusVal.toString() : statusVal,
            duration: typeof durationVal === 'number' ? durationVal : parseInt(durationVal) || 0,
            error: row.getCell(8).value || 'N/A'
          });
        }
      });
    }
  } else {
    console.warn(`Selenium report not found at ${seleniumPath}`);
  }

  // Read Functional Report
  if (fs.existsSync(functionalPath)) {
    console.log(`Reading Functional report: ${functionalPath}`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(functionalPath);
    const sheet = workbook.getWorksheet('Detailed Test Log');
    if (sheet) {
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const statusVal = row.getCell(6).value;
          const durationVal = row.getCell(7).value;
          testCases.push({
            id: row.getCell(1).value,
            category: row.getCell(2).value,
            name: row.getCell(3).value,
            type: row.getCell(4).value,
            platform: row.getCell(5).value,
            status: typeof statusVal === 'object' ? statusVal.toString() : statusVal,
            duration: typeof durationVal === 'number' ? durationVal : parseInt(durationVal) || 0,
            error: row.getCell(8).value || 'N/A'
          });
        }
      });
    }
  } else {
    console.warn(`Functional report not found at ${functionalPath}`);
  }

  console.log(`Total test cases loaded from reports: ${testCases.length}`);
  if (testCases.length === 0) {
    console.error('No test cases found to report. Exiting.');
    return;
  }

  const total = testCases.length;
  const passed = testCases.filter(tc => tc.status === 'PASSED').length;
  const failed = testCases.filter(tc => tc.status === 'FAILED').length;
  const passRate = ((passed / total) * 100).toFixed(2);
  const totalDurationMs = testCases.reduce((acc, tc) => acc + tc.duration, 0);
  const totalDurationSec = (totalDurationMs / 1000).toFixed(2);

  // 1. Generate JUnit XML Report
  const junitPath = path.join(__dirname, 'junit.xml');
  console.log(`Generating JUnit XML report: ${junitPath}`);
  let junitXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  junitXml += `<testsuites name="NeuroStay AI Unified E2E Test Suite" tests="${total}" failures="${failed}" time="${totalDurationSec}">\n`;
  
  // Group by category
  const categories = [...new Set(testCases.map(tc => tc.category))];
  categories.forEach(cat => {
    const catCases = testCases.filter(tc => tc.category === cat);
    const catFailed = catCases.filter(tc => tc.status === 'FAILED').length;
    const catDuration = (catCases.reduce((acc, tc) => acc + tc.duration, 0) / 1000).toFixed(3);
    
    junitXml += `  <testsuite name="${escapeXml(cat)}" tests="${catCases.length}" failures="${catFailed}" time="${catDuration}">\n`;
    catCases.forEach(tc => {
      junitXml += `    <testcase id="${escapeXml(tc.id)}" name="${escapeXml(tc.name)}" className="${escapeXml(tc.category)}" time="${(tc.duration / 1000).toFixed(3)}">\n`;
      if (tc.status === 'FAILED') {
        junitXml += `      <failure message="${escapeXml(tc.error)}">${escapeXml(tc.error)}</failure>\n`;
      }
      junitXml += `    </testcase>\n`;
    });
    junitXml += `  </testsuite>\n`;
  });
  junitXml += '</testsuites>\n';
  fs.writeFileSync(junitPath, junitXml);

  // 2. Generate HTML Report
  const htmlPath = path.join(__dirname, 'report.html');
  console.log(`Generating HTML report: ${htmlPath}`);

  // Group stats by Category for summary table
  const categoryStats = categories.map(cat => {
    const list = testCases.filter(tc => tc.category === cat);
    const pass = list.filter(tc => tc.status === 'PASSED').length;
    const fail = list.filter(tc => tc.status === 'FAILED').length;
    const rate = ((pass / list.length) * 100).toFixed(1);
    return { name: cat, total: list.length, passed: pass, failed: fail, rate };
  });

  const rowHtml = testCases.map((tc, idx) => {
    const isFailed = tc.status === 'FAILED';
    const badgeClass = isFailed ? 'badge-failed' : 'badge-success';
    return `
      <div class="tc-item" data-status="${tc.status.toLowerCase()}" data-category="${tc.category.toLowerCase()}" data-search="${tc.id.toLowerCase()} ${tc.name.toLowerCase()}">
        <div class="tc-header" onclick="toggleDetails('tc-details-${idx}')">
          <div class="tc-left">
            <span class="badge ${badgeClass}">${tc.status}</span>
            <strong class="tc-id">${tc.id}</strong>
            <span class="tc-name">${tc.name}</span>
          </div>
          <div class="tc-right">
            <span class="tc-type">${tc.type}</span>
            <span class="tc-platform">${tc.platform}</span>
            <span class="tc-duration">${tc.duration} ms</span>
            <span class="tc-chevron">&#9662;</span>
          </div>
        </div>
        <div id="tc-details-${idx}" class="tc-details">
          <div class="tc-detail-grid">
            <div>
              <p><strong>Category:</strong> ${tc.category}</p>
              <p><strong>Type:</strong> ${tc.type}</p>
              <p><strong>Platform:</strong> ${tc.platform}</p>
            </div>
            <div>
              <p><strong>Duration:</strong> ${tc.duration} ms</p>
              <p><strong>Status:</strong> <span class="status-${tc.status.toLowerCase()}">${tc.status}</span></p>
              ${isFailed ? `<p class="fail-message"><strong>Error Details:</strong> ${tc.error}</p>` : '<p><strong>Result:</strong> Passed successfully.</p>'}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('\n');

  const catOptions = categories.map(cat => `<option value="${cat.toLowerCase()}">${cat}</option>`).join('\n');
  const catRows = categoryStats.map(stat => `
    <tr>
      <td><strong>${stat.name}</strong></td>
      <td class="text-center">${stat.total}</td>
      <td class="text-center text-success">${stat.passed}</td>
      <td class="text-center text-danger">${stat.failed}</td>
      <td>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${stat.rate}%; background-color: ${parseFloat(stat.rate) >= 95 ? '#10b981' : '#f59e0b'}"></div>
        </div>
      </td>
      <td class="text-right"><strong>${stat.rate}%</strong></td>
    </tr>
  `).join('\n');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeuroStay AI E2E Execution Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #071028;
      --bg-secondary: #0d1e42;
      --bg-tertiary: #192f60;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --primary: #0ea5e9;
      --primary-hover: #38bdf8;
      --success: #10b981;
      --success-bg: rgba(16, 185, 129, 0.15);
      --danger: #f43f5e;
      --danger-bg: rgba(244, 63, 94, 0.15);
      --border: #1e3a8a;
      --font-main: 'Outfit', system-ui, -apple-system, sans-serif;
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
      padding: 1.5rem 2rem;
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
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: var(--primary);
      box-shadow: 0 0 12px var(--primary);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(to right, #38bdf8, #0ea5e9, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    main {
      flex: 1;
      padding: 2rem;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .card {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .card:hover {
      border-color: var(--primary);
    }
    .stat-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      margin-top: 0.25rem;
      color: #fff;
    }
    .stat-title {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 1024px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-size: 0.875rem;
    }
    th {
      background-color: rgba(255, 255, 255, 0.02);
      color: var(--text-secondary);
      font-weight: 600;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-success { color: var(--success); }
    .text-danger { color: var(--danger); }
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
      transition: width 0.6s ease;
    }
    .control-panel {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
      align-items: center;
      background-color: var(--bg-secondary);
      padding: 1.25rem;
      border-radius: 1rem;
      border: 1px solid var(--border);
    }
    .search-input {
      flex: 1;
      min-width: 250px;
      padding: 0.75rem 1.25rem;
      background-color: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      color: var(--text-primary);
      font-family: var(--font-main);
      font-size: 0.875rem;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--primary);
    }
    select {
      padding: 0.75rem 1.25rem;
      background-color: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      color: var(--text-primary);
      font-family: var(--font-main);
      font-size: 0.875rem;
      cursor: pointer;
    }
    .filter-btn-group {
      display: flex;
      gap: 0.5rem;
    }
    .filter-btn {
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 0.625rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-btn:hover {
      color: #fff;
      background-color: var(--bg-tertiary);
    }
    .filter-btn.active {
      background-color: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .tc-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .tc-item {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      overflow: hidden;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .tc-item:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
    }
    .tc-header {
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .tc-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 250px;
    }
    .tc-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .badge-success { background-color: var(--success-bg); color: var(--success); }
    .badge-failed { background-color: var(--danger-bg); color: var(--danger); }
    .tc-id {
      font-family: monospace;
      color: var(--primary);
      font-size: 0.9375rem;
    }
    .tc-name {
      font-weight: 600;
      color: #fff;
    }
    .tc-chevron {
      transition: transform 0.2s ease;
    }
    .tc-details {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.2s ease-out;
      background-color: rgba(0, 0, 0, 0.2);
    }
    .tc-details.expanded {
      max-height: 500px;
      border-top: 1px solid var(--border);
    }
    .tc-detail-grid {
      padding: 1.25rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      font-size: 0.875rem;
      line-height: 1.6;
    }
    .tc-detail-grid p {
      margin-bottom: 0.5rem;
    }
    .tc-detail-grid strong {
      color: var(--text-secondary);
    }
    .fail-message {
      color: var(--danger);
      background-color: var(--danger-bg);
      padding: 0.75rem;
      border-radius: 0.375rem;
      border: 1px dashed var(--danger);
      margin-top: 0.5rem;
    }
    .status-passed { color: var(--success); font-weight: bold; }
    .status-failed { color: var(--danger); font-weight: bold; }
    footer {
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border);
      padding: 1.5rem 2rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: auto;
    }
  </style>
</head>
<body>
  <header>
    <div class="logo-area">
      <div class="logo-dot"></div>
      <h1>NeuroStay AI E2E Execution Dashboard</h1>
    </div>
  </header>
  <main>
    <!-- Metrics Cards -->
    <div class="grid-4">
      <div class="card stat-card" style="border-left: 4px solid var(--primary)">
        <div>
          <div class="stat-title">Total Cases</div>
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
      <div class="card stat-card" style="border-left: 4px solid var(--primary)">
        <div>
          <div class="stat-title">Total Duration</div>
          <div class="stat-value" style="color: #fff">${totalDurationSec}s</div>
        </div>
      </div>
    </div>

    <!-- Summary & Metadata Layout -->
    <div class="dashboard-content">
      <div class="card">
        <h2>Category Statistics</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th class="text-center">Total</th>
              <th class="text-center">Passed</th>
              <th class="text-center">Failed</th>
              <th style="width: 25%">Visual</th>
              <th class="text-right">Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            ${catRows}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h2>Environment & Run Info</h2>
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <p><strong>Runner:</strong> GitHub Actions Runner</p>
          <p><strong>OS:</strong> Ubuntu Linux (Latest)</p>
          <p><strong>Execution Date:</strong> ${new Date().toUTCString()}</p>
          <p><strong>Framework:</strong> Selenium Webdriver & Node</p>
          <p><strong>Pass Rate:</strong> <span class="text-success" style="font-weight: 800; font-size: 1.25rem">${passRate}%</span></p>
        </div>
      </div>
    </div>

    <!-- Filter & Logs -->
    <div class="control-panel">
      <input type="text" id="searchInput" class="search-input" placeholder="Search by Test ID, name, or key terms..." oninput="applyFilters()" />
      <select id="categorySelect" onchange="applyFilters()">
        <option value="all">All Categories</option>
        ${catOptions}
      </select>
      <div class="filter-btn-group">
        <button class="filter-btn active" id="btn-all" onclick="filterStatus('all')">All</button>
        <button class="filter-btn" id="btn-passed" onclick="filterStatus('passed')">Passed</button>
        <button class="filter-btn" id="btn-failed" onclick="filterStatus('failed')">Failed</button>
      </div>
    </div>

    <div class="tc-list" id="testCasesList">
      ${rowHtml}
    </div>
  </main>
  <footer>
    &copy; ${new Date().getFullYear()} NeuroStay AI. Built by Senior Quality Automation Architect.
  </footer>
  <script>
    let activeStatus = 'all';
    
    function toggleDetails(id) {
      const el = document.getElementById(id);
      const chevron = el.previousElementSibling.querySelector('.tc-chevron');
      if (el.classList.contains('expanded')) {
        el.classList.remove('expanded');
        chevron.style.transform = 'rotate(0deg)';
      } else {
        el.classList.add('expanded');
        chevron.style.transform = 'rotate(180deg)';
      }
    }

    function filterStatus(status) {
      activeStatus = status;
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('btn-' + status).classList.add('active');
      applyFilters();
    }

    function applyFilters() {
      const search = document.getElementById('searchInput').value.toLowerCase();
      const category = document.getElementById('categorySelect').value.toLowerCase();
      
      document.querySelectorAll('.tc-item').forEach(item => {
        const itemSearch = item.getAttribute('data-search');
        const itemCategory = item.getAttribute('data-category');
        const itemStatus = item.getAttribute('data-status');
        
        const matchesSearch = itemSearch.includes(search);
        const matchesCategory = category === 'all' || itemCategory === category;
        const matchesStatus = activeStatus === 'all' || itemStatus === activeStatus;
        
        if (matchesSearch && matchesCategory && matchesStatus) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlContent);
  console.log('Unified E2E Reports generation complete.');
}

function escapeXml(unsafe) {
  return String(unsafe || '').replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

generateReports().catch(console.error);
