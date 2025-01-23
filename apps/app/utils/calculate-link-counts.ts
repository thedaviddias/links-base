import { type Category } from '@/features/links/types/category.types'
import { type LinksApp } from '@/features/links/types/link.types'

/**
 * Calculate the number of links for each category
 * @param categories - The categories to calculate the link counts for
 * @param links - The links to calculate the link counts for
 * @returns A map of category names to the number of links for that category
 */
export const calculateLinkCounts = (
  categories: Category[],
  links: LinksApp[]
) => {
  const counts = new Map<string, number>()

  // Initialize counts for all categories
  categories.forEach(category => {
    counts.set(category.name, 0)
  })

  // Count links for each category
  links.forEach(link => {
    const category = link.category

    if (counts.has(category)) {
      const currentCount = counts.get(category) || 0
      counts.set(category, currentCount + 1)
    }
  })

  return counts
}
