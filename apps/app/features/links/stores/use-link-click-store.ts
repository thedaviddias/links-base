import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/constants/storage'
import { type LinkClickStore } from '@/features/links/types/link.types'

export const useLinkClickStore = create<LinkClickStore>()(
  persist(
    (set, get) => ({
      clickCounts: {},
      incrementClickCount: (
        linkId: string,
        linkData: { url: string; environment?: string }
      ) => {
        const existing = get().clickCounts[linkId]
        const currentCount = existing?.count || 0

        let url = linkData.url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `https://${url}`
        }

        set({
          clickCounts: {
            ...get().clickCounts,
            [linkId]: {
              url,
              environment: linkData.environment,
              count: currentCount + 1,
              lastClicked: new Date().toISOString()
            }
          }
        })
      },
      getClickCount: (linkId: string) => get().clickCounts[linkId]?.count || 0,
      resetClickCounts: () => set({ clickCounts: {} })
    }),
    {
      name: STORAGE_KEYS.LINK_CLICKS,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ clickCounts: state.clickCounts })
    }
  )
)
