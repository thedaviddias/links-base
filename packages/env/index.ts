import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const server: Parameters<typeof createEnv>[0]['server'] = {
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // Added by Vercel
  VERCEL: z.string().optional(),
  NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),
  FLAGS_SECRET: z.string().min(1)
}

const client: Parameters<typeof createEnv>[0]['client'] = {
  // Added by Vercel
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string().min(1).url()
}

export const env = createEnv({
  client,
  server,
  runtimeEnv: {}
})
