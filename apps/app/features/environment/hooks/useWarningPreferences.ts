import { useLocalStorage } from 'usehooks-ts'

import { STORAGE_KEYS } from '@/constants/storage'

export type WarningKey =
  | typeof STORAGE_KEYS.HAS_SEEN_ENVIRONMENT_WARNING
  | typeof STORAGE_KEYS.HAS_SEEN_HIDDEN_CATEGORIES_ALERT

/**
 * Hook for managing warning preferences
 */
export function useWarningPreferences() {
  const [hasSeenEnvironmentWarning, setHasSeenEnvironmentWarning] =
    useLocalStorage(STORAGE_KEYS.HAS_SEEN_ENVIRONMENT_WARNING, false)
  const [hasSeenHiddenCategoriesAlert, setHasSeenHiddenCategoriesAlert] =
    useLocalStorage(STORAGE_KEYS.HAS_SEEN_HIDDEN_CATEGORIES_ALERT, false)

  const resetAllWarnings = () => {
    setHasSeenEnvironmentWarning(false)
    setHasSeenHiddenCategoriesAlert(false)
  }

  return {
    hasSeenEnvironmentWarning,
    setHasSeenEnvironmentWarning,
    hasSeenHiddenCategoriesAlert,
    setHasSeenHiddenCategoriesAlert,
    resetAllWarnings
  }
}
