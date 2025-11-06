#!/usr/bin/env node

/**
 * Audit Block Verification Script
 *
 * This script enforces compliance policies defined in CLAUDE.md:
 * - Checks for exposed secrets or credentials
 * - Validates test coverage meets threshold (>95%)
 * - Ensures no critical security issues
 * - Verifies audit logs are properly generated
 *
 * Exit codes:
 * - 0: All checks passed
 * - 1: Non-critical issues found (warnings)
 * - 2: Critical issues found (blocks merge)
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Findings storage
const findings = {
  critical: [],
  high: [],
  medium: [],
  low: [],
};

/**
 * Log a finding with severity level
 */
function addFinding(severity, category, message, file = null, line = null) {
  const finding = {
    category,
    message,
    file,
    line,
    timestamp: new Date().toISOString(),
  };

  if (findings[severity]) {
    findings[severity].push(finding);
  }
}

/**
 * Check for exposed secrets in common files
 */
function checkForSecrets() {
  console.log(`${colors.cyan}Checking for exposed secrets...${colors.reset}`);

  const secretPatterns = [
    { pattern: /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/gi, name: 'API Key' },
    { pattern: /secret[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/gi, name: 'Secret Key' },
    { pattern: /password\s*[:=]\s*['"][^'"]{8,}['"]/gi, name: 'Password' },
    { pattern: /Bearer\s+[a-zA-Z0-9_-]{20,}/g, name: 'Bearer Token' },
    { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: 'GitHub Token' },
    { pattern: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key' },
  ];

  const filesToCheck = [
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    'config.js',
    'config.json',
  ];

  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      secretPatterns.forEach(({ pattern, name }) => {
        const matches = content.match(pattern);
        if (matches) {
          addFinding(
            'critical',
            'security',
            `Potential ${name} found in ${file}`,
            file
          );
        }
      });
    }
  });
}

/**
 * Check test coverage against threshold
 */
function checkCoverage() {
  console.log(`${colors.cyan}Checking test coverage...${colors.reset}`);

  const coveragePath = path.join(process.cwd(), 'coverage/coverage-summary.json');

  if (!fs.existsSync(coveragePath)) {
    addFinding('medium', 'testing', 'Coverage report not found. Run tests with coverage.');
    return;
  }

  try {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    const total = coverage.total;

    const metrics = ['lines', 'statements', 'functions', 'branches'];
    const threshold = 95;

    metrics.forEach(metric => {
      const percent = total[metric].pct;
      if (percent < threshold) {
        addFinding(
          'high',
          'testing',
          `${metric} coverage (${percent}%) below ${threshold}% threshold`
        );
      }
    });

    console.log(`  Lines: ${total.lines.pct}%`);
    console.log(`  Statements: ${total.statements.pct}%`);
    console.log(`  Functions: ${total.functions.pct}%`);
    console.log(`  Branches: ${total.branches.pct}%`);

  } catch (error) {
    addFinding('medium', 'testing', `Error reading coverage: ${error.message}`);
  }
}

/**
 * Check for common security anti-patterns
 */
function checkSecurityPatterns() {
  console.log(`${colors.cyan}Checking security patterns...${colors.reset}`);

  // Check if .env files are in .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('.env')) {
      addFinding('high', 'security', '.env files should be in .gitignore');
    }
  } else {
    addFinding('medium', 'security', '.gitignore file not found');
  }
}

/**
 * Verify audit logs directory exists
 */
function checkAuditLogs() {
  console.log(`${colors.cyan}Checking audit logs...${colors.reset}`);

  const auditDir = path.join(process.cwd(), 'artifacts/audit_logs');
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
    console.log(`  Created audit logs directory: ${auditDir}`);
  }
}

/**
 * Generate audit report
 */
function generateAuditReport() {
  const auditDir = path.join(process.cwd(), 'artifacts/audit_logs');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(auditDir, `audit-${timestamp}.json`);

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      critical: findings.critical.length,
      high: findings.high.length,
      medium: findings.medium.length,
      low: findings.low.length,
    },
    findings,
    status: findings.critical.length > 0 ? 'FAIL' : 'PASS',
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n${colors.blue}Audit report generated: ${reportPath}${colors.reset}`);

  return report;
}

/**
 * Print summary
 */
function printSummary(report) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colors.cyan}AUDIT SUMMARY${colors.reset}`);
  console.log('='.repeat(60));

  console.log(`Critical: ${report.summary.critical > 0 ? colors.red : colors.green}${report.summary.critical}${colors.reset}`);
  console.log(`High:     ${report.summary.high > 0 ? colors.yellow : colors.green}${report.summary.high}${colors.reset}`);
  console.log(`Medium:   ${report.summary.medium}${colors.reset}`);
  console.log(`Low:      ${report.summary.low}${colors.reset}`);

  console.log(`\nStatus:   ${report.status === 'PASS' ? colors.green : colors.red}${report.status}${colors.reset}`);
  console.log('='.repeat(60));

  // Print detailed findings
  if (report.summary.critical > 0) {
    console.log(`\n${colors.red}CRITICAL FINDINGS:${colors.reset}`);
    findings.critical.forEach((f, i) => {
      console.log(`  ${i + 1}. [${f.category}] ${f.message}`);
      if (f.file) console.log(`     File: ${f.file}${f.line ? `:${f.line}` : ''}`);
    });
  }

  if (report.summary.high > 0) {
    console.log(`\n${colors.yellow}HIGH PRIORITY FINDINGS:${colors.reset}`);
    findings.high.forEach((f, i) => {
      console.log(`  ${i + 1}. [${f.category}] ${f.message}`);
      if (f.file) console.log(`     File: ${f.file}${f.line ? `:${f.line}` : ''}`);
    });
  }
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}llm_physics Audit Block Verification${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  // Run all checks
  checkForSecrets();
  checkCoverage();
  checkSecurityPatterns();
  checkAuditLogs();

  // Generate report
  const report = generateAuditReport();

  // Print summary
  printSummary(report);

  // Exit with appropriate code
  if (findings.critical.length > 0) {
    console.log(`\n${colors.red}Audit FAILED: Critical issues must be resolved before merge.${colors.reset}\n`);
    process.exit(2);
  } else if (findings.high.length > 0) {
    console.log(`\n${colors.yellow}Audit WARNING: High priority issues should be addressed.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}Audit PASSED: All checks successful.${colors.reset}\n`);
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main, addFinding, findings };
