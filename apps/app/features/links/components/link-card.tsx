'use client'

import { useEffect, useRef, useState } from 'react'

import { Archive, Info } from 'lucide-react'

import { ImageError } from '@/utils/image-error'

import { BADGE_STYLE, DEFAULT_COLOR } from '@/constants'
import { EnvironmentBadge } from '@/features/environment/components/environment-badge'
import { type Environment } from '@/features/environment/types/environment.types'
import { useFavourites } from '@/features/favourite/hooks/use-favourites'
import { CardMoreMenu } from '@/features/links/components/card-more-menu'
import { LinkDetailsModal } from '@/features/links/components/link-details-modal'
import { useEnvironmentStore } from '@/features/links/hooks/environments/useEnvironmentStore'
import { useLinkClickStore } from '@/features/links/stores/use-link-click-store'
import { useRecentLinksStore } from '@/features/links/stores/use-recent-links-store'
import { type LinksApp } from '@/features/links/types/link.types'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { Badge } from '@links-base/ui/badge'
import { CardContent, CardDescription, CardTitle } from '@links-base/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'
import { cn } from '@links-base/ui/utils'

interface LinkCardProps {
  app: LinksApp
  handleLinkClick: (url: string) => void
  clickedLinks: string[]
  handleAddToFavorites: () => void
  isArchived?: boolean
  onArchiveToggle: (name: string) => void
  isFavourite: boolean
  className?: string
  onDismissNew?: (appName: string) => void
  showManageOptions?: boolean
}

