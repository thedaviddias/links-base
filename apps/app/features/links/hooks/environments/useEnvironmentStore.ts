'use client'

import { useEnvironmentStore as baseStore } from '@/features/links/stores/environment-store'

export const useEnvironmentStore = () => {
  const {
    currentEnvironment,
    availableEnvironments,
    setCurrentEnvironment,
    isLoading,
    error
  } = baseStore()

  return {
    currentEnvironment,
    availableEnvironments,
    setCurrentEnvironment,
    isLoading,
    error
  }
}

export default useEnvironmentStore
