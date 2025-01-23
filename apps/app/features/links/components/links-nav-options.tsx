'use client'

import { LoadingSpinner } from '@/components/skeletons/loading-spinner'

import { useFavourites } from '@/features/favourite/hooks/use-favourites'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { EnvironmentSelector } from '../../environment/components/environment-selector'
import { useLinks } from '../hooks/links/use-links'
import { useArchiveActions } from '../hooks/use-archive-actions'
import { useLinkFiltering } from '../hooks/use-link-filtering'
import { useUrlFilters } from '../hooks/use-url-filters'

import { ErrorState } from './error'
import { TagFilterSection } from './tag-filter-section'

type LinksNavOptionsProps = {
  type: 'category' | 'home'
  category?: string
  validCategories: Set<string>
}

export const LinksNavOptions = ({
  category,
  validCategories
}: LinksNavOptionsProps) => {
  const { links, isLoading: isLoadingLinks, error: linksError } = useLinks()
  const { isFavourite } = useFavourites()
  const { showArchived, isArchived } = useArchiveActions()
  const { hiddenCategories } = useUserSettingsStore()

  const { urlHiddenCategories, urlSelectedTags, handleToggleTag, handleReset } =
    useUrlFilters()

  // Combine URL hidden categories with user settings hidden categories
  const allHiddenCategories = Array.from(
    new Set([...urlHiddenCategories, ...hiddenCategories])
  )

  const { filteredLinks } = useLinkFiltering({
    links,
    category,
    hiddenCategories: allHiddenCategories,
    selectedTags: urlSelectedTags,
    validCategories,
    isFavourite,
    isArchived,
    showArchived
  })

  if (linksError) {
    return <ErrorState error={linksError} />
  }

  if (isLoadingLinks) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex gap-4">
      {filteredLinks.length === 0 && (
        <div>
          <TagFilterSection
            category={category}
            filteredLinks={filteredLinks}
            selectedTags={urlSelectedTags}
            onToggleTag={handleToggleTag}
            onReset={handleReset}
          />
        </div>
      )}

      <EnvironmentSelector categoryId={category} />
    </div>
  )
}
