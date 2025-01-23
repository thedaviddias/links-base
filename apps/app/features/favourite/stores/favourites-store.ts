import { persist } from 'zustand/middleware'
import { type StoreApi, createStore } from 'zustand/vanilla'

import type { LinksApp } from '@/features/links/types/link.types'

export type FavouritesState = {
  favourites: LinksApp[]
}

export type FavouritesActions = {
  addFavourite: (webApp: LinksApp) => void
  removeFavourite: (appName: string) => void
  setFavourites: (webApps: LinksApp[]) => void
}

export type FavouritesStore = FavouritesState & FavouritesActions

const defaultInitState: FavouritesState = {
  favourites: []
}

export const createFavouritesStore = (
  initState: FavouritesState = defaultInitState
): StoreApi<FavouritesStore> => {
  return createStore<FavouritesStore>()(
    persist(
      set => ({
        ...initState,
        addFavourite: (webApp: LinksApp) =>
          set(state => {
            if (state.favourites.find(fav => fav.name === webApp.name)) {
              return state
            }
            return { favourites: [...state.favourites, webApp] }
          }),
        removeFavourite: (appName: string) =>
          set(state => ({
            favourites: state.favourites.filter(fav => fav.name !== appName)
          })),
        setFavourites: (webApps: LinksApp[]) =>
          set(() => ({
            favourites: webApps
          }))
      }),
      {
        name: 'favourites-store'
      }
    )
  )
}
