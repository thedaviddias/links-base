import { create } from 'zustand'

export type ChangeType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'chore'
  | 'style'
  | 'refactor'
  | 'perf'
  | 'test'

interface ChangeTypeFilterState {
  selectedTypes: ChangeType[]
  toggleType: (type: ChangeType) => void
  reset: () => void
}

export const useChangeTypeFilter = create<ChangeTypeFilterState>(set => ({
  selectedTypes: [],
  toggleType: type =>
    set(state => ({
      selectedTypes: state.selectedTypes.includes(type)
        ? state.selectedTypes.filter(t => t !== type)
        : [...state.selectedTypes, type]
    })),
  reset: () => set({ selectedTypes: [] })
}))
