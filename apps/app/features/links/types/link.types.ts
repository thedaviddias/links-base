import type { LinksApp } from '@/features/links/schemas/link.schema'

export type { LinksApp }

export interface ClickData {
  count: number
  url: string
  environment?: string
  lastClicked?: string
}

export interface LinkClickStore {
  clickCounts: Record<string, ClickData>
  incrementClickCount: (
    linkId: string,
    linkData: { url: string; environment?: string }
  ) => void
  getClickCount: (linkId: string) => number
  resetClickCounts: () => void
}
