'use client'

import { type ReactNode, createContext, useContext } from 'react'

import { type Environment } from '@/features/environment/types/environment.types'
import { useEnvironmentStore } from '@/features/links/hooks/environments/useEnvironmentStore'

interface EnvironmentsProviderProps {
  children: ReactNode
  currentEnvironment?: Environment
}

export const EnvironmentsContext = createContext<ReturnType<
  typeof useEnvironmentStore
> | null>(null)

export const EnvironmentsProvider = ({
  children,
  currentEnvironment
}: EnvironmentsProviderProps) => {
  const store = useEnvironmentStore()

  // Initialize store with props if provided
  if (currentEnvironment && !store.currentEnvironment) {
    store.setCurrentEnvironment(currentEnvironment)
  }

  return (
    <EnvironmentsContext.Provider value={store}>
      {children}
    </EnvironmentsContext.Provider>
  )
}

export const useEnvironments = () => {
  const context = useContext(EnvironmentsContext)
  if (!context) {
    throw new Error(
      'useEnvironments must be used within an EnvironmentsProvider'
    )
  }
  return context
}
