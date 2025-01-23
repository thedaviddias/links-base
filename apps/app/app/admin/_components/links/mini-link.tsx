import { Server } from 'lucide-react'

import { ImageError } from '@/utils/image-error'

import { ShortcutKey } from '@/app/admin/_components/common/shortcut-key'
import { type LinksApp } from '@/features/links/types/link.types'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@links-base/ui/hover-card'

type MiniLinkProps = {
  link: LinksApp
  shortcutNumber?: number
}

export function MiniLink({ link, shortcutNumber }: MiniLinkProps) {
  const productionUrl = link.environments?.production
  const otherEnvironments = Object.entries(link.environments || {}).filter(
    ([env, url]) => env !== 'production' && url
  )

  const hasOtherEnvironments = otherEnvironments.length > 0

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <ImageError app={link} />
        <div className="min-w-0 flex-1">
          <div className="font-medium">{link.name}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <a
                href={productionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:underline"
              >
                {productionUrl}
              </a>

              {hasOtherEnvironments && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                      <Server className="h-3 w-3" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-[300px] p-2">
                    <div className="space-y-2">
                      {otherEnvironments.map(([env, url]) => (
                        <div key={env} className="flex items-center gap-2">
                          <span className="min-w-16 text-xs font-medium capitalize">
                            {env}:
                          </span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-xs hover:underline"
                          >
                            {url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>
        </div>
      </div>
      {shortcutNumber && <ShortcutKey number={shortcutNumber} />}
    </div>
  )
}
