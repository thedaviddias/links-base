import { Settings, Zap } from 'lucide-react'
import { motion } from 'motion/react'

import { useSetupStore } from '@/features/setup/stores/setupStore'

import { Card } from '@links-base/ui/card'

import { type StepProps } from '../../types/types'

interface WelcomeStepProps extends StepProps {
  onNext?: () => void
  isSkipping?: boolean
  onDefaultSettings?: () => void
}

export const WelcomeStep = ({
  onNext,
  isSkipping,
  onDefaultSettings
}: WelcomeStepProps) => {
  const { setStep } = useSetupStore()

  const handleConfigureStepByStep = () => {
    setStep(1)
    onNext?.()
  }

  const handleCopyTemplate = async () => {
    if (onDefaultSettings) {
      onDefaultSettings()
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight">
        Welcome to Links Base
      </h2>
      <p className="text-muted-foreground">
        Before using Links Base, you have to choose how you&apos;d like to set
        up your application:
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            className={`h-full cursor-pointer p-6 transition-colors hover:bg-primary hover:text-primary-foreground ${
              isSkipping ? 'pointer-events-none opacity-50' : ''
            }`}
            role="button"
            tabIndex={0}
            onClick={handleCopyTemplate}
          >
            <div className="flex h-full flex-col">
              <Zap className="mb-4 h-8 w-8" />
              <h3 className="mb-2 text-lg font-semibold">
                Use default settings
              </h3>
              <p className="flex-grow text-sm text-muted-foreground">
                Get started quickly with our recommended configuration.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            className="h-full cursor-pointer p-6 transition-colors hover:bg-primary hover:text-primary-foreground"
            role="button"
            tabIndex={0}
            onClick={handleConfigureStepByStep}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleConfigureStepByStep()
              }
            }}
          >
            <div className="flex h-full flex-col">
              <Settings className="mb-4 h-8 w-8" />
              <h3 className="mb-2 text-lg font-semibold">
                Configure step by step
              </h3>
              <p className="flex-grow text-sm text-muted-foreground">
                Customize every aspect of your setup for full control (you can
                always change it later).
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
