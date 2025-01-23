import { mockLinkData } from '@/features/links/__mocks__/link-data'
import { type LinksApp } from '@/features/links/types/link.types'

import { reorder } from '../reorder'

describe('reorder', () => {
  // Create an array from the mock data
  const mockLinks: LinksApp[] = Object.values(mockLinkData)

  it('reorder should render correctly', () => {
    const result = reorder(mockLinks, 0, 1)
    expect(result).toMatchSnapshot()
  })

  it('should move an item from first to second position', () => {
    const result = reorder(mockLinks, 0, 1)
    expect(result[1]).toEqual(mockLinks[0])
    expect(result).toHaveLength(mockLinks.length)
  })

  it('should move an item from second to first position', () => {
    const result = reorder(mockLinks, 1, 0)
    expect(result[0]).toEqual(mockLinks[1])
    expect(result).toHaveLength(mockLinks.length)
  })

  it('should not modify the original array', () => {
    const originalArray = [...mockLinks]
    reorder(mockLinks, 0, 1)
    expect(mockLinks).toEqual(originalArray)
  })

  it('should handle same start and end index', () => {
    const result = reorder(mockLinks, 1, 1)
    expect(result).toEqual(mockLinks)
  })
})
