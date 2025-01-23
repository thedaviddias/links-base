import { mockLinkData } from '@/features/links/__mocks__/link-data'
import { type Category } from '@/features/links/types/category.types'
import { type LinksApp } from '@/features/links/types/link.types'

import { calculateLinkCounts } from '../calculate-link-counts'

describe('calculateLinkCounts', () => {
  const mockCategories: Category[] = [
    { name: 'Category 1', icon: 'code' },
    { name: 'Category 2', icon: 'palette' }
  ]

  const mockLinks: LinksApp[] = [
    {
      ...mockLinkData.basic,
      name: 'Link 1',
      category: 'Category 1'
    },
    {
      ...mockLinkData.basic,
      name: 'Link 2',
      category: 'Category 1'
    },
    {
      ...mockLinkData.withMultipleEnvironments,
      name: 'Link 3',
      category: 'Category 2'
    }
  ]

  it('calculateLinkCounts should render correctly', () => {
    const result = calculateLinkCounts(mockCategories, mockLinks)
    expect(result).toBeDefined()
  })

  it('should correctly count links for each category', () => {
    const result = calculateLinkCounts(mockCategories, mockLinks)

    expect(result.get('Category 1')).toBe(2)
    expect(result.get('Category 2')).toBe(1)
  })

  it('should initialize all categories with zero counts', () => {
    const result = calculateLinkCounts(mockCategories, [])

    mockCategories.forEach(category => {
      expect(result.get(category.name)).toBe(0)
    })
  })

  it('should ignore links with non-existent categories', () => {
    const linksWithInvalidCategory = [
      ...mockLinks,
      {
        ...mockLinkData.basic,
        name: 'Invalid Link',
        category: 'NonExistent'
      }
    ]

    const result = calculateLinkCounts(mockCategories, linksWithInvalidCategory)

    expect(result.get('Category 1')).toBe(2)
    expect(result.get('Category 2')).toBe(1)
    expect(result.get('NonExistent')).toBeUndefined()
  })
})
