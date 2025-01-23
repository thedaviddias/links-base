import { z } from 'zod'

export const LinkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().optional(),
  color: z.string().optional(),
  access: z.string().optional(),
  environments: z.object({
    production: z.string().min(1, 'Production URL is required'),
    staging: z.string().optional(),
    integration: z.string().optional()
  }),
  tags: z.array(z.string()).optional(),
  instructions: z.string().optional(),
  createdAt: z.string(),
  timestamp: z.string(),
  accessType: z.string().optional()
})

export type InferLinkSchema = z.infer<typeof LinkSchema>
export type LinksApp = InferLinkSchema
