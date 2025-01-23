import { Skeleton } from '@links-base/ui/skeleton'

export const HomeSkeleton = () => {
  return (
    <div data-testid="home-skeleton" className="p-6 md:p-10">
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Pinned Links skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-4 h-6 w-24" /> {/* "Pinned Links" text */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="h-[100px] w-[200px] rounded-lg border bg-card shadow-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Search and filters skeleton */}
      <div className="mb-6 flex items-center gap-4">
        <Skeleton className="h-10 w-[200px]" /> {/* Search input */}
        <Skeleton className="h-10 w-[150px]" /> {/* Filter button */}
      </div>

      {/* Categories and Links */}
      <div className="space-y-8">
        {/* Development section */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-5 w-5" /> {/* Icon */}
            <Skeleton className="h-6 w-32" /> {/* Category name */}
            <Skeleton className="h-5 w-16" /> {/* Link count */}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton
                key={i}
                className="h-[140px] rounded-lg border bg-card/50 shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Communication section */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-5 w-5" /> {/* Icon */}
            <Skeleton className="h-6 w-36" /> {/* Category name */}
            <Skeleton className="h-5 w-16" /> {/* Link count */}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {[1, 2, 3].map(i => (
              <Skeleton
                key={i}
                className="h-[140px] rounded-lg border bg-card/50 shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
