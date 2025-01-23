import { type EnvironmentConfig } from '@/features/links/types/environment.types'

export const mockEnvironmentConfig: EnvironmentConfig = {
  environmentColors: {
    production: '#0f0',
    staging: '#ff0',
    integration: '#00f'
  },
  environmentLabels: {
    production: 'Production',
    staging: 'Staging',
    integration: 'Integration'
  },
  enabledEnvironments: ['production', 'staging', 'integration'],
  environmentOrder: ['production', 'staging', 'integration']
}
