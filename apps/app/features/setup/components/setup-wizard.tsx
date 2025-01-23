'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsIcon } from 'lucide-react'
import { motion } from 'motion/react'

import { CONFIG_KEYS } from '@/constants/storage'
import { useSettings } from '@/features/settings/hooks/use-settings'
import {
  type InferSettingsSchema,
  SettingsSchema
} from '@/features/settings/schemas/settings.schema'
import { type Settings } from '@/features/settings/types/settings.types'
import { useTemplate } from '@/features/setup/hooks/use-template'
import { useSetupStore } from '@/features/setup/stores/setupStore'
import { SETUP_STEPS } from '@/features/setup/types/types'
import { getSettingsJson } from '@/features/setup/utils/load-json-data'
import { clearFromStorage } from '@/features/storage/utils/local-storage'

import { Card } from '@links-base/ui/card'
import { Form } from '@links-base/ui/form'

import { BasicSettingsStep } from './steps/basic-settings-step'
import { RequestSettingsStep } from './steps/request-settings-step'
import { TemplateSettingsStep } from './steps/template-settings-step'
import { WelcomeStep } from './steps/welcome-step'

import { StepNavigation } from './step-navigation'

export const SetupWizard = () => {
  const router = useRouter()
  const { currentStep, setStep, markComplete } = useSetupStore()
  const { applyTemplateChoice } = useTemplate()
  const { settings, updateSettings } = useSettings({ suppressErrors: true })

  const [isSkipping, setIsSkipping] = useState(false)
  const [shouldUseTemplate, setShouldUseTemplate] = useState(false)
  const [useDefaultSettings, setUseDefaultSettings] = useState(false)
  const [templateChoice, setTemplateChoice] = useState<'template' | 'empty'>(
    'empty'
  )

  const form = useForm<InferSettingsSchema>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: settings || undefined
  })

  const handleSkip = async () => {
    if (!settings) return
    setIsSkipping(true)
    clearFromStorage(CONFIG_KEYS.links[0])
    await updateSettings(settings)
    markComplete()
    router.push('/')
    router.refresh()
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      try {
        const stepValid = await form.trigger([
          'general.name',
          'general.description'
        ])
        if (!stepValid) {
          return
        }
      } catch (error) {
        console.error('Error validating form:', error)
        return
      }
    }

    if (currentStep < SETUP_STEPS.length - 1) {
      setStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (useDefaultSettings) {
      setStep(0)
      setUseDefaultSettings(false)
    } else if (currentStep > 0) {
      setStep(currentStep - 1)
    }
  }

  const handleComplete = async (data: InferSettingsSchema) => {
    try {
      setIsSkipping(true)

      const templateSuccess = await applyTemplateChoice(shouldUseTemplate)
      if (!templateSuccess) {
        throw new Error('Failed to apply template')
      }

      clearFromStorage(CONFIG_KEYS.links[0])

      const settingsTemplate = await getSettingsJson()

      const settingsData: Settings = useDefaultSettings
        ? (settingsTemplate ?? ({} as Settings))
        : {
            general: {
              ...(settingsTemplate?.general ?? {}),
              ...data.general
            },
            links: {
              ...settingsTemplate?.links,
              ...data.links
            },
            environments: {
              ...settingsTemplate?.environments,
              ...data.environments
            },
            requests: {
              ...settingsTemplate?.requests,
              ...data.requests
            },
            help: {
              ...settingsTemplate?.help,
              ...data.help
            },
            services: {
              ...settingsTemplate?.services,
              ...data.services
            }
          }

      const updateSuccess = await updateSettings(settingsData)
      if (!updateSuccess) {
        throw new Error('Failed to update settings')
      }

      markComplete()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error completing setup:', error)
      setIsSkipping(false)
    }
  }

  const handleDefaultSettings = () => {
    setUseDefaultSettings(true)
    setShouldUseTemplate(false)
    setTemplateChoice('empty')
    setStep(3)
  }

  const handleTemplateChoice = (useTemplate: boolean) => {
    setShouldUseTemplate(useTemplate)
    setTemplateChoice(useTemplate ? 'template' : 'empty')
  }

  const getTotalSteps = () => {
    return useDefaultSettings ? 2 : SETUP_STEPS.length
  }

  const getCurrentDisplayStep = () => {
    if (useDefaultSettings) {
      return currentStep === 3 ? 2 : 1
    }
    return currentStep + 1
  }

  const isLastStep = () => {
    if (useDefaultSettings) {
      return currentStep === 3
    }
    return currentStep === SETUP_STEPS.length - 1
  }

  const getProgressPercentage = () => {
    const total = getTotalSteps()
    const current = getCurrentDisplayStep()
    return (current / total) * 100
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-2xl overflow-hidden">
        <div className="space-y-8 p-6 md:p-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <SettingsIcon className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Setup Wizard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {SETUP_STEPS[currentStep]?.description ||
                    'Complete the setup process'}
                </p>
              </div>
            </div>
            <div className="text-sm font-medium">
              Step {currentStep + 1} of {getTotalSteps()}
            </div>
          </header>

          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                if (isLastStep()) {
                  const formData = form.getValues()
                  await handleComplete(formData)
                }
              }}
              className="space-y-8"
            >
              {currentStep === 0 && (
                <WelcomeStep
                  form={form}
                  onSkip={handleSkip}
                  onNext={handleNext}
                  isSkipping={isSkipping}
                  onDefaultSettings={handleDefaultSettings}
                />
              )}
              {currentStep === 1 && <BasicSettingsStep form={form} />}
              {currentStep === 2 && (
                <RequestSettingsStep
                  form={form}
                  onNext={handleNext}
                  onBack={handleBack}
                  isSkipping={isSkipping}
                />
              )}
              {currentStep === 3 && (
                <TemplateSettingsStep
                  form={form}
                  onChoiceSelect={handleTemplateChoice}
                  onStepChange={setStep}
                  useDefaultSettings={useDefaultSettings}
                  defaultChoice={templateChoice}
                />
              )}

              <StepNavigation
                currentStep={currentStep}
                onBack={handleBack}
                onNext={handleNext}
                onComplete={() => handleComplete(form.getValues())}
                isSkipping={isSkipping}
                showBackButton={!useDefaultSettings || currentStep === 3}
                isLastStep={isLastStep()}
              />
            </form>
          </Form>
        </div>
        <DevTool control={form.control} />
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
      </Card>
    </div>
  )
}
