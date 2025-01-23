import { act } from 'react'

import { userEvent } from '@testing-library/user-event'

import { useHotkeys } from '@/hooks/use-hotkeys'

import { render, screen } from '@/utils/test-utils'

import { useLinks } from '@/features/links/hooks/links/use-links'
import { useTags } from '@/features/links/hooks/tags/use-tags'

import ManageTags from '../page'

// Mock the hooks
jest.mock('@/features/links/hooks/tags/use-tags')
jest.mock('@/features/links/hooks/links/use-links')
jest.mock('@/hooks/use-hotkeys')

const renderComponent = (
  props: Partial<React.ComponentProps<typeof ManageTags>> = {}
) => {
  return render(<ManageTags {...props} />)
}

describe('ManageTags', () => {
  const mockTags = [{ name: 'Tag 1' }, { name: 'Tag 2' }]

  const mockLinks = [
    { name: 'Link 1', tags: ['Tag 1'] },
    { name: 'Link 2', tags: ['Tag 1'] }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTags as jest.Mock).mockReturnValue({
      tags: mockTags,
      deleteTag: jest.fn(),
      editTag: jest.fn(),
      addTag: jest.fn()
    })
    ;(useLinks as jest.Mock).mockReturnValue({
      links: mockLinks
    })
    ;(useHotkeys as jest.Mock).mockImplementation((key, callback) => {})
  })

  it('should render correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should display the manage tags page with correct title', () => {
    renderComponent()
    expect(screen.getByText('Manage Tags')).toBeInTheDocument()
    expect(screen.getByText('Manage tags for your links.')).toBeInTheDocument()
  })

  it('should filter tags based on search term', async () => {
    const user = userEvent.setup()
    renderComponent()

    const searchInput = screen.getByPlaceholderText('Filter tags...')
    await act(async () => {
      await user.type(searchInput, 'Tag 1')
    })

    expect(screen.getByText('Tag 1')).toBeInTheDocument()
    expect(screen.queryByText('Tag 2')).not.toBeInTheDocument()
  })

  it.skip('should handle adding a new tag', async () => {
    const mockAddTag = jest.fn().mockResolvedValue(true)
    ;(useTags as jest.Mock).mockReturnValue({
      tags: mockTags,
      addTag: mockAddTag,
      deleteTag: jest.fn(),
      editTag: jest.fn()
    })

    const user = userEvent.setup()
    renderComponent()

    const addButton = screen.getByRole('button', { name: /Add Tag/i })
    await act(async () => {
      await user.click(addButton)
    })

    const nameInput = screen.getByTestId('tag-name-input')
    await act(async () => {
      await user.type(nameInput, 'New Tag')
    })

    const submitButton = screen.getByTestId('tag-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(mockAddTag).toHaveBeenCalledWith({
      name: 'New Tag'
    })
  })

  it.skip('should handle editing an existing tag', async () => {
    const mockEditTag = jest.fn().mockResolvedValue(true)
    ;(useTags as jest.Mock).mockReturnValue({
      tags: mockTags,
      addTag: jest.fn(),
      deleteTag: jest.fn(),
      editTag: mockEditTag
    })

    const user = userEvent.setup()
    renderComponent()

    const editButton = screen.getByRole('button', { name: /edit tag 1/i })
    await act(async () => {
      await user.click(editButton)
    })

    const nameInput = screen.getByTestId('tag-name-input')
    await act(async () => {
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Tag')
    })

    const submitButton = screen.getByTestId('tag-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(mockEditTag).toHaveBeenCalledWith('Tag 1', {
      name: 'Updated Tag'
    })
  })

  it.skip('should prevent duplicate tag names', async () => {
    const user = userEvent.setup()
    renderComponent()

    const addButton = screen.getByRole('button', { name: /Add Tag/i })
    await act(async () => {
      await user.click(addButton)
    })

    const nameInput = screen.getByTestId('tag-name-input')
    await act(async () => {
      await user.type(nameInput, 'Tag 1')
    })

    const submitButton = screen.getByTestId('tag-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(
      screen.getByText('A tag with this name already exists')
    ).toBeInTheDocument()
  })

  it.skip('should handle deleting a tag', async () => {
    const mockDeleteTag = jest.fn().mockResolvedValue(true)
    ;(useTags as jest.Mock).mockReturnValue({
      tags: mockTags,
      addTag: jest.fn(),
      deleteTag: mockDeleteTag,
      editTag: jest.fn()
    })

    const user = userEvent.setup()
    renderComponent()

    const deleteButton = screen.getByRole('button', { name: /delete tag 1/i })
    await act(async () => {
      await user.click(deleteButton)
    })

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await act(async () => {
      await user.click(confirmButton)
    })

    expect(mockDeleteTag).toHaveBeenCalledWith('Tag 1')
  })
})
