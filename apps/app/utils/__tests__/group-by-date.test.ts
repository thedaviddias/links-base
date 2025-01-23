import { groupByDate } from '@/utils/group-by-date'

import { mockLinkData } from '@/features/links/__mocks__/link-data'
import type { LinksApp } from '@/features/links/types/link.types'

const setupTest = (links: LinksApp[] = Object.values(mockLinkData)) => {
  return groupByDate(links)
}

describe('groupByDate', () => {
  // it('should render correctly', () => {
  //   const result = setupTest()
  //   expect(result).toMatchSnapshot()
  // })

  it('should group links by date', () => {
    const result = setupTest()

    const expectedDate = new Date('2024-03-20').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    expect(Object.keys(result)).toHaveLength(1)
    expect(result[expectedDate]).toHaveLength(2)
  })

  it('should handle empty array', () => {
    const result = setupTest([])
    expect(Object.keys(result)).toHaveLength(0)
  })
})
