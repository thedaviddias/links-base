'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'

import { CategoryField } from '@/components/forms/fields/category-field'
import { ColorField } from '@/components/forms/fields/color-field'
import { DescriptionField } from '@/components/forms/fields/description-field'
import { NameField } from '@/components/forms/fields/name-field'
import { TagsField } from '@/components/forms/fields/tags-field'
import { UrlField } from '@/components/forms/fields/url-field'

import { debouncedGetPageTitle } from '@/utils/url'

import { DEFAULT_COLOR } from '@/constants'
import { getInitialValues } from '@/features/links/constants/link-form'
import { useLinkFormStore } from '@/features/links/hooks/links/link-form-store'
import {
  type InferLinkSchema,
  LinkSchema
} from '@/features/links/schemas/link.schema'
import { type LinksApp } from '@/features/links/types/link.types'
import { useSettings } from '@/features/settings/hooks/use-settings'

import { Button } from '@links-base/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@links-base/ui/dialog'
import { Form } from '@links-base/ui/form'
import { Tooltip, TooltipContent, TooltipTrigger } from '@links-base/ui/tooltip'

interface LinkModalProps {
  mode: 'add' | 'edit'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LinksApp) => void
  initialValues?: LinksApp
}

export function LinkModal({
  mode,
  open,
  onOpenChange,
  onSubmit,
  initialValues
}: LinkModalProps) {
  const { settings } = useSettings()
  const router = useRouter()
  const { setFormData, resetForm, setMode, setOriginalName } =
    useLinkFormStore()

  const form = useForm<InferLinkSchema>({
    resolver: zodResolver(LinkSchema),
    defaultValues: getInitialValues(initialValues)
  })

  const { isSubmitting, errors } = form.formState

  const [isNameLoading, setIsNameLoading] = useState(false)
  const previousUrl = useRef<string>('')
  const loadingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues)
      setOriginalName(initialValues.name)
    }
  }, [initialValues, setFormData, setOriginalName])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      resetForm()
    }
    onOpenChange(open)
  }

  function onSubmitForm(values: InferLinkSchema) {
    try {
      const submissionData: LinksApp = {
        ...values,
        category: values.category,
        color: values.color || DEFAULT_COLOR,
        environments: {
          production: values.environments.production.trim(),
          staging: values.environments.staging?.trim(),
          integration: values.environments.integration?.trim()
        },
        description: values.description,
        tags: values.tags,
        accessType: values.accessType || 'public',
        instructions: values.instructions || '',
        createdAt: initialValues?.createdAt || new Date().toISOString(),
        timestamp: new Date().toISOString()
      }

      onSubmit(submissionData)
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleAdvancedEdit = () => {
    const currentValues = form.getValues()

    setFormData({
      ...currentValues,
      category: currentValues.category,
      accessType: currentValues.accessType || 'public',
      instructions: currentValues.instructions || '',
      color: currentValues.color || DEFAULT_COLOR,
      createdAt: initialValues?.createdAt || new Date().toISOString(),
      timestamp: new Date().toISOString()
    })
    setMode(mode)
    onOpenChange(false)
    router.push(`/admin/links/${mode}`)
  }

  const hasAdvancedFields = () => {
    const values = form.getValues()
    return !!(
      values.environments?.staging ||
      values.environments?.integration ||
      values.instructions ||
      values.accessType !== 'public'
    )
  }

  /** Handle URL changes and auto-populate the name field */
  const handleUrlChange = useCallback(
    async (url: string) => {
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }

      // Reset loading state and return if URL is empty
      if (!url) {
        setIsNameLoading(false)
        previousUrl.current = ''
        return
      }

      // Don't fetch if we already have a name (in edit mode)
      if (mode === 'edit' && initialValues?.name) return

      // Don't fetch if URL hasn't changed
      if (url === previousUrl.current) return

      previousUrl.current = url
      setIsNameLoading(true)

      try {
        const title = await debouncedGetPageTitle(url)

        // Only update if the URL hasn't changed during the fetch
        if (url === previousUrl.current && title) {
          form.setValue('name', title)
        }
      } catch (error) {
        console.error('Error setting page title:', error)
      } finally {
        // Set a small delay before hiding the loading indicator
        loadingTimeoutRef.current = setTimeout(() => {
          if (url === previousUrl.current) {
            setIsNameLoading(false)
          }
        }, 300)
      }
    },
    [form, mode, initialValues?.name]
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <div className="min-w-0 flex-1 truncate text-left">Add Link</div>
          <kbd className="hidden rounded bg-gray-700 px-2 py-0.5 text-xs font-light text-gray-400 transition-all duration-75 group-hover:bg-gray-600 group-hover:text-gray-300 md:inline-block">
            C
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Link' : 'Edit Link'}</DialogTitle>
          <DialogDescription>
            Add a new link to your collection. For advanced options like
            multiple environments, use Advanced Edit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-6"
          >
            {/* Form Errors Display */}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
                Please fill in all required fields
              </div>
            )}

            {/* Essential Fields Section */}
            <div className="space-y-4">
              {/* URL Field */}
              <UrlField
                form={form}
                showMultipleEnvs={false}
                settings={settings || undefined}
                initialValues={initialValues}
                onUrlChange={handleUrlChange}
              />

              {/* Brand Color */}
              <ColorField form={form} />

              {/* Name Field */}
              <NameField
                form={form}
                autoPopulated={mode === 'add'}
                isLoading={isNameLoading}
              />

              {/* Auto-generated Description */}
              <DescriptionField
                form={form}
                generateFrom={{
                  fields: ['environments.production', 'name'],
                  validate: ([url, name]) => Boolean(url || name)
                }}
              />

              {/* Category Field */}
              <CategoryField form={form} mode={mode} />

              {/* Tags Field */}
              <TagsField form={form} />
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAdvancedEdit}
                  className="flex items-center gap-2"
                >
                  Advanced Edit
                  {hasAdvancedFields() && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Info className="h-4 w-4 text-blue-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Additional information available in advanced view</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                {isSubmitting
                  ? 'Submitting...'
                  : mode === 'add'
                    ? 'Add Link'
                    : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
