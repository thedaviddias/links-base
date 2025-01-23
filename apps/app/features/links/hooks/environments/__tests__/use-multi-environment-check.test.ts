import { renderHook } from '@testing-library/react'

import { useMultiEnvironmentCheck } from '@/features/links/hooks/environments/use-multi-environment-check'
import { useLinks } from '@/features/links/hooks/links/use-links'

// Mock the useLinks hook
jest.mock('@/features/links/hooks/links/use-links', () => ({
  useLinks: jest.fn()
}))

describe('useMultiEnvironmentCheck', () => {
  const mockLinks = [
    {
      name: 'Production Only',
      environments: {
        production: 'https://prod.example.com'
      }
    },
    {
      name: 'With Staging',
      environments: {
        production: 'https://prod.example.com',
        staging: 'https://staging.example.com'
      }
    },
    {
      name: 'With Integration',
      environments: {
        production: 'https://prod.example.com',
        integration: 'https://int.example.com'
      }
    },
    {
      name: 'All Environments',
      environments: {
        production: 'https://prod.example.com',
        staging: 'https://staging.example.com',
        integration: 'https://int.example.com'
      }
    }
  ]

  beforeEach(() => {
    ;(useLinks as jest.Mock).mockReturnValue({ links: mockLinks })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return false when no links have multiple environments', () => {
    ;(useLinks as jest.Mock).mockReturnValue({
      links: [
        {
          name: 'Production Only',
          environments: {
            production: 'https://prod.example.com'
          }
        }
      ]
    })

    const { result } = renderHook(() => useMultiEnvironmentCheck())
    expect(result.current.hasMultipleEnvironments).toBe(false)
  })

  it('should return true when at least one link has staging environment', () => {
    ;(useLinks as jest.Mock).mockReturnValue({
      links: [
        {
          name: 'With Staging',
          environments: {
            production: 'https://prod.example.com',
            staging: 'https://staging.example.com'
          }
        }
      ]
    })

    const { result } = renderHook(() => useMultiEnvironmentCheck())
    expect(result.current.hasMultipleEnvironments).toBe(true)
  })

  it('should return true when at least one link has integration environment', () => {
    ;(useLinks as jest.Mock).mockReturnValue({
      links: [
        {
          name: 'With Integration',
          environments: {
            production: 'https://prod.example.com',
            integration: 'https://int.example.com'
          }
        }
      ]
    })

    const { result } = renderHook(() => useMultiEnvironmentCheck())
    expect(result.current.hasMultipleEnvironments).toBe(true)
  })

  it('should filter links by category when categoryId is provided', () => {
    const linksWithCategory = [
      {
        name: 'Production Only',
        category: 'category1',
        environments: {
          production: 'https://prod.example.com'
        }
      },
      {
        name: 'With Staging',
        category: 'category2',
        environments: {
          production: 'https://prod.example.com',
          staging: 'https://staging.example.com'
        }
      }
    ]
    ;(useLinks as jest.Mock).mockReturnValue({ links: linksWithCategory })

    // Test category1 (should be false - only production)
    const { result: result1 } = renderHook(() =>
      useMultiEnvironmentCheck('category1')
    )
    expect(result1.current.hasMultipleEnvironments).toBe(false)

    // Test category2 (should be true - has staging)
    const { result: result2 } = renderHook(() =>
      useMultiEnvironmentCheck('category2')
    )
    expect(result2.current.hasMultipleEnvironments).toBe(true)
  })

  it('should handle undefined environments object', () => {
    ;(useLinks as jest.Mock).mockReturnValue({
      links: [
        {
          name: 'No Environments',
          environments: undefined
        }
      ]
    })

    const { result } = renderHook(() => useMultiEnvironmentCheck())
    expect(result.current.hasMultipleEnvironments).toBe(false)
  })

  it('should handle empty environments object', () => {
    ;(useLinks as jest.Mock).mockReturnValue({
      links: [
        {
          name: 'Empty Environments',
          environments: {}
        }
      ]
    })

    const { result } = renderHook(() => useMultiEnvironmentCheck())
    expect(result.current.hasMultipleEnvironments).toBe(false)
  })
})
