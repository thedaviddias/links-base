import { type z } from 'zod'

import { type environmentEnum } from '@/features/settings/schemas/settings.schema'

// Derive the type from the Zod enum
export type Environment = z.infer<typeof environmentEnum>
