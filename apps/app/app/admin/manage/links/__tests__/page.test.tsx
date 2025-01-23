import { act } from 'react'

import userEvent from '@testing-library/user-event'

import { render, screen } from '@/utils/test-utils'

import { useCategories } from '@/features/category/hooks/use-categories'
import { useLinksImportExport } from '@/features/data-manager/hooks/use-links-import-export'
import { mockLinkData } from '@/features/links/__mocks__/link-data'
import { useLinks } from '@/features/links/hooks/links/use-links'

import AdminManagePage from '../page'

// Mock all required hooks
jest.mock('@/features/category/hooks/use-categories')
jest.mock('@/features/links/hooks/links/use-links')
jest.mock('@/features/data-manager/hooks/use-links-import-export')
jest.mock('@/hooks/use-hotkeys')

const renderComponent = (
  props: Partial<React.ComponentProps<typeof AdminManagePage>> = {}
) => {
  return render(<AdminManagePage {...props} />)
}

describe('AdminManagePage', () => {
  const mockCategories = [
    { name: 'Category 1', icon: 'Folder' },
    { name: 'Category 2', icon: 'Code' }
  ]

  const mockLinks = Object.values(mockLinkData)

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useCategories as jest.Mock).mockReturnValue({
      categories: mockCategories
    })
    ;(useLinks as jest.Mock).mockReturnValue({
      links: mockLinks,
      deleteLink: jest.fn(),
      editLink: jest.fn(),
      addLink: jest.fn()
    })
    ;(useLinksImportExport as jest.Mock).mockReturnValue({
      setImportType: jest.fn(),
      handleExport: jest.fn()
    })
  })

  it('should render correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should display the manage links page with correct title', () => {
    renderComponent()
    expect(screen.getByText('Manage Links')).toBeInTheDocument()
    expect(screen.getByText('Manage your internal links.')).toBeInTheDocument()
  })

  it('should filter links based on search term', async () => {
    const user = userEvent.setup()
    renderComponent()

    const searchInput = screen.getByPlaceholderText('Search links...')
    await act(async () => {
      await user.type(searchInput, 'Test App')
    })

    expect(screen.getByText('Test App')).toBeInTheDocument()
    expect(screen.queryByText('Multi Env App')).not.toBeInTheDocument()
  })

  it.skip('should handle link filters correctly', async () => {
    const user = userEvent.setup()
    renderComponent()

    const filterButton = screen.getByRole('button', { name: /Filter/i })
    await act(async () => {
      await user.click(filterButton)
    })

    // Click the "Recent" filter
    const recentFilter = screen.getByRole('checkbox', { name: /Recent/i })
    await act(async () => {
      await user.click(recentFilter)
    })

    // Verify filter count is displayed
    expect(screen.getByText('Filter (1)')).toBeInTheDocument()
  })

  it.skip('should handle adding a new link', async () => {
    const mockAddLink = jest.fn().mockResolvedValue(true)
    ;(useLinks as jest.Mock).mockReturnValue({
      links: mockLinks,
      addLink: mockAddLink,
      deleteLink: jest.fn(),
      editLink: jest.fn()
    })

    const user = userEvent.setup()
    renderComponent()

    // Open add modal
    const addButton = screen.getByRole('button', { name: /Add Link/i })
    await act(async () => {
      await user.click(addButton)
    })

    // Fill form
    const nameInput = screen.getByPlaceholderText('Enter link name...')
    const urlInput = screen.getByPlaceholderText('Enter production URL...')

    await act(async () => {
      await user.type(nameInput, 'New Link')
      await user.type(urlInput, 'https://example.com')
    })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add link/i })
    await act(async () => {
      await user.click(submitButton)
    })

    expect(mockAddLink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Link',
        environments: {
          production: 'https://example.com',
          staging: '',
          integration: ''
        }
      })
    )
  })

  it('should handle editing an existing link', async () => {
    const mockEditLink = jest.fn().mockResolvedValue(true)
    ;(useLinks as jest.Mock).mockReturnValue({
      links: mockLinks,
      editLink: mockEditLink,
      deleteLink: jest.fn(),
      addLink: jest.fn()
    })

    const user = userEvent.setup()
    renderComponent()

    // Find and click edit button for first link
    const editButton = screen.getAllByRole('button', { name: /Edit/i })[0]
    await act(async () => {
      await user.click(editButton)
    })

    // Modify link name
    const nameInput = screen.getByDisplayValue(mockLinks[0].name)
    await act(async () => {
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Link')
    })

    // Submit changes
    const saveButton = screen.getByRole('button', { name: /Save changes/i })
    await act(async () => {
      await user.click(saveButton)
    })

    expect(mockEditLink).toHaveBeenCalledWith(
      mockLinks[0].name,
      expect.objectContaining({
        name: 'Updated Link'
      })
    )
  })

  it.skip('should handle deleting a link', async () => {
    const mockDeleteLink = jest.fn().mockResolvedValue(true)
    ;(useLinks as jest.Mock).mockReturnValue({
      links: mockLinks,
      deleteLink: mockDeleteLink,
      editLink: jest.fn(),
      addLink: jest.fn()
    })

    const user = userEvent.setup()
    renderComponent()

    // Find and click delete button for first link
    const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0]
    await act(async () => {
      await user.click(deleteButton)
    })

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Confirm/i })
    await act(async () => {
      await user.click(confirmButton)
    })

    expect(mockDeleteLink).toHaveBeenCalledWith(mockLinks[0].name)
  })
})
