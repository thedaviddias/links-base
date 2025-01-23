import appConfig from '@/config/app.config'
import { type LinksApp } from '@/features/links/types/link.types'

import { generateBookmarksFile } from './generate-bookmarks-file'

export const handleExport = (webappsByCategory: Record<string, LinksApp[]>) => {
  const appName = appConfig.name.toLowerCase().replace(/\s+/g, '-')
  const htmlContent = generateBookmarksFile(webappsByCategory)

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `bookmarks-${appName}-${new Date().toISOString()}.html`
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
