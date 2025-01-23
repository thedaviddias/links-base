import { mockLinkData } from '@/features/links/__mocks__/link-data'
import { type LinksApp } from '@/features/links/types/link.types'

import { RECENT_LINKS_LIMIT, getRecentLinks } from '../get-recent-links'

describe('getRecentLinks', () => {
  const mockLinks: LinksApp[] = [
    {
      ...mockLinkData.basic,
      name: 'Link 1',
      timestamp: '2024-03-20T10:00:00Z',
      createdAt: '2024-03-20T10:00:00Z'
    },
    {
      ...mockLinkData.basic,
      name: 'Link 2',
      timestamp: '2024-03-21T10:00:00Z',
      createdAt: '2024-03-21T10:00:00Z'
    },
    {
      ...mockLinkData.withMultipleEnvironments,
      name: 'Link 3',
      timestamp: '2024-03-19T10:00:00Z',
      createdAt: '2024-03-19T10:00:00Z'
    },
    {
      ...mockLinkData.basic,
      name: 'Link 4',
      timestamp: '2024-03-22T10:00:00Z',
      createdAt: '2024-03-22T10:00:00Z'
    },
    {
      ...mockLinkData.withMultipleEnvironments,
      name: 'Link 5',
      timestamp: '2024-03-18T10:00:00Z',
      createdAt: '2024-03-18T10:00:00Z'
    },
    {
      ...mockLinkData.basic,
      name: 'Link 6',
      timestamp: '2024-03-17T10:00:00Z',
      createdAt: '2024-03-17T10:00:00Z'
    }
  ]

  it('getRecentLinks should render correctly', () => {
    const result = getRecentLinks(mockLinks)
    expect(result).toMatchSnapshot()
  })

  it('should return the most recent links limited to RECENT_LINKS_LIMIT', () => {
    const result = getRecentLinks(mockLinks)

    expect(result).toHaveLength(RECENT_LINKS_LIMIT)
    expect(result).toEqual(['Link 4', 'Link 2', 'Link 1', 'Link 3', 'Link 5'])
  })

  it('should return all links when there are fewer than the limit', () => {
    const fewerLinks = mockLinks.slice(0, 3)
    const result = getRecentLinks(fewerLinks)

    expect(result).toHaveLength(3)
    expect(result).toEqual(['Link 2', 'Link 1', 'Link 3'])
  })

  it('should handle empty array', () => {
    const result = getRecentLinks([])

    expect(result).toHaveLength(0)
    expect(result).toEqual([])
  })
})
