import { exec as execCallback } from 'child_process'
import fs from 'fs/promises'
import ora from 'ora'
import path from 'path'
import { promisify } from 'util'
import type { UpdateOptions } from '../types/update.types'
import { showBanner } from '../utils/banner'
import { downloadRemoteFiles } from '../utils/copy'
import { logger } from '../utils/logger'

const exec = promisify(execCallback)

interface PackageJson {
  version?: string
  dependencies?: Record<string, string>
}

async function checkIsLinksBaseProject(): Promise<boolean> {
  try {
    const pkg = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8')
    )
    return pkg.dependencies?.['@links-base/ui'] !== undefined
  } catch {
    return false
  }
}

async function getCurrentVersion(): Promise<string> {
  const pkg = JSON.parse(
    await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8')
  ) as PackageJson
  return pkg.version || '0.0.0'
}

async function getLatestVersion(): Promise<string> {
  const { stdout } = await exec('npm view @links-base/ui version')
  return stdout.trim()
}

async function hasLocalChanges(): Promise<boolean> {
  try {
    const { stdout } = await exec('git status --porcelain')
    return stdout.trim().length > 0
  } catch {
    // If git command fails, assume no local changes
    return false
  }
}

async function performUpdate(): Promise<void> {
  const targetDir = process.cwd()

  // Backup user configurations
  await backupUserConfigs()

  // Update core files
  await downloadRemoteFiles(targetDir)

  // Update dependencies
  await exec('pnpm install')

  // Restore user configurations
  await restoreUserConfigs()
}

async function backupUserConfigs(): Promise<void> {
  // Backup important user files
  const filesToBackup = [
    '.env',
    '.env.local',
    'next.config.js',
    'tailwind.config.js'
  ]

  for (const file of filesToBackup) {
    try {
      await fs.copyFile(
        path.join(process.cwd(), file),
        path.join(process.cwd(), `${file}.backup`)
      )
    } catch {
      // Ignore if file doesn't exist
    }
  }
}

async function restoreUserConfigs(): Promise<void> {
  const backupFiles = await fs.readdir(process.cwd())

  for (const file of backupFiles) {
    if (file.endsWith('.backup')) {
      const originalFile = file.replace('.backup', '')
      await fs.rename(
        path.join(process.cwd(), file),
        path.join(process.cwd(), originalFile)
      )
    }
  }
}

export async function update(options: UpdateOptions = {}): Promise<void> {
  await showBanner()
  const spinner = ora({ spinner: 'dots', color: 'cyan' })

  try {
    const isLinksBaseProject = await checkIsLinksBaseProject()
    if (!isLinksBaseProject) {
      logger.error('Not in a Links Base project directory')
      process.exit(1)
    }

    spinner.start('Checking for updates...')
    const currentVersion = await getCurrentVersion()
    const latestVersion = await getLatestVersion()

    if (currentVersion === latestVersion) {
      spinner.succeed("You're already using the latest version!")
      return
    }

    if (options.dryRun) {
      spinner.info(`Would update from ${currentVersion} to ${latestVersion}`)
      return
    }

    if (!options.force && (await hasLocalChanges())) {
      spinner.fail('Local changes detected. Use --force to override')
      process.exit(1)
    }

    spinner.start(`Updating to version ${latestVersion}...`)
    await performUpdate()
    spinner.succeed(`Successfully updated to version ${latestVersion}`)

    logger.info('\n🎉 Update complete!')
    logger.info('\nPlease review any changes and test your application.')
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred'
    spinner.fail(`Update failed: ${errorMessage}`)
    process.exit(1)
  }
}
