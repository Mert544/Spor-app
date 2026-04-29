#!/usr/bin/env node
/**
 * Apex Debug Audit — Node.js wrapper for apex-debug
 * 
 * Usage:
 *   node scripts/apex-debug-audit.js
 *   node scripts/apex-debug-audit.js --watch
 *   node scripts/apex-debug-audit.js --fix
 *   node scripts/apex-debug-audit.js --output sarif
 */

import { execSync, spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const APEX_DEBUG_BIN = 'C:\\Users\\salio\\AppData\\Local\\Programs\\Python\\Python311\\Scripts\\apex-debug.exe';

function checkApexDebug() {
  try {
    execSync(`"${APEX_DEBUG_BIN}" info`, { stdio: 'pipe', shell: true });
    return true;
  } catch {
    return false;
  }
}

function runApexDebug(args) {
  if (!checkApexDebug()) {
    console.error('\n❌ apex-debug not found.');
    console.error('Please install it:');
    console.error('  cd ../apex-debug');
    console.error('  pip install -e .');
    console.error('\nOr set APEX_DEBUG_PATH environment variable.');
    process.exit(1);
  }

  const cmd = `"${APEX_DEBUG_BIN}" ${args.join(' ')}`;
  console.log(`🔍 Running: ${cmd}`);
  console.log(`📁 Project: ${PROJECT_ROOT}`);
  console.log('');

  try {
    execSync(cmd, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true,
    });
  } catch (error) {
    if (error.status !== 0) {
      console.error(`\n⚠️  apex-debug exited with code ${error.status}`);
      process.exit(error.status);
    }
  }
}

function runWatch() {
  if (!checkApexDebug()) {
    console.error('❌ apex-debug not found. See installation instructions above.');
    process.exit(1);
  }

  console.log('👁️  Watching src/ for changes... (Press Ctrl+C to stop)');
  
  const child = spawn(APEX_DEBUG_BIN, ['watch', 'src/'], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

// Parse arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Apex Debug Audit — V-Taper Coach

Usage:
  node scripts/apex-debug-audit.js [options]

Options:
  --watch        Watch src/ for changes and re-analyze
  --fix          Apply safe auto-fixes
  --fix-dry-run  Show fix suggestions without applying
  --output fmt   Export report: markdown, sarif, json, html
  --diff         Only analyze changed lines since last commit
  --exit-code    Exit with non-zero code if findings found
  --help         Show this help

Examples:
  node scripts/apex-debug-audit.js
  node scripts/apex-debug-audit.js --watch
  node scripts/apex-debug-audit.js --output sarif
  node scripts/apex-debug-audit.js --diff --exit-code
`);
  process.exit(0);
}

if (args.includes('--watch')) {
  runWatch();
} else {
  const apexArgs = ['analyze', 'src/'];
  
  if (args.includes('--fix')) apexArgs.push('--fix');
  if (args.includes('--fix-dry-run')) apexArgs.push('--fix-dry-run');
  if (args.includes('--diff')) apexArgs.push('--diff');
  if (args.includes('--exit-code')) apexArgs.push('--exit-code');
  if (args.includes('--diff-staged')) apexArgs.push('--diff-staged');
  
  const outputIdx = args.findIndex(a => a === '--output');
  if (outputIdx !== -1 && args[outputIdx + 1]) {
    apexArgs.push('--output', args[outputIdx + 1]);
  }
  
  runApexDebug(apexArgs);
}
