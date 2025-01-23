import { SectionHeader } from '@/components/layout/section-header'

import { Skeleton } from '@links-base/ui/skeleton'

export function CategorySkeleton() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Category" description="Category">
        <Skeleton className="h-8 w-48" />
      </SectionHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
    </div>
  )
}
