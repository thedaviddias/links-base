'use client'

import { useCallback, useMemo } from 'react'

import { useLocalStorage } from 'usehooks-ts'

import { type LinksApp } from '@/features/links/types/link.types'

import { useLinks } from './links/use-links'

/** Return type for useFavorites hook */
export interface UseFavoritesReturn {
  favorites: LinksApp[]
  isFavorite: (name: string) => boolean
  toggleFavorite: (name: string) => void
  resetFavorites: () => void
}

/**
 * Custom hook for managing favorite links functionality
 */
export const useFavorites = (): UseFavoritesReturn => {
  const { links } = useLinks()
  const [favoriteNames, setFavoriteNames] = useLocalStorage<string[]>(
    'favorites',
    []
  )

  /**
   * Check if a link is marked as favorite
   */
  const isFavorite = useCallback(
    (name: string): boolean => {
      if (!name) return false
      return favoriteNames.includes(name)
    },
    [favoriteNames]
  )

  /**
   * Get all favorite links
   */
  const favorites = useMemo(() => {
    if (!links) return []
    return links.filter(link => link.name && isFavorite(link.name))
  }, [links, isFavorite])

  /**
   * Toggle favorite status for a link
   */
  const toggleFavorite = useCallback(
    (name: string): void => {
      if (!name) return

      setFavoriteNames(prev =>
        prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
      )
    },
    [setFavoriteNames]
  )

  /**
   * Reset all favorites
   */
  const resetFavorites = useCallback((): void => {
    setFavoriteNames([])
  }, [setFavoriteNames])

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    resetFavorites
  }
}
