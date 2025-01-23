import { z } from 'zod'

export const RequestLinkFormSchema = z
  .object({
    method: z.enum(['email', 'github']),
    // Conditional fields based on method
    requesterName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .optional(),
    requesterEmail: z.string().email('Invalid email address').optional(),
    // Common fields
    name: z.string().min(2, 'Name must be at least 2 characters'),
    url: z.string().url('Must be a valid URL'),
    category: z.string(),
    suggestedCategory: z.string().optional(),
    description: z
      .string()
      .max(80, 'Description must be less than 80 characters')
      .optional()
  })
  .refine(
    data => {
      // If method is email, requesterName and requesterEmail are required
      if (data.method === 'email') {
        return data.requesterName && data.requesterEmail
      }
      return true
    },
    {
      message: 'Name and email are required for email requests',
      path: ['requesterEmail']
    }
  )

export type InferRequestLinkFormSchema = z.infer<typeof RequestLinkFormSchema>
