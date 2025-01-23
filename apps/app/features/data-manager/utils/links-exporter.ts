import appConfig from '@/config/app.config'
import { DEFAULT_CATEGORY } from '@/constants'
import { type LinksApp } from '@/features/links/types/link.types'

type ExportFormat = 'csv' | 'bookmarks'

export class LinksExporter {
  private links: LinksApp[]

  constructor(links: LinksApp[]) {
    this.links = links
  }

  private getFormattedDateTime(): string {
    const now = new Date()
    return now
      .toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .slice(0, 19) // Get YYYY-MM-DD_HH-mm-ss format
  }

  private generateFileName(format: ExportFormat): string {
    const dateTime = this.getFormattedDateTime()
    const appName = String(appConfig.name).toLowerCase().replace(/\s+/g, '-')

    switch (format) {
      case 'bookmarks':
        return `${appName}_bookmarks_${dateTime}.html`
      case 'csv':
        return `${appName}_links_${dateTime}.csv`
      default:
        throw new Error(`Unsupported export format: ${String(format)}`)
    }
  }

  private groupLinksByCategory() {
    return this.links.reduce(
      (acc, link) => {
        const category = link.category || DEFAULT_CATEGORY
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(link)
        return acc
      },
      {} as Record<string, LinksApp[]>
    )
  }

  private generateBookmarksHtml(): string {
    const linksByCategory = this.groupLinksByCategory()

    let bookmarksHtml = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>`

    Object.entries(linksByCategory).forEach(([category, categoryLinks]) => {
      bookmarksHtml += `\n    <DT><H3>${category}</H3>\n    <DL><p>\n`

      categoryLinks.forEach(link => {
        const description = link.description
          ? ` DESCRIPTION="${link.description}"`
          : ''
        const tags = link.tags?.length ? ` TAGS="${link.tags.join(',')}"` : ''
        bookmarksHtml += `        <DT><A HREF="${link.environments?.production}" ADD_DATE="${Math.floor(Date.now() / 1000)}"${description}${tags}>${link.name}</A>\n`
      })

      bookmarksHtml += '    </DL><p>'
    })

    bookmarksHtml += '\n</DL><p>'
    return bookmarksHtml
  }

  private escapeCSV(value: string): string {
    if (!value) return '""'
    // If the value contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
    if (value.includes('"') || value.includes(',') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  private generateCsv(): string {
    const headers = [
      'name',
      'description',
      'category',
      'color',
      'tags',
      'production_url',
      'staging_url',
      'development_url',
      'integration_url'
    ]
    const csvRows = [headers.join(',')]

    this.links.forEach(link => {
      const row = [
        this.escapeCSV(link.name),
        this.escapeCSV(link.description || ''),
        this.escapeCSV(link.category),
        this.escapeCSV(link.color || ''),
        this.escapeCSV(link.tags?.join(';') || ''),
        this.escapeCSV(link.environments?.production || ''),
        this.escapeCSV(link.environments?.staging || ''),
        this.escapeCSV(link.environments?.integration || '')
      ]
      csvRows.push(row.join(','))
    })

    return csvRows.join('\n')
  }

  private generateTemplateCSV(): string {
    const headers = [
      'name',
      'description',
      'category',
      'color',
      'tags',
      'production_url',
      'staging_url',
      'development_url',
      'integration_url'
    ]

    // Example row with all possible fields
    const exampleRow = [
      'GitHub',
      'Version control and collaboration platform',
      'Development',
      '#171515',
      'git;code;collaboration',
      'https://github.com',
      'https://staging.github.com',
      'https://dev.github.com',
      'https://integration.github.com'
    ].map(value => this.escapeCSV(value))

    return [
      headers.join(','),
      exampleRow.join(','),
      // Empty row for users to start filling in
      Array(headers.length)
        .fill('""')
        .join(',')
    ].join('\n')
  }

  public export(format: ExportFormat): {
    content: string
    filename: string
    type: string
  } {
    const filename = this.generateFileName(format)

    switch (format) {
      case 'bookmarks':
        return {
          content: this.generateBookmarksHtml(),
          filename,
          type: 'text/html'
        }
      case 'csv':
        return {
          content: this.generateCsv(),
          filename,
          type: 'text/csv'
        }
      default:
        throw new Error(`Unsupported export format: ${String(format)}`)
    }
  }

  public exportTemplate(): { content: string; filename: string; type: string } {
    const dateTime = this.getFormattedDateTime()
    const appName = appConfig.name.toLowerCase().replace(/\s+/g, '-')

    return {
      content: this.generateTemplateCSV(),
      filename: `${appName}_links_template_${dateTime}.csv`,
      type: 'text/csv'
    }
  }
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
