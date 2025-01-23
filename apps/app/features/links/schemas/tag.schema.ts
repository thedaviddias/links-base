import { z } from 'zod'

export const TagSchema = z.object({
  name: z.string().min(2, {
    message: 'Tag must be at least 2 characters.'
  })
})

export type InferTagSchema = z.infer<typeof TagSchema>
