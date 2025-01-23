import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/constants/storage'

export type CardSize = 'default' | 'compact'

interface CardSizeConfig {
  containerClasses: string
  imageClasses: string
  titleClasses: string
  padding: string
  contentClasses?: string
  descriptionClasses?: string
}

export interface CardSizeConfigs {
  default: CardSizeConfig
  compact: CardSizeConfig
}

export interface UserSettings {
  hiddenCategories: string[]
  newLinksInHiddenCategories: Record<string, number>
  cardSize: CardSize
  showGradients: boolean
  showDescriptions: boolean
  showTags: boolean
  cardSizeConfigs: CardSizeConfigs
  showFavorites: boolean
  showIcons: boolean
  showEnvironmentBadges: boolean
  setHiddenCategories: (categories: string[]) => void
  toggleHiddenCategory: (category: string) => void
  setCardSize: (size: CardSize) => void
  setShowGradients: (show: boolean) => void
  setShowDescriptions: (show: boolean) => void
  setShowTags: (show: boolean) => void
  setShowFavorites: (show: boolean) => void
  updateNewLinksCount: (category: string, count: number) => void
  resetNewLinksCount: (category: string) => void
  setShowIcons: (show: boolean) => void
  setShowEnvironmentBadges: (show: boolean) => void
  resetToDefaults: () => void
  previousDescriptionState: boolean
  previousTagsState: boolean
}

const defaultCardSizeConfigs: CardSizeConfigs = {
  default: {
    containerClasses: 'h-40',
    imageClasses: 'w-16 h-16',
    titleClasses: 'text-base',
    padding: 'p-4',
    contentClasses: 'gap-3',
    descriptionClasses: 'text-sm'
  },
  compact: {
    containerClasses: 'h-24',
    imageClasses: 'w-8 h-8',
    titleClasses: 'text-xs',
    padding: 'p-2',
    contentClasses: 'gap-1',
    descriptionClasses: 'text-xs'
  }
}

export const useUserSettingsStore = create<UserSettings>()(
  persist(
    (set, get) => ({
      hiddenCategories: [],
      newLinksInHiddenCategories: {},
      cardSize: 'default',
      showGradients: true,
      showDescriptions: true,
      showTags: true,
      showFavorites: true,
      showIcons: true,
      showEnvironmentBadges: true,
      cardSizeConfigs: defaultCardSizeConfigs,
      setHiddenCategories: categories => set({ hiddenCategories: categories }),
      toggleHiddenCategory: category =>
        set(state => ({
          hiddenCategories: state.hiddenCategories.includes(category)
            ? state.hiddenCategories.filter(c => c !== category)
            : [...state.hiddenCategories, category]
        })),
      setCardSize: size => {
        const state = get()
        if (size in defaultCardSizeConfigs) {
          if (size === 'compact') {
            if (state.cardSize === 'default') {
              set({
                cardSize: size,
                previousDescriptionState: state.showDescriptions,
                previousTagsState: state.showTags,
                showDescriptions: false,
                showTags: false
              })
            } else {
              set({
                cardSize: size,
                showDescriptions: false,
                showTags: false
              })
            }
          } else {
            set({
              cardSize: size,
              showDescriptions: state.previousDescriptionState,
              showTags: state.previousTagsState
            })
          }
        } else {
          set({ cardSize: 'default' })
        }
      },
      setShowGradients: show => set({ showGradients: show }),
      setShowDescriptions: show => set({ showDescriptions: show }),
      setShowTags: show => set({ showTags: show }),
      setShowFavorites: show => set({ showFavorites: show }),
      updateNewLinksCount: (category, count) =>
        set(state => ({
          newLinksInHiddenCategories: {
            ...state.newLinksInHiddenCategories,
            [category]: count
          }
        })),
      resetNewLinksCount: category =>
        set(state => {
          const newCounts = { ...state.newLinksInHiddenCategories }
          delete newCounts[category]
          return { newLinksInHiddenCategories: newCounts }
        }),
      setShowIcons: show => set({ showIcons: show }),
      setShowEnvironmentBadges: show => set({ showEnvironmentBadges: show }),
      resetToDefaults: () =>
        set(state => ({
          cardSize: state.cardSize,
          showGradients: true,
          showDescriptions: true,
          showTags: true,
          showIcons: true,
          showEnvironmentBadges: true,
          showFavorites: true,
          previousDescriptionState: true,
          previousTagsState: true
        })),
      previousDescriptionState: true,
      previousTagsState: true
    }),
    {
      name: STORAGE_KEYS.USER_SETTINGS,
      onRehydrateStorage: () => {
        return state => {
          if (!state) return
          state.cardSizeConfigs = defaultCardSizeConfigs
          if (!state.newLinksInHiddenCategories) {
            state.newLinksInHiddenCategories = {}
          }
        }
      }
    }
  )
)

// Update the helper function to be view-context aware
export const useNonDefaultSettings = () => {
  const settings = useUserSettingsStore()

  // Base checks that apply to all views
  const baseChecks = [
    settings.showGradients !== true,
    settings.showIcons !== true,
    settings.showEnvironmentBadges !== true,
    settings.showFavorites !== true
  ]

  // Only check description and tags if we're in default view
  if (settings.cardSize === 'default') {
    baseChecks.push(
      settings.showDescriptions !== true,
      settings.showTags !== true
    )
  }

  return baseChecks.some(check => check)
}
