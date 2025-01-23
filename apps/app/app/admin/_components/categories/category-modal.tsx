'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { DescriptionField } from '@/components/forms/fields/description-field'

import { getIconComponent, suggestIconForCategory } from '@/utils/icon-mapping'

import { IconSelector } from '@/features/links/components/icon-selector'
import {
  CategorySchema,
  type InferCategorySchema
} from '@/features/links/schemas/category.schema'
import { type BaseModalProps } from '@/features/shared/types/modal.types'

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Input } from '@links-base/ui/input'

const DEFAULT_CATEGORY_VALUES: InferCategorySchema = {
  name: '',
  icon: 'Folder',
  description: ''
} as const

const ERROR_MESSAGES = {
  FAILED_ADD: 'Failed to add category',
  FAILED_EDIT: 'Failed to edit category',
  CATEGORY_EXISTS: (name: string) =>
    `A category with name "${name}" already exists`,
  VALIDATION_ERROR: 'Invalid category data'
} as const

const MODAL_CONTENT = {
  ADD: {
    title: 'Add Category',
    description: 'Add a new category.',
    buttonText: 'Add Category',
    loadingText: 'Adding...'
  },
  EDIT: {
    title: 'Edit Category',
    description: 'Edit an existing category.',
    buttonText: 'Save Changes',
    loadingText: 'Saving...'
  }
} as const

export type CategoryModalProps = BaseModalProps<InferCategorySchema>

/**
 * Modal component for adding or editing categories
 */
export const CategoryModal = ({
  mode = 'add',
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  trigger
}: CategoryModalProps) => {
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [hasManuallySelectedIcon, setHasManuallySelectedIcon] = useState(false)

  const form = useForm<InferCategorySchema>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialValues || DEFAULT_CATEGORY_VALUES
  })

  const { isSubmitting } = form.formState

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues)
    }
  }, [form, initialValues])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(DEFAULT_CATEGORY_VALUES)
      setIconSelectorOpen(false)
      setHasManuallySelectedIcon(false)
    }
    onOpenChange?.(open)
  }

  // Auto-suggest icon when name changes
  const watchName = form.watch('name')

  useEffect(() => {
    if (!hasManuallySelectedIcon && watchName?.trim()) {
      const suggestedIcon = suggestIconForCategory(watchName)
      form.setValue('icon', suggestedIcon)
    } else if (!watchName?.trim()) {
      form.setValue('icon', DEFAULT_CATEGORY_VALUES.icon)
      setHasManuallySelectedIcon(false)
    }
  }, [watchName, form, hasManuallySelectedIcon])

  const handleSubmit = useCallback(
    async (values: InferCategorySchema) => {
      try {
        await onSubmit(values)
        form.reset()
        onOpenChange?.(false)
        setHasManuallySelectedIcon(false)
      } catch (error) {
        form.setError('name', {
          type: 'manual',
          message:
            error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_ADD
        })
      }
    },
    [form, onSubmit, onOpenChange]
  )

  if (mode === 'add' && !trigger) {
    return null
  }

  const watchedIcon = form.watch('icon')
  const currentIcon = watchedIcon || 'Folder'
  const CurrentIcon = getIconComponent(currentIcon)

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      aria-labelledby="category-modal-title"
      aria-describedby="category-modal-description"
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="category-modal-title">
            {mode === 'add'
              ? MODAL_CONTENT.ADD.title
              : MODAL_CONTENT.EDIT.title}
          </DialogTitle>
          <DialogDescription id="category-modal-description">
            {mode === 'add'
              ? MODAL_CONTENT.ADD.description
              : MODAL_CONTENT.EDIT.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            data-testid="category-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        onClick={() => setIconSelectorOpen(true)}
                        data-testid="icon-selector-button"
                      >
                        <CurrentIcon className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Enter category name..."
                        {...field}
                        autoComplete="off"
                        data-testid="category-name-input"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DescriptionField
              form={form}
              maxLength={100}
              placeholder="Describe this category in a few words..."
            />

            <IconSelector
              onIconSelect={icon => {
                form.setValue('icon', icon)
                setIconSelectorOpen(false)
                setHasManuallySelectedIcon(true)
              }}
              open={iconSelectorOpen}
              onOpenChange={setIconSelectorOpen}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="category-submit-button"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === 'add'
                      ? MODAL_CONTENT.ADD.loadingText
                      : MODAL_CONTENT.EDIT.loadingText}
                  </span>
                ) : mode === 'add' ? (
                  MODAL_CONTENT.ADD.buttonText
                ) : (
                  MODAL_CONTENT.EDIT.buttonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
