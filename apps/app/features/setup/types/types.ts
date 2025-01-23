import { type UseFormReturn } from 'react-hook-form'

import { type InferSettingsSchema } from '@/features/settings/schemas/settings.schema'

export interface StepProps {
  form: UseFormReturn<InferSettingsSchema>
  onNext?: () => void
  onBack?: () => void
  onSkip?: () => void
  isSkipping?: boolean
}

export interface Step {
  title: string
  description: string
}

export const SETUP_STEPS: Step[] = [
  { title: 'Welcome', description: 'Welcome to the setup wizard' },
  { title: 'Basic Settings', description: 'Configure your application basics' },
  { title: 'Request Settings', description: 'Configure link request options' },
  { title: 'Template Setup', description: 'Choose your initial data setup' }
]
