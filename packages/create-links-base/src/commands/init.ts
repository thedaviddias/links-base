import boxen from 'boxen'
import chalk from 'chalk'
import fs from 'fs/promises'
import type { Ora } from 'ora'
import ora from 'ora'
import prompts from 'prompts'
import { fileURLToPath } from 'url'

import type { InitOptions } from '../types/init.types'
import { showBanner } from '../utils/banner'
import { copyFiles } from '../utils/copy'
import { installDependencies } from '../utils/dependencies'
import { logger } from '../utils/logger'
import { updatePackageJson } from '../utils/package-json'

/**
 * Initializes a new Links Base project
 */
export async function init(
  projectName?: string,
  options: InitOptions = {}
): Promise<void> {
  // Show banner
  await showBanner()

  const spinner = ora({
    spinner: 'dots',
    color: 'cyan'
  })

  try {
    const targetDir = await getProjectName(projectName)

    if (options.dryRun) {
      await handleDryRun(targetDir, spinner)
      return
    }

    // Project creation steps with improved spinners
    const steps = [
      {
        text: 'Creating project directory',
        action: async () => {
          await fs.mkdir(targetDir, { recursive: true })
        }
      },
      {
        text: 'Copying project files',
        action: async () => {
          await copyFiles(targetDir)
          await updatePackageJson(targetDir)
        }
      },
      {
        text: 'Installing dependencies',
        action: async () => {
          await installDependencies(targetDir)
        }
      }
    ]

    // Execute steps with spinners
    for (const step of steps) {
      spinner.start(step.text)
      await step.action()
      spinner.succeed()
    }

    // Show success message in a box
    logger.success(
      boxen(`🎉 Successfully created Links Base app at ${targetDir}!`, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      })
    )

    // Show next steps
    logger.info('\n📦 Available commands:\n')

    const commands = [
      ['pnpm dev', 'Start the development server'],
      ['pnpm build', 'Build for production'],
      ['pnpm start', 'Run production build']
    ]

    commands.forEach(([command, description]) => {
      logger.info(`  ${chalk.cyan(command)}`)
      logger.subtle(`  ${description}\n`)
    })

    logger.info('\n🚀 Get started with:\n')
    logger.info(`  ${chalk.cyan(`cd ${targetDir}`)}`)
    logger.info(`  ${chalk.cyan('pnpm dev')}\n`)
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred'
    spinner.fail(`Failed to create project: ${errorMessage}`)
    process.exit(1)
  }
}

async function getProjectName(projectName?: string): Promise<string> {
  if (projectName) return projectName

  const response = (await prompts({
    type: 'text',
    name: 'projectName',
    message: 'What is your project named?',
    initial: 'my-links-app'
  })) as { projectName: string }

  if (!response.projectName) {
    logger.error('Project name is required')
    process.exit(1)
  }

  return response.projectName
}

async function handleDryRun(targetDir: string, spinner: Ora): Promise<void> {
  await Promise.resolve()

  try {
    spinner.start('Simulating project creation...')
    spinner.info(`Would create directory: ${targetDir}`)
    spinner.info(`Would copy app files from apps/app to ${targetDir}`)
    spinner.info(`Would copy packages to ${targetDir}/packages`)
    spinner.info('Would update package.json')
    spinner.info('Would install dependencies using pnpm')
    spinner.succeed('Dry run completed - no changes made')
  } catch (err) {
    const error = err as Error
    spinner.fail(`Dry run failed: ${error.message}`)
    throw error
  }
}

// Only run init if this is the main module
if (import.meta.url === fileURLToPath(import.meta.url)) {
  init().catch(error => {
    console.error('Failed to initialize project:', error)
    process.exit(1)
  })
}
