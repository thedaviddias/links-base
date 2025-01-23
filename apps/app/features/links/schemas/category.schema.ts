import { z } from 'zod'

export const CategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters.' }),
  icon: z.string().optional(),
  description: z.string().optional(),
  timestamp: z.string().optional(),
  linkCount: z
    .number()
    .min(0, { message: 'Link count cannot be negative.' })
    .optional()
})

export type InferCategorySchema = z.infer<typeof CategorySchema>
