'use client'

import * as React from 'react'

import { MiniLink } from '@/app/admin/_components/links/mini-link'
import { DEFAULT_CATEGORY } from '@/constants'
import { useFavourites } from '@/features/favourite/hooks/use-favourites'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { useCommandStore } from '@/features/search/stores/use-command-store'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@links-base/ui/command'

export function Command() {
  const [mounted, setMounted] = React.useState(false)
  const { links, isLoading } = useLinks()
  const { favourites } = useFavourites()
  const { isOpen, setOpen } = useCommandStore()

  React.useEffect(() => {
    setMounted(true)
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!isOpen)
      }

      const num = parseInt(e.key)
      if (!isNaN(num) && (e.metaKey || e.ctrlKey) && num >= 1 && num <= 9) {
        e.preventDefault()
        const favorite = favourites[num - 1]
        if (favorite?.environments?.production) {
          window.open(favorite.environments.production, '_blank')
        }
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [favourites, isOpen, setOpen])

  // Create a Set of favorite names for efficient lookup
  const favoriteNames = new Set(favourites.map(fav => fav.name))

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null

  return (
    <>
      <CommandDialog open={isOpen} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Favorites Section */}
          {favourites.length > 0 && (
            <>
              <CommandGroup heading="Pinned">
                {favourites.map((link, index) => (
                  <CommandItem
                    key={link.name}
                    onSelect={() => {
                      window.open(link.environments?.production, '_blank')
                      setOpen(false)
                    }}
                  >
                    <MiniLink link={link} shortcutNumber={index + 1} />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Categories Section */}
          {isLoading ? (
            <CommandItem>Loading links...</CommandItem>
          ) : (
            Object.entries(
              // Filter out favorited items from categories
              links
                .filter(link => !favoriteNames.has(link.name))
                .reduce(
                  (acc, link) => {
                    const category = link.category || DEFAULT_CATEGORY
                    return {
                      ...acc,
                      [category]: [...(acc[category] || []), link]
                    }
                  },
                  {} as Record<string, typeof links>
                )
            ).map(([category, categoryLinks]) => (
              <CommandGroup key={category} heading={category}>
                {categoryLinks.map(link => (
                  <CommandItem
                    key={link.name}
                    onSelect={() => {
                      window.open(link.environments?.production, '_blank')
                      setOpen(false)
                    }}
                  >
                    <MiniLink link={link} />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
