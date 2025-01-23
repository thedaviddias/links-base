import { type Environment } from '@/features/environment/types/environment.types'
import { getSettingsJson } from '@/features/setup/utils/load-json-data'

/**
 * Default environment configuration in case settings fail to load
 */
const DEFAULT_ENV_CONFIG = {
  colors: {} as Record<Environment, string>,
  labels: {} as Record<Environment, string>,
  order: [] as Environment[],
  enabled: [] as Environment[]
}

/**
 * Safely loads environment settings with fallbacks
 */
const loadEnvironmentSettings = async () => {
  try {
    const settings = await getSettingsJson()
    return {
      colors:
        settings?.environments?.display?.colors ?? DEFAULT_ENV_CONFIG.colors,
      labels:
        settings?.environments?.display?.labels ?? DEFAULT_ENV_CONFIG.labels,
      order:
        settings?.environments?.configuration?.order ??
        DEFAULT_ENV_CONFIG.order,
      enabled:
        settings?.environments?.configuration?.enabled ??
        DEFAULT_ENV_CONFIG.enabled
    }
  } catch (error) {
    console.error('Failed to load environment settings:', error)
    return DEFAULT_ENV_CONFIG
  }
}

// Since we can't use await at the top level, we'll need to initialize with defaults
const environmentSettings = DEFAULT_ENV_CONFIG

// Update settings asynchronously
void loadEnvironmentSettings().then(settings => {
  Object.assign(environmentSettings, settings)
})

/**
 * Maps environment types to their display colors
 * @example { production: '#FF0000', staging: '#00FF00' }
 */
export const environmentColors = environmentSettings.colors

/**
 * Maps environment types to their display labels
 * @example { production: 'Production', staging: 'Staging' }
 */
export const environmentLabels = environmentSettings.labels

/**
 * Defines the display order of environments in the UI
 * @example ['production', 'staging', 'development']
 */
export const environmentOrder = environmentSettings.order

/**
 * List of environments that are currently enabled in the application
 * @example ['production', 'staging']
 */
export const enabledEnvironments = environmentSettings.enabled
