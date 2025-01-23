'use client'

import { useEffect } from 'react'

import { Link } from 'lucide-react'

import { SectionHeader } from '@/components/layout/section-header'
import { EmptyState } from '@/components/skeletons/empty-state'
import { LoadingSpinner } from '@/components/skeletons/loading-spinner'

import { RECENT_LINKS_LIMIT, getRecentLinks } from '@/utils/get-recent-links'
import { groupByDate } from '@/utils/group-by-date'
import { noop } from '@/utils/noop'

import { LinksGrid } from '@/features/links/components/links-grid'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { useRecentLinksStore } from '@/features/links/stores/use-recent-links-store'

export function RecentLinks() {
  const { links, isLoading, error } = useLinks()
  const { setHasVisitedRecent, setRecentLinks } = useRecentLinksStore()

  useEffect(() => {
    setHasVisitedRecent()
  }, [setHasVisitedRecent])

  useEffect(() => {
    if (links) {
      const recentLinks = getRecentLinks(links)
      setRecentLinks(recentLinks)
    }
  }, [links, setRecentLinks])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !links || links.length === 0) {
    return (
      <EmptyState
        icon={Link}
        title="No recent links added"
        description="Recently added links will appear here"
      />
    )
  }

  // Get the 5 most recent links and group them by date
  const recentLinks = [...links]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, RECENT_LINKS_LIMIT)

  const groupedLinks = groupByDate(recentLinks)

  return (
    <div className="space-y-8">
      {Object.entries(groupedLinks).map(([date, dateLinks]) => (
        <div key={date} className="mb-8">
          <SectionHeader
            title={date}
            description={`${dateLinks.length} link${dateLinks.length === 1 ? '' : 's'} added`}
          />
          <LinksGrid
            links={dateLinks}
            handleLinkClick={noop}
            clickedLinks={[]}
            handleAddToFavorites={noop}
            isFavourite={() => false}
            isArchived={() => false}
            onArchiveToggle={noop}
            withAnimation={true}
            showManageOptions={false}
          />
        </div>
      ))}
    </div>
  )
}
