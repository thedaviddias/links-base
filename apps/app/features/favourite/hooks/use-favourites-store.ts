import { useContext } from 'react'

import { useStore } from 'zustand'

import { FavouritesContext } from '@/features/favourite/context/FavouritesContext'
import type { FavouritesStore } from '@/features/favourite/stores/favourites-store'

export function useFavouritesStore<T>(
  selector: (state: FavouritesStore) => T
): T {
  const store = useContext(FavouritesContext)
  if (!store) {
    throw new Error('useFavourites must be used within a FavouritesProvider')
  }

  return useStore(store, selector)
}
