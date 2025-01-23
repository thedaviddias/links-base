import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RecentLinksStore {
  hasVisitedRecent: boolean
  recentLinks: string[]
  setHasVisitedRecent: () => void
  setRecentLinks: (links: string[]) => void
}

export const useRecentLinksStore = create<RecentLinksStore>()(
  persist(
    set => ({
      hasVisitedRecent: false,
      recentLinks: [],
      setHasVisitedRecent: () => set({ hasVisitedRecent: true }),
      setRecentLinks: links => set({ recentLinks: links })
    }),
    {
      name: 'recent-links-storage'
    }
  )
)
