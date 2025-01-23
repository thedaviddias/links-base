import { cn } from '@links-base/ui/utils'

export type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * A loading spinner component that provides visual feedback during loading states
 */
export const LoadingSpinner = ({
  size = 'md',
  className
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div
      role="status"
      className="flex h-full min-h-[100px] w-full items-center justify-center"
      data-testid="loading-spinner"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-primary border-r-transparent',
          sizeClasses[size],
          className
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
