import { type StoreApi, createStore } from 'zustand'

export type SearchState = {
  searchTerm: string
}

type SearchActions = {
  setSearchTerm: (term: string) => void
}

export type SearchStore = SearchState & SearchActions

const defaultInitState: SearchState = {
  searchTerm: ''
}

export const createSearchStore = (
  initState: SearchState = defaultInitState
): StoreApi<SearchStore> => {
  return createStore<SearchStore>()(set => ({
    ...initState,
    setSearchTerm: (term: string) => set({ searchTerm: term })
  }))
}
