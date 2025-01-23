'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import settingsTemplate from '@/public/templates/settings.template.json'

import { LoadingSpinner } from '@/components/skeletons/loading-spinner'

import { ROUTES } from '@/constants/routes'
import { ErrorState } from '@/features/links/components/error'
import { useSettings } from '@/features/settings/hooks/use-settings'
import { SettingsSchema } from '@/features/settings/schemas/settings.schema'
import { type Settings } from '@/features/settings/types/settings.types'
import { useSetupStore } from '@/features/setup/stores/setupStore'

import { Button } from '@links-base/ui/button'
import { Form } from '@links-base/ui/form'

import { SettingsTabs } from './_components/settings-tabs'

// Type assertion to ensure the template matches the Settings type
const defaultValues = settingsTemplate as Settings

const SettingsPage = () => {
  const {
    settings,
    isLoading: isLoadingSettings,
    updateSettings,
    error: settingsError
  } = useSettings()
  const { isComplete } = useSetupStore()
  const router = useRouter()

  const form = useForm<Settings>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: settings || defaultValues
  })

  useEffect(() => {
    if (settings) {
      form.reset(settings)
    }
  }, [settings, form])

  useEffect(() => {
    if (!isComplete) {
      router.push(ROUTES.ADMIN.SETTINGS.path)
    }
  }, [isComplete, router])

  if (isLoadingSettings) {
    return <LoadingSpinner />
  }

  if (settingsError) {
    return <ErrorState error={settingsError} />
  }

  const onSubmit = async (data: Settings) => {
    await updateSettings(data)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(form.getValues().environments.configuration.order)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    form.setValue('environments.configuration.order', items, {
      shouldValidate: true
    })
  }

  const environmentOrder =
    form.getValues()?.environments?.configuration?.order ||
    defaultValues.environments.configuration.order

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your application settings and preferences
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <SettingsTabs
            form={form}
            environmentOrder={environmentOrder}
            onDragEnd={onDragEnd}
          />

          <div className="flex justify-end gap-4 border-t pt-6">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SettingsPage
