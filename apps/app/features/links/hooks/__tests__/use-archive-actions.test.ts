import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { act, renderHook } from '@testing-library/react'

import { useVisibilitySettings } from '../links/use-visibility-settings'
import { useArchiveActions } from '../use-archive-actions'
import { useArchivedLinks } from '../use-archived-links'

// Mock the Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn()
}))

// Mock the custom hooks
jest.mock('../use-archived-links', () => ({
  useArchivedLinks: jest.fn()
}))

jest.mock('../links/use-visibility-settings', () => ({
  useVisibilitySettings: jest.fn()
}))

describe('useArchiveActions', () => {
  const mockPush = jest.fn()
  const mockSetShowArchived = jest.fn()
  const mockToggleArchived = jest.fn()
  const mockIsArchived = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock implementations
    ;(useSearchParams as jest.Mock).mockReturnValue({
      toString: () => ''
    })
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(usePathname as jest.Mock).mockReturnValue('/test-path')
    ;(useVisibilitySettings as jest.Mock).mockReturnValue({
      showArchived: false,
      setShowArchived: mockSetShowArchived
    })
    ;(useArchivedLinks as jest.Mock).mockReturnValue({
      toggleArchived: mockToggleArchived,
      isArchived: mockIsArchived
    })
  })

  it('useArchiveActions should render correctly', () => {
    const { result } = renderHook(() => useArchiveActions())
    expect(result.current).toMatchSnapshot()
  })

  it('should handle toggling archive status when archiving a link', () => {
    mockIsArchived.mockReturnValue(false)
    const { result } = renderHook(() => useArchiveActions())

    act(() => {
      result.current.handleToggleArchived('test-link')
    })

    expect(mockToggleArchived).toHaveBeenCalledWith('test-link')
    expect(mockSetShowArchived).toHaveBeenCalledWith(false)
    expect(mockPush).toHaveBeenCalledWith('/test-path?archived=false')
  })

  it('should handle toggling archive status when unarchiving a link', () => {
    mockIsArchived.mockReturnValue(true)
    const { result } = renderHook(() => useArchiveActions())

    act(() => {
      result.current.handleToggleArchived('test-link')
    })

    expect(mockToggleArchived).toHaveBeenCalledWith('test-link')
    expect(mockSetShowArchived).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should expose the correct properties', () => {
    const { result } = renderHook(() => useArchiveActions())

    expect(result.current).toHaveProperty('showArchived')
    expect(result.current).toHaveProperty('isArchived')
    expect(result.current).toHaveProperty('handleToggleArchived')
  })
})
