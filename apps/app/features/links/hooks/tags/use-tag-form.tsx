import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  type InferTagSchema,
  TagSchema
} from '@/features/links/schemas/tag.schema'

export const useTagForm = (
  initialValues: Partial<InferTagSchema> = {},
  onSubmit: (data: InferTagSchema) => Promise<void>
) => {
  const form = useForm<InferTagSchema>({
    resolver: zodResolver(TagSchema),
    defaultValues: {
      name: initialValues.name ?? ''
    }
  })

  const handleSubmit = async (data: InferTagSchema) => {
    try {
      await onSubmit(data)
      form.reset()
      return true
    } catch (error) {
      console.error('Failed to submit tag:', error)
      return false
    }
  }

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting: form.formState.isSubmitting
  }
}
