'use client'

import Link from 'next/link'

import { LinkIcon } from 'lucide-react'

import { SectionHeader } from '@/components/layout/section-header'
import { BadgeCount } from '@/components/notifications/badge-count'
import { EmptyState } from '@/components/skeletons/empty-state'
import { LoadingSpinner } from '@/components/skeletons/loading-spinner'

import { getIconComponent } from '@/utils/icon-mapping'

import { IS_DEVELOPMENT } from '@/constants'
import { useCategories } from '@/features/category/hooks/use-categories'
import { useFavourites } from '@/features/favourite/hooks/use-favourites'
import { LinksGrid } from '@/features/links/components/links-grid'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { type LinksApp } from '@/features/links/types/link.types'
import { RequestLinkButton } from '@/features/request-link/components/request-link-button'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { Alert, AlertDescription, AlertTitle } from '@links-base/ui/alert'

import { useArchiveActions } from '../hooks/use-archive-actions'
import { useClickedLinks } from '../hooks/use-clicked-links'
import { useLinkFiltering } from '../hooks/use-link-filtering'
import { useLinkModal } from '../hooks/use-link-modal'
import { useUrlFilters } from '../hooks/use-url-filters'

import { ErrorState } from './error'
import { LinkDetailsModal } from './link-details-modal'
import { LinksNavOptions } from './links-nav-options'

export function AllLinks({
  category,
  type = 'home'
}: {
  category?: string
  type?: 'category' | 'home'
}) {
  const { links, isLoading: isLoadingLinks, error: linksError } = useLinks()
  const { categories, isLoading: isLoadingCategories } = useCategories()

  const { addFavourite, removeFavourite, isFavourite } = useFavourites()
  const { showArchived, isArchived, handleToggleArchived } = useArchiveActions()

  const { hiddenCategories } = useUserSettingsStore()

  const { urlHiddenCategories, urlSelectedTags } = useUrlFilters()

  // Combine URL hidden categories with user settings hidden categories
  const allHiddenCategories = Array.from(
    new Set([...urlHiddenCategories, ...hiddenCategories])
  )

  const { clickedLinks, handleLinkClick } = useClickedLinks()

  // Convert categories to a Set of lowercase names
  const validCategories = new Set(
    (categories ?? []).map((cat: { name: string }) => cat.name.toLowerCase())
  )

  const { groupedLinks, invalidCategoryLinks } = useLinkFiltering({
    links,
    category,
    hiddenCategories: allHiddenCategories,
    selectedTags: urlSelectedTags,
    validCategories,
    isFavourite,
    isArchived,
    showArchived
  })

  const { selectedLink, handleCloseModal } = useLinkModal()

  if (isLoadingLinks || isLoadingCategories) {
    return <LoadingSpinner />
  }

  if (linksError) {
    return <ErrorState error={linksError} />
  }

  // Check category with case-insensitive comparison
  if (category && !validCategories.has(category.toLowerCase())) {
    return <div className="p-6">Category not found: {category}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <h2 className="text-2xl font-semibold tracking-tight">All Links</h2>

          <LinksNavOptions
            type={type}
            category={category}
            validCategories={validCategories}
          />
        </div>
      </div>
      <div>
        {/* Warning for undefined categories */}
        {IS_DEVELOPMENT && invalidCategoryLinks.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>
              Warning: Found links with undefined categories
            </AlertTitle>
            <AlertDescription>
              <ul className="ml-6 mt-2 list-disc">
                {invalidCategoryLinks.map(link => (
                  <li key={link.name}>
                    &quot;{link.name}&quot; (category: &quot;{link.category}
                    &quot;)
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm">
                Please{' '}
                <Link href="/admin/manage/categories" className="underline">
                  update your categories
                </Link>{' '}
                to include these categories or correct the link categories.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {groupedLinks.length === 0 && (
          <EmptyState
            icon={LinkIcon}
            title="No links found"
            description="Request a new link to be added"
            action={<RequestLinkButton />}
          />
        )}

        {/* Filter links based on archived status */}
        {groupedLinks.map(([categoryName, categoryLinks]) => {
          const visibleLinks = categoryLinks.filter(link =>
            showArchived ? true : !isArchived(link.name)
          )

          if (visibleLinks.length === 0) return null

          const categoryObject = (categories ?? []).find(
            (cat: { name: string; icon?: string }) => cat.name === categoryName
          )
          const Icon = getIconComponent(categoryObject?.icon || 'Folder')

          return (
            <div key={categoryName} className="mb-10">
              {type === 'home' && (
                <SectionHeader
                  title={categoryName}
                  description={categoryObject?.description}
                  information={
                    <div className="flex items-center gap-1">
                      <BadgeCount
                        count={
                          links.filter(link => link.category === categoryName)
                            .length
                        }
                        singularLabel="link"
                        pluralLabel="links"
                        emptyLabel="No links yet"
                      />
                      {/* create a badge to show the number of links archived in this category */}
                      <BadgeCount
                        count={
                          links.filter(
                            link =>
                              link.category === categoryName &&
                              isArchived(link.name)
                          ).length
                        }
                        singularLabel="archived link"
                        pluralLabel="archived links"
                        emptyLabel="No archived links"
                      />
                    </div>
                  }
                  icon={Icon}
                />
              )}
              <LinksGrid
                links={visibleLinks}
                handleLinkClick={handleLinkClick}
                clickedLinks={clickedLinks}
                handleAddToFavorites={link => {
                  if (isFavourite(link.name)) {
                    removeFavourite(link.name)
                  } else {
                    addFavourite(link)
                  }
                }}
                isFavourite={isFavourite}
                isArchived={isArchived}
                onArchiveToggle={handleToggleArchived}
                withAnimation={true}
              />
            </div>
          )
        })}

        <LinkDetailsModal
          isOpen={Boolean(selectedLink)}
          onClose={handleCloseModal}
          link={selectedLink as LinksApp}
        />
      </div>
    </div>
  )
}
