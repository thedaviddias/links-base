import { act } from 'react'

import { userEvent } from '@testing-library/user-event'

import { render, screen } from '@/utils/test-utils'

import { TagModal } from '../tag-modal'

const renderComponent = (
  props: Partial<React.ComponentProps<typeof TagModal>> = {}
) => {
  return render(
    <TagModal
      onSubmit={jest.fn()}
      trigger={
        <button type="button" aria-label="Open Modal">
          Open Modal
        </button>
      }
      {...props}
    />
  )
}

describe('TagModal', () => {
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

    expect(screen.getByRole('heading', { name: 'Add Tag' })).toBeInTheDocument()
    expect(screen.getByText('Add a new tag.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add tag/i })).toBeInTheDocument()
  })

  it('should reset form when dialog is closed', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Type in the input
    const input = screen.getByPlaceholderText('Enter tag name...')
    await act(async () => {
      await user.type(input, 'Test Tag')
    })

    // Close modal using ESC key
    await act(async () => {
      await user.keyboard('{Escape}')
    })

    // Wait for a moment to allow state updates to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Reopen modal
    await act(async () => {
      await user.click(trigger)
    })

    const newInput = screen.getByPlaceholderText('Enter tag name...')
    expect(newInput).toHaveValue('')
  })

  it('should display edit mode content when mode is edit', async () => {
    const initialValues = { name: 'Test Tag' }
    renderComponent({ mode: 'edit', initialValues })

    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await userEvent.click(trigger)
    })

    expect(
      screen.getByRole('heading', { name: 'Edit Tag' })
    ).toBeInTheDocument()
    expect(screen.getByText('Edit an existing tag.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeInTheDocument()
  })

  it('should populate form with initial values in edit mode', async () => {
    const initialValues = { name: 'Test Tag' }
    renderComponent({ mode: 'edit', initialValues })

    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await userEvent.click(trigger)
    })

    const input = screen.getByPlaceholderText('Enter tag name...')
    expect(input).toHaveValue('Test Tag')
  })

  it('should call onSubmit with form values when submitted', async () => {
    const onSubmit = jest.fn()
    const user = userEvent.setup()
    renderComponent({ onSubmit })

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Fill and submit form
    const input = screen.getByPlaceholderText('Enter tag name...')
    await act(async () => {
      await user.type(input, 'New Tag')
    })

    const submitButton = screen.getByRole('button', { name: /add tag/i })
    await act(async () => {
      await user.click(submitButton)
    })

    expect(onSubmit).toHaveBeenCalledWith({ name: 'New Tag' })
  })

  it('should show loading state during submission', async () => {
    const onSubmit = jest.fn(
      () =>
        new Promise<boolean>(resolve => setTimeout(() => resolve(true), 100))
    )
    const user = userEvent.setup()
    renderComponent({ onSubmit })

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Submit form
    const input = screen.getByPlaceholderText('Enter tag name...')
    await act(async () => {
      await user.type(input, 'New Tag')
    })

    const submitButton = screen.getByRole('button', { name: /add tag/i })
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

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /add tag/i })
    await act(async () => {
      await user.click(submitButton)
    })

    expect(
      screen.getByText('Tag must be at least 2 characters.')
    ).toBeInTheDocument()
  })

  it('should show validation error for invalid tag names', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Type invalid input (single character)
    const input = screen.getByPlaceholderText('Enter tag name...')
    await act(async () => {
      await user.type(input, 'a')
    })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add tag/i })
    await act(async () => {
      await user.click(submitButton)
    })

    expect(
      screen.getByText('Tag must be at least 2 characters.')
    ).toBeInTheDocument()
  })

  it('should handle error from onSubmit', async () => {
    const onSubmit = jest
      .fn()
      .mockRejectedValue(new Error('Tag already exists')) as jest.Mock<
      Promise<boolean>
    >
    const user = userEvent.setup()
    renderComponent({ onSubmit })

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Fill and submit form
    const input = screen.getByPlaceholderText('Enter tag name...')
    await act(async () => {
      await user.type(input, 'Test Tag')
    })

    const submitButton = screen.getByRole('button', { name: /add tag/i })
    await act(async () => {
      await user.click(submitButton)
    })

    expect(screen.getByText('Tag already exists')).toBeInTheDocument()
  })

  it('should call onOpenChange when dialog is opened', async () => {
    const onOpenChange = jest.fn()
    const user = userEvent.setup()
    renderComponent({ onOpenChange })

    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('should call onOpenChange when dialog is closed', async () => {
    const onOpenChange = jest.fn()
    const user = userEvent.setup()
    renderComponent({ onOpenChange })

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    // Close modal
    await act(async () => {
      await user.keyboard('{Escape}')
    })

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('should show edit mode loading text when submitting in edit mode', async () => {
    const onSubmit = jest.fn(
      () =>
        new Promise<boolean>(resolve => setTimeout(() => resolve(true), 100))
    )
    const user = userEvent.setup()
    renderComponent({
      mode: 'edit',
      onSubmit,
      initialValues: { name: 'Test Tag' }
    })

    // Open modal
    const trigger = screen.getByRole('button', { name: 'Open Modal' })
    await act(async () => {
      await user.click(trigger)
    })

    const submitButton = screen.getByRole('button', { name: /save changes/i })
    await act(async () => {
      await user.click(submitButton)
    })

    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })
})
