import { type LinksApp } from '@/features/links/types/link.types'

export const RECENT_LINKS_LIMIT = 5

export function getRecentLinks(links: LinksApp[]) {
  return [...links]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, RECENT_LINKS_LIMIT)
    .map(link => link.name)
}
