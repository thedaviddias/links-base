import { act } from 'react'

import { userEvent } from '@testing-library/user-event'

import { render, screen } from '@/utils/test-utils'

import { useCategories } from '@/features/category/hooks/use-categories'
import { useLinks } from '@/features/links/hooks/links/use-links'

import CategoriesPage from '../page'

// Mock the hooks
jest.mock('@/features/category/hooks/use-categories')
jest.mock('@/features/links/hooks/links/use-links')
jest.mock('@/hooks/use-hotkeys')

const renderComponent = (
  props: Partial<React.ComponentProps<typeof CategoriesPage>> = {}
) => {
  return render(<CategoriesPage {...props} />)
}

describe('CategoriesPage', () => {
  const mockCategories = [
    { name: 'Category 1', icon: 'Folder' },
    { name: 'Category 2', icon: 'Code' }
  ]

  const mockLinks = [
    { name: 'Link 1', category: 'Category 1' },
    { name: 'Link 2', category: 'Category 1' }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useCategories as jest.Mock).mockReturnValue({
      categories: mockCategories,
      uncategorizedCategories: [],
      addCategory: jest.fn(),
      deleteCategory: jest.fn(),
      editCategory: jest.fn()
    })
    ;(useLinks as jest.Mock).mockReturnValue({
      links: mockLinks
    })
  })

  it('should render correctly', () => {
    const { container } = renderComponent()
    expect(container).toMatchSnapshot()
  })

  it('should display the manage categories page with correct title', () => {
    renderComponent()
    expect(screen.getByText('Manage Categories')).toBeInTheDocument()
    expect(
      screen.getByText('Manage categories for your links.')
    ).toBeInTheDocument()
  })

  it('should filter categories based on search term', async () => {
    const user = userEvent.setup()
    renderComponent()

    const searchInput = screen.getByPlaceholderText('Filter categories...')
    await act(async () => {
      await user.type(searchInput, 'Category 1')
    })

    expect(screen.getByText('Category 1')).toBeInTheDocument()
    expect(screen.queryByText('Category 2')).not.toBeInTheDocument()
  })

  it.skip('should handle adding a new category', async () => {
    const mockAddCategory = jest.fn().mockResolvedValue(true)
    ;(useCategories as jest.Mock).mockReturnValue({
      categories: mockCategories,
      uncategorizedCategories: [],
      addCategory: mockAddCategory,
      deleteCategory: jest.fn(),
      editCategory: jest.fn()
    })

    const user = userEvent.setup()
    renderComponent()

    const addButton = screen.getByRole('button', { name: /Add Category/i })
    await act(async () => {
      await user.click(addButton)
    })

    const nameInput = screen.getByTestId('category-name-input')
    await act(async () => {
      await user.type(nameInput, 'New Category')
    })

    const submitButton = screen.getByTestId('category-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(mockAddCategory).toHaveBeenCalledWith({
      name: 'New Category',
      icon: 'Folder'
    })
  })

  it.skip('should handle editing an existing category', async () => {
    const mockEditCategory = jest.fn().mockResolvedValue(true)
    ;(useCategories as jest.Mock).mockReturnValue({
      categories: mockCategories,
      uncategorizedCategories: [],
      addCategory: jest.fn(),
      deleteCategory: jest.fn(),
      editCategory: mockEditCategory
    })

    const user = userEvent.setup()
    renderComponent()

    // Trigger edit action (this would need to be adapted based on your actual UI)
    const editButton = screen.getByRole('button', { name: /edit category 1/i })
    await act(async () => {
      await user.click(editButton)
    })

    const nameInput = screen.getByTestId('category-name-input')
    await act(async () => {
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Category')
    })

    const submitButton = screen.getByTestId('category-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(mockEditCategory).toHaveBeenCalledWith({
      oldName: 'Category 1',
      newCategory: {
        name: 'Updated Category',
        icon: 'Folder'
      }
    })
  })

  it('should prevent duplicate category names', async () => {
    const user = userEvent.setup()
    renderComponent()

    const addButton = screen.getByRole('button', { name: /Add Category/i })
    await act(async () => {
      await user.click(addButton)
    })

    const nameInput = screen.getByTestId('category-name-input')
    await act(async () => {
      await user.type(nameInput, 'Category 1')
    })

    const submitButton = screen.getByTestId('category-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(
      screen.getByText('A category with this name already exists')
    ).toBeInTheDocument()
  })
})
