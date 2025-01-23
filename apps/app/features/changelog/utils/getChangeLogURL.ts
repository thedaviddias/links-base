import appConfig from '@/config/app.config'

export function getChangeLogURL() {
  return `https://raw.githubusercontent.com/${appConfig.githubRepo}/refs/heads/main/CHANGELOG.md`
}
