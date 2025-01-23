import { exec as execCallback } from 'child_process'
import { promisify } from 'util'

const exec = promisify(execCallback)

/**
 * Installs project dependencies using pnpm
 */
export async function installDependencies(targetDir: string): Promise<void> {
  await exec('pnpm install', { cwd: targetDir })
}
