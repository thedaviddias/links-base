import { type LinksApp } from '../types/link.types'
import { groupLinksByCategory } from '../utils/links'

interface UseLinkFilteringProps {
  links: LinksApp[]
  category?: string
  hiddenCategories: string[]
  selectedTags: string[]
  validCategories: Set<string>
  isFavourite: (name: string) => boolean
  isArchived: (name: string) => boolean
  showArchived: boolean
}

interface UseLinkFilteringReturn {
  filteredLinks: LinksApp[]
  groupedLinks: [string, LinksApp[]][]
  invalidCategoryLinks: Array<{ name: string; category: string }>
}

/** Hook to handle link filtering and grouping logic */
export const useLinkFiltering = ({
  links,
  category,
  hiddenCategories,
  selectedTags,
  validCategories,
  isFavourite,
  isArchived,
  showArchived
}: UseLinkFilteringProps): UseLinkFilteringReturn => {
  const invalidCategoryLinks: Array<{ name: string; category: string }> = []

  const filteredLinks = links
    .filter(link => !hiddenCategories.includes(link.category))
    .filter(
      link =>
        selectedTags.length === 0 ||
        link.tags?.some(tag => selectedTags.includes(tag))
    )

  const linksByCategory = groupLinksByCategory({
    links: filteredLinks,
    category,
    isFavourite,
    isArchived,
    showArchived: true,
    hiddenCategories,
    validCategories
  })

  const groupedLinks = Object.entries(linksByCategory)
    .map(([categoryName, categoryLinks]) => {
      const visibleLinks = showArchived
        ? categoryLinks
        : categoryLinks.filter(link => !isArchived(link.name))

      return [categoryName, visibleLinks] as [string, typeof categoryLinks]
    })
    .filter(([_, categoryLinks]) => categoryLinks.length > 0)

  return {
    filteredLinks,
    groupedLinks,
    invalidCategoryLinks
  }
}
