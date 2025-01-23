'use client'

import { useEffect, useRef } from 'react'

import { useSearchParams } from 'next/navigation'

import { useFavourites } from '@/features/favourite/hooks/use-favourites'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { toast } from '@links-base/ui/hooks'

import { type LinksApp } from '../types/link.types'

import { useArchivedLinks } from './use-archived-links'

export const useShareView = (links: LinksApp[]) => {
  const searchParams = useSearchParams()
  const { addFavourite, isFavourite } = useFavourites()
  const { isArchived, toggleArchived } = useArchivedLinks()
  const { setHiddenCategories } = useUserSettingsStore()
  const initialized = useRef(false)

  // Parse URL parameters
  const urlFavorites =
    searchParams.get('favorites')?.split(',').filter(Boolean) || []
  const urlArchivedLinks =
    searchParams.get('archivedLinks')?.split(',').filter(Boolean) || []
  const urlHiddenCategories =
    searchParams.get('hidden')?.split(',').filter(Boolean) || []

  useEffect(() => {
    if (!links || initialized.current) return

    const initializeSharedState = () => {
      // Get all link names and categories from the system
      const allLinkNames = links.map(link => link.name)
      const allCategories = Array.from(
        links
          .map(link => link.category)
          .reduce((set, cat) => set.add(cat), new Set<string>())
      )

      // Handle favorites from URL
      if (urlFavorites.length > 0) {
        // Check existence against all links
        const nonExistentFavorites = urlFavorites.filter(
          favName => !allLinkNames.includes(favName)
        )

        // Add valid favorites
        const validFavorites = urlFavorites.filter(favName =>
          allLinkNames.includes(favName)
        )

        // Batch favorite updates
        validFavorites.forEach(favorite => {
          const favoriteLink = links.find(link => link.name === favorite)
          if (favoriteLink && !isFavourite(favorite)) {
            addFavourite(favoriteLink)
          }
        })

        // Show warning only for truly non-existent links
        if (nonExistentFavorites.length > 0) {
          toast({
            variant: 'destructive',
            title: 'Some favorited links no longer exist',
            description: `The following links were removed from the system: ${nonExistentFavorites.join(', ')}`
          })
        }
      }

      // Handle archived links from URL
      if (urlArchivedLinks.length > 0) {
        // Check existence against all links
        const nonExistentArchivedLinks = urlArchivedLinks.filter(
          archName => !allLinkNames.includes(archName)
        )

        // Archive valid links
        const validArchivedLinks = urlArchivedLinks.filter(archName =>
          allLinkNames.includes(archName)
        )

        // Batch archive updates
        validArchivedLinks.forEach(archivedLink => {
          if (!isArchived(archivedLink)) {
            toggleArchived(archivedLink)
          }
        })

        // Show warning only for truly non-existent links
        if (nonExistentArchivedLinks.length > 0) {
          toast({
            variant: 'destructive',
            title: 'Some archived links no longer exist',
            description: `The following links were removed from the system: ${nonExistentArchivedLinks.join(', ')}`
          })
        }
      }

      // Handle hidden categories from URL
      if (urlHiddenCategories.length > 0) {
        // Validate categories
        const validHiddenCategories = urlHiddenCategories.filter(cat =>
          allCategories.includes(cat)
        )

        // Set hidden categories
        if (validHiddenCategories.length > 0) {
          setHiddenCategories(validHiddenCategories)
        }

        // Show warning for invalid categories
        const nonExistentCategories = urlHiddenCategories.filter(
          cat => !allCategories.includes(cat)
        )

        if (nonExistentCategories.length > 0) {
          toast({
            variant: 'destructive',
            title: 'Some categories no longer exist',
            description: `The following categories were removed from the system: ${nonExistentCategories.join(', ')}`
          })
        }
      }
    }

    initializeSharedState()
    initialized.current = true
  }, [links]) // Only run when links change and on mount
}
