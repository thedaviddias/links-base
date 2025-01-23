'use client'

import { useEffect, useState } from 'react'

import { createFavouritesStore } from '@/features/favourite/stores/favourites-store'
import { type LinksApp } from '@/features/links/types/link.types'

import { useToast } from '@links-base/ui/hooks'
import { ToastAction } from '@links-base/ui/toast'

const MAX_FAVORITES = 8
const favouritesStore = createFavouritesStore()

export function useFavourites() {
  const [favourites, setFavourites] = useState<LinksApp[]>(
    favouritesStore.getState().favourites
  )
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = favouritesStore.subscribe(state => {
      setFavourites(state.favourites)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const addFavourite = (app: LinksApp) => {
    if (favourites.length >= MAX_FAVORITES) {
      toast({
        title: 'Maximum favorites reached',
        description: `You can only pin up to ${MAX_FAVORITES} links. Please remove some to add more.`,
        variant: 'destructive'
      })
      return
    }

    favouritesStore.getState().addFavourite(app)
    toast({
      title: 'Added to favorites',
      description: `${app.name} has been pinned to your favorites.`,
      duration: 5000,
      action: (
        <ToastAction altText="Undo" onClick={() => removeFavourite(app.name)}>
          Undo
        </ToastAction>
      )
    })
  }

  const removeFavourite = (appName: string) => {
    favouritesStore.getState().removeFavourite(appName)
    toast({
      title: 'Removed from favorites',
      description: `${appName} has been removed from your favorites.`,
      duration: 5000,
      action: (
        <ToastAction
          altText="Undo"
          onClick={() => {
            const app = favourites.find(fav => fav.name === appName)
            if (app) addFavourite(app)
          }}
        >
          Undo
        </ToastAction>
      )
    })
  }

  const isFavourite = (appName: string) => {
    return favourites.some(fav => fav.name === appName)
  }

  return {
    favourites,
    addFavourite,
    removeFavourite,
    isFavourite,
    maxFavorites: MAX_FAVORITES
  }
}
