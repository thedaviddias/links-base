import { z } from 'zod'

import { getSettingsJson } from '@/features/setup/utils/load-json-data'

import packageJson from '../package.json'

const production = process.env.NODE_ENV === 'production'

const AppConfigSchema = z.object({
  name: z
    .string({
      description: 'This is the name of your app. Ex. "Link Manager"',
      required_error: 'Please provide the name in the settings'
    })
    .min(2),
  url: z.string().default('http://localhost:3000/'),
  description: z.string({
    required_error: 'Please provide the description in the settings'
  }),
  production: z.boolean(),
  bannerText: z.string().default(''),
  githubRepo: z.string().default('thedaviddias/links-base'),
  version: z.string()
})

export const getAppConfig = async () => {
  const settings = await getSettingsJson()

  return AppConfigSchema.parse({
    name: settings?.general?.name || 'Links Base',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/',
    description: settings?.general?.description || 'Links Base',
    production,
    bannerText: settings?.general?.bannerText || '',
    githubRepo: 'thedaviddias/links-base',
    version: packageJson.version
  })
}

// Export a default configuration for cases where async loading isn't possible
export const defaultAppConfig = AppConfigSchema.parse({
  name: 'Links Base',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/',
  description: 'Links Base',
  production,
  bannerText: '',
  githubRepo: 'thedaviddias/links-base',
  version: packageJson.version
})

export default defaultAppConfig
