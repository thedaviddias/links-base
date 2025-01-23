import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  type InferLinkSchema,
  LinkSchema
} from '@/features/links/schemas/link.schema'

export const useLinkForm = (
  initialValues: Partial<InferLinkSchema> = {},
  onSubmit: (data: InferLinkSchema) => Promise<void>
) => {
  const form = useForm<InferLinkSchema>({
    resolver: zodResolver(LinkSchema),
    defaultValues: {
      name: initialValues.name ?? '',
      environments: initialValues.environments ?? { production: '' },
      category: initialValues.category ?? '',
      tags: initialValues.tags ?? []
    }
  })

  const handleSubmit = async (data: InferLinkSchema) => {
    try {
      await onSubmit(data)
      form.reset()
      return true
    } catch (error) {
      console.error('Failed to submit link:', error)
      return false
    }
  }

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting: form.formState.isSubmitting
  }
}
