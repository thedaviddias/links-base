import { useEffect, useState } from 'react'

import { STORAGE_KEYS } from '@/constants/storage'
import { type Category } from '@/features/links/types/category.types'
import { type LinksApp as LinkType } from '@/features/links/types/link.types'

interface UseHiddenCategoriesAlertProps {
  categories: Category[] | undefined
  links: LinkType[] | undefined
  hiddenCategories: string[]
}

/**
 * Hook to handle the hidden categories alert
 *
 * @param categories - The categories to check
 * @param links - The links to check
 * @param hiddenCategories - The hidden categories
 * @returns The show full alert state and the functions to handle the alert
 */
export const useHiddenCategoriesAlert = ({
  categories,
  links,
  hiddenCategories
}: UseHiddenCategoriesAlertProps) => {
  const [showFullAlert, setShowFullAlert] = useState(true)

  // Get hidden categories with links
  const hiddenCategoriesWithLinks =
    categories?.filter(
      cat =>
        hiddenCategories.includes(cat.name) &&
        links?.some(link => link.category === cat.name)
    ) || []

  useEffect(() => {
    // Check if user has seen the full alert before
    const hasSeenAlert = localStorage.getItem(
      STORAGE_KEYS.HAS_SEEN_HIDDEN_CATEGORIES_ALERT
    )
    setShowFullAlert(!hasSeenAlert)
  }, [])

  const handleDismissAlert = () => {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_HIDDEN_CATEGORIES_ALERT, 'true')
    setShowFullAlert(false)
  }

  return {
    showFullAlert,
    setShowFullAlert,
    hiddenCategoriesWithLinks,
    handleDismissAlert
  }
}
