import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  CategorySchema,
  type InferCategorySchema
} from '@/features/links/schemas/category.schema'

export const useCategoryForm = (
  initialValues: Partial<InferCategorySchema> = {},
  onSubmit: (data: InferCategorySchema) => Promise<void>
) => {
  const form = useForm<InferCategorySchema>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: initialValues.name ?? '',
      icon: initialValues.icon ?? 'Folder'
    }
  })

  const handleSubmit = async (data: InferCategorySchema) => {
    try {
      await onSubmit(data)
      form.reset()
      return true
    } catch (error) {
      console.error('Failed to submit category:', error)
      return false
    }
  }

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting: form.formState.isSubmitting
  }
}
