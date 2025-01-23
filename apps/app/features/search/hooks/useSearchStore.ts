import { useContext } from 'react'

import { useStore } from 'zustand'

import { SearchContext } from '@/features/search/context/SearchContext'
import type { SearchStore } from '@/features/search/stores/searchStore'

export const useSearchStore = <T>(selector: (state: SearchStore) => T) => {
  const store = useContext(SearchContext)
  if (!store) {
    throw new Error('useSearchStore must be used within a SearchProvider')
  }
  return useStore(store, selector)
}
