import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { IS_PRODUCTION } from '@/constants'
import { getJsonApiRoute } from '@/constants/routes'
import { checkRequiredFiles } from '@/features/setup/utils/setup-check'

interface SetupStore {
  isComplete: boolean
  currentStep: number
  isInitialized: boolean
  markComplete: () => void
  setStep: (step: number) => void
  resetSetup: () => void
  initializeFiles: () => Promise<boolean>
  initialize: () => Promise<void>
}

export const useSetupStore = create<SetupStore>()(
  persist(
    set => ({
      isComplete: IS_PRODUCTION ? true : false,
      currentStep: 0,
      isInitialized: false,
      markComplete: () => {
        if (IS_PRODUCTION) return
        set({ isComplete: true })
      },
      setStep: (step: number) => {
        if (IS_PRODUCTION) return
        set({ currentStep: step })
      },
      resetSetup: () => {
        if (IS_PRODUCTION) return
        set({ isComplete: false, currentStep: 0 })
      },
      initializeFiles: async () => {
        try {
          const response = await fetch(getJsonApiRoute(), {
            method: 'POST'
          })
          const data = await response.json()
          return data.success
        } catch (error) {
          console.error('Failed to initialize files:', error)
          return false
        }
      },
      initialize: async () => {
        if (IS_PRODUCTION) {
          set({ isComplete: true, isInitialized: true })
          return
        }

        const hasRequiredFiles = await checkRequiredFiles()

        if (!hasRequiredFiles) {
          const initialized = await useSetupStore.getState().initializeFiles()
          if (!initialized) {
            console.error('Failed to initialize required files')
            set({ isComplete: false, isInitialized: true })
            return
          }
        }

        set({
          isComplete: hasRequiredFiles || false,
          isInitialized: true
        })
      }
    }),
    {
      name: 'setup-storage'
    }
  )
)
