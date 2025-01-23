import chalk from 'chalk'

export const logger = {
  info: (...args: unknown[]) => console.log(chalk.blue(...args)),
  success: (...args: unknown[]) => console.log(chalk.green(...args)),
  warning: (...args: unknown[]) => console.log(chalk.yellow(...args)),
  error: (...args: unknown[]) => console.log(chalk.red(...args)),
  subtle: (...args: unknown[]) => console.log(chalk.gray(...args))
}
