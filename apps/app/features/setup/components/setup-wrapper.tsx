'use client'

import { useSetupStore } from '../stores/setupStore'

import { SetupWizard } from './setup-wizard'

export const SetupWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isComplete } = useSetupStore()

  if (!isComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <SetupWizard />
      </div>
    )
  }

  return <>{children}</>
}
