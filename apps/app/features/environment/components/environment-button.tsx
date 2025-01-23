import { cn } from '@links-base/ui/utils'

import { type Environment } from '../types/environment.types'

interface EnvironmentButtonProps {
  environment: Environment
  isActive: boolean
  onClick: () => void
  color: string
  label: string
}

export function EnvironmentButton({
  isActive,
  onClick,
  color,
  label
}: EnvironmentButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md px-3 py-1 text-xs font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? ['text-white shadow-sm']
          : ['bg-transparent', 'hover:bg-muted']
      )}
      style={{
        backgroundColor: isActive ? color : 'transparent',
        color: isActive ? 'white' : color,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: color
      }}
      aria-current={isActive}
    >
      {label}
    </button>
  )
}
