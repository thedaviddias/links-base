'use client'

import { FilterDropdown } from '@/features/filter/components/filter-dropdown'

import { type LinksApp } from '../types/link.types'

import { VisibilityToggle } from './visibility-toggle'

interface TagFilterSectionProps {
  category?: string
  filteredLinks: LinksApp[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void
  onReset: () => void
}

/** Component to handle tag filtering UI and logic */
export const TagFilterSection = ({
  category,
  filteredLinks,
  selectedTags,
  onToggleTag,
  onReset
}: TagFilterSectionProps) => {
  // Get the relevant links based on whether we're on a category page or home
  const relevantLinks = category
    ? filteredLinks.filter(
        link => link.category.toLowerCase() === category.toLowerCase()
      )
    : filteredLinks

  // Get unique tags from the relevant links only
  const availableTags = Array.from(
    new Set(relevantLinks.flatMap(link => link.tags || []).filter(Boolean))
  ).sort()

  // Create tag options only from available tags
  const tagOptions = availableTags.map(tag => ({
    id: tag,
    label: tag,
    value: tag
  }))

  if (filteredLinks.length === 0 || tagOptions.length === 0) {
    return null
  }

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <FilterDropdown
          options={tagOptions}
          selectedFilters={selectedTags}
          onToggleFilter={onToggleTag}
          onReset={onReset}
          filterTitle="Tags"
          buttonLabel="Filter"
          category={category}
        />
        <VisibilityToggle />
      </div>
    </div>
  )
}
