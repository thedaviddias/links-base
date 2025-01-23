import { type LinksApp } from '@/features/links/types/link.types'

/**
 * Groups links by date
 * @param links - Links to group
 * @returns Object with date strings as keys and arrays of links as values
 */
export function groupByDate(links: LinksApp[]) {
  return links.reduce(
    (groups, link) => {
      const date = new Date(link.timestamp ?? '')
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      if (!groups[dateStr]) {
        groups[dateStr] = []
      }

      groups[dateStr].push(link)
      return groups
    },
    {} as Record<string, LinksApp[]>
  )
}
