import { type StoreApi, createStore } from 'zustand'
import { persist } from 'zustand/middleware'

import { type LinksApp } from '@/features/links/types/link.types'

export interface OrderedWebApps {
  orderedWebapps: Record<string, Record<string, LinksApp[]>>
}

export type LinksState = {
  activeDepartment: string
  hiddenCards: { category: string; cards: LinksApp[] }[]
} & OrderedWebApps

type LinksActions = {
  setActiveDepartment: (department: string) => void
  setHiddenCards: (
    hiddenCards: { category: string; cards: LinksApp[] }[]
  ) => void
  addHiddenCard: (category: string, card: LinksApp) => void
  removeHiddenCard: (category: string, cardName: string) => void
  setOrderedWebapps: (
    orderedWebapps: Record<string, Record<string, LinksApp[]>>
  ) => void
}

export type LinksStore = LinksState & LinksActions

const defaultInitState: LinksState = {
  activeDepartment: 'frontend',
  hiddenCards: [],
  orderedWebapps: {}
}

export const createLinksStore = (
  initState: LinksState = defaultInitState
): StoreApi<LinksStore> => {
  return createStore<LinksStore>()(
    persist(
      set => ({
        ...initState,
        setActiveDepartment: department =>
          set({ activeDepartment: department }),
        setHiddenCards: hiddenCards => set({ hiddenCards }),
        addHiddenCard: (category, card) => {
          set(state => {
            const currentHidden = state.hiddenCards.find(
              item => item.category === category
            )
            if (currentHidden) {
              const updatedHidden = state.hiddenCards.map(item =>
                item.category === category
                  ? { ...item, cards: [...item.cards, card] }
                  : item
              )
              return { hiddenCards: updatedHidden }
            } else {
              return {
                hiddenCards: [...state.hiddenCards, { category, cards: [card] }]
              }
            }
          })
        },
        removeHiddenCard: (category, cardName) => {
          set(state => {
            const updatedHidden = state.hiddenCards.map(item =>
              item.category === category
                ? {
                    ...item,
                    cards: item.cards.filter(card => card.name !== cardName)
                  }
                : item
            )
            return { hiddenCards: updatedHidden }
          })
        },
        setOrderedWebapps: orderedWebapps => set({ orderedWebapps })
      }),
      {
        name: 'links-store'
      }
    )
  )
}
