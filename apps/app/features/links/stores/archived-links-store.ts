import { persist } from 'zustand/middleware'
import { type StoreApi, createStore } from 'zustand/vanilla'

export type ArchivedLinksState = {
  archivedLinks: string[]
}

export type ArchivedLinksActions = {
  toggleArchived: (linkName: string) => void
  isArchived: (linkName: string) => boolean
  unarchiveAll: () => void
}

export type ArchivedLinksStore = ArchivedLinksState & ArchivedLinksActions

const defaultInitState: ArchivedLinksState = {
  archivedLinks: []
}

export const createArchivedLinksStore = (
  initState: ArchivedLinksState = defaultInitState
): StoreApi<ArchivedLinksStore> => {
  return createStore<ArchivedLinksStore>()(
    persist(
      (set, get) => ({
        ...initState,
        toggleArchived: (linkName: string) =>
          set(state => {
            const isCurrentlyArchived = state.archivedLinks.includes(linkName)
            return {
              archivedLinks: isCurrentlyArchived
                ? state.archivedLinks.filter(name => name !== linkName)
                : [...state.archivedLinks, linkName]
            }
          }),
        isArchived: (linkName: string) =>
          get().archivedLinks.includes(linkName),
        unarchiveAll: () => set({ archivedLinks: [] })
      }),
      {
        name: 'archived-links-store'
      }
    )
  )
}
