import { type ReactNode, createContext, useRef } from 'react'

import { type StoreApi } from 'zustand/vanilla'

import {
  type FavouritesState,
  type FavouritesStore,
  createFavouritesStore
} from '@/features/favourite/stores/favourites-store'

export const FavouritesContext =
  createContext<StoreApi<FavouritesStore> | null>(null)

type FavouritesProviderProps = {
  children: ReactNode
} & Partial<FavouritesState>

export const FavouritesProvider = ({
  children,
  ...props
}: FavouritesProviderProps) => {
  const storeRef = useRef<StoreApi<FavouritesStore>>()

  if (!storeRef.current) {
    const initialState: FavouritesState = {
      favourites: props.favourites ?? []
    }
    storeRef.current = createFavouritesStore(initialState)
  }

  return (
    <FavouritesContext.Provider value={storeRef.current}>
      {children}
    </FavouritesContext.Provider>
  )
}
