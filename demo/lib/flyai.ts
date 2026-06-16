import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface FlyaiResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Run a flyai CLI command and return the parsed JSON result.
 * Example: runFlyai('search-hotel', { 'dest-name': '杭州西湖' })
 * Runs: flyai search-hotel --dest-name "杭州西湖" 2>/dev/null
 */
export async function runFlyai(
  command: string,
  args: Record<string, string | number> = {}
): Promise<FlyaiResult> {
  const argString = Object.entries(args)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => `--${key} "${String(value).replace(/"/g, '\\"')}"`)
    .join(' ');

  const fullCommand = `flyai ${command} ${argString} 2>/dev/null`;

  try {
    const { stdout } = await execAsync(fullCommand, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    const trimmed = stdout.trim();
    if (!trimmed) {
      return { success: false, error: 'Empty response from flyai CLI' };
    }

    const parsed = JSON.parse(trimmed);
    return { success: true, data: parsed };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes('command not found') || message.includes('ENOENT')) {
      return {
        success: false,
        error: 'flyai CLI is not installed. Run: npm i -g @fly-ai/flyai-cli',
      };
    }

    if (message.includes('timeout')) {
      return { success: false, error: 'flyai command timed out (30s)' };
    }

    return { success: false, error: `flyai error: ${message}` };
  }
}
