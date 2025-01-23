import { act } from 'react'

import { userEvent } from '@testing-library/user-event'

import { render, screen } from '@/utils/test-utils'

import { CategoryModal } from '../category-modal'

const renderComponent = (
  props: Partial<React.ComponentProps<typeof CategoryModal>> = {}
) => {
  return render(
    <CategoryModal
      onSubmit={async () => true}
      trigger={
        <button type="button" aria-label="Open Modal">
          Open Modal
        </button>
      }
      {...props}
    />
  )
}

describe('CategoryModal', () => {
  it('should render correctly', async () => {
    renderComponent()

    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await userEvent.click(trigger)
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should not render when mode is add and no trigger is provided', () => {
    renderComponent({ trigger: undefined })

    const dialog = screen.queryByRole('dialog')
    expect(dialog).not.toBeInTheDocument()
  })

  it('should display add mode content by default', async () => {
    renderComponent()
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await userEvent.click(trigger)
    })

    expect(
      screen.getByRole('heading', { name: 'Add Category' })
    ).toBeInTheDocument()
    expect(screen.getByText('Add a new category.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add category/i })
    ).toBeInTheDocument()
  })

  it('should reset form when dialog is closed', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Type in the inputs
    const nameInput = screen.getByTestId('category-name-input')
    const descriptionInput = screen.getByPlaceholderText(
      'Describe this category in a few words...'
    )

    await act(async () => {
      await user.type(nameInput, 'Test Category')
      await user.type(descriptionInput, 'Test Description')
    })

    // Close modal using ESC key
    await act(async () => {
      await user.keyboard('{Escape}')
    })

    // Wait for state updates
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Reopen modal
    await act(async () => {
      await user.click(trigger)
    })

    const newNameInput = screen.getByTestId('category-name-input')
    const newDescriptionInput = screen.getByPlaceholderText(
      'Describe this category in a few words...'
    )
    expect(newNameInput).toHaveValue('')
    expect(newDescriptionInput).toHaveValue('')
  })

  it('should display edit mode content when mode is edit', async () => {
    const user = userEvent.setup()

    const initialValues = {
      name: 'Test Category',
      description: 'Test Description',
      icon: 'Folder'
    }
    renderComponent({ mode: 'edit', initialValues })

    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    expect(
      screen.getByRole('heading', { name: 'Edit Category' })
    ).toBeInTheDocument()
    expect(screen.getByText('Edit an existing category.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeInTheDocument()
  })

  it('should call onSubmit with form values when submitted', async () => {
    const onSubmit = jest.fn().mockResolvedValue(true)
    const user = userEvent.setup()
    renderComponent({ onSubmit })

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Fill form
    const nameInput = screen.getByTestId('category-name-input')
    const descriptionInput = screen.getByPlaceholderText(
      'Describe this category in a few words...'
    )

    await act(async () => {
      await user.type(nameInput, 'New Category')
      await user.type(descriptionInput, 'New Description')
    })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add category/i })
    await act(async () => {
      await user.click(submitButton)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'New Category',
      description: 'New Description',
      icon: 'Folder'
    })
  })

  it('should show loading state during submission', async () => {
    const onSubmit = jest.fn(
      () =>
        new Promise<boolean>(resolve => setTimeout(() => resolve(true), 100))
    )
    const user = userEvent.setup()
    renderComponent({ onSubmit })

    // Open and submit
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    const nameInput = screen.getByTestId('category-name-input')
    await act(async () => {
      await user.type(nameInput, 'Test Category')
    })

    const submitButton = screen.getByTestId('category-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(screen.getByText('Adding...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('should handle validation errors', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Submit empty form
    const submitButton = screen.getByTestId('category-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(
      screen.getByText('Category name must be at least 2 characters.')
    ).toBeInTheDocument()
  })

  it('should handle error from onSubmit', async () => {
    const onSubmit = jest
      .fn()
      .mockRejectedValue(new Error('Category already exists'))
    const user = userEvent.setup()
    renderComponent({ onSubmit })

    // Open and submit
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    const nameInput = screen.getByTestId('category-name-input')
    await act(async () => {
      await user.type(nameInput, 'Test Category')
    })

    const submitButton = screen.getByTestId('category-submit-button')
    await act(async () => {
      await user.click(submitButton)
    })

    expect(screen.getByText('Category already exists')).toBeInTheDocument()
  })
})
