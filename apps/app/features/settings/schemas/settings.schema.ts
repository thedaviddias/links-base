import { z } from 'zod'

import { DEFAULT_COLOR } from '@/constants'

// Define the enum values as a const array for reuse
export const ENVIRONMENT_VALUES = [
  'production',
  'staging',
  'integration'
] as const

// Create the Zod enum using the array
export const environmentEnum = z.enum(ENVIRONMENT_VALUES)

export const SettingsSchema = z.object({
  general: z.object({
    name: z.string(),
    description: z.string().default(''),
    bannerText: z.string().default('')
  }),
  links: z.object({
    appearance: z.object({
      defaultBrandColor: z.string().default(DEFAULT_COLOR)
    })
  }),
  environments: z.object({
    configuration: z.object({
      order: z.array(environmentEnum),
      enabled: z.array(environmentEnum)
    }),
    display: z.object({
      labels: z.record(environmentEnum, z.string()),
      colors: z.record(environmentEnum, z.string())
    })
  }),
  requests: z.object({
    email: z
      .object({
        enabled: z.boolean().optional().default(false),
        address: z.string().email().optional(),
        subject: z.string().optional(),
        template: z.string().optional()
      })
      .refine(
        data => {
          // If enabled, require all fields
          if (data.enabled) {
            return !!data.address && !!data.subject && !!data.template
          }
          return true
        },
        {
          message:
            'Email configuration fields are required when email is enabled',
          path: ['email']
        }
      ),
    github: z
      .object({
        enabled: z.boolean().optional().default(false),
        owner: z.string().optional(),
        repo: z.string().optional(),
        labels: z.array(z.string()).optional(),
        template: z.string().optional()
      })
      .refine(
        data => {
          // If enabled, require all fields
          if (data.enabled) {
            return (
              !!data.owner && !!data.repo && !!data.template && !!data.labels
            )
          }
          return true
        },
        {
          message:
            'GitHub configuration fields are required when GitHub is enabled',
          path: ['github']
        }
      )
  }),
  help: z.object({
    links: z.object({
      enabled: z.boolean().default(false)
    }),
    featureRequests: z.object({
      enabled: z.boolean().default(true)
    })
  }),
  services: z.object({
    imageProxy: z.object({
      enabled: z.boolean().optional().default(true),
      primary: z.string().url(),
      fallback: z.string().url()
    })
  })
})

export type InferSettingsSchema = z.infer<typeof SettingsSchema>
