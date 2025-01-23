'use client'

import { useEffect } from 'react'

import { Home as HomeIcon } from 'lucide-react'

import { LayoutPublic } from '@/components/layout/layout-public'
import { PageHeader } from '@/components/layout/page-header'
import { HomeSkeleton } from '@/components/skeletons/home-skeleton'

import { getRecentLinks } from '@/utils/get-recent-links'

import { useCategories } from '@/features/category/hooks/use-categories'
import { ExportBookmarksButton } from '@/features/data-manager/components/export-bookmarks-button'
import { FavouriteBar } from '@/features/favourite/components/favourite-bar'
import { AllLinks } from '@/features/links/components/all-links'
import { HiddenCategoriesAlert } from '@/features/links/components/hidden-categories-alert'
import ShareViewButton from '@/features/links/components/share-view-button'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { useHiddenCategoriesAlert } from '@/features/links/hooks/use-hidden-categories-alert'
import { useRecentLinksStore } from '@/features/links/stores/use-recent-links-store'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

export default function Home() {
  const { categories, isLoading: categoriesLoading } = useCategories()
  const { links, isLoading: linksLoading } = useLinks()
  const { hiddenCategories } = useUserSettingsStore()
  const { setRecentLinks } = useRecentLinksStore()

  const {
    showFullAlert,
    setShowFullAlert,
    hiddenCategoriesWithLinks,
    handleDismissAlert
  } = useHiddenCategoriesAlert({
    categories,
    links,
    hiddenCategories
  })

  const isLoading = categoriesLoading || linksLoading

  useEffect(() => {
    if (links) {
      const recentLinks = getRecentLinks(links)
      setRecentLinks(recentLinks)
    }
  }, [links, setRecentLinks])

  return (
    <LayoutPublic>
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <div className="mb-10 flex items-center justify-between">
            <PageHeader
              pageData={{
                pageTitle: 'Home',
                description: 'Manage and access your bookmarks',
                icon: HomeIcon
              }}
            />
            <div className="flex items-center gap-2">
              <ShareViewButton links={links} />
              <ExportBookmarksButton disabled={links.length === 0} />
            </div>
          </div>

          {/* Hidden Categories Alert */}
          <HiddenCategoriesAlert
            hiddenCategories={hiddenCategoriesWithLinks}
            showFullAlert={showFullAlert}
            setShowFullAlert={setShowFullAlert}
            onDismiss={handleDismissAlert}
          />

          <FavouriteBar />

          <AllLinks />
        </>
      )}
    </LayoutPublic>
  )
}
