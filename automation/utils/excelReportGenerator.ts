import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { TestCase } from '../data/testCases';
import { Logger } from './logger';

export class ExcelReportGenerator {
  private static outDir = path.join(__dirname, '..', 'reports', 'Excel');

  private static initialize() {
    if (!fs.existsSync(ExcelReportGenerator.outDir)) {
      fs.mkdirSync(ExcelReportGenerator.outDir, { recursive: true });
    }
  }

  public static async generate(testCases: TestCase[], deviceName: string, androidVersion: string, appVersion: string, totalDurationSec: number): Promise<void> {
    ExcelReportGenerator.initialize();
    Logger.info('Generating Excel automation reports...');

    const total = testCases.length;
    const passed = testCases.filter(c => c.status === 'PASSED');
    const failed = testCases.filter(c => c.status === 'FAILED');
    const skipped = testCases.filter(c => c.status === 'SKIPPED');
    const blocked = testCases.filter(c => c.status === 'BLOCKED');

    const passRate = ((passed.length / total) * 100).toFixed(2);
    const failRate = (((failed.length + blocked.length) / total) * 100).toFixed(2);

    // 1. Generate Automation_Test_Report.xlsx (The master report with 7 sheets)
    const masterWorkbook = new ExcelJS.Workbook();
    await ExcelReportGenerator.buildMasterReport(masterWorkbook, testCases, passed, failed, skipped, blocked, passRate, failRate, deviceName, androidVersion, appVersion, totalDurationSec);
    const masterPath = path.join(ExcelReportGenerator.outDir, 'Automation_Test_Report.xlsx');
    await masterWorkbook.xlsx.writeFile(masterPath);
    Logger.info(`Master Excel report written to: ${masterPath}`);

    // 2. Generate Passed_Test_Cases.xlsx
    const passedWorkbook = new ExcelJS.Workbook();
    ExcelReportGenerator.buildSingleStatusSheet(passedWorkbook, 'Passed Tests', passed, 'FF10B981');
    const passedPath = path.join(ExcelReportGenerator.outDir, 'Passed_Test_Cases.xlsx');
    await passedWorkbook.xlsx.writeFile(passedPath);

    // 3. Generate Failed_Test_Cases.xlsx
    const failedWorkbook = new ExcelJS.Workbook();
    ExcelReportGenerator.buildSingleStatusSheet(failedWorkbook, 'Failed Tests', failed, 'FFE11D48');
    const failedPath = path.join(ExcelReportGenerator.outDir, 'Failed_Test_Cases.xlsx');
    await failedWorkbook.xlsx.writeFile(failedPath);

    // 4. Generate Execution_Summary.xlsx
    const summaryWorkbook = new ExcelJS.Workbook();
    ExcelReportGenerator.buildSummaryReport(summaryWorkbook, total, passed.length, failed.length, skipped.length, blocked.length, passRate, failRate, deviceName, androidVersion, appVersion, totalDurationSec);
    const summaryPath = path.join(ExcelReportGenerator.outDir, 'Execution_Summary.xlsx');
    await summaryWorkbook.xlsx.writeFile(summaryPath);
    Logger.info('Excel report generation completed successfully!');
  }

