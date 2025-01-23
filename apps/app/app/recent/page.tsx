'use client'

import { LayoutPublic } from '@/components/layout/layout-public'
import { ADDITIONAL_NAV_ITEMS } from '@/components/layout/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { RecentLinksSkeleton } from '@/components/skeletons/recent-links-skeleton'

import { RecentLinks } from '@/app/recent/_components/recent-links'
import { ROUTES } from '@/constants/routes'
import { useLinks } from '@/features/links/hooks/links/use-links'

export default function RecentPage() {
  const { isLoading } = useLinks()
  const pageData = ADDITIONAL_NAV_ITEMS.find(
    item => item.url === ROUTES.RECENT.path
  )

  return (
    <LayoutPublic>
      <div className="flex flex-col gap-6">
        <PageHeader pageData={pageData} />
        {isLoading ? <RecentLinksSkeleton /> : <RecentLinks />}
      </div>
    </LayoutPublic>
  )
}
