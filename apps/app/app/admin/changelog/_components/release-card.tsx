'use client'

import { type FC } from 'react'

import { ExternalLink } from 'lucide-react'

import { Button } from '@links-base/ui/button'
import { Card } from '@links-base/ui/card'

interface ReleaseCardProps {
  version: string
  date: string
  changes: string
}

export const ReleaseCard: FC<ReleaseCardProps> = ({
  version,
  date,
  changes
}) => {
  return (
    <Card className="bg-muted/50 p-4">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold">Version {version}</h4>
            <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
              <a
                href={`https://github.com/facebook/react/releases/tag/v${version}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ExternalLink size={12} />
                GitHub
              </a>
            </Button>
          </div>
          <time className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
        {changes.split(/(?=### )/).map((section, index) => {
          const [header, ...content] = section.split('\n')
          const sectionContent = content.join('\n')

          return (
            <div key={index} className="space-y-2">
              {header.startsWith('### ') && (
                <h3 className="mt-4 text-base font-semibold text-foreground first:mt-0">
                  {header.replace('### ', '')}
                </h3>
              )}
              <div
                className="space-y-2 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: sectionContent
                    .split('\n')
                    .filter(line => line.trim())
                    .map(line => {
                      // Convert markdown links to HTML
                      const processedLine = line
                        .replace(
                          /\[([^\]]+)\]\(([^)]+)\)/g,
                          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>'
                        )
                        // Handle commit links like [f1338f]
                        .replace(
                          /\[([a-f0-9]+)\]/g,
                          '<code class="text-xs bg-muted rounded px-1">$1</code>'
                        )
                        // Handle PR links like #24591
                        .replace(
                          /#(\d+)/g,
                          '<a href="https://github.com/facebook/react/pull/$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">#$1</a>'
                        )
                        // Replace bullet points
                        .replace(
                          /^[*-]\s+/,
                          '<span class="inline-block w-4">•</span>'
                        )
                        // Handle inline code
                        .replace(
                          /`([^`]+)`/g,
                          '<code class="text-xs bg-muted rounded px-1">$1</code>'
                        )
                        // Handle usernames like @gaearon
                        .replace(
                          /@([a-zA-Z0-9_-]+)/g,
                          '<a href="https://github.com/$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">@$1</a>'
                        )

                      return `<div class="flex">${processedLine}</div>`
                    })
                    .join('')
                }}
              />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
