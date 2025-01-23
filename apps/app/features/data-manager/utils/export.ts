import { type LinksApp } from '@/features/links/types/link.types'

import { type toast } from '@links-base/ui/hooks'

interface ExportOptions {
  links: Record<string, LinksApp[]>
  toast: typeof toast
}

export function exportAsHtml({ links, toast }: ExportOptions) {
  try {
    let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n'
    html +=
      '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n'
    html += '<TITLE>Bookmarks</TITLE>\n'
    html += '<H1>Bookmarks</H1>\n'
    html += '<DL><p>\n'

    // Add category folders
    Object.entries(links)
      .sort()
      .forEach(([categoryName, categoryLinks]) => {
        html += `<DT><H3>${categoryName}</H3>\n<DL><p>\n`

        // Group links by base name for multi-environment links
        const groupedLinks = categoryLinks.reduce(
          (acc, link) => {
            if (
              link.environments &&
              Object.keys(link.environments).length > 1 &&
              link.name
            ) {
              if (!acc[link.name]) {
                acc[link.name] = []
              }
              acc[link.name].push(link)
            }
            return acc
          },
          {} as Record<string, LinksApp[]>
        )

        // Handle grouped environment links
        Object.entries(groupedLinks).forEach(([baseName, links]) => {
          if (!baseName) return

          html += `<DT><H3>${baseName}</H3>\n`
          html += '<DL><p>\n'

          const envLinks = links[0]?.environments
          if (envLinks) {
            Object.entries(envLinks)
              .sort(([a], [b]) => a.localeCompare(b))
              .forEach(([env, url]) => {
                if (url) {
                  const title = `${baseName} (${env})`
                  html += `<DT><A HREF="${url}">${title}</A>\n`
                }
              })
          }
          html += '</DL><p>\n'
        })

        // Handle regular links
        categoryLinks
          .filter(
            link =>
              !link.environments || Object.keys(link.environments).length <= 1
          )
          .forEach(link => {
            if (!link.name) return
            const url = link.environments?.production

            if (url) {
              html += `<DT><A HREF="${url}">${link.name}</A>\n`
            }
          })

        html += '</DL><p>\n'
      })

    html += '</DL>'

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookmarks.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Success',
      description: 'Bookmarks exported successfully as HTML'
    })
  } catch (error) {
    console.error('Export error:', error)
    toast({
      title: 'Error',
      description: 'Failed to export bookmarks',
      variant: 'destructive'
    })
  }
}
