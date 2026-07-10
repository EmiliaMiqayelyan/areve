import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = path.join(root, '.next', 'dev', 'lock');

if (fs.existsSync(lockPath)) {
  fs.unlinkSync(lockPath);
}

const cachePath = path.join(root, '.next', 'cache');
if (fs.existsSync(cachePath)) {
  fs.rmSync(cachePath, { recursive: true, force: true });
}

function run(command, args, timeoutMs = 8000) {
  try {
    return execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: timeoutMs,
      windowsHide: true,
    });
  } catch {
    return '';
  }
}

function freePort(port) {
  if (process.platform === 'win32') {
    const output = run('netstat.exe', ['-ano'], 10000);
    const pids = new Set();

    for (const line of output.split('\n')) {
      if (!line.includes('LISTENING')) continue;
      const parts = line.trim().split(/\s+/);
      const localAddress = parts[1] ?? '';
      if (!localAddress.endsWith(`:${port}`)) continue;
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') pids.add(pid);
    }

    for (const pid of pids) {
      run('taskkill.exe', ['/F', '/PID', pid], 5000);
    }
    return;
  }

  run('sh', ['-c', `lsof -ti:${port} | xargs kill -9 2>/dev/null || true`], 5000);
}

freePort(3000);
