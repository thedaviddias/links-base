#!/usr/bin/env node
import { Command } from 'commander'
import { init } from './commands/init'
import { update } from './commands/update'

const program = new Command()

program
  .name('links-base')
  .description('CLI tool to create and manage Links Base projects')
  .version('1.0.0')

program
  .command('init')
  .description('Create a new Links Base project')
  .argument('[name]', 'Project name')
  .option('--dry-run', 'Show what would be done without making changes', false)
  .action(async (name, options) => {
    await init(name, options)
  })

program
  .command('update')
  .description('Update Links Base to the latest version')
  .option('--dry-run', 'Show what would be done without making changes', false)
  .option('--force', 'Force update even if there are local changes', false)
  .action(async options => {
    await update(options)
  })

program.parse()
