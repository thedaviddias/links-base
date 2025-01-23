'use client'

import { forwardRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import { ArrowLeft, HelpCircle, X } from 'lucide-react'

import { AccessTypeField } from '@/components/forms/fields/access-type-field'
import { CategoryField } from '@/components/forms/fields/category-field'
import { ColorField } from '@/components/forms/fields/color-field'
import { DescriptionField } from '@/components/forms/fields/description-field'
import { InstructionsField } from '@/components/forms/fields/instructions-field'
import { NameField } from '@/components/forms/fields/name-field'
import { TagsField } from '@/components/forms/fields/tags-field'
import { UrlField } from '@/components/forms/fields/url-field'

import { DEFAULT_COLOR } from '@/constants'
import { ROUTES } from '@/constants/routes'
import { getInitialValues } from '@/features/links/constants/link-form'
import { useLinkFormStore } from '@/features/links/hooks/links/link-form-store'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { type LinksApp } from '@/features/links/types/link.types'
import { useSettings } from '@/features/settings/hooks/use-settings'
import { type Settings } from '@/features/settings/types/settings.types'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@links-base/ui/alert-dialog'
import { Button } from '@links-base/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { useToast } from '@links-base/ui/hooks'
import { Input } from '@links-base/ui/input'
import { Switch } from '@links-base/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'

interface LinkFormProps {
  params: {
    action: 'add' | 'edit'
  }
}

const hasEnabledEnvironments = (settings: Settings | null): boolean => {
  if (!settings) return false

  return (
    settings.environments.configuration.enabled.filter(
      env => env !== 'production'
    ).length > 0
  )
}

const hasDisabledEnvironmentsData = (
  formData: Partial<LinksApp>,
  settings: Settings | null
) => {
  if (!settings || !formData.environments) return false

  // Only check for disabled environments that have non-empty values
  return settings.environments.configuration.order
    .filter(
      env =>
        env !== 'production' &&
        !settings.environments.configuration.enabled.includes(env)
    )
    .some(env => {
      const value =
        formData.environments?.[env as keyof typeof formData.environments]
      return value && value.trim() !== ''
    })
}

const LinkForm = forwardRef((props: LinkFormProps) => {
  const router = useRouter()
  const { settings } = useSettings()
  const { formData, resetForm, updateField, setFormData, originalName } =
    useLinkFormStore()
  const { addLink, editLink } = useLinks()
  const { toast } = useToast()
  const isEdit = props.params.action === 'edit'
  const [hasMultipleEnvs, setHasMultipleEnvs] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)

  const form = useForm<LinksApp>({
    defaultValues: getInitialValues(formData),
    values: formData as LinksApp
  })

  useEffect(() => {
    const subscription = form.watch(formValues => {
      const updatedData = {
        ...formData,
        ...formValues
      }
      setFormData(updatedData as Partial<LinksApp>)
    })

    return () => subscription.unsubscribe()
  }, [form, setFormData, formData])

  useEffect(() => {
    if (formData.environments) {
      const hasOtherEnvs = Boolean(
        formData.environments.staging || formData.environments.integration
      )
      setHasMultipleEnvs(hasOtherEnvs)
    }
  }, [formData.environments])

  const onSubmit = async (data: LinksApp) => {
    try {
      const submissionData: LinksApp = {
        ...data,
        createdAt: formData.createdAt || new Date().toISOString(),
        timestamp: new Date().toISOString(),
        color: data.color || DEFAULT_COLOR,
        category: data.category,
        environments: {
          production: data.environments?.production?.trim() || '',
          staging: data.environments?.staging?.trim() || '',
          integration: data.environments?.integration?.trim() || ''
        },
        description: data.description || '',
        tags: data.tags || [],
        accessType: data.accessType || 'public',
        instructions: data.instructions || ''
      }

      let success = false

      if (isEdit && originalName) {
        success = await editLink(originalName, submissionData)
      } else {
        success = await addLink(submissionData)
      }

      if (success) {
        toast({
          title: isEdit ? 'Link Updated' : 'Link Created',
          description: isEdit
            ? 'Your link has been updated successfully.'
            : 'Your new link has been created successfully.'
        })
        resetForm()
        router.push(ROUTES.ADMIN.MANAGE.LINKS.path)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEdit ? 'update' : 'create'} link. Please try again.`,
        variant: 'destructive'
      })
    }
  }

  const showEnvironmentsSwitch = hasEnabledEnvironments(settings || null)
  const hasDisabledData = hasDisabledEnvironmentsData(
    formData,
    settings || null
  )

  const handleEnvironmentsToggle = (checked: boolean) => {
    if (!checked && hasMultipleEnvs) {
      setShowDisableDialog(true)
    } else {
      setHasMultipleEnvs(checked)
    }
  }

  const handleConfirmDisable = () => {
    setHasMultipleEnvs(false)
    setShowDisableDialog(false)
  }

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(ROUTES.ADMIN.MANAGE.LINKS.path)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Links
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? 'Edit Link' : 'Add New Link'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? 'Update the details of your existing link.'
              : 'Create a new link to add to your collection.'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="max-w-[600px] space-y-8">
              {/* Essential Information Section */}
              <section className="space-y-6">
                <div className="flex flex-col space-y-3">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Essential Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* URL Configuration */}
                  <div className="space-y-4">
                    <UrlField
                      form={form}
                      showMultipleEnvs={hasMultipleEnvs}
                      settings={settings || undefined}
                    />

                    {/* Brand Color */}
                    <ColorField form={form} />

                    {showEnvironmentsSwitch ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <label
                              htmlFor="multiple-environments"
                              className="text-sm font-medium"
                            >
                              Multiple Environments
                            </label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Enable this if your link has different URLs
                                  for staging/development
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Switch
                            id="multiple-environments"
                            checked={hasMultipleEnvs}
                            onCheckedChange={handleEnvironmentsToggle}
                          />
                        </div>

                        {/* Only show when environments are disabled in settings AND have values */}
                        {hasDisabledData && (
                          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                            <p>
                              Some environment URLs are currently disabled in
                              settings. Enable them in settings to edit these
                              values.
                            </p>
                          </div>
                        )}
                      </>
                    ) : hasDisabledData ? (
                      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                        <p>
                          Some environment URLs are currently disabled in
                          settings. Enable them in settings to edit these
                          values.
                        </p>
                      </div>
                    ) : null}

                    {/* Additional Environment URLs */}
                    {hasMultipleEnvs && showEnvironmentsSwitch && (
                      <div className="space-y-4 border-l-2 border-muted pl-4">
                        <div className="max-w-[600px]">
                          {settings?.environments.configuration.order
                            .filter(
                              env =>
                                env !== 'production' &&
                                settings.environments.configuration.enabled.includes(
                                  env
                                )
                            )
                            .map(env => (
                              <FormField
                                key={env}
                                control={form.control}
                                name={`environments.${env}`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {
                                        settings.environments.display.labels[
                                          env
                                        ]
                                      }{' '}
                                      URL
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          {...field}
                                          placeholder={`https://${env}.example.com`}
                                          onChange={e => {
                                            field.onChange(e.target.value)
                                            updateField(
                                              `environments.${env}`,
                                              e.target.value
                                            )
                                          }}
                                          className="border-l-4 pr-8"
                                          style={{
                                            borderLeftColor:
                                              settings.environments.display
                                                .colors[env]
                                          }}
                                        />
                                        {field.value && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                                            onClick={() => {
                                              field.onChange('')
                                              updateField(
                                                `environments.${env}`,
                                                ''
                                              )
                                            }}
                                          >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">
                                              Clear {env} URL
                                            </span>
                                          </Button>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Show disabled environment values in read-only mode */}
                    {hasDisabledData &&
                      !settings?.environments.configuration.enabled.includes(
                        'staging'
                      ) && (
                        <div className="space-y-4 border-l-2 border-muted pl-4 opacity-70">
                          <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                            <p>
                              Some environment URLs are currently disabled in
                              settings. Enable them in settings to edit these
                              values.
                            </p>
                          </div>
                          <div className="max-w-[600px]">
                            {settings?.environments.configuration.order
                              .filter(
                                env =>
                                  env !== 'production' &&
                                  !settings.environments.configuration.enabled.includes(
                                    env
                                  ) &&
                                  formData.environments?.[env]
                              )
                              .map(env => (
                                <FormItem key={env}>
                                  <FormLabel className="flex items-center space-x-2">
                                    <span>
                                      {
                                        settings.environments.display.labels[
                                          env
                                        ]
                                      }{' '}
                                      URL
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      (disabled)
                                    </span>
                                  </FormLabel>
                                  <Input
                                    value={formData.environments?.[env]}
                                    disabled
                                    className="border-l-4 opacity-50"
                                    style={{
                                      borderLeftColor:
                                        settings.environments.display.colors[
                                          env
                                        ]
                                    }}
                                  />
                                </FormItem>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Name Field */}
                  <NameField form={form} />

                  {/* Description Field */}
                  <DescriptionField
                    form={form}
                    generateFrom={{
                      fields: ['environments.production', 'name'],
                      validate: ([url, name]) => Boolean(url || name)
                    }}
                  />

                  {/* Category Field */}
                  <CategoryField form={form} mode={props.params.action} />

                  {/* Tags Field */}
                  <TagsField form={form} />
                </div>
              </section>

              {/* Access Configuration Section */}
              <section className="space-y-6">
                <div className="flex flex-col space-y-3">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Access Configuration
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="max-w-[400px]">
                    <AccessTypeField form={form} />
                  </div>

                  <div className="max-w-[600px]">
                    <InstructionsField form={form} />
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="sticky bottom-0 flex items-center justify-end space-x-4 border-t bg-background py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ROUTES.ADMIN.MANAGE.LINKS.path)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEdit ? 'Save Changes' : 'Create Link'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {showDisableDialog && (
        <AlertDialog
          open={showDisableDialog}
          onOpenChange={setShowDisableDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Disable Multiple Environments?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This link has environment URLs configured. Disabling multiple
                environments will hide these URLs, but their values will be
                preserved. You can re-enable multiple environments later to
                access these values again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDisable}>
                Disable
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
})

LinkForm.displayName = 'LinkForm'

export default LinkForm
