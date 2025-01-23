import { type LucideIcon } from 'lucide-react'

import { Button } from '@links-base/ui/button'

export type EmptyStateProps = {
  /** The title to display */
  title: string
  /** Optional description text */
  description?: string
  /** Optional icon to display */
  icon?: LucideIcon
  /** Optional action button configuration */
  action?:
    | {
        label: string
        onClick: () => void
      }
    | React.ReactNode
  /** Optional custom CSS classes */
  className?: string
  /** Optional height of the empty state */
  height?: string
}

/**
 * A reusable empty state component to display when there is no data
 */
export const EmptyState = ({
  title,
  description,
  icon: Icon,
  action,
  className = '',
  height = '400px'
}: EmptyStateProps) => {
  return (
    <div
      className={`flex min-h-[${height}] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 px-5 py-5 text-center dark:border-empty-border dark:bg-empty ${className}`}
      role="status"
      aria-label={title}
    >
      {Icon && (
        <Icon
          className="mb-3 h-10 w-10 text-gray-400 dark:text-empty-icon"
          aria-hidden="true"
        />
      )}
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-empty-title">
        {title}
      </h3>
      {description && (
        <p className="mb-3 text-sm text-gray-500 dark:text-empty-text">
          {description}
        </p>
      )}
      {action &&
        (typeof action === 'object' && 'label' in action ? (
          <Button onClick={action.onClick} variant="outline" size="sm">
            {action.label}
          </Button>
        ) : (
          action
        ))}
    </div>
  )
}
