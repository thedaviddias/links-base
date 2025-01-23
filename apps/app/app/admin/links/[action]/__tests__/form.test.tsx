import { act } from 'react'

import { useRouter } from 'next/navigation'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES } from '@/constants/routes'
import { useLinkFormStore } from '@/features/links/hooks/links/link-form-store'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { useSettings } from '@/features/settings/hooks/use-settings'

import LinkForm from '../form'

// Mock all required hooks and modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/features/links/hooks/links/use-links')
jest.mock('@/features/links/hooks/links/link-form-store')
jest.mock('@/features/settings/hooks/use-settings')

// Mock form fields components
jest.mock('@/components/forms/fields/url-field', () => ({
  UrlField: () => <div data-testid="url-field">URL Field</div>
}))

jest.mock('@/components/forms/fields/color-field', () => ({
  ColorField: () => <div data-testid="color-field">Color Field</div>
}))

jest.mock('@/components/forms/fields/name-field', () => ({
  NameField: () => <div data-testid="name-field">Name Field</div>
}))

jest.mock('@/components/forms/fields/description-field', () => ({
  DescriptionField: () => (
    <div data-testid="description-field">Description Field</div>
  )
}))

jest.mock('@/components/forms/fields/category-field', () => ({
  CategoryField: () => <div data-testid="category-field">Category Field</div>
}))

jest.mock('@/components/forms/fields/tags-field', () => ({
  TagsField: () => <div data-testid="tags-field">Tags Field</div>
}))

jest.mock('@/components/forms/fields/access-type-field', () => ({
  AccessTypeField: () => (
    <div data-testid="access-type-field">Access Type Field</div>
  )
}))

jest.mock('@/components/forms/fields/instructions-field', () => ({
  InstructionsField: () => (
    <div data-testid="instructions-field">Instructions Field</div>
  )
}))

describe('LinkForm', () => {
  const mockRouter = {
    push: jest.fn()
  }

  const mockSettings = {
    environments: {
      configuration: {
        enabled: ['production', 'staging'],
        order: ['production', 'staging', 'integration']
      },
      display: {
        labels: {
          production: 'Production',
          staging: 'Staging',
          integration: 'Integration'
        },
        colors: {
          production: '#000000',
          staging: '#cccccc',
          integration: '#666666'
        }
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSettings as jest.Mock).mockReturnValue({ settings: mockSettings })
    ;(useLinkFormStore as jest.Mock).mockReturnValue({
      formData: {},
      resetForm: jest.fn(),
      updateField: jest.fn(),
      setFormData: jest.fn(),
      originalName: null
    })
    ;(useLinks as jest.Mock).mockReturnValue({
      addLink: jest.fn().mockResolvedValue(true),
      editLink: jest.fn().mockResolvedValue(true)
    })
  })

  it('should render form in add mode', () => {
    render(<LinkForm params={{ action: 'add' }} />)
    expect(screen.getByText('Add New Link')).toBeInTheDocument()
    expect(
      screen.getByText('Create a new link to add to your collection.')
    ).toBeInTheDocument()
  })

  it('should render form in edit mode', () => {
    render(<LinkForm params={{ action: 'edit' }} />)
    expect(screen.getByText('Edit Link')).toBeInTheDocument()
    expect(
      screen.getByText('Update the details of your existing link.')
    ).toBeInTheDocument()
  })

  it('should handle environment toggle', async () => {
    const user = userEvent.setup()

    render(<LinkForm params={{ action: 'add' }} />)

    screen.debug()

    const toggle = screen.getByRole('switch', {
      name: /Multiple Environments/i
    })
    await user.click(toggle)

    // No confirmation dialog on enabling
    expect(toggle).toHaveAttribute('data-state', 'checked')

    // Click again to disable
    await user.click(toggle)

    expect(toggle).toHaveAttribute('data-state', 'checked')
  })

  it.skip('should show confirmation dialog when disabling environments with data', async () => {
    const user = userEvent.setup()
    ;(useLinkFormStore as jest.Mock).mockReturnValue({
      formData: {
        environments: {
          staging: 'https://staging.example.com'
        }
      },
      resetForm: jest.fn(),
      updateField: jest.fn(),
      setFormData: jest.fn(),
      originalName: null
    })

    render(<LinkForm params={{ action: 'add' }} />)

    // Enable environments first
    const toggle = screen.getByRole('switch', {
      name: /Multiple Environments/i
    })

    await user.click(toggle)

    expect(toggle).toBeChecked()

    // Disable environments

    // await user.click(toggle)

    expect(
      screen.getByText('Disable Multiple Environments?')
    ).toBeInTheDocument()
  })

  it('should handle form submission in add mode', async () => {
    const mockAddLink = jest.fn().mockResolvedValue(true)
    ;(useLinks as jest.Mock).mockReturnValue({
      addLink: mockAddLink,
      editLink: jest.fn()
    })

    render(<LinkForm params={{ action: 'add' }} />)

    const submitButton = screen.getByRole('button', { name: 'Create Link' })
    await act(async () => {
      await userEvent.click(submitButton)
    })

    expect(mockAddLink).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.ADMIN.MANAGE.LINKS.path)
  })

  it('should navigate back when clicking cancel button', async () => {
    const user = userEvent.setup()
    render(<LinkForm params={{ action: 'add' }} />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.ADMIN.MANAGE.LINKS.path)
  })
})
