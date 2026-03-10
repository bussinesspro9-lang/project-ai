import * as fs from 'fs';
import * as path from 'path';

let envLoaded = false;

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnvFile(rawContent: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = rawContent.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line;
    const eqIndex = normalized.indexOf('=');
    if (eqIndex <= 0) continue;

    const key = normalized.slice(0, eqIndex).trim();
    const rawValue = normalized.slice(eqIndex + 1);
    if (!key) continue;

    const value = stripWrappingQuotes(rawValue)
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r');

    result[key] = value;
  }

  return result;
}

/**
 * Find the monorepo root .env by walking up from the current directory.
 * Works whether the process starts from api/, api/dist/, or the monorepo root.
 */
function findRootEnv(): string | undefined {
  let dir = process.cwd();

  for (let i = 0; i < 5; i++) {
    const envPath = path.join(dir, '.env');
    const pkgPath = path.join(dir, 'package.json');

    if (fs.existsSync(envPath) && fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.workspaces) return envPath;
      } catch {
        // not valid JSON, skip
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return undefined;
}

/**
 * Loads env vars from the monorepo root .env (single source of truth).
 */
export function loadApiEnv(): string | undefined {
  if (envLoaded) return undefined;

  const envPath = findRootEnv();
  if (!envPath) return undefined;

  const content = fs.readFileSync(envPath, 'utf8');
  const parsed = parseEnvFile(content);

  for (const [key, value] of Object.entries(parsed)) {
    process.env[key] = value;
  }

  envLoaded = true;
  return envPath;
}
