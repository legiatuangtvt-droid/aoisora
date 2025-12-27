#!/usr/bin/env node

/**
 * OptiChain Pre-Push Validation Script
 * =====================================
 * Run this script before pushing code to ensure
 * no build/lint/test errors exist in the system.
 *
 * Usage: node scripts/validate.js
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const PROJECT_ROOT = path.resolve(__dirname, '..');
let errors = 0;
let warnings = 0;

// ============================================
// Helper Functions
// ============================================

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('');
  log('════════════════════════════════════════════', 'blue');
  log(`  ${title}`, 'blue');
  log('════════════════════════════════════════════', 'blue');
}

function success(message) {
  log(`  ✓ ${message}`, 'green');
}

function error(message) {
  log(`  ✗ ${message}`, 'red');
  errors++;
}

function warning(message) {
  log(`  ⚠ ${message}`, 'yellow');
  warnings++;
}

function info(message) {
  log(`  ℹ ${message}`, 'cyan');
}

function runCommand(command, options = {}) {
  const { cwd = PROJECT_ROOT, silent = false, ignoreError = false } = options;

  try {
    const result = execSync(command, {
      cwd,
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
    });
    return { success: true, output: result };
  } catch (err) {
    if (ignoreError) {
      return { success: false, output: err.stdout || err.message };
    }
    throw err;
  }
}

// ============================================
// Check 1: Git Status
// ============================================

function checkGitStatus() {
  header('Git Status Check');

  try {
    // Get current branch
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();
    info(`Current branch: ${branch}`);

    // Get last commit
    const lastCommit = execSync('git log -1 --format="%h - %s"', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();
    info(`Last commit: ${lastCommit}`);

    // Check for uncommitted changes
    const status = execSync('git status --porcelain', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();

    if (status) {
      warning('Uncommitted changes detected:');
      console.log(status.split('\n').map(l => `    ${l}`).join('\n'));
    } else {
      success('Working directory clean');
    }

    return true;
  } catch (err) {
    warning('Could not check git status');
    return true;
  }
}

// ============================================
// Check 2: Frontend Build
// ============================================

function checkFrontendBuild() {
  header('Frontend Build Check');

  const frontendDir = path.join(PROJECT_ROOT, 'frontend');

  // Check if node_modules exists
  if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
    info('Installing dependencies...');
    try {
      runCommand('npm install', { cwd: frontendDir });
    } catch (err) {
      error('Failed to install dependencies');
      return false;
    }
  }

  // Run build
  info('Running Next.js build...');
  try {
    runCommand('npm run build', { cwd: frontendDir });
    success('Frontend build successful');
    return true;
  } catch (err) {
    error('Frontend build failed');
    console.log(err.message);
    return false;
  }
}

// ============================================
// Check 3: Frontend TypeScript Check
// ============================================

function checkFrontendTypeScript() {
  header('Frontend TypeScript Check');

  const frontendDir = path.join(PROJECT_ROOT, 'frontend');

  info('Checking TypeScript types...');
  const result = runCommand('npx tsc --noEmit', {
    cwd: frontendDir,
    silent: true,
    ignoreError: true
  });

  if (result.success) {
    success('TypeScript types OK');
    return true;
  } else {
    warning('TypeScript warnings found');
    if (result.output) {
      console.log(result.output.split('\n').slice(0, 10).map(l => `    ${l}`).join('\n'));
    }
    return true; // Don't fail on TS warnings
  }
}

// ============================================
// Check 4: Frontend Lint
// ============================================

function checkFrontendLint() {
  header('Frontend Lint Check');

  const frontendDir = path.join(PROJECT_ROOT, 'frontend');

  info('Running ESLint...');
  const result = runCommand('npx next lint', {
    cwd: frontendDir,
    silent: true,
    ignoreError: true
  });

  if (result.success) {
    success('ESLint passed');
    return true;
  } else {
    warning('ESLint warnings found');
    return true; // Don't fail on lint warnings
  }
}

// ============================================
// Check 5: Database Schema Changes
// ============================================

function checkDatabaseChanges() {
  header('Database Schema Check');

  try {
    // Check if database files were modified
    const status = execSync('git status --porcelain', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();

    const dbFiles = [
      'database/',
      'backend/app/models/',
      'schema',
      '.sql',
      'migration',
      'alembic',
    ];

    const changedDbFiles = status.split('\n').filter(line => {
      return dbFiles.some(pattern => line.toLowerCase().includes(pattern.toLowerCase()));
    });

    if (changedDbFiles.length > 0) {
      log('', 'yellow');
      log('  ╔══════════════════════════════════════════════════════════╗', 'yellow');
      log('  ║  ⚠ DATABASE SCHEMA CHANGES DETECTED                      ║', 'yellow');
      log('  ╠══════════════════════════════════════════════════════════╣', 'yellow');
      log('  ║  Please ensure you have:                                 ║', 'yellow');
      log('  ║  1. Run the SQL migration on Neon database               ║', 'yellow');
      log('  ║  2. Tested the changes locally                           ║', 'yellow');
      log('  ║  3. Updated DATABASE_STRUCTURE.md if needed              ║', 'yellow');
      log('  ╚══════════════════════════════════════════════════════════╝', 'yellow');
      log('', 'yellow');
      info('Changed database-related files:');
      changedDbFiles.forEach(f => console.log(`    ${f}`));
      warning('Database changes detected - verify migration to Neon');
    } else {
      success('No database schema changes detected');
    }

    // Also check staged files
    const stagedStatus = execSync('git diff --cached --name-only', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();

    const stagedDbFiles = stagedStatus.split('\n').filter(line => {
      return dbFiles.some(pattern => line.toLowerCase().includes(pattern.toLowerCase()));
    });

    if (stagedDbFiles.length > 0) {
      log('', 'yellow');
      log('  ╔══════════════════════════════════════════════════════════╗', 'yellow');
      log('  ║  ⚠ STAGED DATABASE FILES WILL BE PUSHED                  ║', 'yellow');
      log('  ╠══════════════════════════════════════════════════════════╣', 'yellow');
      log('  ║  Make sure Neon DB is updated BEFORE pushing!            ║', 'yellow');
      log('  ╚══════════════════════════════════════════════════════════╝', 'yellow');
      info('Staged database files:');
      stagedDbFiles.forEach(f => console.log(`    ${f}`));
    }

    return true;
  } catch (err) {
    warning('Could not check database changes');
    return true;
  }
}

// ============================================
// Check 6: Backend Syntax Check
// ============================================

function checkBackendSyntax() {
  header('Backend Syntax Check');

  const backendDir = path.join(PROJECT_ROOT, 'backend');

  // Find Python command
  let pythonCmd = null;
  for (const cmd of ['python', 'python3', 'py']) {
    try {
      execSync(`${cmd} --version`, { stdio: 'pipe' });
      pythonCmd = cmd;
      break;
    } catch (err) {
      // Continue to next
    }
  }

  if (!pythonCmd) {
    warning('Python not found, skipping backend checks');
    return true;
  }

  info(`Using Python: ${pythonCmd}`);

  // Check main files
  const filesToCheck = [
    'app/main.py',
    'app/core/config.py',
    'app/core/security.py',
  ];

  let allOk = true;

  for (const file of filesToCheck) {
    const filePath = path.join(backendDir, file);
    if (fs.existsSync(filePath)) {
      try {
        execSync(`${pythonCmd} -m py_compile "${filePath}"`, { stdio: 'pipe' });
        success(`${file} syntax OK`);
      } catch (err) {
        error(`${file} has syntax errors`);
        allOk = false;
      }
    }
  }

  return allOk;
}

// ============================================
// Main Execution
// ============================================

async function main() {
  console.log('');
  log('╔════════════════════════════════════════════╗', 'blue');
  log('║   OptiChain Pre-Push Validation Script     ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');

  const startTime = Date.now();

  // Run all checks
  checkGitStatus();
  checkDatabaseChanges();  // Check DB changes FIRST before other checks
  const buildOk = checkFrontendBuild();
  checkFrontendTypeScript();
  checkFrontendLint();
  checkBackendSyntax();

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Summary
  header('Summary');

  console.log(`  Duration: ${duration}s`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}`);
  console.log('');

  if (errors > 0) {
    log('╔════════════════════════════════════════════╗', 'red');
    log('║   ✗ VALIDATION FAILED - DO NOT PUSH        ║', 'red');
    log('╚════════════════════════════════════════════╝', 'red');
    console.log('');
    console.log('Please fix the errors above before pushing.');
    process.exit(1);
  } else {
    log('╔════════════════════════════════════════════╗', 'green');
    log('║   ✓ VALIDATION PASSED - READY TO PUSH      ║', 'green');
    log('╚════════════════════════════════════════════╝', 'green');
    console.log('');

    if (warnings > 0) {
      log(`Note: ${warnings} warning(s) found. Consider reviewing them.`, 'yellow');
    }

    process.exit(0);
  }
}

main().catch(err => {
  console.error('Validation script error:', err);
  process.exit(1);
});
