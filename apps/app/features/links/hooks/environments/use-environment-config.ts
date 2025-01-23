import { type Environment } from '@/features/environment/types/environment.types'
import { type EnvironmentConfig } from '@/features/links/types/environment.types'
import { useSettings } from '@/features/settings/hooks/use-settings'

export const useEnvironmentConfig = (): EnvironmentConfig => {
  const { settings } = useSettings()

  if (!settings) {
    return {
      enabledEnvironments: [] as Environment[],
      environmentLabels: {} as Record<Environment, string>,
      environmentColors: {} as Record<Environment, string>,
      environmentOrder: [] as Environment[]
    }
  }

  const defaultLabels: Record<Environment, string> = {
    production: 'Production',
    staging: 'Staging',
    integration: 'Integration'
  }

  const defaultColors: Record<Environment, string> = {
    production: '#000000',
    staging: '#666666',
    integration: '#999999'
  }

  return {
    enabledEnvironments: settings.environments.configuration.enabled,
    environmentLabels: {
      ...defaultLabels,
      ...settings.environments.display.labels
    },
    environmentColors: {
      ...defaultColors,
      ...settings.environments.display.colors
    },
    environmentOrder: settings.environments.configuration.order
  }
}
