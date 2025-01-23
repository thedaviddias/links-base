import { type Environment } from '@/features/environment/types/environment.types'
import { useEnvironmentConfig } from '@/features/links/hooks/environments/use-environment-config'

import { Badge } from '@links-base/ui/badge'

export const getAbbreviation = (
  env: Environment,
  environmentLabels: Record<Environment, string>
) => {
  switch (env) {
    case 'integration':
      return 'INT'
    case 'staging':
      return 'STG'
    case 'production':
      return 'PROD'
    default:
      return environmentLabels[env]
  }
}

export function EnvironmentBadge({
  environment
}: { environment: Environment }) {
  const { environmentColors, environmentLabels } = useEnvironmentConfig()

  if (!environmentColors[environment] || !environmentLabels[environment]) {
    return null
  }

  const label = getAbbreviation(environment, environmentLabels)

  return (
    <Badge
      className="shadow-sm"
      style={{
        backgroundColor: environmentColors[environment],
        color: 'white'
      }}
    >
      {label}
    </Badge>
  )
}
