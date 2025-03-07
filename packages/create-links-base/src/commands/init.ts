import { fileURLToPath } from 'url'
import boxen from 'boxen'
import chalk from 'chalk'
import fs from 'fs/promises'
import type { Ora } from 'ora'
import ora from 'ora'
import prompts from 'prompts'

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
    logger.info('\n📝 Next steps:\n')

    // Navigation instructions
    logger.info(`  ${chalk.cyan('1.')} Navigate to your project:`)
    logger.info(`     ${chalk.cyan(`cd ${targetDir}`)}\n`)

    // Start the app
    logger.info(`  ${chalk.cyan('2.')} Start the development server:`)
    logger.info(`     ${chalk.cyan('pnpm dev')}\n`)

    // Admin setup
    logger.info(`  ${chalk.cyan('3.')} Set up your application:`)
    logger.info(
      `     ${chalk.gray('→')} Open ${chalk.cyan('http://localhost:3000/admin')} in your browser`
    )
    logger.info(`     ${chalk.gray('→')} Complete the setup wizard:`)
    logger.info(
      `        • Choose between default settings or custom configuration`
    )
    logger.info(
      `        • Configure your application basics (name, description)`
    )
    logger.info(`        • Set up link request options`)
    logger.info(`        • Choose to start fresh or use a template`)
    logger.info(
      `     ${chalk.gray('→')} Start adding your links and categories\n`
    )

    // Deployment instructions
    logger.info(`  ${chalk.cyan('4.')} Deploy to GitHub Pages:`)
    logger.info(`     ${chalk.gray('→')} Create a new repository on GitHub`)
    logger.info(`     ${chalk.gray('→')} Push your code:`)
    logger.info(`        ${chalk.cyan('git init')}`)
    logger.info(`        ${chalk.cyan('git add .')}`)
    logger.info(`        ${chalk.cyan('git commit -m "Initial commit"')}`)
    logger.info(`        ${chalk.cyan('git branch -M main')}`)
    logger.info(
      `        ${chalk.cyan('git remote add origin <your-repository-url>')}`
    )
    logger.info(`        ${chalk.cyan('git push -u origin main')}\n`)
    logger.info(
      `     ${chalk.gray('→')} Enable GitHub Pages in your repository settings\n`
    )
    logger.info(
      `     ${chalk.gray('→')} For detailed deployment instructions on Github Pages, see: ${chalk.cyan('docs/deployment/github-pages.md')}\n`
    )

    logger.info(`\n${chalk.green('Happy linking! 🔗')}\n`)
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
