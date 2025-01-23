import { create } from 'zustand'

import { type Environment } from '@/features/environment/types/environment.types'
import { getSettingsJson } from '@/features/setup/utils/load-json-data'

interface EnvironmentState {
  currentEnvironment: Environment | null
  availableEnvironments: Environment[]
  isLoading: boolean
  error: string | null
  setCurrentEnvironment: (environment: Environment) => void
  initializeEnvironments: () => Promise<void>
}

export const useEnvironmentStore = create<EnvironmentState>(set => ({
  currentEnvironment: null,
  availableEnvironments: [],
  isLoading: true,
  error: null,

  setCurrentEnvironment: environment => {
    set({ currentEnvironment: environment })
  },

  initializeEnvironments: async () => {
    try {
      set({ isLoading: true, error: null })
      const settings = await getSettingsJson()

      if (!settings?.environments?.configuration?.order) {
        set({
          currentEnvironment: null,
          availableEnvironments: [],
          error: 'No environments configured'
        })
        return
      }

      const environments = settings.environments.configuration.order

      set({
        currentEnvironment: environments[0] || null,
        availableEnvironments: environments,
        error: null
      })
    } catch (error) {
      set({
        error: 'Failed to load environments',
        currentEnvironment: null,
        availableEnvironments: []
      })
    } finally {
      set({ isLoading: false })
    }
  }
}))

// Initialize environments when the store is first created
void useEnvironmentStore.getState().initializeEnvironments()
