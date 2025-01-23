import { type ReactNode, createContext, useRef } from 'react'

import { type StoreApi } from 'zustand'

import {
  type SearchState,
  type SearchStore,
  createSearchStore
} from '@/features/search/stores/searchStore'

export const SearchContext = createContext<StoreApi<SearchStore> | null>(null)

type SearchProviderProps = {
  children: ReactNode
} & Partial<SearchState>

export const SearchProvider = ({ children, ...props }: SearchProviderProps) => {
  const storeRef = useRef<StoreApi<SearchStore>>()

  if (!storeRef.current) {
    const initialState: SearchState = {
      searchTerm: props.searchTerm ?? ''
    }
    storeRef.current = createSearchStore(initialState)
  }

  return (
    <SearchContext.Provider value={storeRef.current}>
      {children}
    </SearchContext.Provider>
  )
}
