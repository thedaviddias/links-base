'use client'

import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import {
  type InferTagSchema,
  TagSchema
} from '@/features/links/schemas/tag.schema'
import { type Tag } from '@/features/links/types/tag.types'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@links-base/ui/form'
import { Input } from '@links-base/ui/input'

export type TagModalProps = BaseModalProps<Tag>

const DEFAULT_TAG_VALUES: InferTagSchema = {
  name: ''
}

const ERROR_MESSAGES = {
  FAILED_ADD: 'Failed to add tag',
  FAILED_EDIT: 'Failed to edit tag',
  TAG_EXISTS: (name: string) => `A tag with name "${name}" already exists`,
  VALIDATION_ERROR: 'Invalid tag name'
} as const

const MODAL_CONTENT = {
  ADD: {
    title: 'Add Tag',
    description: 'Add a new tag.',
    buttonText: 'Add Tag',
    loadingText: 'Adding...'
  },
  EDIT: {
    title: 'Edit Tag',
    description: 'Edit an existing tag.',
    buttonText: 'Save Changes',
    loadingText: 'Saving...'
  }
} as const

/**
 * A modal for adding or editing tags.
 */
export const TagModal = ({
  mode = 'add',
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  trigger
}: TagModalProps) => {
  const form = useForm<InferTagSchema>({
    resolver: zodResolver(TagSchema),
    defaultValues: initialValues || DEFAULT_TAG_VALUES
  })

  const { isSubmitting } = form.formState

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues)
    }
  }, [form, initialValues])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(DEFAULT_TAG_VALUES)
    }
    onOpenChange?.(open)
  }

  const handleSubmit = useCallback(
    async (values: Tag) => {
      try {
        await onSubmit(values)
        form.reset()
      } catch (error) {
        form.setError('name', {
          type: 'manual',
          message:
            error instanceof Error
              ? error.message
              : mode === 'add'
                ? ERROR_MESSAGES.FAILED_ADD
                : ERROR_MESSAGES.FAILED_EDIT
        })
      }
    },
    [form, mode, onSubmit]
  )

  if (mode === 'add' && !trigger) {
    return null
  }

  const wrappedTrigger = trigger ? (
    <div onClick={() => console.log('Trigger clicked')}>{trigger}</div>
  ) : (
    trigger
  )

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      aria-labelledby="tag-modal-title"
      aria-describedby="tag-modal-description"
    >
      <DialogTrigger asChild>{wrappedTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="tag-modal-title">
            {mode === 'add'
              ? MODAL_CONTENT.ADD.title
              : MODAL_CONTENT.EDIT.title}
          </DialogTitle>
          <DialogDescription id="tag-modal-description">
            {mode === 'add'
              ? MODAL_CONTENT.ADD.description
              : MODAL_CONTENT.EDIT.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormDescription>
                    Enter a unique name for your tag.
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Enter tag name..."
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="tag-submit-button"
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
