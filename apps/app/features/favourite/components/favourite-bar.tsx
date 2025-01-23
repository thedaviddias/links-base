'use client'

import { Link, PinIcon, PinOff } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { EmptyState } from '@/components/skeletons/empty-state'

import { PINNED_LINKS_GRID_CLASSES } from '@/constants'
import { CompactLinkCard } from '@/features/links/components/compact-link-card'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { Button } from '@links-base/ui/button'
import { useToast } from '@links-base/ui/hooks'

import { useFavourites } from '../hooks/use-favourites'

interface FavouriteBarProps {
  maxFavorites?: number
}

export const FavouriteBar: React.FC<FavouriteBarProps> = ({
  maxFavorites = 8
}) => {
  const { favourites, removeFavourite } = useFavourites()
  const { toast } = useToast()
  const { links } = useLinks()
  const { showFavorites } = useUserSettingsStore()
  const handleRemove = (appName: string) => {
    removeFavourite(appName)
    toast({
      title: 'Removed from favorites',
      description: `${appName} has been unpinned from your favorites.`,
      duration: 3000
    })
  }

  if (!showFavorites) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="mb-4 flex items-center text-xl font-semibold">
        <PinIcon className="mr-2 h-4 w-4" />
        Pinned Links
      </h2>

      {links.length === 0 ? (
        <EmptyState
          icon={Link}
          title="No pinned links"
          description="Pinned links will appear here"
          height="100px"
        />
      ) : (
        <div className="@container">
          <div className={PINNED_LINKS_GRID_CLASSES}>
            <AnimatePresence mode="popLayout">
              {favourites.map((app, index) => (
                <motion.div
                  key={`${app.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{
                    duration: 0.2,
                    type: 'spring',
                    stiffness: 500,
                    damping: 25
                  }}
                  className="group relative"
                  layout
                >
                  <Button
                    className="absolute right-1 top-1 z-30 text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                    variant="ghost"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation()
                      handleRemove(app.name)
                    }}
                    aria-label={`Remove ${app.name} from favorites`}
                  >
                    <PinOff size={20} />
                  </Button>

                  <CompactLinkCard
                    app={app}
                    className="h-full"
                    favoriteIndex={index}
                  />
                </motion.div>
              ))}

              {favourites.length < maxFavorites &&
                Array.from({ length: maxFavorites - favourites.length }).map(
                  (_, index) => (
                    <motion.div
                      key={`empty-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex h-20 items-center justify-center rounded border-2 border-dotted border-gray-300 dark:border-gray-700"
                      layout
                    >
                      <span className="text-sm text-muted-foreground">
                        Pin link
                      </span>
                    </motion.div>
                  )
                )}
            </AnimatePresence>
          </div>
          {favourites.length >= maxFavorites && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-muted-foreground"
            >
              Maximum number of favorites reached ({maxFavorites}). Remove some
              to add more.
            </motion.p>
          )}
        </div>
      )}
    </div>
  )
}
