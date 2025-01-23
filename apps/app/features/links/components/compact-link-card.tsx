'use client'

import { ImageError } from '@/utils/image-error'

import { ShortcutKey } from '@/app/admin/_components/common/shortcut-key'
import { useEnvironmentStore } from '@/features/links/hooks/environments/useEnvironmentStore'
import { type LinksApp } from '@/features/links/types/link.types'

import { cn } from '@links-base/ui/utils'

interface CompactLinkCardProps {
  app: LinksApp
  className?: string
  favoriteIndex?: number
}

export const CompactLinkCard: React.FC<CompactLinkCardProps> = ({
  app,
  className,
  favoriteIndex
}) => {
  const { currentEnvironment } = useEnvironmentStore()

  const getUrl = () => {
    if (app.environments && currentEnvironment) {
      return app.environments[currentEnvironment] || app.environments.production
    }
    return app.environments?.production
  }

  const url = getUrl()

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative flex-none rounded-lg border bg-card text-card-foreground shadow-sm',
        'flex h-20 select-none flex-col hover:shadow-lg dark:shadow-slate-500/50',
        'cursor-pointer transition-all duration-200',
        'hover:scale-105 hover:text-accent-foreground',
        className
      )}
    >
      {favoriteIndex !== undefined && (
        <div className="absolute left-2 top-2 z-20">
          <ShortcutKey number={favoriteIndex + 1} />
        </div>
      )}
      <div className="flex h-full flex-col items-center justify-center p-2">
        <div className="flex items-center justify-center">
          <ImageError app={app} />
        </div>
        <span className="mt-1 text-center text-sm font-medium">{app.name}</span>
      </div>
    </div>
  )
}