export const LinkCard = ({
  app,
  handleLinkClick,
  clickedLinks,
  handleAddToFavorites,
  isArchived = false,
  onArchiveToggle,
  className,
  onDismissNew,
  showManageOptions = true
}: LinkCardProps) => {
  const tagsContainerRef = useRef<HTMLDivElement>(null)
  const favourites = useFavourites()
  const isPinned = favourites.isFavourite(app.name)
  const { currentEnvironment } = useEnvironmentStore()

  // Get user settings
  const {
    cardSize,
    cardSizeConfigs,
    showGradients,
    showDescriptions,
    showTags,
    showIcons,
    showEnvironmentBadges
  } = useUserSettingsStore()

  const currentConfig = cardSizeConfigs[cardSize] || cardSizeConfigs.default

  const store = useLinkClickStore()

  const { hasVisitedRecent, recentLinks } = useRecentLinksStore()

  const [showInstructionsModal, setShowInstructionsModal] = useState(false)

  useEffect(() => {
    if (!app.tags?.length) return

    const calculateVisibleTags = () => {
      const container = tagsContainerRef.current
      if (!container) return

      requestAnimationFrame(() => {
        const containerWidth = container.offsetWidth
        let currentWidth = 0

        const badges = container.getElementsByClassName('badge-element')

        for (const badge of badges) {
          currentWidth += (badge as HTMLElement).offsetWidth + 8

          if (currentWidth > containerWidth) {
            break
          }
        }
      })
    }

    calculateVisibleTags()
    window.addEventListener('resize', calculateVisibleTags)

    return () => window.removeEventListener('resize', calculateVisibleTags)
  }, [app.tags])

  const getUrl = () => {
    if (!app.environments) return ''
    return (
      app.environments[currentEnvironment as keyof typeof app.environments] ||
      app.environments.production
    )
  }

  const url = getUrl()

  const hasMultipleEnvironments =
    app.environments &&
    Object.entries(app.environments).filter(
      ([_, value]) => value && value !== ''
    ).length > 1

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const url = getUrl()
    if (!url) return

    store.incrementClickCount(app.name, {
      url: url,
      environment: currentEnvironment as string
    })

    handleLinkClick(url)

    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
    }, 100)
  }

  // Get the brand color from the app's icon, defaulting to a neutral color if not available
  const brandColor = app?.color || DEFAULT_COLOR

  const gradientStyle = showGradients
    ? ({
        // Light mode gradient
        backgroundImage: `linear-gradient(to bottom left, ${brandColor}35, ${brandColor}15, transparent)`,
        content: '',
        position: 'absolute',
        top: '-3rem',
        right: '-3rem',
        width: '16rem',
        height: '16rem',
        filter: 'blur(12px)',
        zIndex: 0
      } as React.CSSProperties)
    : {}

  const darkGradientStyle = showGradients
    ? ({
        // Dark mode gradient
        backgroundImage: `linear-gradient(to bottom left, ${brandColor}90, ${brandColor}60, transparent)`
      } as React.CSSProperties)
    : {}

  const cardStyle = {
    '--card-shadow-color': `${brandColor}40`
  } as React.CSSProperties

  const shouldShowNewBadge = () => {
    if (hasVisitedRecent) return false
    if (clickedLinks.includes(url)) return false
    return recentLinks.includes(app.name)
  }

  return (
    <div className="relative h-full">
      {shouldShowNewBadge() && (
        <div className={cn(BADGE_STYLE, 'group absolute -left-3 -top-3 z-50')}>
          <span>New</span>
          {onDismissNew && (
            <button
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onDismissNew(app.name)
              }}
              className="ml-1 opacity-0 transition-opacity hover:text-white/80 group-hover:opacity-100"
              aria-label="Dismiss new badge"
            >
              ×
            </button>
          )}
        </div>
      )}
      <div
        style={cardStyle}
        className={cn(
          'relative flex flex-none select-none flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg dark:shadow-slate-500/50',
          'transition-all duration-300 ease-in-out',
          'hover:shadow-[0_8px_16px_-2px_var(--card-shadow-color)]',
          'w-full',
          isArchived && [
            'border-dashed border-muted-foreground/50',
            'bg-muted/50 dark:bg-muted/20'
          ],
          isPinned && 'opacity-50 transition-opacity hover:opacity-100',
          className
        )}
      >
        <div
          style={gradientStyle}
          className="dark:[&]:!bg-none" // Reset background in dark mode
        />
        {showGradients && (
          <div
            style={darkGradientStyle}
            className="absolute right-[-3rem] top-[-3rem] z-0 hidden h-64 w-64 blur-xl dark:block"
          />
        )}
        {isPinned && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 opacity-0 backdrop-blur-[1px] transition-opacity hover:opacity-100">
            <p className="text-sm font-medium text-muted-foreground">
              Already pinned to favorites
            </p>
          </div>
        )}
        <CardContent
          className={cn(
            'z-10 flex flex-1 flex-col gap-2',
            'transition-all duration-300 ease-in-out',
            currentConfig?.padding || 'p-4',
            cardSize === 'compact' && '!p-2'
          )}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {showIcons && <ImageError app={app} />}
              {cardSize === 'compact' ? (
                <CardTitle className="text-sm font-medium transition-all duration-300 ease-in-out">
                  <a
                    href={url}
                    className="before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-10 before:content-['']"
                    onClick={handleClick}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    {app.name}
                  </a>
                </CardTitle>
              ) : null}
              {app.instructions && (
                <div className="relative z-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info
                          className="cursor-pointer text-blue-500"
                          size={16}
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowInstructionsModal(true)
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click for more information</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {isArchived && (
                  <div
                    className="z-20 flex items-center gap-1.5 rounded-md border border-muted-foreground/30 bg-background/80 px-2 py-1"
                    aria-label="This link is archived"
                  >
                    <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Archived
                    </span>
                  </div>
                )}

                {showEnvironmentBadges &&
                  hasMultipleEnvironments &&
                  !isArchived && (
                    <EnvironmentBadge
                      environment={currentEnvironment as Environment}
                    />
                  )}
              </div>
              <CardMoreMenu
                app={app}
                handleAddToFavorites={handleAddToFavorites}
                isArchived={isArchived}
                onArchiveToggle={() => onArchiveToggle(app.name)}
                onShowAccess={() => {
                  setShowInstructionsModal(true)
                }}
                showManageOptions={showManageOptions}
              />
            </div>
          </div>

          {cardSize !== 'compact' && (
            <div className="flex flex-1 origin-top flex-col transition-all duration-300 ease-in-out">
              <CardTitle className="text-sm font-medium transition-opacity duration-300">
                <a
                  href={url || '#'}
                  className="before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:z-10 before:content-['']"
                  onClick={handleClick}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {app.name}
                </a>
              </CardTitle>
              <div className="flex flex-1 flex-col justify-between">
                {showDescriptions && (
                  <CardDescription
                    className={cn(
                      'text-xs transition-all duration-300 ease-in-out',
                      currentConfig.descriptionClasses
                    )}
                  >
                    {app.description}
                  </CardDescription>
                )}
                {showTags && app.tags && app.tags.length > 0 && (
                  <div className="z-30 mt-auto flex items-center gap-1.5 pt-2">
                    {/* Show primary tag */}
                    <Badge
                      variant="secondary"
                      className="border border-muted bg-background/80 px-1.5 py-0.5 text-[10px]"
                    >
                      {app.tags[0]}
                    </Badge>

                    {/* If there are additional tags, show count in subtle way */}
                    {app.tags.length > 1 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{app.tags.length - 1}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </div>

      <LinkDetailsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        link={app}
      />
    </div>
  )
}
