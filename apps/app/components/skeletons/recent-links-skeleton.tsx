import { LINKS_GRID_CLASSES } from '@/constants'

import { Skeleton } from '@links-base/ui/skeleton'

export const RecentLinksSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Header with button skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-9 w-[250px]" /> {/* Title */}
          <Skeleton className="h-5 w-[200px]" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-[120px]" /> {/* Request Link button */}
      </div>

      {/* First date group */}
      <div>
        <div className="mb-2">
          <Skeleton className="mb-1 h-7 w-48" /> {/* Date heading */}
          <Skeleton className="mb-4 h-5 w-24" /> {/* "X links added" text */}
        </div>
        <div className={LINKS_GRID_CLASSES}>
          {[1, 2].map(i => (
            <Skeleton
              key={i}
              className="h-[140px] rounded-lg border bg-card/50 shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* Second date group */}
      <div>
        <div className="mb-2">
          <Skeleton className="mb-1 h-7 w-48" /> {/* Date heading */}
          <Skeleton className="mb-4 h-5 w-24" /> {/* "X links added" text */}
        </div>
        <div className={LINKS_GRID_CLASSES}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton
              key={i}
              className="h-[140px] rounded-lg border bg-card/50 shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
