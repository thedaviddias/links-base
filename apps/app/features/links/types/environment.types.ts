import { type Environment } from '@/features/environment/types/environment.types'

export interface EnvironmentConfig {
  enabledEnvironments: Environment[]
  environmentLabels: Record<Environment, string>
  environmentColors: Record<Environment, string>
  environmentOrder: Environment[]
}