  private static async buildMasterReport(
    wb: ExcelJS.Workbook,
    all: TestCase[],
    passed: TestCase[],
    failed: TestCase[],
    skipped: TestCase[],
    blocked: TestCase[],
    passRate: string,
    failRate: string,
    device: string,
    osVer: string,
    appVer: string,
    duration: number
  ) {
    // Styling constants
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
    };
    const headerFont = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    const darkPurpleFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };

    // --- Sheet 1: Executed Test Cases ---
    const s1 = wb.addWorksheet('Executed Test Cases');
    s1.views = [{ showGridLines: true }];
    s1.columns = [
      { header: 'Test ID', key: 'id', width: 15 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 40 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Execution Time (ms)', key: 'execTime', width: 20 }
    ];
    all.forEach(tc => {
      s1.addRow({
        id: tc.id,
        module: tc.module,
        name: tc.name,
        priority: tc.priority,
        status: tc.status,
        execTime: tc.executionTime || 0
      });
    });
    ExcelReportGenerator.styleSheetHeadersAndBorders(s1, darkPurpleFill, headerFont, borderStyle);

    // --- Sheet 2: Passed Tests ---
    const s2 = wb.addWorksheet('Passed Tests');
    s2.views = [{ showGridLines: true }];
    s2.columns = s1.columns;
    passed.forEach(tc => s2.addRow([tc.id, tc.module, tc.name, tc.priority, tc.status, tc.executionTime || 0]));
    ExcelReportGenerator.styleSheetHeadersAndBorders(s2, { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }, headerFont, borderStyle);

    // --- Sheet 3: Failed Tests ---
    const s3 = wb.addWorksheet('Failed Tests');
    s3.views = [{ showGridLines: true }];
    s3.columns = [
      { header: 'Test ID', key: 'id', width: 15 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 35 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Failure Reason', key: 'reason', width: 35 },
      { header: 'Stack Trace', key: 'stack', width: 50 }
    ];
    failed.forEach(tc => s3.addRow([tc.id, tc.module, tc.name, tc.priority, tc.status, tc.failureReason || 'N/A', tc.stackTrace || 'N/A']));
    ExcelReportGenerator.styleSheetHeadersAndBorders(s3, { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE11D48' } }, headerFont, borderStyle);

    // --- Sheet 4: Skipped Tests ---
    const s4 = wb.addWorksheet('Skipped Tests');
    s4.views = [{ showGridLines: true }];
    s4.columns = [
      { header: 'Test ID', key: 'id', width: 15 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 40 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Skip Reason', key: 'reason', width: 40 }
    ];
    skipped.forEach(tc => s4.addRow([tc.id, tc.module, tc.name, tc.priority, tc.status, tc.failureReason || 'N/A']));
    ExcelReportGenerator.styleSheetHeadersAndBorders(s4, { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } }, headerFont, borderStyle);

    // --- Sheet 5: Execution Metrics ---
    const s5 = wb.addWorksheet('Execution Metrics');
    s5.views = [{ showGridLines: true }];
    
    // Add title block
    s5.mergeCells('B2:G3');
    const titleCell = s5.getCell('B2');
    titleCell.value = 'NEUROSTAY AUTOMATION - METRICS REPORT';
    titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = darkPurpleFill;

    // Metrics blocks
    const metricsData = [
      ['Total Test Cases', all.length, 'Passed Cases', passed.length],
      ['Failed Cases', failed.length, 'Skipped Cases', skipped.length],
      ['Blocked Cases', blocked.length, 'Pass Percentage', `${passRate}%`],
      ['Fail Percentage', `${failRate}%`, 'Execution Duration', `${duration.toFixed(2)} seconds`]
    ];

    metricsData.forEach((rowData, idx) => {
      const rowNum = 5 + idx;
      s5.getRow(rowNum).values = ['', rowData[0], rowData[1], '', rowData[2], rowData[3]];
      
      // Formatting
      ['B', 'C', 'E', 'F'].forEach(col => {
        const cell = s5.getCell(`${col}${rowNum}`);
        cell.font = { name: 'Segoe UI', size: 10 };
        cell.border = borderStyle;
        if (col === 'B' || col === 'E') {
          cell.font = { name: 'Segoe UI', size: 10, bold: true };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
        } else {
          cell.alignment = { horizontal: 'center' };
          if (typeof cell.value === 'string' && cell.value.includes('%')) {
            cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: col === 'C' ? 'FFE11D48' : 'FF10B981' } };
          }
        }
      });
      s5.mergeCells(`C${rowNum}:D${rowNum}`);
      s5.mergeCells(`F${rowNum}:G${rowNum}`);
    });

    // Environment info block
    s5.getCell('B10').value = 'Environment Details';
    s5.getCell('B10').font = { name: 'Segoe UI', size: 12, bold: true };

    const envInfo = [
      ['Target Device', device],
      ['Android OS Version', osVer],
      ['Application version', appVer],
      ['Appium Client', 'WebdriverIO v8.x'],
      ['Execution Date', new Date().toLocaleString()]
    ];

    envInfo.forEach((item, idx) => {
      const rowNum = 12 + idx;
      s5.getRow(rowNum).values = ['', item[0], item[1]];
      s5.mergeCells(`C${rowNum}:G${rowNum}`);
      ['B', 'C'].forEach(col => {
        const cell = s5.getCell(`${col}${rowNum}`);
        cell.font = { name: 'Segoe UI', size: 10 };
        cell.border = borderStyle;
        if (col === 'B') {
          cell.font = { name: 'Segoe UI', size: 10, bold: true };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
        }
      });
    });

    // --- Sheet 6: Defect Summary ---
    const s6 = wb.addWorksheet('Defect Summary');
    s6.views = [{ showGridLines: true }];
    s6.columns = [
      { header: 'Defect ID', key: 'defectId', width: 15 },
      { header: 'Test Case ID', key: 'tcId', width: 15 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Test Name', key: 'name', width: 35 },
      { header: 'Failure Reason / Bug Description', key: 'reason', width: 45 },
      { header: 'Stack Trace Snippet', key: 'trace', width: 50 }
    ];
    failed.forEach((tc, idx) => {
      s6.addRow({
        defectId: `BUG-${String(idx + 1).padStart(3, '0')}`,
        tcId: tc.id,
        module: tc.module,
        name: tc.name,
        reason: tc.failureReason || 'Verification Failed',
        trace: tc.stackTrace || 'No stack trace provided'
      });
    });
    ExcelReportGenerator.styleSheetHeadersAndBorders(s6, { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE11D48' } }, headerFont, borderStyle);

    // --- Sheet 7: Pass Rate Summary ---
    const s7 = wb.addWorksheet('Pass Rate Summary');
    s7.views = [{ showGridLines: true }];
    s7.columns = [
      { header: 'Module Name', key: 'modName', width: 30 },
      { header: 'Total Tests', key: 'total', width: 15 },
      { header: 'Passed', key: 'passed', width: 15 },
      { header: 'Failed', key: 'failed', width: 15 },
      { header: 'Skipped', key: 'skipped', width: 15 },
      { header: 'Pass Rate', key: 'rate', width: 18 }
    ];

    // Compute unique modules
    const modules = Array.from(new Set(all.map(tc => tc.module)));
    modules.forEach(mod => {
      const modTests = all.filter(tc => tc.module === mod);
      const modPassed = modTests.filter(tc => tc.status === 'PASSED').length;
      const modFailed = modTests.filter(tc => tc.status === 'FAILED').length;
      const modSkipped = modTests.filter(tc => tc.status === 'SKIPPED').length;
      const rate = ((modPassed / modTests.length) * 100).toFixed(1);
      s7.addRow([mod, modTests.length, modPassed, modFailed, modSkipped, `${rate}%`]);
    });
    ExcelReportGenerator.styleSheetHeadersAndBorders(s7, darkPurpleFill, headerFont, borderStyle);

    // Color code the Pass Rate column inside Sheet 7
    s7.eachRow((row, rowNum) => {
      if (rowNum > 1) {
        const rateCell = row.getCell(6);
        const val = parseFloat(String(rateCell.value).replace('%', ''));
        if (val >= 95) {
          rateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FADF' } };
          rateCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF065F46' } };
        } else if (val >= 80) {
          rateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
          rateCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF92400E' } };
        } else {
          rateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          rateCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF991B1B' } };
        }
      }
    });
  }

  private static buildSingleStatusSheet(wb: ExcelJS.Workbook, sheetName: string, tests: TestCase[], headerHex: string) {
    const ws = wb.addWorksheet(sheetName);
    ws.views = [{ showGridLines: true }];
    ws.columns = [
      { header: 'Test ID', key: 'id', width: 15 },
      { header: 'Module', key: 'module', width: 25 },
      { header: 'Test Name', key: 'name', width: 45 },
      { header: 'Priority', key: 'priority', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];
    tests.forEach(tc => ws.addRow([tc.id, tc.module, tc.name, tc.priority, tc.status]));
    
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
    };
    ExcelReportGenerator.styleSheetHeadersAndBorders(ws, { type: 'pattern', pattern: 'solid', fgColor: { argb: headerHex } }, { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }, borderStyle);
  }

  private static buildSummaryReport(
    wb: ExcelJS.Workbook,
    total: number,
    passed: number,
    failed: number,
    skipped: number,
    blocked: number,
    passRate: string,
    failRate: string,
    device: string,
    osVer: string,
    appVer: string,
    duration: number
  ) {
    const ws = wb.addWorksheet('Execution Summary');
    ws.views = [{ showGridLines: true }];
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
    };

    ws.mergeCells('B2:E3');
    const titleCell = ws.getCell('B2');
    titleCell.value = 'NEUROSTAY AUTOMATION - SUMMARY';
    titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };

    const data = [
      ['Metric Field', 'Value'],
      ['Total Test Cases', total],
      ['Passed Test Cases', passed],
      ['Failed Test Cases', failed],
      ['Skipped Test Cases', skipped],
      ['Blocked Test Cases', blocked],
      ['Pass Rate Percentage', `${passRate}%`],
      ['Fail Rate Percentage', `${failRate}%`],
      ['Target Device', device],
      ['Android OS', osVer],
      ['Application Version', appVer],
      ['Execution Duration', `${duration.toFixed(2)} seconds`],
      ['Timestamp', new Date().toLocaleString()]
    ];

    data.forEach((rowValues, idx) => {
      const rowNum = 5 + idx;
      ws.getRow(rowNum).values = ['', rowValues[0], rowValues[1]];
      ws.mergeCells(`C${rowNum}:E${rowNum}`);

      ['B', 'C'].forEach(col => {
        const cell = ws.getCell(`${col}${rowNum}`);
        cell.font = { name: 'Segoe UI', size: 10 };
        cell.border = borderStyle;
        if (rowNum === 5) {
          cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
          cell.alignment = { horizontal: 'center' };
        } else if (col === 'B') {
          cell.font = { name: 'Segoe UI', size: 10, bold: true };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
        } else {
          cell.alignment = { horizontal: 'center' };
          if (rowNum === 11 && typeof cell.value === 'string' && cell.value.includes('%')) {
            cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF10B981' } };
          }
        }
      });
    });
  }

  private static styleSheetHeadersAndBorders(ws: ExcelJS.Worksheet, headerFill: ExcelJS.Fill, font: any, border: Partial<ExcelJS.Borders>) {
    // Style headers
    ws.getRow(1).eachCell(cell => {
      cell.fill = headerFill;
      cell.font = font;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = border;
    });

    // Style data rows and add status highlighting
    ws.eachRow((row, rowNum) => {
      if (rowNum > 1) {
        row.eachCell(cell => {
          cell.border = border;
          cell.font = { name: 'Segoe UI', size: 10 };
        });

        // Highlight status cells specifically
        const statusColIdx = ws.columns.findIndex(c => c.header === 'Status');
        if (statusColIdx !== -1) {
          const statusCell = row.getCell(statusColIdx + 1);
          const val = String(statusCell.value);
          if (val === 'PASSED') {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FADF' } };
            statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF065F46' } };
          } else if (val === 'FAILED') {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
            statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF991B1B' } };
          } else if (val === 'SKIPPED') {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
            statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF92400E' } };
          } else {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
            statusCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF374151' } };
          }
          statusCell.alignment = { horizontal: 'center' };
        }
      }
    });

    // Adjust column widths automatically
    ws.columns.forEach(column => {
      let maxLen = 0;
      column.eachCell!((cell) => {
        const val = cell.value ? String(cell.value) : '';
        if (val.length > maxLen) maxLen = val.length;
      });
      column.width = Math.min(Math.max(maxLen + 4, 12), 65);
    });
  }
}
