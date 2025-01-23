'use client'

import { useMemo, useState } from 'react'

import { Tag } from 'lucide-react'

import { type FilterOption } from '@/features/filter/types/filters'
import { type LinksApp } from '@/features/links/types/link.types'

interface UseTagFilterProps {
  links: LinksApp[]
  isFavourite: (name: string) => boolean
  isArchived: (name: string) => boolean
  showArchived: boolean
  hiddenCategories: string[]
  category?: string
}

/**
 * Custom hook for managing tag filtering functionality
 */
export function useTagFilter({
  links,
  isFavourite,
  isArchived,
  showArchived,
  hiddenCategories,
  category
}: UseTagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // First, get only the visible links (not favorites, not archived unless shown, not hidden)
  const visibleLinks = useMemo(() => {
    const filtered =
      links
        ?.filter(link => link.name && !isFavourite(link.name))
        ?.filter(
          link => link.name && (showArchived ? true : !isArchived(link.name))
        )
        ?.filter(link => {
          // If we're in a category page, only show links from that category
          if (category) {
            // Case-insensitive comparison
            return link.category.toLowerCase() === category.toLowerCase()
          }
          // On homepage, filter out hidden categories
          return link.category && !hiddenCategories.includes(link.category)
        }) || []

    return filtered
  }, [links, isFavourite, isArchived, showArchived, hiddenCategories, category])

  // Then filter visible links based on selected tags
  const filteredLinks = useMemo(() => {
    if (selectedTags.length === 0) return visibleLinks

    return visibleLinks.filter(link =>
      selectedTags.every(tag => link.tags?.includes(tag))
    )
  }, [visibleLinks, selectedTags])

  // Get available tags only from the filtered links
  const tagOptions = useMemo<FilterOption[]>(() => {
    const tagSet = new Set<string>()

    // If no tags are selected, show all possible tags from visible links
    if (selectedTags.length === 0) {
      visibleLinks?.forEach(link => {
        if (link.tags) {
          link.tags.forEach(tag => tagSet.add(tag))
        }
      })
    } else {
      // Only show tags that exist in the currently filtered links
      filteredLinks.forEach(link => {
        if (link.tags) {
          link.tags.forEach(tag => {
            // Don't add tags that are already selected
            if (!selectedTags.includes(tag)) {
              tagSet.add(tag)
            }
          })
        }
      })
    }

    const options = Array.from(tagSet)
      .sort()
      .map(tag => ({
        id: tag,
        label: tag,
        icon: Tag
      }))

    return options
  }, [visibleLinks, filteredLinks, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      }
      return [...prev, tag]
    })
  }

  const reset = () => {
    setSelectedTags([])
  }

  return {
    selectedTags,
    toggleTag,
    reset,
    tagOptions,
    filteredLinks
  }
}
