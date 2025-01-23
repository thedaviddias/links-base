import { useEffect } from 'react'

import { STORAGE_KEYS } from '@/constants/storage'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { useLinks } from '../../links/hooks/links/use-links'

export function useCategoryNotifications() {
  const { links } = useLinks()
  const { hiddenCategories, newLinksInHiddenCategories } =
    useUserSettingsStore()

  useEffect(() => {
    if (!links) return

    // Get last check timestamp from localStorage
    const lastCheck = localStorage.getItem(STORAGE_KEYS.LAST_CATEGORY_CHECK)
    const now = Date.now()

    // Update counters for new links in hidden categories
    links.forEach(link => {
      if (
        hiddenCategories.includes(link.category) &&
        new Date(link.timestamp).getTime() >
          (lastCheck ? parseInt(lastCheck) : 0)
      ) {
        useUserSettingsStore.setState(state => ({
          newLinksInHiddenCategories: {
            ...state.newLinksInHiddenCategories,
            [link.category]:
              (state.newLinksInHiddenCategories[link.category] || 0) + 1
          }
        }))
      }
    })

    // Update last check timestamp
    localStorage.setItem(STORAGE_KEYS.LAST_CATEGORY_CHECK, now.toString())
  }, [links, hiddenCategories])

  return { newLinksInHiddenCategories }
}
