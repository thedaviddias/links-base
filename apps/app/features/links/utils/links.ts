import { DEFAULT_CATEGORY } from '@/constants'
import { type LinksApp } from '@/features/links/types/link.types'

export interface GroupLinksByCategoryParams {
  links: LinksApp[]
  category?: string
  isFavourite: (name: string) => boolean
  isArchived: (name: string) => boolean
  showArchived: boolean
  hiddenCategories: string[]
  validCategories: string[] | Set<string>
}

export function groupLinksByCategory({
  links,
  category,
  isFavourite,
  isArchived,
  showArchived,
  hiddenCategories,
  validCategories
}: GroupLinksByCategoryParams): Record<string, LinksApp[]> {
  const categoriesSet =
    validCategories instanceof Set
      ? validCategories
      : new Set((validCategories || []).map(cat => cat.toLowerCase()))

  return links
    .filter(link => !isFavourite(link.name))
    .filter(link => (showArchived ? true : !isArchived(link.name)))
    .filter(link => link.category && !hiddenCategories.includes(link.category))
    .reduce(
      (acc, link) => {
        const linkCategory = link.category || DEFAULT_CATEGORY

        // Case-insensitive category comparison
        if (category && category.toLowerCase() !== linkCategory.toLowerCase()) {
          return acc
        }

        if (categoriesSet.has(linkCategory.toLowerCase())) {
          if (!acc[linkCategory]) {
            acc[linkCategory] = []
          }
          acc[linkCategory].push(link)
        }

        return acc
      },
      {} as Record<string, LinksApp[]>
    )
}
