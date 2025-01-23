'use client'

import { cn } from '@links-base/ui/utils'

interface BadgeCountProps {
  count: number
  singularLabel?: string
  pluralLabel?: string
  emptyLabel?: string
  className?: string
}

export function BadgeCount({
  count,
  singularLabel = 'item',
  pluralLabel = 'items',
  emptyLabel,
  className
}: BadgeCountProps) {
  if (count === 0) return null

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground',
        className
      )}
    >
      {count === 0
        ? emptyLabel
        : `${count} ${count === 1 ? singularLabel : pluralLabel}`}
    </div>
  )
}
